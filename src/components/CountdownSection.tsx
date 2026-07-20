import { motion } from 'framer-motion'
import { useCountdown } from '@/hooks/useCountdown'
import { WEDDING_DATE } from '@/data/wedding'
import SectionHeading from '@/components/SectionHeading'

// Cuenta regresiva en bloques con acentos metal/borgoña.
export default function CountdownSection() {
  const { days, hours, minutes, seconds, isPast } = useCountdown(WEDDING_DATE)

  const units = [
    { label: 'Días', value: days },
    { label: 'Horas', value: hours },
    { label: 'Minutos', value: minutes },
    { label: 'Segundos', value: seconds },
  ]

  return (
    <section className="px-6 py-14">
      <SectionHeading overline="La cuenta atrás" title="Faltan" />

      {isPast ? (
        <p className="font-serif text-center text-xl text-primary">
          ¡El gran día llegó!
        </p>
      ) : (
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-3 md:gap-4">
          {units.map((u, i) => (
            <motion.div
              key={u.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex flex-col items-center rounded-md border border-metal/40 bg-card px-2 py-4 shadow-md"
            >
              <span className="font-heading text-3xl font-bold text-primary tabular-nums md:text-5xl">
                {String(u.value).padStart(2, '0')}
              </span>
              <span className="mt-1 text-[0.65rem] uppercase tracking-widest text-metal md:text-xs">
                {u.label}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
