// Datos centrales del evento. Editá acá y el resto de la app se actualiza solo.

import { asset } from '@/lib/utils'

export interface ItineraryItem {
  time: string
  title: string
  description?: string
}

export interface FaqItem {
  question: string
  answer: string
}

// Fecha y hora reales: 20 de febrero de 2027, 11:00 AM (hora local).
export const WEDDING_DATE = new Date(2027, 1, 20, 11, 0, 0)

export const wedding = {
  groom: 'Kevin',
  bride: 'Carolina',
  couple: 'Kevin & Carolina',

  // Frase de cabecera del edicto real.
  edictTitle: 'Real Edicto de Bodas',
  intro:
    'Por decreto de dos corazones, se convoca a los presentes a atestiguar la unión de',

  date: WEDDING_DATE,
  dateLabel: '20 de febrero de 2027',
  timeLabel: '11:00 hs',

  // TODO: pegar la URL de "embed" del mapa (Google Maps > Compartir > Insertar un mapa).
  venueName: '',
  venueAddress: '',
  mapEmbedUrl: '',

  dressCode: {
    label: 'Etiqueta rigurosa',
    note: 'Se ruega vestimenta formal, acorde a la solemnidad del edicto.',
    men: 'Traje oscuro o smoking, camisa clara y zapatos de vestir.',
    women: 'Vestido largo o de cóctel elegante. Reservamos el blanco para la novia.',
  },

  // Sección de regalos: alias bancario para transferencias.
  // TODO: reemplazar por el alias real.
  giftAlias: '',
  giftNote: 'Su presencia es el mayor de los tesoros. Si desean obsequiar, pueden hacerlo aquí.',

  itinerary: [
    { time: '11:00', title: 'Ceremonia', description: 'Recepción de los invitados y voto solemne.' },
    { time: '12:30', title: 'Brindis', description: 'Copa de honor y saludos a los novios.' },
    { time: '13:30', title: 'Banquete', description: 'Almuerzo de celebración.' },
    { time: '16:00', title: 'Fiesta', description: 'Música y baile hasta el ocaso.' },
  ] as ItineraryItem[],

  faq: [
    {
      question: '¿Puedo llevar acompañante?',
      answer:
        'Cada invitación indica la cantidad de lugares reservados. Por favor confirmá solo a las personas incluidas.',
    },
    {
      question: '¿Hay estacionamiento?',
      answer: 'Sí, el predio cuenta con espacio para dejar los vehículos.',
    },
    {
      question: '¿Hasta cuándo puedo confirmar?',
      answer: 'Agradecemos la confirmación con al menos tres semanas de anticipación.',
    },
  ] as FaqItem[],

  // Recursos gráficos y de audio (viven en /public).
  assets: {
    logo: asset('/img/logocasamiento.jpeg'),
    photo: asset('/img/kevinycaro.jpg'),
    audio: asset('/Elden Ring - Elden Beast OST Extended (128kbit_AAC).m4a'),
  },
} as const
