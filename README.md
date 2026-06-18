# 🧠 SentimentAI — AI-Based Social Media Sentiment & Emotion Analyzer

An AI-powered web application that performs real-time **sentiment analysis** and **emotion detection** on any text input — specifically optimized for **social media content, public opinions, and informal text.**

The application uses two state-of-the-art NLP models: **RoBERTa** (trained on 124 million tweets) for 3-class sentiment classification, and **DistilRoBERTa** for 7-class emotion detection — giving you not just *what* the sentiment is, but *why*.

Built with: **Python · Flask · Hugging Face Transformers · MongoDB Atlas · Render**

---

## 🎯 What is This Project For?

Unlike traditional sentiment models trained on formal movie reviews or product ratings, SentimentAI uses a model trained on **real-world, informal human text from Twitter/X** — making it highly accurate for slang, abbreviations, emojis, sarcasm, and the type of language people actually use on the internet today.

| Use Case | Example |
|----------|---------|
| **Social Media Monitoring** | Analyze what people are saying about a brand/topic on Twitter, Instagram, Reddit |
| **Brand Reputation Tracking** | Paste customer comments to see if people love or hate a brand |
| **Public Opinion Analysis** | Analyze reactions to a government policy, election, or news event |
| **Influencer / Content Analysis** | Check if audience reactions to a YouTube/Instagram post are positive or negative |
| **Customer Feedback Triage** | Quickly sort support tickets or feedback forms by urgency (angry = urgent) |
| **Hashtag / Trend Analysis** | Paste tweets from a trending hashtag to gauge public mood |
| **Cyberbullying Detection** | Identify hateful or angry messages using the emotion model |
| **News Headline Sentiment** | Analyze if media coverage of a topic is positive, negative, or neutral |
| **Political Sentiment** | Track public reaction to speeches, debates, or policy announcements |
| **Event Feedback** | Analyze attendee comments from a college fest, conference, or webinar |

### Who Would Use This?

| Person | Why |
|--------|-----|
| Marketing teams | Monitor brand perception on social media |
| Journalists | Gauge public reaction to breaking news |
| Researchers | Study public opinion trends at scale |
| Social media managers | Track audience mood across platforms |
| College students | Analyze survey responses or feedback |
| HR departments | Analyze employee feedback and reviews |
| Content creators | Understand audience reaction to their content |

---

## 📸 Features

- ✅ **Single Analysis** — Paste any text and get instant sentiment + confidence score
- ✅ **Bulk Analysis** — Analyze up to 20 texts at once with a summary breakdown
- ✅ **Emotion Detection** — 7-emotion breakdown (Joy, Anger, Sadness, Fear, Surprise, Disgust, Neutral)
- ✅ **Confidence Breakdown** — See percentage scores for all 3 sentiment classes
- ✅ **History** — View your last 10 analyses
- ✅ **Stats Chart** — Doughnut chart showing overall sentiment distribution
- ✅ **Export CSV** — Download bulk analysis results as CSV
- ✅ **Copy Results** — One-click copy of analysis results
- ✅ **No ML training needed** — Uses pre-trained RoBERTa + DistilRoBERTa models
- ✅ **Cloud-ready** — MongoDB Atlas support for persistent storage
- ✅ **Works without MongoDB** — Falls back to in-memory storage automatically

---

## 🤖 AI Models Used

