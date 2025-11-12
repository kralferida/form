import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import axios from "axios"

admin.initializeApp()

export const onSubmissionCreated = functions.firestore
  .document("submissions/{submissionId}")
  .onCreate(async (snap, context) => {
    const data = snap.data()

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      console.error("Telegram credentials not configured")
      return
    }

    // Format message for Telegram
    const message = `
🇺🇸 Yeni DS-160 Formu Gönderildi!

👤 Ad Soyad: ${data.fullName}
🎂 Doğum Tarihi: ${data.dateOfBirth}
📍 Doğum Yeri: ${data.placeOfBirth}
🆔 TC Kimlik: ${data.nationalId}
📄 Pasaport: ${data.passportNumber}
📅 Pasaport Bitiş: ${data.passportExpiryDate}

💼 Meslek: ${data.occupation}
🏢 Firma: ${data.companyName}
💰 Aylık Gelir: ${data.monthlyIncome}

✉️ E-posta: ${data.email}
📱 Telefon: ${data.phoneNumber}
🏠 Adres: ${data.homeAddress}

👨 Baba: ${data.fatherInfo}
👩 Anne: ${data.motherInfo}

🌍 Ziyaret Edilen Ülkeler: ${data.countriesVisited}
🎓 Eğitim: ${data.education}
🗣️ Diller: ${data.languages}

🇺🇸 Daha Önce ABD'de: ${data.previousUSVisit}
❌ Vize Red: ${data.visaRejection}

📝 Ek Bilgi: ${data.additionalInfo || "Yok"}

⏰ Gönderim: ${new Date(data.submittedAt.toDate()).toLocaleString("tr-TR")}
    `.trim()

    try {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      })
      console.log("Telegram message sent successfully")
    } catch (error) {
      console.error("Error sending Telegram message:", error)
    }
  })
