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

// Contexto del navegador que se adjunta a cada envío a Firestore. Sirve para
// rastrear un registro dudoso (quién lo mandó, desde dónde, con qué link).
export function clientMeta() {
  return {
    userAgent: navigator.userAgent.slice(0, 300),
    language: navigator.language || '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    screen: `${window.screen.width}x${window.screen.height}`,
    url: window.location.href.slice(0, 500),
    referrer: document.referrer.slice(0, 300),
  }
}
