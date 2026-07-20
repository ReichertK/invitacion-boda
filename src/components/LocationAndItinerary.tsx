import { motion } from 'framer-motion'
import { MapPin, CalendarPlus } from 'lucide-react'
import { wedding, WEDDING_DATE } from '@/data/wedding'
import { Button } from '@/components/ui/button'
import SectionHeading from '@/components/SectionHeading'

// Formatea a UTC compacto (YYYYMMDDTHHMMSSZ) que espera Google Calendar.
function toGCalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

// Enlace dinámico "Agregar a Google Calendar" con los datos del evento.
function buildGCalUrl(): string {
  const start = WEDDING_DATE
  const end = new Date(start.getTime() + 6 * 60 * 60 * 1000) // ~6 h de celebración
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Boda de ${wedding.couple}`,
    dates: `${toGCalDate(start)}/${toGCalDate(end)}`,
    details: `${wedding.intro} ${wedding.couple}.`,
    location: wedding.venueAddress || wedding.venueName || '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// Mapa embebido (o placeholder) + línea de tiempo del cronograma.
export default function LocationAndItinerary() {
  return (
    <section className="px-6 py-14">
      <SectionHeading overline="El lugar y el día" title="Ubicación e itinerario" />

      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
        {/* Mapa */}
        <div>
          {wedding.venueName && (
            <div className="mb-4 flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
              <div>
                <p className="font-serif text-lg text-foreground">{wedding.venueName}</p>
                <p className="text-sm text-muted-foreground">{wedding.venueAddress}</p>
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-md border border-metal/40 shadow-md">
            {wedding.mapEmbedUrl ? (
              <iframe
                src={wedding.mapEmbedUrl}
                title="Mapa del lugar"
                className="aspect-video w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-muted text-center">
                <MapPin className="size-8 text-metal" strokeWidth={1.5} />
                <p className="font-serif text-sm text-muted-foreground">
                  Mapa próximamente
                </p>
                <p className="px-4 text-xs text-muted-foreground/70">
                  Pegá la URL en <code>wedding.mapEmbedUrl</code>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Itinerario */}
        <div className="relative pl-6">
          <span className="absolute top-2 bottom-2 left-1.5 w-px bg-metal/40" />
          <ul className="space-y-8">
            {wedding.itinerary.map((item, i) => (
              <motion.li
                key={item.time}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative"
              >
                <span className="absolute top-1.5 -left-[1.4rem] size-3 rounded-full border-2 border-primary bg-background" />
                <p className="font-heading text-sm font-semibold text-primary">
                  {item.time} hs
                </p>
                <p className="font-serif text-lg text-foreground">{item.title}</p>
                {item.description && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button asChild variant="outline" size="lg" className="font-heading tracking-wide">
          <a href={buildGCalUrl()} target="_blank" rel="noreferrer">
            <CalendarPlus className="size-4" />
            Agregar a Google Calendar
          </a>
        </Button>
      </div>
    </section>
  )
}
