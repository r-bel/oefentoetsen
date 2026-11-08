// ============================================================
// VAK – Wiskunde 2de middelbaar, Nando 2 – Meetkunde module 01
// Vraaggeneratoren, verbetering en foutanalyse.
// Alle vragen worden telkens opnieuw berekend (geen vaste lijst).
// De teksten en lijsten (begrippen, stellingen, figuren, uitleg, fouttypes)
// staan in inhoud.js – daar stuur je de leerstof bij.
// Elk onderdeel = unit({ id, cases, gen(level, c) }): c kiest het "geval"
// (voor de eindtoets komt elk geval één keer aan bod).
// ============================================================
(function () {
  "use strict";
  const { Plot, box, DEPTH } = window.Geo;
  const I = Vakken.inhoud("wiskunde-2-m01");
  const { DOELEN, BEGRIPPEN, WNW_EIG, WNW_SYM, SYM_BEGR, FIGS, FIGS2, SOLIDS, TAGS } = I;

  // ---------- hulpfuncties ----------
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uniq = (arr, key = (x) => x) => { const s = new Set(); return arr.filter((x) => { const k = key(x); if (s.has(k)) return false; s.add(k); return true; }); };
  const N = (n) => (n < 0 ? "−" + -n : String(n)).replace(".", ",");           // getal met echt minteken en kommagetal
  const P = (p) => `(${N(p[0])}, ${N(p[1])})`;
  const D = (a) => N(a) + "°";
  const eqP = (a, b) => a[0] === b[0] && a[1] === b[1];
  const key = (p) => p[0] + "," + p[1];
  const setKey = (pts) => pts.map(key).sort().join("|");
  const inBox = (p, m) => Math.abs(p[0]) <= m && Math.abs(p[1]) <= m;
  const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // zonder I en O
  const letters = (n, exclude = "") => shuffle([...LETTERS].filter((c) => !exclude.includes(c))).slice(0, n);

  // notatie (HTML)
  const sub = (s) => `<sub>${s}</sub>`;
  const it = (s) => `<i>${s}</i>`;
  const V = (s) => `<span class="vec">${s}</span>`;
  const sAs = (a) => "s" + sub(it(a));
  const sPt = (M) => "s" + sub(M);
  const tV = (XY) => "t" + sub(V(XY));
  const rO = (C, a) => "r" + sub(`(${C}, ${D(a)})`);

  function norm(s) {
    return String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[−–]/g, "-").replace(/[.!?;:'"()]/g, " ").replace(/\b(een|de|het|het\s+de)\b/g, " ")
      .replace(/\s+/g, " ").trim();
  }
  function parseNum(s) {
    const m = String(s ?? "").replace(/[−–]/g, "-").replace(",", ".").match(/-?\s*\d+(\.\d+)?/);
    return m ? parseFloat(m[0].replace(/\s/g, "")) : null;
  }
  function parseCoord(s) {
    const m = String(s ?? "").replace(/[−–]/g, "-").match(/-?\s*\d+/g);
    return m && m.length >= 2 ? [parseInt(m[0].replace(/\s/g, "")), parseInt(m[1].replace(/\s/g, ""))] : null;
  }
  // typen of meerkeuze?
  const typed = (level, p = 0.6) => (level === "easy" ? false : level === "hard" ? true : Math.random() < p);
  const nOpts = (level) => (level === "easy" ? 3 : level === "normal" ? 4 : 5);

  // ---------- transformaties rond de oorsprong ----------
  const TR = {
    sx: { f: ([x, y]) => [x, -y], name: "een spiegeling om de x-as", sym: "s" + sub("x") },
    sy: { f: ([x, y]) => [-x, y], name: "een spiegeling om de y-as", sym: "s" + sub("y") },
    sO: { f: ([x, y]) => [-x, -y], name: "een spiegeling om het punt O", sym: sPt("O") },
    r90: { f: ([x, y]) => [-y, x], name: "een rotatie rond O over 90°", sym: rO("O", 90) },
    rm90: { f: ([x, y]) => [y, -x], name: "een rotatie rond O over −90°", sym: rO("O", -90) },
    r180: { f: ([x, y]) => [-x, -y], name: "een rotatie rond O over 180°", sym: rO("O", 180) },
    sd: { f: ([x, y]) => [y, x], name: "een spiegeling om de rechte d", sym: sAs("d") },
  };
  function pairTag(a, b) {
    const s = new Set([a, b]);
    const has = (x, y) => s.has(x) && s.has(y);
    if (has("sx", "sy")) return "as_verwisseld";
    if (has("r90", "rm90")) return "teken_rotatie";
    if (s.has("sO") && (s.has("sx") || s.has("sy"))) return "punt_vs_as";
    if (s.has("r180") && (s.has("sx") || s.has("sy"))) return "punt_vs_as";
    if (s.has("sd") && (s.has("r90") || s.has("rm90"))) return "coord_omgewisseld";
    if (s.has("t")) return "verwarring";
    return "verwarring";
  }

  // ---------- teken-helpers ----------
  const FIG_COLORS = { orig: "g-orig", img: "g-img", sol: "g-sol" };
  function gridPlot(m = 6, opts = {}) { return new Plot(-m, m, -m, m, { unit: opts.unit || 25, grid: true, axes: true, pad: 20, clickable: opts.clickable }); }

  // ============================================================
  // ONDERDELEN
  // ============================================================
  const UNITS = [];
  const unit = (u) => { Object.assign(u, I.UNITS[u.id]); UNITS.push(u); return u; };
  const base = (u, o) => Object.assign({ unit: u.id, unitLabel: u.label, page: u.page, rule: u.rule, group: u.doel }, o);

  // ---------- D1. Notaties lezen / schrijven ----------
  const NOTA_TYPES = ["as", "punt", "trans", "rotP", "rotN"];
  function notaInstance(type) {
    const axis = pick(["a", "b", "d", "m"]);
    const [X, Y, M, Pp, Qq] = letters(5, axis.toUpperCase());
    const al = pick([30, 40, 45, 60, 70, 75, 80, 90, 105, 120, 135, 150]);
    let sym, symC, ph, phC, tag;
    switch (type) {
      case "as": sym = sAs(axis); symC = sPt(axis.toUpperCase()); ph = `een spiegeling om de as ${it(axis)}`; phC = `een spiegeling om het punt ${axis.toUpperCase()}`; tag = "punt_vs_as"; break;
      case "punt": sym = sPt(M); symC = sAs(M.toLowerCase()); ph = `een spiegeling om het punt ${M}`; phC = `een spiegeling om de as ${it(M.toLowerCase())}`; tag = "punt_vs_as"; break;
      case "trans": sym = tV(Pp + Qq); symC = tV(Qq + Pp); ph = `een translatie over de vector ${V(Pp + Qq)}`; phC = `een translatie over de vector ${V(Qq + Pp)}`; tag = "tegengestelde_vector"; break;
      case "rotP": sym = rO("O", al); symC = rO("O", -al); ph = `een rotatie rond het centrum O over ${al}° in tegenwijzerzin`; phC = `een rotatie rond het centrum O over ${al}° in wijzerzin`; tag = "teken_rotatie"; break;
      case "rotN": sym = rO("O", -al); symC = rO("O", al); ph = `een rotatie rond het centrum O over ${al}° in wijzerzin`; phC = `een rotatie rond het centrum O over ${al}° in tegenwijzerzin`; tag = "teken_rotatie"; break;
    }
    const notation = (swap, conf) => `${conf ? symC : sym}(${swap ? Y : X}) = ${swap ? X : Y}`;
    const sentence = (swap, conf) => `${swap ? X : Y} is het beeld van ${swap ? Y : X} door ${conf ? phC : ph}`;
    return { notation, sentence, tag };
  }
  function notaOptions(level, inst, render) {
    const all = [["00", false, false, null], ["10", true, false, "notatie_volgorde"], ["01", false, true, inst.tag], ["11", true, true, inst.tag]];
    const used = level === "easy" ? all.slice(0, 3) : all;
    const alts = {}; used.forEach(([v, , , t]) => t && (alts[v] = t));
    return { options: shuffle(used.map(([v, s, c]) => ({ v, html: render(s, c) }))), alts };
  }
  const uLezen = unit({
    id: "lezen",
    cases: NOTA_TYPES.length,
    gen(level, c) {
      const inst = notaInstance(NOTA_TYPES[c ?? rnd(0, 4)]);
      const { options, alts } = notaOptions(level, inst, inst.sentence);
      return base(this, { mode: "mc", instruction: "Hoe lees je deze notatie?", prompt: inst.notation(false, false), promptClass: "notation", options, answer: "00", alts, answerShown: inst.sentence(false, false) });
    },
  });
  const uSchrijven = unit({
    id: "schrijven", cases: NOTA_TYPES.length,
    gen(level, c) {
      const inst = notaInstance(NOTA_TYPES[c ?? rnd(0, 4)]);
      const { options, alts } = notaOptions(level, inst, inst.notation);
      options.forEach((o) => (o.cls = "notation"));
      return base(this, { mode: "mc", instruction: "Welke notatie hoort bij deze zin?", prompt: inst.sentence(false, false) + ".", options, answer: "00", alts, answerShown: inst.notation(false, false) });
    },
  });

  // ---------- D1/D2. Begrippen ----------
  function bankQuestion(u, bank, level, c, instruction) {
    const it_ = bank[c ?? rnd(0, bank.length - 1)];
    const show = it_.show || it_.a[0];
    const t = typed(level, 0.5);
    const q = base(u, { instruction, prompt: it_.q, page: it_.p || u.page, answerShown: show });
    if (t) return Object.assign(q, { mode: "text", accepted: it_.a.map(norm) });
    const others = uniq(shuffle(bank.filter((b) => b !== it_).map((b) => b.show || b.a[0])));
    const opts = shuffle([show, ...others.slice(0, nOpts(level) - 1)]);
    return Object.assign(q, { mode: "mc", options: opts.map((o) => ({ v: o, html: o })), answer: show });
  }
  unit({
    id: "begrippen",
    cases: BEGRIPPEN.length,
    gen(level, c) { return bankQuestion(this, BEGRIPPEN, level, c, "Vul het ontbrekende woord in."); },
  });

  // ---------- D1. Transformatie herkennen (figuur → transformatie) ----------
  const SHAPES = [
    [[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [0, 2]],
    [[0, 0], [3, 0], [1, 2]],
    [[0, 0], [3, 0], [2, 2], [0, 1]],
    [[0, 0], [1, 0], [1, 2], [3, 3], [0, 3]],
    [[0, 0], [2, 0], [2, 1], [3, 3], [0, 1]],
  ];
  const SQ_SYM = [(p) => p, (p) => [-p[1], p[0]], (p) => [-p[0], -p[1]], (p) => [p[1], -p[0]], (p) => [-p[0], p[1]], (p) => [p[0], -p[1]], (p) => [p[1], p[0]], (p) => [-p[1], -p[0]]];
  function randomShapeInQuadrant(m) {
    for (let k = 0; k < 200; k++) {
      const s0 = pick(SQ_SYM), sh = pick(SHAPES).map(s0);
      const minx = Math.min(...sh.map((p) => p[0])), miny = Math.min(...sh.map((p) => p[1]));
      const w = Math.max(...sh.map((p) => p[0])) - minx, h = Math.max(...sh.map((p) => p[1])) - miny;
      const qx = pick([1, -1]), qy = pick([1, -1]);
      const ox = qx > 0 ? rnd(1, m - w) : rnd(-m, -1 - w), oy = qy > 0 ? rnd(1, m - h) : rnd(-m, -1 - h);
      const pts = sh.map((p) => [p[0] - minx + ox, p[1] - miny + oy]);
      if (pts.every((p) => inBox(p, m) && p[0] !== 0 && p[1] !== 0)) return pts;
    }
    return SHAPES[0].map((p) => [p[0] + 1, p[1] + 1]);
  }
  function randomVector(m, minLen = 2) {
    for (;;) { const v = [rnd(-4, 4), rnd(-4, 4)]; if (Math.hypot(...v) >= minLen) return v; }
  }
  const HERK = ["sx", "sy", "sO", "r90", "rm90", "t", "sd"];
  unit({
    id: "herkennen",
    cases: 6, casesHard: 7,
    gen(level, c) {
      const pool = level === "hard" ? HERK : HERK.slice(0, 6);
      const correct = pool[c ?? rnd(0, pool.length - 1)];
      const m = 6;
      for (let tries = 0; tries < 400; tries++) {
        const orig = randomShapeInQuadrant(m - 1);
        const v = randomVector(m, 2.5);
        const Xp = [rnd(-5, 5), rnd(-5, 5)], Yp = [Xp[0] + v[0], Xp[1] + v[1]];
        if (!inBox(Yp, 5) || [Xp, Yp].some((p) => p[0] === 0 || p[1] === 0)) continue;
        if ([Xp, Yp].some((p) => orig.some((q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) < 2))) continue;
        const f = (k) => (k === "t" ? (p) => [p[0] + v[0], p[1] + v[1]] : TR[k].f);
        const img = orig.map(f(correct));
        if (!img.every((p) => inBox(p, m)) || setKey(img) === setKey(orig)) continue;
        const keys = [...pool, ...(pool.includes("t") ? [] : ["t"])];
        const distract = shuffle(keys.filter((k) => k !== correct && setKey(orig.map(f(k))) !== setKey(img)));
        const chosen = shuffle([correct, ...distract.slice(0, nOpts(level))]);
        const plot = gridPlot(m);
        if (pool.includes("sd")) plot.line([0, 0], [1, 1], "d", "g-elem dashed");
        plot.vector(Xp, Yp, ["X", "Y"]);
        plot.poly(orig, FIG_COLORS.orig).poly(img, FIG_COLORS.img);
        const lab = (pts, t, cls) => { const c0 = pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length], [0, 0]); plot.label(c0, t, cls, [-4, 5]); };
        lab(orig, "f", "g-figlbl"); lab(img, "f′", "g-figlbl");
        const name = (k) => (k === "t" ? `een translatie over de vector ${V("XY")}` : TR[k].name);
        const alts = {}; chosen.forEach((k) => k !== correct && (alts[k] = pairTag(correct, k)));
        return base(this, {
          mode: "mc", instruction: "Door welke transformatie is de paarse figuur f′ het beeld van de oranje figuur f?",
          prompt: pool.includes("sd") ? "De rechte d is de bissectrice van het eerste kwadrant." : "", svg: plot.svg(),
          options: chosen.map((k) => ({ v: k, html: name(k) })), answer: correct, alts, answerShown: name(correct),
        });
      }
    },
  });

  // ---------- D1. Beeldpunten op een rooster met letters ----------
  const LAT = { cols: 5, rows: 4, V: { a: 1, b: 2, c: 3 }, H: { p: 1, q: 2 } };
  const latL = (c, r) => LETTERS[r * LAT.cols + c];
  const latInRange = ([c, r]) => c >= 0 && c < LAT.cols && r >= 0 && r < LAT.rows;
  const latPos = (L) => { const i = LETTERS.indexOf(L); return [i % LAT.cols, Math.floor(i / LAT.cols)]; };
  function latticePlot() {
    const plot = new Plot(-0.9, 4.9, -3.75, 0.85, { unit: 54, pad: 12 });
    const M = (c, r) => [c, -r];
    Object.entries(LAT.V).forEach(([n, c]) => plot.line(M(c, 0), [0, 1], n, "g-elem"));
    Object.entries(LAT.H).forEach(([n, r]) => plot.line(M(0, r), [1, 0], n, "g-elem"));
    for (let r = 0; r < LAT.rows; r++) for (let c = 0; c < LAT.cols; c++) plot.point(M(c, r), latL(c, r), "g-dot", [5, -6]);
    return plot.svg("lattice");
  }
  const ROOSTER = ["lijnV", "lijnH", "punt", "puntR", "trans", "transR", "rotP", "rotN"];
  unit({
    id: "rooster",
    cases: ROOSTER.length,
    gen(level, c) {
      const type = ROOSTER[c ?? rnd(0, ROOSTER.length - 1)];
      for (let tries = 0; tries < 500; tries++) {
        const Pp = [rnd(0, 4), rnd(0, 3)];
        let f, finv, sym, alt = [];
        if (type === "lijnV") { const n = pick(Object.keys(LAT.V)), c0 = LAT.V[n]; f = ([c, r]) => [2 * c0 - c, r]; finv = f; sym = sAs(n); }
        else if (type === "lijnH") { const n = pick(Object.keys(LAT.H)), r0 = LAT.H[n]; f = ([c, r]) => [c, 2 * r0 - r]; finv = f; sym = sAs(n); }
        else if (type === "punt" || type === "puntR") {
          const Mm = [rnd(1, 3), rnd(1, 2)]; f = ([c, r]) => [2 * Mm[0] - c, 2 * Mm[1] - r]; finv = f; sym = sPt(latL(...Mm));
          alt = [[([c, r]) => [2 * Mm[0] - c, r], "punt_vs_as"], [([c, r]) => [c, 2 * Mm[1] - r], "punt_vs_as"]];
        } else if (type === "trans" || type === "transR") {
          const X = [rnd(0, 4), rnd(0, 3)], Y = [rnd(0, 4), rnd(0, 3)];
          if (eqP(X, Y)) continue;
          const v = [Y[0] - X[0], Y[1] - X[1]];
          f = ([c, r]) => [c + v[0], r + v[1]]; finv = ([c, r]) => [c - v[0], r - v[1]]; sym = tV(latL(...X) + latL(...Y));
          alt = [[finv, "tegengestelde_vector"]];
        } else {
          const Mm = [rnd(1, 3), rnd(1, 2)], sgn = type === "rotP" ? 1 : -1;
          const ccw = ([c, r]) => [Mm[0] + (r - Mm[1]), Mm[1] - (c - Mm[0])];
          const cw = ([c, r]) => [Mm[0] - (r - Mm[1]), Mm[1] + (c - Mm[0])];
          f = sgn > 0 ? ccw : cw; finv = sgn > 0 ? cw : ccw; sym = rO(latL(...Mm), 90 * sgn);
          alt = [[finv, "teken_rotatie"]];
        }
        const reverse = type === "puntR" || type === "transR" || (type.startsWith("lijn") && Math.random() < 0.3);
        const img = f(Pp);
        if (!latInRange(img) || (eqP(img, Pp) && Math.random() < 0.85)) continue;
        // reverse: gegeven het beeld img, gevraagd het origineel Pp
        const given = reverse ? img : Pp, ans = reverse ? Pp : img;
        const altFns = reverse ? alt.map(([g, t]) => [g === finv ? f : g === f ? finv : g, t]) : alt;
        const alts = {};
        altFns.forEach(([g, t]) => { const a = g(given); if (latInRange(a) && !eqP(a, ans)) alts[norm(latL(...a))] = t; });
        if (!eqP(given, ans) && !alts[norm(latL(...given))]) alts[norm(latL(...given))] = "niet_verplaatst";
        const prompt = reverse ? `${sym}(…) = ${latL(...given)}` : `${sym}(${latL(...given)}) = …`;
        const q = base(this, { instruction: reverse ? "Welk punt heeft dit beeld? Vul aan." : "Vul aan met het juiste punt.", prompt, promptClass: "notation", svg: latticePlot(), answerShown: latL(...ans), alts });
        if (typed(level, 0.7)) return Object.assign(q, { mode: "text", accepted: [norm(latL(...ans))], short: true });
        const others = shuffle(Object.keys(alts).map((s) => s.toUpperCase()));
        const randoms = shuffle([...LETTERS.slice(0, 20)].filter((L) => L !== latL(...ans) && !others.includes(L)));
        const opts = shuffle([latL(...ans), ...[...others, ...randoms].slice(0, nOpts(level))]);
        return Object.assign(q, { mode: "mc", options: opts.map((L) => ({ v: norm(L), html: L })), answer: norm(latL(...ans)) });
      }
    },
  });

  // ---------- D1. Rotatiehoeken ----------
  const TABLE_N = [3, 4, 6, 8, 5, 10, 12, 9];
  function tablePlot(n, ia, ib) {
    const plot = new Plot(-2.55, 2.55, -2.55, 2.55, { unit: 44, pad: 8 });
    plot.circle([0, 0], 1.35, "g-table");
    for (let k = 0; k < n; k++) {
      const th = (90 + (k * 360) / n) * Math.PI / 180, p = [1.95 * Math.cos(th), 1.95 * Math.sin(th)];
      const cls = k === ia ? "g-seat a" : k === ib ? "g-seat b" : "g-seat";
      plot.circle(p, 0.3, cls);
      if (k === ia || k === ib) plot.label(p, k === ia ? "A" : "B", "g-seatlbl", [0, 5]);
    }
    plot.dot([0, 0], "g-dot").label([0, 0], "O", "g-lbl", [6, -6]);
    return plot.svg("table");
  }
  unit({
    id: "hoek",
    cases: 6,
    gen(level, c) {
      c = c ?? rnd(0, 5);
      const t = typed(level, 0.7);
      if (c < 4) {
        const n = c === undefined ? pick(TABLE_N) : pick(TABLE_N.slice(c * 2, c * 2 + 2));
        const step = 360 / n, ia = rnd(0, n - 1), k = rnd(1, n - 1), ib = (ia + k) % n;
        let s = k * step; if (s > 180) s -= 360;
        const half = Math.abs(s) === 180;
        const numCheck = (x) => {
          if (x === s || (half && Math.abs(x) === 180)) return { status: "correct" };
          if (Math.abs(((x - s) % 360 + 360) % 360) < 1e-9) return { status: "equiv", note: `Dit klopt, maar korter is ${D(s)}.` };
          if (Math.abs(((x + s) % 360 + 360) % 360) < 1e-9) return { status: "wrong", tag: "teken_rotatie" };
          return { status: "wrong", tag: "hoek_fout" };
        };
        const q = base(this, {
          instruction: "Over welke hoek draai je rond het centrum O om van plaats A naar plaats B te gaan? Kies de kortste draaiing.",
          prompt: `${n} gelijk verdeelde plaatsen · tegenwijzerzin = positief, wijzerzin = negatief`, svg: tablePlot(n, ia, ib),
          answerShown: half ? "180° (of −180°)" : D(s),
        });
        if (t) return Object.assign(q, { mode: "num", numCheck, unitSuffix: "°" });
        const cands = uniq([s, -s, ...[1, 2, 3, -1, -2].map((d) => { let x = (k + d) * step % 360; if (x > 180) x -= 360; if (x <= -180) x += 360; return Math.round(x); })].filter((x) => x !== 0 && !(half && Math.abs(x) === 180 && x !== s)));
        const opts = shuffle([s, ...shuffle(cands.filter((x) => x !== s)).slice(0, nOpts(level))]);
        const alts = {}; if (opts.includes(-s) && -s !== s) alts[String(-s)] = "teken_rotatie";
        return Object.assign(q, { mode: "mc", options: opts.map((x) => ({ v: String(x), html: D(x) })), answer: String(s), alts });
      }
      // gelijkwaardige hoeken
      const neg = c === 4;
      const a = neg ? -pick([30, 45, 60, 75, 90, 120, 135, 150, 210, 240, 270, 300]) : pick([30, 45, 60, 90, 100, 120, 150, 200, 210, 240, 270, 300]);
      const ans = neg ? a + 360 : a - 360;
      const numCheck = (x) => {
        if (x === ans) return { status: "correct" };
        if (x === -a) return { status: "wrong", tag: "teken_rotatie" };
        return { status: "wrong", tag: "hoek_fout" };
      };
      const q = base(this, {
        instruction: `Vul aan met een ${neg ? "positieve hoek (tussen 0° en 360°)" : "negatieve hoek (tussen −360° en 0°)"} zodat beide rotaties hetzelfde beeld geven.`,
        prompt: `${rO("O", a)}(P) = r<sub>(O, …)</sub>(P)`, promptClass: "notation", answerShown: D(ans),
      });
      if (t) return Object.assign(q, { mode: "num", numCheck, unitSuffix: "°" });
      const opts = shuffle(uniq([ans, -a, neg ? 360 - a : -360 - a, a + (neg ? 180 : -180)]).filter((x) => x !== a)).slice(0, nOpts(level));
      if (!opts.includes(ans)) opts[0] = ans;
      return Object.assign(q, { mode: "mc", options: shuffle(opts).map((x) => ({ v: String(x), html: D(x) })), answer: String(ans), alts: { [String(-a)]: "teken_rotatie" } });
    },
  });

  // ---------- D1. Coördinaten van beeldpunten ----------
  const COORD = ["sx", "sy", "sO", "r90", "rm90", "r180", "sd", "t"];
  unit({
    id: "coord",
    cases: COORD.length,
    gen(level, c) {
      const k = COORD[c ?? rnd(0, COORD.length - 1)];
      let A;
      do { A = [rnd(-6, 6), rnd(-6, 6)]; } while (A[0] === 0 || A[1] === 0 || Math.abs(A[0]) === Math.abs(A[1]));
      let ans, prompt, altList = [];
      if (k === "t") {
        const Pp = [rnd(-4, 4), rnd(-4, 4)]; let Qq; do { Qq = [rnd(-5, 5), rnd(-5, 5)]; } while (eqP(Pp, Qq) || Qq[0] === Pp[0] && Math.abs(Qq[1] - Pp[1]) < 2);
        const v = [Qq[0] - Pp[0], Qq[1] - Pp[1]];
        ans = [A[0] + v[0], A[1] + v[1]];
        prompt = `co(A) = ${P(A)}<br>co(P) = ${P(Pp)} en co(Q) = ${P(Qq)}<br>A′ = ${tV("PQ")}(A). Bereken co(A′).`;
        altList = [[[A[0] - v[0], A[1] - v[1]], "tegengestelde_vector"], [[A[0] + Qq[0], A[1] + Qq[1]], "translatie_fout"], [[ans[1], ans[0]], "coord_omgewisseld"]];
      } else {
        ans = TR[k].f(A);
        prompt = `co(A) = ${P(A)}<br>A′ = ${TR[k].sym}(A). Bereken co(A′).` + (k === "sd" ? `<br><small>d is de bissectrice van het eerste kwadrant (de rechte y = x).</small>` : "");
        Object.keys(TR).forEach((j) => { if (j !== k) altList.push([TR[j].f(A), pairTag(k, j)]); });
        altList.push([[ans[1], ans[0]], "coord_omgewisseld"]);
      }
      altList.push([[ans[0], -ans[1]], "teken_fout"], [[-ans[0], ans[1]], "teken_fout"], [A, "niet_verplaatst"]);
      altList = uniq(altList.filter(([p]) => !eqP(p, ans)), ([p]) => key(p));
      const q = base(this, { instruction: "Bereken de coördinaat van het beeldpunt (zonder tekening).", prompt, answerShown: P(ans) });
      if (typed(level, 0.75)) return Object.assign(q, { mode: "coord", answer: ans, alts: altList.map(([p, t]) => ({ p, tag: t })) });
      const opts = shuffle([[ans, null], ...shuffle(altList.filter(([, t]) => t !== "niet_verplaatst")).slice(0, nOpts(level))]);
      const alts = {}; opts.forEach(([p, t]) => t && (alts[key(p)] = t));
      return Object.assign(q, { mode: "mc", options: opts.map(([p]) => ({ v: key(p), html: P(p) })), answer: key(ans), alts });
    },
  });

  // ---------- D1. Beeld construeren (klikken op het rooster) ----------
  function insideTri(p, [a, b, c]) {
    const sg = (u, v, w) => (u[0] - w[0]) * (v[1] - w[1]) - (v[0] - w[0]) * (u[1] - w[1]);
    const d1 = sg(p, a, b), d2 = sg(p, b, c), d3 = sg(p, c, a);
    return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
  }
  const TEK = ["asV", "asH", "asD", "punt", "trans", "rotP", "rotN"];
  function tekenSetup(type, m) {
    // geeft { f, draw(plot), sym, alts: [{f, tag}], perp? }
    if (type === "asV") { const k = rnd(-3, 3); return { f: ([x, y]) => [2 * k - x, y], draw: (p) => p.line([k, 0], [0, 1], "a"), rule: I.TEKEN_REGELS.as, sym: sAs("a"), axisDir: [0, 1], onAxis: (p) => p[0] === k }; }
    if (type === "asH") { const k = rnd(-3, 3); return { f: ([x, y]) => [x, 2 * k - y], draw: (p) => p.line([0, k], [1, 0], "a"), rule: I.TEKEN_REGELS.as, sym: sAs("a"), axisDir: [1, 0], onAxis: (p) => p[1] === k }; }
    if (type === "asD") { const k = rnd(-2, 2), s = pick([1, -1]); // y = s·x + k
      const f = s === 1 ? ([x, y]) => [y - k, x + k] : ([x, y]) => [k - y, k - x];
      return { f, draw: (p) => p.line([0, k], [1, s], "a"), rule: I.TEKEN_REGELS.as, sym: sAs("a"), axisDir: [1, s], onAxis: (p) => p[1] === s * p[0] + k }; }
    if (type === "punt") { const M = [rnd(-2, 2), rnd(-2, 2)];
      return { f: ([x, y]) => [2 * M[0] - x, 2 * M[1] - y], center: M, draw: (p) => p.point(M, "M", "g-center"), rule: I.TEKEN_REGELS.punt, sym: sPt("M"), onAxis: (p) => eqP(p, M),
        alts: [{ f: ([x, y]) => [2 * M[0] - x, y], tag: "punt_vs_as" }, { f: ([x, y]) => [x, 2 * M[1] - y], tag: "punt_vs_as" }] }; }
    if (type === "trans") { const v = randomVector(m, 2.5); let X; do { X = [rnd(-m, m), rnd(-m, m)]; } while (!inBox([X[0] + v[0], X[1] + v[1]], m));
      return { f: ([x, y]) => [x + v[0], y + v[1]], draw: (p) => p.vector(X, [X[0] + v[0], X[1] + v[1]], ["X", "Y"]), rule: I.TEKEN_REGELS.trans, sym: tV("XY"), onAxis: () => false,
        alts: [{ f: ([x, y]) => [x - v[0], y - v[1]], tag: "tegengestelde_vector" }] }; }
    const M = [rnd(-2, 2), rnd(-2, 2)], ccw = ([x, y]) => [M[0] - (y - M[1]), M[1] + (x - M[0])], cw = ([x, y]) => [M[0] + (y - M[1]), M[1] - (x - M[0])];
    const pos = type === "rotP";
    return { f: pos ? ccw : cw, center: M, draw: (p) => p.point(M, "M", "g-center"), rule: I.TEKEN_REGELS.rot, sym: rO("M", pos ? 90 : -90), onAxis: (p) => eqP(p, M),
      alts: [{ f: pos ? cw : ccw, tag: "teken_rotatie" }, { f: ([x, y]) => [2 * M[0] - x, 2 * M[1] - y], tag: "hoek_fout" }] };
  }
  unit({
    id: "tekenen",
    cases: TEK.length,
    gen(level, c) {
      const type = TEK[c ?? rnd(0, TEK.length - 1)];
      const m = 5, nPts = level === "hard" ? 3 : 1, names = ["A", "B", "C"].slice(0, nPts);
      for (let tries = 0; tries < 500; tries++) {
        const S = tekenSetup(type, m);
        const pts = [];
        while (pts.length < nPts) { const p = [rnd(-4, 4), rnd(-4, 4)]; if (!pts.some((q) => eqP(p, q))) pts.push(p); }
        if (nPts === 3) { const [a, b, cc] = pts; const area = (b[0] - a[0]) * (cc[1] - a[1]) - (b[1] - a[1]) * (cc[0] - a[0]); if (Math.abs(area) < 4) continue; }
        if (pts.some(S.onAxis)) continue;
        if (S.center && pts.some((p) => Math.abs(p[0] - S.center[0]) + Math.abs(p[1] - S.center[1]) < 2)) continue;
        if (S.center && nPts === 3 && insideTri(S.center, pts)) continue;
        const img = pts.map(S.f);
        if (!img.every((p) => inBox(p, m))) continue;
        if (img.some((p) => pts.some((q) => eqP(p, q)))) continue;
        const draw = (extra) => {
          const plot = gridPlot(m, { unit: 27, clickable: !extra && level !== "easy" });
          S.draw(plot);
          if (nPts === 3) plot.poly(pts, FIG_COLORS.orig);
          pts.forEach((p, i) => plot.point(p, names[i], "g-dot"));
          if (extra) extra(plot);
          return plot.svg();
        };
        const altSets = (S.alts || []).map((a) => ({ pts: pts.map(a.f), tag: a.tag })).filter((a) => a.pts.every((p) => inBox(p, m)));
        const solution = draw((plot) => { if (nPts === 3) plot.poly(img, FIG_COLORS.sol); img.forEach((p, i) => plot.point(p, names[i] + "′", "g-soldot")); });
        const what = nPts === 3 ? `het beeld van driehoek ABC: klik de 3 hoekpunten A′, B′ en C′ aan` : "het beeld A′ van het punt A";
        const symTxt = nPts === 3 ? `${S.sym}(ΔABC) = ΔA′B′C′` : `${S.sym}(A) = A′`;
        const q = base(this, { rule: S.rule, instruction: `Zoek ${what}.`, prompt: symTxt, promptClass: "notation", answerShown: img.map((p, i) => names[i] + "′" + P(p)).join(" "), solutionSvg: solution });
        if (level !== "easy") return Object.assign(q, { mode: "click", svg: draw(), nPts, names: names.map((n) => n + "′"), targets: img, altSets, axisDir: S.axisDir, origPts: pts });
        // makkelijk: kies tussen genummerde kandidaten
        const cand = uniq([img[0], ...altSets.map((a) => a.pts[0]), ...shuffle([[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, -1]]).map((d) => [img[0][0] + d[0], img[0][1] + d[1]])]
          .filter((p) => inBox(p, m) && !eqP(p, pts[0])), key).slice(0, 4);
        const order = shuffle(cand);
        const svg = draw((plot) => order.forEach((p, i) => plot.point(p, String(i + 1), "g-cand", [5, -6])));
        const alts = {}; altSets.forEach((a) => (alts[key(a.pts[0])] = a.tag));
        return Object.assign(q, { mode: "mc", svg, options: order.map((p, i) => ({ v: key(p), html: `Punt ${i + 1}` })), answer: key(img[0]), alts, answerShown: `A′${P(img[0])}` });
      }
    },
  });

  // ---------- D2. Eigenschappen ----------
  const T4 = ["een spiegeling om een as", "een translatie", "een rotatie", "een puntspiegeling"];
  const EIG = 9;
  unit({
    id: "eigenschappen",
    cases: EIG,
    gen(level, c) {
      c = c ?? rnd(0, EIG - 1);
      const T = pick(T4), t = typed(level, 0.6);
      const mcq = (instruction, prompt, correct, wrong, alts = {}) => base(this, { mode: "mc", instruction, prompt, options: shuffle([correct, ...shuffle(wrong).slice(0, nOpts(level))]).map((o) => ({ v: o, html: o })), answer: correct, answerShown: correct, alts });
      const numq = (prompt, val, unitTxt, wrong) => {
        const q = base(this, { instruction: "Gebruik de eigenschappen van transformaties.", prompt, answerShown: N(val) + " " + unitTxt });
        if (t) return Object.assign(q, { mode: "num", unitSuffix: unitTxt, numCheck: (x) => (Math.abs(x - val) < 1e-9 ? { status: "correct" } : { status: "wrong", tag: "eigenschap" }) });
        return mcq(q.instruction, prompt, N(val) + " " + unitTxt, uniq(wrong.filter((w) => w !== val)).map((w) => N(w) + " " + unitTxt));
      };
      switch (c) {
        case 0: { const L = rnd(3, 12) + pick([0, 0.5]); return numq(`|AB| = ${N(L)} cm. [A′B′] is het beeld van [AB] door ${T}. Hoe lang is [A′B′]?`, L, "cm", [L * 2, L / 2, L + 1, L - 1]); }
        case 1: { const a = rnd(20, 160); return numq(`De hoek ABC is ${a}°. A′B′C′ is het beeld door ${T}. Hoe groot is de hoek A′B′C′?`, a, "°", [180 - a, 360 - a, 90, a + 10]); }
        case 2: { const A = rnd(6, 40); return numq(`Een driehoek heeft een oppervlakte van ${A} cm². Hoe groot is de oppervlakte van zijn beeld door ${T}?`, A, "cm²", [A * 2, A / 2, A + 4]); }
        case 3: return mcq("Kies het juiste antwoord.", "Bij welke transformaties is het beeld van een rechte altijd evenwijdig met die rechte?", "een translatie en een puntspiegeling",
          ["bij alle vier de transformaties", "een spiegeling om een as en een rotatie", "enkel een translatie", "enkel een puntspiegeling", "bij geen enkele transformatie"]);
        case 4: return mcq("Kies het juiste antwoord.", `A, B en C liggen op één rechte (ze zijn collineair). A′, B′ en C′ zijn hun beelden door ${T}. Wat weet je over A′, B′ en C′?`, "ze zijn altijd collineair",
          ["ze zijn nooit collineair", "ze zijn enkel collineair bij een translatie", "ze vormen een driehoek"]);
        case 5: return mcq("Kies het juiste antwoord.", "Welke transformatie is géén isometrie (de vorm of grootte verandert)?", "een homothetie", ["een spiegeling om een as", "een translatie", "een rotatie", "een puntspiegeling"]);
        case 6: { const ab = rnd(3, 9), ac = ab + rnd(2, 6);
          return mcq("Kies het juiste antwoord.", `A, B en C liggen op de rechte a. |AB| = ${ab} en |AC| = ${ac}. s<sub>A</sub>([BC]) = [B′C′]. Welke waarden zijn mogelijk voor |B′C′|?`,
            `${ac - ab} of ${ac + ab}`, [`enkel ${ac - ab}`, `enkel ${ac + ab}`, `${ab} of ${ac}`, `${2 * ab} of ${2 * ac}`]); }
        case 7: return mcq("Kies het juiste antwoord.", `De rechten a en b staan loodrecht op elkaar. a′ en b′ zijn hun beelden door ${T}. Wat geldt er?`, "a′ ⊥ b′", ["a′ // b′", "a′ = a", "dat hangt af van de transformatie"]);
        default: { const T2 = pick(["een translatie", "een puntspiegeling"]);
          return mcq("Kies het juiste antwoord.", `De rechte a′ is het beeld van de rechte a door ${T2}. Wat geldt er altijd?`, "a′ // a", ["a′ ⊥ a", "a′ snijdt a", "a′ = a"]); }
      }
    },
  });

  // ---------- Waar of niet waar ----------
  function wnw(u, bank, c) {
    const [s, val, why] = bank[c ?? rnd(0, bank.length - 1)];
    return base(u, { mode: "mc", instruction: "Waar of niet waar?", prompt: s, options: [{ v: "waar", html: "✔ Waar" }, { v: "niet waar", html: "✘ Niet waar" }], answer: val ? "waar" : "niet waar", answerShown: (val ? "Waar" : "Niet waar") + ". " + why, rule: why });
  }
  unit({ id: "wnw_eig", cases: WNW_EIG.length, gen(level, c) { return wnw(this, WNW_EIG, c); } });

  // ---------- D3. Symmetrie bij vlakke figuren ----------
  function figSvg(F) {
    const plot = new Plot(-2.3, 2.3, -2, 2, { unit: 40, pad: 10 });
    if (F.circle) { plot.circle([0, 0], 1.6, "g-orig"); plot.dot([0, 0], "g-dot", 2.5); }
    else if (F.strokes) F.strokes.forEach((s) => plot.poly(s, "g-letter", false));
    else plot.poly(F.pts, "g-orig");
    return plot.svg("small");
  }
  const axTxt = (n) => (n === Infinity ? "oneindig veel" : String(n));
  function symQuestion(u, F, ask, level) {
    const q = base(u, { svg: figSvg(F), prompt: `Dit is <b>${F.name}</b>.`, itemLabel: `${F.name}: ${ask === "mp" ? "symmetriemiddelpunt?" : "aantal symmetrieassen"}` });
    if (ask === "mp") return Object.assign(q, { mode: "mc", instruction: "Is deze figuur spiegelsymmetrisch om een punt (heeft ze een symmetriemiddelpunt)?",
      options: [{ v: "ja", html: "Ja" }, { v: "nee", html: "Nee" }], answer: F.mp ? "ja" : "nee", answerShown: F.mp ? "Ja" : "Nee", tag: "sym_middelpunt" });
    Object.assign(q, { instruction: "Hoeveel symmetrieassen heeft deze figuur?", answerShown: axTxt(F.ax), tag: F.tag || "sym_assen" });
    if (typed(level, 0.6)) return Object.assign(q, { mode: "text", short: true, accepted: F.ax === Infinity ? ["oneindig", "oneindig veel", "∞", "oneindig veel assen", "oneindig veel symmetrieassen"].map(norm) : [String(F.ax), String(F.ax) + " assen", String(F.ax) + " symmetrieassen"].map(norm), helpers: ["∞"] });
    const pool = uniq([F.ax, 0, 1, 2, 3, 4, F.ax === Infinity ? 1 : F.ax + 1, Infinity]).filter((x) => x !== F.ax);
    const opts = shuffle([F.ax, ...shuffle(pool).slice(0, nOpts(level))]);
    return Object.assign(q, { mode: "mc", options: opts.map((x) => ({ v: axTxt(x), html: axTxt(x) })), answer: axTxt(F.ax) });
  }
  unit({
    id: "sym_figuren",
    cases: FIGS.length * 2,
    gen(level, c) { c = c ?? rnd(0, FIGS.length * 2 - 1); return symQuestion(this, FIGS[c % FIGS.length], c < FIGS.length ? "ax" : "mp", level); },
  });
  unit({
    id: "sym_overig",
    cases: FIGS2.length * 2,
    gen(level, c) { c = c ?? rnd(0, FIGS2.length * 2 - 1); return symQuestion(this, FIGS2[c % FIGS2.length], c < FIGS2.length ? "ax" : "mp", level); },
  });

  // ---------- D3. Ruimtefiguren ----------
  function solidSvg(kind) {
    const plot = new Plot(-0.3, 4.3, -0.3, 3.6, { unit: 44, pad: 8 });
    const d = (z) => [DEPTH[0] * z, DEPTH[1] * z];
    switch (kind) {
      case "kubus": box(plot, 2.2, 2.2, 2.2, [0.3, 0]); break;
      case "balk": box(plot, 3, 1.3, 1.9, [0, 0.2]); break;
      case "balkV": box(plot, 1.4, 2.6, 1.6, [0.8, 0]); break;
      case "prisma": { const z = d(2.6), o = [0.1, 0.1], T = [[0, 0], [1.8, 0], [0.9, 1.56]].map((p) => [p[0] + o[0], p[1] + o[1]]), B = T.map((p) => [p[0] + z[0], p[1] + z[1]]);
        plot.poly(T, "g-solid"); plot.seg(T[1], B[1], "g-solid").seg(T[2], B[2], "g-solid").seg(B[1], B[2], "g-solid");
        plot.seg(T[0], B[0], "g-hidden").seg(B[0], B[1], "g-hidden").seg(B[0], B[2], "g-hidden"); break; }
      case "cilinder": { const c0 = [2, 0.45], c1 = [2, 3.05], rx = 1.3, ry = 0.4;
        plot.ellipse(c1, rx, ry); plot.arcE(c0, rx, ry, Math.PI, 2 * Math.PI); plot.arcE(c0, rx, ry, 0, Math.PI, "g-hidden");
        plot.seg([c0[0] - rx, c0[1]], [c1[0] - rx, c1[1]], "g-solid").seg([c0[0] + rx, c0[1]], [c1[0] + rx, c1[1]], "g-solid"); break; }
      case "kegel": { const c0 = [2, 0.5], rx = 1.4, ry = 0.42, top = [2, 3.3];
        plot.arcE(c0, rx, ry, Math.PI, 2 * Math.PI); plot.arcE(c0, rx, ry, 0, Math.PI, "g-hidden");
        plot.seg([c0[0] - rx, c0[1]], top, "g-solid").seg([c0[0] + rx, c0[1]], top, "g-solid"); break; }
      case "bol": { const c0 = [2, 1.65], r = 1.55;
        plot.circle(c0, r, "g-solid"); plot.arcE(c0, r, 0.42, Math.PI, 2 * Math.PI); plot.arcE(c0, r, 0.42, 0, Math.PI, "g-hidden"); plot.dot(c0, "g-dot", 2.5); break; }
      case "piramide": { const z = d(2.2), o = [0.4, 0.2], A = o, B = [o[0] + 2.4, o[1]], C = [B[0] + z[0], B[1] + z[1]], E = [A[0] + z[0], A[1] + z[1]];
        const S = [(A[0] + C[0]) / 2, 3.4];
        plot.seg(A, B, "g-solid").seg(B, C, "g-solid").seg(C, E, "g-hidden").seg(E, A, "g-hidden");
        plot.seg(A, S, "g-solid").seg(B, S, "g-solid").seg(C, S, "g-solid").seg(E, S, "g-hidden"); break; }
    }
    return plot.svg("small");
  }
  unit({
    id: "sym_ruimte",
    cases: SOLIDS.length * 2,
    gen(level, c) {
      c = c ?? rnd(0, SOLIDS.length * 2 - 1);
      const S = SOLIDS[c % SOLIDS.length], q = base(this, { svg: solidSvg(S.kind), prompt: `Dit is <b>${S.name}</b>.`, itemLabel: `${S.name}: ${c >= SOLIDS.length ? "symmetriemiddelpunt?" : "aantal symmetrievlakken"}` });
      if (c >= SOLIDS.length) return Object.assign(q, { mode: "mc", instruction: "Is deze ruimtefiguur spiegelsymmetrisch om een punt (heeft ze een symmetriemiddelpunt)?",
        options: [{ v: "ja", html: "Ja" }, { v: "nee", html: "Nee" }], answer: S.mp ? "ja" : "nee", answerShown: S.mp ? "Ja" : "Nee", tag: "sym_middelpunt" });
      Object.assign(q, { instruction: "Hoeveel symmetrievlakken heeft deze ruimtefiguur?", answerShown: axTxt(S.vl), tag: "sym_vlakken" });
      if (typed(level, 0.6)) return Object.assign(q, { mode: "text", short: true, helpers: ["∞"], accepted: S.vl === Infinity ? ["oneindig", "oneindig veel", "∞"].map(norm) : [String(S.vl)] });
      const pool = uniq([3, 4, 5, 6, 9, 2, Infinity, 1]).filter((x) => x !== S.vl);
      const opts = shuffle([S.vl, ...shuffle(pool).slice(0, nOpts(level))]);
      return Object.assign(q, { mode: "mc", options: opts.map((x) => ({ v: axTxt(x), html: axTxt(x) })), answer: axTxt(S.vl) });
    },
  });
  unit({
    id: "sym_begrippen",
    cases: SYM_BEGR.length + WNW_SYM.length,
    gen(level, c) {
      c = c ?? rnd(0, SYM_BEGR.length + WNW_SYM.length - 1);
      return c < SYM_BEGR.length ? bankQuestion(this, SYM_BEGR, level, c, "Vul het ontbrekende woord in.") : wnw(this, WNW_SYM, c - SYM_BEGR.length);
    },
  });

  // ============================================================
  // TOETS SAMENSTELLEN
  // ============================================================
  const caseCount = (u, level) => (level === "hard" && u.casesHard) || u.cases;
  // naam per geval (voor "Mijn voortgang": wat blijft moeilijk?)
  const CASE_NAMES = {
    lezen: ["spiegeling om een as", "puntspiegeling", "translatie", "rotatie (positieve hoek)", "rotatie (negatieve hoek)"],
    schrijven: ["spiegeling om een as", "puntspiegeling", "translatie", "rotatie (positieve hoek)", "rotatie (negatieve hoek)"],
    herkennen: ["spiegeling om de x-as", "spiegeling om de y-as", "puntspiegeling om O", "rotatie over 90°", "rotatie over −90°", "translatie", "spiegeling om y = x"],
    rooster: ["spiegeling om een verticale as", "spiegeling om een horizontale as", "puntspiegeling", "puntspiegeling (origineel zoeken)", "translatie", "translatie (origineel zoeken)", "rotatie over 90°", "rotatie over −90°"],
    hoek: ["draaihoek tussen plaatsen (3-4)", "draaihoek tussen plaatsen (6-8)", "draaihoek tussen plaatsen (5-10)", "draaihoek tussen plaatsen (9-12)", "gelijkwaardige hoek (negatief → positief)", "gelijkwaardige hoek (positief → negatief)"],
    coord: ["spiegeling om de x-as", "spiegeling om de y-as", "puntspiegeling om O", "rotatie over 90°", "rotatie over −90°", "rotatie over 180°", "spiegeling om y = x", "translatie"],
    tekenen: ["spiegeling om een verticale as", "spiegeling om een horizontale as", "spiegeling om een schuine as", "puntspiegeling", "translatie", "rotatie over 90°", "rotatie over −90°"],
    eigenschappen: ["lengte blijft behouden", "hoekgrootte blijft behouden", "oppervlakte blijft behouden", "beeld van een rechte evenwijdig?", "collineariteit", "wat is een isometrie?", "|B′C′| bij puntspiegeling", "loodrechte stand", "translatie/puntspiegeling: a′ // a"],
  };
  function finalize(u, q, c) {
    if (!q) return q;
    const nm = CASE_NAMES[u.id] && CASE_NAMES[u.id][c];
    return Object.assign(q, { caseIdx: c, key: `${u.id}:${c}`, itemLabel: q.itemLabel || (nm ? `${u.label}: ${nm}` : undefined) });
  }

  function makeQuiz(s) {
    const units = UNITS.filter((u) => s.units.includes(u.id));
    if (!units.length) return [];
    const out = [];
    if (s.count === "all") {
      units.forEach((u) => { for (let c = 0; c < caseCount(u, s.level); c++) { const q = finalize(u, u.gen(s.level, c), c); if (q) out.push(q); } });
      return shuffle(out);
    }
    const decks = {};
    const draw = (u) => { if (!decks[u.id] || !decks[u.id].length) decks[u.id] = shuffle([...Array(caseCount(u, s.level)).keys()]); return decks[u.id].pop(); };
    let order = shuffle(units);
    for (let i = 0; out.length < s.count && i < s.count * 3; i++) {
      if (i % order.length === 0 && i) order = shuffle(units);
      const u = order[i % order.length];
      const c = draw(u), q = finalize(u, u.gen(s.level, c), c);
      if (q) out.push(q);
    }
    return shuffle(out);
  }
  // nieuwe vraag van hetzelfde soort (voor "oefen opnieuw")
  function regen(q, level) { const u = UNITS.find((x) => x.id === q.unit); return finalize(u, u.gen(level, q.caseIdx), q.caseIdx) || q; }
  function fromKey(key, level) {
    const [id, c] = key.split(":"), u = UNITS.find((x) => x.id === id), ci = +c;
    if (!u || isNaN(ci) || ci >= caseCount(u, level)) return null;
    return finalize(u, u.gen(level, ci), ci);
  }
  const countAll = (s) => UNITS.filter((u) => s.units.includes(u.id)).reduce((a, u) => a + caseCount(u, s.level), 0);

  // ============================================================
  // VERBETEREN
  // ============================================================
  function check(given, q, level) {
    let r;
    if (q.mode === "mc") {
      r = given === q.answer ? { status: "correct" } : { status: "wrong", tag: (q.alts && q.alts[given]) || q.tag || "fout" };
    } else if (q.mode === "text") {
      const g = norm(given);
      r = q.accepted.includes(g) ? { status: "correct" } : { status: "wrong", tag: (q.alts && q.alts[g]) || q.tag || "fout" };
    } else if (q.mode === "num") {
      const x = parseNum(given);
      r = x === null ? { status: "wrong", tag: "fout" } : q.numCheck(x);
    } else if (q.mode === "coord") {
      const p = parseCoord(given);
      if (!p) r = { status: "wrong", tag: "fout" };
      else if (eqP(p, q.answer)) r = { status: "correct" };
      else { const a = q.alts.find((x) => eqP(x.p, p)); r = { status: "wrong", tag: a ? a.tag : "fout" }; }
    } else if (q.mode === "click") {
      const pts = given || [];
      if (pts.length === q.nPts && setKey(pts) === setKey(q.targets)) r = { status: "correct" };
      else {
        const a = q.altSets.find((x) => setKey(x.pts) === setKey(pts));
        let tag = a ? a.tag : "fout";
        if (!a && q.axisDir && pts.length) {
          // loodrecht op de as, maar verkeerde afstand?
          const perp = pts.every((p, i) => { const o = q.origPts[i] || q.origPts[0]; const d = [p[0] - o[0], p[1] - o[1]]; return d[0] * q.axisDir[0] + d[1] * q.axisDir[1] === 0; });
          if (perp) tag = "afstand_as";
        }
        if (!a && pts.length && q.origPts && setKey(pts) === setKey(q.origPts)) tag = "niet_verplaatst";
        r = { status: "wrong", tag };
      }
    }
    r.points = r.status === "correct" ? 1 : r.status === "equiv" ? (level === "hard" ? 0 : 1) : 0;
    return r;
  }

  // ============================================================
  // FOUTANALYSE (vak-specifiek deel van "Wat zeggen je fouten?")
  // ============================================================
  function conclusions(results) {
    const byDoel = {}, tags = {}, modes = { mc: [0, 0], typed: [0, 0] };
    results.forEach((r) => {
      const d = (byDoel[r.q.group] = byDoel[r.q.group] || { ok: 0, n: 0 }); d.n++; d.ok += r.points;
      const m = r.q.mode === "mc" ? modes.mc : modes.typed; m[1]++; m[0] += r.points;
      if (r.status === "wrong" && r.tag && TAGS[r.tag]) tags[r.tag] = (tags[r.tag] || 0) + 1;
    });
    const out = [];
    DOELEN.forEach((d) => {
      const s = byDoel[d.id]; if (!s) return;
      const p = Math.round((s.ok / s.n) * 100);
      const type = p >= 85 ? "good" : p >= 60 ? "ok" : "bad";
      out.push({ type, text: `<b>${d.titel}</b>: ${s.ok}/${s.n} (${p}%) — ${type === "good" ? "goed gekend" : type === "ok" ? "nog even herhalen" : "herhaal de theorie"} <small>p.${d.p}</small>` });
    });
    Object.entries(tags).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => {
      const g = TAGS[t];
      out.push({ type: n >= 2 ? "bad" : "ok", text: `<b>${g.title}</b> (${n}×): ${g.advice}${g.page ? ` <small>p.${g.page}</small>` : ""}` });
    });
    if (modes.mc[1] >= 3 && modes.typed[1] >= 3) {
      const pm = modes.mc[0] / modes.mc[1], pt = modes.typed[0] / modes.typed[1];
      if (pm - pt >= 0.25) out.push({ type: "ok", text: `Meerkeuze lukt beter (${Math.round(pm * 100)}%) dan zelf invullen of tekenen (${Math.round(pt * 100)}%). Je herkent het juiste antwoord, maar kan het nog niet zelf vinden: oefen op <i>moeilijk</i>.` });
    }
    if (results.length && results.every((r) => r.status === "correct")) out.unshift({ type: "good", text: "Foutloos! 🎉" });
    return out;
  }

  // ============================================================
  // Aansluiting op de gedeelde app (zie js/core/vakken.js)
  // ============================================================
  Vakken.register({
    id: "wiskunde-2-m01", vak: I.vak, icon: I.icon, theme: I.theme, titel: I.titel, klas: I.klas, bron: I.bron,
    groups: DOELEN.map((d) => ({ id: d.id, short: d.id, titel: d.titel, p: d.p })),
    units: UNITS.map((u) => ({ id: u.id, group: u.doel, label: u.label, page: u.page })),
    quick: [
      { label: "Alles", select: () => true },
      ...DOELEN.map((d) => ({ label: { D1: "🔄 ", D2: "📏 ", D3: "🦋 " }[d.id] + d.titel.replace(" van het vlak", "").replace(" van transformaties", ""), select: (u) => u.group === d.id })),
    ],
    settings: [],
    levels: I.levels, allInfo: I.allInfo,
    tags: TAGS,
    makeQuiz, countAll, check, conclusions, regen, fromKey,
    _UNITS: UNITS, norm, parseCoord, parseNum, // voor tests
  });
})();
