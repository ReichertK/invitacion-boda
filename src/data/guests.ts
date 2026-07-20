// Diccionario de invitados para la personalización por URL (?id=slug).
// El slug es lo que va en la URL; name es el saludo real que se muestra.

export interface Guest {
  id: string
  name: string
  passes: number // cantidad de lugares reservados
}

export const guests: Record<string, Guest> = {
  'familia-gimenez': { id: 'familia-gimenez', name: 'Familia Giménez', passes: 4 },
  'lucia-fernandez': { id: 'lucia-fernandez', name: 'Lucía Fernández', passes: 2 },
  'martin-y-sol': { id: 'martin-y-sol', name: 'Martín y Sol', passes: 2 },
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
