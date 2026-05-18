# Changelog – Vokabeltrainer

Alle relevanten Änderungen werden hier dokumentiert.  
Format: [Semantic Versioning](https://semver.org/lang/de/)

---

## [Unreleased]

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
