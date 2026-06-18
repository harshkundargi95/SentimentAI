# SentimentAI — Complete Project Report
### AI-Based Social Media Sentiment & Emotion Analyzer

---

## Table of Contents

1. What is SentimentAI?
2. What is Sentiment Analysis?
3. Target Users & Use Cases
4. Project Features
5. How the Project Works (Flow)
6. Tech Stack
7. AI Models Explained
8. How Positive / Negative / Neutral Works
9. How Emotion Detection Works
10. Why "Neutral" Text Sometimes Shows as "Positive"
11. Project Limitations
12. Database — MongoDB Atlas
13. Deployment
14. API Reference
15. Project File Structure

---

## 1. What is SentimentAI?

SentimentAI is an **AI-powered web application** that performs real-time **sentiment analysis** and **emotion detection** on any text input — specifically optimized for **social media content, public opinions, and informal text.**

It reads any piece of text — a tweet, an Instagram comment, a Reddit post, a customer complaint, a news headline — and automatically determines:

- **What is the overall sentiment?** → Positive, Negative, or Neutral
- **How confident is the AI?** → A percentage score (e.g. 94.5%)
- **What emotions are present?** → Joy, Anger, Sadness, Fear, Surprise, Disgust, or Neutral
- **What is the full breakdown?** → Scores for all 3 sentiments and all 7 emotions simultaneously

The application uses two state-of-the-art NLP models:

1. **RoBERTa** (trained on 124 million tweets) for 3-class sentiment classification
2. **DistilRoBERTa** for 7-class emotion detection

This gives you not just *what* the sentiment is, but *why* — making it far more insightful than basic positive/negative classifiers.

It requires **zero machine learning knowledge** to use. You simply type or paste text, click a button, and the AI gives you a detailed breakdown in seconds.

---

## 2. What is Sentiment Analysis?

Sentiment Analysis is a branch of **Natural Language Processing (NLP)** — the field of AI that deals with understanding human language.

The goal is simple: given a piece of text written by a human, automatically determine the **emotional tone or opinion** expressed in it.

### Real-World Applications

| Industry | Use Case |
|----------|----------|
| **Social Media** | Monitor what people are saying about a brand on Twitter/Instagram |
| **Marketing** | Track public sentiment about a campaign or product launch |
| **Journalism** | Gauge public reaction to breaking news or events |
| **Politics** | Track public opinion about policies, elections, or candidates |
| **Customer Support** | Prioritize angry customer tickets automatically |
| **HR** | Analyze employee satisfaction from feedback surveys |
| **Finance** | Analyze news headlines to predict market sentiment |
| **Healthcare** | Detect signs of depression or anxiety in patient messages |
| **Education** | Analyze student feedback about courses and professors |

### Why is it Hard?

Human language is complex. Consider these examples:

- *"This product is not bad at all."* → Sounds negative but is actually positive
- *"The battery life is okay."* → Technically positive but quite lukewarm
- *"Wow, great customer service... NOT."* → Sarcasm — actually very negative
- *"The movie was surprisingly good."* → Positive with an element of surprise
- *"lowkey this slaps 🔥"* → Very positive but uses internet slang

Traditional rule-based systems (like keyword matching) fail at all of these. **Modern AI models** trained on millions of real-world examples handle them with much higher accuracy — especially models trained on social media text where these patterns are most common.

---

## 3. Target Users & Use Cases

### Who Would Use This Project?

| Person | Why |
|--------|-----|
| **Marketing teams** | Monitor brand perception on social media |
| **Journalists** | Gauge public reaction to breaking news |
| **Researchers** | Study public opinion trends at scale |
| **Social media managers** | Track audience mood across platforms |
| **College students** | Analyze survey responses or feedback |
| **HR departments** | Analyze employee feedback and reviews |
| **Content creators** | Understand audience reaction to their content |
| **Event organizers** | Measure attendee satisfaction from comments |
| **Political analysts** | Track public sentiment about policies or candidates |
| **Customer support leads** | Triage tickets by emotional urgency |

### Specific Use Cases

