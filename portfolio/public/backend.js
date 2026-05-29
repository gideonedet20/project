// backend.js - Node.js + Express server with Telegram & Email notifications
// Run: npm install express nodemailer dotenv node-fetch cors
// then: node backend.js

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ========== CONFIGURATION ==========
// TELEGRAM: Create a bot via @BotFather, get token, and your chat ID
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE';

// EMAIL (using Gmail SMTP as example)
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-app-password'; // Use App Password for Gmail
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'your-email@gmail.com';

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// ========== TELEGRAM NOTIFICATION FUNCTION ==========
async function sendTelegramNotification(name, email, subject, message) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
    console.log('⚠️ Telegram not configured - skipping');
    return false;
  }
  
  const text = `🔔 *NEW CONTACT REQUEST* 🔔\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n📌 *Subject:* ${subject}\n💬 *Message:* ${message.substring(0, 400)}`;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: TELEGRAM_CHAT_ID, 
        text: text, 
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      })
    });
    const data = await response.json();
    if (data.ok) {
      console.log('✅ Telegram notification sent');
      return true;
    } else {
      console.error('Telegram error:', data.description);
      return false;
    }
  } catch (error) {
    console.error('Telegram send error:', error);
    return false;
  }
}

// ========== EMAIL NOTIFICATION FUNCTION ==========
async function sendEmailNotification(name, email, subject, message) {
  if (!EMAIL_USER || EMAIL_USER === 'your-email@gmail.com') {
    console.log('⚠️ Email not configured - skipping');
    return false;
  }
  
  const mailOptions = {
    from: `"Portfolio Contact" <${EMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `📬 New Contact: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #facc15; margin-bottom: 20px;">✨ New Contact Request</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>${name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Subject:</td><td>${subject}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message:</td><td style="background: #f7fafc; padding: 12px; border-radius: 8px;">${message.replace(/\n/g, '<br>')}</td></tr>
        </table>
        <p style="margin-top: 20px; color: #718096; font-size: 12px;">Sent from your portfolio website</p>
      </div>
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

// ========== API ENDPOINT ==========
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;
  
  // Validation
  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({ 
      success: false, 
      message: 'Valid email is required' 
    });
  }
  
  const fullName = `${firstName} ${lastName}`;
  
  // Send notifications in parallel
  const [telegramSent, emailSent] = await Promise.all([
    sendTelegramNotification(fullName, email, subject, message),
    sendEmailNotification(fullName, email, subject, message)
  ]);
  
  // Log to console (acts as a simple log/DB)
  const contactEntry = {
    id: Date.now(),
    name: fullName,
    email,
    subject,
    message,
    timestamp: new Date().toISOString(),
    telegramSent,
    emailSent
  };
  console.log('📝 Contact saved:', JSON.stringify(contactEntry, null, 2));
  
  // Return response
  res.json({
    success: true,
    message: 'Message received successfully',
    telegramSent,
    emailSent
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Contact API: POST http://localhost:${PORT}/api/contact`);
  console.log(`🔧 Configure .env file with your Telegram Bot Token & Email credentials\n`);
});