"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"


interface FormData {
  // Personal Information
  fullName: string
  oldSurnames: string
  gender: string
  maritalStatus: string
  dateOfBirth: string
  birthCity: string
  birthDistrict: string
  tcNumber: string
  
  // Contact Information
  address: string
  phone: string
  email: string
  
  // Passport Information
  passportNumber: string
  issuingAuthority: string
  issueDate: string
  expirationDate: string
  
  // US History
  previouslyInUS: string
  visaRejection: string
  visaRejectionReason: string
  
  // Work Information
  occupation: string
  employer: string
  employerAddress: string
  monthlyIncome: string
  workStartDate: string
  jobDescription: string
  
  // Family Information
  fatherName: string
  fatherBirthDate: string
  motherName: string
  motherBirthDate: string
  relativesInUS: string
  spouseName: string
  spouseBirthDate: string
  spouseBirthPlace: string
  spouseNationality: string
  
  // Education and Languages
  education: string
  foreignLanguages: string
  
  // Other Information
  visitedCountries: string
  militaryService: string
  additionalInfo: string
  photo: File | null
}

export default function VisaFormPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    oldSurnames: "",
    gender: "",
    maritalStatus: "",
    dateOfBirth: "",
    birthCity: "",
    birthDistrict: "",
    tcNumber: "",
    address: "",
    phone: "",
    email: "",
    passportNumber: "",
    issuingAuthority: "",
    issueDate: "",
    expirationDate: "",
    previouslyInUS: "",
    visaRejection: "",
    visaRejectionReason: "",
    occupation: "",
    employer: "",
    employerAddress: "",
    monthlyIncome: "",
    workStartDate: "",
    jobDescription: "",
    fatherName: "",
    fatherBirthDate: "",
    motherName: "",
    motherBirthDate: "",
    relativesInUS: "",
    spouseName: "",
    spouseBirthDate: "",
    spouseBirthPlace: "",
    spouseNationality: "",
    education: "",
    foreignLanguages: "",
    visitedCountries: "",
    militaryService: "",
    additionalInfo: "",
    photo: null,
  })

  useEffect(() => {
    // Check if user has valid access code
    const accessCode = sessionStorage.getItem("accessCode")
    if (!accessCode) {
      router.push("/")
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Lütfen geçerli bir resim dosyası seçin')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Resim dosyası 5MB\'dan küçük olmalıdır')
        return
      }
      setFormData((prev) => ({ ...prev, photo: file }))
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const accessCode = sessionStorage.getItem("accessCode")
      
      // Convert photo to base64 if exists
      let photoBase64 = null
      if (formData.photo) {
        const reader = new FileReader()
        photoBase64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(formData.photo!)
        })
      }

      await fetch("/api/send-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: { ...formData, photo: photoBase64 },
          accessCode,
        }),
      })

      sessionStorage.removeItem("accessCode")
      router.push("/success")
    } catch (err) {
      console.error("Form submission error:", err)
      setError("Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border-4 border-primary rounded-lg p-8 shadow-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">DS-160 Vize Başvuru Formu</h1>
            <p className="text-muted-foreground">Tüm alanları eksiksiz doldurun</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b-2 border-border pb-2">👤 KİŞİSEL BİLGİLER</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Ad Soyad <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Mehmet YILMAZ"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Eski Soyadlar</label>
                  <input
                    type="text"
                    name="oldSurnames"
                    value={formData.oldSurnames}
                    onChange={handleInputChange}
                    placeholder="Yok"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Cinsiyet <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Medeni Durum <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="Bekar">Bekar</option>
                    <option value="Evli">Evli</option>
                    <option value="Boşanmış">Boşanmış</option>
                    <option value="Dul">Dul</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Doğum Tarihi <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Doğum İli <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="birthCity"
                    value={formData.birthCity}
                    onChange={handleInputChange}
                    placeholder="İstanbul"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Doğum İlçesi <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="birthDistrict"
                    value={formData.birthDistrict}
                    onChange={handleInputChange}
                    placeholder="Kadıköy"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    TC Kimlik No <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="tcNumber"
                    value={formData.tcNumber}
                    onChange={handleInputChange}
                    placeholder="12345678901"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b-2 border-border pb-2">📞 İLETİŞİM BİLGİLERİ</h2>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Adres <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Atatürk Cad. No:123 Daire:4, Kadıköy/İstanbul 34710"
                  className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Telefon <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+90 555 123 4567"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    E-posta <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="mehmet@example.com"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Passport Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b-2 border-border pb-2">🛂 PASAPORT BİLGİLERİ</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Pasaport No <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    placeholder="U12345678"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Veren Makam <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="issuingAuthority"
                    value={formData.issuingAuthority}
                    onChange={handleInputChange}
                    placeholder="TUZLA/İSTANBUL"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Veriliş Tarihi <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Son Kullanma <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
              </div>
            </div>

            {/* US History */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b-2 border-border pb-2">🇺🇸 ABD GEÇMİŞİ</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Daha Önce ABD'de Bulundu <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="previouslyInUS"
                    value={formData.previouslyInUS}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="Evet">Evet</option>
                    <option value="Hayır">Hayır</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Vize Reddi <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="visaRejection"
                    value={formData.visaRejection}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="Evet">Evet</option>
                    <option value="Hayır">Hayır</option>
                  </select>
                </div>
              </div>
              
              {formData.visaRejection === 'Evet' && (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Vize Red Sebebi <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    name="visaRejectionReason"
                    value={formData.visaRejectionReason}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Red sebebini detaylı olarak açıklayın"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
              )}
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b-2 border-border pb-2">💼 İŞ BİLGİLERİ</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Meslek <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    placeholder="Kuyumcu"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    İşveren <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="employer"
                    value={formData.employer}
                    onChange={handleInputChange}
                    placeholder="Altın Kuyumculuk Ltd. Şti."
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  İşveren Adresi <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="employerAddress"
                  value={formData.employerAddress}
                  onChange={handleInputChange}
                  placeholder="Kapalıçarşı Kuyumcular Çarşısı No:45 Fatih/İstanbul"
                  className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Aylık Gelir <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    placeholder="35.000 TL"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    İşe Başlama <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    name="workStartDate"
                    value={formData.workStartDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  İş Tanımı <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Altın ve gümüş takı satışı yapıyorum. Müşteri danışmanlığı ve takı tasarımı konularında uzmanım. 15 yıldır kuyumculuk sektöründe çalışıyorum."
                  className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  required
                />
              </div>
            </div>

            {/* Family Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b-2 border-border pb-2"> AİLE BİLGİLERİ</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Baba Adı <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="Ali YILMAZ"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Baba Doğum Tarihi <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    name="fatherBirthDate"
                    value={formData.fatherBirthDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Anne Adı <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    placeholder="Fatma YILMAZ"
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Anne Doğum Tarihi <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    name="motherBirthDate"
                    value={formData.motherBirthDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  ABD'deki Akrabalar <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="relativesInUS"
                  value={formData.relativesInUS}
                  onChange={handleInputChange}
                  placeholder="Hayır, Amerika'da akrabam yok, Evet, kuzenim var New York'ta yaşıyor ve 3 kardesim var. isimleri: Ahmet YILMAZ, Ayşe YILMAZ, Mehmet YILMAZ. " 
                  className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  required
                />
              </div>
              
              {formData.maritalStatus === 'Evli' && (
                <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
                  <h3 className="font-semibold text-foreground">Eş Bilgileri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Eş Adı <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        name="spouseName"
                        value={formData.spouseName}
                        onChange={handleInputChange}
                        placeholder="Ayşe YILMAZ"
                        className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Eş Doğum Tarihi <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="date"
                        name="spouseBirthDate"
                        value={formData.spouseBirthDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Eş Doğum Yeri <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        name="spouseBirthPlace"
                        value={formData.spouseBirthPlace}
                        onChange={handleInputChange}
                        placeholder="İstanbul"
                        className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Eş Uyruğu <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        name="spouseNationality"
                        value={formData.spouseNationality}
                        onChange={handleInputChange}
                        placeholder="Türk"
                        className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Education and Languages */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b-2 border-border pb-2">🎓 EĞİTİM VE DİL</h2>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Eğitim <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  placeholder="İstanbul Üniversitesi Bilgisayar Mühendisliği 2015-2019"
                  className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Yabancı Diller <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="foreignLanguages"
                  value={formData.foreignLanguages}
                  onChange={handleInputChange}
                  placeholder="İngilizce (İleri), Almanca (Orta)"
                  className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  required
                />
              </div>
            </div>

            {/* Other Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b-2 border-border pb-2">🌍 DİĞER BİLGİLER</h2>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Ziyaret Edilen Ülkeler <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="visitedCountries"
                  value={formData.visitedCountries}
                  onChange={handleInputChange}
                  placeholder="Almanya (2022), Fransa (2021), İtalya (2020)"
                  className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Askerlik <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="militaryService"
                  value={formData.militaryService}
                  onChange={handleInputChange}
                  placeholder="Evet - İstanbul 2019-2020, Er rütbesi"
                  className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Ek Bilgiler
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Turizm amaçlı seyahat planlıyorum"
                  className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b-2 border-border pb-2">📸 FOTOĞRAF</h2>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Pasaport Fotoğrafı <span className="text-destructive">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full px-4 py-2 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  • 5x5 cm boyutunda, beyaz zeminüzerinde<br/>
                  • Son 6 ay içinde çekilmiş olmalı<br/>
                  • Maksimum dosya boyutu: 5MB
                </p>
                {formData.photo && (
                  <div className="mt-3 p-3 bg-secondary/20 rounded-lg">
                    <p className="text-sm text-foreground mb-3">
                      ✅ Seçilen dosya: {formData.photo.name}
                    </p>
                    <div className="flex justify-center">
                      <img 
                        src={URL.createObjectURL(formData.photo)} 
                        alt="Önizleme" 
                        className="w-32 h-32 object-cover border-2 border-border rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border-2 border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end pt-6 border-t-2 border-border">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Gönderiliyor..." : "Formu Gönder"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Tüm alanları eksiksiz ve doğru bir şekilde doldurunuz. Yıldız (*) ile işaretli alanlar zorunludur.
          </p>
        </div>
      </div>
    </div>
  )
}