| Use Case | How SentimentAI Helps |
|----------|----------------------|
| **Social Media Monitoring** | Paste tweets/comments about a brand → Instantly see if sentiment is positive, negative, or neutral |
| **Brand Reputation Tracking** | Bulk analyze 20 customer comments at once → Get a summary count and export as CSV |
| **Public Opinion Analysis** | Analyze reactions to a government policy or news event → See emotion breakdown (anger vs fear vs sadness) |
| **Influencer / Content Analysis** | Check if audience reactions to a post are positive or negative → Copy results for reporting |
| **Customer Feedback Triage** | Quickly sort feedback by sentiment → Angry messages (high anger emotion) get priority |
| **Hashtag / Trend Analysis** | Paste tweets from a trending hashtag → Gauge overall public mood |
| **Cyberbullying Detection** | Identify hateful or angry messages using the emotion model → Flag texts with high anger/disgust |
| **News Headline Sentiment** | Analyze if media coverage of a topic is biased positive, negative, or neutral |
| **Event Feedback** | Paste feedback from a college fest or webinar → See attendee satisfaction at a glance |

---

## 4. Project Features

### Single Analysis Tab
- Paste any text (up to 1,000 characters)
- Click "Analyze Sentiment" to get instant results
- View the sentiment label with emoji (😊 😞 😐)
- View the confidence score with an animated progress bar
- View the **Confidence Breakdown** — percentage scores for all 3 sentiments simultaneously
- Toggle the **Emotion Breakdown** — scores for all 7 emotions
- Copy the result to your clipboard with one click
- Try pre-loaded example texts (Positive, Negative, Neutral chips)
- Press **Ctrl + Enter** as a keyboard shortcut to analyze

### Bulk Analysis Tab
- Paste up to 20 different texts, one per line
- Analyze all of them with a single click
- View a summary count (how many Positive / Negative / Neutral)
- View individual results for each text
- **Export all results as a CSV file** for use in Excel or Google Sheets

### History Tab
- View your last 10 analyses with text, label, confidence, and timestamp
- Refresh anytime to see the latest

### Stats Tab
- View a beautiful **doughnut chart** showing the overall distribution of your analyses
- See exact counts for Positive, Negative, and Neutral

### UI/UX Features
- Premium **dark glassmorphism** theme with gradient accents
- **Toast notifications** instead of browser alerts
- Smooth **animated bars** for confidence and emotion breakdowns
- **Responsive design** — works on desktop and mobile
- **Custom scrollbar** matching the dark theme
- **Micro-animations** on hover for all interactive elements

---

## 5. How the Project Works (Flow)

Here is the complete journey of a single analysis from start to finish:

```
User types text in the browser (e.g. a tweet or comment)
                ↓
JavaScript collects the text and sends it to the Flask backend
via a POST request to the /analyze API endpoint
                ↓
Flask receives the text and validates it
  → Is it empty? Return error
  → Is it longer than 1000 characters? Return error
                ↓
Text is passed to the RoBERTa Sentiment Model
  → Model tokenizes the text into subword tokens
  → Runs through 12 transformer layers with attention mechanism
  → Returns percentage scores for Positive, Negative, Neutral
                ↓
Text is passed to the DistilRoBERTa Emotion Model
  → Same process but outputs 7 emotion scores
  → Returns percentage scores for Joy, Anger, Sadness,
    Fear, Surprise, Disgust, Neutral
                ↓
Flask saves the result to MongoDB (or in-memory if no DB)
                ↓
Flask sends back a JSON response with all the data
                ↓
JavaScript receives the response and renders:
  → The sentiment label and emoji
  → The animated confidence bar
  → The confidence breakdown (3 horizontal bars)
  → The emotion section (7 horizontal bars, toggled)
                ↓
User sees the results instantly on screen!
```

### Bulk Analysis Flow

```
User pastes up to 20 texts (one per line) in the Bulk tab
                ↓
JavaScript splits by newlines and sends all texts to /analyze-bulk
                ↓
Flask loops through each text:
  → Validates length (max 1000 chars each)
  → Runs sentiment model on each
  → Runs emotion model on each
  → Saves each result to database
                ↓
Flask calculates summary counts:
  → How many Positive, Negative, Neutral
                ↓
Sends back all individual results + summary
                ↓
JavaScript renders:
  → Summary pills (Positive: 8, Negative: 3, Neutral: 2)
  → Individual result cards with emoji and badge
  → "Export CSV" button becomes visible
```

---

## 6. Tech Stack

### Backend

