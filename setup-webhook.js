// Run this once to set up Telegram webhook
const BOT_TOKEN = '8366313313:AAGTloY0cjaK9RtjKv9OSPp2KS8yH9ZdkSg';
const WEBHOOK_URL = 'https://formds160.vercel.app/api/webhook';

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: WEBHOOK_URL })
})
.then(res => res.json())
.then(data => console.log('Webhook set:', data));