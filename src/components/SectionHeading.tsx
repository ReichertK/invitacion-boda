// Encabezado ornamental reutilizable: título en Cinzel + filete metálico con rombo.

interface SectionHeadingProps {
  overline?: string
  title: string
}

export default function SectionHeading({ overline, title }: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-col items-center text-center">
      {overline && (
        <span className="font-heading mb-2 text-xs uppercase tracking-[0.35em] text-metal">
          {overline}
        </span>
      )}
      <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
        {title}
      </h2>
      <div className="mt-4 flex items-center gap-2">
        <span className="h-px w-12 bg-metal/50" />
        <span className="size-2 rotate-45 bg-primary" />
        <span className="h-px w-12 bg-metal/50" />
      </div>
    </div>
  )
}
