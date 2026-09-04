# Beckenboden Relax

Eine selbst hostbare Web-App, die visuell durch 5 geführte Entspannungsübungen für die Beckenbodenmuskulatur führt. Kein Sensor, kein Tracking, keine Datenerfassung – nur ruhige, animierte Atem- und Entspannungsvisualisierungen direkt im Browser.

Die App läuft komplett clientseitig (kein Backend, keine Datenbank) und lässt sich per Docker in wenigen Minuten auf einem eigenen Server betreiben. Als Progressive Web App (PWA) kann sie zusätzlich auf dem iPhone-Homescreen installiert werden, ganz ohne App Store oder Apple-Entwickleraccount.

## Inhaltsverzeichnis

- [Hintergrund](#hintergrund)
- [Funktionen](#funktionen)
- [Voraussetzungen](#voraussetzungen)
- [Installation mit Docker (empfohlen)](#installation-mit-docker-empfohlen)
- [Update auf eine neue Version](#update-auf-eine-neue-version)
- [Als App auf dem iPhone installieren](#als-app-auf-dem-iphone-installieren)
- [Lokale Entwicklung](#lokale-entwicklung)
- [Projektstruktur](#projektstruktur)
- [Übungen anpassen](#übungen-anpassen)
- [Technischer Hintergrund](#technischer-hintergrund)
- [Medizinischer Hinweis](#medizinischer-hinweis)

## Hintergrund

Die Übungen orientieren sich an Techniken, die in der Physiotherapie bei überaktiver, verspannter Beckenbodenmuskulatur eingesetzt werden (z. B. bei chronischem Beckenschmerzsyndrom, CPPS) – der Fokus liegt bewusst auf **Entspannung und Loslassen** statt auf klassischer Kräftigung. Enthalten sind Zwerchfellatmung, 4-7-8-Atmung, Reverse-Kegel-Technik und gezielte Anspannen-Loslassen-Zyklen mit überdurchschnittlich langer Entspannungsphase.

## Funktionen

- 5 geführte Übungen mit unterschiedlichen visuellen Animationen (Atemkreis, Wellenbalken, Quadrat-Puls, Spannungsanzeige, sinkender Tropfen)
- Automatischer Übergang zwischen den Übungen mit Countdown-Timer
- Wake-Lock-Unterstützung, damit der Bildschirm während der Übung nicht dunkel wird
- Vollständig offline-fähig nach dem ersten Laden (PWA)
- Installierbar auf dem iPhone-Homescreen ohne App Store
- Kein Tracking, keine externen Anfragen, keine Datenspeicherung
- Läuft in einem einzigen, schlanken Docker-Container (nginx + statische Dateien)

## Voraussetzungen

- Ein Server oder LXC/VM mit installiertem [Docker](https://docs.docker.com/engine/install/) und [Docker Compose](https://docs.docker.com/compose/install/)
- Netzwerkzugriff auf den Server aus dem lokalen Netzwerk (für den Zugriff vom iPhone/Laptop)

## Installation mit Docker (empfohlen)

1. Repository auf den Zielserver klonen:

   ```bash
   git clone https://github.com/Trinsic82/beckenboden-relax.git
   cd beckenboden-relax
   ```

2. Container bauen und starten:

   ```bash
   docker compose up -d --build
   ```

3. Prüfen, ob der Container läuft:

   ```bash
   docker ps
   ```

   Es sollte ein Eintrag `beckenboden-relax` mit dem Port `8090` erscheinen.

4. Im Browser aufrufen:

   ```
   http://<server-ip>:8090
   ```

Der Port lässt sich in der `docker-compose.yml` anpassen, falls `8090` auf deinem Server bereits belegt ist:

```yaml
services:
  beckenboden-relax:
    build: .
    container_name: beckenboden-relax
    ports:
      - "8090:80"   # <- linke Zahl anpassen, z. B. "8095:80"
    restart: unless-stopped
```

## Update auf eine neue Version

```bash
cd beckenboden-relax
git pull
docker compose up -d --build
```

## Als App auf dem iPhone installieren

1. Öffne die Server-Adresse (`http://<server-ip>:8090`) in **Safari** (nicht Chrome – „Zum Home-Bildschirm" funktioniert auf iOS nur in Safari).
2. Tippe auf das Teilen-Symbol unten in der Mitte.
3. Wähle **„Zum Home-Bildschirm"**.
4. Bestätige mit **„Hinzufügen"**.

Die App startet danach im Vollbild ohne Browserleiste, wie eine native App. Voraussetzung ist, dass sich das iPhone im gleichen Netzwerk wie der Server befindet.

## Lokale Entwicklung

Für Änderungen am Code, z. B. in GitHub Codespaces oder lokal mit Node.js 20+:

```bash
npm install
npm run dev -- --host
```

Die App ist dann unter `http://localhost:5173` erreichbar.

Build lokal testen:

```bash
npm run build
```

Der statische Build landet im Ordner `build/`.

## Projektstruktur

```
beckenboden-relax/
├── src/
│   ├── routes/              # Eine Seite pro Übung + Startseite + Abschlussseite
│   │   ├── +page.svelte     # Übungsübersicht
│   │   ├── uebung-1/ … uebung-5/
│   │   └── abschluss/
│   ├── lib/
│   │   ├── exercises.ts     # Konfiguration aller Übungen (Titel, Dauer, Atemrhythmus)
│   │   ├── BreathAnimation.svelte   # Atemkreis-Animation
│   │   ├── SquareBreath.svelte      # Quadrat-Puls-Animation
│   │   ├── WaveBreath.svelte        # Wellenbalken-Animation
│   │   ├── TensionMeter.svelte      # Spannungsanzeige (Balken)
│   │   ├── SinkingDrop.svelte       # Sinkender-Tropfen-Animation
│   │   └── wakeLock.ts      # Verhindert Bildschirm-Sperrung während der Übung
│   └── app.html             # HTML-Grundgerüst, PWA-/iOS-Meta-Tags
├── static/                   # Statische Assets (Icons etc.)
├── svelte.config.js          # SvelteKit-Adapter-Konfiguration (adapter-static)
├── vite.config.ts            # Vite-Plugins (SvelteKit, PWA)
├── Dockerfile                # Multi-Stage-Build: Node (Build) → nginx (Ausliefern)
└── docker-compose.yml        # Container-Definition inkl. Port-Mapping
```

## Übungen anpassen

Alle Übungsinhalte (Titel, Beschreibung, Atemzeiten, Dauer) liegen zentral in `src/lib/exercises.ts`. Beispiel für einen Eintrag:

```ts
{
  id: 'zwerchfellatmung',
  title: 'Übung 1: Zwerchfellatmung',
  description: 'Lege eine Hand auf den Bauch. Atme ruhig in den Bauch hinein.',
  inhale: 4,     // Sekunden Einatmen
  hold: 0,       // Sekunden Halten
  exhale: 6,     // Sekunden Ausatmen
  durationSeconds: 60   // Gesamtdauer der Übung
}
```

Um eine neue Übung mit eigener Animation zu ergänzen, lege eine neue `.svelte`-Komponente in `src/lib/` an und referenziere sie in der jeweiligen `src/routes/uebung-X/+page.svelte`.

## Technischer Hintergrund

- **Frontend:** SvelteKit mit `adapter-static` (reine statische Auslieferung, kein Node-Server im Betrieb nötig)
- **Animationen:** CSS-Transitions/Transforms, kein Video-Rendering
- **PWA:** `@vite-pwa/sveltekit` für Manifest und Service Worker
- **Auslieferung:** Multi-Stage-Docker-Build – Node nur zum Bauen, im Betrieb läuft ausschließlich ein schlankes nginx-Alpine-Image

## Medizinischer Hinweis

Diese App ist ein Übungsbegleiter und **ersetzt keine ärztliche Diagnose, Abklärung oder Beckenboden-Physiotherapie**. Bei anhaltenden oder starken Beschwerden im Beckenbereich sollte immer ärztlicher oder physiotherapeutischer Rat eingeholt werden.
