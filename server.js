import express from "express";
import path from "path";
import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// --- Telegram Bot Setup ---
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(ctx => ctx.reply("Welcome! Bot is running on Railway 🚀"));
bot.on("text", ctx => ctx.reply(`You said: ${ctx.message.text}`));

// Webhook callback
app.use(bot.webhookCallback("/bot"));

// --- Serve Dashboard ---
app.use(express.static(path.join(process.cwd(), "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);

  if (WEBHOOK_URL) {
    const fullWebhook = `${WEBHOOK_URL}/bot`;
    try {
      await bot.telegram.setWebhook(fullWebhook);
      console.log("Webhook set:", fullWebhook);
    } catch (err) {
      console.error("Webhook Error:", err);
    }
  }
});
