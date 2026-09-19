export type ExerciseCategory = 'Trigger' | 'Atmen' | 'Lockern' | 'Anspannung';

export type Exercise = {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
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
    category: 'Atmen',
    inhale: 4,
    hold: 0,
    exhale: 6,
    durationSeconds: 60
  },
  {
    id: 'wellen-loslassen',
    title: 'Übung 2: Wellen-Loslassen',
    description: 'Spanne minimal an, halte kurz, und lass dann los, als würde eine Welle die Spannung mit sich fortziehen.',
    category: 'Anspannung',
    inhale: 3,
    hold: 3,
    exhale: 13,
    durationSeconds: 90
  },
  {
    id: 'reverse-kegel',
    title: 'Übung 3: Reverse Kegel',
    description: 'Stelle dir vor, wie sich der Beckenboden beim Ausatmen sanft öffnet und nach unten sinkt, statt sich anzuspannen.',
    category: 'Anspannung',
    inhale: 4,
    hold: 2,
    exhale: 7,
    durationSeconds: 90
  },
  {
    id: 'anspannen-loslassen',
    title: 'Übung 4: Anspannen & Loslassen',
    description: 'Spanne den Beckenboden nur leicht an (ca. 30% Kraft), halte kurz, und lass dann bewusst lange und vollständig los.',
    category: 'Anspannung',
    inhale: 4,
    hold: 2,
    exhale: 9,
    durationSeconds: 90
  },
  {
    id: '4-7-8-atmung',
    title: 'Übung 5: 4-7-8-Atmung',
    description: 'Atme 4 Sekunden durch die Nase ein, halte 7 Sekunden, atme 8 Sekunden langsam durch den Mund aus.',
    category: 'Atmen',
    inhale: 4,
    hold: 7,
    exhale: 8,
    durationSeconds: 60
  },
  {
    id: 'zwerchfell-triggern',
    title: 'Übung 6: Zwerchfell-Triggerung',
    description: 'Trigger dein Zwerchfell abwechselnd links und rechts am Rippenbogen mit ruhiger, geführter Anleitung.',
    category: 'Trigger',
    inhale: 4,
    hold: 10,
    exhale: 2,
    durationSeconds: 100
  },
  {
    id: 'knie-wackeln',
    title: 'Übung 7: Knie wackeln',
    description: 'Lege dich auf den Rücken, halte die Knie zusammen und wackle zwei Minuten lang ruhig im Takt nach links und rechts.',
    category: 'Lockern',
    inhale: 0,
    hold: 0,
    exhale: 0,
    durationSeconds: 120
  },
  {
    id: 'becken-trampolin',
    title: 'Übung 8: Becken-Trampolin',
    description: 'Hebe dein Becken leicht an und fedre es in einem schnellen, gleichmäßigen Takt wieder ab.',
    category: 'Lockern',
    inhale: 0,
    hold: 0,
    exhale: 0,
    durationSeconds: 75
  }
];