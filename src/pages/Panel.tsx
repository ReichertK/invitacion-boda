import { useEffect, useMemo, useState } from 'react'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { collection, onSnapshot, type Timestamp } from 'firebase/firestore'
import {
  Loader2,
  LogOut,
  KeyRound,
  Users,
  UserCheck,
  UserX,
  Clock,
  Phone,
  Utensils,
  Music,
  MessageSquare,
  Heart,
  Search,
  ShieldAlert,
} from 'lucide-react'
import { app, db } from '@/lib/firebase'
import { guests } from '@/data/guests'
import { wedding } from '@/data/wedding'
import { Button } from '@/components/ui/button'

const auth = getAuth(app)

interface RsvpDoc {
  guestId: string
  name: string
  invitedPasses: number
  attending: boolean
  attendingLabel: string
  attendeesCount: number
  attendeeNames: string
  contact: string
  dietary: string
  song: string
  notes: string
  summary: string
  updatedAt?: Timestamp
  clientUpdatedAt?: string
  meta?: Record<string, string>
}

interface WishDoc {
  id: string
  guestId: string
  guestName: string
  name: string
  message: string
  createdAt?: Timestamp
  clientCreatedAt?: string
}

type Status = 'yes' | 'no' | 'pending'
type Filter = 'all' | Status

interface Row {
  id: string
  name: string
  invited: number
  status: Status
  rsvp?: RsvpDoc
}

const filterLabels: Record<Filter, string> = {
  all: 'Todos',
  yes: 'Confirmados',
  no: 'No asisten',
  pending: 'Sin responder',
}

