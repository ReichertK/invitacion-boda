import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Resuelve rutas a archivos de /public respetando la base del sitio.
// En local la base es '/', en GitHub Pages es '/invitacion-boda/'. Sin esto,
// una ruta absoluta como '/img/foo.png' apunta a la raíz del dominio y da 404.
export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
