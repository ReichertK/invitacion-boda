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
    men: 'Traje negro, camisa, corbata y zapatos de vestir.',
    women: 'Vestido largo al cuerpo o de cóctel elegante. Se reserva el blanco para la novia.',
    paletteUrl: 'https://pin.it/5g3tPlHAK',
    paletteNote: 'Guiate por la paleta de colores sugerida para los invitados.',
    reserved: 'El bordó queda reservado para las damas de honor.',
  },

  // Sección de regalos: alias bancario para transferencias.
  // TODO: reemplazar por el alias real.
  giftAlias: '',
  giftNote: 'Su presencia es el mayor de los tesoros. Si desean obsequiar, pueden hacerlo aquí.',

  itinerary: [
    { time: '11:00 – 11:30', title: 'Entrada de invitados', description: 'Recepción de los presentes. El ingreso se cierra a las 11:30 en punto.' },
    { time: '12:00', title: 'Ceremonia', description: 'Voto solemne ante los testigos.' },
    { time: '13:00 – 13:30', title: 'Banquete', description: 'Almuerzo de celebración.' },
    { time: '16:00', title: 'Fiesta', description: 'Música, baile y actividades al aire libre.' },
    { time: '18:30', title: 'Finalización', description: 'Cierre del festejo.' },
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
      answer:
        'Pedimos confirmar antes del 31 de agosto de 2026. Además, te pedimos reconfirmar el 16 de enero.',
    },
    {
      question: 'Normas para la ceremonia',
      answer:
        'El ingreso es de 11:00 a 11:30. Pasado ese horario no se permite el acceso, ya que comienza la ceremonia; quien llegue tarde deberá aguardar fuera del establecimiento hasta que finalice (13:00 hs). Durante la ceremonia está prohibido el uso de celulares: los novios desean que estén presentes solo en ese momento tan especial.',
    },
    {
      question: '¿Qué llevo para la tarde?',
      answer:
        'A las 16:00 se habilitan la cancha de fútbol, la cancha de vóley y la piscina. Traé cambio de ropa y lo necesario para esas actividades (toalla, protector solar, etc.).',
    },
  ] as FaqItem[],

  // Recursos gráficos y de audio (viven en /public).
  assets: {
    logo: asset('/img/logocasamiento.jpeg'),
    photo: asset('/img/kevinycaro.jpg'),
    audio: asset('/Elden Ring - Elden Beast OST Extended (128kbit_AAC).m4a'),
  },
} as const
