# Claude Code Prompts – Vokabeltrainer

Fertige Prompts für die Implementierung jedes Features.
Einfach kopieren und in Claude Code (CLI) oder einem neuen Chat einfügen.
Immer zuerst die aktuelle `index.html` in den Chat hochladen oder den Pfad nennen.

---

## PROMPT 01 — Erweitertes Karteikarten-Layout

```
Ich arbeite an meinem Vokabeltrainer (HTML/JS/PWA für iPhone und iPad).
Hier ist die aktuelle index.html: [Datei anhängen oder Inhalt einfügen]

Aufgabe: Implementiere das erweiterte Karteikarten-Layout.

Die neue JSON-Struktur je Vokabel hat diese Felder:
- examples: Array mit 2 Objekten { en, de }
- opposite: { en, de, example_en, example_de }
- synonyms: Array mit { word, de }
- word_family: Array mit { word, pos, de }
- phrasal_verbs (nur Präpositionen): Array mit { phrase, de, example }

Rückseite der Karteikarte zeigt in dieser Reihenfolge:
1. Beide Beispielsätze (EN + DE), je mit TTS-Button (en-US, rate 0.92)
2. Gegenteil-Box: rosa Hintergrund #FDEDEC, linker Rand 3px #C0392B
   Inhalt: Label "⟷ Gegenteil" + Wort EN bold + "·" + DE + kursiver Beispielsatz
3. Synonyme-Box: blauer Hintergrund #EBF5FB, linker Rand 3px #1E3A5F
   Inhalt: Label "≈ Synonyme" + Chips (dunkelblaue Pills mit Wort + DE darunter)
4. Wortfamilien-Box: grauer Hintergrund #F3F3F5, linker Rand 3px #999
   Inhalt: Label "🔤 Wortfamilie" + Zeilen: Wort (bold) | Wortart-Badge | DE-Text
5. Phrasal-Verbs-Box (nur wenn vorhanden): goldener Hintergrund #FDF6E3, Rand #8B6914
   Inhalt: Label "⚡ Phrasal Verbs" + je Zeile: Phrase (bold) + DE + kursiver Beispielsatz

Referenz-Demo: docs/flashcard_demo.html (liegt im Repo)
Responsive für iPhone (390px) und iPad (768px+).
SM-2-Bewertung (4 Buttons: Falsch / Schwer / Gut / Leicht) bleibt unverändert.
```

---

## PROMPT 02 — Lückentext-Modus (Cloze)

```
Ich arbeite an meinem Vokabeltrainer (HTML/JS/PWA für iPhone und iPad).
Hier ist die aktuelle index.html: [Datei anhängen]

Aufgabe: Füge einen dritten Lernmodus "Lückentext" hinzu.

Funktionsweise:
- Beispielsatz wird angezeigt, Zielwort durch ___ ersetzt
- Nutzt abwechselnd examples[0] und examples[1] (nach Kartenindex)
- Unter dem Satz: 4 große Touch-Buttons (min. 52px Höhe)
  - 1 korrekte Antwort (das Zielwort)
  - 3 Distraktoren: andere Wörter aus der aktuellen Lektion
- Nach Auswahl:
  - Gap wird mit richtigem Wort gefüllt (grün wenn richtig, rot wenn falsch)
  - Deutsche Übersetzung des Satzes erscheint
  - Richtiger Button grün markiert, falscher rot markiert
  - TTS liest vollständigen Satz vor (en-US, 0.88 rate, 400ms Verzögerung)
  - Kurzinfo einblenden: Gegenteil + Synonyme + Wortfamilie (kompakt, 1 Zeile je)
  - "Weiter →" Button erscheint
- SM-2-Bewertung: richtig = quality 4, falsch = quality 1 (automatisch, kein Dialog)
- Moduswahl: dritte Option neben Karteikarte und Multiple Choice

Referenz-Demo: docs/cloze_demo.html (liegt im Repo)
```

---

## PROMPT 03 — Statistik-Dashboard

```
Ich arbeite an meinem Vokabeltrainer (HTML/JS/PWA für iPhone und iPad).
Hier ist die aktuelle index.html: [Datei anhängen]

Aufgabe: Baue ein Statistik-Dashboard als eigene Tab-Ansicht ein.

Das Modul src/js/stats.js liegt bereits im Repo und stellt bereit:
- getStreak() → { streak, lastDate, longestStreak }
- getProblems(words, 5) → Top-5-Problemwörter
- getLessonStats(lessons) → [{ id, label, rate, total }]
- getPosDistribution(words) → { noun, verb, adj, prep, adv, other }
- barChartSVG(data) → SVG-String für Lektionsvergleich
- donutChartSVG(dist) → SVG-String für Wortart-Verteilung
- getDashboard(words, lessons) → Gesamt-Zusammenfassung

Dashboard-Inhalte (von oben nach unten):
1. Streak-Widget: Flammen-Emoji + Zahl + "Tage in Folge" + längster Streak
2. Schnellübersicht: 4 Kacheln: Gesamt / Fällig heute / In Übung / Gemeistert
3. Gesamtquote: große Prozentzahl + horizontaler Fortschrittsbalken
4. Problemwörter: Liste der 5 schwierigsten, je mit Fehlerquote + Button "Jetzt üben"
5. Lektionsvergleich: Horizontales Balkendiagramm (SVG, kein CDN)
6. Wortart-Verteilung: Donut-Chart (SVG, kein CDN)

Design: gleiche CSS-Variablen und Fonts wie bestehende App.
Responsive für iPhone und iPad.
Alle Daten aus localStorage, kein Backend.
```

