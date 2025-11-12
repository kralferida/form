// Run this once to set up Telegram webhook
require('dotenv').config({ path: '.env.local' });

const BOT_TOKEN = process.env.PASSWORD_BOT_TOKEN;
const WEBHOOK_URL = 'https://yoursite.vercel.app/api/webhook'; // Deploy sonrası değiştir

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: WEBHOOK_URL })
})
.then(res => res.json())
.then(data => console.log('Webhook set:', data));