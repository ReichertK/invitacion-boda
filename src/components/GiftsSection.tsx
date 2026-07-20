import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Copy, Check } from 'lucide-react'
import { wedding } from '@/data/wedding'
import { Button } from '@/components/ui/button'
import SectionHeading from '@/components/SectionHeading'

// Bloque sutil de regalos con alias bancario y botón para copiar.
export default function GiftsSection() {
  const [copied, setCopied] = useState(false)

  async function copyAlias() {
    if (!wedding.giftAlias) return
    try {
      await navigator.clipboard.writeText(wedding.giftAlias)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard no disponible */
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
          <div className="mt-6">
            <p className="font-heading text-xs uppercase tracking-widest text-metal">
              Alias
            </p>
            <div className="mt-2 flex items-center justify-center gap-3">
              <code className="font-serif rounded bg-muted px-3 py-1.5 text-lg text-foreground">
                {wedding.giftAlias}
              </code>
              <Button size="icon" variant="outline" onClick={copyAlias} aria-label="Copiar alias">
                {copied ? <Check className="text-primary" /> : <Copy />}
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground/70">
            Alias próximamente (completá <code>wedding.giftAlias</code>).
          </p>
        )}
      </motion.div>
    </section>
  )
}
