import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Copy, Check, Feather, Loader2, Heart } from 'lucide-react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { wedding } from '@/data/wedding'
import type { Guest } from '@/data/guests'
import { Button } from '@/components/ui/button'
import SectionHeading from '@/components/SectionHeading'

interface GiftsSectionProps {
  guest: Guest
}

// Bloque sutil de regalos con alias bancario y libro de buenos deseos.
export default function GiftsSection({ guest }: GiftsSectionProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [wishError, setWishError] = useState(false)

  async function copyValue(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      /* clipboard no disponible */
    }
  }

  async function sendWish(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim() || sending) return

    setSending(true)
    setWishError(false)
    try {
      await addDoc(collection(db, 'wishes'), {
        guestId: guest.id,
        name: name.trim() || guest.name,
        message: message.trim(),
        createdAt: serverTimestamp(),
      })
      setSent(true)
    } catch {
      setWishError(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="px-6 py-14">
      <SectionHeading overline="Un presente" title="Regalos" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-md rounded-md border border-metal/30 bg-card/60 px-6 py-8 text-center"
      >
        <Gift className="mx-auto size-9 text-primary" strokeWidth={1.5} />
        <p className="font-serif mt-4 text-lg text-muted-foreground">{wedding.giftNote}</p>

        {wedding.giftAlias ? (
          <div className="mt-6 flex flex-col gap-4">
            {(
              [
                { label: 'Alias', value: wedding.giftAlias },
                { label: 'CVU', value: wedding.giftCvu },
              ] as const
            ).map((item) => (
              <div key={item.label}>
                <p className="font-heading text-xs uppercase tracking-widest text-metal">
                  {item.label}
                </p>
                <div className="mt-2 flex items-center justify-center gap-3">
                  <code className="font-serif rounded bg-muted px-3 py-1.5 text-foreground break-all">
                    {item.value}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyValue(item.value, item.label)}
                    aria-label={`Copiar ${item.label}`}
                    className="shrink-0"
                  >
                    {copied === item.label ? <Check className="text-primary" /> : <Copy />}
                  </Button>
                </div>
              </div>
            ))}
            <p className="font-serif text-sm text-muted-foreground">
              A nombre de {wedding.giftHolder}
            </p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground/70">
            Alias próximamente (completá <code>wedding.giftAlias</code>).
          </p>
        )}
      </motion.div>

      {/* Libro de buenos deseos: guarda cada mensaje en Firestore (colección wishes) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-8 max-w-md rounded-md border border-metal/30 bg-card/60 px-6 py-8 shadow-md"
      >
        {sent ? (
          <div className="flex flex-col items-center text-center">
            <Heart className="size-9 text-primary" strokeWidth={1.5} />
            <p className="font-heading mt-4 text-xl text-primary">¡Gracias por tus palabras!</p>
            <p className="font-serif mt-2 text-muted-foreground">
              Tu mensaje quedó grabado junto a los buenos deseos para los novios.
            </p>
            <button
              type="button"
              onClick={() => {
                setSent(false)
                setMessage('')
              }}
              className="mt-6 text-sm text-metal underline underline-offset-4 hover:text-primary"
            >
              Dejar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={sendWish} className="flex flex-col gap-5">
            <div className="text-center">
              <Feather className="mx-auto size-8 text-primary" strokeWidth={1.5} />
              <p className="font-heading mt-3 text-lg text-primary">Dejá tu mensaje</p>
              <p className="font-serif mt-1 text-sm text-muted-foreground">
                Escribí unas líneas de buenos deseos para {wedding.groom} &amp; {wedding.bride}.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="wish-name" className="font-heading text-xs uppercase tracking-widest text-metal">
                Tu nombre (opcional)
              </label>
              <input
                id="wish-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Quién saluda a los novios"
                className="font-serif rounded-md border border-metal/30 bg-background px-3 py-2 text-foreground outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="wish-message" className="font-heading text-xs uppercase tracking-widest text-metal">
                Mensaje
              </label>
              <textarea
                id="wish-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Un deseo, una bendición, unas palabras..."
                className="font-serif resize-none rounded-md border border-metal/30 bg-background px-3 py-2 text-foreground outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40"
              />
            </div>

            {wishError && (
              <p className="text-center text-sm text-destructive">
                No pudimos guardar tu mensaje. Probá de nuevo en un momento.
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={!message.trim() || sending}
              className="font-heading tracking-widest uppercase"
            >
              {sending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar deseo'
              )}
            </Button>
          </form>
        )}
      </motion.div>
    </section>
  )
}
