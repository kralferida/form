"use client"

import type React from "react"

import { useState } from "react"


interface AccessCode {
  code: string
  createdAt: Date
  expiresAt: Date
  used: boolean
}

export default function AdminPage() {
  const [adminPassword, setAdminPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [recentCodes, setRecentCodes] = useState<AccessCode[]>([])
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check - in production, use proper authentication
    if (adminPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || adminPassword === "admin123") {
      setIsAuthenticated(true)
      setError("")

    } else {
      setError("Geçersiz şifre")
    }
  }







  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <div className="bg-card border-4 border-primary rounded-lg p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Admin Paneli</h1>
              <p className="text-muted-foreground">Erişim kodu oluşturmak için giriş yapın</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                  Admin Şifresi
                </label>
                <input
                  id="password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Giriş Yap
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border-4 border-primary rounded-lg p-8 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-primary">Admin Paneli</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Çıkış Yap
            </button>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-4">Kod Oluşturma</h2>
              <p className="text-muted-foreground mb-4">Yeni kod oluşturmak için Telegram'dan:</p>
              <code className="bg-secondary px-4 py-2 rounded-lg text-primary font-mono text-lg">/pass</code>
              <p className="text-sm text-muted-foreground mt-4">komutunu gönderin</p>
            </div>

            {generatedCode && (
              <div className="bg-secondary/50 border-2 border-primary rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3">Oluşturulan Kod:</h3>
                <div className="flex items-center gap-3">
                  <code className="flex-1 bg-background px-4 py-3 rounded-lg text-lg font-mono text-primary border-2 border-border">
                    {generatedCode}
                  </code>
                  <button
                    onClick={() => copyToClipboard(generatedCode)}
                    className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    title="Kopyala"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-3">Bu kod 24 saat geçerlidir ve tek kullanımlıktır.</p>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border-2 border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border-4 border-primary rounded-lg p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Son Oluşturulan Kodlar</h2>
            <button onClick={loadRecentCodes} className="text-sm text-primary hover:text-primary/80 transition-colors">
              Yenile
            </button>
          </div>

          {recentCodes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Henüz kod oluşturulmamış</p>
          ) : (
            <div className="space-y-3">
              {recentCodes.map((codeData, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 ${
                    codeData.used
                      ? "border-muted bg-muted/20"
                      : new Date() > codeData.expiresAt
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <code className="text-sm font-mono text-foreground">{codeData.code}</code>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Oluşturulma: {codeData.createdAt.toLocaleString("tr-TR")}</span>
                        <span>Son Kullanma: {codeData.expiresAt.toLocaleString("tr-TR")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {codeData.used ? (
                        <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
                          Kullanıldı
                        </span>
                      ) : new Date() > codeData.expiresAt ? (
                        <span className="px-3 py-1 bg-destructive/20 text-destructive text-xs font-semibold rounded-full">
                          Süresi Doldu
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                          Aktif
                        </span>
                      )}
                      <button
                        onClick={() => copyToClipboard(codeData.code)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Kopyala"
                      >
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
