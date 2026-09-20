# Beckenboden Relax

Eine SvelteKit-App für ein strukturiertes Beckenboden- und Atem-Training, entwickelt nach den Übungen einer Physiotherapeutin. Jede Übung wird per Sprachausgabe angesagt, sodass während der Übung nicht auf den Bildschirm geschaut werden muss.

## Konzept

Die App führt durch eine Session aus mehreren Übungen. Jede Übung besteht aus zwei Seiten:

- **Intro-Seite** (`uebung-N-intro`): Spielt eine gesprochene Einleitung ab, die erklärt, was zu tun ist. Springt automatisch zur eigentlichen Übung, sobald die Ansage fertig ist.
- **Übungs-Seite** (`uebung-N`): Führt die eigentliche Übung mit passender Animation, Sprachansagen zu den einzelnen Phasen und einem Timer bzw. einer Wiederholungszählung durch.

Drei unterschiedliche Übungsmethodiken kommen zum Einsatz:

1. **Atemzyklus-Übungen** (Einatmen – Halten – Ausatmen), visualisiert z. B. als pulsierender Kreis, sinkender Tropfen, Welle oder Spannungsanzeige.
2. **Hand-Trigger-Sequenz** (Zwerchfell-Triggerung): Eine Schritt-für-Schritt-Abfolge aus Handposition, Einatmen, Ausatmen mit Druck und Halten über mehrere Wiederholungen, inklusive Seitenwechsel.
3. **Metronom-Übungen** (Knie wackeln, Becken-Trampolin): Ein gleichmäßiger Taktgeber gibt das Bewegungstempo vor, begleitet von einer kurzen Erklärung am Anfang.

## Übungen

1. **Zwerchfellatmung** – Ruhige Bauchatmung, Hand auf dem Bauch als Kontrolle
2. **Wellen-Loslassen** – Minimal anspannen, halten, sanft loslassen
3. **Reverse Kegel** – Beckenboden beim Ausatmen bewusst öffnen und sinken lassen
4. **Anspannen & Loslassen** – Leichte Anspannung (ca. 30 %), halten, lange und vollständig loslassen
5. **4-7-8-Atmung** – 4 Sekunden einatmen, 7 Sekunden halten, 8 Sekunden ausatmen
6. **Zwerchfell-Triggerung** – Mit der Hand am Rippenbogen das Zwerchfell triggern: einatmen, beim Ausatmen tiefer eindrücken, 10 Sekunden halten, 3 Wiederholungen pro Seite
7. **Knie wackeln** – Rückenlage, Beine angewinkelt, Knie im Takt sanft links-rechts wackeln, 2 Minuten
8. **Becken-Trampolin** – Rückenlage, Beine angewinkelt, Becken/Po im Takt vom Boden lösen und abfedern, wie auf einem Trampolin

## Technischer Aufbau

- **Framework:** SvelteKit (TypeScript)
- **Audio-System** (`src/lib/audio.ts`): Verwaltet alle Sprachansagen und Klänge über gecachte `HTMLAudioElement`-Objekte, inklusive Preloading beim App-Start und einem Unlock-Mechanismus für iOS-Autoplay-Beschränkungen
- **Übungsdaten** (`src/lib/exercises.ts`): Zentrale Definition aller Übungen mit Titel, Beschreibung und Timing-Werten
- **Deployment:** Docker-Container auf einem Homeserver (Proxmox/LXC), Build über `Dockerfile` und `docker-compose.yml`

## Entwicklung

```bash
npm install
npm run dev -- --host
```

## Deployment

```bash
git pull
docker compose up -d --build
```