| Technology | Version | Role |
|-----------|---------|------|
| **Python** | 3.9+ | Core backend programming language |
| **Flask** | 3.0.3 | Lightweight web framework — handles routes, API endpoints, template rendering |
| **Hugging Face Transformers** | 4.46.3 | Library to load and run pre-trained AI models from the Hugging Face Hub |
| **PyTorch** | 2.6.0 | Deep learning framework that powers the AI model inference |
| **pymongo** | 4.7.2 | Python driver for communicating with MongoDB databases |
| **python-dotenv** | 1.0.1 | Reads configuration from the `.env` file securely |
| **Gunicorn** | 22.0.0 | Production-grade WSGI web server (for deployment on Render) |
| **scipy** | latest | Scientific computing library (required by the emotion model) |

### Frontend

| Technology | Role |
|-----------|------|
| **HTML5** | Page structure and semantic layout |
| **Vanilla CSS** | Styling — glassmorphism cards, gradient buttons, animations, dark theme |
| **Vanilla JavaScript** | Logic — API calls, DOM manipulation, toast notifications, CSV export |
| **Chart.js 4.4** | Beautiful doughnut chart for the Stats tab |
| **Google Fonts (Inter)** | Modern, clean typography across the application |

### Database

| Technology | Role |
|-----------|------|
| **MongoDB** | NoSQL document database for storing analysis history and results |
| **MongoDB Atlas** | Free cloud-hosted version of MongoDB (512MB free forever) |
| **In-Memory Fallback** | Python lists used as fallback when no MongoDB is available |

### Deployment

| Technology | Role |
|-----------|------|
| **Render** | Free cloud platform to host the Flask web application |
| **GitHub** | Code repository, version control, and CI/CD integration with Render |

---

## 7. AI Models Explained

### What is a "Pre-trained Model"?

Training an AI model from scratch requires:
- Millions of labeled examples
- Weeks of computing time on expensive GPU hardware
- Deep machine learning expertise

Instead, this project uses **pre-trained models** — models that have already been trained by research teams and published for free on the **Hugging Face Hub** (huggingface.co). We simply download them and use them directly. No training required.

This approach is called **Transfer Learning** — one of the most powerful and widely used concepts in modern AI. It allows anyone to leverage state-of-the-art AI without needing a GPU or ML expertise.

---

### Model 1: RoBERTa Twitter (Sentiment)
**Full name:** `cardiffnlp/twitter-roberta-base-sentiment-latest`
**Created by:** Cardiff University NLP Group
**Architecture:** RoBERTa (Robustly Optimized BERT Pretraining Approach)
**Base:** Originally developed by Facebook AI Research (2019)
**Training data:** ~124 million tweets from Twitter/X
**Output:** 3 classes — Positive, Negative, Neutral

**What is RoBERTa?**
RoBERTa is a transformer-based AI model that builds on the famous **BERT** architecture created by Google in 2018. BERT (Bidirectional Encoder Representations from Transformers) was a breakthrough because it could read text in both directions simultaneously — understanding context from both before and after each word. RoBERTa improved upon BERT by:
- Training on 10x more data
- Training for longer periods
- Removing the "Next Sentence Prediction" objective
- Using dynamic masking instead of static masking

**What makes this specific version special?**
This version was fine-tuned by researchers at Cardiff University on approximately **124 million tweets**. This means it has seen and learned from real-world, informal human text — slang, abbreviations, emojis, hashtags, and all. This makes it exceptionally good at understanding the type of language people actually use on social media platforms.

**Why is it better than the old DistilBERT model?**

| Feature | Old DistilBERT (SST-2) | New RoBERTa Twitter |
|---------|------------------------|---------------------|
| Training data | Movie reviews from 1990s | 124M real tweets |
| Output classes | 2 (Positive/Negative) | 3 (Positive/Negative/Neutral) |
| Neutral detection | Faked using a 0.65 confidence threshold | Genuine — trained on neutral examples |
| Informal text | Poor | Excellent |
| Sarcasm detection | Very poor | Better (trained on sarcastic tweets) |
| Emoji understanding | None | Some understanding from tweet context |
| Model size | ~250MB | ~500MB |

---

### Model 2: DistilRoBERTa Emotion (Emotions)
**Full name:** `j-hartmann/emotion-english-distilroberta-base`
**Created by:** Jochen Hartmann (TU Munich)
**Architecture:** DistilRoBERTa (compressed RoBERTa)
**Training data:** Reddit posts, tweets, and other English text sources
**Output:** 7 emotions

