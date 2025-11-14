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
const bot = new TelegramBot(botToken, { polling: false });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'Bot is running', timestamp: new Date() });
});

// Telegram webhook endpoint
app.post('/telegram/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
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
  
  // Set up webhook
  const webhookUrl = process.env.WEBHOOK_URL || `https://${process.env.RAILWAY_STATIC_URL}/telegram/webhook`;
  bot.setWebHook(webhookUrl)
    .then(() => console.log(`Webhook set to: ${webhookUrl}`))
    .catch(err => console.error('Error setting webhook:', err));
});
