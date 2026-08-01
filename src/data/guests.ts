// Diccionario de invitados para la personalización por URL (?id=slug).
// El slug es lo que va en la URL; name es el saludo real que se muestra.

export interface Guest {
  id: string
  name: string
  passes: number // cantidad de lugares reservados
  gender?: 'f' | 'm' // sólo importa en invitaciones de una persona
}

// "Estimada Rocío" / "Estimado Sergio" / "Estimados Tamara y Rafael".
export function getGreeting(guest: Guest): string {
  if (guest.passes > 1) return 'Estimados'
  return guest.gender === 'f' ? 'Estimada' : 'Estimado'
}

export const guests: Record<string, Guest> = {
  adriana: { id: 'adriana', name: 'Adriana', passes: 1, gender: 'f' },
  'lenny-y-camila': { id: 'lenny-y-camila', name: 'Lenny y Camila', passes: 2 },
  monica: { id: 'monica', name: 'Mónica', passes: 1, gender: 'f' },
  'silvi-y-luis': { id: 'silvi-y-luis', name: 'Silvi y Luis', passes: 2 },
  camila: { id: 'camila', name: 'Camila', passes: 1, gender: 'f' },
  rocio: { id: 'rocio', name: 'Rocío', passes: 1, gender: 'f' },
  nicolas: { id: 'nicolas', name: 'Nicolás', passes: 1, gender: 'm' },
  ezequiel: { id: 'ezequiel', name: 'Ezequiel', passes: 1, gender: 'm' },
  carina: { id: 'carina', name: 'Carina', passes: 1, gender: 'f' },
  'mariano-y-agustina': { id: 'mariano-y-agustina', name: 'Mariano y Agustina', passes: 2 },
  gabriela: { id: 'gabriela', name: 'Gabriela', passes: 1, gender: 'f' },
  'nerea-atahualpa-y-massimo': {
    id: 'nerea-atahualpa-y-massimo',
    name: 'Nerea, Atahualpa y Massimo',
    passes: 3,
  },
  luis: { id: 'luis', name: 'Luis', passes: 1, gender: 'm' },
  'patricia-silvano-y-elias': {
    id: 'patricia-silvano-y-elias',
    name: 'Patricia, Silvano y Elías',
    passes: 3,
  },
  'ivan-y-pamela': { id: 'ivan-y-pamela', name: 'Iván y Pamela', passes: 2 },
  santiago: { id: 'santiago', name: 'Santiago', passes: 1, gender: 'm' },
  alexander: { id: 'alexander', name: 'Alexander', passes: 1, gender: 'm' },
  elena: { id: 'elena', name: 'Elena', passes: 1, gender: 'f' },
  florencia: { id: 'florencia', name: 'Florencia', passes: 1, gender: 'f' },
  'camila-ariana': { id: 'camila-ariana', name: 'Camila Ariana', passes: 1, gender: 'f' },
  agar: { id: 'agar', name: 'Agar', passes: 1, gender: 'f' },
  'tamara-y-rafael': { id: 'tamara-y-rafael', name: 'Tamara y Rafael', passes: 2 },
  'giuliana-y-nicolas': { id: 'giuliana-y-nicolas', name: 'Giuliana y Nicolás', passes: 2 },
  sergio: { id: 'sergio', name: 'Sergio', passes: 1, gender: 'm' },
}

// Invitado genérico cuando no hay ?id en la URL o no matchea.
export const defaultGuest: Guest = {
  id: 'invitado',
  name: 'invitado',
  passes: 1,
}

export function getGuest(id: string | null): Guest {
  if (!id) return defaultGuest
  return guests[id] ?? defaultGuest
}
