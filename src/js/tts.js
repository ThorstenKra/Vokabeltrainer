/**
 * tts.js — Web Speech API Wrapper
 * Vokabeltrainer · Mai 2026
 *
 * Unterstützte Sprachen:
 *   en  → en-US (Fallback: en-GB)
 *   de  → de-DE
 *   fr  → fr-FR
 *   es  → es-ES
 *   ro  → ro-RO
 */

const TTS = (() => {

  // ── Sprachkonfiguration ───────────────────────────────────────
  const LANG_MAP = {
    en: ['en-US', 'en-GB', 'en-AU'],
    de: ['de-DE', 'de-AT', 'de-CH'],
    fr: ['fr-FR', 'fr-BE', 'fr-CA'],
    es: ['es-ES', 'es-MX', 'es-US'],
    ro: ['ro-RO']
  };

  const RATE_MAP = {
    en: 0.92,
    de: 0.90,
    fr: 0.90,
    es: 0.92,
    ro: 0.88
  };

  let _voices       = [];
  let _voicesLoaded = false;

  // ── Stimmen laden ─────────────────────────────────────────────

  /** Stimmen aus der Browser-API laden (asynchron). */
  function loadVoices() {
    if (!window.speechSynthesis) return;
    _voices = window.speechSynthesis.getVoices();
    if (_voices.length > 0) {
      _voicesLoaded = true;
      return;
    }
    // Einige Browser laden Stimmen verzögert
    window.speechSynthesis.onvoiceschanged = () => {
      _voices = window.speechSynthesis.getVoices();
      _voicesLoaded = true;
    };
  }

  /**
   * Beste verfügbare Stimme für eine Sprache finden.
   *
   * @param {string} lang - Sprachkürzel: 'en' | 'de' | 'fr' | 'es' | 'ro'
   * @returns {SpeechSynthesisVoice|null}
   */
  function findVoice(lang) {
    const candidates = LANG_MAP[lang] || ['en-US'];
    for (const locale of candidates) {
      // Bevorzuge native (nicht Network-) Stimmen
      const native = _voices.find(v => v.lang === locale && !v.name.includes('Google'));
      if (native) return native;
      const any = _voices.find(v => v.lang === locale);
      if (any) return any;
    }
    // Fallback: irgendeine Stimme mit passendem Sprachprefix
    const prefix = (LANG_MAP[lang]?.[0] || 'en').slice(0, 2);
    return _voices.find(v => v.lang.startsWith(prefix)) || null;
  }

  // ── Vorlesen ──────────────────────────────────────────────────

  /**
   * Text vorlesen.
   *
   * @param {string} text   - Vorzulesender Text
   * @param {string} lang   - Sprachkürzel: 'en' | 'de' | 'fr' | 'es' | 'ro'
   * @param {object} [opts] - Optionen: { rate, pitch, volume, onEnd }
   */
  function speak(text, lang = 'en', opts = {}) {
    if (!window.speechSynthesis || !text) return;

    // Laufende Ausgabe stoppen
    window.speechSynthesis.cancel();

    if (!_voicesLoaded) loadVoices();

    const u       = new SpeechSynthesisUtterance(text);
    u.lang        = LANG_MAP[lang]?.[0] || 'en-US';
    u.rate        = opts.rate   ?? RATE_MAP[lang] ?? 0.9;
    u.pitch       = opts.pitch  ?? 1.0;
    u.volume      = opts.volume ?? 1.0;

    const voice   = findVoice(lang);
    if (voice) u.voice = voice;

    if (opts.onEnd) u.onend = opts.onEnd;

    // iOS-Bug: speechSynthesis kann nach längerem Idle hängen
    window.speechSynthesis.cancel();
    setTimeout(() => window.speechSynthesis.speak(u), 50);
  }

  /**
   * Nur das Zielwort vorlesen (Vorderseite der Karteikarte).
   *
   * @param {object} word - Vokabel-Objekt
   * @param {string} targetLang - Zielsprache: 'en' | 'fr' | 'es' | 'ro'
   */
  function speakWord(word, targetLang = 'en') {
    speak(word.word, targetLang);
  }

  /**
   * Ersten Beispielsatz vorlesen.
   *
   * @param {object} word       - Vokabel-Objekt mit .examples
   * @param {string} lang       - 'en' | 'de'
   * @param {number} [index=0]  - 0 = erster Satz, 1 = zweiter Satz
   */
  function speakExample(word, lang = 'en', index = 0) {
    const ex = word.examples?.[index];
    if (!ex) return;
    speak(ex[lang] || ex.en, lang);
  }

  /**
   * Gegenteil-Beispielsatz vorlesen.
   *
   * @param {object} word
   * @param {string} lang - 'en' | 'de'
   */
  function speakOpposite(word, lang = 'en') {
    const opp = word.opposite;
    if (!opp) return;
    const text = lang === 'de' ? opp.example_de : opp.example_en;
    speak(text || opp.en, lang);
  }

  /** Vorlesen stoppen. */
  function stop() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  /** Prüft ob TTS verfügbar ist. */
  function isAvailable() {
    return !!window.speechSynthesis;
  }

  /**
   * Gibt alle verfügbaren Stimmen für eine Sprache zurück.
   * Nützlich für ein Einstellungsmenü.
   *
   * @param {string} lang
   * @returns {SpeechSynthesisVoice[]}
   */
  function getVoicesForLang(lang) {
    if (!_voicesLoaded) loadVoices();
    const candidates = LANG_MAP[lang] || [];
    return _voices.filter(v => candidates.some(c => v.lang.startsWith(c.slice(0, 5))));
  }

  // ── Init ──────────────────────────────────────────────────────
  if (typeof window !== 'undefined') {
    // Stimmen so früh wie möglich laden
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadVoices);
    } else {
      loadVoices();
    }
  }

  // ── Public API ────────────────────────────────────────────────
  return {
    speak,
    speakWord,
    speakExample,
    speakOpposite,
    stop,
    isAvailable,
    getVoicesForLang,
    loadVoices,
    LANG_MAP
  };

})();

// Export für Modul-Umgebungen
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TTS;
}
