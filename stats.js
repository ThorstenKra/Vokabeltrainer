/**
 * stats.js — Statistik-Logik
 * Vokabeltrainer · Mai 2026
 *
 * Funktionen:
 *   - Lernstreak berechnen
 *   - Problemwörter ermitteln
 *   - Lektionsvergleich
 *   - Wortart-Verteilung
 *   - Sitzungshistorie
 *   - SVG-Chart-Generatoren (kein CDN)
 */

const Stats = (() => {

  const STORAGE_STREAK  = 'vt_streak';
  const STORAGE_SESSION = 'vt_sessions';

  // ══════════════════════════════════════════════════════════════
  // 1. LERNSTREAK
  // ══════════════════════════════════════════════════════════════

  /**
   * Gibt den aktuellen Lernstreak zurück.
   * @returns {{ streak: number, lastDate: string, longestStreak: number }}
   */
  function getStreak() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_STREAK)) || {
        streak: 0, lastDate: null, longestStreak: 0
      };
    } catch { return { streak: 0, lastDate: null, longestStreak: 0 }; }
  }

  /**
   * Streak nach einer Lernsitzung aktualisieren.
   * Muss einmal pro Tag beim ersten Review aufgerufen werden.
   * @returns {{ streak, lastDate, longestStreak }}
   */
  function updateStreak() {
    const today = todayStr();
    const data  = getStreak();

    if (data.lastDate === today) return data; // schon heute aktualisiert

    const yesterday = offsetDate(-1);
    if (data.lastDate === yesterday) {
      data.streak += 1;
    } else {
      data.streak = 1; // Streak unterbrochen
    }

    data.lastDate     = today;
    data.longestStreak = Math.max(data.streak, data.longestStreak);
    localStorage.setItem(STORAGE_STREAK, JSON.stringify(data));
    return data;
  }

  // ══════════════════════════════════════════════════════════════
  // 2. SITZUNGSHISTORIE
  // ══════════════════════════════════════════════════════════════

  /**
   * Neue Lernsitzung speichern.
   * @param {{ lessonId, wordsReviewed, correct, durationSec }} session
   */
  function saveSession(session) {
    const sessions = getSessions();
    sessions.push({
      date:          todayStr(),
      timestamp:     Date.now(),
      lessonId:      session.lessonId      || 'unknown',
      wordsReviewed: session.wordsReviewed || 0,
      correct:       session.correct       || 0,
      durationSec:   session.durationSec   || 0
    });
    // Maximal 200 Sitzungen behalten
    const trimmed = sessions.slice(-200);
    localStorage.setItem(STORAGE_SESSION, JSON.stringify(trimmed));
    updateStreak();
  }

  /** Alle Sitzungen laden. */
  function getSessions() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_SESSION)) || [];
    } catch { return []; }
  }

  /**
   * Sitzungen der letzten n Tage.
   * @param {number} days
   * @returns {Array}
   */
  function getRecentSessions(days = 30) {
    const cutoff = offsetDate(-days);
    return getSessions().filter(s => s.date >= cutoff);
  }

  // ══════════════════════════════════════════════════════════════
  // 3. PROBLEMWÖRTER
  // ══════════════════════════════════════════════════════════════

  /**
   * Wörter mit der schlechtesten Trefferquote.
   * @param {Array}  words  - Alle Vokabeln
   * @param {number} n      - Anzahl zurückgeben
   * @param {number} minReviews - Mindestanzahl Reviews (verhindert Wörter mit 0/1 Versuchen)
   * @returns {Array} Sortiert nach Fehlerquote absteigend
   */
  function getProblems(words, n = 10, minReviews = 3) {
    return words
      .filter(w => {
        const total = w.stats.correct + w.stats.wrong;
        return total >= minReviews;
      })
      .map(w => {
        const total   = w.stats.correct + w.stats.wrong;
        const errRate = total > 0 ? w.stats.wrong / total : 0;
        return { ...w, _errRate: errRate, _total: total };
      })
      .sort((a, b) => b._errRate - a._errRate || b._total - a._total)
      .slice(0, n);
  }

  /**
   * Wörter, die am längsten nicht geübt wurden.
   * @param {Array} words
   * @param {number} n
   * @returns {Array}
   */
  function getLongestUntouched(words, n = 5) {
    return [...words]
      .filter(w => w.sm2.due !== null)
      .sort((a, b) => (a.sm2.due || '') < (b.sm2.due || '') ? -1 : 1)
      .slice(0, n);
  }

  // ══════════════════════════════════════════════════════════════
  // 4. LEKTIONSVERGLEICH
  // ══════════════════════════════════════════════════════════════

  /**
   * Erfolgsquote je Lektion berechnen.
   * @param {object} lessons - { lessonId: [words] }
   * @returns {Array} [{ id, label, rate, total, correct, wrong }]
   */
  function getLessonStats(lessons) {
    return Object.entries(lessons).map(([id, words]) => {
      const correct = words.reduce((s, w) => s + w.stats.correct, 0);
      const wrong   = words.reduce((s, w) => s + w.stats.wrong,   0);
      const total   = correct + wrong;
      const rate    = total > 0 ? Math.round((correct / total) * 100) : 0;
      return { id, label: id, correct, wrong, total, rate };
    }).sort((a, b) => b.rate - a.rate);
  }

  // ══════════════════════════════════════════════════════════════
  // 5. WORTART-VERTEILUNG
  // ══════════════════════════════════════════════════════════════

  /**
   * Anzahl gelernter Wörter je Wortart.
   * @param {Array} words
   * @returns {object} { noun: n, verb: n, adj: n, prep: n, other: n }
   */
  function getPosDistribution(words) {
    const map = { noun: 0, verb: 0, adj: 0, prep: 0, adv: 0, other: 0 };
    words.forEach(w => {
      const pos = (w.pos || 'other').toLowerCase();
      if (pos.includes('noun'))       map.noun++;
      else if (pos.includes('verb'))  map.verb++;
      else if (pos.includes('adj'))   map.adj++;
      else if (pos.includes('prep'))  map.prep++;
      else if (pos.includes('adv'))   map.adv++;
      else                            map.other++;
    });
    return map;
  }

  // ══════════════════════════════════════════════════════════════
  // 6. LERNKURVE (Historie eines Wortes)
  // ══════════════════════════════════════════════════════════════

  /**
   * Rollende Trefferquote aus der History eines Wortes.
   * @param {Array} history - [{ date, quality }]
   * @param {number} window - Fenstergröße
   * @returns {Array} [{ date, rate }]
   */
  function getLearningCurve(history, window = 5) {
    if (!history || history.length < 2) return [];
    return history.map((_, i) => {
      if (i < window - 1) return null;
      const slice   = history.slice(i - window + 1, i + 1);
      const correct = slice.filter(h => h.quality >= 3).length;
      return { date: history[i].date, rate: Math.round((correct / window) * 100) };
    }).filter(Boolean);
  }

  // ══════════════════════════════════════════════════════════════
  // 7. SVG-CHART-GENERATOREN (kein CDN, inline)
  // ══════════════════════════════════════════════════════════════

  /**
   * Horizontales Balkendiagramm für Lektionsvergleich.
   * @param {Array}  data   - [{ label, rate }] — rate: 0–100
   * @param {object} opts   - { width, barHeight, gap, colors }
   * @returns {string} SVG-Markup
   */
  function barChartSVG(data, opts = {}) {
    const W         = opts.width     || 320;
    const barH      = opts.barHeight || 24;
    const gap       = opts.gap       || 8;
    const labelW    = opts.labelWidth|| 110;
    const C_BAR     = opts.barColor  || '#2E86AB';
    const C_BG      = opts.bgColor   || '#F0F4F8';
    const C_TEXT    = opts.textColor || '#2C3E50';
    const C_RATE    = opts.rateColor || '#1E3A5F';

    const chartW = W - labelW - 48; // 48 für Prozent-Text rechts
    const H      = data.length * (barH + gap) + gap;

    const bars = data.map((d, i) => {
      const y    = gap + i * (barH + gap);
      const barW = Math.max(2, Math.round((d.rate / 100) * chartW));
      return `
        <text x="${labelW - 6}" y="${y + barH / 2 + 4}"
              text-anchor="end" font-size="11" fill="${C_TEXT}"
              font-family="DM Sans, sans-serif">${d.label}</text>
        <rect x="${labelW}" y="${y}" width="${chartW}" height="${barH}"
              rx="4" fill="${C_BG}"/>
        <rect x="${labelW}" y="${y}" width="${barW}" height="${barH}"
              rx="4" fill="${C_BAR}" opacity="0.85"/>
        <text x="${labelW + chartW + 6}" y="${y + barH / 2 + 4}"
              font-size="11" font-weight="600" fill="${C_RATE}"
              font-family="DM Sans, sans-serif">${d.rate}%</text>`;
    }).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg"
                 width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      ${bars}
    </svg>`;
  }

  /**
   * Lernkurven-Liniendiagramm.
   * @param {Array}  points - [{ date, rate }]
   * @param {object} opts
   * @returns {string} SVG-Markup
   */
  function lineChartSVG(points, opts = {}) {
    if (points.length < 2) return '<svg width="320" height="80"></svg>';
    const W      = opts.width  || 320;
    const H      = opts.height || 80;
    const pad    = opts.pad    || 12;
    const C_LINE = opts.lineColor || '#2E86AB';
    const C_DOT  = opts.dotColor  || '#1E3A5F';
    const C_GRID = opts.gridColor || '#E8EEF4';

    const chartW = W - pad * 2;
    const chartH = H - pad * 2;

    const xs = points.map((_, i) => pad + (i / (points.length - 1)) * chartW);
    const ys = points.map(p => pad + chartH - (p.rate / 100) * chartH);

    // Rasterlinien bei 25 / 50 / 75 / 100 %
    const grid = [25, 50, 75, 100].map(v => {
      const y = pad + chartH - (v / 100) * chartH;
      return `<line x1="${pad}" y1="${y}" x2="${W - pad}" y2="${y}"
                    stroke="${C_GRID}" stroke-width="1"/>
              <text x="${pad - 2}" y="${y + 4}" text-anchor="end"
                    font-size="9" fill="#aaa" font-family="DM Sans, sans-serif">${v}</text>`;
    }).join('');

    const path = `M ${xs.map((x, i) => `${x},${ys[i]}`).join(' L ')}`;
    const area = `M ${xs[0]},${H - pad} L ${xs.map((x, i) => `${x},${ys[i]}`).join(' L ')} L ${xs[xs.length - 1]},${H - pad} Z`;

    const dots = points.map((p, i) =>
      `<circle cx="${xs[i]}" cy="${ys[i]}" r="3" fill="${C_DOT}"/>
       <title>${p.date}: ${p.rate}%</title>`
    ).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg"
                 width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      ${grid}
      <path d="${area}" fill="${C_LINE}" opacity="0.1"/>
      <path d="${path}" fill="none" stroke="${C_LINE}" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round"/>
      ${dots}
    </svg>`;
  }

  /**
   * Donut-Chart für Wortart-Verteilung.
   * @param {object} dist - { noun, verb, adj, prep, adv, other }
   * @param {object} opts
   * @returns {string} SVG-Markup
   */
  function donutChartSVG(dist, opts = {}) {
    const SIZE   = opts.size || 140;
    const R      = SIZE / 2;
    const r      = opts.innerRadius || R * 0.58;
    const COLORS = opts.colors || {
      noun: '#2E86AB', verb: '#1E3A5F', adj: '#52BE80',
      prep: '#F39C12', adv: '#8E44AD', other: '#BDC3C7'
    };
    const LABELS = { noun: 'Nomen', verb: 'Verb', adj: 'Adjektiv',
                     prep: 'Präp.', adv: 'Adverb', other: 'Andere' };

    const total = Object.values(dist).reduce((s, v) => s + v, 0);
    if (total === 0) return `<svg width="${SIZE}" height="${SIZE}"></svg>`;

    let angle = -Math.PI / 2; // Start oben
    const slices = Object.entries(dist)
      .filter(([, v]) => v > 0)
      .map(([key, val]) => {
        const frac  = val / total;
        const start = angle;
        angle += frac * Math.PI * 2;
        return { key, val, frac, start, end: angle };
      });

    function arc(s) {
      const x1 = R + R * Math.cos(s.start);
      const y1 = R + R * Math.sin(s.start);
      const x2 = R + R * Math.cos(s.end);
      const y2 = R + R * Math.sin(s.end);
      const x3 = R + r * Math.cos(s.end);
      const y3 = R + r * Math.sin(s.end);
      const x4 = R + r * Math.cos(s.start);
      const y4 = R + r * Math.sin(s.start);
      const large = s.frac > 0.5 ? 1 : 0;
      return `<path d="M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2}
                        L${x3},${y3} A${r},${r} 0 ${large},0 ${x4},${y4} Z"
                   fill="${COLORS[s.key] || '#ccc'}">
                <title>${LABELS[s.key]}: ${s.val} (${Math.round(s.frac * 100)}%)</title>
              </path>`;
    }

    // Legende
    const legendItems = slices.map((s, i) => {
      const lx = SIZE + 12;
      const ly = 16 + i * 18;
      return `<rect x="${lx}" y="${ly - 10}" width="10" height="10" rx="2"
                    fill="${COLORS[s.key]}"/>
              <text x="${lx + 14}" y="${ly}" font-size="10"
                    fill="#555" font-family="DM Sans, sans-serif">
                ${LABELS[s.key]} (${s.val})
              </text>`;
    }).join('');

    const legendW = 100;
    return `<svg xmlns="http://www.w3.org/2000/svg"
                 width="${SIZE + legendW + 20}" height="${SIZE}"
                 viewBox="0 0 ${SIZE + legendW + 20} ${SIZE}">
      ${slices.map(arc).join('')}
      <circle cx="${R}" cy="${R}" r="${r - 2}" fill="white"/>
      <text x="${R}" y="${R - 6}" text-anchor="middle"
            font-size="18" font-weight="700" fill="#1E3A5F"
            font-family="DM Sans, sans-serif">${total}</text>
      <text x="${R}" y="${R + 12}" text-anchor="middle"
            font-size="9" fill="#888"
            font-family="DM Sans, sans-serif">Wörter</text>
      ${legendItems}
    </svg>`;
  }

  // ══════════════════════════════════════════════════════════════
  // 8. GESAMTZUSAMMENFASSUNG
  // ══════════════════════════════════════════════════════════════

  /**
   * Vollständige Statistik-Zusammenfassung für das Dashboard.
   * @param {Array}  words    - Alle Vokabeln
   * @param {object} lessons  - { lessonId: [words] }
   * @returns {object}
   */
  function getDashboard(words, lessons = {}) {
    const today   = todayStr();
    const due     = words.filter(w => !w.sm2.due || w.sm2.due <= today).length;
    const mastered= words.filter(w => w.sm2.repetitions >= 3 && w.sm2.ef >= 2.0).length;
    const correct = words.reduce((s, w) => s + w.stats.correct, 0);
    const wrong   = words.reduce((s, w) => s + w.stats.wrong,   0);
    const total   = correct + wrong;

    return {
      totalWords:      words.length,
      dueToday:        due,
      mastered,
      inProgress:      words.filter(w => w.sm2.repetitions > 0 && w.sm2.repetitions < 3).length,
      overallRate:     total > 0 ? Math.round((correct / total) * 100) : 0,
      streak:          getStreak(),
      recentSessions:  getRecentSessions(7),
      problems:        getProblems(words, 5),
      lessonStats:     getLessonStats(lessons),
      posDistribution: getPosDistribution(words),
    };
  }

  // ══════════════════════════════════════════════════════════════
  // HILFSFUNKTIONEN
  // ══════════════════════════════════════════════════════════════

  function todayStr() {
    return new Date().toISOString().split('T')[0];
  }

  function offsetDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  // ── Public API ────────────────────────────────────────────────
  return {
    // Streak
    getStreak,
    updateStreak,
    // Sitzungen
    saveSession,
    getSessions,
    getRecentSessions,
    // Problemwörter
    getProblems,
    getLongestUntouched,
    // Lektionen
    getLessonStats,
    // Wortarten
    getPosDistribution,
    // Lernkurve
    getLearningCurve,
    // Charts (SVG)
    barChartSVG,
    lineChartSVG,
    donutChartSVG,
    // Dashboard
    getDashboard,
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Stats;
}
