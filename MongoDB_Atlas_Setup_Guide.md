# MongoDB Atlas — Complete Setup Guide for SentimentAI
### From Zero Knowledge to a Working Cloud Database

---

## Table of Contents

1. What is a Database? (The Basics)
2. SQL vs NoSQL — Why MongoDB?
3. What is MongoDB? (How It Actually Works)
4. What is MongoDB Atlas?
5. Step-by-Step: Create Your Atlas Account
6. Step-by-Step: Create a Free Cluster
7. Step-by-Step: Create a Database User
8. Step-by-Step: Whitelist Your IP Address
9. Step-by-Step: Get Your Connection String
10. Step-by-Step: Connect Your Project
11. Step-by-Step: Verify It Works
12. How to View Your Data in Atlas
13. How Your Project Uses MongoDB (Code Walkthrough)
14. Troubleshooting Common Errors

---

## 1. What is a Database? (The Basics)

A database is simply a **place to store data permanently.** That's it.

Right now, when you run SentimentAI without MongoDB, your analysis history is stored in your computer's **RAM** (temporary memory). The moment you close the app, all that data vanishes. This is like writing notes on a whiteboard — the moment someone erases it, everything is gone.

A database is like writing those notes in a **notebook** — they stay there permanently until you decide to delete them.

### What kind of data does SentimentAI store?

Every time you analyze a text, the app saves a record like this:

```
Text:       "I love this product!"
Sentiment:  Positive
Confidence: 97.23%
Timestamp:  2024-06-18 12:30:00
```

Without a database → This record lives in RAM → Lost when server restarts.
With a database → This record is saved permanently → Survives restarts, accessible from anywhere.

---

## 2. SQL vs NoSQL — Why MongoDB?

There are two main types of databases:

### SQL Databases (Relational)
Think of them like **Excel spreadsheets** — data is stored in rows and columns with strict rules.

```
| id | text                    | sentiment | score | timestamp           |
|----|-------------------------|-----------|-------|---------------------|
| 1  | I love this product!    | Positive  | 97.23 | 2024-06-18 12:30:00 |
| 2  | Terrible experience.    | Negative  | 95.10 | 2024-06-18 12:31:00 |
| 3  | It was okay.            | Neutral   | 68.40 | 2024-06-18 12:32:00 |
```

- Examples: MySQL, PostgreSQL, SQLite
- Rules: Every row MUST have the same columns. You must define the structure before adding data.

### NoSQL Databases (Non-Relational)
Think of them like **a folder full of sticky notes** — each note can have different information, and there are no rigid rules.

```json
{
  "text": "I love this product!",
  "sentiment": "Positive",
  "score": 97.23,
  "timestamp": "2024-06-18 12:30:00"
}
```

```json
{
  "text": "Terrible experience.",
  "sentiment": "Negative",
  "score": 95.10,
  "timestamp": "2024-06-18 12:31:00",
  "extra_note": "this record has an extra field and that's totally fine"
}
```

- Examples: **MongoDB**, Firebase, DynamoDB
- Rules: No strict structure. Each record can be different. Much more flexible.

### Why MongoDB for this project?

| Reason | Explanation |
|--------|-------------|
| **JSON-native** | Our Flask app already sends/receives JSON. MongoDB stores JSON directly — no conversion needed |
| **Flexible** | If we add new fields later (like emotions), we don't need to change the database structure |
| **Easy to learn** | No SQL query language to learn. MongoDB uses simple Python dictionaries |
| **Free cloud hosting** | MongoDB Atlas offers 512MB free forever — perfect for this project |
| **pymongo is already installed** | Our project already has the MongoDB Python driver in requirements.txt |

---

## 3. What is MongoDB? (How It Actually Works)

MongoDB organizes data in three levels. Think of it like a filing cabinet:

```
MongoDB Server (the filing cabinet)
  └── Database (a drawer in the cabinet)
        └── Collection (a folder inside the drawer)
              └── Document (a single page/record inside the folder)
```

### Mapped to our project:

```
MongoDB Atlas (cloud server)
  └── sentiment_db (our database)
        └── analyses (our collection)
              └── {text: "I love this!", label: "Positive", score: 97.23, ...}  (document 1)
              └── {text: "Terrible.",    label: "Negative", score: 95.10, ...}  (document 2)
              └── {text: "It was okay.", label: "Neutral",  score: 68.40, ...}  (document 3)
```

### Key Vocabulary

| MongoDB Term | Equivalent in SQL/Excel | Equivalent in Real Life |
|-------------|------------------------|------------------------|
| **Database** | Database | A drawer in a filing cabinet |
| **Collection** | Table | A folder inside the drawer |
| **Document** | Row | A single page/record |
| **Field** | Column | A piece of information on the page |

### What does a Document look like?

