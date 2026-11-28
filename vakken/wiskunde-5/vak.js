// ============================================================
// VAK – Wiskunde 5de leerjaar · herhaling les 1-12
// Alle oefeningen worden telkens opnieuw berekend, in de stijl van de
// herhalingsbladen 10A–10G. Teksten en uitleg: inhoud.js.
// Elk onderdeel = unit({ id, cases, gen(level, c) }); c = het soort oefening
// (in de eindtoets komt elk soort één keer aan bod).
// Een vraag kan een eigen controle hebben: q.chk(given, level) → { status, tag?, note?, points? }.
// ============================================================
(function () {
  "use strict";
  const I = Vakken.inhoud("wiskunde-5");
  const { GROUPS, BEGRIPPEN, UUR_WOORDEN, GETAL_WOORD, WINKELS, TAGS } = I;

  // ---------- hulpfuncties ----------
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uniqBy = (arr, k) => { const s = new Set(); return arr.filter((x) => { const v = k(x); if (s.has(v)) return false; s.add(v); return true; }); };
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const typed = (level, p = 0.6) => (level === "easy" ? false : level === "hard" || Vakken.vast ? true : Math.random() < p);
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
      hand(((h % 12) + m / 60) * 30, 27, 5, "#dc2626") + hand((m + (s || 0) / 60) * 6, 42, 3, "#2563eb") +
      (s !== null && s !== undefined && !opts.noSec ? hand(s * 6, 47, 1.4, "#16a34a") : "");
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
    id: "ordenen", cases: 4, caseNames: ["zelfde teller", "verschillende noemers", "van groot naar klein", "noemers zonder veelvoud (bv. 3, 4, 6)"],
    gen(level, c = rnd(0, 3)) {
      const nCount = level === "easy" ? 3 : 4, desc = c === 2 || (c === 3 && Math.random() < 0.5);
      let fr;
      for (let t = 0; t < 80; t++) {
        const fam = c === 3 ? pick([[3, 4, 6, 12], [2, 3, 4, 6], [4, 5, 10, 20], [3, 5, 6, 10]]) : pick([[2, 4, 8, 16], [3, 6, 12], [2, 5, 10], [2, 4, 8]]);
        if (c === 0) { const tel = rnd(1, 3); fr = shuffle(fam.filter((x) => x > tel)).slice(0, nCount).map((d) => [tel, d]); }
        else fr = shuffle(fam).slice(0, nCount).map((d) => [rnd(1, d - 1), d]);
        if (fr.length === nCount && new Set(fr.map(([n, d]) => n / d)).size === nCount) break;
      }
      const sorted = fr.slice().sort((x, y) => (desc ? -1 : 1) * (x[0] / x[1] - y[0] / y[1]));
      const ans = sorted.map(([n, d]) => fracTxt(n, d)).join(" ");
      const wat = desc ? "van groot naar klein" : "van klein naar groot";
      return base(this, { mode: "order", instruction: `Zet de breuken <b>${wat}</b>. Tip: maak ze eerst gelijknamig.`, prompt: fr.map(([n, d]) => F(n, d)).join(" &nbsp; "),
        chunks: shuffle(fr.map(([n, d]) => fracTxt(n, d))), accepted: [ans], right: ans, orderPh: `… ${wat} …`, chunkHtml: (c) => { const [n, d] = c.split("/"); return F(n, d); }, answerShown: sorted.map(([n, d]) => F(n, d)).join(desc ? " &gt; " : " &lt; "), tag: "ordenen",
        chk: (g) => (String(g).trim() === ans ? { status: "correct" } : { status: "wrong", tag: "ordenen", note: String(g).trim() === sorted.slice().reverse().map(([n, d]) => fracTxt(n, d)).join(" ") ? `Omgekeerde volgorde: lees goed (${wat}).` : "" }) });
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

  // ============================================================
  // TOETSWIJZER – aanvullingen (eigen oefeningen, niveau 5de leerjaar)
  // Getallenkennis · hoofdrekenen · meten (hoeken) · meetkunde
  // ============================================================
  const G_ = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); // 305 040
  const fracOk = (g, n, d, tag) => {
    const p = parseFrac(String(g ?? "").replace(/\s+op\s+/i, "/"));
    if (!p) return { status: "wrong", tag, note: "Schrijf bv. 3/8 of 1 en 1/4." };
    if (!sameVal(p, n, d)) return { status: "wrong", tag };
    const [sn, sd] = simp(n, d);
    return isSimplified(p) || sd === 1 && p.form === "int" ? { status: "correct" } : { status: "equiv", tag: "niet_vereenvoudigd", note: `Juist, maar vereenvoudig nog: ${fracTxt(sn, sd)}.` };
  };
  const numQ = (q, ans, tag, extra = {}) => Object.assign(q, { mode: "num", right: N(ans), answerShown: q.answerShown || G_(N(ans)), short: true, tag,
    chk: (g) => { const x = parseNum(g); return eqNum(x, ans) ? { status: "correct" } : { status: "wrong", tag, note: extra.note ? extra.note(x) : "" }; } });

  // ---------- G. getallen tot 1 000 000: lezen en schrijven ----------
  const EEN = ["nul", "een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien", "elf", "twaalf", "dertien", "veertien", "vijftien", "zestien", "zeventien", "achttien", "negentien"];
  const TIG = ["", "", "twintig", "dertig", "veertig", "vijftig", "zestig", "zeventig", "tachtig", "negentig"];
  const w99 = (n) => (n < 20 ? EEN[n] : n % 10 ? EEN[n % 10] + (/e$/.test(EEN[n % 10]) ? "ën" : "en") + TIG[Math.floor(n / 10)] : TIG[n / 10]);
  const w999 = (n) => { const h = Math.floor(n / 100), r = n % 100; return (h ? (h === 1 ? "" : w99(h)) + "honderd" : "") + (r ? w99(r) : ""); };
  const woord = (n) => {
    if (n === 1000000) return "een miljoen";
    if (!n) return "nul";
    const d = Math.floor(n / 1000), r = n % 1000;
    return (d ? (d === 1 ? "" : w999(d)) + "duizend" : "") + (d && r ? " " : "") + (r ? w999(r) : "");
  };
  // moeilijke getallen: nullen binnenin, cijfers die op elkaar lijken
  function bigNum(level) {
    const len = level === "easy" ? 5 : 6;
    for (;;) {
      const ds = Array.from({ length: len }, (_, i) => (i === 0 ? rnd(1, 9) : Math.random() < (level === "easy" ? 0.15 : 0.3) ? 0 : rnd(1, 9)));
      const n = +ds.join("");
      if (level !== "easy" && !ds.slice(1).includes(0)) continue;
      return n;
    }
  }
  const woordNorm = (s) => String(s ?? "").toLowerCase().replace(/[\s\-]/g, "").normalize("NFD").replace(/[̀-ͯ]/g, "");
  unit({
    id: "getal_lezen", cases: 4, caseNames: ["woorden → cijfers", "cijfers → woorden (kiezen)", "cijfers → woorden (schrijven)", "een miljoen en ronde getallen"],
    gen(level, c = rnd(0, 3)) {
      let n = bigNum(level);
      if (c === 3) n = pick([1000000, rnd(1, 9) * 100000 + rnd(1, 9) * 1000, rnd(10, 99) * 10000 + rnd(1, 9), rnd(100, 999) * 1000]);
      if (c === 0 || c === 3) return numQ(base(this, { instruction: "Schrijf het getal in cijfers.", prompt: `<b>${esc(woord(n))}</b>`, answerShown: G_(n) }), n, "getallen",
        { note: (x) => (x !== null && String(x).replace(/0/g, "") === String(n).replace(/0/g, "") ? "Let op de nullen: elke groep van drie na 'duizend' heeft drie cijfers." : "") });
      if (c === 1 || !typed(level, 0.5)) {
        const s = String(n), sw = (i, j) => { const a = s.split(""); [a[i], a[j]] = [a[j], a[i]]; return +a.join(""); };
        const alts = [Math.floor(n / 10) + (n % 10) * 0, n * 10 % 1000000 || n + 10, sw(1, 2), sw(s.length - 2, s.length - 1), sw(2, 3), n + 1000, Math.max(1, n - 100)];
        const opts = uniqBy([n, ...shuffle(alts)].filter((x) => x > 0 && x <= 1000000), (x) => woord(x)).slice(0, level === "easy" ? 3 : 4);
        return base(this, { mode: "mc", instruction: "Hoe schrijf je dit getal in woorden?", prompt: `<b>${G_(n)}</b>`, options: shuffle(opts).map((x) => ({ v: String(x), html: esc(woord(x)) })), answer: String(n), answerShown: esc(woord(n)), tag: "getallen" });
      }
      return base(this, { mode: "text", instruction: "Schrijf het getal in woorden. <small>(Na 'duizend' komt een spatie.)</small>", prompt: `<b>${G_(n)}</b>`, answerShown: esc(woord(n)), right: woord(n), noKeyboard: true, tag: "getallen",
        helpers: ["ë"], chk: (g) => {
          const a = String(g ?? "").toLowerCase().replace(/\s+/g, " ").trim(), r = woord(n);
          if (a === r) return { status: "correct" };
          if (woordNorm(a) === woordNorm(r)) return { status: "equiv", tag: "getallen", note: `Bijna: schrijf het zo: ${r} (aaneen, spatie na duizend${/ë/.test(r) ? ", met trema" : ""}).` };
          return { status: "wrong", tag: "getallen" };
        } });
    },
  });

  // ---------- G. plaatswaarde M, HD, TD, D, H, T, E ----------
  const PW = [["M", "miljoen", 1000000], ["HD", "honderdduizendtal", 100000], ["TD", "tienduizendtal", 10000], ["D", "duizendtal", 1000], ["H", "honderdtal", 100], ["T", "tiental", 10], ["E", "eenheid", 1]];
  const digitsOf = (n) => PW.map(([s, , v]) => [s, Math.floor(n / v) % 10]);
  unit({
    id: "plaatswaarde", cases: 6, caseNames: ["plaats van een cijfer", "getal splitsen (TD, D, H …)", "samenstellen (door elkaar)", "waarde van een cijfer", "hoeveel D (of H) in totaal?", "omzetten (1 HD = … D)"],
    gen(level, c = rnd(0, 5)) {
      let n = bigNum(level);
      if (c === 0 || c === 3) {
        const ds = digitsOf(n).filter(([, d], i, a) => d && a.filter(([, e]) => e === d).length === 1 && Math.floor(n / PW[i][2]) > 0);
        if (!ds.length) return this.gen(level, c);
        const [sym, d] = pick(ds), pv = PW.find((p) => p[0] === sym);
        if (c === 0) {
          const opts = shuffle(uniqBy([sym, ...shuffle(PW.slice(1).map((p) => p[0]))], (x) => x).slice(0, level === "easy" ? 3 : 5));
          return base(this, { mode: "mc", instruction: `Op welke plaats staat het cijfer <b>${d}</b>?`, prompt: `<b>${G_(n)}</b>`, options: opts.map((o) => ({ v: o, html: `${o} <small>(${PW.find((p) => p[0] === o)[1]})</small>` })), answer: sym, answerShown: `${sym} (${pv[1]})`, tag: "plaatswaarde" });
        }
        return numQ(base(this, { instruction: `Hoeveel is het cijfer <b>${d}</b> waard?`, prompt: `<b>${G_(n)}</b>`, answerShown: `${d} ${sym} = ${G_(d * pv[2])}` }), d * pv[2], "plaatswaarde");
      }
      if (c === 1) {
        const ds = digitsOf(n).filter(([s]) => PW.find((p) => p[0] === s)[2] <= n);
        return base(this, { mode: "fields", instruction: "Splits het getal: hoeveel van elk? (een lege plaats = 0)", prompt: `<b>${G_(n)}</b> = …`,
          fields: ds.map(([s]) => ({ label: "", suffix: s, num: true, short: true, optional: true, ph: "0" })), right: ds.map(([, d]) => String(d)), tag: "plaatswaarde",
          answerShown: ds.filter(([, d]) => d).map(([s, d]) => `${d} ${s}`).join(", "),
          chk: (g) => { const bad = ds.filter(([s, d], i) => (parseNum(g[i] || "0") ?? -1) !== d).map(([s]) => s); return !bad.length ? { status: "correct" } : { status: "wrong", tag: "plaatswaarde", note: `Fout bij: ${bad.join(", ")}.` }; } });
      }
      if (c === 2) {
        const ds = shuffle(digitsOf(n).filter(([, d]) => d));
        if (level === "easy") ds.sort((a, b) => PW.findIndex((p) => p[0] === a[0]) - PW.findIndex((p) => p[0] === b[0]));
        const txt = ds.map(([s, d]) => `${d} ${s}`);
        return numQ(base(this, { instruction: "Welk getal is dit? <small>(let op: de volgorde is door elkaar en er kunnen plaatsen ontbreken)</small>", prompt: `<b>${txt.slice(0, -1).join(", ")} en ${txt[txt.length - 1]}</b>`, answerShown: G_(n) }), n, "plaatswaarde");
      }
      if (c === 4) {
        const sym = pick(["D", "H", "T"]), v = PW.find((p) => p[0] === sym)[2];
        return numQ(base(this, { instruction: `Hoeveel <b>${sym}</b> (${PW.find((p) => p[0] === sym)[1]}len) zitten er in totaal in dit getal?`, prompt: `<b>${G_(n)}</b>`, answerShown: `${G_(Math.floor(n / v))} ${sym} <small>(niet enkel het cijfer op de ${sym}-plaats!)</small>` }), Math.floor(n / v), "plaatswaarde",
          { note: (x) => (x === Math.floor(n / v) % 10 ? "Dat is enkel het cijfer op die plaats; tel alle " + sym + " samen." : "") });
      }
      const [a, b] = pick([["M", "HD"], ["M", "D"], ["HD", "D"], ["HD", "T"], ["TD", "H"], ["D", "T"], ["M", "TD"]]), k = level === "easy" ? 1 : rnd(1, 9);
      const va = PW.find((p) => p[0] === a)[2], vb = PW.find((p) => p[0] === b)[2];
      return numQ(base(this, { instruction: "Vul aan.", prompt: `<b>${k} ${a} = … ${b}</b>`, answerShown: `${k} ${a} = ${G_((k * va) / vb)} ${b}` }), (k * va) / vb, "plaatswaarde");
    },
  });

  // ---------- G. rijen met een gegeven sprong ----------
  const RIJ_NAMEN = ["natuurlijke getallen, sprong +", "natuurlijke getallen, sprong −", "kommagetallen", "breuken", "welke sprong?"];
  unit({
    id: "rijen", cases: 5, caseNames: RIJ_NAMEN,
    gen(level, c = rnd(0, 4)) {
      const len = 7;
      let start, step, show, parse = parseNum, stepTxt, isFrac = false, D = 1;
      if (c === 0) { step = level === "easy" ? pick([100, 250, 500, 1000]) : pick([125, 250, 750, 1250, 2500, 5000, 25000, 1500]); start = rnd(10, 800) * (step >= 1000 ? 100 : 10) + (level === "easy" ? 0 : pick([0, 5, 50])); }
      else if (c === 1) { step = -(level === "easy" ? pick([100, 500, 1000]) : pick([250, 750, 1250, 2500, 4500, 15000])); start = rnd(Math.ceil(-step * len / 1000) + 50, 900) * 1000 + pick([0, 500, 250]); }
      else if (c === 2) { step = pick([0.25, 0.5, 1.5, 0.75, -0.25, -0.05, 0.4, -1.25]); start = pick([0, 0.5, 1.25, 2, 3.75, 10]) + (step < 0 ? 12 : 0); }
      else if (c === 3) { isFrac = true; D = pick([4, 3, 5, 8, 6]); step = pick([1, 2, 3, 5, 7].filter((x) => x < D * 2 && x % D !== 0)); start = rnd(0, D); }
      else { step = pick([175, 350, 1250, -250, -1500, 2250]); start = rnd(20, 900) * 100 + (step < 0 ? 20000 : 0); }
      const terms = Array.from({ length: len }, (_, i) => +(start + i * step).toFixed(3));
      const fmt = (x) => (isFrac ? (x % D === 0 ? String(x / D) : x > D ? `${Math.floor(x / D)} en ${F(x % D, D)}` : F(x, D)) : G_(N(x)));
      stepTxt = isFrac ? `+ ${F(step, D)}` : `${step > 0 ? "+" : "−"} ${G_(N(Math.abs(step)))}`;
      if (c === 4) {
        const nxt = +(start + 4 * step).toFixed(3);
        return base(this, { mode: "fields", instruction: "Welke sprong zit er in deze rij? Vul daarna aan.", prompt: terms.slice(0, 4).map(fmt).join(" → ") + " → …",
          fields: [{ label: "sprong", ph: "+ … of − …", short: true }, { label: "volgende", num: true, short: true }], answerShown: `sprong ${stepTxt} · volgende: ${fmt(nxt)}`, right: [String(step), N(nxt)], tag: "rijen",
          chk: (g) => { const s = parseNum(String(g[0]).replace(/^\+\s*/, "").replace(/^[−–]\s*/, "-").replace(/\s/g, "")); const okS = eqNum(s, step) || (step > 0 && eqNum(s, step)); const okN = eqNum(parseNum(g[1]), nxt);
            return okS && okN ? { status: "correct" } : { status: "wrong", tag: "rijen", note: !okS && eqNum(Math.abs(s), Math.abs(step)) ? "Let op: gaat de rij omhoog (+) of omlaag (−)?" : okN ? "De volgende term is juist, de sprong niet." : "" }; } });
      }
      // te zoeken plaatsen: niet enkel achteraan
      const nBlank = level === "easy" ? 2 : 3;
      const blanks = shuffle([2, 3, 4, 5, 6]).slice(0, nBlank).sort((a, b) => a - b);
      const prompt = `<div class="muted small">sprong: <b>${stepTxt}</b></div>` + terms.map((x, i) => (blanks.includes(i) ? `<b>(${blanks.indexOf(i) + 1})</b>` : fmt(x))).join(" → ");
      return base(this, { mode: "fields", instruction: "Vul de rij aan met de gegeven sprong.", prompt,
        fields: blanks.map((b, k) => ({ label: `(${k + 1})`, num: !isFrac, short: true, ph: isFrac ? "bv. 2 en 1/4" : "" })), helpers: isFrac ? FRAC_HELP : undefined,
        answerShown: blanks.map((b, k) => `(${k + 1}) ${fmt(terms[b])}`).join(" · "), right: blanks.map((b) => (isFrac ? fracTxt(terms[b], D) : N(terms[b]))), tag: "rijen",
        chk: (g) => {
          const bad = blanks.filter((b, k) => { if (isFrac) { const p = parseFrac(g[k]); return !sameVal(p, terms[b], D); } return !eqNum(parseNum(g[k]), terms[b]); });
          return !bad.length ? { status: "correct" } : { status: "wrong", tag: "rijen", note: `Fout bij ${bad.map((b) => `(${blanks.indexOf(b) + 1})`).join(", ")}.` };
        } });
    },
  });

  // ---------- G. kansberekening ----------
  const KANS_WOORDEN = ["onmogelijk", "kleine kans", "even veel kans als geen kans", "grote kans", "zeker"];
  const kansWoord = (n, d) => (n === 0 ? KANS_WOORDEN[0] : n === d ? KANS_WOORDEN[4] : 2 * n === d ? KANS_WOORDEN[2] : 2 * n < d ? KANS_WOORDEN[1] : KANS_WOORDEN[3]);
  const KLEUR = { rood: "#ef4444", blauw: "#3b82f6", groen: "#22c55e", geel: "#eab308", paars: "#a855f7" };
  function schijf(sect) {
    const n = sect.length, R = 60;
    const pt = (i) => { const a = (i / n) * 2 * Math.PI - Math.PI / 2; return [+(R * Math.cos(a)).toFixed(2), +(R * Math.sin(a)).toFixed(2)]; };
    const parts = sect.map((k, i) => { const [x1, y1] = pt(i), [x2, y2] = pt(i + 1); return `<path d="M0,0 L${x1},${y1} A${R},${R} 0 0 1 ${x2},${y2} Z" fill="${KLEUR[k]}" stroke="#fff" stroke-width="1.5"/>`; }).join("");
    return `<svg viewBox="-66 -72 132 140" width="170" height="180" role="img" aria-label="draaischijf">${parts}<circle r="4" fill="#1e293b"/><path d="M0,-70 l-6,-0 l6,12 l6,-12 z" fill="#1e293b"/></svg>`;
  }
  const BN = { rood: "rode", blauw: "blauwe", groen: "groene", geel: "gele", paars: "paarse" };
  const zakTxt = (z) => Object.entries(z).filter(([, n]) => n).map(([k, n]) => `${n} ${BN[k]}`).join(", ").replace(/, ([^,]*)$/, " en $1");
  unit({
    id: "kans", cases: 6, caseNames: ["dobbelsteen", "knikkers in een zak", "kans in woorden", "draaischijf", "welke zak geeft meer kans?", "hoeveel toevoegen?"],
    gen(level, c = rnd(0, 5)) {
      const kansQ = (q, n, d) => Object.assign(q, { mode: "text", short: true, helpers: ["/", " op "], hint: "Schrijf als breuk (bv. 3/8) of als '3 op 8'.", answerShown: `${n} op ${d} = ${d === 1 || n === 0 ? n : F(n, d)}${simp(n, d)[1] !== d && n ? ` = ${F(...simp(n, d))}` : ""}`, right: fracTxt(n, d),
        chk: (g) => { const r = fracOk(g, n, d, "kans"); if (r.status === "equiv") return { status: "correct", note: `Mag ook vereenvoudigd: ${fracTxt(...simp(n, d))}.` }; return r; } });
      if (c === 0) {
        const ev = pick([["een even getal", 3], ["meer dan 4", 2], ["een 6", 1], ["minder dan 3", 2], ["een getal kleiner dan 7", 6], ["een 7", 0], ["een oneven getal groter dan 1", 2], ["een veelvoud van 3", 2], ["minstens 2", 5]]);
        return kansQ(base(this, { instruction: "Je gooit één keer met een gewone dobbelsteen (1 tot 6). Hoe groot is de kans?", prompt: `🎲 kans op <b>${ev[0]}</b>`, tag: "kans" }), ev[1], 6);
      }
      const maakZak = () => { const ks = shuffle(Object.keys(KLEUR)).slice(0, level === "easy" ? 2 : 3); const z = {}; ks.forEach((k) => (z[k] = rnd(1, level === "easy" ? 6 : 9))); return z; };
      if (c === 1) {
        const z = maakZak(), ks = Object.keys(z), tot = ks.reduce((a, k) => a + z[k], 0), k = pick(ks);
        const vorm = level === "easy" ? 0 : rnd(0, 2);
        const [txt, n] = vorm === 0 ? [`een <b>${BN[k]}</b> knikker`, z[k]] : vorm === 1 ? [`<b>geen ${BN[k]}</b> knikker`, tot - z[k]] : [`een <b>${BN[ks[0]]} of ${BN[ks[1]]}</b> knikker`, z[ks[0]] + z[ks[1]]];
        return kansQ(base(this, { instruction: "Je neemt zonder kijken één knikker uit de zak. Hoe groot is de kans?", prompt: `In de zak zitten ${zakTxt(z)} knikkers.<br>Kans op ${txt}`, tag: "kans" }), n, tot);
      }
      if (c === 2) {
        const z = maakZak(), ks = Object.keys(z);
        if (Math.random() < 0.3) z[ks[1]] = z[ks[0]] * (ks.length === 2 ? 1 : 1);
        const tot = Object.values(z).reduce((a, b) => a + b, 0);
        const sc = pick([["een " + BN[ks[0]], z[ks[0]]], ["een " + BN[ks[1]], z[ks[1]]], ["een witte", 0], ["een gekleurde", tot], ["geen " + BN[ks[0]], tot - z[ks[0]]]]);
        const ans = kansWoord(sc[1], tot);
        return base(this, { mode: "mc", instruction: "Hoe groot is de kans? Kies het juiste woord.", prompt: `In een zak zitten ${zakTxt(z)} knikkers. Je neemt er zonder kijken één uit.<br>Kans op <b>${sc[0]}</b> knikker?`,
          options: KANS_WOORDEN.map((w) => ({ v: w, html: w })), answer: ans, answerShown: `${ans} (${sc[1]} op ${tot})`, tag: "kans" });
      }
      if (c === 3) {
        const n = pick([6, 8, 10, 12]), ks = shuffle(Object.keys(KLEUR)).slice(0, 3);
        let sect; do { sect = Array.from({ length: n }, () => pick(ks)); } while (new Set(sect).size < 3);
        const k = pick(ks), cnt = sect.filter((x) => x === k).length;
        return kansQ(base(this, { instruction: "Je draait aan de schijf (alle vakken zijn even groot). Hoe groot is de kans dat de pijl op deze kleur stopt?", prompt: `kans op <b style="color:${KLEUR[k]}">${k}</b>`, svg: `<div class="clockwrap">${schijf(sect)}</div>`, tag: "kans" }), cnt, n);
      }
      if (c === 4) {
        let a, b; const k = pick(["rood", "blauw", "groen"]), o = k === "rood" ? "blauw" : "rood";
        do { a = [rnd(1, 6), rnd(1, 9)]; b = [rnd(1, 8), rnd(1, 12)]; } while (a[0] / (a[0] + a[1]) === b[0] / (b[0] + b[1]) && Math.random() < 0.7 || a[0] === b[0] && a[1] === b[1]);
        const pa = a[0] / (a[0] + a[1]), pb = b[0] / (b[0] + b[1]), ans = pa > pb ? "A" : pb > pa ? "B" : "gelijk";
        return base(this, { mode: "mc", instruction: `Uit welke zak heb je de meeste kans op een <b>${BN[k]}</b> knikker?`, prompt: `zak A: ${a[0]} ${BN[k]} en ${a[1]} ${BN[o]} · zak B: ${b[0]} ${BN[k]} en ${b[1]} ${BN[o]}`,
          options: [{ v: "A", html: "zak A" }, { v: "B", html: "zak B" }, { v: "gelijk", html: "even veel kans" }], answer: ans,
          answerShown: `A: ${a[0]} op ${a[0] + a[1]} · B: ${b[0]} op ${b[0] + b[1]} → ${ans === "gelijk" ? "even veel kans" : "zak " + ans} <small>(maak de breuken gelijknamig om te vergelijken)</small>`, tag: "kans" });
      }
      const r = rnd(1, 6), bl = r + rnd(2, 8);
      return numQ(base(this, { instruction: "Hoeveel rode knikkers moet je erbij doen, zodat de kans op rood even groot is als de kans op blauw?", prompt: `In de zak zitten ${r} rode en ${bl} blauwe knikkers.`, answerShown: `${bl - r} (dan ${bl} rode en ${bl} blauwe: kans op rood = 1 op 2)` }), bl - r, "kans");
    },
  });

  // ---------- H. hoofdrekenen met natuurlijke getallen (rekentrucjes) ----------
  const TRUC_NAT = ["× 5", "× 25", "× 50", "× 10, 100, 1000", ": 5", ": 25", ": 50", ": 10, 100, 1000", "+ en − (compenseren)", "× (splitsen)", ": (splitsen)"];
  unit({
    id: "hr_nat", cases: TRUC_NAT.length, caseNames: TRUC_NAT,
    gen(level, c = rnd(0, TRUC_NAT.length - 1)) {
      const e = level === "easy";
      let a, b, op, ans, truc;
      switch (c) {
        case 0: a = rnd(e ? 12 : 120, e ? 98 : 998) * 2; b = 5; op = "×"; truc = "× 10 en dan : 2"; break;
        case 1: a = rnd(e ? 2 : 6, e ? 12 : 48) * 4; b = 25; op = "×"; truc = "× 100 en dan : 4"; break;
        case 2: a = rnd(e ? 6 : 14, e ? 48 : 248) * 2; b = 50; op = "×"; truc = "× 100 en dan : 2"; break;
        case 3: b = pick([10, 100, 1000]); a = pick([rnd(11, 99) * 10 + rnd(0, 9), rnd(101, 999) * 10, rnd(1, 9) * 1000 + rnd(1, 9) * 10]); if (b === 1000 && a > 999) a = rnd(101, 999); op = "×"; truc = "schuif de cijfers 1, 2 of 3 plaatsen op (zet nullen achteraan)"; break;
        case 4: ans = rnd(e ? 12 : 120, e ? 98 : 980); b = 5; a = ans * 5; op = ":"; truc = "× 2 en dan : 10"; break;
        case 5: ans = rnd(e ? 6 : 12, e ? 40 : 190); b = 25; a = ans * 25; op = ":"; truc = "× 4 en dan : 100"; break;
        case 6: ans = rnd(e ? 4 : 12, e ? 30 : 150); b = 50; a = ans * 50; op = ":"; truc = "× 2 en dan : 100"; break;
        case 7: b = pick([10, 100, 1000]); ans = rnd(12, 980); a = ans * b; op = ":"; truc = "schrap evenveel nullen als in de deler"; break;
        case 8: { const plus = Math.random() < 0.5, k = pick([1, 2, 3, 5]); b = rnd(1, 7) * (e ? 100 : 1000) - k; a = rnd(e ? 120 : 1200, e ? 900 : 9800) + (plus ? 0 : b); op = plus ? "+" : "−"; truc = plus ? `+ ${G_(b + k)} en dan − ${k}` : `− ${G_(b + k)} en dan + ${k}`; break; }
        case 9: { b = rnd(3, 9); a = pick([rnd(12, 49), rnd(51, 99), rnd(19, 99)]); if (!e && Math.random() < 0.5) { a = rnd(11, 25); b = pick([12, 15, 35, 45, 24]); } op = "×"; truc = `splits: ${a} × ${b} = ${Math.floor(a / 10) * 10} × ${b} + ${a % 10} × ${b}`; break; }
        default: b = rnd(3, 9); ans = rnd(e ? 12 : 21, e ? 40 : 160); a = ans * b; op = ":"; truc = `splits ${G_(a)} in stukken die je makkelijk door ${b} deelt`;
      }
      if (ans === undefined) ans = op === "×" ? a * b : op === "+" ? a + b : a - b;
      return numQ(base(this, { instruction: "Reken uit het hoofd. Denk aan de rekentrucjes!", prompt: `${G_(a)} ${op} ${G_(b)} = …`, hint: e ? `truc: ${truc}` : "", answerShown: `${G_(ans)} <small>(${truc})</small>` }), ans, "hoofdrekenen");
    },
  });
  // ---------- H. hoofdrekenen met kommagetallen ----------
  const TRUC_KOMMA = ["optellen", "aftrekken", "× 10, 100, 1000", ": 10, 100, 1000", "kommagetal × getal", "kommagetal : getal", "× 5, 25, 50", ": 5, 25, 50"];
  unit({
    id: "hr_komma", cases: TRUC_KOMMA.length, caseNames: TRUC_KOMMA,
    gen(level, c = rnd(0, TRUC_KOMMA.length - 1)) {
      const e = level === "easy", d2 = (a, b) => rnd(a * 100, b * 100) / 100, d1 = (a, b) => rnd(a * 10, b * 10) / 10;
      let a, b, op, ans, truc;
      switch (c) {
        case 0: a = pick([d2(1, 9), d1(1, 20)]); b = pick([d1(0.1, 9), d2(0.05, 3)]); op = "+"; truc = "tel eenheden bij eenheden, tienden bij tienden, honderdsten bij honderdsten"; break;
        case 1: a = pick([10, 20, d1(5, 15), 100]); b = d2(0.15, Math.min(9, a - 0.1)); op = "−"; truc = "vul aan tot het volgende geheel (of trek eerst de gehelen af)"; break;
        case 2: b = pick([10, 100, 1000]); a = pick([d2(0.01, 9), rnd(1, 99) / 1000, d1(0.1, 99)]); op = "×"; truc = `de komma schuift ${String(b).length - 1} plaats(en) naar rechts`; break;
        case 3: b = pick([10, 100, 1000]); a = pick([d1(1, 999), rnd(1, 999), d2(1, 99)]); op = ":"; truc = `de komma schuift ${String(b).length - 1} plaats(en) naar links`; break;
        case 4: b = rnd(3, 9); a = pick([0.25, 0.5, 0.75, 1.5, 2.5, d1(0.2, 4.9), 0.4, 0.06, 1.25]); op = "×"; truc = `reken zonder komma (${Math.round(a * 100)} × ${b}) en zet de komma terug`; break;
        case 5: b = rnd(3, 9); ans = pick([d1(0.1, 1.9), rnd(1, 15) / 100, d1(1, 9)]); a = +(ans * b).toFixed(3); op = ":"; truc = `denk aan tienden of honderdsten: ${N(a)} = ${Math.round(a * (ans < 0.1 ? 100 : 10))} ${ans < 0.1 ? "honderdsten" : "tienden"}`; break;
        case 6: b = pick([5, 25, 50]); a = b === 25 ? pick([0.4, 0.8, 1.2, 1.6, 2.4, 0.04, 3.2]) : pick([d1(0.2, 9.8), 2.4, 0.6, 1.8, 0.12]); op = "×"; truc = b === 5 ? "× 10 : 2" : b === 25 ? "× 100 : 4" : "× 100 : 2"; break;
        default: b = pick([5, 25, 50]); ans = pick([0.2, 0.4, 0.5, 1.2, 0.6, 2.4, 0.14, 0.08]); a = +(ans * b).toFixed(3); op = ":"; truc = b === 5 ? "× 2 : 10" : b === 25 ? "× 4 : 100" : "× 2 : 100";
      }
      if (ans === undefined) ans = +(op === "×" ? a * b : op === "+" ? a + b : op === "−" ? a - b : a / b).toFixed(6);
      return numQ(base(this, { instruction: "Reken uit het hoofd.", prompt: `${N(a)} ${op} ${G_(N(b))} = …`, hint: e ? `truc: ${truc}` : "", answerShown: `${N(ans)} <small>(${truc})</small>` }), ans, "hoofdrekenen",
        { note: (x) => (x !== null && !eqNum(x, ans) && [10, 100, 1000, 0.1, 0.01].some((f) => eqNum(+(x * f).toFixed(6), ans)) ? "De cijfers kloppen, maar de komma staat verkeerd." : "") });
    },
  });
  // ---------- H. breuk en natuurlijk getal ----------
  const BG = ["getal + breuk", "breuk + getal", "getal − breuk", "getal − gemengd getal", "gemengd getal + breuk (over de 1)"];
  unit({
    id: "breuk_geheel", cases: BG.length, caseNames: BG,
    gen(level, c = rnd(0, BG.length - 1)) {
      const d = rnd(2, level === "easy" ? 6 : 9), n = rnd(1, d - 1), w = rnd(1, level === "easy" ? 3 : 6);
      let prompt, num, den = d, uitleg;
      if (c === 0) { prompt = `${w} + ${F(n, d)}`; num = w * d + n; uitleg = `${F(w * d, d)} + ${F(n, d)} = ${F(num, d)}`; }
      else if (c === 1) { prompt = `${F(n, d)} + ${w}`; num = w * d + n; uitleg = `${F(n, d)} + ${F(w * d, d)} = ${F(num, d)}`; }
      else if (c === 2) { prompt = `${w} − ${F(n, d)}`; num = w * d - n; uitleg = `${F(w * d, d)} − ${F(n, d)} = ${F(num, d)}`; }
      else if (c === 3) { const W = w + rnd(1, 4), w2 = rnd(1, W - 1); prompt = `${W} − ${w2} en ${F(n, d)}`; num = (W - w2) * d - n; uitleg = `${F(W * d, d)} − ${F(w2 * d + n, d)} = ${F(num, d)}`; }
      else { const d2 = pick([d, d * 2].filter((x) => x <= 12)), k = d2 / d, n1 = rnd(Math.max(1, d - 2), d - 1), n2 = rnd(Math.max(1, d2 - n1 * k), d2 - 1);
        den = d2; num = w * d2 + n1 * k + n2; prompt = `${w} en ${F(n1, d)} + ${F(n2, d2)}`; uitleg = `${F(w * d2 + n1 * k, d2)} + ${F(n2, d2)} = ${F(num, d2)}`; }
      const [sn, sd] = simp(num, den);
      return base(this, { mode: "text", instruction: "Reken uit. Maak van het getal eerst een breuk met dezelfde noemer. Vereenvoudig waar het kan.", prompt: `${prompt} = …`, short: true, helpers: FRAC_HELP, hint: "Schrijf bv. 7/3 of 2 en 1/3",
        answerShown: `${uitleg}${sd !== den ? ` = ${F(sn, sd)}` : ""}${sn > sd && sd > 1 ? ` = ${Math.floor(sn / sd)} en ${F(sn % sd, sd)}` : ""}`, right: fracTxt(sn, sd), tag: "gelijknamig",
        chk: (g) => fracOk(g, num, den, "gelijknamig") });
    },
  });

  // ---------- M. hoeken ----------
  const hoekSoort = (a) => (a === 90 ? "rechte hoek" : a < 90 ? "scherpe hoek" : "stompe hoek");
  // hoek tekenen: hoekpunt (0,0), eerste been naar rechts (of gedraaid over rot°)
  function hoekSvg(a, opts = {}) {
    const rot = opts.rot || 0, L = opts.L || 80, W = 200, H = 130;
    const p = (deg, r) => [+(r * Math.cos(((deg + rot) * Math.PI) / 180)).toFixed(2), +(-r * Math.sin(((deg + rot) * Math.PI) / 180)).toFixed(2)];
    const [x1, y1] = p(0, L), [x2, y2] = p(a, L), [b1, c1] = p(0, 18), [b2, c2] = p(a, 18);
    const boog = a === 90 ? (() => { const [u1, v1] = p(0, 12), [u2, v2] = p(90, 12), [u3, v3] = [u1 + u2, v1 + v2]; return `<path d="M${u1},${v1} L${u3},${v3} L${u2},${v2}" fill="none" stroke="#f59e0b" stroke-width="2"/>`; })()
      : `<path d="M${b1},${c1} A18,18 0 ${a > 180 ? 1 : 0} 0 ${b2},${c2}" fill="none" stroke="#f59e0b" stroke-width="2"/>`;
    return `<svg viewBox="${-W / 2} ${-H + 30} ${W} ${H}" width="${opts.size || 200}" height="${((opts.size || 200) * H) / W}" role="img" aria-label="hoek"><g stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="0" y1="0" x2="${x1}" y2="${y1}"/><line x1="0" y1="0" x2="${x2}" y2="${y2}"/></g>${boog}<circle r="2.5" fill="currentColor"/></svg>`;
  }
  // gradenboog met 1°-streepjes; buitenste schaal 0 rechts, binnenste 0 links. Rooster: 1 eenheid = 1 px (voor klikken)
  const GB = { R: 150, pad: 10 };
  function gradenboog(a, opts = {}) {
    const { R, pad } = GB, xmin = -R - 10, xmax = R + 10, ymin = -20, ymax = R + 12;
    const X = (x) => pad + (x - xmin), Y = (y) => pad + (ymax - y), W = xmax - xmin + 2 * pad, H = ymax - ymin + 2 * pad;
    const P = (deg, r) => [X(r * Math.cos((deg * Math.PI) / 180)), Y(r * Math.sin((deg * Math.PI) / 180))];
    let t = "";
    for (let d = 0; d <= 180; d++) {
      const len = d % 10 === 0 ? 14 : d % 5 === 0 ? 9 : 5, [xa, ya] = P(d, R), [xb, yb] = P(d, R - len);
      t += `<line x1="${xa.toFixed(1)}" y1="${ya.toFixed(1)}" x2="${xb.toFixed(1)}" y2="${yb.toFixed(1)}" stroke="#1e3a8a" stroke-width="${d % 10 === 0 ? 1.1 : 0.6}"/>`;
      if (d % 10 === 0) {
        const [xo, yo] = P(d, R - 23), [xi, yi] = P(d, R - 37);
        t += `<text x="${xo.toFixed(1)}" y="${(yo + 3).toFixed(1)}" font-size="8.5" text-anchor="middle" fill="#1e3a8a">${d}</text><text x="${xi.toFixed(1)}" y="${(yi + 3).toFixed(1)}" font-size="7.5" text-anchor="middle" fill="#b91c1c">${180 - d}</text>`;
      }
    }
    const [cx, cy] = [X(0), Y(0)];
    const flip = opts.flip; // eerste been naar links
    const legA = flip ? 180 : 0, legB = flip ? 180 - a : a;
    const [ax, ay] = P(legA, R + 8), [bx, by] = opts.draw === false ? [0, 0] : P(legB, R + 8);
    const legs = `<line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}" stroke="#0f172a" stroke-width="2.4"/>` + (opts.draw === false ? "" : `<line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}" stroke="#0f172a" stroke-width="2.4"/>`);
    const sol = opts.sol !== undefined ? (() => { const sb = flip ? 180 - opts.sol : opts.sol, [sx, sy] = P(sb, R + 8); return `<line x1="${cx}" y1="${cy}" x2="${sx}" y2="${sy}" stroke="#22c55e" stroke-width="2.4"/>`; })() : "";
    return `<svg class="g-svg gradenboog" viewBox="0 0 ${W} ${H}" data-xmin="${xmin}" data-xmax="${xmax}" data-ymin="${ymin}" data-ymax="${ymax}" data-unit="1" data-pad="${pad}" style="width:100%;max-width:640px;touch-action:manipulation${opts.click ? ";cursor:crosshair" : ""}">
      <path d="M${X(-R - 6)},${Y(0)} A${R + 6},${R + 6} 0 0 1 ${X(R + 6)},${Y(0)} Z" fill="#dbeafe" fill-opacity=".55" stroke="#1e3a8a" stroke-width="1"/>
      <line x1="${X(-R - 6)}" y1="${Y(0)}" x2="${X(R + 6)}" y2="${Y(0)}" stroke="#1e3a8a" stroke-width="1"/>${t}${legs}${sol}<circle cx="${cx}" cy="${cy}" r="3" fill="#b91c1c"/><g class="g-marks"></g></svg>`;
  }
  const HS = ["scherp, recht of stomp (tekening)", "soort hoek bij een aantal graden", "welke hoek is stomp/scherp?"];
  unit({
    id: "hoek_soort", cases: HS.length, caseNames: HS,
    gen(level, c = rnd(0, HS.length - 1)) {
      const opts3 = ["scherpe hoek", "rechte hoek", "stompe hoek"].map((o) => ({ v: o, html: o }));
      const randA = () => pick([90, rnd(20, 85), rnd(95, 170), rnd(86, 89), rnd(91, 94)]);
      if (c === 0) { const a = randA(); return base(this, { mode: "mc", instruction: "Welke soort hoek is dit? (meet als je twijfelt)", prompt: "", svg: `<div class="clockwrap">${hoekSvg(a, { rot: a > 140 ? 0 : rnd(0, 2) * 15 })}</div>`, options: opts3, answer: hoekSoort(a), answerShown: `${hoekSoort(a)} (${a}°)`, tag: "hoeken" }); }
      if (c === 1) { const a = pick([rnd(1, 89), 90, rnd(91, 179), 89, 91, 179]); return base(this, { mode: "mc", instruction: "Welke soort hoek is dit?", prompt: `<b>${a}°</b>`, options: opts3, answer: hoekSoort(a), answerShown: `${hoekSoort(a)} <small>(scherp: kleiner dan 90° · recht: 90° · stomp: tussen 90° en 180°)</small>`, tag: "hoeken" }); }
      const soort = pick(["stompe hoek", "scherpe hoek", "rechte hoek"]);
      const goed = soort === "stompe hoek" ? rnd(100, 160) : soort === "scherpe hoek" ? rnd(25, 80) : 90;
      const andere = shuffle([rnd(25, 80), 90, rnd(100, 160), rnd(25, 80), rnd(100, 160)].filter((x) => hoekSoort(x) !== soort)).slice(0, 3);
      const all = shuffle([goed, ...andere]);
      return base(this, { mode: "mc", instruction: `Welke hoek is een <b>${soort}</b>?`, prompt: "", options: all.map((a, i) => ({ v: String(a), html: hoekSvg(a, { size: 110, rot: a > 140 ? 0 : (i * 20) % 40 }) })), answer: String(goed), answerShown: `${goed}°`, tag: "hoeken" });
    },
  });
  const HM = ["scherpe hoek, been rechts", "stompe hoek, been rechts", "been naar links (andere schaal!)", "stompe hoek, been naar links"];
  unit({
    id: "hoek_meten", cases: HM.length, caseNames: HM,
    gen(level, c = rnd(0, HM.length - 1)) {
      const flip = c >= 2, stomp = c === 1 || c === 3;
      let a; do { a = stomp ? rnd(92, 172) : rnd(12, 88); } while (level !== "easy" && a % 5 === 0);
      const tol = level === "hard" ? 0 : 1;
      return base(this, { mode: "num", instruction: "Meet de hoek met de gradenboog. Hoeveel graden? (tot op 1° nauwkeurig)", prompt: `<small>${flip ? "Het eerste been wijst naar <b>links</b>: lees de schaal die bij dat been op 0 begint." : "Het eerste been ligt op 0°."} Schuif de gradenboog opzij als hij niet volledig past.</small>`,
        svg: `<div class="figwide">${gradenboog(a, { flip })}</div>`, short: true, unitSuffix: "°", right: String(a), answerShown: `${a}° (${hoekSoort(a)})`, tag: "hoeken_meten",
        chk: (g) => { const x = parseNum(String(g).replace("°", "")); if (x === null) return { status: "wrong", tag: "hoeken_meten" };
          if (Math.abs(x - a) <= tol) return { status: "correct", note: x !== a ? `Precies: ${a}°.` : "" };
          return { status: "wrong", tag: "hoeken_meten", note: Math.abs(x - (180 - a)) <= tol ? "Je las de verkeerde schaal: begin te tellen bij de 0 van het eerste been." : Math.abs(x - a) <= 3 ? "Bijna: kijk nauwkeuriger (elk klein streepje is 1°)." : "" }; } });
    },
  });
  const HT = ["scherpe hoek", "stompe hoek", "eerste been naar links", "rechte hoek of bijna recht"];
  unit({
    id: "hoek_tekenen", cases: HT.length, caseNames: HT,
    gen(level, c = rnd(0, HT.length - 1)) {
      const flip = c === 2;
      let a = c === 0 ? rnd(15, 85) : c === 1 ? rnd(95, 170) : c === 2 ? pick([rnd(20, 80), rnd(100, 165)]) : pick([90, 88, 92, 89, 91]);
      if (level !== "easy" && c !== 3 && a % 5 === 0) a += 1;
      const tol = level === "easy" ? 2 : 1;
      const angleOf = (p) => { let d = (Math.atan2(p[1], p[0]) * 180) / Math.PI; if (flip) d = 180 - d; return d; };
      return base(this, { mode: "click", instruction: `Teken een hoek van <b>${a}°</b>: tik op de plaats waar het tweede been door moet (tot op ${tol}° nauwkeurig).`, prompt: `<small>Tip: tik op de buitenrand bij het juiste streepje. ${flip ? "Het eerste been wijst naar links: tel vanaf die 0!" : ""} Past de gradenboog niet op je scherm? Schuif hem opzij.</small>`,
        svg: `<div class="figwide">${gradenboog(a, { flip, draw: false, click: true })}</div>`, solutionSvg: `<div class="figwide">${gradenboog(a, { flip, draw: false, sol: a })}</div>`,
        nPts: 1, names: [""], clickInfo: "Tik waar het tweede been door moet.", pointLabel: (p) => `${Math.round(angleOf(p))}°`, givenFmt: (g) => (g && g[0] ? `${Math.round(angleOf(g[0]))}°` : "—"),
        answerShown: `${a}°`, right: [[0, 0]], tag: "hoeken_meten",
        chk: (g) => { const p = g && g[0]; if (!p || Math.hypot(p[0], p[1]) < 40) return { status: "wrong", tag: "hoeken_meten", note: "Tik verder van het hoekpunt, bij de rand van de gradenboog." };
          const d = angleOf(p); if (Math.abs(d - a) <= tol) return { status: "correct" };
          return { status: "wrong", tag: "hoeken_meten", note: `Jouw hoek is ongeveer ${Math.round(d)}°.${Math.abs(d - (180 - a)) <= tol ? " Je gebruikte de verkeerde schaal." : ""}` }; } });
    },
  });

  // ---------- K. meetkunde: vierhoeken ----------
  // eigenschappen: [ev = aantal paar evenwijdige zijden, gz = alle zijden gelijk, ro = 4 rechte hoeken, oz = overstaande zijden gelijk]
  const VH = {
    vierkant: { ev: 2, gz: true, ro: true, oz: true, sch: "4 gelijke zijden, 4 rechte hoeken, 2 paar evenwijdige zijden" },
    rechthoek: { ev: 2, gz: false, ro: true, oz: true, sch: "2 paar evenwijdige zijden, overstaande zijden even lang, 4 rechte hoeken" },
    ruit: { ev: 2, gz: true, ro: false, oz: true, sch: "4 gelijke zijden, 2 paar evenwijdige zijden, (meestal) geen rechte hoeken" },
    parallellogram: { ev: 2, gz: false, ro: false, oz: true, sch: "2 paar evenwijdige zijden, overstaande zijden even lang" },
    trapezium: { ev: 1, gz: false, ro: false, oz: false, sch: "(minstens) 1 paar evenwijdige zijden" },
    "willekeurige vierhoek": { ev: 0, gz: false, ro: false, oz: false, sch: "geen evenwijdige zijden" },
  };
  const VH_NAMEN = Object.keys(VH);
  const EIG = [
    ["4 rechte hoeken", (k) => VH[k].ro], ["4 gelijke zijden", (k) => VH[k].gz], ["2 paar evenwijdige zijden", (k) => VH[k].ev === 2],
    ["minstens 1 paar evenwijdige zijden", (k) => VH[k].ev >= 1], ["overstaande zijden even lang", (k) => VH[k].oz],
  ];
  const TOREN = [
    ["Elk vierkant is een rechthoek.", true], ["Elke rechthoek is een vierkant.", false], ["Elk vierkant is een ruit.", true], ["Elke ruit is een vierkant.", false],
    ["Elke rechthoek is een parallellogram.", true], ["Elk parallellogram is een rechthoek.", false], ["Elke ruit is een parallellogram.", true], ["Elk parallellogram is een trapezium.", true],
    ["Elk trapezium is een parallellogram.", false], ["Een trapezium heeft altijd 4 gelijke zijden.", false], ["Een vierkant is een speciaal soort trapezium.", true], ["Een ruit heeft altijd 4 rechte hoeken.", false],
    ["Elke vierhoek is een trapezium.", false], ["Een rechthoek heeft 2 paar evenwijdige zijden.", true],
  ];
  // figuur met 'gemeten' zijden en hoeken
  function vierhoekFig(k) {
    let pts;
    const s = rnd(3, 5), l = s + rnd(1, 3), h = rnd(2, Math.min(4, l - 1)), sh = rnd(1, 2);
    if (k === "vierkant") pts = [[0, 0], [s, 0], [s, s], [0, s]];
    else if (k === "rechthoek") pts = [[0, 0], [l, 0], [l, h], [0, h]];
    else if (k === "parallellogram") pts = [[0, 0], [l, 0], [l + sh, h], [sh, h]];
    else if (k === "ruit") { const a = pick([[3, 4], [4, 3]]); const z = 5; pts = [[0, 0], [z, 0], [z + a[0], a[1]], [a[0], a[1]]]; }
    else if (k === "trapezium") pts = [[0, 0], [l + 2, 0], [Math.max(sh + 1, l - 1 - rnd(0, 1)), h], [sh, h]];
    else pts = pick([[[0, 0], [5, 1], [6, 4], [1, 3]], [[0, 0], [6, 0], [4, 3], [-1, 2]], [[0, 1], [5, 0], [6, 3], [2, 4]], [[0, 0], [4, -1], [6, 3], [1, 2]]]);
    const n = 4, dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    const ang = (i) => { const p = pts[i], a = pts[(i + n - 1) % n], b = pts[(i + 1) % n]; const v1 = [a[0] - p[0], a[1] - p[1]], v2 = [b[0] - p[0], b[1] - p[1]]; return Math.round((Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2))) * 180) / Math.PI); };
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const plot = new Geo.Plot(Math.min(...xs) - 1.2, Math.max(...xs) + 1.2, Math.min(...ys) - 1, Math.max(...ys) + 1, { unit: 34, pad: 6 });
    plot.poly(pts, "g-orig");
    const cx = xs.reduce((a, b) => a + b) / 4, cy = ys.reduce((a, b) => a + b) / 4;
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % n], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], o = [m[0] - cx, m[1] - cy], ol = Math.hypot(...o) || 1;
      plot.raw(`<text x="${plot.X(m[0] + (o[0] / ol) * 0.45)}" y="${plot.Y(m[1] + (o[1] / ol) * 0.45) + 4}" text-anchor="middle" font-size="12" fill="currentColor">${N(Math.round(dist(p, q) * 10) / 10)} cm</text>`);
      const v = [cx - p[0], cy - p[1]], vl = Math.hypot(...v);
      plot.raw(`<text x="${plot.X(p[0] + (v[0] / vl) * 0.6)}" y="${plot.Y(p[1] + (v[1] / vl) * 0.6) + 4}" text-anchor="middle" font-size="11" fill="#d97706">${ang(i)}°</text>`);
    });
    return plot.svg();
  }
  const VE = ["eigenschappen → naam", "gemeten figuur → naam", "vierhoekentoren: waar of niet waar?", "welke eigenschappen heeft …?", "welke vierhoeken hebben …?"];
  unit({
    id: "vierhoeken", cases: VE.length, caseNames: VE,
    gen(level, c = rnd(0, VE.length - 1)) {
      const nm = (k) => ({ v: k, html: k });
      if (c === 0) { const k = pick(VH_NAMEN); return base(this, { mode: "mc", instruction: "Welke vierhoek heeft deze eigenschappen? Kies de <b>meest precieze</b> naam.", prompt: esc(VH[k].sch), options: shuffle(VH_NAMEN).map(nm), answer: k, answerShown: k, tag: "vierhoeken" }); }
      if (c === 1) { const k = pick(VH_NAMEN.filter((x) => x !== "willekeurige vierhoek" || level !== "easy")); return base(this, { mode: "mc", instruction: "Controleer de zijden en hoeken (zie de metingen). Welke vierhoek is dit? Kies de meest precieze naam.", prompt: "", svg: `<div class="figwide">${vierhoekFig(k)}</div>`, options: shuffle(VH_NAMEN).map(nm), answer: k, answerShown: `${k}: ${VH[k].sch}`, tag: "vierhoeken" }); }
      if (c === 2) { const [z, w] = pick(TOREN); return base(this, { mode: "mc", instruction: "Vierhoekentoren: waar of niet waar?", prompt: `<b>${esc(z)}</b>`, options: [{ v: "waar", html: "waar" }, { v: "niet waar", html: "niet waar" }], answer: w ? "waar" : "niet waar", answerShown: `${w ? "waar" : "niet waar"} <small>(toren: vierhoek → trapezium → parallellogram → rechthoek / ruit → vierkant)</small>`, tag: "vierhoeken" }); }
      const multiQ = (instr, prompt, opts, goed) => base(this, { mode: "multi", instruction: instr, prompt, opts: opts.map((o) => ({ v: o, html: o })), multiLabel: "duid alles aan wat juist is", answerSet: goed, answerShown: goed.join(" · ") || "geen enkele", tag: "vierhoeken",
        chk: (g) => { const s = (g && g.sel) || []; const ok = s.length === goed.length && goed.every((x) => s.includes(x)); return ok ? { status: "correct" } : { status: "wrong", tag: "vierhoeken", note: `Juist: ${goed.join(", ")}.` }; } });
      if (c === 3) { const k = pick(VH_NAMEN.slice(0, 5)); return multiQ(`Welke eigenschappen heeft <b>${["rechthoek", "ruit"].includes(k) ? "elke" : "elk"} ${k}</b>?`, "", EIG.map((e) => e[0]), EIG.filter((e) => e[1](k)).map((e) => e[0])); }
      const e = pick(EIG); return multiQ(`Welke vierhoeken hebben <b>altijd</b>: ${esc(e[0])}?`, "", VH_NAMEN.slice(0, 5), VH_NAMEN.slice(0, 5).filter((k) => e[1](k)));
    },
  });

  // ---------- K. meetkunde: driehoeken ----------
  const DH_H = ["scherphoekig", "rechthoekig", "stomphoekig"], DH_Z = ["gelijkzijdig", "gelijkbenig", "ongelijkzijdig"];
  function driehoek(level) {
    // kies type en maak hoeken (som 180)
    const tz = pick(DH_Z);
    let A;
    if (tz === "gelijkzijdig") A = [60, 60, 60];
    else if (tz === "gelijkbenig") { const top = pick([90, rnd(30, 80), rnd(100, 130), 40, 120]); const b = (180 - top) / 2; if (b % 1) return driehoek(level); A = [b, b, top]; }
    else { for (;;) { const x = pick([90, rnd(25, 85), rnd(95, 130)]), y = rnd(20, 180 - x - 20), z = 180 - x - y; if (new Set([x, y, z]).size === 3 && z >= 15) { A = shuffle([x, y, z]); break; } } }
    const mx = Math.max(...A), th = mx === 90 ? "rechthoekig" : mx > 90 ? "stomphoekig" : "scherphoekig";
    // zijden met de sinusregel (zijde tegenover hoek i)
    const k = rnd(5, 9) / Math.sin((mx * Math.PI) / 180);
    const z = A.map((a) => Math.round(k * Math.sin((a * Math.PI) / 180) * 10) / 10);
    return { A, z, th, tz };
  }
  function driehoekSvg(t) {
    const [a, b] = [t.A[0], t.A[1]], c = t.z[2]; // zijde AB = tegenover C (index 2)
    const P0 = [0, 0], P1 = [c, 0], P2 = [t.z[1] * Math.cos((a * Math.PI) / 180), t.z[1] * Math.sin((a * Math.PI) / 180)];
    const pts = [P0, P1, P2], xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const sc = 230 / Math.max(Math.max(...xs) - Math.min(...xs), 1);
    const plot = new Geo.Plot(Math.min(...xs) - 1.4, Math.max(...xs) + 1.4, -1, Math.max(...ys) + 1, { unit: Math.min(sc, 34), pad: 6 });
    plot.poly(pts, "g-orig");
    const cx = (P0[0] + P1[0] + P2[0]) / 3, cy = (P0[1] + P1[1] + P2[1]) / 3;
    const opp = [[1, 2, 0], [2, 0, 1], [0, 1, 2]]; // zijde tussen pts[i] en pts[j] ligt tegenover hoek k
    opp.forEach(([i, j, k]) => { const m = [(pts[i][0] + pts[j][0]) / 2, (pts[i][1] + pts[j][1]) / 2], o = [m[0] - cx, m[1] - cy], ol = Math.hypot(...o) || 1;
      plot.raw(`<text x="${plot.X(m[0] + (o[0] / ol) * 0.55)}" y="${plot.Y(m[1] + (o[1] / ol) * 0.55) + 4}" text-anchor="middle" font-size="12" fill="currentColor">${N(t.z[k])} cm</text>`); });
    pts.forEach((p, i) => { const v = [cx - p[0], cy - p[1]], vl = Math.hypot(...v); plot.raw(`<text x="${plot.X(p[0] + (v[0] / vl) * 0.75)}" y="${plot.Y(p[1] + (v[1] / vl) * 0.75) + 4}" text-anchor="middle" font-size="11" fill="#d97706">${t.A[i]}°</text>`); });
    return plot.svg();
  }
  const DH = ["volgens de hoeken (figuur)", "volgens de zijden (figuur)", "volgens zijden én hoeken (figuur)", "uit de maten (zonder figuur)", "kan dat bestaan?"];
  const KAN = [
    ["een rechthoekige, gelijkbenige driehoek", true], ["een stomphoekige, gelijkzijdige driehoek", false], ["een rechthoekige, gelijkzijdige driehoek", false],
    ["een stomphoekige, gelijkbenige driehoek", true], ["een scherphoekige, ongelijkzijdige driehoek", true], ["een driehoek met twee rechte hoeken", false],
    ["een driehoek met twee stompe hoeken", false], ["een scherphoekige, gelijkzijdige driehoek", true],
  ];
  unit({
    id: "driehoeken", cases: DH.length, caseNames: DH,
    gen(level, c = rnd(0, DH.length - 1)) {
      if (c === 4) { const [z, w] = pick(KAN); return base(this, { mode: "mc", instruction: "Kan deze driehoek bestaan?", prompt: `<b>${esc(z)}</b>`, options: [{ v: "ja", html: "ja" }, { v: "nee", html: "nee" }], answer: w ? "ja" : "nee", answerShown: `${w ? "ja" : "nee"} <small>(de 3 hoeken samen = 180°; gelijkzijdig = 3 hoeken van 60°)</small>`, tag: "driehoeken" }); }
      const t = driehoek(level);
      const svg = c === 3 ? "" : `<div class="figwide">${driehoekSvg(t)}</div>`;
      const prompt = c === 3 ? `zijden: ${t.z.map((x) => N(x) + " cm").join(", ")} · hoeken: ${t.A.map((x) => x + "°").join(", ")}` : "";
      const pickRow = (lbl, arr) => ({ label: lbl, opts: arr.map((x) => ({ v: x, html: x })) });
      if (c === 0) return base(this, { mode: "mc", instruction: "Benoem de driehoek volgens de <b>hoeken</b>.", prompt, svg, options: DH_H.map((x) => ({ v: x, html: x })), answer: t.th, answerShown: `${t.th} (grootste hoek ${Math.max(...t.A)}°)`, tag: "driehoeken" });
      if (c === 1) return base(this, { mode: "mc", instruction: "Benoem de driehoek volgens de <b>zijden</b>.", prompt, svg, options: DH_Z.map((x) => ({ v: x, html: x })), answer: t.tz, answerShown: t.tz, tag: "driehoeken" });
      return base(this, { mode: "pick", instruction: "Benoem de driehoek volgens de hoeken én volgens de zijden.", prompt, svg, picks: [pickRow("hoeken", DH_H), pickRow("zijden", DH_Z)], answerShown: `${t.th}, ${t.tz}`, tag: "driehoeken",
        chk: (g) => (g[0] === t.th && g[1] === t.tz ? { status: "correct" } : { status: "wrong", tag: "driehoeken", note: g[0] === t.th ? "Hoeken juist, zijden fout." : g[1] === t.tz ? "Zijden juist, hoeken fout." : "" }) });
    },
  });

  // ---------- K. cirkel ----------
  const CK = ["passeropening bij een diameter", "diameter bij een straal", "middelpunt, straal of diameter?", "punten op de cirkel (rooster)"];
  unit({
    id: "cirkel", cases: CK.length, caseNames: CK,
    gen(level, c = rnd(0, CK.length - 1)) {
      if (c === 0) { const d = pick([rnd(4, 14), rnd(5, 19) + 0.5 * 0, rnd(30, 90) / 10]); return numQ(base(this, { instruction: `Je moet een cirkel tekenen met een <b>diameter van ${N(d)} cm</b>. Hoe ver zet je je passer open?`, prompt: "passeropening = … cm", unitSuffix: "cm", answerShown: `${N(d / 2)} cm (de straal = de helft van de diameter)` }), d / 2, "cirkel", { note: (x) => (eqNum(x, d) ? "Dat is de diameter; de passeropening is de straal." : eqNum(x, d * 2) ? "Je verdubbelde; de straal is de helft van de diameter." : "") }); }
      if (c === 1) { const r = pick([rnd(2, 9), rnd(15, 75) / 10]); return numQ(base(this, { instruction: `Een cirkel heeft een <b>straal van ${N(r)} cm</b>. Hoe groot is de diameter?`, prompt: "diameter = … cm", unitSuffix: "cm", answerShown: `${N(r * 2)} cm` }), r * 2, "cirkel"); }
      if (c === 2) {
        const plot = new Geo.Plot(-4, 4, -4, 4, { unit: 22, pad: 6 }); plot.circle([0, 0], 3, "g-open");
        const opts = [["middelpunt", () => plot.point([0, 0], "", "g-dot")], ["straal", () => plot.seg([0, 0], [2.12, 2.12], "g-line")], ["diameter", () => plot.seg([-3, 0], [3, 0], "g-line")], ["koorde (geen straal of diameter)", () => plot.seg([-2.6, -1.5], [1.5, -2.6], "g-line")]];
        const k = pick(opts.slice(0, 3)); k[1]();
        return base(this, { mode: "mc", instruction: "Wat is aangeduid in de cirkel?", prompt: "", svg: `<div class="clockwrap">${plot.svg()}</div>`, options: opts.map((o) => ({ v: o[0], html: o[0] })), answer: k[0], answerShown: `${k[0]} <small>(straal: van het middelpunt naar de cirkel · diameter: door het middelpunt, van rand tot rand = 2 × straal)</small>`, tag: "cirkel" });
      }
      const r = pick([5, 5, 4, 3, 2]), nP = level === "easy" ? 1 : 3;
      const plot = new Geo.Plot(-6, 6, -6, 6, { unit: 24, pad: 8, grid: true }); plot.point([0, 0], "M", "g-dot");
      const sol = new Geo.Plot(-6, 6, -6, 6, { unit: 24, pad: 8, grid: true }); sol.point([0, 0], "M", "g-dot"); sol.circle([0, 0], r, "g-sol");
      return base(this, { mode: "click", instruction: `Een cirkel met middelpunt M en <b>straal ${r} hokjes</b>: duid ${nP === 1 ? "een roosterpunt" : nP + " verschillende roosterpunten"} aan die <b>op</b> de cirkel liggen.`, prompt: r === 5 ? "<small>Tip: niet enkel recht naar boven of opzij; denk ook aan 3 opzij en 4 omhoog.</small>" : "",
        svg: plot.svg(), solutionSvg: sol.svg(), nPts: nP, names: ["P", "Q", "R"].slice(0, nP), answerShown: `alle punten op ${r} hokjes afstand van M, bv. (${r},0), (0,${r})${r === 5 ? ", (3,4), (4,3)" : ""}`, right: [[r, 0]], tag: "cirkel",
        chk: (g) => { const bad = (g || []).filter((p) => p[0] * p[0] + p[1] * p[1] !== r * r); const uniqOk = new Set((g || []).map((p) => p.join(","))).size === (g || []).length;
          return !bad.length && uniqOk ? { status: "correct" } : { status: "wrong", tag: "cirkel", note: bad.length ? `${bad.length} punt(en) liggen niet op ${r} hokjes van M.` : "Kies verschillende punten." }; } });
    },
  });

  // ---------- K. een gevraagde vierhoek tekenen (op het rooster) ----------
  const VT = ["rechthoek (lengte en breedte)", "vierkant (zijde)", "parallellogram: vierde hoekpunt", "ruit: vierde hoekpunt", "rechthoek: vierde hoekpunt (schuin)"];
  unit({
    id: "vierhoek_tekenen", cases: VT.length, caseNames: VT,
    gen(level, c = rnd(0, VT.length - 1)) {
      const M = 6, mk = () => new Geo.Plot(-M, M, -M, M, { unit: 24, pad: 8, grid: true });
      const eqS = (a, b) => a[0] === b[0] && a[1] === b[1];
      if (c <= 1) {
        const l = c === 1 ? rnd(3, 6) : rnd(4, 8), b = c === 1 ? l : rnd(2, Math.min(l - 1, 6));
        const A = [rnd(-M, M - l), rnd(-M, M - b)];
        const plot = mk(); plot.point(A, "A", "g-dot");
        const sol = mk(), S = [A, [A[0] + l, A[1]], [A[0] + l, A[1] + b], [A[0], A[1] + b]]; sol.poly(S, "g-sol"); sol.point(A, "A", "g-dot");
        return base(this, { mode: "click", instruction: c === 1 ? `Teken een <b>vierkant met zijde ${l}</b> (hokjes). A is gegeven: duid de andere 3 hoekpunten aan.` : `Teken een <b>rechthoek van ${l} op ${b}</b> (hokjes). A is gegeven: duid de andere 3 hoekpunten aan.`, prompt: "",
          svg: plot.svg(), solutionSvg: sol.svg(), nPts: 3, names: ["B", "C", "D"], answerShown: "bv. " + S.slice(1).map((p, i) => `${"BCD"[i]}(${p[0]}, ${p[1]})`).join(" "), right: S.slice(1), tag: "vierhoeken",
          chk: (g) => {
            const pts = [A, ...(g || [])];
            // alle volgordes proberen: rechthoek met zijden l en b
            const perms = [[0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3]];
            const isRect = (P) => { const v = (i) => [P[(i + 1) % 4][0] - P[i][0], P[(i + 1) % 4][1] - P[i][1]]; const L = [0, 1, 2, 3].map((i) => Math.hypot(...v(i)));
              const rech = [0, 1, 2, 3].every((i) => v(i)[0] * v((i + 1) % 4)[0] + v(i)[1] * v((i + 1) % 4)[1] === 0);
              const zz = [L[0], L[1]].sort((x, y) => x - y); return rech && Math.abs(L[0] - L[2]) < 1e-9 && Math.abs(L[1] - L[3]) < 1e-9 && Math.abs(zz[0] - Math.min(l, b)) < 1e-9 && Math.abs(zz[1] - Math.max(l, b)) < 1e-9; };
            return perms.some((pp) => isRect(pp.map((i) => pts[i]))) ? { status: "correct" } : { status: "wrong", tag: "vierhoeken", note: "Controleer: 4 rechte hoeken en de juiste lengtes (tel de hokjes)." };
          } });
      }
      // gegeven A, B, C → D
      for (;;) {
        let A, B, C, D, naam;
        if (c === 2) { A = [rnd(-5, -1), rnd(-5, -2)]; const u = [rnd(3, 6), 0 + rnd(-1, 1)], v = [rnd(1, 3), rnd(3, 5)]; B = [A[0] + u[0], A[1] + u[1]]; C = [B[0] + v[0], B[1] + v[1]]; D = [A[0] + v[0], A[1] + v[1]]; naam = "parallellogram"; }
        else if (c === 3) { A = [rnd(-5, -2), rnd(-4, 0)]; const [p, q] = pick([[3, 4], [4, 3], [2, 2], [3, 1], [1, 3]]); B = [A[0] + p, A[1] + q]; C = [B[0] + p, B[1] - q]; D = [A[0] + p, A[1] - q]; naam = "ruit"; }
        else { A = [rnd(-4, 0), rnd(-5, -2)]; const [p, q] = pick([[2, 1], [3, 1], [2, 2], [1, 2]]), k = rnd(1, 2); B = [A[0] + p * 2, A[1] + q * 2]; C = [B[0] - q * k, B[1] + p * k]; D = [A[0] - q * k, A[1] + p * k]; naam = "rechthoek"; }
        if (![A, B, C, D].every((p) => Math.abs(p[0]) <= M && Math.abs(p[1]) <= M)) continue;
        const plot = mk(); plot.poly([A, B, C], "g-open", false); [[A, "A"], [B, "B"], [C, "C"]].forEach(([p, n]) => plot.point(p, n, "g-dot"));
        const sol = mk(); sol.poly([A, B, C, D], "g-sol"); [[A, "A"], [B, "B"], [C, "C"], [D, "D"]].forEach(([p, n]) => sol.point(p, n, "g-dot"));
        return base(this, { mode: "click", instruction: `Maak van ABCD een <b>${naam}</b>: duid het hoekpunt D aan.`, prompt: "", svg: plot.svg(), solutionSvg: sol.svg(), nPts: 1, names: ["D"],
          answerShown: `D(${D[0]}, ${D[1]})`, right: [D], tag: "vierhoeken", chk: (g) => (g && g[0] && eqS(g[0], D) ? { status: "correct" } : { status: "wrong", tag: "vierhoeken", note: `Vanuit C ga je evenwijdig met BA: D(${D[0]}, ${D[1]}).` }) });
      }
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
      return s.ordered ? out : shuffle(out);
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
      out.push({ type, text: `<b>${gr.titel}</b>: ${s.ok}/${s.n} (${p}%) — ${type === "good" ? "goed gekend" : type === "ok" ? "nog even herhalen" : "herhaal de uitleg"} ${gr.p ? ` <small>blad ${gr.p}</small>` : ""}` });
    });
    Object.entries(tags).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => { const g = TAGS[t]; out.push({ type: n >= 2 ? "bad" : "ok", text: `<b>${g.title}</b> (${n}×): ${g.advice}${g.page ? ` <small>blad ${g.page}</small>` : ""}` }); });
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
    id: "wiskunde-5", vak: I.vak, icon: I.icon, theme: I.theme, titel: I.titel, klas: I.klas, bron: I.bron,
    groups: GROUPS.map((g) => ({ id: g.id, short: g.short, titel: g.titel, p: g.p })),
    units: UNITS.map((u) => ({ id: u.id, group: u.group, label: u.label, page: u.page })),
    quick: [
      { label: "Alles", select: () => true },
      { label: "🔢 Toetswijzer getallenkennis", select: (u) => u.group === "G" },
      { label: "🧠 Toetswijzer hoofdrekenen", select: (u) => u.group === "H" },
      { label: "✏️ Toetswijzer cijferen", select: (u) => u.group === "C" },
      { label: "📏 Toetswijzer meten", select: (u) => u.group === "M" },
      { label: "📐 Toetswijzer meetkunde", select: (u) => u.group === "K" },
      { label: "🍰 Breuken", select: (u) => ["gehelen", "breuk", "vereenvoudig", "ordenen", "gelijkwaardig", "getallenas", "optellen", "aftrekken", "breukvan", "breuk_geheel"].includes(u.id) },
      { label: "📐 Hoeken", select: (u) => /^hoek/.test(u.id) },
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
