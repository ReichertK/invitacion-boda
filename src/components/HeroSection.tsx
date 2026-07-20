import { motion } from 'framer-motion'
import { wedding } from '@/data/wedding'

// Portada: logo, nombres en Cinzel, fecha y la foto de los novios.
export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center px-6 pt-16 pb-12 text-center">
      {/* El logo va dentro de un wrapper con fondo pergamino: mientras framer-motion
          anima la opacidad, el grupo queda aislado y el multiply necesita ese fondo
          debajo para no mostrar por un instante el marco blanco original de la imagen. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-6 bg-parchment"
      >
        <img
          src={wedding.assets.logo}
          alt="Escudo de los novios"
          className="w-56 object-contain mix-blend-multiply md:w-64"
        />
      </motion.div>

      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="font-heading text-xs uppercase tracking-[0.4em] text-metal md:text-sm"
      >
        {wedding.edictTitle}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="font-heading mt-3 flex flex-col items-center gap-y-1 text-5xl font-bold leading-none text-ink md:text-7xl"
      >
        <span>{wedding.groom}</span>
        <span className="text-primary">&amp;</span>
        <span>{wedding.bride}</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="font-serif mt-4 text-lg text-muted-foreground md:text-xl"
      >
        {wedding.dateLabel} · {wedding.timeLabel}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.7 }}
        className="mt-10 w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-md border border-metal/40 shadow-xl">
          <img
            src={wedding.assets.photo}
            alt={`${wedding.groom} y ${wedding.bride}`}
            className="aspect-[4/5] w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10" />
        </div>
      </motion.div>
    </section>
  )
}