A document is basically a **Python dictionary** or a **JSON object:**

```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c0d",
  "text": "I love this product!",
  "label": "Positive",
  "score": 97.23,
  "timestamp": "2024-06-18 12:30:00"
}
```

- `_id` → MongoDB automatically adds a unique ID to every document (like a serial number)
- The rest are the fields our app saves

### Basic MongoDB Operations (What our app does)

| Operation | What it does | Python code in our app |
|-----------|-------------|----------------------|
| **Insert** | Save a new document | `collection.insert_one(entry)` |
| **Find** | Retrieve documents | `collection.find({}, {"_id": 0})` |
| **Sort** | Order by a field | `.sort("timestamp", -1)` |
| **Limit** | Get only N results | `.limit(10)` |
| **Aggregate** | Calculate statistics | `collection.aggregate([...])` |

You don't need to write SQL queries. It's all plain Python!

---

## 4. What is MongoDB Atlas?

**MongoDB Atlas** = MongoDB running on the cloud (someone else's servers).

Instead of installing MongoDB on your PC (which is complicated and uses your disk space), Atlas gives you a database that:

- ✅ Runs on **AWS/Google Cloud/Azure** servers
- ✅ Is **free** (512MB on the M0 tier — forever free, no credit card)
- ✅ Is **accessible from anywhere** — your laptop, your phone, from Render deployment
- ✅ Is **automatically backed up** — your data is safe
- ✅ Has a **web dashboard** — you can view your data in a browser
- ✅ Requires **zero installation** on your PC

### How our app connects to Atlas:

```
Your PC (Flask app)
    ↓ sends data via internet using a connection string
MongoDB Atlas (cloud database on AWS/Google/Azure)
    ↓ stores data permanently
    ↓ retrieves data when requested
Your PC (Flask app) ← gets the data back
```

The connection string looks like:
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/sentiment_db
```

It's like a URL — it tells your app exactly where to find the database on the internet.

---

## 5. Step-by-Step: Create Your Atlas Account

### Step 5.1
Open your browser and go to: **https://www.mongodb.com/cloud/atlas/register**

### Step 5.2
You'll see a registration page. You have 3 options:
- **Sign up with Google** (easiest — click this if you have a Gmail account)
- Sign up with GitHub
- Sign up with email + password

### Step 5.3
If you signed up with email, check your inbox for a **verification email** and click the link.

### Step 5.4
You'll see an onboarding questionnaire. Fill it like this:
- **What is your goal?** → "Learn MongoDB"
- **What type of application?** → "Web Application"  
- **Preferred language?** → "Python"
- **What describes you best?** → "Student" or "Developer"

Click **"Finish"** or **"Submit"**

You're now on the MongoDB Atlas Dashboard! 🎉

---

## 6. Step-by-Step: Create a Free Cluster

A "cluster" is basically your database server running in the cloud.

### Step 6.1
You should see a button that says **"Build a Database"** or **"Create"** or **"+ Create Cluster"**. Click it.

(If you're new, Atlas might show this automatically after registration.)

### Step 6.2
You'll see 3 options:

| Option | Price | Storage |
|--------|-------|---------|
| **M0 (Free)** ← Select this! | Free forever | 512MB |
| M2 (Shared) | $9/month | 2GB |
| M10 (Dedicated) | $57/month | 10GB+ |

**Click "M0 Free"** — this is all you need.

### Step 6.3
Choose your **cloud provider and region:**
- **Provider:** Any of them works. Pick **AWS** (it's the default).
- **Region:** Pick the one closest to you geographically.
  - If you're in India → pick **Mumbai (ap-south-1)**
  - If you're in US → pick **Virginia (us-east-1)**

### Step 6.4
**Cluster name:** You can leave it as the default (usually "Cluster0") or rename it to something like "SentimentAI".

### Step 6.5
Click **"Create Deployment"** (or **"Create Cluster"**).

Atlas will take 1-3 minutes to set up your cluster. You'll see a loading animation. Wait for it to finish.

Your free database server is now running in the cloud! ☁️

---

## 7. Step-by-Step: Create a Database User

Atlas requires a **username and password** to connect to your database. This is like a login for your app.

### Step 7.1
After creating the cluster, a popup should appear asking you to create a database user. If not, go to:
**Left sidebar → Security → Database Access → + Add New Database User**

### Step 7.2
Fill in the form:
- **Authentication Method:** Password (default)
- **Username:** Choose something simple, e.g., `harshuser`
- **Password:** Click **"Autogenerate Secure Password"** or type your own

> ⚠️ **IMPORTANT:** Copy this password and save it somewhere (Notepad, sticky note, etc.)! You'll need it later. If the password contains special characters like `@`, `#`, `%`, `!`, they might cause issues in the connection string. Use only letters and numbers to be safe.

### Step 7.3
**Database User Privileges:** Select **"Read and Write to any database"** (this should be the default).

### Step 7.4
Click **"Add User"**

Your database now has a user with login credentials! 🔐

---

## 8. Step-by-Step: Whitelist Your IP Address

MongoDB Atlas blocks ALL connections by default for security. You need to tell it which IP addresses are allowed to connect.

### Step 8.1
Go to: **Left sidebar → Security → Network Access** (or look for a prompt in the setup wizard)

### Step 8.2
Click **"+ Add IP Address"**

### Step 8.3
You have two options:

**Option A — Add your current IP (more secure):**
Click **"Add My Current IP Address"** — this allows only YOUR computer to connect.

**Option B — Allow access from anywhere (easier, recommended for beginners):**
Click **"Allow Access from Anywhere"** — this sets the IP to `0.0.0.0/0`, meaning any computer can connect (they still need the username/password).

> For a learning project, **Option B is fine.** For a production app with sensitive data, you'd use Option A.

### Step 8.4
Click **"Confirm"**

The change takes about 30 seconds to take effect.

Your database now accepts connections from your computer! 🌐

---

## 9. Step-by-Step: Get Your Connection String

The connection string is the "address" your Flask app uses to find your database on the internet.

### Step 9.1
Go to: **Left sidebar → Deployment → Database** (or click on your cluster name)

### Step 9.2
Click the **"Connect"** button on your cluster.

### Step 9.3
A popup appears with connection options. Click **"Drivers"** (it may also be called "Connect your application").

### Step 9.4
Select:
- **Driver:** Python
- **Version:** 3.12 or later (any recent version works)

### Step 9.5
You'll see a connection string that looks like this:

```
mongodb+srv://harshuser:<db_password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### Step 9.6
**Copy this string.** Now you need to make two changes to it:

**Change 1:** Replace `<db_password>` with the actual password you created in Step 7.

**Change 2:** Add `sentiment_db` as the database name before the `?`. 

**Before:**
```
mongodb+srv://harshuser:mypassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

**After:**
```
mongodb+srv://harshuser:mypassword123@cluster0.abc123.mongodb.net/sentiment_db?retryWrites=true&w=majority
```

The `sentiment_db` part tells MongoDB which database to use. Our app is coded to use this exact name.

Save this final string — you'll paste it into your project in the next step.

---

## 10. Step-by-Step: Connect Your Project

Now let's put the connection string into your project.

### Step 10.1
Open your project folder in VS Code:
```
AI-Based-Sentiment-Analyzer-main/
  └── AI-Based-Sentiment-Analyzer-main/
      ├── app.py
      ├── .env.example    ← we'll copy this
      └── ...
```

### Step 10.2
Inside the **inner** `AI-Based-Sentiment-Analyzer-main` folder (where `app.py` is), create a new file called **`.env`**

The easiest way: right-click the `.env.example` file → Copy → Paste → Rename to `.env`

Or in your terminal:
```powershell
cd AI-Based-Sentiment-Analyzer-main
copy .env.example .env
```

### Step 10.3
Open the `.env` file and edit it to look like this:

```env
# Flask
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=my-super-secret-key-12345

# MongoDB Atlas
MONGO_URI=mongodb+srv://harshuser:mypassword123@cluster0.abc123.mongodb.net/sentiment_db?retryWrites=true&w=majority
```

Replace the `MONGO_URI` value with **YOUR actual connection string** from Step 9.

### Step 10.4
**Save the file** (`Ctrl + S`).

> ⚠️ **IMPORTANT:** The `.env` file contains your password. It is listed in `.gitignore`, so it will NOT be uploaded to GitHub. Never share this file publicly.

---

## 11. Step-by-Step: Verify It Works

### Step 11.1
Stop your Flask app if it's running (press `Ctrl + C` in the terminal).

### Step 11.2
Start it again:
```powershell
python AI-Based-Sentiment-Analyzer-main\app.py
```

### Step 11.3
Watch the terminal output. You should see:

```
Loading sentiment model... (this may take a minute on first run)
Sentiment model loaded successfully!
Loading emotion model...
Emotion model loaded successfully!
Connected to MongoDB!               ← ✅ THIS IS THE KEY LINE!
 * Serving Flask app 'app'
 * Running on http://127.0.0.1:5000
```

If you see **"Connected to MongoDB!"** instead of "MongoDB not found" — congratulations, you are connected to your cloud database! 🎉

### Step 11.4
Open **http://localhost:5000** in your browser and analyze a few texts. Then go to the **History** tab — your results are now permanently saved!

### Step 11.5
Stop the server (`Ctrl + C`), restart it, and check History again — **your old results are still there!** That's the power of a database.

---

## 12. How to View Your Data in Atlas

You can see your actual saved data directly in the Atlas web dashboard.

### Step 12.1
Go to **https://cloud.mongodb.com** and log in.

### Step 12.2
Click on your cluster name (e.g., "Cluster0").

### Step 12.3
Click **"Browse Collections"** (or **"Collections"** tab).

### Step 12.4
You'll see:
```
sentiment_db              ← your database
  └── analyses            ← your collection
        └── Document 1: {text: "I love this!", label: "Positive", score: 97.23, ...}
        └── Document 2: {text: "Terrible.",    label: "Negative", score: 95.10, ...}
        └── Document 3: ...
```

You can:
- **View** all your saved analyses
- **Filter** documents (e.g., show only Negative results)
- **Edit** any document by clicking the pencil icon
- **Delete** documents by clicking the trash icon
- **Export** data as JSON or CSV

This is your data living permanently in the cloud! ☁️

---

## 13. How Your Project Uses MongoDB (Code Walkthrough)

Here's exactly what happens in `app.py`:

### Connection (runs once at startup)
```python
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()  # reads .env file

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    client.server_info()  # tries to connect — if it fails, goes to except
    db = client["sentiment_db"]           # select database
    collection = db["analyses"]           # select collection
    USE_MONGO = True
    print("Connected to MongoDB!")
except Exception:
    print("MongoDB not found — using in-memory storage instead.")
```

### Saving a result (every time you analyze text)
```python
def save_result(text, label, score):
    entry = {
        "text": text,
        "label": label,
        "score": round(score * 100, 2),
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    }
    if USE_MONGO:
        collection.insert_one(entry)    # saves to Atlas cloud
        entry.pop("_id", None)          # removes the auto-generated _id
    else:
        history.append(entry)           # saves to RAM (temporary)
    return entry
```

### Retrieving history (when you click the History tab)
```python
def get_history(limit=10):
    if USE_MONGO:
        results = list(
            collection.find({}, {"_id": 0})   # find all, exclude _id field
            .sort("timestamp", -1)             # newest first
            .limit(limit)                      # only last 10
        )
        return results
    else:
        return list(reversed(history[-limit:]))
```

### Getting stats (when you click the Stats tab)
```python
# MongoDB aggregation pipeline — groups all documents by label and counts them
pipeline_agg = [
    {"$group": {"_id": "$label", "count": {"$sum": 1}}}
]
agg = list(collection.aggregate(pipeline_agg))
# Result: [{"_id": "Positive", "count": 15}, {"_id": "Negative", "count": 7}, ...]
```

---

## 14. Troubleshooting Common Errors

### Error: "MongoDB not found — using in-memory storage instead"

**Possible causes:**
1. `.env` file doesn't exist → Create it by copying `.env.example`
2. `.env` file is in the wrong folder → It must be in the same folder as `app.py`
3. `MONGO_URI` is misspelled in `.env` → Check for typos
4. Password contains special characters → Replace `@` with `%40`, `#` with `%23`, etc. Or use a simpler password with only letters and numbers
5. IP not whitelisted → Go to Atlas → Network Access → Add your IP or use `0.0.0.0/0`

### Error: "ServerSelectionTimeoutError"

Your app found the `.env` file but couldn't reach Atlas.

**Possible causes:**
1. Your internet connection is down
2. IP address not whitelisted in Atlas Network Access
3. Cluster is paused (free clusters pause after 60 days of inactivity — go to Atlas and resume it)
4. Connection string is wrong — double check it in Atlas → Connect → Drivers

### Error: "Authentication failed"

**Possible causes:**
1. Wrong username or password in the connection string
2. You changed the password in Atlas but didn't update `.env`
3. Password has special characters that need URL encoding

**Fix:** Go to Atlas → Database Access → Edit User → Update password → Update `.env`

### Error: "bad auth: authentication failed" with special characters

If your password is something like `p@ss#word!`, the special characters break the URL.

**Fix option 1:** Change your password to only use letters and numbers (e.g., `mypassword123`)

**Fix option 2:** URL-encode the special characters:
```
@ → %40
# → %23
! → %21
$ → %24
% → %25
```

So `p@ss#word!` becomes `p%40ss%23word%21` in the connection string.

### I connected but History tab shows no data

**This is normal!** Connecting to a new database means starting fresh — there's no old data in it yet. Analyze a few texts and then check History again.

### How to check if .env is being loaded

Add this temporary line to the top of `app.py` (after `load_dotenv()`):
```python
print("MONGO_URI:", os.getenv("MONGO_URI", "NOT FOUND"))
```
If it prints `NOT FOUND`, the `.env` file isn't being loaded. Check the file location and name.

**Remove this line after debugging!** You don't want your password printed in the terminal.

---

*Once you see "Connected to MongoDB!" in your terminal, you're all set! Your analysis data is now permanently saved in the cloud.* ☁️