| Model | Purpose | Classes |
|---|---|---|
| [cardiffnlp/twitter-roberta-base-sentiment-latest](https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment-latest) | Sentiment Analysis | 3: Positive, Negative, Neutral |
| [j-hartmann/emotion-english-distilroberta-base](https://huggingface.co/j-hartmann/emotion-english-distilroberta-base) | Emotion Detection | 7: Anger, Disgust, Fear, Joy, Neutral, Sadness, Surprise |

**Why RoBERTa Twitter?** It's trained on ~124M tweets and natively outputs 3 sentiment classes. Unlike DistilBERT (which only understands 2 classes and fakes neutral), RoBERTa was trained on genuinely neutral examples — giving accurate 3-way classification out of the box. It excels at informal language: slang, emojis, abbreviations, and sarcasm.

**Why DistilRoBERTa Emotion?** Sentiment tells you *what* (positive/negative), but emotion tells you *why*. Two texts can both be "Negative" but for completely different reasons — "I'm heartbroken" (sadness) vs "This company robbed me!" (anger). The emotion model gives you that deeper insight.

---

## 🗂️ Project Structure

```
sentiment-analyzer/
├── app.py                  ← Main Flask app (routes + AI models)
├── requirements.txt        ← Python dependencies
├── .env.example            ← Environment variable template
├── .gitignore
├── Procfile                ← Gunicorn start command (for Render)
├── render.yaml             ← Render deployment config
├── templates/
│   └── index.html          ← Frontend HTML
└── static/
    ├── css/
    │   └── style.css       ← Dark theme styling (glassmorphism)
    └── js/
        └── main.js         ← Frontend logic (fetch, charts, toasts)
```

---

## ⚙️ Setup Instructions (Step by Step)

### Step 1 — Prerequisites
Make sure you have these installed:
- Python 3.9 or higher → https://www.python.org/downloads/
- pip (comes with Python)
- Git → https://git-scm.com/

Check by running:
```bash
python --version
pip --version
git --version
```

---

### Step 2 — Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/sentiment-analyzer.git
cd sentiment-analyzer
```

---

### Step 3 — Create a Virtual Environment
A virtual environment keeps your project dependencies isolated.

```bash
# Create venv
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

You'll see `(venv)` in your terminal — that means it's active.

---

### Step 4 — Install Dependencies
```bash
pip install -r requirements.txt
```

⚠️ This will download PyTorch + Transformers (~500MB total on first install). Be patient!

---

### Step 5 — Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env
```

Open `.env` and optionally:
- Change `SECRET_KEY` to a random string
- Set `MONGO_URI` to your MongoDB Atlas connection string (optional)

MongoDB is **optional** — the app works fine without it.

---

### Step 6 — Run the App
```bash
python app.py
```

On **first run**, the AI models (~830MB total) will be downloaded automatically.
You'll see:
```
Sentiment model loaded successfully!
Emotion model loaded successfully!
```

Then open your browser and go to: **http://localhost:5000**

---

## 🍃 Database Setup (MongoDB Atlas — Free)

For persistent storage that works both locally and in the cloud:

### Option A: MongoDB Atlas (Recommended for deployment)

1. Go to https://cloud.mongodb.com and create a free account
2. Create a **Free Shared Cluster** (M0 — 512MB free forever)
3. Click **Connect** → **Drivers** → Copy the connection string
4. Paste it in your `.env` file:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/sentiment_db?retryWrites=true&w=majority
   ```
5. Make sure to **whitelist your IP** (or use `0.0.0.0/0` for all IPs) in Network Access

### Option B: Local MongoDB (Development only)

1. Download MongoDB Community → https://www.mongodb.com/try/download/community
2. Start the MongoDB service
3. The app will auto-detect and connect to `mongodb://localhost:27017/`

If MongoDB is NOT running and no Atlas URI is set, the app uses in-memory storage (data resets on restart).

---

## 🚀 Deployment to Render (Free Hosting)

1. Push your code to GitHub
2. Go to https://render.com and sign up (free)
3. Click **New → Web Service**
4. Connect your GitHub repo
5. Render will auto-detect the `render.yaml` — or set manually:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120`
   - **Environment:** Python 3
6. Add environment variables in Render dashboard:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `SECRET_KEY` = (auto-generated by Render if using render.yaml)
7. Click **Deploy** — your app will be live in ~5 minutes!

> ⚠️ **Note:** The first request after deploy may take 30–60 seconds (cold start) as models load into memory. Subsequent requests are fast.

---

## 📤 GitHub Setup

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: AI Sentiment Analyzer with RoBERTa + Emotion Detection"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/sentiment-analyzer.git
git branch -M main
git push -u origin main
```

---

## 🧪 Example API Usage (with curl)

**Single analysis:**
```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "I love this product!"}'
```

**Response:**
```json
{
  "sentiment": "Positive",
  "emoji": "😊",
  "score": 97.23,
  "text": "I love this product!",
  "timestamp": "2024-01-15 10:30:00",
  "breakdown": {
    "Positive": 97.23,
    "Negative": 1.42,
    "Neutral": 1.35
  },
  "emotions": {
    "joy": 92.14,
    "surprise": 3.21,
    "neutral": 2.05,
    "anger": 0.85,
    "sadness": 0.72,
    "fear": 0.56,
    "disgust": 0.47
  }
}
```

**Bulk analysis:**
```bash
curl -X POST http://localhost:5000/analyze-bulk \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Great product!", "Terrible service.", "It was okay."]}'
```

**Health check:**
```bash
curl http://localhost:5000/health
```

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python 3.9+ | Backend language |
| Flask | Web framework |
| Hugging Face Transformers | Pre-trained AI models |
| RoBERTa (Twitter) | 3-class sentiment analysis (trained on 124M tweets) |
| DistilRoBERTa (Emotion) | 7-class emotion detection |
| PyTorch | ML framework (required by Transformers) |
| MongoDB Atlas / in-memory | Data storage |
| Chart.js | Frontend visualization |
| Gunicorn | Production WSGI server |
| Render | Cloud deployment |

---

## 🤔 How Does the AI Work?

### Sentiment Analysis
The app uses **RoBERTa** (Robustly Optimized BERT Pretraining Approach) — a transformer-based model fine-tuned on approximately **124 million tweets** from Twitter/X. It directly classifies text into Positive, Negative, or Neutral with confidence scores for all three classes.

### Emotion Detection
A secondary **DistilRoBERTa** model (trained on Reddit, Twitter, and other sources) detects 7 distinct emotions: Joy, Anger, Sadness, Fear, Surprise, Disgust, and Neutral. This gives deeper insight into *why* a text is positive or negative.

Both models are downloaded automatically from Hugging Face on first run — no training needed.

---

## 📄 License
MIT — free to use and modify.