// La fecha del servidor puede tardar un instante en propagarse: si falta, se usa
// la del navegador que se guardó en paralelo.
function formatDate(ts?: Timestamp, iso?: string): string {
  const date = ts?.toDate?.() ?? (iso ? new Date(iso) : null)
  if (!date || Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export default function Panel() {
  const [user, setUser] = useState<User | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => onAuthStateChanged(auth, (u) => {
    setUser(u)
    setCheckingAuth(false)
  }), [])

  if (checkingAuth) {
    return (
      <Shell>
        <div className="flex justify-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </Shell>
    )
  }

  return user ? <Dashboard user={user} /> : <LoginForm />
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="min-h-svh px-4 py-10 text-foreground sm:px-6"
      style={{
        background: 'linear-gradient(180deg, var(--parchment) 0%, var(--parchment-dark) 100%)',
      }}
    >
      <div className="mx-auto max-w-5xl">{children}</div>
    </main>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch {
      setError('Usuario o contraseña incorrectos.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Shell>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 flex max-w-sm flex-col gap-5 rounded-md border border-metal/30 bg-card/60 px-6 py-8 shadow-md"
      >
        <div className="text-center">
          <KeyRound className="mx-auto size-9 text-primary" strokeWidth={1.5} />
          <h1 className="font-heading mt-4 text-2xl text-primary">Registro Real</h1>
          <p className="font-serif mt-1 text-sm text-muted-foreground">
            Panel privado de {wedding.groom} &amp; {wedding.bride}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-heading text-xs uppercase tracking-widest text-metal">
            Correo
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="font-serif rounded-md border border-metal/30 bg-background px-3 py-2 text-foreground outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-heading text-xs uppercase tracking-widest text-metal">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="font-serif rounded-md border border-metal/30 bg-background px-3 py-2 text-foreground outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40"
          />
        </div>

        {error && <p className="text-center text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" disabled={busy} className="font-heading uppercase tracking-widest">
          {busy ? <Loader2 className="size-4 animate-spin" /> : 'Entrar'}
        </Button>
      </form>
    </Shell>
  )
}

function Dashboard({ user }: { user: User }) {
  const [rsvps, setRsvps] = useState<Record<string, RsvpDoc>>({})
  const [wishes, setWishes] = useState<WishDoc[]>([])
  const [denied, setDenied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const stopRsvps = onSnapshot(
      collection(db, 'rsvps'),
      (snap) => {
        const next: Record<string, RsvpDoc> = {}
        snap.forEach((d) => {
          next[d.id] = d.data() as RsvpDoc
        })
        setRsvps(next)
        setLoading(false)
      },
      () => {
        setDenied(true)
        setLoading(false)
      },
    )
    const stopWishes = onSnapshot(
      collection(db, 'wishes'),
      (snap) => {
        setWishes(
          snap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<WishDoc, 'id'>) }))
            .sort((a, b) => (b.clientCreatedAt ?? '').localeCompare(a.clientCreatedAt ?? '')),
        )
      },
      () => setDenied(true),
    )
    return () => {
      stopRsvps()
      stopWishes()
    }
  }, [])

  const rows = useMemo<Row[]>(
    () =>
      Object.values(guests).map((g) => {
        const rsvp = rsvps[g.id]
        const status: Status = !rsvp ? 'pending' : rsvp.attending ? 'yes' : 'no'
        return { id: g.id, name: g.name, invited: g.passes, status, rsvp }
      }),
    [rsvps],
  )

  const stats = useMemo(() => {
    const invitedSeats = rows.reduce((acc, r) => acc + r.invited, 0)
    const confirmedSeats = rows.reduce(
      (acc, r) => acc + (r.status === 'yes' ? (r.rsvp?.attendeesCount ?? 0) : 0),
      0,
    )
    return {
      invitations: rows.length,
      invitedSeats,
      confirmedSeats,
      declined: rows.filter((r) => r.status === 'no').length,
      pending: rows.filter((r) => r.status === 'pending').length,
    }
  }, [rows])

  const visible = useMemo(() => {
    const term = normalize(search.trim())
    return rows.filter((r) => {
      if (filter !== 'all' && r.status !== filter) return false
      if (!term) return true
      return normalize(r.name).includes(term) || r.id.includes(term)
    })
  }, [rows, filter, search])

  if (denied) {
    return (
      <Shell>
        <div className="mx-auto max-w-md rounded-md border border-destructive/40 bg-card/60 px-6 py-8 text-center">
          <ShieldAlert className="mx-auto size-9 text-destructive" strokeWidth={1.5} />
          <p className="font-heading mt-4 text-xl text-primary">Sin permiso de lectura</p>
          <p className="font-serif mt-2 text-sm text-muted-foreground">
            Tu usuario está autenticado pero las reglas de Firestore todavía no lo habilitan.
            Agregá este UID a la lista de administradores y volvé a publicar las reglas:
          </p>
          <code className="mt-4 block break-all rounded bg-muted px-3 py-2 text-sm">{user.uid}</code>
          <Button
            variant="outline"
            onClick={() => void signOut(auth)}
            className="font-heading mt-6 uppercase tracking-widest"
          >
            <LogOut className="size-4" /> Salir
          </Button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-metal/30 pb-6">
        <div>
          <h1 className="font-heading text-3xl text-primary">Registro Real</h1>
          <p className="font-serif text-sm text-muted-foreground">
            Confirmaciones y deseos · {wedding.dateLabel}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void signOut(auth)}
          className="font-heading uppercase tracking-widest"
        >
          <LogOut className="size-4" /> Salir
        </Button>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              icon={<UserCheck className="size-5" />}
              label="Personas confirmadas"
              value={`${stats.confirmedSeats} / ${stats.invitedSeats}`}
            />
            <StatCard
              icon={<UserX className="size-5" />}
              label="No asisten"
              value={String(stats.declined)}
            />
            <StatCard
              icon={<Clock className="size-5" />}
              label="Sin responder"
              value={String(stats.pending)}
            />
            <StatCard
              icon={<Users className="size-5" />}
              label="Invitaciones"
              value={String(stats.invitations)}
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {(Object.keys(filterLabels) as Filter[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`font-heading rounded-md border px-3 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                  filter === key
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-metal/30 text-metal hover:border-metal/60'
                }`}
              >
                {filterLabels[key]}
              </button>
            ))}

            <div className="relative ml-auto">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-metal" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar invitado"
                className="font-serif rounded-md border border-metal/30 bg-background py-2 pr-3 pl-9 text-sm text-foreground outline-none focus-visible:border-primary"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {visible.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No hay invitados en esta vista.
              </p>
            )}
            {visible.map((row) => (
              <GuestCard key={row.id} row={row} />
            ))}
          </div>

          <section className="mt-14">
            <h2 className="font-heading flex items-center gap-2 text-2xl text-primary">
              <Heart className="size-5" strokeWidth={1.5} /> Libro de deseos ({wishes.length})
            </h2>
            <div className="mt-6 flex flex-col gap-4">
              {wishes.length === 0 && (
                <p className="text-sm text-muted-foreground">Todavía no hay mensajes.</p>
              )}
              {wishes.map((wish) => (
                <article
                  key={wish.id}
                  className="rounded-md border border-metal/30 bg-card/60 px-5 py-4 shadow-sm"
                >
                  <p className="font-serif text-foreground italic">“{wish.message}”</p>
                  <p className="mt-3 text-xs uppercase tracking-widest text-metal">
                    {wish.name}
                    {wish.guestName && wish.guestName !== wish.name && ` · invitación de ${wish.guestName}`}
                    {' · '}
                    {formatDate(wish.createdAt, wish.clientCreatedAt)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </Shell>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-metal/30 bg-card/60 px-4 py-5 text-center shadow-sm">
      <span className="mx-auto flex justify-center text-primary">{icon}</span>
      <p className="font-heading mt-2 text-2xl text-foreground">{value}</p>
      <p className="mt-1 text-[0.65rem] uppercase tracking-widest text-metal">{label}</p>
    </div>
  )
}

function GuestCard({ row }: { row: Row }) {
  const { rsvp } = row
  const badge =
    row.status === 'yes'
      ? { text: 'Asiste', className: 'border-primary bg-primary/10 text-primary' }
      : row.status === 'no'
        ? { text: 'No asiste', className: 'border-destructive/50 bg-destructive/10 text-destructive' }
        : { text: 'Sin responder', className: 'border-metal/40 bg-muted text-metal' }

  return (
    <article className="rounded-md border border-metal/30 bg-card/60 px-5 py-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-serif text-lg text-foreground">{row.name}</p>
          <p className="text-xs uppercase tracking-widest text-metal">
            {row.status === 'yes'
              ? `${rsvp?.attendeesCount ?? 0} de ${row.invited} ${row.invited === 1 ? 'lugar' : 'lugares'}`
              : `${row.invited} ${row.invited === 1 ? 'lugar invitado' : 'lugares invitados'}`}
          </p>
        </div>
        <span
          className={`font-heading rounded-md border px-3 py-1 text-xs uppercase tracking-widest ${badge.className}`}
        >
          {badge.text}
        </span>
      </div>

      {rsvp && (
        <>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field icon={<Users className="size-4" />} label="Quiénes asisten" value={rsvp.attendeeNames} />
            <Field icon={<Phone className="size-4" />} label="Contacto" value={rsvp.contact} />
            <Field icon={<Utensils className="size-4" />} label="Alergias / dieta" value={rsvp.dietary} />
            <Field icon={<Music className="size-4" />} label="Canción" value={rsvp.song} />
            <Field icon={<MessageSquare className="size-4" />} label="Comentarios" value={rsvp.notes} />
          </dl>

          <details className="mt-4 text-xs text-muted-foreground">
            <summary className="cursor-pointer uppercase tracking-widest text-metal">
              Detalle del envío
            </summary>
            <p className="mt-2">Respondió: {formatDate(rsvp.updatedAt, rsvp.clientUpdatedAt)}</p>
            <p className="mt-1 break-all">Link usado: {rsvp.meta?.url ?? '—'}</p>
            <p className="mt-1 break-all">Dispositivo: {rsvp.meta?.userAgent ?? '—'}</p>
          </details>
        </>
      )}
    </article>
  )
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return null
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-widest text-metal">
        {icon}
        {label}
      </dt>
      <dd className="font-serif mt-0.5 text-foreground">{value}</dd>
    </div>
  )
}
