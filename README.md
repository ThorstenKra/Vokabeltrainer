# Vokabeltrainer

Persönlicher Vokabeltrainer als Progressive Web App (PWA) für iPhone und iPad.  
Basissprache **Deutsch**, Zielsprachen **Englisch · Französisch · Spanisch · Rumänisch**.

---

## Features

- **Karteikarten-Modus** — Vorder-/Rückseite mit Flip-Animation
- **Multiple-Choice-Modus** — 4 Antwortoptionen, Touch-optimiert
- **Lückentext-Modus** *(in Entwicklung)* — Beispielsatz mit Lücke, 3 Optionen
- **Erweitertes Karteikarten-Format** — je Vokabel:
  - 2 Beispielsätze (EN + DE) mit TTS-Vorlese-Button
  - Gegenteil (DE/EN) mit eigenem Beispielsatz
  - 1–2 Synonyme mit Bedeutung
  - Wortfamilie (Verb / Nomen / Adjektiv)
  - Phrasal Verbs (bei Präpositionen)
- **Spaced Repetition** — SM-2-Algorithmus (4 Bewertungsstufen)
- **Text-to-Speech** — Web Speech API, Englisch (en-US/en-GB)
- **Statistik** — Fortschritt je Lektion, Problemwörter, Lernstreak
- **Offline-fähig** — PWA, kein Server, alles in `localStorage`
- **PDF-Import** *(geplant)* — Wörter aus PDF-Dokumenten extrahieren und als Lektion anlegen

---

## Lektionen

### Englisch

| Datei | Inhalt | Einträge |
|---|---|---|
| `src/data/prepositions_en.json` | 8 Kernpräpositionen (up, out, on, in, off, over, to, for) | 8 |
| `src/data/philosophy_rhetoric_en.json` | Philosophie, Rhetorik, Argumentationsbegriffe | 18 |
| `src/data/lessons_en.json` | Allgemeinwortschatz A1–B1 | — |

### Weitere Sprachen

| Datei | Sprache | Status |
|---|---|---|
| `src/data/lessons_fr.json` | Französisch | in Vorbereitung |
| `src/data/lessons_es.json` | Spanisch | in Vorbereitung |
| `src/data/lessons_ro.json` | Rumänisch | in Vorbereitung |

---

## Projektstruktur

```
vokabeltrainer/
├── Vokabeltrainer_EN.html      ← App (self-contained, PWA-Einstiegspunkt)
├── service-worker.js           ← Offline-Cache
├── manifest.json               ← PWA-Manifest
├── README.md
├── ROADMAP.md
├── CHANGELOG.md
│
├── src/
│   ├── data/
│   │   ├── en_b2_p1.js         ← Vokabeln B2, Paket 1–5
│   │   ├── en_b2_p2.js
│   │   ├── en_b2_p3.js
│   │   ├── en_b2_p4.js
│   │   ├── en_b2_p5.js
│   │   ├── en_c1_p1.js         ← Vokabeln C1, Paket 1–3
│   │   ├── en_c1_p2.js
│   │   ├── en_c1_p3.js
│   │   ├── prepositions_en.json
│   │   ├── philosophy_rhetoric_en.json
│   │   ├── lessons_en.json
│   │   ├── lessons_fr.json
│   │   ├── lessons_es.json
│   │   └── lessons_ro.json
│   │
│   └── js/
│       ├── sm2.js              ← Spaced-Repetition-Algorithmus
│       ├── tts.js              ← Web Speech API Wrapper
│       └── stats.js            ← Statistik-Logik
│
└── docs/
    ├── Vokabeltrainer_Roadmap.pdf
    ├── flashcard_demo.html     ← UI-Referenz Karteikarten-Format
    ├── cloze_demo.html         ← UI-Referenz Lückentext-Modus
    ├── docs_prompts.md         ← Prompt-Dokumentation
    ├── test_simple.html        ← Testseite
    └── Vokabeltrainer_EN_1.html
```

---

## JSON-Datenstruktur

Jede Vokabel folgt diesem Schema:

```json
{
  "id": "prep_up_01",
  "word": "up",
  "type": "preposition",
  "pos": "prep",
  "translations": { "de": "aufwärts / hinauf / fertig" },
  "examples": [
    { "en": "She walked up the stairs slowly.", "de": "Sie ging die Treppe langsam hinauf." },
    { "en": "He looked up at the bright stars.", "de": "Er blickte zu den Sternen hinauf." }
  ],
  "opposite": {
    "en": "down",
    "de": "unten / herunter",
    "example_en": "She walked down the stairs carefully.",
    "example_de": "Sie ging die Treppe vorsichtig hinunter."
  },
  "synonyms": [
    { "word": "above", "de": "oberhalb / darüber" }
  ],
  "word_family": [
    { "word": "upward", "pos": "adj/adv", "de": "aufwärts gerichtet" }
  ],
  "phrasal_verbs": [
    { "phrase": "give up", "de": "aufgeben", "example": "Don't give up." }
  ],
  "sm2": { "ef": 2.5, "interval": 1, "repetitions": 0, "due": null },
  "stats": { "correct": 0, "wrong": 0, "history": [] }
}
```

---

## Technologie

| Komponente | Technologie |
|---|---|
| App | Einzelne HTML-Datei, Vanilla JS |
| Persistenz | `localStorage` + JSON-Export |
| Spaced Repetition | SM-2-Algorithmus |
| Text-to-Speech | Web Speech API (en-US, fr-FR, es-ES, ro-RO) |
| Plattform | Safari iOS / iPadOS, PWA |
| PDF-Import | pdf.js (geplant) |
| KI-Anreicherung | Claude API — `claude-sonnet-4-20250514` (geplant) |

---

## Entwicklung

Dieses Projekt wird mit **Claude Code** weiterentwickelt.  
Konzept und Roadmap: siehe [`ROADMAP.md`](ROADMAP.md) und [`docs/Vokabeltrainer_Roadmap.pdf`](docs/Vokabeltrainer_Roadmap.pdf).

---

*Erstellt: Mai 2026*
