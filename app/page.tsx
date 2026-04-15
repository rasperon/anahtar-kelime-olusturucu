"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Wand2, Hash, Layers, Layout, Share2, Settings, Loader2, X, ClipboardCheck } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { toast } from "sonner"

export default function Page() {
  const [apiKey, setApiKey] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!apiKey) {
      toast.error("Lütfen önce ayarlardan API anahtarınızı girin.")
      setShowSettings(true)
      return
    }

    if (!prompt) {
      toast.error("Lütfen bir konsept girin.")
      return
    }

    setIsLoading(true)
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

      const fullPrompt = `Aşağıdaki konsept için Pinterest aramalarında kullanılabilecek, estetik ve hedeflenmiş anahtar kelimeler oluştur. Sadece anahtar kelimeleri virgülle ayrılmış bir liste olarak döndür. Başlık veya açıklama ekleme. Konsept: ${prompt}`

      const result = await model.generateContent(fullPrompt)
      const response = await result.response
      const text = response.text()

      const keywords = text.split(",").map(k => k.trim()).filter(k => k.length > 0)
      setResults(keywords)
      toast.success("Anahtar kelimeler oluşturuldu!")
    } catch (error: any) {
      console.error(error)
      toast.error("Hata oluştu: " + (error.message || "Bilinmeyen hata"))
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results.join(", "))
    setCopied(true)
    toast.success("Kopyalandı!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-foreground font-sans selection:bg-primary/20">

      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[140px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] animate-float-delayed" />
      </div>

      {/* Structural Frame */}
      <div className="fixed inset-4 border border-border/50 rounded-[2rem] pointer-events-none z-40 hidden md:block" />

      <div className="relative flex min-h-screen">

        {/* Left Utility Bar */}
        <aside className="w-20 hidden lg:flex flex-col items-center py-12 border-r border-border/40 z-30">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-12 shadow-lg shadow-primary/20">
            <Layout className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-center gap-10 text-muted-foreground/40">
            <Hash className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
            <Layers className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
            <Share2 className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
          </div>
        </aside>

        {/* Main Interface */}
        <div className="flex-1 flex flex-col p-8 md:p-12 lg:p-20 relative">

          {/* Settings Modal (Overlay) */}
          {showSettings && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-full max-w-md glass-studio p-8 rounded-3xl shadow-2xl relative">
                <button
                  onClick={() => setShowSettings(false)}
                  className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ayarlar</h3>
                    <p className="text-sm text-muted-foreground">İşlemler için Gemini API anahtarınızı girin.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Gemini API Key</label>
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="bg-background/50 border-border/40 text-lg py-6"
                    />
                    <p className="text-[10px] text-muted-foreground/60 italic">
                      Uyar: API anahtarınız sadece tarayıcıda tutulur ve sunucuya kaydedilmez.
                    </p>
                  </div>
                  <Button onClick={() => setShowSettings(false)} className="w-full py-6 font-bold">Kaydet ve Kapat</Button>
                </div>
              </div>
            </div>
          )}

          {/* Top Navigation */}
          <nav className="flex justify-between items-center mb-16 md:mb-24">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-[0.3em] text-muted-foreground/60 uppercase mb-1">Stüdyo v1.0</span>
              <h2 className="text-xl font-bold tracking-tight">Keyword<span className="text-primary italic">Lab</span></h2>
            </div>
            <div className="flex gap-4">
              <div className="h-8 w-px bg-border/60 mx-2" />
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 text-xs font-semibold hover:text-primary transition-colors uppercase tracking-wider"
              >
                <Settings className="w-4 h-4" />
                Ayarlar
              </button>
            </div>
          </nav>

          {/* Core Creation Area */}
          <section className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center">

            {!results.length || isLoading ? (
              <div className="space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] text-balance">
                  Moodboardunuzun <br />
                  <span className="text-primary tracking-normal opacity-90">ruhunu</span> tanımlayın.
                </h1>
                <p className="text-xl text-muted-foreground/80 max-w-xl font-medium leading-relaxed">
                  İlham verici görsellere giden yol doğru kelimelerden geçer. Vizyonunuzu yazın, gerisini AI Lab halletsin.
                </p>
              </div>
            ) : null}

            {/* Premium Command Input */}
            <div className={`relative group w-full transition-all duration-700 ${results.length > 0 ? 'mt-0' : 'max-w-2xl'}`}>
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-700" />

              <div className="relative glass-studio rounded-2xl overflow-hidden p-2 transition-all duration-300 group-focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:group-focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 px-4 py-2">
                  <div className="flex items-center gap-4 flex-1">
                    <Search className="w-6 h-6 text-muted-foreground shrink-0" />
                    <input
                      className="flex-1 bg-transparent border-none focus:outline-none text-xl md:text-2xl font-medium placeholder:text-muted-foreground/30 py-4"
                      placeholder="Konseptinizi girin (ör: Retro Siberpunk...)"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                  </div>
                  <Button
                    disabled={isLoading}
                    onClick={handleGenerate}
                    className="rounded-xl px-8 h-12 md:h-14 font-bold shadow-2xl shadow-primary/30 group-hover:scale-[1.01] active:scale-95 transition-all gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                    {isLoading ? "İşleniyor..." : "Oluştur"}
                  </Button>
                </div>

                {/* Micro-interface details */}
                <div className="flex items-center gap-4 px-6 py-3 border-t border-border/20 bg-muted/30">
                  <span className="text-[10px] font-mono text-muted-foreground/60 uppercase">Durum:</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                    <span className="text-[10px] text-muted-foreground/80">{apiKey ? 'Bağlantı Hazır' : 'API Gerekli'}</span>
                  </div>
                </div>
              </div>

              {/* Results Display */}
              {results.length > 0 && !isLoading && (
                <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-top-8 duration-1000">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">Oluşturulan Kelimeler</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      className="text-[10px] uppercase font-bold tracking-widest hover:text-primary transition-colors h-auto p-0"
                    >
                      {copied ? <ClipboardCheck className="w-3 h-3 mr-2 text-green-500" /> : <Hash className="w-3 h-3 mr-2" />}
                      Tümünü Kopyala
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {results.map((word, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-xl glass-studio text-sm font-medium hover:scale-105 transition-all cursor-default border-primary/20 hover:border-primary/50"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions (Visible only when no results) */}
              {!results.length && !isLoading && (
                <div className="mt-8 flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                  {['Muted Tonlar', 'Sinematik', 'Bauhaus Mimarisi', 'Yüzyıl Ortası'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPrompt(s)}
                      className="text-sm text-muted-foreground/60 whitespace-nowrap hover:text-primary hover:translate-y-[-1px] transition-all"
                    >
                      # {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Footer Status */}
          <footer className="mt-auto pt-12 flex justify-between items-end border-t border-border/20">
            <div className="flex gap-8 text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em]">
              <span>Tema değiştirmek için D tuşuna basın</span>
              <span>Model: Gemini 3.0 Pro</span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em]">
              © 2026 KeywordLab Studio
            </div>
          </footer>

        </div>
      </div>
    </main>
  )
}
