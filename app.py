from flask import Flask, render_template, request, jsonify
from transformers import pipeline
from dotenv import load_dotenv
from datetime import datetime, timezone
from pymongo import MongoClient
import os

# ---------------------------------------------------
# Load environment variables from .env file
# ---------------------------------------------------
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev-fallback-secret-key")

# ---------------------------------------------------
# Load the pre-trained sentiment analysis model
# cardiffnlp/twitter-roberta-base-sentiment-latest
# Outputs 3 classes: positive, negative, neutral
# (downloads automatically on first run ~500MB)
# ---------------------------------------------------
print("Loading sentiment model... (this may take a minute on first run)")
sentiment_model = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest",
    top_k=None  # Always return all labels so we can build breakdowns
)
print("Sentiment model loaded successfully!")

# ---------------------------------------------------
# Load the emotion detection model
# j-hartmann/emotion-english-distilroberta-base
# Outputs 7 emotions: anger, disgust, fear, joy,
#                      neutral, sadness, surprise
# (downloads automatically on first run ~330MB)
# ---------------------------------------------------
DISABLE_EMOTION = os.getenv("DISABLE_EMOTION", "False") == "True"

if not DISABLE_EMOTION:
    print("Loading emotion model...")
    emotion_model = pipeline(
        "text-classification",
        model="j-hartmann/emotion-english-distilroberta-base",
        top_k=None  # Return all 7 emotion scores
    )
    print("Emotion model loaded successfully!")
else:
    print("Emotion model disabled via DISABLE_EMOTION var (saves ~330MB RAM).")
    emotion_model = None

# ---------------------------------------------------
# MongoDB setup (falls back to in-memory if no MongoDB)
# Uses MONGO_URI from environment for flexible deployment
# ---------------------------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
USE_MONGO = False
history = []  # In-memory fallback

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    client.server_info()
    db = client["sentiment_db"]
    collection = db["analyses"]
    USE_MONGO = True
    print("Connected to MongoDB!")
except Exception:
    print("MongoDB not found — using in-memory storage instead.")


# ---------------------------------------------------
# Helper functions
# ---------------------------------------------------

def classify_sentiment(label):
    """
    Map the RoBERTa Twitter model output label to a
    human-readable sentiment string and corresponding emoji.

    The model outputs lowercase labels: 'positive', 'negative', 'neutral'.
    We capitalize them and assign an emoji.

    Returns:
        tuple: (sentiment: str, emoji: str)
    """
    mapping = {
        "positive": ("Positive", "😊"),
        "negative": ("Negative", "😞"),
        "neutral":  ("Neutral",  "😐"),
    }
    return mapping.get(label.lower(), ("Neutral", "😐"))


def build_breakdown(sentiment_scores):
    """
    Build a percentage breakdown dict from the sentiment model's output.

    Args:
        sentiment_scores: List of dicts with 'label' and 'score' keys
                          returned by the sentiment model (top_k=None).

    Returns:
        dict: e.g. {"Positive": 85.23, "Negative": 10.45, "Neutral": 4.32}
    """
    breakdown = {}
    for item in sentiment_scores:
        sentiment, _ = classify_sentiment(item["label"])
        breakdown[sentiment] = round(item["score"] * 100, 2)
    return breakdown


def build_emotions(emotion_scores):
    """
    Build a percentage breakdown dict from the emotion model's output.

    Args:
        emotion_scores: List of dicts with 'label' and 'score' keys
                        returned by the emotion model (top_k=None).

    Returns:
        dict: e.g. {"joy": 72.1, "anger": 3.5, ...} (all 7 emotions)
    """
    return {item["label"]: round(item["score"] * 100, 2) for item in emotion_scores}


def save_result(text, label, score):
    """Save a result to MongoDB or in-memory list."""
    entry = {
        "text": text,
        "label": label,
        "score": round(score * 100, 2),
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    }
    if USE_MONGO:
        collection.insert_one(entry)
        entry.pop("_id", None)
    else:
        history.append(entry)
    return entry


