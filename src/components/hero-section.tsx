import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PawPrint, BookCheck, BrainCircuit, Sparkles } from 'lucide-react';

const introItems = [
  {
    value: "item-1",
    icon: BrainCircuit,
    title: "Wiedza i doświadczenie",
    content: "Każdy wpis to efekt oceny z perspektywy życia, instynktu i faktów. Rzeczowo i konkretnie – bez przesady, bez zgadywania.",
  },
  {
    value: "item-2",
    icon: BookCheck,
    title: "Przejrzysty system",
    content: "Kolory, ikony, filtry i karty. Prosto, szybko i bez nadmiaru informacji. Nero podpowiada – Ty decydujesz.",
  },
  {
    value: "item-3",
    icon: Sparkles,
    title: "Głos, który zna smak",
    content: "Nero komentuje z wyczuciem – czasem z humorem, zawsze z klasą. Jego styl mówi więcej niż tabelki.",
  },
]

export function HeroSection() {
  return (
    <section className="mb-12 text-center flex flex-col items-center animate-in fade-in duration-500">
      <PawPrint className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
        JediDieta: Nero sprawdza – Ty wybierasz mądrze
      </h1>
      <p className="max-w-3xl mx-auto text-muted-foreground text-lg mb-6">
        Każdy składnik oceniony. Każda decyzja przemyślana. Nero wie, co trafia do miski – i co lepiej zostawić w spokoju.
      </p>
      <p className="max-w-3xl mx-auto text-muted-foreground mb-8">
        Przewodnik JediDieta powstał z myślą o zdrowiu, bezpieczeństwie i wygodzie. Werdykt?{' '}
        <span className="text-green-700 dark:text-green-400 font-semibold">Do miski</span> albo <span className="text-red-700 dark:text-red-400 font-semibold">Do kosza</span>. Nero nie zgaduje – analizuje, porównuje, zatwierdza.
      </p>

      <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto text-left">
        {introItems.map(item => (
           <AccordionItem value={item.value} key={item.value}>
            <AccordionTrigger className='text-lg font-semibold hover:no-underline'>
              <item.icon className="mr-3 h-6 w-6 text-accent shrink-0" /> {item.title}
            </AccordionTrigger>
            <AccordionContent className='text-base text-muted-foreground pl-12'>
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="mt-8 text-lg font-semibold">
        🔍 <strong>Wyszukaj</strong>, 🧠 <strong>przefiltruj</strong>, 👆 <strong>kliknij</strong> – a Nero podpowie, co naprawdę warto podać.
      </p>
    </section>
  );
}