---

## PROMPT 04 — Philosophie / Rhetorik Lektionen

```
Ich arbeite an meinem Vokabeltrainer (HTML/JS/PWA für iPhone und iPad).
Hier ist die aktuelle index.html: [Datei anhängen]

Aufgabe: Binde die philosophy_rhetoric_en.json als neue Lektionsgruppe ein.

Besonderheiten dieser Lektionen gegenüber normalen Vokabeln:
- Zusätzliches Feld "definition": { en, de }
  → Wird auf der Vorderseite der Karteikarte angezeigt
  → Unter der Übersetzung, als eingerückter Block mit linker Linie
- Zusätzliches Feld "group": "A" | "B" | "C"
  → Gruppe A: Philosophie – Fachbegriffe
  → Gruppe B: Argumentationsstruktur
  → Gruppe C: Rhetorische Figuren
- In der Lektionsauswahl: Filter-Buttons A / B / C / Alle

Ansonsten identisches Layout wie die anderen Karten:
Beispielsätze · Gegenteil · Synonyme · Wortfamilie (kein Phrasal-Verbs-Block)

Beim Lückentext-Modus: Definitionsfeld als Hinweis anzeigen, Wort in Lücke.
```

---

## PROMPT 05 — Hör-Modus (TTS)

```
Ich arbeite an meinem Vokabeltrainer (HTML/JS/PWA für iPhone und iPad).
Hier ist die aktuelle index.html: [Datei anhängen]

Aufgabe: Füge einen vierten Lernmodus "Hören" hinzu.

Funktionsweise:
- Karte wird angezeigt OHNE Text des Zielworts (nur "🔊" und Play-Button)
- TTS spricht das Wort automatisch beim Erscheinen vor (en-US, rate 0.85)
- Nutzer sieht 4 Übersetzungsoptionen auf Deutsch (Touch-Buttons)
- Nochmal-Hören-Button: spricht das Wort erneut vor
- Langsam-Button: spricht mit rate 0.6
- Nach Auswahl: Wort einblenden + Feedback + TTS des ersten Beispielsatzes
- SM-2-Bewertung identisch zu Multiple-Choice-Modus

Modul tts.js (src/js/tts.js) liegt im Repo und kann mit
TTS.speak(text, 'en') verwendet werden.

Moduswahl: vierte Option in der Mode-Bar.
Icon: 🎧 Hören
```

---

## PROMPT 06 — PDF-Schnittstelle

```
Ich arbeite an meinem Vokabeltrainer (HTML/JS/PWA für iPhone und iPad).
Hier ist die aktuelle index.html: [Datei anhängen]

Aufgabe: Füge eine neue Ansicht "📄 PDF importieren" hinzu.

Pipeline:
1. PDF einlesen
   - Drag-and-Drop-Bereich ODER Datei-Picker (input type=file, accept=.pdf)
   - pdf.js über CDN: https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js
   - Text aller Seiten extrahieren

2. Tokenisieren
   - Kleinbuchstaben, Satzzeichen entfernen
   - Stoppwörter EN+DE herausfiltern (eingebettete Liste der 150 häufigsten)
   - Wörter unter 3 Zeichen entfernen
   - Duplikate entfernen

3. Abgleich
   - Vergleich mit allen Wörtern in localStorage (word-Feld)
   - Nur neue Wörter anzeigen

4. Vorschau
   - Liste der neuen Wörter mit Checkboxen (alle vorausgewählt)
   - "Alle / Keine" Toggle
   - Suche/Filter in der Liste

5. Anreichern (optional, Claude API)
   - Button "Mit Claude anreichern"
   - API-Key wird aus localStorage geladen (einmalig in Einstellungen gespeichert)
   - Für jedes ausgewählte Wort: Übersetzung DE, Wortart, 2 Beispielsätze EN+DE,
     Gegenteil EN+DE, 1-2 Synonyme, 2-3 Wortfamilien-Einträge
   - Modell: claude-sonnet-4-20250514
   - Fortschrittsanzeige während der Anreicherung

6. Speichern
   - Textfeld für Lektions-Name
   - Button "Als Lektion speichern"
   - Speichert in localStorage unter lessons[]

UI: Responsive, große Touch-Targets (min 44px), Safe Area beachten.
Fehlerbehandlung: PDF nicht lesbar, API-Key fehlt, Rate Limit.
```

---

## PROMPT 07 — Wort des Tages

```
Ich arbeite an meinem Vokabeltrainer (HTML/JS/PWA für iPhone und iPad).
Hier ist die aktuelle index.html: [Datei anhängen]

Aufgabe: Füge ein "Wort des Tages"-Widget auf der Startseite ein.

Logik:
- Einmal täglich wird ein Wort ausgewählt (Datum als Seed)
- Bevorzuge Wörter, die am längsten nicht geübt wurden (sm2.due am ältesten)
- Falls kein Wort mit due < heute: zufälliges Wort aus dem Gesamtbestand
- Das Wort des Tages wird in localStorage gespeichert: { date, wordId }
- Nächster Tag: neues Wort

Widget-Layout (kompakte Karte auf der Startseite):
- Label "Wort des Tages" + Datum
- Großes Wort + Übersetzung
- Erster Beispielsatz + TTS-Button
- Zwei Buttons: "Jetzt lernen" (öffnet Karteikarte) | "Überspringen"

Design: gleiche CSS-Variablen, leicht goldener Hintergrund #FDF6E3.
```

---

*Prompts erstellt: Mai 2026 · Projekt: Vokabeltrainer*
