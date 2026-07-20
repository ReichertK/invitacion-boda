import { wedding } from '@/data/wedding'
import SectionHeading from '@/components/SectionHeading'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

// Preguntas frecuentes en acordeón (radix/shadcn).
export default function FAQSection() {
  return (
    <section className="px-6 py-14">
      <SectionHeading overline="Antes de venir" title="Preguntas frecuentes" />

      <div className="mx-auto max-w-2xl rounded-md border border-metal/30 bg-card/60 px-5">
        <Accordion type="single" collapsible className="w-full">
          {wedding.faq.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="font-serif text-foreground">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="font-serif text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
