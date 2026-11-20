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
  const typed = (level, p = 0.5) => (level === "easy" ? false : level === "hard" || Vakken.vast ? true : Math.random() < p);
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
    id: "vvn_invullen", group: "L6", label: "Vul het juiste vragend voornaamwoord in", page: "53", pg: [53, 55],
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
    id: "vvn_herkennen", group: "L6", label: "Vragend voornaamwoord of niet? (V/X)", page: "54", pg: [53, 55],
    rule: TAGS.vvn_herken.advice,
    items: () => VVN_HERKEN.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      return base(this, { mode: "mc", instruction: "Is het onderstreepte woord een vragend voornaamwoord?", prompt: mark(x.z),
        options: [{ v: "V", html: "✔ V – ja, vragend voornaamwoord" }, { v: "X", html: "✘ X – nee" }], answer: x.v ? "V" : "X",
        answerShown: (x.v ? "V – ja" : "X – nee") + (x.x ? ` <small>(${esc(x.x)})</small>` : ""), key: `herken:${i}`, itemLabel: `${plain(x.z)} → ${x.v ? "V" : "X"}`, tag: "vvn_herken" });
    },
  });
  unit({
    id: "vvn_vraag", group: "L6", label: "Welke vraag hoort bij het antwoord?", page: "53-54", pg: [53, 55],
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
    id: "tw_soort", group: "L7", label: "Kruis aan: welk soort telwoord?", page: "57, 59", pg: [56, 59],
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
    id: "tw_bepaald", group: "L7", label: "Bepaald of onbepaald?", page: "56-57", pg: [56, 57],
    rule: TAGS.bepaald.advice,
    items: () => TELWOORD_ZINNEN.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      const b = x.s[0] === "b" ? "bepaald" : "onbepaald";
      return base(this, { mode: "mc", instruction: "Is het gemarkeerde telwoord bepaald of onbepaald?", prompt: mark(x.z), options: [{ v: "bepaald", html: "bepaald (exact)" }, { v: "onbepaald", html: "onbepaald (niet exact)" }], answer: b,
        answerShown: b, key: `bep:${i}`, itemLabel: `${plain(x.z)} → ${b}`, tag: "bepaald" });
    },
  });
  unit({
    id: "tw_hoofdrang", group: "L7", label: "Hoofdtelwoord of rangtelwoord?", page: "57", pg: [56, 57],
    rule: TAGS.hoofd_rang.advice,
    items: () => TELWOORD_ZINNEN.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      const h = x.s[1] === "h" ? "hoofdtelwoord" : "rangtelwoord";
      return base(this, { mode: "mc", instruction: "Is het gemarkeerde telwoord een hoofdtelwoord of een rangtelwoord?", prompt: mark(x.z), options: [{ v: "hoofdtelwoord", html: "hoofdtelwoord (aantal)" }, { v: "rangtelwoord", html: "rangtelwoord (volgorde)" }], answer: h,
        answerShown: h, key: `hr:${i}`, itemLabel: `${plain(x.z)} → ${h}`, tag: "hoofd_rang" });
    },
  });
  unit({
    id: "tw_zoek", group: "L7", label: "Markeer het telwoord in de zin", page: "56, 58", pg: [56, 58],
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
    id: "tw_voluit", group: "L7", label: "Telwoorden voluit schrijven", page: "60", pg: [60, 60],
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
    id: "tw_spelling", group: "L7", label: "Spelling van telwoorden: wat is juist?", page: "60", pg: [60, 60],
    rule: TAGS.spelling.advice,
    items: () => SPELLING.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      return base(this, { mode: "mc", instruction: "Welke schrijfwijze is juist?", prompt: "", options: shuffle(x.o).map((o) => ({ v: o, html: esc(o) })), answer: x.o[0],
        answerShown: `${esc(x.o[0])} <small>(${esc(x.x)})</small>`, key: `spel:${i}`, itemLabel: `${x.o[0]} (${x.x})`, tag: "spelling" });
    },
  });

  // ---------- begrippen ----------
  unit({
    id: "begrippen", group: "B", label: "Begrippen en regels (flashcards)", page: "53-60", pg: [53, 60],
    rule: "Leer de kaders 'Het vragend voornaamwoord', 'Het telwoord' en 'Spelling van de telwoorden'.",
    items: () => BEGRIPPEN.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      const q = base(this, { instruction: "Begrippen", prompt: esc(x.q), answerShown: esc(x.a), key: `begrip:${i}`, itemLabel: `${x.q} → ${x.a}`, tag: "fout" });
      return mc(q, x.a, BEGRIPPEN.map((b) => b.a), level);
    },
  });

  // ============================================================
  // DEEL 1: les 1-5, 8 en taalschat (data in deel1.js)
  // ============================================================
  const D = I;
  const lc = (s) => String(s ?? "").trim().toLowerCase().replace(/[.!?]+$/, "").replace(/\s+/g, " ");
  const chkList = (acc, tag, opts = {}) => (g) => {
    const x = opts.exact ? String(g ?? "").trim().replace(/\s+/g, " ") : lc(g);
    const A = acc.map((a) => (opts.exact ? a : lc(a)));
    if (A.includes(x)) return { status: "correct" };
    if (opts.exact && acc.map(lc).includes(lc(g))) return { status: "wrong", tag, note: "Let op hoofdletters." };
    return { status: "wrong", tag };
  };
  const mcHtml = (q, right, wrong, level, html = esc) => Object.assign(q, { mode: "mc", options: shuffle(uniq([right, ...shuffle(uniq(wrong.filter((w) => w !== right))).slice(0, nOpts(level) - 1)])).map((o) => ({ v: o, html: html(o) })), answer: right });
  const items = (arr) => () => arr.map((x, i) => ({ x, i }));

  // ---------- les 1: reclame ----------
  unit({
    id: "rc_mmd", group: "L1", label: "Merk, medium of doelgroep?", page: "26", pg: [24, 29],
    rule: "Merk = de naam van het bedrijf of product (Dior) · medium = de drager van de reclame (folder, tv-spot, Instagram) · doelgroep = voor wie de reclame bedoeld is (kinderen, volwassenen …).",
    items: items(D.RECLAME_MMD),
    gen(level, { x, i }) {
      return base(this, { mode: "mc", instruction: "Is dit een merk, een medium of een doelgroep?", prompt: esc(x[0]), options: ["merk", "medium", "doelgroep"].map((v) => ({ v, html: v })), answer: x[1],
        answerShown: x[1], key: `rcm:${i}`, itemLabel: `${x[0]} → ${x[1]}`, tag: "reclame" });
    },
  });
  unit({
    id: "rc_slogan", group: "L1", label: "Slogans: welk woord maakt het wervend? (bijv. naamwoord)", page: "27-29", pg: [27, 29],
    rule: "Een slogan is een korte, wervende zin. Goedgekozen bijvoeglijke naamwoorden (het lekkerste, vers, ongelooflijk) maken de boodschap sterker; de merknaam staat er vaak in.",
    items: items(D.SLOGANS),
    gen(level, { x, i }) {
      const adj = [...x[0].matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]), z = x[0].replace(/\[|\]/g, "");
      if (Math.random() < 0.5) {
        const right = pick(adj), others = z.replace(/[.,!:'&]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !adj.includes(w) && !x[1].split(" ").includes(w));
        return mc(base(this, { instruction: "Welk woord is een bijvoeglijk naamwoord dat de slogan wervend maakt?", prompt: esc(z), answerShown: esc(adj.join(", ")), key: `rcs:${i}`, itemLabel: `${z}`, tag: "reclame" }), right, others, level);
      }
      return mc(base(this, { instruction: "Voor welk merk is deze slogan?", prompt: esc(z), answerShown: esc(x[1]), key: `rcs:${i}`, itemLabel: `${z} → ${x[1]}`, tag: "reclame" }), x[1], D.SLOGANS.map((s) => s[1]), level);
    },
  });
  unit({
    id: "rc_stelling", group: "L1", label: "Reclame: juist of fout?", page: "26-29", pg: [24, 29],
    rule: "Reclame wil naamsbekendheid verwerven en je overtuigen om te kopen; ze is aangepast aan de doelgroep en vaak overdreven of misleidend.",
    items: items(D.RECLAME_STELLING),
    gen(level, { x, i }) {
      return base(this, { mode: "mc", instruction: "Juist of fout?", prompt: esc(x[0]), options: [{ v: "j", html: "✔ juist" }, { v: "f", html: "✘ fout" }], answer: x[1] ? "j" : "f",
        answerShown: `${x[1] ? "juist" : "fout"} <small>(${esc(x[2])})</small>`, key: `rcj:${i}`, itemLabel: x[0], tag: "reclame" });
    },
  });

  // ---------- les 2: lay-out ----------
  unit({
    id: "lo_tips", group: "L2", label: "Goede lay-out: tip of fout?", page: "31-33", pg: [30, 33],
    rule: "Goede lay-out: duidelijke structuur, tussentitels, beperkt kleurgebruik, weinig vet en cursief, belangrijke info zichtbaar en volledig, voldoende witruimte, rekening houden met de doelgroep, leesbaar lettertype.",
    items: items(D.LAYOUT_TIPS),
    gen(level, { x, i }) {
      return base(this, { mode: "mc", instruction: "Is dit een goede tip voor een lay-out?", prompt: esc(x[0]), options: [{ v: "j", html: "👍 goede tip" }, { v: "f", html: "👎 slechte tip" }], answer: x[1] ? "j" : "f",
        answerShown: x[1] ? "goede tip" : "slechte tip", key: `lo:${i}`, itemLabel: x[0], tag: "layout" });
    },
  });

  // ---------- les 3: de uitnodiging ----------
  const UITN_KEYS = ["org", "reden", "datum", "tijd", "plaats", "mee", "inschr"];
  const UITN_ITEMS = D.UITNODIGINGEN.flatMap((u, ui) => UITN_KEYS.map((k) => ({ ui, k })));
  unit({
    id: "ui_ontbreekt", group: "L3", label: "Uitnodiging: welke informatie ontbreekt?", page: "35-37", pg: [34, 39],
    rule: "Op een uitnodiging staat alle informatie voor de ontvanger: organisator, reden, datum, tijdstip, locatie, wat je moet meebrengen en of/hoe je je moet inschrijven of bevestigen.",
    items: () => UITN_ITEMS.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      const u = D.UITNODIGINGEN[x.ui], d = u.delen;
      const zin = `${x.k === "org" ? "[…]" : d.org} ${x.k === "reden" ? "[…]" : d.reden} ${x.k === "datum" ? "" : d.datum} ${x.k === "tijd" ? "" : d.tijd} ${x.k === "plaats" ? "" : d.plaats}.`.replace(/\s+/g, " ").replace(" .", ".");
      const rest = [x.k === "mee" ? "" : d.mee, x.k === "inschr" ? "" : d.inschr].filter(Boolean).join(" ");
      const right = D.DEEL_NAAM[x.k];
      return mc(base(this, { instruction: "Deze uitnodiging is onvolledig. Wat ontbreekt er?", prompt: `<b>${esc(u.titel)}</b><br>${esc(zin)} ${esc(rest)}`, answerShown: esc(right), key: `uio:${i}`, itemLabel: `${u.titel}: ${right}`, tag: "uitnodiging" }), right, Object.values(D.DEEL_NAAM), level);
    },
  });
  const VRAAGW = ["wie", "wat", "waar", "waarom", "wanneer", "hoe"];
  unit({
    id: "ui_topisch", group: "L3", label: "Topische vragen (W-vragen): welk vraagwoord?", page: "36-37", pg: [36, 38],
    rule: "Topische vragen beginnen met een vraagwoord: wie (persoon), wat (zaak, activiteit), waar (plaats), wanneer (tijd), waarom (reden), hoe (manier).",
    items: items(D.TOPISCH),
    gen(level, { x, i }) {
      const q = base(this, { instruction: "Met welk vraagwoord begint de topische vraag waarop het gemarkeerde deel het antwoord is?", prompt: esc(x[0]).replace(/\[([^\]]+)\]/, "<mark>$1</mark>"),
        answerShown: cap(x[1]), key: `uit:${i}`, itemLabel: `${plain(x[0])} → ${x[1]}`, tag: "uitnodiging" });
      if (typed(level, 0.4)) return Object.assign(q, { mode: "text", short: true, noKeyboard: true, chk: chkList([x[1]], "uitnodiging") });
      return Object.assign(q, { mode: "mc", options: VRAAGW.map((v) => ({ v, html: cap(v) })), answer: x[1] });
    },
  });

  // ---------- les 4: woordvorming ----------
  unit({
    id: "wv_soort", group: "L4", label: "Grondwoord, samenstelling of afleiding?", page: "40-41", pg: [40, 45],
    rule: "Samenstelling = twee of meer grondwoorden aan elkaar (lessenrooster). Afleiding = grondwoord + voor- of achtervoegsel dat geen woord op zich is (ongeluk, verkleuring); ook verkleinwoorden zijn afleidingen (tafeltje).",
    items: items(D.WOORDVORMING),
    gen(level, { x, i }) {
      return base(this, { mode: "mc", instruction: "Is dit een grondwoord, een samenstelling of een afleiding?", prompt: esc(x[0]), options: ["grondwoord", "samenstelling", "afleiding"].map((v) => ({ v, html: v })), answer: x[1],
        answerShown: `${x[1]} <small>(${esc(x[2])})</small>`, key: `wvs:${i}`, itemLabel: `${x[0]} → ${x[1]}`, tag: "woordvorming" });
    },
  });
  unit({
    id: "wv_voorv", group: "L4", label: "Voorvoegsels uit andere talen: wat betekenen ze?", page: "43", pg: [43, 43],
    rule: "co- = mee, samen met · vice- = tweede, onder- · anti- = tegen, geen · inter- = tussen · re- = opnieuw · pseudo- = vals, zogenaamd · pre- = voor · de- = ongedaan maken · semi- = half · aarts- = eerst, hoogst.",
    items: items(D.VOORVOEGSELS),
    gen(level, { x, i }) {
      const q = base(this, { instruction: `Wat betekent het voorvoegsel in <b>${esc(x[2])}</b>?`, prompt: esc(x[0]), answerShown: `${esc(x[1])} <small>(${esc(x[2])})</small>`, key: `wvv:${i}`, itemLabel: `${x[0]} = ${x[1]}`, tag: "woordvorming" });
      return mc(q, x[1], D.VOORVOEGSELS.map((v) => v[1]), level);
    },
  });
  unit({
    id: "wv_antoniem", group: "L4", label: "Tegengestelde (antoniem) maken met een voor- of achtervoegsel", page: "42", pg: [42, 42],
    rule: "Met voorvoegsels als on-, in-, im-, il-, ir-, a-, de-, des-, wan- of het achtervoegsel -loos maak je een tegengestelde: legaal → illegaal, hoop → wanhoop, geur → geurloos.",
    items: items(D.ANTONIEMEN),
    gen(level, { x, i }) {
      const q = base(this, { instruction: "Vorm het tegengestelde (antoniem).", prompt: esc(x[0]), answerShown: esc(x[1]), key: `wva:${i}`, itemLabel: `${x[0]} ↔ ${x[1]}`, tag: "woordvorming" });
      if (typed(level, 0.5)) return Object.assign(q, { mode: "text", short: true, noKeyboard: true, chk: chkList([x[1]], "woordvorming") });
      const base0 = x[0].replace(/^met /, "");
      const wrong = ["on", "in", "im", "il", "ir", "a", "de", "des", "wan"].map((p) => p + base0).filter((w) => w !== x[1]).concat([base0 + "loos"]);
      return mc(q, x[1], wrong, level);
    },
  });
  unit({
    id: "wv_verklein", group: "L4", label: "Verkleinwoorden maken (afleidingen)", page: "41-42", pg: [41, 42],
    rule: "Verkleinwoorden zijn afleidingen met -je, -tje, -pje, -etje of -kje: tafeltje, boompje, slangetje, koninkje. Soms pas je de spelling aan: oma → omaatje, gat → gaatje.",
    items: items(D.VERKLEIN),
    gen(level, { x, i }) {
      const q = base(this, { instruction: "Maak het verkleinwoord.", prompt: esc(x[0]), answerShown: esc(x[1]), key: `wvk:${i}`, itemLabel: `${x[0]} → ${x[1]}`, tag: "woordvorming" });
      if (typed(level, 0.6)) return Object.assign(q, { mode: "text", short: true, noKeyboard: true, chk: chkList([x[1]], "woordvorming") });
      const w = x[0];
      const wrong = uniq([w + "je", w + "tje", w + "pje", w + "etje", w + "kje", w + w.slice(-1) + "etje"]).filter((z) => z !== x[1]);
      return mc(q, x[1], wrong, level);
    },
  });

  // ---------- les 5: trema en koppelteken ----------
  unit({
    id: "tk_spelling", group: "L5", label: "Trema of koppelteken: welke schrijfwijze is juist?", page: "46-51", pg: [46, 52],
    rule: "Trema: klinkerbotsing in een grondwoord of afleiding (reünie, beëindigen), bij samengestelde telwoorden (tweeënzestig) en verbuiging/vervoeging (industriële). Koppelteken: klinkerbotsing in een samenstelling (zee-egel) en bij letters, cijfers, aardrijkskundige namen, Sint-, ex-, gelijkwaardige delen …",
    items: items(D.TK_SPELLING),
    gen(level, { x, i }) {
      const [ok, fout, regel] = x;
      const q = base(this, { instruction: "Welke schrijfwijze is juist?", prompt: "", answerShown: `${esc(ok)} <small>(${esc(regel)})</small>`, key: `tks:${i}`, itemLabel: `${ok} (${regel})`, tag: "trema" });
      if (level === "hard") {
        const kaal = ok.replace(/[ëïöüä]/g, (c) => ({ "ë": "e", "ï": "i", "ö": "o", "ü": "u", "ä": "a" })[c]).replace(/-(?! )/g, "");
        return Object.assign(q, { instruction: "Schrijf het woord juist (voeg een trema of koppelteken toe waar nodig).", prompt: esc(kaal), mode: "text", noKeyboard: true, helpers: ["ë", "ï", "ü", "ö", "-"], chk: chkList([ok], "trema", { exact: true }) });
      }
      return Object.assign(q, { mode: "mc", options: shuffle([ok, fout]).map((o) => ({ v: o, html: esc(o) })), answer: ok });
    },
  });
  const KT_IDS = Object.keys(D.KT_REGELS);
  unit({
    id: "tk_regel", group: "L5", label: "Waarom een koppelteken?", page: "49-50", pg: [48, 50],
    rule: "Koppelteken: om klinkerbotsing te voorkomen in samenstellingen · bij letters, cijfers, tekens, afkortingen · aardrijkskundige namen · Sint- · gelijkwaardige delen · een reeks woorden als geheel · ex-, niet-, non-, oud-, bijna- · voorvoegsel + hoofdletter · weglatingsstreepje om herhaling te vermijden.",
    items: items(D.KT_WOORDEN),
    gen(level, { x, i }) {
      const right = D.KT_REGELS[x[1]];
      return mc(base(this, { instruction: "Waarom staat er een koppelteken in dit woord?", prompt: esc(x[0]), answerShown: esc(right), key: `tkr:${i}`, itemLabel: `${x[0]}: ${right}`, tag: "koppelteken" }), right, Object.values(D.KT_REGELS), level);
    },
  });
  unit({
    id: "tk_meervoud", group: "L5", label: "Meervoud van woorden op -ie (trema)", page: "48", pg: [47, 48],
    rule: "Woorden op -ie krijgen in het meervoud een trema. Klemtoon achteraan: -ën (allergieën, biografieën). Klemtoon niet achteraan: -n (bacteriën, poriën). Sommige hebben ook een meervoud op -s (kolonies).",
    items: items(D.IE_MEERVOUD),
    gen(level, { x, i }) {
      const [enk, ...mv] = x;
      const q = base(this, { instruction: "Geef het meervoud.", prompt: esc(enk), answerShown: esc(mv.join(" of ")), key: `tkm:${i}`, itemLabel: `${enk} → ${mv.join("/")}`, tag: "trema" });
      if (typed(level, 0.6)) return Object.assign(q, { mode: "text", short: true, noKeyboard: true, helpers: ["ë"], chk: chkList(mv, "trema", { exact: true }) });
      const st = enk.replace(/ie$/, "");
      const wrong = [st + "ieen", st + "iën", st + "ieën", st + "ies", st + "iens"].filter((w) => !mv.includes(w));
      return mc(q, mv[0], wrong, level);
    },
  });

  // ---------- les 8: het bijwoord ----------
  const BWZ = D.BIJWOORD_ZINNEN;
  unit({
    id: "bw_herken", group: "L8", label: "Bijwoord of bijvoeglijk naamwoord?", page: "61-62", pg: [61, 64],
    rule: "Een bijvoeglijk naamwoord zegt iets over een zelfstandig naamwoord (een snelle fiets). Een bijwoord zegt iets over een werkwoord, bijvoeglijk naamwoord, ander bijwoord, telwoord of de hele zin (hij fietst snel).",
    items: items(BWZ),
    gen(level, { x, i }) {
      return base(this, { mode: "mc", instruction: "Is het onderstreepte woord een bijwoord?", prompt: mark(x[0]), options: [{ v: "j", html: "ja, een bijwoord" }, { v: "n", html: "nee (bijvoeglijk naamwoord)" }], answer: x[1] ? "j" : "n",
        answerShown: `${x[1] ? "ja, bijwoord" : "nee"} <small>(${esc(x[3])})</small>`, key: `bwh:${i}`, itemLabel: `${plain(x[0])} → ${x[1] ? "bijwoord" : "geen bijwoord"}`, tag: "bijwoord" });
    },
  });
  unit({
    id: "bw_waarover", group: "L8", label: "Waarover zegt het bijwoord iets meer?", page: "62-64", pg: [61, 64],
    rule: "Een bijwoord vertelt iets meer over een werkwoord (snel herstellen), een bijvoeglijk naamwoord (erg ouderwets), een ander bijwoord (ijzig kalm), een telwoord (bijna twee) of de hele zin (helaas).",
    items: () => BWZ.map((x, i) => ({ x, i })).filter(({ x }) => x[1]),
    gen(level, { x, i }) {
      const opts = Object.entries(D.BW_WAAROVER);
      return base(this, { mode: "mc", instruction: "Waarover zegt het onderstreepte bijwoord iets meer?", prompt: mark(x[0]), options: opts.map(([v, h]) => ({ v, html: h })), answer: x[2],
        answerShown: `${D.BW_WAAROVER[x[2]]} <small>(${esc(x[3])})</small>`, key: `bww:${i}`, itemLabel: `${plain(x[0])} → ${D.BW_WAAROVER[x[2]]}`, tag: "bijwoord" });
    },
  });
  unit({
    id: "bw_soort", group: "L8", label: "Soort bijwoord: tijd, plaats, graad of vragend?", page: "64-65", pg: [64, 65],
    rule: "Bijwoord van tijd (nu, straks, gisteren) · van plaats (hier, overal, ergens) · van graad (erg, zeer, heel, nogal) · vragend bijwoord (waar, wanneer, waarom, hoe).",
    items: items(D.BW_SOORTEN),
    gen(level, { x, i }) {
      return base(this, { mode: "mc", instruction: "Wat voor bijwoord is dit?", prompt: esc(x[0]), options: Object.entries(D.BW_SOORT_NAAM).map(([v, h]) => ({ v, html: h })), answer: x[1],
        answerShown: D.BW_SOORT_NAAM[x[1]], key: `bws:${i}`, itemLabel: `${x[0]} → ${D.BW_SOORT_NAAM[x[1]]}`, tag: "bijwoord" });
    },
  });
  unit({
    id: "bw_vraag", group: "L8", label: "Vragend bijwoord of vragend voornaamwoord?", page: "65", pg: [65, 65],
    rule: "Vragende voornaamwoorden: wie, wat, welke/welk, wiens. Vragende bijwoorden: waar, wanneer, waarom, hoe (hoelang, waarheen).",
    items: items(D.VRAAGWOORDEN),
    gen(level, { x, i }) {
      return base(this, { mode: "mc", instruction: "Is het onderstreepte woord een vragend bijwoord of een vragend voornaamwoord?", prompt: mark(x[0]), options: [{ v: "bw", html: "vragend bijwoord" }, { v: "vnw", html: "vragend voornaamwoord" }], answer: x[1],
        answerShown: x[1] === "bw" ? "vragend bijwoord" : "vragend voornaamwoord", key: `bwv:${i}`, itemLabel: `${plain(x[0])} → ${x[1]}`, tag: "vvn_herken" });
    },
  });

  // ---------- taalschat ----------
  unit({
    id: "ts_synoniem", group: "T", label: "Synoniemen van bijvoeglijke naamwoorden", page: "66-68", pg: [66, 68],
    rule: "Leer de moeilijke bijvoeglijke naamwoorden met hun synoniem: banaal = alledaags, genereus = vrijgevig, exceptioneel = uitzonderlijk, minutieus = nauwkeurig …",
    items: items(D.SYNONIEMEN),
    gen(level, { x, i }) {
      return mc(base(this, { instruction: "Wat is het synoniem?", prompt: esc(x[0]), answerShown: esc(x[1]), key: `tss:${i}`, itemLabel: `${x[0]} = ${x[1]}`, tag: "taalschat" }), x[1], D.SYNONIEMEN.map((s) => s[1]), level);
    },
  });
  unit({
    id: "ts_woordfam", group: "T", label: "Zelfstandig naamwoord uit dezelfde woordfamilie", page: "66", pg: [66, 66],
    rule: "Achtervoegsels voor zelfstandige naamwoorden: -teit (exclusiviteit), -ing (uitsluiting), -heid (kostbaarheid), -ment (isolement), -e (luxe), -er (klassieker).",
    items: items(D.BN_ZN),
    gen(level, { x, i }) {
      const q = base(this, { instruction: "Geef het zelfstandig naamwoord uit dezelfde woordfamilie.", prompt: esc(x[0]), answerShown: esc(x[1]), key: `tsw:${i}`, itemLabel: `${x[0]} → ${x[1]}`, tag: "taalschat" });
      if (typed(level, 0.5)) return Object.assign(q, { mode: "text", short: true, noKeyboard: true, chk: chkList([x[1], x[1].replace(/^(de|het) /, "")], "taalschat") });
      return mc(q, x[1], D.BN_ZN.map((b) => b[1]), level);
    },
  });
  unit({
    id: "ts_vragen", group: "T", label: "Synoniemen voor 'vragen' (eisen, smeken, polsen …)", page: "67", pg: [67, 67],
    rule: "eisen = dwingend vragen · smeken = heel dringend vragen · polsen = voorzichtig navragen · ondervragen = uitvoerig vragen stellen (politie) · aanvragen = officieel vragen · verzoeken = beleefd vragen · uitnodigen/inviteren = vragen om te komen.",
    items: items(D.VRAGEN_WW),
    gen(level, { x, i }) {
      return mc(base(this, { instruction: "Welk werkwoord past het best?", prompt: esc(x[0]).replace("___", "<b>_____</b>"), answerShown: `${esc(x[1])} <small>(${esc(x[2])})</small>`, key: `tsv:${i}`, itemLabel: x[0].replace("___", x[1]), tag: "taalschat" }), x[1], D.VRAGEN_WW.map((v) => v[1]), level);
    },
  });
  unit({
    id: "ts_formeel", group: "T", label: "Formeler taal voor een uitnodiging", page: "68", pg: [68, 68],
    rule: "In een formele uitnodiging gebruik je formeler woorden: deelnemen → participeren, uitkiezen → selecteren, bevestigen → confirmeren …",
    items: items(D.FORMEEL),
    gen(level, { x, i }) {
      return mc(base(this, { instruction: "Wat is een formeler synoniem (of een ander woord met dezelfde betekenis)?", prompt: esc(x[0]), answerShown: esc(x[1]), key: `tsf:${i}`, itemLabel: `${x[0]} → ${x[1]}`, tag: "taalschat" }), x[1], D.FORMEEL.map((f) => f[1]), level);
    },
  });
  unit({
    id: "ts_uitdr", group: "T", label: "Uitdrukkingen en spreekwoorden", page: "68-69", pg: [68, 69],
    rule: "Leer de betekenis van de uitdrukkingen: met de deur in huis vallen, iets in petto hebben, iemand in de watten leggen, alles uit de kast halen, de rode loper uitrollen …",
    items: items(D.UITDRUKKINGEN),
    gen(level, { x, i }) {
      if (Math.random() < 0.5) return mc(base(this, { instruction: "Wat betekent deze uitdrukking?", prompt: `<i>${esc(x[0])}</i>`, answerShown: esc(x[1]), key: `tsu:${i}`, itemLabel: `${x[0]} = ${x[1]}`, tag: "taalschat" }), x[1], D.UITDRUKKINGEN.map((u) => u[1]), level);
      return mc(base(this, { instruction: "Welke uitdrukking past bij deze betekenis?", prompt: esc(x[1]), answerShown: `<i>${esc(x[0])}</i>`, key: `tsu:${i}`, itemLabel: `${x[1]} = ${x[0]}`, tag: "taalschat" }), x[0], D.UITDRUKKINGEN.map((u) => u[0]), level);
    },
  });

  // ---------- begrippen deel 1 ----------
  unit({
    id: "begrippen_d1", group: "B", label: "Begrippen en regels les 1-5, 8 (flashcards)", page: "24-65", pg: [24, 65],
    rule: "Leer de theoriekaders van de lessen.",
    items: (s) => D.BEGRIPPEN_D1.map((x, i) => ({ x, i, p: x.p })),
    gen(level, { x, i }) {
      return mc(base(this, { instruction: "Begrippen", prompt: esc(x.q), answerShown: esc(x.a), key: `bd1:${i}`, itemLabel: `${x.q} → ${x.a}`, tag: "fout" }), x.a, D.BEGRIPPEN_D1.map((b) => b.a), level);
    },
  });

  // ============================================================
  // TOETS (met paginabereik: een onderdeel telt mee als zijn pagina's in het bereik vallen)
  // ============================================================
  const inPg = (s, a, b) => !s || !Array.isArray(s.paginas) || (a <= s.paginas[1] && b >= s.paginas[0]);
  const activeUnits = (s) => UNITS.filter((u) => s.units.includes(u.id) && inPg(s, u.pg[0], u.pg[1]));
  const unitItems = (u, s) => u.items(s).filter((it) => it.p == null || inPg(s, it.p, it.p));
  function makeQuiz(s) {
    const units = activeUnits(s);
    const all = []; units.forEach((u) => unitItems(u, s).forEach((it) => all.push([u, it])));
    let pickd;
    if (s.count === "all") pickd = all;
    else { pickd = []; while (pickd.length < s.count && all.length) pickd.push(...shuffle(all).slice(0, s.count - pickd.length)); }
    const qs = pickd.map(([u, it]) => u.gen(s.level, it));
    return s.ordered ? qs : shuffle(qs);
  }
  const countAll = (s) => activeUnits(s).reduce((a, u) => a + unitItems(u, s).length, 0);
  const KEYMAP = { vvn: "vvn_invullen", herken: "vvn_herkennen", vraag: "vvn_vraag", soort: "tw_soort", bep: "tw_bepaald", hr: "tw_hoofdrang", zoek: "tw_zoek", voluit: "tw_voluit", spel: "tw_spelling", begrip: "begrippen",
    rcm: "rc_mmd", rcs: "rc_slogan", rcj: "rc_stelling", lo: "lo_tips", uio: "ui_ontbreekt", uit: "ui_topisch", wvs: "wv_soort", wvv: "wv_voorv", wva: "wv_antoniem", wvk: "wv_verklein",
    tks: "tk_spelling", tkr: "tk_regel", tkm: "tk_meervoud", bwh: "bw_herken", bww: "bw_waarover", bws: "bw_soort", bwv: "bw_vraag", tss: "ts_synoniem", tsw: "ts_woordfam", tsv: "ts_vragen", tsf: "ts_formeel", tsu: "ts_uitdr", bd1: "begrippen_d1" };
  function fromKey(key, level, s) {
    const [p, a] = key.split(":"), u = UNITS.find((x) => x.id === KEYMAP[p]), i = +a;
    if (!u) return null;
    const it = u.items({}).find((x) => x.i === i);
    if (it && s && !inPg(s, u.pg[0], u.pg[1])) return null;
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
    out.push(pct >= 90 ? { type: "good", text: `Knap! ${pct}% juist.` } : pct >= 70 ? { type: "ok", text: `${pct}% juist: een goede basis, nog enkele werkpunten.` } : { type: "bad", text: `${pct}% juist: lees de theoriekaders nog eens en oefen opnieuw.` });
    const tags = {};
    results.forEach((r) => { if (r.status !== "correct" && TAGS[r.tag] && r.tag !== "fout") tags[r.tag] = (tags[r.tag] || 0) + 1; });
    Object.entries(tags).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => { const g = TAGS[t]; out.push({ type: n >= 2 ? "bad" : "ok", text: `<b>${g.title}</b> (${n}×): ${g.advice}${g.page ? ` <small>p.${g.page}</small>` : ""}` }); });
    return out;
  }

  // KAARTEN (studiemodule)
  const KAART_UNITS = ["begrippen", "begrippen_d1", "tw_soort", "vvn_invullen", "ts_uitdr", "ts_synoniem"];
  function kaarten(s) {
    const sel0 = s && Array.isArray(s.units) ? s.units : KAART_UNITS;
    const sel = sel0.filter((id) => { const u = UNITS.find((x) => x.id === id); return u && inPg(s, u.pg[0], u.pg[1]); });
    const out = [];
    if (sel.includes("begrippen_d1")) D.BEGRIPPEN_D1.forEach((x, i) => { if (inPg(s, x.p, x.p)) out.push({ key: `bd1:${i}`, unit: "begrippen_d1", soort: "Begrip", ask: "", front: esc(x.q), back: esc(x.a), page: String(x.p), label: `${x.q} → ${x.a}` }); });
    if (sel.includes("ts_uitdr")) D.UITDRUKKINGEN.forEach((x, i) => out.push({ key: `tsu:${i}`, unit: "ts_uitdr", soort: "Uitdrukking", ask: "Wat betekent dit?", front: `<i>${esc(x[0])}</i>`, back: esc(x[1]), page: "68-69", label: `${x[0]} = ${x[1]}` }));
    if (sel.includes("ts_synoniem")) D.SYNONIEMEN.forEach((x, i) => out.push({ key: `tss:${i}`, unit: "ts_synoniem", soort: "Synoniem", ask: "Wat is het synoniem?", front: esc(x[0]), back: esc(x[1]), page: "66-68", label: `${x[0]} = ${x[1]}` }));
    if (sel.includes("begrippen")) BEGRIPPEN.forEach((x, i) => out.push({ key: `begrip:${i}`, unit: "begrippen", soort: "Begrip", ask: "", front: esc(x.q), back: esc(x.a), page: "53-60", label: `${x.q} → ${x.a}` }));
    if (sel.includes("tw_soort")) TELWOORD_ZINNEN.forEach((x, i) => out.push({ key: `soort:${i}`, unit: "tw_soort", soort: "Soort telwoord", ask: "Welk soort telwoord?", front: mark(x.z), back: esc(SOORT_NAAM[x.s]), page: "57", label: `${plain(x.z)} → ${SOORT_NAAM[x.s]}` }));
    if (sel.includes("vvn_invullen")) VVN_INVUL.forEach((x, i) => out.push({ key: `vvn:${i}`, unit: "vvn_invullen", soort: "Vragend vnw", ask: "Welk vragend voornaamwoord?", front: esc(x.z).replace("___", "<b>_____</b>"), back: esc(x.a[0]), info: esc(x.x), page: "53", label: x.z.replace("___", x.a[0]) }));
    return out;
  }

  Vakken.register({
    id: "nederlands-2", vak: I.vak, icon: I.icon, theme: I.theme, titel: I.titel, klas: I.klas, bron: I.bron,
    groups: [
      { id: "L1", short: "les 1", titel: "Les 1 – Reclame", p: "24-29" },
      { id: "L2", short: "les 2", titel: "Les 2 – Een presentatie met online tools (lay-out)", p: "30-33" },
      { id: "L3", short: "les 3", titel: "Les 3 – De uitnodiging", p: "34-39" },
      { id: "L4", short: "les 4", titel: "Les 4 – Woordvorming", p: "40-45" },
      { id: "L5", short: "les 5", titel: "Les 5 – Het trema en het koppelteken", p: "46-52" },
      { id: "L6", short: "les 6", titel: "Les 6 – Vragende voornaamwoorden", p: "53-55" },
      { id: "L7", short: "les 7", titel: "Les 7 – Het telwoord", p: "56-60" },
      { id: "L8", short: "les 8", titel: "Les 8 – Het bijwoord", p: "61-65" },
      { id: "T", short: "taalschat", titel: "Taalschat – De uitnodiging", p: "66-69" },
      { id: "B", short: "begrippen", titel: "Begrippen en regels", p: "24-65" },
    ],
    units: UNITS.map((u) => ({ id: u.id, group: u.group, label: u.label, page: u.page })),
    quick: [
      { label: "Alles", select: () => true },
      { label: "🧩 Taalbeschouwing (les 4-8)", select: (u) => ["L4", "L5", "L6", "L7", "L8"].includes(u.group) },
      { label: "📣 Reclame, lay-out, uitnodiging (les 1-3)", select: (u) => ["L1", "L2", "L3"].includes(u.group) },
      { label: "❓ Les 6 – vragende vnw", select: (u) => u.group === "L6" },
      { label: "🔢 Les 7 – telwoord", select: (u) => u.group === "L7" },
      { label: "✍️ Voluit + spelling", select: (u) => u.id === "tw_voluit" || u.id === "tw_spelling" },
    ],
    settings: [
      { key: "paginas", type: "range", word: "p.", label: "Welke pagina's? <span class=\"muted\">(deel 1: p. 23–74)</span>", min: 23, max: 74, default: [23, 74],
        presets: [{ label: "Deel 1", v: [23, 74] }, { label: "Les 1", v: [24, 29] }, { label: "Les 2", v: [30, 33] }, { label: "Les 3", v: [34, 39] }, { label: "Les 4", v: [40, 45] }, { label: "Les 5", v: [46, 52] },
          { label: "Les 6", v: [53, 55] }, { label: "Les 7", v: [56, 60] }, { label: "Les 8", v: [61, 65] }, { label: "Taalschat", v: [66, 69] }],
        hint: "Alleen de aangevinkte onderdelen waarvan de leerstof op deze pagina's staat, komen in de toets." },
    ],
    describe: (s) => `p. ${s.paginas[0]}–${s.paginas[1]}`,
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
