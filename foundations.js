/**
 * foundations.js — MMF Web App · Pass 00
 * ─────────────────────────────────────────────────────────────────────────
 * Utility formatters exported to window.  Load as a plain <script>:
 *   <script src="foundations.js"></script>
 *
 * Functions:
 *   formatMNT(n)             → "₮ 2,450,000"  (currency, ₮ + space + commas)
 *   formatPct(n, suffix?)    → "19.5%"  (bare percentage; suffix glued, no /slash/)
 *   formatRate(n)            → "14.5% жилийн"  (F-16 · annum rate, no /Жил/ slash)
 *   formatDelta(n)           → "+₮ 1,200"  /  "−₮ 500"
 *   formatDate(d)            → "2027.02.27"  (calendar date only)
 *   formatDateTime(d)        → "2026.05.15, 14:05"  (F-13 · 24h timestamp)
 *   formatRelative(d)        → "3 өдрийн өмнө"
 *
 * Hard rules (brief 00):
 *   - Currency symbol: ₮ (Mongolian Tugrik, U+20AE)
 *   - Thousands separator: comma  e.g. 2,450,000
 *   - Null / NaN / undefined → em-dash "—"
 *   - Negative amounts: minus sign "−" (U+2212), not hyphen
 *   - No numbers hardcoded or hand-formatted anywhere in the app
 * ─────────────────────────────────────────────────────────────────────────
 */
