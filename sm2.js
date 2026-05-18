/**
 * sm2.js — SuperMemo SM-2 Spaced Repetition Algorithm
 * Vokabeltrainer · Mai 2026
 *
 * Bewertungsskala (quality):
 *   1 = Falsch      → sofort wiederholen
 *   2 = Schwer      → morgen
 *   4 = Gut         → normaler SM-2-Verlauf
 *   5 = Leicht      → verlängertes Intervall
 */

const SM2 = (() => {

  /**
   * Berechnet das nächste Review-Datum und aktualisiert SM-2-Parameter.
   *
   * @param {object} sm2  - Aktuelles SM-2-Objekt der Vokabel
   *   { ef, interval, repetitions, due }
   * @param {number} quality - Bewertung: 1 | 2 | 4 | 5
   * @returns {object} Aktualisiertes SM-2-Objekt
   */
  function review(sm2, quality) {
    let { ef, interval, repetitions } = sm2;

    // Falsch oder sehr schwer → von vorne
    if (quality < 3) {
      repetitions = 0;
      interval    = 1;
    } else {
      // Intervall berechnen
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * ef);
      }
      repetitions += 1;
    }

    // Ease Factor anpassen (bleibt nie unter 1.3)
    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    ef = Math.max(1.3, parseFloat(ef.toFixed(2)));

    // Nächstes Datum
    const due = new Date();
    due.setDate(due.getDate() + interval);
    const dueStr = due.toISOString().split('T')[0]; // YYYY-MM-DD

    return { ef, interval, repetitions, due: dueStr };
  }

  /**
   * Gibt alle Vokabeln zurück, die heute oder früher fällig sind.
   *
   * @param {Array} words - Array von Vokabel-Objekten mit .sm2.due
   * @returns {Array} Fällige Vokabeln
   */
  function getDueWords(words) {
    const today = new Date().toISOString().split('T')[0];
    return words.filter(w => !w.sm2.due || w.sm2.due <= today);
  }

  /**
   * Gibt fällige Wörter sortiert nach Dringlichkeit zurück.
   * Überfällige zuerst, dann nach Ease Factor (schwierigste zuerst).
   *
   * @param {Array} words
   * @returns {Array}
   */
  function getSortedDue(words) {
    const today = new Date().toISOString().split('T')[0];
    return getDueWords(words).sort((a, b) => {
      const da = a.sm2.due || '0000-00-00';
      const db = b.sm2.due || '0000-00-00';
      if (da !== db) return da < db ? -1 : 1;
      return a.sm2.ef - b.sm2.ef; // schwierigere (niedrigerer EF) zuerst
    });
  }

  /**
   * Menschenlesbare Beschreibung des nächsten Review-Termins.
   *
   * @param {string} due - Datum YYYY-MM-DD
   * @returns {string}
   */
  function dueDateLabel(due) {
    if (!due) return 'Neu';
    const today = new Date().toISOString().split('T')[0];
    if (due <= today) return 'Heute fällig';
    const days = Math.round((new Date(due) - new Date(today)) / 86400000);
    if (days === 1) return 'Morgen';
    if (days <= 7)  return `In ${days} Tagen`;
    if (days <= 30) return `In ${Math.round(days / 7)} Woche(n)`;
    return `In ${Math.round(days / 30)} Monat(en)`;
  }

  /**
   * Berechnet Statistiken für eine Wortliste.
   *
   * @param {Array} words
   * @returns {object} { total, due, learning, mastered, avgEF }
   */
  function getStats(words) {
    const today = new Date().toISOString().split('T')[0];
    const due      = words.filter(w => !w.sm2.due || w.sm2.due <= today).length;
    const mastered = words.filter(w => w.sm2.repetitions >= 3 && w.sm2.ef >= 2.0).length;
    const learning = words.filter(w => w.sm2.repetitions > 0 && w.sm2.repetitions < 3).length;
    const avgEF    = words.length
      ? parseFloat((words.reduce((s, w) => s + w.sm2.ef, 0) / words.length).toFixed(2))
      : 0;
    return { total: words.length, due, learning, mastered, avgEF };
  }

  /**
   * Setzt das SM-2-Objekt einer Vokabel auf den Anfangszustand zurück.
   *
   * @returns {object} Frisches SM-2-Objekt
   */
  function fresh() {
    return { ef: 2.5, interval: 1, repetitions: 0, due: null };
  }

  // ── localStorage-Hilfsfunktionen ──────────────────────────────

  const STORAGE_KEY = 'vokabeltrainer_words';

  /** Speichert alle Wörter in localStorage. */
  function saveWords(words) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    } catch (e) {
      console.error('SM2: Fehler beim Speichern:', e);
    }
  }

  /** Lädt alle Wörter aus localStorage. */
  function loadWords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('SM2: Fehler beim Laden:', e);
      return [];
    }
  }

  /**
   * Aktualisiert eine einzelne Vokabel nach einer Bewertung und speichert.
   *
   * @param {string} id       - Vokabel-ID
   * @param {number} quality  - Bewertung 1|2|4|5
   * @param {Array}  words    - Gesamte Wortliste
   * @returns {Array} Aktualisierte Wortliste
   */
  function applyReview(id, quality, words) {
    const updated = words.map(w => {
      if (w.id !== id) return w;
      const newSm2 = review(w.sm2, quality);
      const history = [...(w.stats.history || []), {
        date: new Date().toISOString().split('T')[0],
        quality
      }].slice(-50); // maximal 50 Einträge behalten
      return {
        ...w,
        sm2: newSm2,
        stats: {
          correct: w.stats.correct + (quality >= 3 ? 1 : 0),
          wrong:   w.stats.wrong   + (quality <  3 ? 1 : 0),
          history
        }
      };
    });
    saveWords(updated);
    return updated;
  }

  // ── Public API ────────────────────────────────────────────────
  return {
    review,
    getDueWords,
    getSortedDue,
    dueDateLabel,
    getStats,
    fresh,
    saveWords,
    loadWords,
    applyReview,
    STORAGE_KEY
  };

})();

// Export für Modul-Umgebungen (Node / Claude Code Tests)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SM2;
}
