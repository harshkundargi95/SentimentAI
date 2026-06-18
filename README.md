---
title: SentimentAI
emoji: 🧠
colorFrom: purple
colorTo: indigo
sdk: docker
pinned: false
---

# 🧠 SentimentAI — AI-Powered Sentiment & Emotion Analyzer

**Live Demo:** [View on Hugging Face Spaces](https://huggingface.co/spaces/harshkundargi-2528/SentimentAI)

## 🌍 Live Deployment & Project Location
The project is officially deployed and hosted on **Hugging Face Spaces**. 
*   **Public URL:** [https://huggingface.co/spaces/harshkundargi-2528/SentimentAI](https://huggingface.co/spaces/harshkundargi-2528/SentimentAI)
*   **Where to find it:** To access the server dashboard, container logs, or deployment settings, simply log into your Hugging Face account at `huggingface.co`, click on your Profile picture in the top right corner, and select **Spaces**. Your `SentimentAI` project will be listed there.

## 📌 Project Overview
**SentimentAI** is a full-stack, AI-powered web application that performs real-time **sentiment analysis** and **emotion detection** on text. It is specifically optimized to understand informal text, social media content, and product reviews.

Instead of just labeling text as "Positive" or "Negative," this application goes a step further by identifying the **underlying human emotion** (Joy, Anger, Sadness, Fear, Surprise, Disgust) driving that sentiment. 

This project demonstrates the integration of **state-of-the-art Hugging Face Transformer models** within a lightweight **Flask API**, paired with a modern glassmorphism frontend and a **MongoDB** cloud database.

---

## 🚀 Key Features

*   **Advanced AI Text Analysis:** Evaluates input text to determine both sentiment (Positive/Neutral/Negative) and primary emotion (7 distinct classes).
*   **Confidence Breakdowns:** Provides detailed percentage breakdowns of how strongly the AI weighed each possible sentiment and emotion.
*   **Bulk Analysis:** Users can analyze up to 20 pieces of text simultaneously, making it highly effective for analyzing e-commerce reviews or tweet datasets.
*   **Persistent Cloud Storage:** Every analysis is permanently recorded in a MongoDB Atlas cluster, allowing users to view their historical queries.
*   **Data Visualization:** Integrates `Chart.js` to dynamically render real-time statistical breakdowns of historical sentiment trends.
*   **Data Export:** Allows users to export their bulk analysis results as a `.csv` file for further data science usage.
*   **Modern UI/UX:** Features a responsive, dark-mode glassmorphism interface with fluid animations and toast notifications.

---

## 🛠️ Technology Stack

### Artificial Intelligence & Machine Learning
*   **PyTorch & Transformers (Hugging Face):** Core machine learning backend.
*   **Sentiment Model:** [`cardiffnlp/twitter-roberta-base-sentiment-latest`](https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment-latest) 
    *   *Architecture:* RoBERTa-base
    *   *Training Data:* 124 million tweets. Highly accurate on informal language and slang.
*   **Emotion Model:** [`j-hartmann/emotion-english-distilroberta-base`](https://huggingface.co/j-hartmann/emotion-english-distilroberta-base)
    *   *Architecture:* DistilRoBERTa-base
    *   *Training Data:* 6 diverse datasets mapping to Ekman’s 6 basic emotions + neutral.

### Backend Development
*   **Python 3.11**
*   **Flask & Gunicorn:** Handles API routing, JSON serialization, and production-grade web serving.

### Database Architecture
*   **MongoDB Atlas (Cloud):** NoSQL document database used to store unstructured analysis logs.
*   **PyMongo:** Python driver bridging the Flask API with the Atlas cluster.

### Frontend Development
*   **Vanilla JavaScript (ES6), HTML5, CSS3:** Zero-dependency frontend architecture for maximum performance.
*   **Chart.js:** Client-side rendering of analytics charts.

### DevOps & Deployment
*   **Docker:** Containerization of the Python/Flask environment.
*   **Hugging Face Spaces:** Serverless container hosting with 16GB RAM provisions for heavy ML workloads.
*   **Git & GitHub:** Version control and continuous deployment syncing.

---

## ⚙️ System Architecture

1.  **Client Request:** The user submits text via the modern frontend interface. JavaScript sends an asynchronous `POST /analyze` request to the Flask server.
2.  **Inference Engine:** Flask passes the text through the two pre-loaded PyTorch pipeline models simultaneously.
3.  **Data Processing:** The model outputs (logits) are converted to percentage scores. The backend formats this into a structured JSON response.
4.  **Database Persistence:** Before returning the response, Flask utilizes `PyMongo` to asynchronously insert a timestamped document into the MongoDB Atlas cluster.
5.  **Client Render:** The frontend parses the JSON response, dynamically updating the DOM to display sentiment badges, progress bars, and emotion charts.

---

## 💻 How to Run Locally

If you wish to run this project on your local machine for development:

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshkundargi95/SentimentAI.git
   cd SentimentAI
   ```

2. **Create a virtual environment and install dependencies**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your MongoDB connection string:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sentiment_db
   SECRET_KEY=your-development-secret-key
   ```

4. **Run the Application**
   ```bash
   python app.py
   ```
   *Note: On the very first run, the application will download ~830MB of model weights to your local machine.*

5. **View in Browser**
   Navigate to `http://localhost:5000`

---
*Developed by Harsh Kundargi*
