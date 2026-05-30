# Gideon Portfolio — Contact Backend
## Email + Telegram Notification Server

---

## 📁 Files in this folder

| File | Purpose |
|------|---------|
| `server.js` | Express backend — receives form data, sends email & Telegram |
| `index.js` | Updated frontend JS — replace your existing index.js with this |
| `.env.example` | Config template — copy to `.env` and fill in your values |
| `package.json` | Dependencies |

---

## 🚀 Setup Guide (Step by Step)

### Step 1 — Install Node.js
Download from https://nodejs.org (choose LTS version)

### Step 2 — Install dependencies
```bash
cd contact-backend
npm install
```

### Step 3 — Get a Gmail App Password
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (required)
3. Search for **"App Passwords"**
4. Select **Mail** → **Other** → name it "Portfolio"
5. Copy the 16-character password shown

### Step 4 — Create a Telegram Bot
1. Open Telegram → search **@BotFather**
2. Send `/newbot`
3. Follow prompts → copy the **bot token** (looks like `123456:ABCdef...`)
4. Start a chat with your new bot (send it any message)
5. Get your **Chat ID**:
   - Open this URL in your browser (replace YOUR_TOKEN):
   `https://api.telegram.org/botYOUR_TOKEN/getUpdates`
   - Find `"chat"` → `"id"` in the response
   - Copy that number

### Step 5 — Create your .env file
```bash
cp .env.example .env
```
Then open `.env` and fill in all 5 values.

### Step 6 — Start the server
```bash
npm start
```
You should see: `Server running on http://localhost:3000`

### Step 7 — Update your frontend
Replace your `index.js` with the `index.js` in this folder.

---

## 🌐 Deploying Online (Free)

To make your form work on the live website, deploy the backend:

### Option A — Render.com (Recommended, Free)
1. Push this folder to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Set environment variables (same as .env) in the Render dashboard
5. Deploy → copy the URL (e.g. `https://gideon-contact.onrender.com`)
6. In `index.js`, update:
   ```js
   const BACKEND_URL = "https://gideon-contact.onrender.com/contact";
   ```

### Option B — Railway.app (Also Free)
Same steps — go to https://railway.app

---

## ✅ Testing

With server running, test via terminal:
```bash
curl -X POST http://localhost:3000/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","email":"test@example.com","subject":"Hello","message":"This is a test message"}'
```
You should receive both an email AND a Telegram message instantly.

---

## 📧 What the Email Looks Like
- Beautiful HTML email with your branding
- Shows: Name, Email, Subject, Message, Timestamp
- One-click "Reply" button pre-filled with the sender's email

## 📱 What the Telegram Message Looks Like
```
📬 New Contact Message

👤 Name: John Doe
📧 Email: john@example.com
📌 Subject: Project Inquiry
🕐 Time: 30/05/2025, 10:30:00

💬 Message:
Hi Gideon, I'd love to work with you on...
```
