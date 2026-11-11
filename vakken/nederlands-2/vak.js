// ============================================================
// VAK – Nederlands 2de middelbaar · vragende voornaamwoorden en het telwoord
// Oefenvormen zoals in het werkboek:
//   les 6: het juiste vragend voornaamwoord invullen · V of X (is het een vragend vnw?) ·
//          de vraag kiezen bij een antwoord met een gemarkeerd deel
//   les 7: soort telwoord aankruisen (4 kolommen) · bepaald/onbepaald · hoofd/rang ·
//          het telwoord in de zin aanduiden · telwoorden voluit schrijven · spelling
// Telwoorden voluit worden telkens nieuw berekend (numberToWords).
// ============================================================
(function () {
  "use strict";
  const I = Vakken.inhoud("nederlands-2");
  const { VVN_INVUL, VVN_HERKEN, VVN_VRAAG, TELWOORD_ZINNEN, SOORT_NAAM, SPELLING, BEGRIPPEN, TAGS } = I;

  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uniq = (a) => [...new Set(a)];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const typed = (level, p = 0.5) => (level === "easy" ? false : level === "hard" ? true : Math.random() < p);
  const nOpts = (level) => (level === "easy" ? 3 : 4);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const mark = (z) => esc(z).replace(/\[([^\]]+)\]/, "<u><b>$1</b></u>");
  const plain = (z) => z.replace(/\[([^\]]+)\]/, "$1");

  // ============================================================
  // TELWOORDEN VOLUIT (volgens de spellingregels van de les)
  //   aan elkaar tot duizend · spatie na duizend · miljoen/miljard apart · trema (tweeëntwintig)
  //   rangtelwoord: eerste…negentiende op -de (eerste, achtste), vanaf twintig -ste
  // ============================================================
  const EEN = ["nul", "een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien", "elf", "twaalf", "dertien", "veertien", "vijftien", "zestien", "zeventien", "achttien", "negentien"];
  const TIEN = ["", "", "twintig", "dertig", "veertig", "vijftig", "zestig", "zeventig", "tachtig", "negentig"];
  const ORD = ["", "eerste", "tweede", "derde", "vierde", "vijfde", "zesde", "zevende", "achtste", "negende", "tiende", "elfde", "twaalfde", "dertiende", "veertiende", "vijftiende", "zestiende", "zeventiende", "achttiende", "negentiende"];
  function w100(n) {
    if (n < 20) return EEN[n];
    const t = Math.floor(n / 10), e = n % 10;
    if (!e) return TIEN[t];
    const u = EEN[e];
    return u + (/e$/.test(u) ? "ën" : "en") + TIEN[t]; // tweeëntwintig, drieëntwintig
  }
  function w1000(n) {
    const h = Math.floor(n / 100), r = n % 100;
    return (h ? (h === 1 ? "honderd" : EEN[h] + "honderd") : "") + (r ? w100(r) : "");
  }
  function words(n) {
    if (n === 0) return "nul";
    const parts = [];
    const mil = Math.floor(n / 1e6), dz = Math.floor((n % 1e6) / 1000), rest = n % 1000;
    if (mil) parts.push(w1000(mil) + " miljoen");
    if (dz) parts.push((dz === 1 ? "" : w1000(dz)) + "duizend");
    if (rest) parts.push(w1000(rest));
    return parts.join(" ");
  }
  function ordinal(n) {
    const r = n % 100, base = n - r;
    if (r === 0) return words(n) + "ste";
    const pre = base ? words(base) : "";
    const end = r < 20 ? ORD[r] : w100(r) + "ste";
    if (!pre) return end;
    return pre + (/(duizend|miljoen)$/.test(pre) ? " " : "") + end;
  }
  const NOEMER = { 3: "derde", 4: "vierde", 5: "vijfde", 6: "zesde", 7: "zevende", 8: "achtste", 10: "tiende" };
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  // vergelijking voor voluit geschreven antwoorden: juist / trema / spatie / fout
  const vnorm = (s) => String(s ?? "").toLowerCase().replace(/é/g, "e").replace(/\s+/g, " ").trim();
  function checkVoluit(given, accepted) {
    const g = vnorm(given), acc = accepted.map(vnorm);
    if (!g) return { status: "wrong", tag: "voluit" };
    if (acc.includes(g)) return { status: "correct" };
    const noTrema = (x) => x.replace(/ë/g, "e"), noSp = (x) => x.replace(/\s/g, "");
    if (acc.some((a) => noTrema(a) === noTrema(g))) return { status: "equiv", tag: "trema", note: "Let op het trema (tweeëntwintig)." };
    if (acc.some((a) => noSp(a) === noSp(g))) return { status: "equiv", tag: "spatie", note: "Let op de spaties: spatie na duizend, miljoen apart." };
    if (acc.some((a) => noSp(noTrema(a)) === noSp(noTrema(g)))) return { status: "equiv", tag: "spatie", note: "Let op trema en spaties." };
    return { status: "wrong", tag: "voluit" };
  }

  // ============================================================
  // ONDERDELEN
  // ============================================================
  const UNITS = [];
  const unit = (u) => { UNITS.push(u); return u; };
  const base = (u, o) => Object.assign({ unit: u.id, unitLabel: u.label, group: u.group, page: u.page, rule: u.rule }, o);
  const mc = (q, right, wrong, level) => Object.assign(q, { mode: "mc", options: shuffle(uniq([right, ...shuffle(uniq(wrong.filter((w) => w !== right))).slice(0, nOpts(level) - 1)])).map((o) => ({ v: o, html: esc(o) })), answer: right });
  const VVN = ["Wie", "Wat", "Welke", "Welk", "Wiens"];
  const conflict = (a) => (a === "Wiens" ? ["Welke", "Welk"] : a === "Welk" ? ["Wiens"] : a === "Welke" ? ["Welk"] : []); // ook grammaticaal mogelijk → geen afleider

  // ---------- les 6 ----------
  unit({
    id: "vvn_invullen", group: "L6", label: "Vul het juiste vragend voornaamwoord in", page: "53",
    rule: TAGS.vvn_keuze.advice,
    items: () => VVN_INVUL.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      const q = base(this, { instruction: "Vul het juiste vragend voornaamwoord in: wie, wat, welke (welk) of wiens.", prompt: esc(x.z).replace("___", "<b>_____</b>"), answerShown: `${esc(x.a[0])} <small>(${esc(x.x)})</small>`, key: `vvn:${i}`, itemLabel: x.z.replace("___", x.a[0]), tag: "vvn_keuze" });
      if (typed(level, 0.5)) return Object.assign(q, { mode: "text", short: true, noKeyboard: true, chk: (g) => (x.a.map((a) => a.toLowerCase()).includes(String(g).trim().toLowerCase()) ? { status: "correct" } : { status: "wrong", tag: "vvn_keuze" }) });
      const wrong = VVN.filter((v) => !x.a.includes(v) && !conflict(x.a[0]).includes(v) && (level !== "easy" || v !== "Welk"));
      return mc(q, x.a[0], wrong, level);
    },
  });
  unit({
    id: "vvn_herkennen", group: "L6", label: "Vragend voornaamwoord of niet? (V/X)", page: "54",
    rule: TAGS.vvn_herken.advice,
    items: () => VVN_HERKEN.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      return base(this, { mode: "mc", instruction: "Is het onderstreepte woord een vragend voornaamwoord?", prompt: mark(x.z),
        options: [{ v: "V", html: "✔ V – ja, vragend voornaamwoord" }, { v: "X", html: "✘ X – nee" }], answer: x.v ? "V" : "X",
        answerShown: (x.v ? "V – ja" : "X – nee") + (x.x ? ` <small>(${esc(x.x)})</small>` : ""), key: `herken:${i}`, itemLabel: `${plain(x.z)} → ${x.v ? "V" : "X"}`, tag: "vvn_herken" });
    },
  });
  unit({
    id: "vvn_vraag", group: "L6", label: "Welke vraag hoort bij het antwoord?", page: "53-54",
    rule: "De gemarkeerde woorden zetten je op weg: een persoon → wie, een zaak → wat, een keuze → welke/welk, van wie → wiens.",
    items: () => VVN_VRAAG.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      const make = (p) => { const at0 = x.q.startsWith("{}"); return x.q.replace("{}", at0 ? cap(p.toLowerCase()) : p.toLowerCase()); };
      const right = make(x.a);
      const wrong = VVN.filter((v) => v.toLowerCase() !== x.a.toLowerCase() && !conflict(cap(x.a)).includes(v)).map(make);
      const q = base(this, { instruction: "Welke vraag past bij dit antwoord? Let op het gemarkeerde deel.", prompt: esc(x.antw).replace(/\[([^\]]+)\]/, "<mark>$1</mark>"), answerShown: esc(right), key: `vraag:${i}`, itemLabel: `${plain(x.antw)} → ${right}`, tag: "vvn_keuze" });
      return mc(q, right, wrong, level);
    },
  });

  // ---------- les 7 ----------
  const SOORTEN = ["bh", "oh", "br", "or"];
  unit({
    id: "tw_soort", group: "L7", label: "Kruis aan: welk soort telwoord?", page: "57, 59",
    rule: "Hoofdtelwoord = aantal, rangtelwoord = volgorde. Bepaald = exact, onbepaald = niet exact. → bepaald/onbepaald hoofdtelwoord, bepaald/onbepaald rangtelwoord.",
    items: () => TELWOORD_ZINNEN.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      const opts = level === "easy" ? shuffle([x.s, ...shuffle(SOORTEN.filter((s) => s !== x.s)).slice(0, 2)]) : SOORTEN;
      const tagOf = (g) => (g[1] === x.s[1] ? "bepaald" : "hoofd_rang");
      const alts = Object.fromEntries(SOORTEN.filter((s) => s !== x.s).map((s) => [s, s[1] === x.s[1] ? "bepaald" : s[0] === x.s[0] ? "hoofd_rang" : "hoofd_rang"]));
      return base(this, { mode: "mc", instruction: "Om welk soort telwoord gaat het?", prompt: mark(x.z), options: opts.map((s) => ({ v: s, html: esc(SOORT_NAAM[s]) })), answer: x.s, alts,
        answerShown: esc(SOORT_NAAM[x.s]), key: `soort:${i}`, itemLabel: `${plain(x.z)} → ${SOORT_NAAM[x.s]}`, tag: "hoofd_rang" });
    },
  });
  unit({
    id: "tw_bepaald", group: "L7", label: "Bepaald of onbepaald?", page: "56-57",
    rule: TAGS.bepaald.advice,
    items: () => TELWOORD_ZINNEN.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      const b = x.s[0] === "b" ? "bepaald" : "onbepaald";
      return base(this, { mode: "mc", instruction: "Is het gemarkeerde telwoord bepaald of onbepaald?", prompt: mark(x.z), options: [{ v: "bepaald", html: "bepaald (exact)" }, { v: "onbepaald", html: "onbepaald (niet exact)" }], answer: b,
        answerShown: b, key: `bep:${i}`, itemLabel: `${plain(x.z)} → ${b}`, tag: "bepaald" });
    },
  });
  unit({
    id: "tw_hoofdrang", group: "L7", label: "Hoofdtelwoord of rangtelwoord?", page: "57",
    rule: TAGS.hoofd_rang.advice,
    items: () => TELWOORD_ZINNEN.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      const h = x.s[1] === "h" ? "hoofdtelwoord" : "rangtelwoord";
      return base(this, { mode: "mc", instruction: "Is het gemarkeerde telwoord een hoofdtelwoord of een rangtelwoord?", prompt: mark(x.z), options: [{ v: "hoofdtelwoord", html: "hoofdtelwoord (aantal)" }, { v: "rangtelwoord", html: "rangtelwoord (volgorde)" }], answer: h,
        answerShown: h, key: `hr:${i}`, itemLabel: `${plain(x.z)} → ${h}`, tag: "hoofd_rang" });
    },
  });
  unit({
    id: "tw_zoek", group: "L7", label: "Markeer het telwoord in de zin", page: "56, 58",
    rule: "Een telwoord geeft een aantal (drie, veel, anderhalf) of een rangschikking (derde, laatste) weer.",
    items: () => TELWOORD_ZINNEN.map((x, i) => ({ x, i })).filter(({ x }) => !/\[[^\]]+ [^\]]+\]/.test(x.z) && (x.z.match(/\b(één|een)\b/g) || []).length === 0),
    gen(level, { x, i }) {
      const tw = x.z.match(/\[([^\]]+)\]/)[1];
      const others = uniq(plain(x.z).replace(/[.,!?]/g, "").split(/\s+/).filter((w) => w.length > 2 && w.toLowerCase() !== tw.toLowerCase() && !/^(de|het|een|en)$/i.test(w)));
      const q = base(this, { instruction: "Welk woord in deze zin is een telwoord?", prompt: esc(plain(x.z)), answerShown: `${esc(tw)} <small>(${esc(SOORT_NAAM[x.s])})</small>`, key: `zoek:${i}`, itemLabel: `${plain(x.z)} → ${tw}`, tag: "hoofd_rang" });
      return mc(q, tw, others, level);
    },
  });
  // telwoorden voluit (telkens nieuwe getallen)
  const VOLUIT = [
    { naam: "hoofdtelwoord tot honderd", gen: () => { const n = pick([rnd(21, 99), rnd(21, 99), pick([22, 23, 32, 33, 42, 43, 52, 63, 72, 83, 92, 93])]); return { prompt: String(n), acc: [words(n)] }; } },
    { naam: "hoofdtelwoord tot duizend", gen: () => { const n = rnd(101, 999); return { prompt: String(n), acc: [words(n)] }; } },
    { naam: "groot hoofdtelwoord", gen: () => { const n = pick([rnd(2001, 99999), rnd(100001, 999999)]); return { prompt: fmt(n), acc: [words(n)] }; } },
    { naam: "miljoen", gen: () => { const m = rnd(2, 30), r = pick([0, 0, rnd(1, 9) * 100000]); const n = m * 1e6 + r; return { prompt: fmt(n), acc: [words(n)] }; } },
    { naam: "rangtelwoord tot twintig", gen: () => { const n = rnd(1, 19); return { prompt: n + (n === 1 || n === 8 || n >= 20 ? "ste" : "de"), acc: [ordinal(n)] }; } },
    { naam: "rangtelwoord vanaf twintig", gen: () => { const n = pick([rnd(20, 99), rnd(101, 999), rnd(2001, 9999)]); return { prompt: `${fmt(n)}ste`, acc: [ordinal(n)] }; } },
    { naam: "breuk", gen: () => { const d = pick(Object.keys(NOEMER).map(Number)), t = rnd(1, d - 1), tw = t === 1 ? "een" : EEN[t], noem = NOEMER[d]; return { prompt: `${t}/${d}`, acc: [`${tw} ${noem}`, ...(t > 1 ? [`${tw} ${noem}n`] : []), ...(t === 1 ? [`één ${noem}`] : [])], hint: "teller en noemer apart" }; } },
  ];
  unit({
    id: "tw_voluit", group: "L7", label: "Telwoorden voluit schrijven", page: "60",
    rule: TAGS.voluit.advice,
    items: () => VOLUIT.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      const g = x.gen();
      const q = base(this, { instruction: "Schrijf voluit.", prompt: esc(g.prompt), hint: g.hint || "", answerShown: esc(g.acc[0]), key: `voluit:${i}`, itemLabel: `voluit: ${x.naam}`, tag: "voluit", right: g.acc[0] });
      if (level === "easy") {
        const a = g.acc[0], wrong = [a.replace(/ë/g, "e"), a.replace(/ /g, ""), a.replace(/(ste|de)$/, (m) => (m === "ste" ? "de" : "ste")), a.replace("duizend ", "duizend en "), a + "e"].filter((w) => w !== a && !g.acc.includes(w));
        return mc(q, a, wrong.length >= 2 ? wrong : wrong.concat([a.replace(/en/, "-en-")]), level);
      }
      return Object.assign(q, { mode: "text", noKeyboard: true, helpers: ["ë"], chk: (gv) => checkVoluit(gv, g.acc) });
    },
  });
  unit({
    id: "tw_spelling", group: "L7", label: "Spelling van telwoorden: wat is juist?", page: "60",
    rule: TAGS.spelling.advice,
    items: () => SPELLING.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      return base(this, { mode: "mc", instruction: "Welke schrijfwijze is juist?", prompt: "", options: shuffle(x.o).map((o) => ({ v: o, html: esc(o) })), answer: x.o[0],
        answerShown: `${esc(x.o[0])} <small>(${esc(x.x)})</small>`, key: `spel:${i}`, itemLabel: `${x.o[0]} (${x.x})`, tag: "spelling" });
    },
  });

  // ---------- begrippen ----------
  unit({
    id: "begrippen", group: "B", label: "Begrippen en regels (flashcards)", page: "53-60",
    rule: "Leer de kaders 'Het vragend voornaamwoord', 'Het telwoord' en 'Spelling van de telwoorden'.",
    items: () => BEGRIPPEN.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      const q = base(this, { instruction: "Begrippen", prompt: esc(x.q), answerShown: esc(x.a), key: `begrip:${i}`, itemLabel: `${x.q} → ${x.a}`, tag: "fout" });
      return mc(q, x.a, BEGRIPPEN.map((b) => b.a), level);
    },
  });

  // ============================================================
  // TOETS
  // ============================================================
  function makeQuiz(s) {
    const units = UNITS.filter((u) => s.units.includes(u.id));
    const all = []; units.forEach((u) => u.items(s).forEach((it) => all.push([u, it])));
    let pickd;
    if (s.count === "all") pickd = all;
    else { pickd = []; while (pickd.length < s.count && all.length) pickd.push(...shuffle(all).slice(0, s.count - pickd.length)); }
    return shuffle(pickd.map(([u, it]) => u.gen(s.level, it)));
  }
  const countAll = (s) => UNITS.filter((u) => s.units.includes(u.id)).reduce((a, u) => a + u.items(s).length, 0);
  const KEYMAP = { vvn: "vvn_invullen", herken: "vvn_herkennen", vraag: "vvn_vraag", soort: "tw_soort", bep: "tw_bepaald", hr: "tw_hoofdrang", zoek: "tw_zoek", voluit: "tw_voluit", spel: "tw_spelling", begrip: "begrippen" };
  function fromKey(key, level) {
    const [p, a] = key.split(":"), u = UNITS.find((x) => x.id === KEYMAP[p]), i = +a;
    if (!u) return null;
    const it = u.items({}).find((x) => x.i === i);
    return it ? u.gen(level, it) : null;
  }
  const regen = (q, level) => fromKey(q.key, level) || q;
  function check(given, q, level) {
    let r = q.mode === "mc" ? (given === q.answer ? { status: "correct" } : { status: "wrong", tag: (q.alts && q.alts[given]) || q.tag }) : q.chk(given, level);
    if (r.status !== "correct" && !r.tag) r.tag = q.tag || "fout";
    r.points = r.status === "correct" ? 1 : r.status === "equiv" ? (level === "hard" ? 0 : 1) : 0;
    if (r.status === "equiv" && level === "hard") r.strictNote = "(op 'Moeilijk' telt dit als fout)";
    return r;
  }
  function conclusions(results) {
    const out = [], total = results.length, pts = results.reduce((a, r) => a + r.points, 0), pct = total ? Math.round((pts / total) * 100) : 0;
    out.push(pct >= 90 ? { type: "good", text: `Knap! ${pct}% juist.` } : pct >= 70 ? { type: "ok", text: `${pct}% juist: een goede basis, nog enkele werkpunten.` } : { type: "bad", text: `${pct}% juist: lees de kaders van les 6 en 7 nog eens en oefen opnieuw.` });
    const tags = {};
    results.forEach((r) => { if (r.status !== "correct" && TAGS[r.tag] && r.tag !== "fout") tags[r.tag] = (tags[r.tag] || 0) + 1; });
    Object.entries(tags).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => { const g = TAGS[t]; out.push({ type: n >= 2 ? "bad" : "ok", text: `<b>${g.title}</b> (${n}×): ${g.advice}${g.page ? ` <small>p.${g.page}</small>` : ""}` }); });
    return out;
  }

  // KAARTEN (studiemodule)
  const KAART_UNITS = ["begrippen", "tw_soort", "vvn_invullen"];
  function kaarten(s) {
    const sel = s && Array.isArray(s.units) ? s.units : KAART_UNITS;
    const out = [];
    if (sel.includes("begrippen")) BEGRIPPEN.forEach((x, i) => out.push({ key: `begrip:${i}`, unit: "begrippen", soort: "Begrip", ask: "", front: esc(x.q), back: esc(x.a), page: "53-60", label: `${x.q} → ${x.a}` }));
    if (sel.includes("tw_soort")) TELWOORD_ZINNEN.forEach((x, i) => out.push({ key: `soort:${i}`, unit: "tw_soort", soort: "Soort telwoord", ask: "Welk soort telwoord?", front: mark(x.z), back: esc(SOORT_NAAM[x.s]), page: "57", label: `${plain(x.z)} → ${SOORT_NAAM[x.s]}` }));
    if (sel.includes("vvn_invullen")) VVN_INVUL.forEach((x, i) => out.push({ key: `vvn:${i}`, unit: "vvn_invullen", soort: "Vragend vnw", ask: "Welk vragend voornaamwoord?", front: esc(x.z).replace("___", "<b>_____</b>"), back: esc(x.a[0]), info: esc(x.x), page: "53", label: x.z.replace("___", x.a[0]) }));
    return out;
  }

  Vakken.register({
    id: "nederlands-2", vak: I.vak, icon: I.icon, theme: I.theme, titel: I.titel, klas: I.klas, bron: I.bron,
    groups: [
      { id: "L6", short: "les 6", titel: "Les 6 – Vragende voornaamwoorden", p: "53-55" },
      { id: "L7", short: "les 7", titel: "Les 7 – Het telwoord", p: "56-60" },
      { id: "B", short: "begrippen", titel: "Begrippen en regels", p: "53-60" },
    ],
    units: UNITS.map((u) => ({ id: u.id, group: u.group, label: u.label, page: u.page })),
    quick: [
      { label: "Alles", select: () => true },
      { label: "❓ Les 6 – vragende vnw", select: (u) => u.group === "L6" },
      { label: "🔢 Les 7 – telwoord", select: (u) => u.group === "L7" },
      { label: "✍️ Voluit + spelling", select: (u) => u.id === "tw_voluit" || u.id === "tw_spelling" },
    ],
    settings: [],
    levels: {
      easy: { title: "🙂 Makkelijk", desc: "alles meerkeuze" },
      normal: { title: "💪 Normaal", desc: "meerkeuze + zelf schrijven; trema of spatie vergeten telt nog als goed" },
      hard: { title: "🔥 Moeilijk", desc: "zelf schrijven, trema en spaties moeten juist zijn" },
    },
    allInfo: "<b>Eindtoets-modus:</b> elke zin en elk soort oefening uit de gekozen onderdelen komt één keer aan bod.",
    statusText: { equiv: "Bijna!" },
    tags: TAGS,
    makeQuiz, countAll, check, conclusions, regen, fromKey,
    kaarten, kaartUnits: KAART_UNITS,
    _UNITS: UNITS, _words: words, _ordinal: ordinal, _checkVoluit: checkVoluit,
  });
})();
