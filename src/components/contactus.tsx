'use client'

import { useState } from 'react'
import { SiWhatsapp } from 'react-icons/si'; // <-- 1. Impor ikon WhatsApp

export default function ContactUs() {
  const [submitting, setSubmitting] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const payload: Record<string, any> = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('https://formsubmit.co/ajax/dagonzaalfredo@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Gagal mengirim formulir.')
      }

      form.reset()
      setShowPopup(true)
    } catch (err: any) {
      setErrorMsg('Pengiriman gagal. Silakan coba lagi.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contactus" className="py-24 px-6 bg-[#110809] text-white">
      {/* 2. Container utama dibuat lebih lebar untuk menampung grid */}
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-12">
                <span className="text-red-400">Contact</span> Me
            </h2>
        </div>

        {/* 3. Layout Grid dengan 2 kolom */}
        <div className="mt-12 grid md:grid-cols-2 gap-16 items-start">
            
            {/* Kiri: Form Kontak */}
            <div>
                <h3 className="text-2xl font-semibold mb-6 text-white text-center md:text-left">Send Me a Message</h3>
                <form
                    onSubmit={handleSubmit}
                    action="https://formsubmit.co/dagonzaalfredo@gmail.com"
                    method="POST"
                    className="space-y-6"
                >
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_next" value="#" />
                    <input type="hidden" name="_subject" value="Pesan Baru dari Portfolio Website" />

                    <div>
                        <label className="block mb-2 text-sm font-medium text-text-secondary">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="form-input w-full rounded-lg border-2 border-[#472426] bg-[#2c2c2c] p-3 text-text-primary focus:border-[var(--primary-red)] focus:ring-[var(--primary-red)]"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-text-secondary">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="form-input w-full rounded-lg border-2 border-[#472426] bg-[#2c2c2c] p-3 text-text-primary focus:border-[var(--primary-red)] focus:ring-[var(--primary-red)]"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-text-secondary">Message</label>
                        <textarea
                            name="message"
                            required
                            rows={5}
                            className="form-textarea w-full rounded-lg border-2 border-[#472426] bg-[#2c2c2c] p-3 text-text-primary focus:border-[var(--primary-red)] focus:ring-[var(--primary-red)]"
                            placeholder="Your message here..."
                        ></textarea>
                    </div>

                    {errorMsg && (
                        <p className="text-sm text-red-400">{errorMsg}</p>
                    )}

                    <div className="text-center md:text-left pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-full border-2 bg-primary-red px-10 py-4 text-lg font-bold uppercase tracking-wider text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Kanan: Opsi WhatsApp */}
            <div>
                <h3 className="text-2xl font-semibold mb-6 text-white text-center md:text-left">Or Chat Directly</h3>
                <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border-2 border-[#472426] bg-[#2c2c2c] h-full min-h-[300px]">
                    <p className="text-text-secondary mb-6">
                        Click the icon below to start a direct chat with me on WhatsApp.
                    </p>
                    <a 
                        href="https://wa.me/6289685352740" // <-- GANTI DENGAN NOMOR WHATSAPP ANDA
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-400 transition-transform duration-300 hover:scale-110"
                        aria-label="Chat on WhatsApp"
                    >
                        <SiWhatsapp size={90} />
                    </a>
                    <p className="text-sm text-text-secondary mt-6">
                        Usually replies within minutes.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* POPUP TERIMA KASIH (tidak ada perubahan) */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition ${showPopup ? 'visible' : 'invisible'}`}
        aria-hidden={!showPopup}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity ${showPopup ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setShowPopup(false)}
        />
        <div
          className={`relative mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-[#1e1020] p-6 text-center shadow-2xl transition-all ${showPopup ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          role="dialog"
          aria-modal="true"
        >
          <h3 className="text-xl font-bold text-white mb-2">Terima kasih!</h3>
          <p className="text-white/80">
            Terima kasih sudah mengirim pesan, akan saya balas secepatnya.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowPopup(false)}
              className="rounded-full bg-primary-red px-6 py-2 font-semibold text-white shadow hover:scale-105 transition"
              autoFocus
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}