**What does it do?**
This model goes deeper than just positive/negative/neutral. It classifies text into **7 distinct emotions**:

| Emotion | Emoji | Example Text |
|---------|-------|-------------|
| **Joy** | 😊 | "I absolutely love this! Best day ever!" |
| **Anger** | 😠 | "This is completely unacceptable. I'm furious." |
| **Sadness** | 😢 | "I miss the old days. Everything has changed." |
| **Fear** | 😨 | "I'm really worried this might go wrong." |
| **Surprise** | 😮 | "I can't believe they actually did it!" |
| **Disgust** | 🤢 | "That is absolutely revolting." |
| **Neutral** | 😐 | "The meeting is scheduled for Monday at 3pm." |

**Why is this useful?**
Two texts can both be "Negative" but for completely different reasons:
- *"I'm heartbroken about the news"* → Negative + **Sadness**
- *"This company robbed me!"* → Negative + **Anger**
- *"I'm scared this product will break."* → Negative + **Fear**
- *"That customer service was disgusting."* → Negative + **Disgust**

For a social media manager, knowing that customers are **angry** (requires urgent response) vs **sad** (requires empathetic response) vs **fearful** (requires reassurance) changes the entire response strategy. The emotion model provides this deeper insight.

**What does "Distil" mean?**
DistilRoBERTa is a **compressed, faster version** of RoBERTa. It retains about 95% of the accuracy at 40% of the size and 60% of the inference time — making it perfect for a web application where response speed matters.

---

## 8. How Positive / Negative / Neutral Works

### The Transformer Architecture

Both models are based on the **Transformer** architecture — the breakthrough technology introduced in the 2017 paper "Attention Is All You Need" that now powers all modern AI including ChatGPT, Claude, and Gemini.

Here is a simplified explanation of what happens when you analyze a sentence:

