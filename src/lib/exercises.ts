export type Exercise = {
  id: string;
  title: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  durationSeconds: number;
};

export const exercises: Exercise[] = [
  {
    id: 'zwerchfellatmung',
    title: 'Übung 1: Zwerchfellatmung',
    description: 'Lege eine Hand auf den Bauch. Atme ruhig in den Bauch hinein, nicht in den Brustkorb.',
    inhale: 4,
    hold: 0,
    exhale: 6,
    durationSeconds: 60
  },
  {
    id: 'wellen-loslassen',
    title: 'Übung 2: Wellen-Loslassen',
    description: 'Spanne minimal an, halte kurz, und lass dann los, als würde eine Welle die Spannung mit sich fortziehen.',
    inhale: 3,
    hold: 3,
    exhale: 13,
    durationSeconds: 90
  },
  {
    id: 'reverse-kegel',
    title: 'Übung 3: Reverse Kegel',
    description: 'Stelle dir vor, wie sich der Beckenboden beim Ausatmen sanft öffnet und nach unten sinkt, statt sich anzuspannen.',
    inhale: 4,
    hold: 2,
    exhale: 7,
    durationSeconds: 90
  },
  {
    id: 'anspannen-loslassen',
    title: 'Übung 4: Anspannen & Loslassen',
    description: 'Spanne den Beckenboden nur leicht an (ca. 30% Kraft), halte kurz, und lass dann bewusst lange und vollständig los.',
    inhale: 4,
    hold: 2,
    exhale: 9,
    durationSeconds: 90
  },
  {
    id: '4-7-8-atmung',
    title: 'Übung 5: 4-7-8-Atmung',
    description: 'Atme 4 Sekunden durch die Nase ein, halte 7 Sekunden, atme 8 Sekunden langsam durch den Mund aus.',
    inhale: 4,
    hold: 7,
    exhale: 8,
    durationSeconds: 60
  }
];