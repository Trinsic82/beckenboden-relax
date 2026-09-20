export type ExerciseCategory = 'Trigger' | 'Atmen' | 'Lockern' | 'Anspannung';

export type Exercise = {
  id: string;
  title: { de: string; en: string };
  description: { de: string; en: string };
  category: ExerciseCategory;
  inhale: number;
  hold: number;
  exhale: number;
  durationSeconds: number;
};

export const exercises: Exercise[] = [
  {
    id: 'zwerchfellatmung',
    title: { de: 'Übung 1: Zwerchfellatmung', en: 'Exercise 1: Diaphragmatic Breathing' },
    description: { de: 'Lege eine Hand auf den Bauch. Atme ruhig in den Bauch hinein, nicht in den Brustkorb.', en: 'Place one hand on your belly. Breathe calmly into your belly, not your chest.' },
    category: 'Atmen',
    inhale: 4,
    hold: 0,
    exhale: 6,
    durationSeconds: 60
  },
  {
    id: 'wellen-loslassen',
    title: { de: 'Übung 2: Wellen-Loslassen', en: 'Exercise 2: Wave Release' },
    description: { de: 'Spanne minimal an, halte kurz, und lass dann los, als würde eine Welle die Spannung mit sich fortziehen.', en: 'Tense slightly, hold briefly, then release, as if a wave carried the tension away.' },
    category: 'Anspannung',
    inhale: 3,
    hold: 3,
    exhale: 13,
    durationSeconds: 90
  },
  {
    id: 'reverse-kegel',
    title: { de: 'Übung 3: Reverse Kegel', en: 'Exercise 3: Reverse Kegel' },
    description: { de: 'Stelle dir vor, wie sich der Beckenboden beim Ausatmen sanft öffnet und nach unten sinkt, statt sich anzuspannen.', en: 'Imagine your pelvic floor gently opening and sinking down as you exhale, instead of tensing.' },
    category: 'Anspannung',
    inhale: 4,
    hold: 2,
    exhale: 7,
    durationSeconds: 90
  },
  {
    id: 'anspannen-loslassen',
    title: { de: 'Übung 4: Anspannen & Loslassen', en: 'Exercise 4: Tense & Release' },
    description: { de: 'Spanne den Beckenboden nur leicht an (ca. 30% Kraft), halte kurz, und lass dann bewusst lange und vollständig los.', en: 'Tense your pelvic floor only lightly (about 30% effort), hold briefly, then consciously release fully and slowly.' },
    category: 'Anspannung',
    inhale: 4,
    hold: 2,
    exhale: 9,
    durationSeconds: 90
  },
  {
    id: '4-7-8-atmung',
    title: { de: 'Übung 5: 4-7-8-Atmung', en: 'Exercise 5: 4-7-8 Breathing' },
    description: { de: 'Atme 4 Sekunden durch die Nase ein, halte 7 Sekunden, atme 8 Sekunden langsam durch den Mund aus.', en: 'Inhale through your nose for 4 seconds, hold for 7 seconds, exhale slowly through your mouth for 8 seconds.' },
    category: 'Atmen',
    inhale: 4,
    hold: 7,
    exhale: 8,
    durationSeconds: 60
  },
  {
    id: 'zwerchfell-triggern',
    title: { de: 'Übung 6: Zwerchfell-Triggerung', en: 'Exercise 6: Diaphragm Triggering' },
    description: { de: 'Trigger dein Zwerchfell abwechselnd links und rechts am Rippenbogen mit ruhiger, geführter Anleitung.', en: 'Place your hand on your rib arch, breathe in, and as you exhale press a little deeper and hold for ten seconds. Repeat three times per side.' },
    category: 'Trigger',
    inhale: 4,
    hold: 10,
    exhale: 2,
    durationSeconds: 100
  },
  {
    id: 'knie-wackeln',
    title: { de: 'Übung 7: Knie wackeln', en: 'Exercise 7: Knee Rocking' },
    description: { de: 'Lege dich auf den Rücken, halte die Knie zusammen und wackle zwei Minuten lang ruhig im Takt nach links und rechts.', en: 'Lie on your back with knees bent together, gently rocking them left and right in rhythm for two minutes.' },
    category: 'Lockern',
    inhale: 0,
    hold: 0,
    exhale: 0,
    durationSeconds: 120
  },
  {
    id: 'becken-trampolin',
    title: { de: 'Übung 8: Becken-Trampolin', en: 'Exercise 8: Pelvic Bounce' },
    description: { de: 'Hebe dein Becken leicht an und fedre es in einem schnellen, gleichmäßigen Takt wieder ab.', en: 'Lie on your back with knees bent, lifting your hips slightly and bouncing them rhythmically like on a trampoline.' },
    category: 'Lockern',
    inhale: 0,
    hold: 0,
    exhale: 0,
    durationSeconds: 75
  }
];