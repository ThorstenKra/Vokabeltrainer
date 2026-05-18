# Roadmap – Vokabeltrainer

Übersicht aller geplanten Erweiterungen mit Priorität und Status.  
Detailliertes Konzept: [`docs/Vokabeltrainer_Roadmap.pdf`](docs/Vokabeltrainer_Roadmap.pdf)

---

## Status-Legende

| Symbol | Bedeutung |
|---|---|
| ✅ | Fertig |
| 🔄 | In Arbeit |
| 📋 | Geplant – Phase 1 |
| 🔵 | Geplant – Phase 2 |
| 🔮 | Geplant – Phase 3 |

---

## Datenbasis

| Status | Feature | Beschreibung |
|---|---|---|
| ✅ | `prepositions_en.json` | 8 Kernpräpositionen EN mit allen Feldern |
| ✅ | `philosophy_rhetoric_en.json` | 18 Philosophie- / Rhetorik-Begriffe EN |
| ✅ | `flashcard_demo.html` | UI-Referenz neue Karteikarten-Felder |
| ✅ | `sm2.js` | SM-2 Spaced-Repetition-Algorithmus |
| ✅ | `tts.js` | Web Speech API Wrapper |
| 📋 | `lessons_en.json` | Allgemeinwortschatz EN A1–B1 ausbauen |
| 🔵 | `lessons_fr.json` | Französisch-Lektionen |
| 🔵 | `lessons_es.json` | Spanisch-Lektionen |
| 🔵 | `lessons_ro.json` | Rumänisch-Lektionen |

---

## Phase 1 — Sofort umsetzen

### 1a Präpositionen-Lektionen in App integrieren

**Ziel:** Die neue `prepositions_en.json` im Karteikarten- und Lückentext-Modus nutzbar machen.

**Aufgaben:**
- [ ] Neues Karteikarten-Layout mit allen 7 Feldern implementieren (Referenz: `docs/flashcard_demo.html`)
- [ ] Farbcodierung: Gegenteil rosa · Synonyme blau · Wortfamilie grau · Phrasal Verbs gold
- [ ] TTS für beide Beispielsätze (en-US)
- [ ] Lückentext-Modus nutzt Satz 1 und Satz 2 abwechselnd

**Claude-Code-Prompt:**
```
Die bestehende Vokabeltrainer-App soll die neue prepositions_en.json nutzen.
Implementiere das erweiterte Karteikarten-Layout aus docs/flashcard_demo.html:
- 2 Beispielsätze mit TTS-Button
- Gegenteil-Box (rosa, #FDEDEC, linker Rand #C0392B)
- Synonyme-Box (blau, #EBF5FB, linker Rand #1E3A5F) mit Chips
- Wortfamilien-Box (grau, #F3F3F5) mit Wort / Wortart / DE-Spalten
- Phrasal-Verbs-Box (gold, #FDF6E3) mit Phrase / DE / Beispielsatz
SM-2-Bewertung wie bisher. Responsive für iPhone und iPad.
```

---

### 1b Lückentext-Modus (Cloze)

**Ziel:** Dritter Lernmodus neben Karteikarte und Multiple Choice.

**Aufgaben:**
- [ ] Beispielsatz mit ausgeblendetem Zielwort als `___`
- [ ] 4 Touch-Buttons (1 korrekt, 3 Distraktoren aus der Lektion)
- [ ] Nach Auswahl: Feedback-Animation + TTS des vollständigen Satzes
- [ ] SM-2-Bewertung identisch zu Multiple-Choice-Modus
- [ ] Moduswahl im Haupt-UI als dritte Option

**Claude-Code-Prompt:**
```
Füge der App einen dritten Lernmodus 'Lückentext' hinzu.
Anzeige: Beispielsatz mit ausgeblendetem Zielwort als ___.
Darunter 4 große Touch-Buttons (1 korrekt, 3 Distraktoren aus der Lektion).
Nach Auswahl: grünes/rotes Feedback + TTS des vollständigen Satzes (en-US).
SM-2-Bewertung wie Multiple-Choice-Modus.
Nutze beide Beispielsätze abwechselnd (examples[0] und examples[1]).
Moduswahl im Haupt-UI als dritte Option neben Karteikarte und Multiple Choice.
```

---

### 1c Problemwörter-Widget

**Ziel:** Automatische Schnelllektion mit den schwächsten Vokabeln.

**Aufgaben:**
- [ ] Top-5-Wörter mit schlechtester Trefferquote automatisch filtern
- [ ] Als eigene Lektion „Problemwörter heute" anbieten
- [ ] Widget auf der Startseite / im Statistik-Tab

