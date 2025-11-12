"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"


export default function LoginPage() {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch('/api/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      
      const data = await response.json()
      
      if (data.valid) {
        sessionStorage.setItem('accessCode', code.trim().toUpperCase())
        router.push('/form')
      } else {
        setError('Geçersiz, kullanılmış veya süresi dolmuş kod')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border-4 border-primary rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">DS-160 Vize Formu</h1>
            <p className="text-muted-foreground">Erişim kodunuzu girin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-foreground mb-2">
                Erişim Kodu
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Örnek: abc123-def456-ghi789"
                className="w-full px-4 py-3 border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                required
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border-2 border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">Erişim kodunuz 24 saat geçerlidir ve tek kullanımlıktır.</p>
        </div>
      </div>
    </div>
  )
}
