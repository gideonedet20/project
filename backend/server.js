require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Manual CORS (no extra package needed) ──────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");           // tighten in prod
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

// ── Telegram Bot (polling disabled — we only send, never receive) ──────────
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// ── Nodemailer transporter (Gmail example) ─────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail address
    pass: process.env.EMAIL_PASS,   // Gmail App Password (not your real password)
  },
});

// ── POST /contact ──────────────────────────────────────────────────────────
app.post("/contact", async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  // Basic validation
  if (!firstName || !email || !message) {
    return res.status(400).json({ success: false, error: "Required fields missing." });
  }

  const fullName = `${firstName} ${lastName || ""}`.trim();
  const subjectLine = subject || "No Subject";
  const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Africa/Lagos" });

  // ── 1. Send Email notification ────────────────────────────────────────────
  const emailHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="background:#0f0f0f;padding:24px 32px;">
        <h2 style="color:#fff;margin:0;font-size:22px;">📬 New Contact Message</h2>
        <p style="color:#9ca3af;margin:4px 0 0;font-size:13px;">Via your portfolio — ${timestamp}</p>
      </div>
      <div style="padding:28px 32px;background:#fff;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;width:110px;">Name</td><td style="padding:10px 0;font-weight:600;">${fullName}</td></tr>
          <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;">Email</td><td style="padding:10px 0;"><a href="mailto:${email}" style="color:#6366f1;">${email}</a></td></tr>
          <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;">Subject</td><td style="padding:10px 0;">${subjectLine}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
        <p style="color:#6b7280;font-size:13px;margin-bottom:8px;">Message</p>
        <p style="background:#f9fafb;border-left:4px solid #6366f1;padding:16px;border-radius:6px;white-space:pre-wrap;">${message}</p>
      </div>
      <div style="background:#f9fafb;padding:16px 32px;text-align:center;">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subjectLine)}" style="display:inline-block;background:#0f0f0f;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;">Reply to ${firstName} →</a>
      </div>
    </div>
  `;

  // ── 2. Telegram message ───────────────────────────────────────────────────
  const telegramMsg =
    `📬 *New Contact Message*\n\n` +
    `👤 *Name:* ${fullName}\n` +
    `📧 *Email:* ${email}\n` +
    `📌 *Subject:* ${subjectLine}\n` +
    `🕐 *Time:* ${timestamp}\n\n` +
    `💬 *Message:*\n${message}`;

  try {
    // Send email
    await transporter.sendMail({
      from: `"Gideon Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.NOTIFY_EMAIL,   // email you want to receive notifications
      subject: `📬 New message from ${fullName}: ${subjectLine}`,
      html: emailHtml,
    });

    // Send Telegram
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, telegramMsg, {
      parse_mode: "Markdown",
    });

    console.log(`[${timestamp}] Message sent — from: ${email}`);
    return res.json({ success: true, message: "Message received! I'll get back to you soon." });

  } catch (err) {
    console.error("Notification error:", err.message);
    return res.status(500).json({ success: false, error: "Failed to send. Please try again." });
  }
});

// ── Health check ───────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "Gideon's contact server is running ✅" }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