def get_history(limit=10):
    """Retrieve the last N results."""
    if USE_MONGO:
        results = list(collection.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
        return results
    else:
        return list(reversed(history[-limit:]))


# ---------------------------------------------------
# Routes
# ---------------------------------------------------

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Analyze a single text input.

    Uses the RoBERTa Twitter model for 3-class sentiment (with full
    breakdown) and the DistilRoBERTa emotion model for 7-class emotions.

    Returns JSON with: sentiment, emoji, score, text, timestamp,
                       breakdown (3 sentiments), emotions (7 emotions)
    """
    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400
    if len(text) > 1000:
        return jsonify({"error": "Text too long (max 1000 characters)"}), 400

    # Run sentiment model — returns list of all 3 label scores
    sentiment_scores = sentiment_model(text)[0]

    # Determine the top sentiment (highest score)
    top = max(sentiment_scores, key=lambda x: x["score"])
    sentiment, emoji = classify_sentiment(top["label"])
    score = top["score"]

    # Run emotion model
    if emotion_model:
        emotion_scores = emotion_model(text)[0]
        emotions = build_emotions(emotion_scores)
    else:
        emotions = {"Disabled (Low Memory)": 0.0}

    # Build percentage breakdowns
    breakdown = build_breakdown(sentiment_scores)

    # Persist the result
    entry = save_result(text, sentiment, score)

    return jsonify({
        "sentiment": sentiment,
        "emoji": emoji,
        "score": round(score * 100, 2),
        "text": text,
        "timestamp": entry["timestamp"],
        "breakdown": breakdown,
        "emotions": emotions,
    })


@app.route("/analyze-bulk", methods=["POST"])
def analyze_bulk():
    """
    Analyze multiple texts at once.

    Each text is validated for length (max 1000 chars).
    Returns per-text sentiment, emoji, score, breakdown, and emotions,
    plus a summary of sentiment counts.
    """
    data = request.get_json()
    texts = data.get("texts", [])

    if not texts or len(texts) > 20:
        return jsonify({"error": "Provide 1–20 texts"}), 400

    results = []
    for text in texts:
        text = text.strip()
        if not text:
            continue

        # Per-text length validation
        if len(text) > 1000:
            results.append({
                "text": text[:50] + "..." if len(text) > 50 else text,
                "error": "Text too long (max 1000 characters)"
            })
            continue

        # Run sentiment model
        sentiment_scores = sentiment_model(text)[0]
        top = max(sentiment_scores, key=lambda x: x["score"])
        sentiment, emoji = classify_sentiment(top["label"])
        score = top["score"]

        # Run emotion model
        if emotion_model:
            emotion_scores = emotion_model(text)[0]
            emotions = build_emotions(emotion_scores)
        else:
            emotions = {"Disabled (Low Memory)": 0.0}

        # Build breakdowns
        breakdown = build_breakdown(sentiment_scores)

        # Persist the result
        save_result(text, sentiment, score)

        results.append({
            "text": text,
            "sentiment": sentiment,
            "emoji": emoji,
            "score": round(score * 100, 2),
            "breakdown": breakdown,
            "emotions": emotions,
        })

    # Summary stats
    counts = {"Positive": 0, "Negative": 0, "Neutral": 0}
    for r in results:
        if "sentiment" in r:
            counts[r["sentiment"]] += 1

    return jsonify({"results": results, "summary": counts})


@app.route("/history")
def get_history_route():
    """Return last 10 analyses."""
    return jsonify(get_history(10))


@app.route("/stats")
def stats():
    """Return overall stats for chart."""
    if USE_MONGO:
        pipeline_agg = [
            {"$group": {"_id": "$label", "count": {"$sum": 1}}}
        ]
        agg = list(collection.aggregate(pipeline_agg))
        counts = {item["_id"]: item["count"] for item in agg}
    else:
        counts = {"Positive": 0, "Negative": 0, "Neutral": 0}
        for entry in history:
            counts[entry["label"]] = counts.get(entry["label"], 0) + 1

    return jsonify({
        "Positive": counts.get("Positive", 0),
        "Negative": counts.get("Negative", 0),
        "Neutral": counts.get("Neutral", 0)
    })


@app.route("/health")
def health():
    """
    Health-check endpoint for uptime monitors and deployment platforms.

    Returns the status of the app, loaded models, and storage backend.
    """
    return jsonify({
        "status": "ok",
        "model": "roberta-twitter",
        "emotion_model": "distilroberta-emotion",
        "db": "mongo" if USE_MONGO else "memory"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)