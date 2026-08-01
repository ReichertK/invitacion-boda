// Diccionario de invitados para la personalización por URL (?id=slug).
// El slug es lo que va en la URL; name es el saludo real que se muestra.

export interface Guest {
  id: string
  name: string
  passes: number // cantidad de lugares reservados
}

export const guests: Record<string, Guest> = {
  adriana: { id: 'adriana', name: 'Adriana', passes: 1 },
  'lenny-y-camila': { id: 'lenny-y-camila', name: 'Lenny y Camila', passes: 2 },
  monica: { id: 'monica', name: 'Mónica', passes: 1 },
  'silvi-y-luis': { id: 'silvi-y-luis', name: 'Silvi y Luis', passes: 2 },
  camila: { id: 'camila', name: 'Camila', passes: 1 },
  rocio: { id: 'rocio', name: 'Rocío', passes: 1 },
  nicolas: { id: 'nicolas', name: 'Nicolás', passes: 1 },
  ezequiel: { id: 'ezequiel', name: 'Ezequiel', passes: 1 },
  carina: { id: 'carina', name: 'Carina', passes: 1 },
  'mariano-y-agustina': { id: 'mariano-y-agustina', name: 'Mariano y Agustina', passes: 2 },
  gabriela: { id: 'gabriela', name: 'Gabriela', passes: 1 },
  'nerea-atahualpa-y-massimo': {
    id: 'nerea-atahualpa-y-massimo',
    name: 'Nerea, Atahualpa y Massimo',
    passes: 3,
  },
  luis: { id: 'luis', name: 'Luis', passes: 1 },
  'patricia-silvano-y-elias': {
    id: 'patricia-silvano-y-elias',
    name: 'Patricia, Silvano y Elías',
    passes: 3,
  },
  'ivan-y-pamela': { id: 'ivan-y-pamela', name: 'Iván y Pamela', passes: 2 },
  santiago: { id: 'santiago', name: 'Santiago', passes: 1 },
  alexander: { id: 'alexander', name: 'Alexander', passes: 1 },
  elena: { id: 'elena', name: 'Elena', passes: 1 },
  florencia: { id: 'florencia', name: 'Florencia', passes: 1 },
  // Segunda Camila de la lista: renombrá el slug (ej. 'camila-perez') para no confundirlas.
  'camila-2': { id: 'camila-2', name: 'Camila', passes: 1 },
  agar: { id: 'agar', name: 'Agar', passes: 1 },
  'tamara-y-rafael': { id: 'tamara-y-rafael', name: 'Tamara y Rafael', passes: 2 },
  'giuliana-y-nicolas': { id: 'giuliana-y-nicolas', name: 'Giuliana y Nicolás', passes: 2 },
  sergio: { id: 'sergio', name: 'Sergio', passes: 1 },
}

// Invitado genérico cuando no hay ?id en la URL o no matchea.
export const defaultGuest: Guest = {
  id: 'invitado',
  name: 'Estimado invitado',
  passes: 1,
}

export function getGuest(id: string | null): Guest {
  if (!id) return defaultGuest
  return guests[id] ?? defaultGuest
}
