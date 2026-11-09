// ============================================================
// VAK – Wiskunde 5de leerjaar · Kadet 5 – Kaap 2 (les 1-12)
// Alle oefeningen worden telkens opnieuw berekend, in de stijl van de
// herhalingsbundel (kopieerbladen 10A–10G). Teksten en uitleg: inhoud.js.
// Elk onderdeel = unit({ id, cases, gen(level, c) }); c = het soort oefening
// (in de eindtoets komt elk soort één keer aan bod).
// Een vraag kan een eigen controle hebben: q.chk(given, level) → { status, tag?, note?, points? }.
// ============================================================
(function () {
  "use strict";
  const I = Vakken.inhoud("wiskunde-5-kaap2");
  const { GROUPS, BEGRIPPEN, UUR_WOORDEN, GETAL_WOORD, WINKELS, TAGS } = I;

  // ---------- hulpfuncties ----------
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uniqBy = (arr, k) => { const s = new Set(); return arr.filter((x) => { const v = k(x); if (s.has(v)) return false; s.add(v); return true; }); };
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const typed = (level, p = 0.6) => (level === "easy" ? false : level === "hard" ? true : Math.random() < p);
  const pad2 = (n) => String(n).padStart(2, "0");

  // breuken (teller/noemer als gehele getallen)
  const F = (n, d) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
  const simp = (n, d) => { const g = gcd(n, d); return [n / g, d / g]; };
  // breuk als HTML: onechte breuk + (indien > 1) "= w en r/d"
  const showFrac = (n, d, mixedToo = true) => {
    const [a, b] = simp(n, d);
    if (b === 1) return String(a);
    if (a > b && mixedToo) return `${F(a, b)} = ${Math.floor(a / b)} en ${F(a % b, b)}`;
    return F(a, b);
  };
  const fracTxt = (n, d) => (d === 1 ? String(n) : `${n}/${d}`);
  // "2 en 1/3", "2 1/3", "7/3", "2", "2 + 1/3" → { w, n, d, num, den (totaal), form }
  function parseFrac(s) {
    const t = String(s ?? "").toLowerCase().replace(/[−–]/g, "-").replace(/\s+/g, " ").trim();
    let m = t.match(/^(\d+)\s*(?:en|\+|\s)\s*(\d+)\s*\/\s*(\d+)$/);
    if (m) { const w = +m[1], n = +m[2], d = +m[3]; if (!d) return null; return { w, n, d, num: w * d + n, den: d, form: "mixed" }; }
    m = t.match(/^(\d+)\s*\/\s*(\d+)$/);
    if (m) { const n = +m[1], d = +m[2]; if (!d) return null; return { w: 0, n, d, num: n, den: d, form: "frac" }; }
    m = t.match(/^(\d+)$/);
    if (m) return { w: +m[1], n: 0, d: 1, num: +m[1], den: 1, form: "int" };
    return null;
  }
  const sameVal = (p, n, d) => p && p.num * d === n * p.den;
  const isSimplified = (p) => p && (p.form === "int" || (gcd(p.n, p.d) === 1 && (p.form !== "frac" || p.n !== 0)));

  // kommagetallen: rekenen in duizendsten (geen afrondingsfouten)
  const N = (x, dec) => { const s = dec === undefined ? String(+x.toFixed(6)) : x.toFixed(dec); return s.replace(".", ","); };
  function parseNum(s) {
    const t = String(s ?? "").replace(/[−–]/g, "-").replace(/€/g, "").replace(/\s/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
    const m = t.match(/^-?\d+(\.\d+)?$/);
    return m ? parseFloat(t) : null;
  }
  const eqNum = (a, b) => a !== null && Math.abs(a - b) < 1e-9;

  // tijd "13:20:05", "13u20", "13.20" → [h, m, s]
  function parseTime(s) {
    const g = String(s ?? "").match(/\d+/g);
    if (!g || g.length < 2) return null;
    return [+g[0], +g[1], g[2] !== undefined ? +g[2] : 0];
  }
  const T = (h, m, s) => `${pad2(h)}:${pad2(m)}` + (s === undefined || s === null ? "" : `:${pad2(s)}`);

  // ---------- klok (SVG) ----------
  function clockSvg(h, m, s, opts = {}) {
    const size = opts.size || 150, R = 56;
    const pt = (deg, r) => { const a = ((deg - 90) * Math.PI) / 180; return [+(r * Math.cos(a)).toFixed(2), +(r * Math.sin(a)).toFixed(2)]; };
    const ticks = Array.from({ length: 60 }, (_, i) => { const big = i % 5 === 0, [x1, y1] = pt(i * 6, R), [x2, y2] = pt(i * 6, big ? R - 7 : R - 4); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1e293b" stroke-width="${big ? 2 : 1}"/>`; }).join("");
    const nums = Array.from({ length: 12 }, (_, i) => { const [x, y] = pt((i + 1) * 30, R - 15); return `<text x="${x}" y="${y + 3.5}" text-anchor="middle" font-size="10" fill="#1e293b" font-family="system-ui,sans-serif">${i + 1}</text>`; }).join("");
    const hand = (deg, len, w, col) => { const [x, y] = pt(deg, len); return `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`; };
    const hands = h === null ? "" :
      hand(((h % 12) + m / 60) * 30, 27, 5, "#0f172a") + hand((m + (s || 0) / 60) * 6, 42, 3, "#0f172a") +
      (s !== null && s !== undefined && !opts.noSec ? hand(s * 6, 47, 1.2, "#dc2626") : "");
    return `<svg class="clock" viewBox="-62 -62 124 124" width="${size}" height="${size}" role="img" aria-label="klok"><circle r="60" fill="#fff" stroke="#1e293b" stroke-width="2"/>${ticks}${nums}${hands}<circle r="3" fill="#0f172a"/></svg>`;
  }

  // ---------- getallenas 0–2 in achtsten (klikbaar) ----------
  function numberLine(mark) {
    const u = 30, pad = 22, xmax = 16;
    const X = (k) => pad + k * u, Y = pad + u; // de as ligt op y = 0 (ymin −1 … ymax 1)
    const ticks = Array.from({ length: xmax + 1 }, (_, k) => `<line x1="${X(k)}" y1="${Y - (k % 8 === 0 ? 10 : 6)}" x2="${X(k)}" y2="${Y + (k % 8 === 0 ? 10 : 6)}" stroke="currentColor" stroke-width="${k % 8 === 0 ? 2 : 1.2}"/>`).join("");
    const lbl = [0, 8, 16].map((k) => `<text x="${X(k)}" y="${Y + 26}" text-anchor="middle" font-size="14" fill="currentColor">${k / 8}</text>`).join("");
    const sol = mark !== undefined ? `<circle cx="${X(mark)}" cy="${Y}" r="7" fill="#22c55e" opacity=".85"/><text x="${X(mark)}" y="${Y - 14}" text-anchor="middle" font-size="12" fill="#22c55e">juist</text>` : "";
    return `<svg class="g-svg numline" viewBox="0 0 ${2 * pad + xmax * u} ${2 * pad + 2 * u}" data-xmin="0" data-xmax="${xmax}" data-ymin="-1" data-ymax="1" data-unit="${u}" data-pad="${pad}" style="max-width:560px;width:100%;cursor:pointer">
      <rect x="0" y="0" width="${2 * pad + xmax * u}" height="${2 * pad + 2 * u}" fill="transparent"/>
      <line x1="${X(0) - 8}" y1="${Y}" x2="${X(xmax) + 14}" y2="${Y}" stroke="currentColor" stroke-width="2"/><path d="M${X(xmax) + 14},${Y} l-8,-5 v10 z" fill="currentColor"/>${ticks}${lbl}${sol}<g class="g-marks"></g></svg>`;
  }

  // ============================================================
  // ONDERDELEN
  // ============================================================
  const UNITS = [];
  const unit = (u) => { Object.assign(u, I.UNITS[u.id]); UNITS.push(u); return u; };
  const base = (u, o) => Object.assign({ unit: u.id, unitLabel: u.label, page: u.page, rule: u.rule, group: u.group }, o);
  const FRAC_HELP = ["/", " en "];
  const mcFrom = (vals, right) => uniqBy(vals.filter(Boolean), (x) => x.v).slice(0, 5).map((x) => ({ v: x.v, html: x.html })).sort(() => Math.random() - 0.5);
  const optFrac = (n, d) => ({ v: fracTxt(n, d), html: d === 1 ? String(n) : F(n, d) });
  const optMixed = (w, n, d) => ({ v: `${w} en ${n}/${d}`, html: `${w} en ${F(n, d)}` });

  // ---------- G. Breuken ----------
  unit({
    id: "gehelen", cases: 3, caseNames: ["kleine noemer", "grotere noemer", "meer gehelen"],
    gen(level, c = rnd(0, 2)) {
      const d = c === 0 ? rnd(2, 5) : rnd(5, 9), w = c === 2 ? rnd(3, level === "easy" ? 3 : 6) : rnd(1, level === "easy" ? 2 : 3), r = rnd(1, d - 1), n = w * d + r;
      const q = base(this, { instruction: "Zet om in gehelen en een breuk.", prompt: `${F(n, d)} = … en …`, answerShown: `${w} en ${F(r, d)}`, tag: "gehelen" });
      if (!typed(level)) {
        const opts = mcFrom([optMixed(w, r, d), r !== d - r ? optMixed(w, d - r, d) : null, w > 1 ? optMixed(w - 1, r + d, d) : optMixed(w + 1, r, d), optMixed(r, w, d), optMixed(n % 10 || 1, r, d)]);
        return Object.assign(q, { mode: "mc", options: opts, answer: `${w} en ${r}/${d}` });
      }
      return Object.assign(q, { mode: "text", right: `${w} en ${r}/${d}`, hint: "Schrijf zo: 2 en 1/3", helpers: FRAC_HELP, chk: (g) => {
        const p = parseFrac(g);
        if (!p) return { status: "wrong", tag: "gehelen", note: "Schrijf bv. 2 en 1/3." };
        if (sameVal(p, n, d) && p.form === "mixed" && p.n < p.d) return { status: "correct" };
        if (sameVal(p, n, d)) return { status: "wrong", tag: "gehelen", note: "Dat is dezelfde waarde, maar haal de gehelen eruit." };
        return { status: "wrong", tag: "gehelen" };
      } });
    },
  });
  unit({
    id: "breuk", cases: 2, caseNames: ["1 of 2 gehelen", "meer gehelen"],
    gen(level, c = rnd(0, 1)) {
      const d = rnd(2, 9), w = c === 0 ? rnd(1, 2) : rnd(3, level === "easy" ? 4 : 6), r = rnd(1, d - 1), n = w * d + r;
      const q = base(this, { instruction: "Zet om in een breuk.", prompt: `${w} en ${F(r, d)} = …`, answerShown: F(n, d), tag: "breuk_omzetten" });
      if (!typed(level)) return Object.assign(q, { mode: "mc", options: mcFrom([optFrac(n, d), optFrac(w * d, d), optFrac(w + r, d), optFrac(w * r + d, d), optFrac(n, d + w)]), answer: fracTxt(n, d) });
      return Object.assign(q, { mode: "text", right: `${n}/${d}`, hint: "Schrijf zo: 7/3", helpers: ["/"], chk: (g) => {
        const p = parseFrac(g);
        if (!p) return { status: "wrong", tag: "breuk_omzetten", note: "Schrijf bv. 7/3." };
        if (p.form === "frac" && sameVal(p, n, d)) return { status: "correct" };
        if (sameVal(p, n, d)) return { status: "wrong", tag: "breuk_omzetten", note: "Schrijf het als één breuk (teller/noemer)." };
        return { status: "wrong", tag: "breuk_omzetten", note: p.form === "frac" && p.num === w * d ? "Vergeten de teller erbij te tellen?" : "" };
      } });
    },
  });
  unit({
    id: "vereenvoudig", cases: 3, caseNames: ["delen door 2 of 3", "delen door 4 of 5", "grote getallen"],
    gen(level, c = rnd(0, 2)) {
      let a, b; do { b = rnd(2, 9); a = rnd(1, b - 1); } while (gcd(a, b) !== 1);
      const k = c === 0 ? rnd(2, 3) : c === 1 ? rnd(4, 5) : rnd(6, 9), n = a * k, d = b * k;
      const q = base(this, { instruction: "Vereenvoudig de breuk zo ver mogelijk.", prompt: `${F(n, d)} = …`, answerShown: F(a, b), tag: "niet_vereenvoudigd" });
      if (!typed(level, 0.7)) {
        const g2 = [2, 3].find((x) => k % x === 0 && k !== x);
        return Object.assign(q, { mode: "mc", options: mcFrom([optFrac(a, b), g2 ? optFrac(n / g2, d / g2) : optFrac(a + 1, b + 1), optFrac(b, a), optFrac(n - 1, d - 1), optFrac(a, b + 1)]), answer: fracTxt(a, b), alts: g2 ? { [fracTxt(n / g2, d / g2)]: "niet_vereenvoudigd" } : {} });
      }
      return Object.assign(q, { mode: "text", right: `${a}/${b}`, hint: "Schrijf zo: 3/4", helpers: ["/"], chk: (g) => {
        const p = parseFrac(g);
        if (!p || p.form !== "frac") return { status: "wrong", tag: "niet_vereenvoudigd", note: "Schrijf een breuk, bv. 3/4." };
        if (sameVal(p, a, b) && p.d === b) return { status: "correct" };
        if (sameVal(p, a, b)) return { status: "equiv", tag: "niet_vereenvoudigd", note: "Goed begonnen, maar het kan nog verder.", points: 0 };
        return { status: "wrong", tag: "niet_vereenvoudigd" };
      } });
    },
  });
  unit({
    id: "ordenen", cases: 2, caseNames: ["zelfde teller", "verschillende noemers"],
    gen(level, c = rnd(0, 1)) {
      const nCount = level === "easy" ? 3 : 4;
      let fr;
      for (let t = 0; t < 50; t++) {
        const fam = pick([[2, 4, 8, 16], [3, 6, 12], [2, 5, 10], [2, 4, 8]]);
        if (c === 0) { const tel = rnd(1, 3); fr = shuffle(fam.filter((x) => x > tel)).slice(0, nCount).map((d) => [tel, d]); }
        else fr = shuffle(fam).slice(0, nCount).map((d) => [rnd(1, d - 1), d]);
        if (fr.length === nCount && new Set(fr.map(([n, d]) => n / d)).size === nCount) break;
      }
      const sorted = fr.slice().sort((x, y) => x[0] / x[1] - y[0] / y[1]);
      const ans = sorted.map(([n, d]) => fracTxt(n, d)).join(" ");
      return base(this, { mode: "order", instruction: "Zet de breuken van klein naar groot. Tip: maak ze eerst gelijknamig.", prompt: fr.map(([n, d]) => F(n, d)).join(" &nbsp; "),
        chunks: shuffle(fr.map(([n, d]) => fracTxt(n, d))), accepted: [ans], right: ans, orderPh: "… van klein naar groot …", chunkHtml: (c) => { const [n, d] = c.split("/"); return F(n, d); }, answerShown: sorted.map(([n, d]) => F(n, d)).join(" &lt; "), tag: "ordenen",
        chk: (g) => (String(g).trim() === ans ? { status: "correct" } : { status: "wrong", tag: "ordenen" }) });
    },
  });
  unit({
    id: "gelijkwaardig", cases: 2, caseNames: ["welke breuk is gelijk?", "ontbrekende teller"],
    gen(level, c = rnd(0, 1)) {
      let a, b; do { b = rnd(2, 6); a = rnd(1, b - 1); } while (gcd(a, b) !== 1);
      const k = rnd(2, 5);
      if (c === 0) {
        const opts = mcFrom([optFrac(a * k, b * k), optFrac(a + k, b + k), optFrac(a * k, b + k), optFrac(b * k, a * k), optFrac(a * k + 1, b * k)]);
        return base(this, { mode: "mc", instruction: "Welke breuk is gelijkwaardig (heeft dezelfde waarde)?", prompt: F(a, b), options: opts, answer: fracTxt(a * k, b * k), answerShown: F(a * k, b * k), tag: "gelijkwaardig" });
      }
      return base(this, { mode: "text", instruction: "Vul de ontbrekende teller in.", prompt: `${F(a, b)} = ${F("?", b * k)}`, answerShown: String(a * k), right: String(a * k), short: true, tag: "gelijkwaardig",
        chk: (g) => (eqNum(parseNum(g), a * k) ? { status: "correct" } : { status: "wrong", tag: "gelijkwaardig", note: parseNum(g) === a + (b * k - b) ? "Je telde iets op; je moet vermenigvuldigen." : "" }) });
    },
  });
  unit({
    id: "getallenas", cases: 2, caseNames: ["breuk tussen 0 en 1", "breuk groter dan 1"],
    gen(level, c = rnd(0, 1)) {
      const k = c === 0 ? pick([1, 2, 3, 4, 5, 6, 7]) : pick([9, 10, 11, 12, 13, 14, 15]); // in achtsten
      const opts = [[k, 8]];
      if (k % 2 === 0) opts.push([k / 2, 4]);
      if (k % 4 === 0) opts.push([k / 4, 2]);
      if (level !== "easy") opts.push([2 * k, 16]);
      const [n, d] = level === "easy" ? [k, 8] : pick(opts);
      return base(this, { mode: "click", instruction: "Tik op de juiste plaats op de getallenas.", prompt: F(n, d), svg: numberLine(), solutionSvg: numberLine(k), nPts: 1, names: [""], snapY: true, right: [[k, 0]],
        clickInfo: "Tik op het juiste streepje.", pointLabel: () => "gekozen", givenFmt: (g) => (g && g[0] ? `streepje ${g[0][0]} (= ${F(g[0][0], 8)})` : "—"),
        answerShown: `${F(n, d)} = ${F(k, 8)} → het ${k}de streepje na 0`, tag: "getallenas",
        chk: (g) => { const x = g && g[0] ? g[0][0] : null; return x === k ? { status: "correct" } : { status: "wrong", tag: "getallenas", note: x === n && n !== k ? `Je telde ${n} streepjes; zet ${F(n, d)} eerst om naar achtsten.` : "" }; } });
    },
  });

  // ---------- H. Hoofdrekenen met breuken ----------
  // c: 0 gelijknamig · 1 noemer is veelvoud · 2 ongelijknamig · 3 geheel en breuk
  function fracOp(u, level, c, sign) {
    if (level === "easy" && c === 2) c = 1;
    let a, b, x, y, wh = 0;
    if (c === 0) { b = rnd(3, 10); y = b; if (sign > 0) { a = rnd(1, b - 1); x = rnd(1, b - 1); } else { a = rnd(2, b - 1); x = rnd(1, a - 1); } }
    else if (c === 1) { b = rnd(2, 5); y = b * rnd(2, 3); a = rnd(1, b - 1); x = rnd(1, y - 1); if (sign < 0 && x / y >= a / b) [a, b, x, y] = [x, y, a, b]; }
    else if (c === 2) { do { b = rnd(2, 7); y = rnd(2, 7); } while (gcd(b, y) !== 1 || b === y); a = rnd(1, b - 1); x = rnd(1, y - 1); if (sign < 0 && x / y >= a / b) [a, b, x, y] = [x, y, a, b]; }
    else { wh = rnd(1, 4); y = rnd(2, 9); x = rnd(1, y - 1); a = wh; b = 1; }
    if (sign < 0 && a / b === x / y) x = Math.max(1, x - 1);
    const D = lcm(b, y), num = sign > 0 ? a * (D / b) + x * (D / y) : a * (D / b) - x * (D / y);
    const [sn, sd] = simp(num, D);
    const left = c === 3 ? String(wh) : F(a, b);
    const opTxt = sign > 0 ? "+" : "−";
    const wrongDen = c !== 0 && c !== 3 ? [sign > 0 ? a + x : Math.abs(a - x), b + y] : null;
    const q = base(u, { instruction: sign > 0 ? "Tel op. Maak gelijknamig. Vereenvoudig de uitkomst waar het kan." : "Trek af. Maak gelijknamig. Vereenvoudig de uitkomst waar het kan.",
      prompt: `${left} ${opTxt} ${F(x, y)} = …`, answerShown: showFrac(num, D), tag: c === 0 ? "fout" : "gelijknamig" });
    if (!typed(level, 0.7)) {
      const right = sn > sd && level !== "easy" && Math.random() < 0.5 ? optMixed(Math.floor(sn / sd), sn % sd, sd) : optFrac(sn, sd);
      if (sn % sd === 0) right.v = String(sn / sd), right.html = right.v;
      const alts = {};
      const o = [right];
      if (wrongDen && wrongDen[0] > 0) { const w = optFrac(...simp(...wrongDen)); alts[w.v] = "noemers_opgeteld"; o.push(w); }
      o.push(optFrac(...simp(num + (sign > 0 ? 1 : -1) * (num > 1 ? 1 : -1), D)), optFrac(...simp(num + 1, D + 1)), c === 3 ? optFrac(...simp(sign > 0 ? wh + x : Math.max(1, wh - x), y)) : optFrac(...simp(num, D * 2)));
      return Object.assign(q, { mode: "mc", options: mcFrom(o), answer: right.v, alts });
    }
    return Object.assign(q, { mode: "text", right: fracTxt(sn, sd), hint: "Schrijf bv. 9/20 of 1 en 4/5", helpers: FRAC_HELP, chk: (g, lvl) => {
      const p = parseFrac(g);
      if (!p) return { status: "wrong", tag: "fout", note: "Schrijf bv. 9/20 of 1 en 4/5." };
      if (sameVal(p, num, D)) return isSimplified(p) ? { status: "correct" } : { status: "equiv", tag: "niet_vereenvoudigd", note: `Juist, maar vereenvoudig nog: ${fracTxt(sn, sd)}.` };
      if (wrongDen && sameVal(p, wrongDen[0], wrongDen[1])) return { status: "wrong", tag: "noemers_opgeteld" };
      return { status: "wrong", tag: c === 0 ? "fout" : "gelijknamig" };
    } });
  }
  const OPNAMES = ["gelijknamig", "noemer is een veelvoud", "ongelijknamig", "geheel en een breuk"];
  unit({ id: "optellen", cases: 4, caseNames: OPNAMES, gen(level, c = rnd(0, 3)) { return fracOp(this, level, c, 1); } });
  unit({ id: "aftrekken", cases: 4, caseNames: OPNAMES, gen(level, c = rnd(0, 3)) { return fracOp(this, level, c, -1); } });
  unit({
    id: "breukvan", cases: 2, caseNames: ["kleine getallen", "grotere getallen"],
    gen(level, c = rnd(0, 1)) {
      const b = c === 0 ? rnd(2, 5) : rnd(4, 10), a = rnd(1, b - 1), m = c === 0 ? rnd(2, 9) : rnd(5, 12), Nn = b * m, ans = a * m;
      const q = base(this, { instruction: "Neem een breuk van het getal.", prompt: `${F(a, b)} van ${Nn} = …`, answerShown: `(${Nn} : ${b}) × ${a} = ${ans}`, tag: "breukvan" });
      if (!typed(level)) return Object.assign(q, { mode: "mc", options: shuffle(uniqBy([ans, m, Nn * a, Nn - a, ans + m].filter((x) => x > 0), (x) => x).slice(0, 4).map((x) => ({ v: String(x), html: String(x) }))), answer: String(ans) });
      return Object.assign(q, { mode: "num", right: String(ans), short: true, chk: (g) => { const x = parseNum(g); return eqNum(x, ans) ? { status: "correct" } : { status: "wrong", tag: "breukvan", note: x === m ? `${Nn} : ${b} = ${m}; vergeet niet × ${a}.` : "" }; } });
    },
  });

  // ---------- C. Cijferen met kommagetallen ----------
  const dec = (lo, hi, d) => rnd(lo * 10 ** d, hi * 10 ** d) / 10 ** d; // willekeurig kommagetal met d decimalen
  function kommaTag(x, ans) {
    if (x === null) return "rekenfout";
    for (const f of [10, 100, 1000, 0.1, 0.01, 0.001]) if (eqNum(x, +(ans * f).toFixed(6))) return "komma";
    return "rekenfout";
  }
  unit({
    id: "cijfer_plusmin", cases: 2, caseNames: ["optellen", "aftrekken"],
    gen(level, c = rnd(0, 1)) {
      const d1 = level === "easy" ? 2 : rnd(2, 3), d2 = level === "easy" ? 2 : 3;
      let a = dec(10, 80, d1), b = dec(2, 30, d2);
      if (c === 1 && b >= a) [a, b] = [b + 10, a];
      const ans = +(c === 0 ? a + b : a - b).toFixed(3);
      return base(this, { mode: "num", instruction: "Bereken (schat eerst). Let op het bewerkingsteken!", prompt: `${N(a)} ${c === 0 ? "+" : "−"} ${N(b)} = …`, answerShown: N(ans), right: N(ans), tag: "rekenfout",
        hint: level === "easy" ? `Ik schat: ${Math.round(a)} ${c === 0 ? "+" : "−"} ${Math.round(b)} = ${c === 0 ? Math.round(a) + Math.round(b) : Math.round(a) - Math.round(b)}` : "",
        chk: (g) => { const x = parseNum(g); if (eqNum(x, ans)) return { status: "correct" }; const other = +(c === 0 ? a - b : a + b).toFixed(3); return { status: "wrong", tag: eqNum(x, other) ? "rekenfout" : kommaTag(x, ans), note: eqNum(x, other) ? "Let op het bewerkingsteken!" : "" }; } });
    },
  });
  unit({
    id: "cijfer_maal", cases: 2, caseNames: ["× 3 cijfers na de komma", "× 2 cijfers na de komma"],
    gen(level, c = rnd(0, 1)) {
      const k = level === "easy" ? rnd(2, 9) : rnd(12, 79), x = c === 0 ? dec(1, 9, 3) : dec(10, 40, 2);
      const ans = +(k * x).toFixed(3);
      return base(this, { mode: "num", instruction: "Bereken (schat eerst).", prompt: `${k} × ${N(x)} = …`, answerShown: N(ans), right: N(ans), tag: "rekenfout",
        hint: level === "easy" ? `Ik schat: ${k} × ${Math.round(x)} = ${k * Math.round(x)}` : "",
        chk: (g) => { const v = parseNum(g); return eqNum(v, ans) ? { status: "correct" } : { status: "wrong", tag: kommaTag(v, ans) }; } });
    },
  });
  unit({
    id: "cijfer_deel", cases: 2, caseNames: ["deeltal > 10", "deeltal < 10"],
    gen(level, c = rnd(0, 1)) {
      const dv = level === "easy" ? rnd(3, 9) : c === 0 ? rnd(11, 15) : rnd(6, 9);
      let D, qT, rT;
      do { D = c === 0 ? rnd(20000, 69999) : rnd(2000, 9999); qT = Math.floor(D / dv); rT = D - qT * dv; } while (!rT && Math.random() < 0.8);
      const q = qT / 1000, r = rT / 1000, deeltal = D / 1000;
      return base(this, { mode: "fields", instruction: "Deel tot evenveel cijfers na de komma als het deeltal. Geef quotiënt (q) en rest (r).", prompt: `${N(deeltal, 3)} : ${dv} = q … &nbsp; r …`,
        fields: [{ label: "q =", num: true, ph: "quotiënt" }, { label: "r =", num: true, ph: "rest" }], answerShown: `q = ${N(q, 3)} &nbsp; r = ${N(r, 3)}`, right: [N(q, 3), N(r, 3)], tag: "rest",
        hint: level === "easy" ? `Controle: q × ${dv} + r = ${N(deeltal, 3)}` : "",
        chk: (g) => {
          const qq = parseNum(g[0]), rr = parseNum(g[1]);
          if (eqNum(qq, q) && eqNum(rr, r)) return { status: "correct" };
          if (eqNum(qq, q)) return { status: "wrong", tag: "rest", note: "Het quotiënt is juist, de rest niet." };
          if (qq !== null && rr !== null && eqNum(+(qq * dv + rr).toFixed(6), deeltal)) return { status: "wrong", tag: "rest", note: "q × deler + r klopt, maar de rest moet kleiner zijn dan de deler (in duizendsten)." };
          return { status: "wrong", tag: kommaTag(qq, q) };
        } });
    },
  });
  unit({
    id: "schatten", cases: 3, caseNames: ["optellen/aftrekken", "vermenigvuldigen", "delen"],
    gen(level, c = rnd(0, 2)) {
      let prompt, est, how;
      if (c === 0) { const a = dec(10, 80, 3), b = dec(2, 30, 3), plus = Math.random() < 0.5; est = plus ? Math.round(a) + Math.round(b) : Math.round(a) - Math.round(b); prompt = `${N(a)} ${plus ? "+" : "−"} ${N(b)}`; how = `${Math.round(a)} ${plus ? "+" : "−"} ${Math.round(b)} = ${est}`; }
      else if (c === 1) { const k = rnd(12, 79), x = dec(2, 9, 3); est = k * Math.round(x); prompt = `${k} × ${N(x)}`; how = `${k} × ${Math.round(x)} = ${est}`; }
      else { const dv = rnd(3, 12), m = rnd(3, 9), x = +(dv * m + (Math.random() - 0.5) * dv * 0.8).toFixed(3); est = m; prompt = `${N(x)} : ${dv}`; how = `${dv * m} : ${dv} = ${m}`; }
      const opts = uniqBy([est, est * 10, +(est / 10).toFixed(2), c === 0 ? est + 10 : est * 100], (x) => x).map((x) => ({ v: String(x), html: N(x) }));
      return base(this, { mode: "mc", instruction: "Ik schat: welke uitkomst ligt het dichtst bij?", prompt: `${prompt} ≈ …`, options: shuffle(opts), answer: String(est), answerShown: `${N(est)} (${how})`, tag: "schatten" });
    },
  });

  // ---------- M. Klok ----------
  const randTime = (level) => { const h = rnd(1, 11), m = level === "easy" ? 5 * rnd(0, 11) : rnd(0, 59), s = level === "easy" ? 0 : rnd(0, 59); return [h, m, s]; };
  const sameT = (t, h, m, s) => t && t[0] === h && t[1] === m && (t[2] || 0) === (s || 0);
  unit({
    id: "klok_lezen", cases: 2, caseNames: ["hele minuten", "met seconden"],
    gen(level, c = rnd(0, 1)) {
      const [h, m] = randTime(level), s = c === 0 || level === "easy" ? null : rnd(0, 59);
      const withS = s !== null;
      return base(this, { mode: "fields", instruction: `Hoe laat is het? Noteer het digitale uur in de voormiddag (VM) en in de namiddag (NM)${withS ? ", met seconden" : ""}.`, prompt: "", svg: `<div class="clockwrap">${clockSvg(h, m, s, { size: 180 })}</div>`,
        fields: [{ label: "VM", ph: withS ? "uu:mm:ss" : "uu:mm" }, { label: "NM", ph: withS ? "uu:mm:ss" : "uu:mm" }], answerShown: `VM ${T(h, m, s)} · NM ${T(h + 12, m, s)}`, right: [T(h, m, s), T(h + 12, m, s)], tag: "vm_nm",
        chk: (g) => {
          const a = parseTime(g[0]), b = parseTime(g[1]);
          const okA = sameT(a, h, m, s), okB = sameT(b, h + 12, m, s);
          if (okA && okB) return { status: "correct" };
          if (okA || okB) return { status: "wrong", tag: "vm_nm" };
          const hm = Math.floor(m / 5) || 12;
          if (a && a[0] % 12 === hm % 12 && Math.abs(a[1] - h * 5) <= 4) return { status: "wrong", tag: "wijzers" };
          return { status: "wrong", tag: "vm_nm" };
        } });
    },
  });
  unit({
    id: "tijdsverschil", cases: 2, caseNames: ["digitaal", "op de klok"],
    gen(level, c = rnd(0, 1)) {
      const t1 = (rnd(12, 15) * 3600) + rnd(0, 59) * 60 + (level === "easy" ? 0 : rnd(0, 59));
      const dif = rnd(1, level === "easy" ? 3 : 6) * 3600 + rnd(1, 59) * 60 + (level === "easy" ? 0 : rnd(0, 59));
      const t2 = t1 + dif;
      const hms = (t) => [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60];
      const [h1, m1, s1] = hms(t1), [h2, m2, s2] = hms(t2), [dh, dm, ds] = hms(dif);
      const show = (h, m, s) => (c === 1 && level !== "easy" ? clockSvg(h % 12, m, level === "easy" ? null : s, { size: 130 }) : `<b>${T(h, m, level === "easy" ? null : s)}</b>`);
      const wrongDec = (h2 * 10000 + m2 * 100 + s2) - (h1 * 10000 + m1 * 100 + s1);
      return base(this, { mode: "fields", instruction: "Hoeveel bedraagt het tijdsverschil (in de namiddag)?", prompt: "",
        svg: `<div class="clockrow"><div>${show(h1, m1, s1)}<small>${c === 1 && level !== "easy" ? "eerste klok (NM)" : "van"}</small></div><div>${show(h2, m2, s2)}<small>${c === 1 && level !== "easy" ? "tweede klok (NM)" : "tot"}</small></div></div>`,
        fields: [{ label: "", suffix: "u", num: true, short: true }, { label: "", suffix: "min", num: true, short: true }, ...(level === "easy" ? [] : [{ label: "", suffix: "s", num: true, short: true }])],
        answerShown: `${dh} u ${dm} min${level === "easy" ? "" : ` ${ds} s`}` + (c === 1 && level !== "easy" ? ` (van ${T(h1, m1, s1)} tot ${T(h2, m2, s2)})` : ""), right: [String(dh), String(dm), ...(level === "easy" ? [] : [String(ds)])], tag: "tijdsverschil",
        chk: (g) => {
          const v = g.map((x) => (String(x).trim() === "" ? 0 : parseNum(x)));
          if (v[0] === dh && v[1] === dm && (level === "easy" || v[2] === ds)) return { status: "correct" };
          const dec_ = [Math.floor(wrongDec / 10000), Math.floor((wrongDec % 10000) / 100), wrongDec % 100];
          if (v[0] === dec_[0] && v[1] === dec_[1]) return { status: "wrong", tag: "tijdsverschil", note: "1 uur = 60 minuten (niet 100)." };
          return { status: "wrong", tag: "tijdsverschil" };
        } });
    },
  });
  // uur in woorden: h 1..12, m veelvoud van 5
  const woorden = (h, m) => UUR_WOORDEN[m].replace("{u}", GETAL_WOORD[h % 12 || 12]).replace("{v}", GETAL_WOORD[(h % 12) + 1]);
  unit({
    id: "klok_kiezen", cases: 2, caseNames: ["digitaal uur", "uur in woorden"],
    gen(level, c = rnd(0, 1)) {
      let h, m, s = null, prompt, alts = {};
      if (c === 0) { h = rnd(13, 22); m = rnd(1, 59); s = level === "easy" ? null : rnd(0, 59); prompt = `<b>${T(h, m, s)}</b>`; }
      else { h = rnd(1, 11); m = pick([20, 25, 30, 35, 40, 10, 45, 50]); prompt = `<b>${woorden(h, m)}</b>`; }
      const hh = h % 12;
      const cand = [{ v: "ok", h: hh, m, s }];
      if (c === 1 && m >= 20 && m <= 40) { cand.push({ v: "half", h: (hh + 1) % 12, m, s }); alts.half = "half"; }
      else cand.push({ v: "uur1", h: (hh + 1) % 12, m, s });
      const mm = Math.round((hh % 12) * 5) % 60, hw = Math.floor(m / 5) % 12;
      cand.push({ v: "wissel", h: hw, m: mm, s }); alts.wissel = "wijzers";
      cand.push({ v: "spiegel", h: hh, m: (60 - m) % 60, s });
      const options = shuffle(cand.slice(0, level === "easy" ? 3 : 4)).map((o) => ({ v: o.v, html: clockSvg(o.h, o.m, o.s, { size: 110 }), cls: "clockopt" }));
      return base(this, { mode: "mc", instruction: "Welke klok toont dit uur?", prompt, options, answer: "ok", alts, answerShown: clockSvg(hh, m, s, { size: 110 }), tag: c === 1 ? "half" : "wijzers" });
    },
  });
  unit({
    id: "uur_woorden", cases: 2, caseNames: ["woorden → digitaal", "digitaal → woorden"],
    gen(level, c = rnd(0, 1)) {
      const h = rnd(1, 11), m = 5 * rnd(1, 11);
      if (c === 0 || level === "hard") {
        return base(this, { mode: "text", instruction: "Schrijf het digitale uur (voormiddag of namiddag mag).", prompt: `<b>${woorden(h, m)}</b>`, short: true, answerShown: `${T(h, m)} of ${T(h + 12, m)}`, right: T(h, m), tag: "half",
          chk: (g) => { const t = parseTime(g); if (t && t[1] === m && (t[0] === h || t[0] === h + 12)) return { status: "correct" }; return { status: "wrong", tag: t && t[1] === m && (t[0] % 12) === (h + 1) % 12 ? "half" : "fout" }; } });
      }
      const opts = uniqBy([woorden(h, m), woorden(h + 1, m), woorden(h, (m + 30) % 60 || 30), woorden(h, (60 - m) % 60 || 5)], (x) => x);
      return base(this, { mode: "mc", instruction: "Hoe zeg je dit uur?", prompt: `<b>${T(h, m)}</b>`, options: shuffle(opts).map((o) => ({ v: o, html: esc(o) })), answer: woorden(h, m), alts: { [woorden(h + 1, m)]: "half" }, answerShown: esc(woorden(h, m)), tag: "half" });
    },
  });

  // ---------- M. Winst en verlies (vraagstukken) ----------
  const EUR = (x) => "€ " + N(x);
  unit({
    id: "winst", cases: 5, caseNames: ["inkoopprijs per stuk", "totale inkoopprijs", "totale verkoopprijs met winst", "verlies", "inkoopprijs uit totaal"],
    gen(level, c = rnd(0, 4)) {
      const W = pick(WINKELS), vp = rnd(...W.vp), w = rnd(...W.w), ip = vp - w, n = pick([5, 10, 12, 15, 20, 25]);
      let txt, vraag, ans, how, alts = [];
      if (c === 0) { txt = `${W.wie} heeft een ${W.winkel}. Hij verkoopt een ${W.x} aan ${EUR(vp)}. Hij maakt ${EUR(w)} winst per ${W.x}.`; vraag = `Wat was de inkoopprijs van één ${W.x}?`; ans = ip; how = `IP = VP − winst = ${vp} − ${w} = ${ip}`; alts = [vp + w]; }
      else if (c === 1) { txt = `${W.wie} verkoopt een ${W.x} aan ${EUR(vp)} en maakt ${EUR(w)} winst per stuk.`; vraag = `Wat was de totale inkoopprijs van ${n} ${W.xs}?`; ans = n * ip; how = `IP per stuk = ${vp} − ${w} = ${ip}; ${n} × ${ip} = ${n * ip}`; alts = [n * vp, ip]; }
      else if (c === 2) { const p = rnd(15, 70), tw = 50 * rnd(2, 10); txt = `${W.wie} kocht ${n} ${W.xs} in. Hij betaalde ${EUR(p)} per stuk.`; vraag = `Wat zal zijn totale verkoopprijs zijn als hij een totale winst van ${EUR(tw)} wil maken?`; ans = n * p + tw; how = `totale IP = ${n} × ${p} = ${n * p}; VP = ${n * p} + ${tw} = ${n * p + tw}`; alts = [p + tw, n * p - tw]; }
      else if (c === 3) { const v = rnd(2, 9), ipx = rnd(20, 60); txt = `${W.wie} kocht een ${W.x} in voor ${EUR(ipx)}. Er zat een krasje op, dus hij verkocht hem voor ${EUR(ipx - v)}.`; vraag = "Hoeveel verlies maakte hij?"; ans = v; how = `verlies = IP − VP = ${ipx} − ${ipx - v} = ${v}`; alts = [2 * ipx - v]; }
      else { const tot = n * vp; txt = `${W.wie} verkocht ${n} ${W.xs} voor samen ${EUR(tot)}. Op elke ${W.x} maakte hij ${EUR(w)} winst.`; vraag = `Wat was de inkoopprijs van één ${W.x}?`; ans = ip; how = `VP per stuk = ${tot} : ${n} = ${vp}; IP = ${vp} − ${w} = ${ip}`; alts = [vp, tot - w]; }
      const q = base(this, { instruction: vraag, prompt: `<span class="story">${esc(txt)}</span>`, promptClass: "storyp", answerShown: `${EUR(ans)} <small>(${how})</small>`, tag: "winst" });
      if (!typed(level)) return Object.assign(q, { mode: "mc", options: shuffle(uniqBy([ans, ...alts, ans + 10].filter((x) => x > 0), (x) => x).slice(0, 4).map((x) => ({ v: String(x), html: EUR(x) }))), answer: String(ans) });
      return Object.assign(q, { mode: "num", right: String(ans), unitSuffix: "€", short: true, chk: (g) => { const x = parseNum(g); return eqNum(x, ans) ? { status: "correct" } : { status: "wrong", tag: "winst", note: alts.some((a) => eqNum(x, a)) ? "Lees de vraag nog eens: per stuk of in totaal? Optellen of aftrekken?" : "" }; } });
    },
  });

  // ---------- begrippen (ook als flashcards) ----------
  unit({
    id: "begrippen", cases: BEGRIPPEN.length,
    gen(level, c = rnd(0, BEGRIPPEN.length - 1)) {
      const b = BEGRIPPEN[c];
      const others = shuffle(BEGRIPPEN.filter((x) => x !== b)).slice(0, level === "easy" ? 2 : 3).map((x) => x.a);
      return base(this, { mode: "mc", instruction: "Begrippen", prompt: esc(b.q), options: shuffle([b.a, ...others]).map((o) => ({ v: o, html: esc(o) })), answer: b.a, answerShown: `${esc(b.a)} <small>(${esc(b.x)})</small>`, tag: "fout", itemLabel: `${b.q} → ${b.a}` });
    },
  });

  // ============================================================
  // TOETS SAMENSTELLEN
  // ============================================================
  function finalize(u, q, c) {
    if (!q) return q;
    const nm = u.caseNames && u.caseNames[c];
    return Object.assign(q, { caseIdx: c, key: `${u.id}:${c}`, itemLabel: q.itemLabel || `${u.label}${nm ? ": " + nm : ""}` });
  }
  function makeQuiz(s) {
    const units = UNITS.filter((u) => s.units.includes(u.id));
    if (!units.length) return [];
    const out = [];
    if (s.count === "all") {
      units.forEach((u) => { for (let c = 0; c < u.cases; c++) out.push(finalize(u, u.gen(s.level, c), c)); });
      return shuffle(out);
    }
    const decks = {};
    const draw = (u) => { if (!decks[u.id] || !decks[u.id].length) decks[u.id] = shuffle([...Array(u.cases).keys()]); return decks[u.id].pop(); };
    let order = shuffle(units);
    for (let i = 0; out.length < s.count && i < s.count * 3; i++) {
      if (i % order.length === 0 && i) order = shuffle(units);
      const u = order[i % order.length], c = draw(u);
      out.push(finalize(u, u.gen(s.level, c), c));
    }
    return shuffle(out);
  }
  const countAll = (s) => UNITS.filter((u) => s.units.includes(u.id)).reduce((a, u) => a + u.cases, 0);
  function regen(q, level) { const u = UNITS.find((x) => x.id === q.unit); return finalize(u, u.gen(level, q.caseIdx), q.caseIdx); }
  function fromKey(key, level) {
    const [id, c] = key.split(":"), u = UNITS.find((x) => x.id === id), ci = +c;
    if (!u || isNaN(ci) || ci >= u.cases) return null;
    return finalize(u, u.gen(level, ci), ci);
  }

  // ============================================================
  // VERBETEREN
  // ============================================================
  function check(given, q, level) {
    let r;
    if (q.mode === "mc") r = given === q.answer ? { status: "correct" } : { status: "wrong", tag: (q.alts && q.alts[given]) || q.tag || "fout" };
    else r = q.chk(given, level) || { status: "wrong" };
    if (r.points === undefined) r.points = r.status === "correct" ? 1 : r.status === "equiv" ? (level === "hard" ? 0 : 1) : 0;
    if (r.status === "equiv" && level === "hard" && r.tag === "niet_vereenvoudigd") r.strictNote = "(op 'Moeilijk' moet de uitkomst vereenvoudigd zijn)";
    if (r.status !== "correct" && !r.tag) r.tag = q.tag || "fout";
    return r;
  }

  // ============================================================
  // FOUTANALYSE
  // ============================================================
  function conclusions(results) {
    const byGroup = {}, tags = {};
    results.forEach((r) => {
      const g = (byGroup[r.q.group] = byGroup[r.q.group] || { ok: 0, n: 0 }); g.n++; g.ok += r.points;
      if (r.status !== "correct" && r.tag && TAGS[r.tag] && r.tag !== "fout") tags[r.tag] = (tags[r.tag] || 0) + 1;
    });
    const out = [];
    GROUPS.forEach((gr) => {
      const s = byGroup[gr.id]; if (!s) return;
      const p = Math.round((s.ok / s.n) * 100), type = p >= 85 ? "good" : p >= 60 ? "ok" : "bad";
      out.push({ type, text: `<b>${gr.titel}</b>: ${s.ok}/${s.n} (${p}%) — ${type === "good" ? "goed gekend" : type === "ok" ? "nog even herhalen" : "herhaal de uitleg in de bundel"} <small>kopieerblad ${gr.p}</small>` });
    });
    Object.entries(tags).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => { const g = TAGS[t]; out.push({ type: n >= 2 ? "bad" : "ok", text: `<b>${g.title}</b> (${n}×): ${g.advice}${g.page ? ` <small>kopieerblad ${g.page}</small>` : ""}` }); });
    if (results.length && results.every((r) => r.status === "correct")) out.unshift({ type: "good", text: "Foutloos! 🎉" });
    return out;
  }

  // KAARTEN (studiemodule): de begrippen
  const KAART_UNITS = ["begrippen"];
  function kaarten(s) {
    const sel = s && Array.isArray(s.units) ? s.units : KAART_UNITS;
    if (!sel.includes("begrippen")) return [];
    return BEGRIPPEN.map((b, c) => ({ key: `begrippen:${c}`, unit: "begrippen", soort: "Begrip", ask: "Weet je het?", front: esc(b.q), back: esc(b.a), info: esc(b.x), page: "les 1-12", label: `${b.q} → ${b.a}` }));
  }

  Vakken.register({
    id: "wiskunde-5-kaap2", vak: I.vak, icon: I.icon, theme: I.theme, titel: I.titel, klas: I.klas, bron: I.bron,
    groups: GROUPS.map((g) => ({ id: g.id, short: g.short, titel: g.titel, p: g.p })),
    units: UNITS.map((u) => ({ id: u.id, group: u.group, label: u.label, page: u.page })),
    quick: [
      { label: "Alles", select: () => true },
      { label: "🍰 Breuken", select: (u) => u.group === "G" || u.group === "H" },
      { label: "✏️ Cijferen", select: (u) => u.group === "C" },
      { label: "🕒 Klok", select: (u) => /^(klok|tijd|uur)/.test(u.id) },
      { label: "💶 Winst en verlies", select: (u) => u.id === "winst" },
    ],
    settings: [],
    levels: I.levels, allInfo: I.allInfo,
    statusText: { equiv: "Bijna!" },
    tags: TAGS,
    makeQuiz, countAll, check, conclusions, regen, fromKey,
    kaarten, kaartUnits: KAART_UNITS,
    _UNITS: UNITS, _parseFrac: parseFrac, _parseTime: parseTime, _parseNum: parseNum, // voor tests
  });
})();
