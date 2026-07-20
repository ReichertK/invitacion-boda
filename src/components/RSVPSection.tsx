import { useState } from 'react'
import { motion } from 'framer-motion'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Loader2, PartyPopper, Music } from 'lucide-react'
import { db } from '@/lib/firebase'
import type { Guest } from '@/data/guests'
import { Button } from '@/components/ui/button'
import SectionHeading from '@/components/SectionHeading'

interface RSVPSectionProps {
  guest: Guest
}

type Attendance = 'yes' | 'no'

// Confirmación de asistencia. Guarda en Firestore usando el id del invitado
// como id del documento (evita duplicados y permite cambiar de opinión).
export default function RSVPSection({ guest }: RSVPSectionProps) {
  const [attendance, setAttendance] = useState<Attendance | null>(null)
  const [song, setSong] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!attendance || isLoading) return

    setIsLoading(true)
    setError(false)
    try {
      await setDoc(doc(db, 'rsvps', guest.id), {
        guestId: guest.id,
        name: guest.name,
        attending: attendance === 'yes',
        song: song.trim(),
        updatedAt: serverTimestamp(),
      })
      setDone(true)
    } catch {
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="px-6 py-14">
      <SectionHeading overline="Tu respuesta" title="Confirmá tu asistencia" />

      <div className="mx-auto max-w-md rounded-md border border-metal/30 bg-card/60 px-6 py-8 shadow-md">
        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            <PartyPopper className="size-10 text-primary" strokeWidth={1.5} />
            <p className="font-heading mt-4 text-xl text-primary">¡Gracias, {guest.name}!</p>
            <p className="font-serif mt-2 text-muted-foreground">
              {attendance === 'yes'
                ? 'Tu lugar quedó reservado. ¡Nos vemos en la celebración!'
                : 'Lamentamos que no puedas acompañarnos. ¡Gracias por avisar!'}
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-6 text-sm text-metal underline underline-offset-4 hover:text-primary"
            >
              Modificar mi respuesta
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <fieldset className="flex flex-col gap-3">
              <legend className="font-serif mb-2 text-center text-lg text-foreground">
                ¿Nos acompañás?
              </legend>

              {(
                [
                  { value: 'yes', label: 'Sí, estaré allí' },
                  { value: 'no', label: 'Lamentablemente no podré asistir' },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-colors ${
                    attendance === opt.value
                      ? 'border-primary bg-primary/10'
                      : 'border-metal/30 hover:border-metal/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value={opt.value}
                    checked={attendance === opt.value}
                    onChange={() => setAttendance(opt.value)}
                    className="size-4 accent-primary"
                  />
                  <span className="font-serif text-foreground">{opt.label}</span>
                </label>
              ))}
            </fieldset>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="song"
                className="font-heading flex items-center gap-2 text-xs uppercase tracking-widest text-metal"
              >
                <Music className="size-4" /> Sugerencia de canción (opcional)
              </label>
              <input
                id="song"
                type="text"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                placeholder="Esa canción que no puede faltar..."
                className="font-serif rounded-md border border-metal/30 bg-background px-3 py-2 text-foreground outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40"
              />
            </div>

            {error && (
              <p className="text-center text-sm text-destructive">
                Hubo un problema al enviar. Probá de nuevo en un momento.
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={!attendance || isLoading}
              className="font-heading tracking-widest uppercase"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
