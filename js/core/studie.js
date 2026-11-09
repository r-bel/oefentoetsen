// ============================================================
// Studie: herhaalschema (Leitner) + adaptieve dagplanning naar een toetsdatum.
// Pure functies zonder scherm of opslag (zo te testen met Node).
//
// ADAPTIEF:
//  - Herhalen: elke kaart zit in een doos 1-5. "Wist ik" → doos hoger en langer
//    wachten; "Twijfel" → morgen opnieuw; "Wist ik niet" → doos 1, nog eens in deze sessie.
//    Wachttijden worden ingekort zodat alles nog vóór de toets herhaald wordt.
//  - Nieuwe kaarten per dag = wat nog nieuw is ÷ resterende studiedagen,
//    bijgestuurd met de recente trefzekerheid (veel fout → trager, alles juist → sneller).
//  - Volgorde binnen een vak: een kaart met "na" komt pas als de vorige kaart
//    zit (bv. Latijn: eerst de betekenis, dan de middenkolom; Frans: eerst FR→NL, dan NL→FR).
//  - De tijd per kaart wordt gemeten; het aantal kaarten past zich aan het tijdsbudget aan.
//  - Meerdere toetsen delen het dagbudget, de dichtste toets krijgt het meeste.
//  - Een gemiste dag schuift alles op: het plan wordt elke dag opnieuw berekend
//    uit de toestand van de kaarten, er staat geen vast schema dat "achterloopt".
//  - Proeftoetsen in de laatste dagen: normaal → foutgericht → moeilijk, en
//    overslaan of herhalen naargelang de score.
//  - Oefenreeksen voor onderdelen zonder kaarten (grammatica): het niveau stijgt
//    vanzelf (makkelijk → normaal → moeilijk) zodra het zit.
// ============================================================
(function (root) {
  "use strict";
  // Standaardinstellingen; config.js (APP_CONFIG.studie) en de instellingen per leerling overschrijven dit.
  const DEFAULTS = {
    minuten: 20,              // studietijd per dag (alle toetsen samen)
    blok: 10,                 // kaarten per blokje
    dagen: [1, 2, 3, 4, 5, 6, 0], // studiedagen (0 = zondag … 6 = zaterdag)
    intervallen: [1, 2, 4, 7, 14], // dagen tot de volgende herhaling per doos 1..5
    maxNieuw: 25,             // maximum nieuwe kaarten per dag per toets
    secPerKaart: 12,          // startwaarde; wordt per leerling gemeten
    nieuwFactor: 1.6,         // een nieuwe kaart kost meer tijd dan een herhaling
    proef: true,              // proeftoetsen opnemen in de planning
    proefDagen: 3,            // eerste proeftoets zoveel dagen voor de toets
    oefenReeks: 10,           // vragen per dagelijkse oefenreeks (onderdelen zonder kaarten)
    proefVragen: 20,          // vragen per proeftoets
    wiePlant: "iedereen",     // "iedereen" | "ouder" (planning en instellingen achter een pincode)
    pin: "",
    studieUur: "17:00",       // voor het agendabestand (.ics)
  };
  const MAXB = 5;
  const SCORE = [0, 0.15, 0.4, 0.65, 0.85, 1]; // beheersing per doos (0 = nog nieuw)

  // ---------- datums (lokaal, "JJJJ-MM-DD") ----------
  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (s) => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d, 12); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); };
  const diff = (a, b) => Math.round((parse(b) - parse(a)) / 864e5); // b − a in dagen
  const today = () => ymd(new Date());
  const weekday = (s) => parse(s).getDay();
  const isStudyDay = (s, cfg) => (cfg.dagen || DEFAULTS.dagen).includes(weekday(s));
  function studyDays(from, to, cfg) { let n = 0; for (let d = from; diff(d, to) >= 0; d = addDays(d, 1)) if (isStudyDay(d, cfg)) n++; return n; }
  const config = (...layers) => {
    const c = Object.assign({}, DEFAULTS, ...layers.filter(Boolean).map((l) => Object.fromEntries(Object.entries(l).filter(([, v]) => v !== undefined && v !== null && v !== ""))));
    if (!Array.isArray(c.dagen) || !c.dagen.length) c.dagen = DEFAULTS.dagen.slice();
    return c;
  };

  // ---------- Leitner ----------
  // e = { b: doos, d: volgende herhaling, f: eerst gezien, l: laatst, n: keer, ok: keer juist }
  // cap = laatste dag vóór de toets: een herhaling wordt nooit later gepland dan dat
  function rate(e, rating, day, cfg, cap) {
    cfg = cfg || DEFAULTS;
    const x = e ? { ...e } : { b: 0, f: day, n: 0, ok: 0 };
    x.n = (x.n || 0) + 1; x.l = day;
    if (rating === "ja") {
      x.ok = (x.ok || 0) + 1;
      x.b = x.b ? Math.min(MAXB, x.b + 1) : 2;          // meteen gekend: doos 2
      let due = addDays(day, cfg.intervallen[x.b - 1] || 14);
      if (cap && diff(day, cap) >= 1 && diff(due, cap) < 0) due = cap;
      x.d = due;
    } else if (rating === "twijfel") {
      x.b = x.b > 2 ? x.b - 1 : Math.max(1, x.b || 1);
      x.d = addDays(day, 1);
    } else {
      x.b = 1; x.d = addDays(day, 1);
    }
    return x;
  }
  // toetsresultaat → kaart (een juist antwoord in een toets telt als "wist ik", fout als "wist ik niet")
  function fromResult(e, correct, day, cfg, cap) {
    if (correct && e && e.d && diff(day, e.d) > 0) return { ...e, l: day }; // nog niet aan de beurt: niets veranderen
    return rate(e, correct ? "ja" : "nee", day, cfg, cap);
  }

  function mastery(cards, store) {
    const boxes = [0, 0, 0, 0, 0, 0];
    let s = 0;
    cards.forEach((c) => { const e = store[c.key]; const b = e ? e.b || 0 : 0; boxes[b]++; s += SCORE[b]; });
    return { pct: cards.length ? Math.round((s / cards.length) * 100) : 0, boxes, n: cards.length, nNew: boxes[0], nKnown: boxes[4] + boxes[5] };
  }
  const unlocked = (c, store, keys) => !c.na || !keys.has(c.na) || (store[c.na] && store[c.na].b >= 2);

  // ---------- proeftoetsen en oefenreeksen ----------
  // ss = sessies van deze toets [{ mode, level, pct, date (ISO) }], oud → nieuw
  function quizTask(t, ss, daysLeft, cfg, day, hasQuiz, gramUnits) {
    if (!hasQuiz || daysLeft < 1) return null;
    const on = (s) => ymd(new Date(s.date)) === day;
    const doneToday = ss.some(on);
    if (cfg.proef && daysLeft <= cfg.proefDagen) {
      if (doneToday && daysLeft > 1) return { done: true };
      const last = (pred) => { for (let i = ss.length - 1; i >= 0; i--) if (pred(ss[i])) return ss[i]; return null; };
      const after = (a, pred) => ss.some((s) => s.date > a.date && pred(s));
      const pn = last((s) => s.mode === "proef" && s.level !== "hard");
      const ph = last((s) => s.mode === "proef" && s.level === "hard");
      const base = { count: cfg.proefVragen };
      if (!pn && !ph) return { ...base, mode: "proef", level: "normal", label: "Proeftoets (normaal)" };
      if (!ph) {
        const foutenNa = after(pn, (s) => s.mode === "fouten");
        if (pn.pct < 90 && !foutenNa) return { ...base, mode: "fouten", level: "normal", label: "Toets op je fouten" };
        return { ...base, mode: "proef", level: "hard", label: "Proeftoets (moeilijk)" };
      }
      if (ph.pct < 70 && !after(ph, (s) => s.mode === "fouten")) return { ...base, mode: "fouten", level: "hard", label: "Toets op je fouten (moeilijk)" };
      return doneToday ? { done: true } : null;
    }
    // vóór de proeftoetsen: dagelijkse oefenreeks voor onderdelen zonder kaarten, niveau stijgt vanzelf
    if (!gramUnits || !gramUnits.length) return null;
    const oef = ss.filter((s) => s.mode === "oefen");
    if (oef.some(on)) return { done: true };
    const order = ["easy", "normal", "hard"];
    let lvl = "easy";
    if (oef.length) {
      const l = oef[oef.length - 1], i = Math.max(0, order.indexOf(l.level));
      lvl = l.pct >= 80 ? order[Math.min(2, i + 1)] : l.pct < 50 ? order[Math.max(0, i - 1)] : order[i];
    }
    return { mode: "oefen", level: lvl, count: cfg.oefenReeks, units: gramUnits, label: `Oefenreeks (${({ easy: "makkelijk", normal: "normaal", hard: "moeilijk" })[lvl]})` };
  }

  // ---------- dagplanning over alle toetsen ----------
  // items: [{ toets: {id, vak, datum, …}, cards: [{key, na?}], store: {key: e}, acc: 0..1|null,
  //           sessions: [...], hasQuiz, gramUnits: [...] }]
  // stats: { secPerKaart } (gemeten)
  function planToday(items, cfg, day, stats) {
    cfg = config(cfg);
    day = day || today();
    const sec = Math.max(4, Math.min(40, (stats && stats.secPerKaart) || cfg.secPerKaart));
    const plans = items.map((it) => {
      const T = it.toets.datum, daysLeft = diff(day, T);
      const p = { id: it.toets.id, toets: it.toets, daysLeft, past: daysLeft < 0, isToday: daysLeft === 0, studyDay: isStudyDay(day, cfg) };
      const store = it.store || {}, cards = it.cards || [], keys = new Set(cards.map((c) => c.key));
      p.mastery = mastery(cards, store);
      p.nCards = cards.length;
      if (p.past) return p;
      const lastStudy = addDays(T, -1);
      p.studyDaysLeft = daysLeft >= 1 ? studyDays(day, lastStudy, cfg) + (isStudyDay(day, cfg) ? 0 : 1) : 0; // vandaag telt altijd mee als je oefent
      // herhalen: alles wat aan de beurt is; de laatste dag ook alles uit doos 1-2 dat vandaag nog niet kwam
      let due = cards.filter((c) => store[c.key] && store[c.key].d && diff(store[c.key].d, day) >= 0);
      if (daysLeft <= 1) {
        const extra = cards.filter((c) => store[c.key] && store[c.key].b <= 2 && store[c.key].l !== day && !due.includes(c));
        due = due.concat(extra);
      }
      if (daysLeft === 0) { // toetsdag: één korte opwarming met de moeilijkste kaarten
        const seen = cards.filter((c) => store[c.key] && store[c.key].l === day).length;
        due = cards.filter((c) => store[c.key] && store[c.key].b <= 2 && store[c.key].l !== day).slice(0, Math.max(0, cfg.blok - seen));
      }
      due.sort((a, b) => store[a.key].b - store[b.key].b || (store[a.key].d < store[b.key].d ? -1 : 1));
      // nieuw: verdeeld over de resterende leerdagen (proeftoetsdagen niet meegerekend)
      const newAll = cards.filter((c) => !store[c.key]);
      const newOpen = newAll.filter((c) => unlocked(c, store, keys));
      const introduced = cards.filter((c) => store[c.key] && store[c.key].f === day).length;
      const reserve = cfg.proef && it.hasQuiz ? (p.studyDaysLeft >= 5 ? 2 : p.studyDaysLeft >= 3 ? 1 : 0) : 0;
      const learnDays = p.studyDaysLeft - reserve;
      const factor = it.acc == null ? 1 : it.acc < 0.6 ? 0.7 : it.acc > 0.85 ? 1.3 : 1;
      const pool = newAll.length + introduced;
      let target = learnDays <= 1 ? pool : Math.ceil((pool / learnDays) * factor);
      target = Math.min(target, cfg.maxNieuw, pool);
      if (it.target != null) target = Math.min(it.target, pool); // vastgelegd bij de eerste berekening van de dag (stabiel doel)
      p.newTarget = target; p.introduced = introduced; p.factor = factor;
      p.newWanted = daysLeft === 0 ? 0 : Math.max(0, Math.min(target - introduced, newOpen.length));
      p.locked = newAll.length - newOpen.length;
      p.due = due.map((c) => c.key); p.newOpen = newOpen.map((c) => c.key);
      p.quiz = quizTask(it.toets, it.sessions || [], daysLeft, cfg, day, it.hasQuiz, it.gramUnits);
      p.quizSec = p.quiz && !p.quiz.done ? (p.quiz.count || 10) * 22 : 0;
      p.urgency = 1 / Math.max(1, daysLeft);
      return p;
    });
    // budget verdelen: eerst toetsen/reeksen en herhalingen (die gaan altijd voor), dan nieuwe kaarten naar dringendheid
    const live = plans.filter((p) => !p.past);
    const budget = cfg.minuten * 60;
    let used = live.reduce((s, p) => s + p.quizSec, 0);
    // herhalingen: samen maximaal 1,5 × het budget (anders morgen verder, laagste dozen eerst)
    const dueCap = Math.max(cfg.blok, Math.floor((budget * 1.5 - used) / sec));
    let dueTotal = live.reduce((s, p) => s + p.due.length, 0);
    if (dueTotal > dueCap) {
      live.slice().sort((a, b) => a.daysLeft - b.daysLeft).reduce((left, p) => { const k = Math.min(p.due.length, Math.max(0, left)); p.dueOver = p.due.length - k; p.due = p.due.slice(0, k); return left - k; }, dueCap);
      dueTotal = dueCap;
    }
    used += dueTotal * sec;
    let rest = Math.max(0, budget - used);
    const nsec = sec * cfg.nieuwFactor;
    const want = live.map((p) => p.newWanted * nsec);
    const alloc = live.map(() => 0);
    for (let k = 0; k < 4 && rest > nsec / 2; k++) {
      const open = live.map((p, i) => (alloc[i] < want[i] ? i : -1)).filter((i) => i >= 0);
      if (!open.length) break;
      const W = open.reduce((s, i) => s + live[i].urgency, 0);
      let given = 0;
      open.forEach((i) => { const g = Math.min(want[i] - alloc[i], (rest * live[i].urgency) / W); alloc[i] += g; given += g; });
      rest -= given;
    }
    live.forEach((p, i) => {
      // afronden; de laatste studiedag gaat alles mee wat nog nieuw is (krap)
      let n = Math.round(alloc[i] / nsec);
      if (p.daysLeft <= 1) n = p.newWanted;
      if (p.newWanted > 0 && n === 0 && rest >= 0 && want[i] > 0 && alloc[i] > 0) n = 1;
      p.newToday = Math.min(n, p.newWanted);
      p.new = p.newOpen.slice(0, p.newToday);
      p.krap = p.newToday < p.newWanted && p.daysLeft >= 1;
      p.estMin = Math.max(p.due.length || p.new.length ? 1 : 0, Math.round((p.due.length * sec + p.new.length * nsec) / 60));
      p.quizMin = Math.round(p.quizSec / 60);
      p.cardsDone = !p.due.length && !p.new.length;
    });
    return plans;
  }

  // voorspelling voor morgen (na de sessie): hoeveel kaarten komen terug
  function dueOn(cards, store, day) { return cards.filter((c) => store[c.key] && store[c.key].d && diff(store[c.key].d, day) >= 0).length; }

  // ---------- agendabestand (.ics) ----------
  function ics(events) {
    const esc = (s) => String(s).replace(/[\\,;]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//oefentoetsen//studieplanning//NL", "CALSCALE:GREGORIAN"];
    events.forEach((e, i) => {
      lines.push("BEGIN:VEVENT", `UID:${e.uid || i + "-" + stamp}@oefentoetsen`, `DTSTAMP:${stamp}`);
      const d = e.date.replace(/-/g, "");
      if (e.time) {
        const [h, m] = e.time.split(":").map(Number), end = h * 60 + m + (e.minutes || 20);
        lines.push(`DTSTART:${d}T${pad(h)}${pad(m)}00`, `DTEND:${d}T${pad(Math.floor(end / 60) % 24)}${pad(end % 60)}00`);
      } else lines.push(`DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${addDays(e.date, 1).replace(/-/g, "")}`);
      lines.push(`SUMMARY:${esc(e.title)}`);
      if (e.desc) lines.push(`DESCRIPTION:${esc(e.desc)}`);
      lines.push("END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }

  const Studie = { DEFAULTS, MAXB, config, rate, fromResult, mastery, planToday, quizTask, dueOn, ics, date: { ymd, parse, addDays, diff, today, weekday, isStudyDay, studyDays } };
  root.Studie = Studie;
  if (typeof module !== "undefined") module.exports = Studie;
})(typeof window !== "undefined" ? window : globalThis);
