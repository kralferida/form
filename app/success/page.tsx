"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home after 10 seconds
    const timer = setTimeout(() => {
      router.push("/")
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl">
        <div className="bg-card border-4 border-primary rounded-lg p-8 shadow-lg text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Form Başarıyla Gönderildi!</h1>
            <p className="text-muted-foreground text-lg">DS-160 vize başvuru formunuz başarıyla alındı.</p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-foreground mb-3">Sonraki Adımlar:</h2>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">1.</span>
                <span>Form bilgileriniz Telegram üzerinden size iletilecektir.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">2.</span>
                <span>Lütfen gelen bilgileri kontrol edin ve gerekli düzeltmeleri bildirin.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">3.</span>
                <span>Vize randevunuz için gerekli belgeleri hazırlayın.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => router.push("/")}
            className="bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ana Sayfaya Dön
          </button>

          <p className="text-sm text-muted-foreground mt-4">
            10 saniye içinde otomatik olarak ana sayfaya yönlendirileceksiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
