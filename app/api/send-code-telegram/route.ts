import { NextResponse } from "next/server"

const TELEGRAM_BOT_TOKEN = "8366313313:AAGTloY0cjaK9RtjKv9OSPp2KS8yH9ZdkSg"
const TELEGRAM_CHAT_ID = "1139830029"

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    const message = `🔑 Yeni Erişim Kodu Oluşturuldu\n\nKod: ${code}\n\nGeçerlilik: 24 saat\nDurum: Aktif`

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send Telegram message")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending to Telegram:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}
