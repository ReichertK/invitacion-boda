import { useState } from 'react'
import { motion } from 'framer-motion'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Loader2, PartyPopper, Music, Users, Phone, Utensils, MessageSquare } from 'lucide-react'
import { db } from '@/lib/firebase'
import { clientMeta } from '@/lib/utils'
import type { Guest } from '@/data/guests'
import { Button } from '@/components/ui/button'
import SectionHeading from '@/components/SectionHeading'

interface RSVPSectionProps {
  guest: Guest
}

type Attendance = 'yes' | 'no'

const labelClass = 'font-heading text-xs uppercase tracking-widest text-metal'
const fieldClass =
  'font-serif rounded-md border border-metal/30 bg-background px-3 py-2 text-foreground outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40'

// Confirmación de asistencia. Guarda en Firestore usando el id del invitado
// como id del documento (evita duplicados y permite cambiar de opinión).
export default function RSVPSection({ guest }: RSVPSectionProps) {
  const [attendance, setAttendance] = useState<Attendance | null>(null)
  const [attendeesCount, setAttendeesCount] = useState(guest.passes)
  const [attendeeNames, setAttendeeNames] = useState('')
  const [contact, setContact] = useState('')
  const [dietary, setDietary] = useState('')
  const [song, setSong] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)

  const going = attendance === 'yes'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!attendance || isLoading) return

    setIsLoading(true)
    setError(false)
    const count = going ? attendeesCount : 0
    try {
      await setDoc(doc(db, 'rsvps', guest.id), {
        guestId: guest.id,
        name: guest.name,
        invitedPasses: guest.passes,
        attending: going,
        // Duplicado legible del booleano, para leer la planilla de un vistazo.
        attendingLabel: going ? 'Asiste' : 'No asiste',
        attendeesCount: count,
        attendeeNames: attendeeNames.trim(),
        contact: contact.trim(),
        dietary: dietary.trim(),
        song: song.trim(),
        notes: notes.trim(),
        summary: going
          ? `${guest.name}: asisten ${count} de ${guest.passes}`
          : `${guest.name}: no asiste`,
        updatedAt: serverTimestamp(),
        clientUpdatedAt: new Date().toISOString(),
        meta: clientMeta(),
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
                ? `Reservamos ${attendeesCount} ${attendeesCount === 1 ? 'lugar' : 'lugares'}. ¡Nos vemos en la celebración!`
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

            {going && (
              <>
                {guest.passes > 1 && (
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="attendees"
                      className="font-heading flex items-center gap-2 text-xs uppercase tracking-widest text-metal"
                    >
                      <Users className="size-4" /> ¿Cuántos asisten? (de {guest.passes})
                    </label>
                    <select
                      id="attendees"
                      value={attendeesCount}
                      onChange={(e) => setAttendeesCount(Number(e.target.value))}
                      className={fieldClass}
                    >
                      {Array.from({ length: guest.passes }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'persona' : 'personas'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {guest.passes > 1 && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="attendee-names" className={labelClass}>
                      Nombres de quienes asisten
                    </label>
                    <input
                      id="attendee-names"
                      type="text"
                      value={attendeeNames}
                      onChange={(e) => setAttendeeNames(e.target.value)}
                      placeholder={guest.name}
                      className={fieldClass}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="dietary"
                    className="font-heading flex items-center gap-2 text-xs uppercase tracking-widest text-metal"
                  >
                    <Utensils className="size-4" /> Alergias o restricciones alimentarias
                  </label>
                  <input
                    id="dietary"
                    type="text"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    placeholder="Celíaco, vegetariano, sin lactosa..."
                    className={fieldClass}
                  />
                </div>

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
                    className={fieldClass}
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact"
                className="font-heading flex items-center gap-2 text-xs uppercase tracking-widest text-metal"
              >
                <Phone className="size-4" /> Teléfono o WhatsApp
              </label>
              <input
                id="contact"
                type="tel"
                inputMode="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Para avisarte cualquier cambio"
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="notes"
                className="font-heading flex items-center gap-2 text-xs uppercase tracking-widest text-metal"
              >
                <MessageSquare className="size-4" /> Algo más que debamos saber
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Traslado, horarios, lo que sea"
                className={`${fieldClass} resize-none`}
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
