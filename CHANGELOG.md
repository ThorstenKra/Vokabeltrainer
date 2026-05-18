# Changelog – Vokabeltrainer

Alle relevanten Änderungen werden hier dokumentiert.  
Format: [Semantic Versioning](https://semver.org/lang/de/)

---

## [Unreleased]

### Hinzugefügt (2026-05-18)
- Erweitertes Karteikarten-Layout (Rückseite):
  - Zwei Beispielsätze mit je TTS-Button (🔊, rate 0.92)
  - Gegenteil-Box (rot), Synonyme-Box mit Chips (blau), Wortfamilien-Box (grau), Phrasal-Verbs-Box (gold)
  - Graceful Fallback auf altes Format (`example_de`/`example_target`) für bestehende B2/C1-Vokabeln
- `prepositions_en.json` per `fetch()` zur Laufzeit geladen — erscheint als Modul "Praepositionen EN"
- `window.spkEx(idx)` für TTS pro Beispielsatz

### Geändert (2026-05-18)
- Repository-Struktur reorganisiert: `src/js/`, `src/data/`, `docs/`
- `vocab/`-Ordner aufgelöst: JS-Dateien → `src/data/`, HTML → `docs/`
- `service-worker.js`: veraltete `vocab/`-Pfade entfernt, Cache-Version auf `vt-en-v2` erhöht
- `manifest.json`: `start_url` von `/index.html` → `/Vokabeltrainer_EN.html` korrigiert

### Dokumentation (2026-05-18)
- README, CHANGELOG, ROADMAP, `docs/docs_prompts.md`: alle Pfadreferenzen auf neue Struktur aktualisiert
  (`index.html` → `Vokabeltrainer_EN.html`, `sm2.js` → `src/js/sm2.js`, etc.)

---

## [Unreleased – vorherige Einträge]

### Hinzugefügt
- `prepositions_en.json` — 8 Kernpräpositionen EN mit erweitertem Datenformat
- `philosophy_rhetoric_en.json` — 18 Philosophie- / Rhetorik-Begriffe EN
- `src/js/sm2.js` — SM-2 Spaced-Repetition-Algorithmus als eigenständiges Modul
- `src/js/tts.js` — Web Speech API Wrapper für EN / DE / FR / ES / RO
- `docs/flashcard_demo.html` — UI-Referenz für erweitertes Karteikarten-Format
- `docs/Vokabeltrainer_Roadmap.pdf` — Konzept und Entwicklungsplanung
- Erweitertes Vokabel-Datenformat:
  - 2 Beispielsätze (EN + DE)
  - Gegenteil (DE/EN) mit Beispielsatz
  - Synonyme (1–2 EN mit DE-Bedeutung)
  - Wortfamilie (Wort / Wortart / DE)
  - Phrasal Verbs (bei Präpositionen)

---

## [0.1.0] – 2026-04

### Hinzugefügt
- Grundstruktur der App (`Vokabeltrainer_EN.html`)
- Karteikarten-Modus (bidirektional DE ↔ EN)
- Multiple-Choice-Modus (4 Optionen)
- SM-2 Spaced Repetition
- Erste Lektionen EN (Allgemeinwortschatz A1)
- localStorage-Persistenz
- PWA-Manifest
- Text-to-Speech (en-US)

---

*Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/)*
