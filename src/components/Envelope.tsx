import { useState } from 'react'
import { motion } from 'framer-motion'
import { wedding } from '@/data/wedding'

interface EnvelopeProps {
  /** Se dispara con el clic. Reproduce el audio DENTRO del gesto
   *  (si no, el navegador bloquea el autoplay). */
  onOpen: () => void
  /** Se llama cuando termina la animación de apertura, para desmontar. */
  onFinish: () => void
}

const EASE = [0.76, 0, 0.24, 1] as const

// Marco de rosas borgoña (PNG con transparencia). Se estira a viewport completo.
const BORDER_SRC = '/img/BordeRosas.png'

// Sello de lacre subido por el usuario. La imagen (2914x1440) trae el sello
// centrado ocupando ~45% del ancho; backgroundSize 222% + center lo recorta al círculo.
const SEAL_SRC = '/img/SelloCarta.png'

// Gradientes de cada mitad para que el pergamino se vea continuo en la costura.
const TOP_BG =
  'linear-gradient(180deg, var(--parchment) 0%, var(--parchment-dark) 100%)'
const BOTTOM_BG =
  'linear-gradient(180deg, var(--parchment-dark) 0%, var(--parchment) 100%)'

export default function Envelope({ onOpen, onFinish }: EnvelopeProps) {
  const [opening, setOpening] = useState(false)

  function handleOpen() {
    if (opening) return
    setOpening(true)
    onOpen()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0 } }}
      className="fixed inset-0 z-50 overflow-hidden select-none"
    >
      {/* Mitad superior: se desliza hacia arriba */}
      <motion.div
        animate={opening ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
        onAnimationComplete={() => {
          if (opening) onFinish()
        }}
        className="absolute inset-x-0 top-0 h-1/2 overflow-hidden border-b border-metal/40"
        style={{ background: TOP_BG }}
      >
        <div className="pointer-events-none absolute inset-x-4 top-4 bottom-0 rounded-t-sm border border-b-0 border-metal/30 md:inset-x-8 md:top-8" />
        {/* Marco de rosas: mitad superior (anclado arriba, alto = viewport completo).
           El PNG trae un damero gris opaco: brightness lo lleva a blanco y multiply lo funde. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-screen bg-no-repeat"
          style={{
            backgroundImage: `url(${BORDER_SRC})`,
            backgroundSize: '100% 100%',
            mixBlendMode: 'multiply',
            filter: 'contrast(1.4) brightness(1.25)',
          }}
        />
      </motion.div>

      {/* Mitad inferior: se desliza hacia abajo */}
      <motion.div
        animate={opening ? { y: '100%' } : { y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
        className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden border-t border-metal/40"
        style={{ background: BOTTOM_BG }}
      >
        <div className="pointer-events-none absolute inset-x-4 top-0 bottom-4 rounded-b-sm border border-t-0 border-metal/30 md:inset-x-8 md:bottom-8" />
        {/* Marco de rosas: mitad inferior (anclado abajo, alto = viewport completo). */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-screen bg-no-repeat"
          style={{
            backgroundImage: `url(${BORDER_SRC})`,
            backgroundSize: '100% 100%',
            mixBlendMode: 'multiply',
            filter: 'contrast(1.4) brightness(1.25)',
          }}
        />
      </motion.div>

      {/* Capa de contenido (target del clic): nombres + sello + hint */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Tocá para abrir la invitación"
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleOpen()
        }}
        animate={opening ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.35, delay: opening ? 0.25 : 0 }}
        className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center"
      >
        <p className="font-heading mb-2 text-xs uppercase tracking-[0.4em] text-metal md:text-sm">
          {wedding.edictTitle}
        </p>
        <h2 className="font-heading mb-10 flex flex-col items-center gap-y-1 text-4xl font-bold leading-none text-ink md:text-5xl">
          <span>{wedding.groom}</span>
          <span className="text-primary">&amp;</span>
          <span>{wedding.bride}</span>
        </h2>

        {/* Sello de lacre: al abrir escala hacia arriba y se desvanece (se rompe) */}
        <motion.div
          animate={
            opening
              ? {
                  scale: [1, 1.35, 1.7],
                  y: [0, -4, -18],
                  opacity: [1, 1, 0],
                  rotate: [0, -6, 10],
                }
              : { scale: [1, 1.05, 1] }
          }
          transition={
            opening
              ? { duration: 0.4, ease: 'easeIn', times: [0, 0.5, 1] }
              : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative h-28 w-28 rounded-full bg-primary ring-4 ring-burgundy-deep md:h-32 md:w-32"
          style={{
            backgroundImage: `url(${SEAL_SRC})`,
            backgroundSize: '250%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            boxShadow:
              '0 10px 30px -8px oklch(0.3 0.12 22 / 0.6), inset 0 3px 8px oklch(1 0 0 / 0.15), inset 0 -6px 12px oklch(0 0 0 / 0.3)',
          }}
        />

        <p className="font-serif mt-10 text-base italic text-muted-foreground">
          Tocá el sello para abrir
        </p>
      </motion.div>
    </motion.div>
  )
}