---

## Phase 2 — Mittelfristig

### 2a Philosophie / Rhetorik-Lektionen integrieren

- [ ] `philosophy_rhetoric_en.json` in App einbinden
- [ ] Gruppen-Filter (A / B / C) in der Lektionsauswahl
- [ ] Definition-Feld auf Karteikarte anzeigen (zusätzliches Feld zu Übersetzung)

**Claude-Code-Prompt:**
```
Füge die philosophy_rhetoric_en.json als neue Lektionsgruppe ein.
Besonderheit: Diese Karten haben ein zusätzliches 'definition'-Feld (EN + DE),
das auf der Vorderseite der Karteikarte unter der Übersetzung angezeigt wird.
Gruppen A / B / C als Filter-Buttons in der Lektionsauswahl.
Ansonsten identisches Layout wie die Präpositionen-Karten.
```

---

### 2b Hör-Modus (TTS-gestützt)

- [ ] Wort wird nur vorgesprochen, kein Text sichtbar
- [ ] Nutzer wählt korrekte Übersetzung aus 4 Optionen
- [ ] Nutzt Web Speech API (bereits integriert)

---

### 2c Statistik-Ausbau

- [ ] Lernstreak: Tage in Folge mit Aktivität
- [ ] Lektionsvergleich: Balkendiagramm (SVG inline, kein CDN)
- [ ] Spaced-Repetition-Übersicht: fällige Wörter heute / diese Woche
- [ ] Wortart-Verteilung: Nomen / Verben / Adjektive

---

### 2d Wort des Tages

- [ ] Beim App-Start: ein Wort aus dem Bestand (bevorzugt lang nicht geübt)
- [ ] Kleine Karte auf der Startseite
- [ ] Direkt in Lernmodus starten möglich

---

## Phase 3 — Langfristig

### 3a PDF-Schnittstelle

**Ziel:** Beliebige PDF-Dokumente einlesen, neue Lektionen daraus generieren.

**Pipeline:**
1. PDF einlesen — `pdf.js` (clientseitig)
2. Tokenisieren — Stoppwörter entfernen, Lemmatisieren
3. Abgleich — Vergleich mit vorhandenen Vokabeln
4. Vorschau — neue Wörter als prüfbare Checkliste
5. Anreichern — Claude API generiert Übersetzung, Wortart, Beispielsatz
6. Speichern — als neue Lektion anlegen

**Claude-Code-Prompt:**
```
Füge der App eine neue Ansicht 'PDF importieren' hinzu.
Drag-and-Drop oder Datei-Picker für PDF.
Textextraktion mit pdf.js (CDN: mozilla.github.io/pdf.js).
Tokenisierung: Kleinbuchstaben, Satzzeichen entfernen, Stoppwörter EN+DE herausfiltern.
Abgleich mit vorhandenen Vokabeln (localStorage). Neue Wörter als Liste mit Checkboxen.
Button 'Mit Claude anreichern': ruft claude-sonnet-4-20250514 auf (API-Key aus localStorage).
Claude generiert je Wort: Übersetzung, Wortart, Beispielsatz 1, Beispielsatz 2,
Gegenteil (DE+EN), Synonyme (1-2), Wortfamilie (2-3 Einträge).
Danach: 'Als Lektion speichern' mit Namensfeld.
Responsive für iPhone und iPad, große Touch-Targets.
```

---

### 3b Sortier- / Zuordnungs-Modus

- [ ] Wörter nach Kategorien sortieren (z.B. Wortart)
- [ ] Tap-Auswahl auf iOS

---

### 3c PDF-Export (Lernblätter)

- [ ] Aus einer Lektion ein druckbares PDF generieren
- [ ] Karteikarten-Layout oder zweispaltige Vokabelliste

---

### 3d Adaptives Lernen

- [ ] App erkennt einfache Vokabeln → baut automatisch neue Schwierigkeitsstufen
- [ ] Längere Sätze, seltenere Synonyme, komplexere Kontexte

---

## Offene Fragen / Entscheidungen

| Frage | Optionen | Status |
|---|---|---|
| Mehrsprachige TTS-Stimme | Web Speech API vs. Claude TTS | offen |
| Datei-Sync zwischen Geräten | iCloud / JSON-Export / kein Sync | offen |
| Lektions-Import teilen | JSON per AirDrop / E-Mail | offen |

---

*Letzte Aktualisierung: Mai 2026*