**Step 1 — Tokenization**
The text is broken down into small pieces called "tokens." For example:
```
"I love this product" → ["I", "Ġlove", "Ġthis", "Ġproduct"]
```
(The "Ġ" represents a space before the word — this is how RoBERTa's tokenizer works.)

Special tokens like numbers, emojis, and unusual words are broken into smaller sub-word pieces. For example:
```
"unhappiness" → ["un", "happiness"]
```
This allows the model to understand words it has never seen before by combining known pieces.

**Step 2 — Embedding**
Each token is converted into a dense list of 768 numbers (called a "vector" or "embedding") that represents its meaning mathematically. Words with similar meanings end up with similar vectors. For example, "happy" and "joyful" would have very similar vectors, while "happy" and "terrible" would have very different ones.

**Step 3 — Self-Attention Mechanism**
This is the most important step. The model looks at **all tokens simultaneously** and calculates how much each word should "pay attention" to every other word in the sentence.

For example, in the sentence *"The product is not bad"*:
- The word "not" completely flips the meaning of "bad"
- The attention mechanism learns that "not" and "bad" are strongly connected
- So it understands "not bad" = positive, even though "bad" alone = negative

This is why transformers are so much better than older models — they capture the **relationships between words**, not just individual words.

RoBERTa uses **12 layers of attention** (called "encoder layers"), each one refining the model's understanding of the text further.

**Step 4 — Classification Head**
After 12 layers of processing, the model has a rich understanding of the entire text. A final neural network layer (called the "classification head") converts this understanding into three numbers — one for each class (Positive, Negative, Neutral).

**Step 5 — Softmax**
These three raw numbers (called "logits") are converted to percentages using a mathematical function called **Softmax**. Softmax ensures:
- All three scores are between 0% and 100%
- All three always add up to exactly 100%

**Example output:**
```
Input: "I love this product!"

Logits (raw):  [4.21, -3.87, -2.45]
Softmax (percentages):
  → Positive: 97.2%
  → Negative:  1.5%
  → Neutral:   1.3%
  → Total:   100.0%

Final result: POSITIVE (97.2% confidence)
```

### The Confidence Score
The confidence score shown in the app is simply the **percentage of the winning class.** A score of 97% means the model is very certain. A score of 55% means the model is barely leaning towards that sentiment — a borderline case.

### The Confidence Breakdown
This is the most honest part of the display. Instead of just showing the top result, the app shows **all three scores simultaneously.** This helps you understand borderline cases:

```
Text: "The product is decent"
→ Positive: 52%   ← model picks this as winner
→ Neutral:  38%   ← but neutral score is significant
→ Negative: 10%

Interpretation: Barely positive — almost neutral
```

vs. a genuinely clear result:

```
Text: "I absolutely love this product! Best purchase ever!"
→ Positive: 99.1%  ← almost no doubt
→ Neutral:   0.6%
→ Negative:  0.3%

Interpretation: Overwhelmingly positive
```

---

## 9. How Emotion Detection Works

The emotion model works exactly the same way as the sentiment model internally — it's a Transformer with attention layers that outputs probabilities. The only difference is it outputs **7 classes** instead of 3.

### Relationship Between Sentiment and Emotion

Sentiment and emotion are related but not identical:

| Sentiment | Typical Emotions |
|-----------|-----------------|
| **Positive** | Joy, Surprise (positive surprise) |
| **Negative** | Anger, Sadness, Fear, Disgust |
| **Neutral** | Neutral |

But there are interesting exceptions:
- *"I'm surprised they actually delivered on time!"* → Positive sentiment + Surprise emotion
- *"I'm scared this product will break."* → Negative sentiment + Fear emotion
- *"I miss when this brand was good."* → Negative sentiment + Sadness emotion (nostalgia)
- *"I can't believe how bad this is!"* → Negative sentiment + Surprise emotion (negative surprise)

### How to Read the Emotion Bars

The emotion bars show the percentage confidence for each of the 7 emotions. They all add up to 100%. The **tallest bar** is the dominant emotion. Common patterns:

| Text Type | Dominant Emotion |
|-----------|-----------------|
| Happy, excited reviews | **Joy** dominates |
| Angry complaints | **Anger** dominates |
| Disappointed feedback | **Sadness** dominates |
| Worried questions | **Fear** dominates |
| Shocked reactions | **Surprise** dominates |
| Offensive/repulsive content | **Disgust** dominates |
| Factual statements | **Neutral** dominates |
| Mixed feelings | Multiple bars have significant values |

### Why Two Models Instead of One?

A single model that does both sentiment AND emotion would be ideal, but no such high-quality model exists. By using two specialized models:
- Each model is **expert** at its specific task
- The sentiment model's accuracy is not diluted by also trying to detect emotions
- The emotion model can provide nuance that a 3-class sentiment model never could

---

## 10. Why "Neutral" Text Sometimes Shows as "Positive"

This is one of the most interesting quirks of AI language models, and it comes down to two key concepts: **training data bias** and **language bias.**

### Problem 1: Training Data Bias

The RoBERTa Twitter model was trained on tweets that were labeled by humans. The labels were often determined by the **emojis** present in the tweet:
- Tweets with 😊 ❤️ 🎉 → labeled as **Positive**
- Tweets with 😢 😠 💔 → labeled as **Negative**
- Tweets with no strong emotional emojis → labeled as **Neutral**

Here is the core problem: **people rarely tweet neutrally.** Twitter/X is an emotional platform. People tweet when they are excited, happy, or upset — almost never when they feel "meh" about something. This means the training data had far fewer truly neutral examples compared to positive and negative ones.

When the model encounters a borderline text that isn't clearly positive or negative, it has a slight **bias towards positive** because it saw more mildly positive examples than truly neutral ones during training.

### Problem 2: Language Bias

Words like "okay," "fine," "decent," and "alright" are often used in everyday English in a **mildly positive context:**

- *"The food was okay."* → In casual speech, "okay" often means "satisfactory" (mild positive)
- *"It's fine."* → Usually means "It's acceptable to me" (mild positive)
- *"The product is decent."* → "Decent" has a slightly positive connotation

The model has absorbed this linguistic pattern from millions of real tweets. So when it sees *"the product quality is okay,"* it has learned that this type of phrasing **usually comes from a person who is mildly satisfied** — not truly neutral.

### Example Breakdown

```
Text: "the product quality is okay"
→ Positive: 81.7%   ← model calls this "Positive"
→ Neutral:  12.4%   ← but neutral score is present
→ Negative:  5.9%

This is a BORDERLINE case — the model leans positive.
```

Compare to a genuinely clear positive:
```
Text: "I absolutely love this product! Best purchase ever!"
→ Positive: 99.1%   ← almost no doubt at all
→ Neutral:   0.6%
→ Negative:  0.3%

This is a CLEAR positive — no ambiguity.
```

### How to Interpret Borderline Cases

This is exactly why the **Confidence Breakdown** and **Emotion Breakdown** features were added:

1. **Check the breakdown:** If the top sentiment is only 55-75%, it's a borderline case. Look at the second-highest score — if Neutral is close behind, the text is probably genuinely neutral.
2. **Check emotions:** If the emotion model shows high "Neutral" emotion but the sentiment says "Positive," the text is truly lukewarm — the sentiment model is just slightly over-confident.

### The Bottom Line

No AI model is perfect. The RoBERTa Twitter model is among the **best available** for social media sentiment analysis, but it will still occasionally misclassify borderline cases. This is not a bug — it is an **inherent limitation** of current AI technology and the training data distribution. The Confidence Breakdown and Emotion Detection features were specifically designed to help users interpret these edge cases more intelligently.

---

## 11. Project Limitations

Being transparent about limitations is important:

| Limitation | Explanation |
|------------|-------------|
| **Not ideal for e-commerce star ratings** | The model gives 3 classes (Pos/Neg/Neu), not a 5-star scale. For star ratings, a review-specific model like `nlptown/bert-multilingual` would be better. |
| **English only** | The RoBERTa Twitter model only understands English text. Multilingual text would require a different model. |
| **Short text optimized** | Trained on tweets (280 chars max). Very long texts (2000+ words) may lose context. |
| **No sarcasm guarantee** | While better than most models, sarcasm ("Wow, great service... NOT.") is still challenging for all AI models. |
| **Borderline neutral bias** | As explained above, mildly neutral text may be classified as slightly positive due to training data distribution. |
| **No real-time social media feed** | The app requires manual text input — it doesn't automatically pull tweets from Twitter/X. This would require the Twitter API. |
| **Cold start latency** | On deployment, the first request after idle may take 30-60 seconds as models load into memory. |

---

## 12. Database — MongoDB Atlas

### What is MongoDB?

MongoDB is a **NoSQL database** — meaning it stores data as flexible JSON-like documents rather than rigid tables (like SQL databases or Excel spreadsheets). This makes it a natural fit for storing analysis results with varying structures.

Each saved analysis looks like this in the database:
```json
{
  "text": "I love this product!",
  "label": "Positive",
  "score": 97.23,
  "timestamp": "2024-06-13 10:30:00"
}
```

### What is MongoDB Atlas?

MongoDB Atlas is the **free cloud-hosted version** of MongoDB. Instead of installing a database on your PC, your data lives securely on MongoDB's cloud servers. The free tier gives you:
- **512MB storage** (enough for tens of thousands of analyses)
- **Free forever** (no credit card required)
- **Accessible from anywhere** — works both locally and when deployed on Render

### In-Memory Fallback

If MongoDB is not configured, the app automatically falls back to **in-memory storage** (Python lists stored in RAM). This means:
- ✅ Everything works perfectly — all features functional
- ✅ History and Stats tabs work during the session
- ❌ Data is lost when the server stops or restarts

This design ensures the app **never crashes** due to a missing database.

---

## 13. Deployment

The project is configured for free deployment using two services:

### Render (Web Server Hosting)
- Hosts the Python Flask application on the internet
- Automatically installs dependencies from `requirements.txt`
- Uses `Procfile` to know how to start the app with Gunicorn
- Free tier: 750 hours/month (enough for a personal project)
- Cold start: First request after idle may take 30-60 seconds (model loading)

### MongoDB Atlas (Database Hosting)
- Hosts the MongoDB database in the cloud
- Free tier: 512MB forever
- Connected via `MONGO_URI` environment variable in the `.env` file

### Key Deployment Files

| File | Purpose |
|------|---------|
| `Procfile` | Tells Render to use Gunicorn: `web: gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120` |
| `render.yaml` | Render infrastructure-as-code configuration (auto-setup on deploy) |
| `.env.example` | Template showing all required environment variables |
| `requirements.txt` | Lists all Python packages to install |

---

## 14. API Reference

The Flask backend exposes 5 API endpoints:

### POST /analyze
Analyzes a single text for sentiment and emotions.

**Request:**
```json
{ "text": "I love this product!" }
```

**Response:**
```json
{
  "sentiment": "Positive",
  "emoji": "😊",
  "score": 97.23,
  "text": "I love this product!",
  "timestamp": "2024-06-13 10:30:00",
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

### POST /analyze-bulk
Analyzes up to 20 texts at once.

**Request:**
```json
{ "texts": ["I love it!", "Terrible service.", "It was okay."] }
```

**Response:**
```json
{
  "results": [
    { "text": "I love it!", "sentiment": "Positive", "emoji": "😊", "score": 98.1, "breakdown": {...}, "emotions": {...} },
    { "text": "Terrible service.", "sentiment": "Negative", "emoji": "😞", "score": 96.4, "breakdown": {...}, "emotions": {...} },
    { "text": "It was okay.", "sentiment": "Positive", "emoji": "😊", "score": 71.2, "breakdown": {...}, "emotions": {...} }
  ],
  "summary": { "Positive": 2, "Negative": 1, "Neutral": 0 }
}
```

### GET /history
Returns the last 10 analyses performed.

**Response:**
```json
[
  { "text": "I love it!", "label": "Positive", "score": 98.1, "timestamp": "2024-06-13 10:30:00" },
  { "text": "Terrible.", "label": "Negative", "score": 96.4, "timestamp": "2024-06-13 10:29:00" }
]
```

### GET /stats
Returns aggregate counts for each sentiment category.

**Response:**
```json
{ "Positive": 15, "Negative": 7, "Neutral": 3 }
```

### GET /health
Returns the health status of the app and its components.

**Response:**
```json
{
  "status": "ok",
  "model": "roberta-twitter",
  "emotion_model": "distilroberta-emotion",
  "db": "memory"
}
```

---

## 15. Project File Structure

```
AI-Based-Sentiment-Analyzer-main/
│
├── app.py                  ← Main Flask application (307 lines)
│                             - Loads both AI models on startup
│                             - Defines all 5 API routes
│                             - Handles MongoDB / in-memory storage
│                             - Helper functions: classify_sentiment(),
│                               build_breakdown(), build_emotions()
│
├── requirements.txt        ← 8 Python package dependencies
│                             flask, transformers, torch, tokenizers,
│                             pymongo, python-dotenv, gunicorn, scipy
│
├── .env.example            ← Template for environment variables
│                             FLASK_ENV, SECRET_KEY, MONGO_URI
│
├── .gitignore              ← Files/folders Git should ignore
│                             __pycache__, venv, .env, models, etc.
│
├── Procfile                ← Gunicorn start command for Render
│                             web: gunicorn app:app --bind 0.0.0.0:$PORT
│
├── render.yaml             ← Render deployment configuration
│                             Build/start commands, env vars, Python version
│
├── README.md               ← Full project documentation
│
├── templates/
│   └── index.html          ← Single-page frontend HTML (163 lines)
│                             - 4 tabs: Single, Bulk, History, Stats
│                             - Toast notification container
│                             - Confidence breakdown section
│                             - Emotion toggle section
│                             - Copy/Clear/Export buttons
│                             - Google Fonts + Chart.js CDN links
│
└── static/
    ├── css/
    │   └── style.css       ← Complete dark theme styling (868 lines)
    │                         - CSS custom properties (design tokens)
    │                         - Glassmorphism card effects
    │                         - Gradient header and buttons
    │                         - Animated confidence and emotion bars
    │                         - Toast slide-in/slide-out animations
    │                         - Custom dark scrollbar
    │                         - Mobile responsive layout (600px breakpoint)
    │
    └── js/
        └── main.js         ← Complete frontend JavaScript (544 lines)
                              - showToast() notification system
                              - analyzeSingle() and analyzeBulk()
                              - renderBreakdown() — 3 animated bars
                              - renderEmotions() — 7 animated bars
                              - toggleEmotions() — show/hide emotions
                              - copyResult() — clipboard API
                              - exportCSV() — download CSV blob
                              - clearInput() — reset form
                              - loadHistory() and loadStats()
                              - Chart.js doughnut chart rendering
                              - escapeHtml(), truncate(), colorOf() utils
                              - Ctrl+Enter keyboard shortcut
```

---

*SentimentAI — AI-Based Social Media Sentiment & Emotion Analyzer*
*Models: cardiffnlp/twitter-roberta-base-sentiment-latest + j-hartmann/emotion-english-distilroberta-base*
*Built with Flask, PyTorch, Hugging Face Transformers, MongoDB Atlas, and Chart.js*