(function (w) {
  'use strict';

  /* ── formatMNT ───────────────────────────────────────────────────────────
     Currency: ₮ narrow-space thousands-comma number.
     formatMNT(2450000)   → "₮ 2,450,000"
     formatMNT(0)         → "₮ 0"
     formatMNT(-500000)   → "−₮ 500,000"
     formatMNT(null)      → "—"
  ─────────────────────────────────────────────────────────────────────────*/
  w.formatMNT = function (n) {
    if (n == null || (typeof n === 'number' && isNaN(n))) return '\u2014';
    var num = Number(n);
    if (isNaN(num)) return '\u2014';
    var sign = num < 0 ? '\u2212' : '';           /* U+2212 minus */
    var abs  = Math.abs(Math.round(num));
    return sign + '\u20AE\u00A0' + abs.toLocaleString('en-US'); /* ₮ + nbsp */
  };

  /* ── formatPct ───────────────────────────────────────────────────────────
     Percentage, always 1 decimal.  Optional space-suffix.
     formatPct(19.5)          → "19.5%"
     formatPct(22.0)          → "22.0%"
     formatPct(19.5, '/жил')  → "19.5 % /жил"
     formatPct(null)          → "—"
  ─────────────────────────────────────────────────────────────────────────*/
  w.formatPct = function (n, suffix) {
    if (n == null || (typeof n === 'number' && isNaN(n))) return '\u2014';
    var num = Number(n);
    if (isNaN(num)) return '\u2014';
    var str = num.toFixed(1);
    /* F-16 · glue % to the figure, single nbsp before the unit word — no /slash/ */
    if (suffix) return str + '%\u00A0' + suffix;
    return str + '%';
  };

  /* ── formatRate (F-16) ───────────────────────────────────────────────────
     Annualised rate. Percent glued to a mono figure, nbsp, then "жилийн".
     No /Жил/ slash wrapping, ever.
     formatRate(14.5)   → "14.5% жилийн"
     formatRate(19.5)   → "19.5% жилийн"
     formatRate(null)   → "—"
  ─────────────────────────────────────────────────────────────────────────*/
  w.formatRate = function (n) {
    if (n == null || (typeof n === 'number' && isNaN(n))) return '\u2014';
    var num = Number(n);
    if (isNaN(num)) return '\u2014';
    /* NN.N% + nbsp + жилийн */
    return num.toFixed(1) + '%\u00A0\u0436\u0438\u043b\u0438\u0439\u043d';
  };

  /* ── formatDelta ─────────────────────────────────────────────────────────
     Signed currency delta with explicit + or − prefix.
     formatDelta(1200)    → "+₮ 1,200"
     formatDelta(-48000)  → "−₮ 48,000"
     formatDelta(0)       → "+₮ 0"
     formatDelta(null)    → "—"
  ─────────────────────────────────────────────────────────────────────────*/
  w.formatDelta = function (n) {
    if (n == null || (typeof n === 'number' && isNaN(n))) return '\u2014';
    var num = Number(n);
    if (isNaN(num)) return '\u2014';
    var sign = num < 0 ? '\u2212' : '+';
    var abs  = Math.abs(Math.round(num));
    return sign + '\u20AE\u00A0' + abs.toLocaleString('en-US');
  };

  /* ── formatDate ──────────────────────────────────────────────────────────
     ISO string or Date → "YYYY.MM.DD"
     formatDate('2027-02-27')        → "2027.02.27"
     formatDate(new Date())          → current date
     formatDate('not-a-date')        → "—"
  ─────────────────────────────────────────────────────────────────────────*/
  w.formatDate = function (d) {
    var dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt.getTime())) return '\u2014';
    var y   = dt.getFullYear();
    var m   = String(dt.getMonth() + 1).padStart(2, '0');
    var day = String(dt.getDate()).padStart(2, '0');
    return y + '.' + m + '.' + day;
  };

  /* ── formatDateTime (F-13) ───────────────────────────────────────────────
     ISO string or Date → "YYYY.MM.DD, HH:mm" (24-hour, no AM/PM, no ISO mix).
     formatDateTime('2026-05-15T14:05')  → "2026.05.15, 14:05"
     formatDateTime(new Date())          → current timestamp
     formatDateTime('not-a-date')        → "—"
  ─────────────────────────────────────────────────────────────────────────*/
  w.formatDateTime = function (d) {
    var dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt.getTime())) return '\u2014';
    var y   = dt.getFullYear();
    var m   = String(dt.getMonth() + 1).padStart(2, '0');
    var day = String(dt.getDate()).padStart(2, '0');
    var hh  = String(dt.getHours()).padStart(2, '0');
    var mm  = String(dt.getMinutes()).padStart(2, '0');
    return y + '.' + m + '.' + day + ', ' + hh + ':' + mm;
  };

  /* ── formatRelative ──────────────────────────────────────────────────────
     Date → Mongolian relative string (past only; future → full date).
     < 60s    → "Одоо"
     < 60min  → "N минутын өмнө"
     < 24h    → "N цагийн өмнө"
     < 7d     → "N өдрийн өмнө"
     < 5w     → "N долоо хоногийн өмнө"
     < 12mo   → "N сарын өмнө"
     else     → "N жилийн өмнө"
  ─────────────────────────────────────────────────────────────────────────*/
  w.formatRelative = function (d) {
    var dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt.getTime())) return '\u2014';
    var diff = Date.now() - dt.getTime();           /* ms; positive = past */
    if (diff < 0) return w.formatDate(dt);          /* future → full date */
    var secs = Math.round(diff / 1000);
    if (secs < 60)   return '\u041e\u0434\u043e\u043e'; /* Одоо */
    var mins = Math.round(secs / 60);
    if (mins < 60)   return mins + ' \u043c\u0438\u043d\u0443\u0442\u044b\u043d \u04e9\u043c\u043d\u04e9'; /* минутын өмнө */
    var hrs = Math.round(mins / 60);
    if (hrs < 24)    return hrs  + ' \u0446\u0430\u0433\u0438\u0439\u043d \u04e9\u043c\u043d\u04e9';  /* цагийн өмнө */
    var days = Math.round(hrs / 24);
    if (days < 7)    return days + ' \u04e9\u0434\u0440\u0438\u0439\u043d \u04e9\u043c\u043d\u04e9'; /* өдрийн өмнө */
    var weeks = Math.floor(days / 7);
    if (weeks < 5)   return weeks + ' \u0434\u043e\u043b\u043e\u043e \u0445\u043e\u043d\u043e\u0433\u0438\u0439\u043d \u04e9\u043c\u043d\u04e9'; /* долоо хоногийн өмнө */
    var months = Math.round(days / 30.44);
    if (months < 12) return months + ' \u0441\u0430\u0440\u044b\u043d \u04e9\u043c\u043d\u04e9'; /* сарын өмнө */
    var years = Math.round(days / 365.25);
    return years + ' \u0436\u0438\u043b\u0438\u0439\u043d \u04e9\u043c\u043d\u04e9'; /* жилийн өмнө */
  };

}(window));
