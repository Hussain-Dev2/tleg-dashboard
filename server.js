require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram Bot
const botToken = process.env.BOT_TOKEN;
if (!botToken) {
  console.error("Please provide BOT_TOKEN in .env file");
  process.exit(1);
}
const bot = new TelegramBot(botToken, { polling: true });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'Bot is running', timestamp: new Date() });
});

// Example: HTTP endpoint to send message via bot
app.post('/api/send', async (req, res) => {
  const { chatId, message } = req.body;
  if (!chatId || !message) {
    return res.status(400).json({ error: "chatId and message are required" });
  }
  try {
    await bot.sendMessage(chatId, message);
    res.json({ status: 'Message sent', chatId, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Telegram bot commands
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Hello ${msg.from.first_name}, welcome to Service Bot!`);
});

bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    bot.sendMessage(msg.chat.id, `You said: ${msg.text}`);
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
