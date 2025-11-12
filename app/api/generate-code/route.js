import { generateCode } from '@/lib/cache';

export async function POST() {
  try {
    const code = generateCode();
    
    // Send to Telegram
    try {
      await fetch('/api/send-code-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
    } catch (telegramError) {
      console.error('Telegram error:', telegramError);
    }
    
    return Response.json({ code });
  } catch (error) {
    return Response.json({ error: 'Failed to generate code' }, { status: 500 });
  }
}