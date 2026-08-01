import { motion } from 'framer-motion'
import { Palette } from 'lucide-react'
import type { Guest } from '@/data/guests'
import { wedding } from '@/data/wedding'
import { asset } from '@/lib/utils'

interface WelcomeSectionProps {
  guest: Guest
}

// Siluetas de referencia del código de vestimenta (negras sobre blanco -> blend con el pergamino).
const DRESS_MEN = asset('/img/CaballeroElegante2.jpg')
const DRESS_WOMEN = asset('/img/DamaElegante.jpg')

// Saludo personalizado según ?id + texto del edicto + código de vestimenta.
export default function WelcomeSection({ guest }: WelcomeSectionProps) {
  return (
    <section className="px-6 py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="font-serif text-2xl leading-relaxed text-foreground md:text-3xl">
          Estimados <span className="font-semibold text-primary">{guest.name}</span>,
        </p>
        <p className="font-serif mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
          {wedding.intro} {wedding.groom} &amp; {wedding.bride}. Será un honor contar con
          su presencia en este día tan especial.
        </p>
      </motion.div>

      {/* Código de vestimenta en dos columnas (colapsa a una en móvil) */}
      <div className="mx-auto mt-14 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8 text-center"
        >
          <p className="font-heading text-xs uppercase tracking-[0.35em] text-metal">
            Código de vestimenta
          </p>
          <p className="font-heading mt-1 text-2xl font-bold text-primary">
            {wedding.dressCode.label}
          </p>
          <p className="font-serif mt-2 text-muted-foreground">{wedding.dressCode.note}</p>
        </motion.div>

        {/* Las siluetas NO van dentro de un contenedor animado: cualquier opacity o
            transform crea un grupo aislado y el mix-blend-multiply mostraría el borde
            blanco de la imagen. Sin animación, el multiply actúa contra el gradiente
            real de la página y funde perfecto, sin caja de fondo. */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Caballeros */}
          <figure className="flex flex-col items-center text-center">
            <div className="relative h-64 w-full overflow-hidden md:h-72">
              {/* La imagen trae bastante margen en blanco: la agrandamos y subimos
                  para que la figura llene el alto y quede a la par de la dama. */}
              <img
                src={DRESS_MEN}
                alt="Silueta de caballero elegante"
                loading="lazy"
                style={{ filter: 'brightness(1.12) contrast(1.08)' }}
                className="absolute left-1/2 top-0 h-[138%] w-auto max-w-none -translate-x-1/2 -translate-y-[13%] object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
              />
            </div>
            <figcaption className="mt-4">
              <p className="font-heading text-lg uppercase tracking-widest text-ink">
                Caballeros
              </p>
              <p className="font-serif mt-1 text-muted-foreground">{wedding.dressCode.men}</p>
            </figcaption>
          </figure>

          {/* Damas */}
          <figure className="flex flex-col items-center text-center">
            <div className="flex h-64 items-end justify-center md:h-72">
              <img
                src={DRESS_WOMEN}
                alt="Silueta de dama elegante"
                loading="lazy"
                style={{ filter: 'brightness(1.12) contrast(1.08)' }}
                className="h-full w-auto object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
              />
            </div>
            <figcaption className="mt-4">
              <p className="font-heading text-lg uppercase tracking-widest text-ink">
                Damas
              </p>
              <p className="font-serif mt-1 text-muted-foreground">{wedding.dressCode.women}</p>
            </figcaption>
          </figure>
        </div>

        {/* Paleta de colores sugerida + reserva del bordó para las damas de honor */}
        <div className="mt-10 text-center">
          <a
            href={wedding.dressCode.paletteUrl}
            target="_blank"
            rel="noreferrer"
            className="font-heading inline-flex items-center gap-2 rounded-md border border-metal/40 px-5 py-2.5 text-sm uppercase tracking-widest text-primary transition-colors hover:bg-primary/10"
          >
            <Palette className="size-4" strokeWidth={1.5} /> Paleta de colores
          </a>
          <p className="font-serif mt-3 text-muted-foreground">{wedding.dressCode.paletteNote}</p>
          <p className="font-serif mt-1 text-sm text-metal">{wedding.dressCode.reserved}</p>
        </div>
      </div>
    </section>
  )
}
