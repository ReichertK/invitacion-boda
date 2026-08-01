import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { wedding } from '@/data/wedding'
import { getGuest } from '@/data/guests'
import Envelope from '@/components/Envelope'
import HeroSection from '@/components/HeroSection'
import WelcomeSection from '@/components/WelcomeSection'
import CountdownSection from '@/components/CountdownSection'
import LocationAndItinerary from '@/components/LocationAndItinerary'
import GiftsSection from '@/components/GiftsSection'
import RSVPSection from '@/components/RSVPSection'
import FAQSection from '@/components/FAQSection'

function App() {
  const [isOpened, setIsOpened] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Personalización por URL: ?id=slug -> invitado (o genérico por defecto).
  const [searchParams] = useSearchParams()
  const guest = getGuest(searchParams.get('id'))

  // Reproduce la música DENTRO del gesto del clic (evita el bloqueo de autoplay).
  function playMusic() {
    if (!audioRef.current) {
      const audio = new Audio(encodeURI(wedding.assets.audio))
      audio.loop = true
      audio.volume = 0.6
      audioRef.current = audio
    }
    void audioRef.current
      .play()
      .then(() => setMusicOn(true))
      .catch(() => {
        /* el navegador puede rechazar; se reintenta con otra interacción */
      })
  }

  // Pausa o reanuda la música desde el botón flotante.
  function toggleMusic() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      void audio
        .play()
        .then(() => setMusicOn(true))
        .catch(() => {})
    } else {
      audio.pause()
      setMusicOn(false)
    }
  }

  // Se llama al terminar la animación de apertura, para desmontar el sobre.
  function finishOpen() {
    setIsOpened(true)
  }

  return (
    <>
      <main
        className="min-h-svh text-foreground"
        style={{
          background:
            'linear-gradient(180deg, var(--parchment) 0%, var(--parchment-dark) 100%)',
        }}
      >
        <div className="mx-auto max-w-4xl">
          <HeroSection />
          <WelcomeSection guest={guest} />
          <CountdownSection />
          <LocationAndItinerary />
          <GiftsSection guest={guest} />
          <RSVPSection guest={guest} />
          <FAQSection />

          <footer className="px-6 py-10 text-center">
            <p className="font-heading text-lg text-primary">
              {wedding.groom} &amp; {wedding.bride}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-metal">
              {wedding.dateLabel}
            </p>
          </footer>
        </div>
      </main>

      <AnimatePresence>
        {!isOpened && (
          <Envelope key="envelope" onOpen={playMusic} onFinish={finishOpen} />
        )}
      </AnimatePresence>

      {isOpened && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={musicOn ? 'Silenciar música' : 'Activar música'}
          className="fixed right-5 bottom-5 z-40 flex size-12 items-center justify-center rounded-full border border-burgundy-deep bg-primary text-parchment shadow-lg ring-2 ring-burgundy-deep/40 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
        >
          {musicOn ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
        </button>
      )}
    </>
  )
}

export default App
