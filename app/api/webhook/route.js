import { generateCode } from '@/lib/cache';

export async function POST(request) {
  try {
    const body = await request.json();
    const { message } = body;
    
    if (!message || !message.text) {
      return Response.json({ ok: true });
    }
    
    const chatId = message.chat.id;
    const text = message.text.trim();
    
    // Check if message is /pass command
    if (text === '/pass') {
      const code = generateCode();
      
      const botToken = process.env.PASSWORD_BOT_TOKEN;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      
      await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔑 *Yeni Erişim Kodu*\n\n\`${code}\`\n\n⏰ 24 saat geçerli\n🔗 Form: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}`,
          parse_mode: 'Markdown'
        })
      });
    }
    
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ ok: true });
  }
}