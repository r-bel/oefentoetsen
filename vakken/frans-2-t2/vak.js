// ============================================================
// VAK – Frans 2de middelbaar · Trajet 2 · 1 (Le temps et les vacances)
// Oefeningen zoveel mogelijk in de stijl van het boek:
//   - Vocabulaire NL ↔ FR (met lidwoord), Il fait quel temps ?, On va …, seizoenen, windrichtingen
//   - Complète la phrase (voorbeeldzinnen uit de woordenlijst)
//   - Quel mot cherchons-nous ? Ajoute un article défini. (oef. 27)
//   - Fais des phrases avec les mots donnés. (oef. 26) → stukken in de juiste volgorde tikken
//   - Grammaire: le/la/l'/les, un/une, du/de la/de l'/au, en/au + saison, il va + infinitif,
//     Il fait chaud / C'est chaud, Actes de parole (vraag → antwoord, situatie → raad, de/d')
// Leerstof: inhoud.js. Nieuwe les = nieuw blok in LESSEN (dezelfde onderdelen werken dan mee).
// ============================================================
(function () {
  "use strict";
  const I = Vakken.inhoud("frans-2-t2");
  const TAGS = I.TAGS;
  const L = I.LESSEN.reduce((acc, les) => { Object.keys(les).forEach((k) => { if (Array.isArray(les[k])) acc[k] = (acc[k] || []).concat(les[k].map((x) => (typeof x === "object" && !Array.isArray(x) ? { ...x, les: les.id } : x))); }); return acc; }, {});

  // ---------- hulpfuncties (zelfde verbetering als Frans 5de leerjaar) ----------
  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rnd(a.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uniq = (arr) => [...new Set(arr)];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const strip = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const norm = (s) => String(s ?? "").toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.,!?;:«»"]/g, " ").replace(/'\s+/g, "'").replace(/\s+/g, " ").trim();
  function variants(text) {
    const out = [];
    text.split(/\s+\/\s+/).map((t) => t.trim()).filter(Boolean).forEach((p) => {
      if (p.includes("(")) { out.push(p.replace(/\(([^)]*)\)/g, "$1").replace(/\s+/g, " ").trim()); out.push(p.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim()); }
      else out.push(p);
    });
    return uniq(out);
  }
  const first = (t) => variants(t)[0];
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 3;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  const splitArt = (fr) => { const m = fr.trim().match(/^(?:(une|un|des|les|le|la)\s+|(l'))(.+)$/i); return m ? { art: (m[1] || m[2]).toLowerCase(), noun: m[3].trim() } : { art: "", noun: fr.trim() }; };
  const isVowel = (w) => /^[aeiouyhâàäéèêëîïôöûùü]/i.test(w);
  const typed = (level, p = 0.5) => (level === "easy" ? false : level === "hard" ? true : Math.random() < p);
  const nOpts = (level) => (level === "easy" ? 3 : 4);
  const mcOpts = (correct, pool, level) => shuffle([correct, ...shuffle(uniq(pool.filter((x) => norm(x) !== norm(correct)))).slice(0, nOpts(level))]);

  // ============================================================
  // ONDERDELEN
  // ============================================================
  const UNITS = [];
  const unit = (u) => { UNITS.push(u); return u; };
  const base = (u, o) => Object.assign({ unit: u.id, unitLabel: u.label, group: u.group, page: u.page, rule: u.rule }, o);

  // ---------- woordenschat NL ↔ FR ----------
  function vocabQ(u, w, i, dir, level, pool, opts = {}) {
    const isNoun = !!w.g;
    let q;
    if (dir === "nl-fr") {
      q = { instruction: opts.instrNlFr || (isNoun ? "Vertaal naar het Frans (met lidwoord)" : "Vertaal naar het Frans"), prompt: (opts.icon ? `<span class="icon">${w.icon}</span>` : "") + esc(w.nl),
        accepted: variants(w.fr), answerShown: esc(w.fr) + (isNoun && /^(l'|les )/.test(w.fr) ? ` <small>(${w.g})</small>` : ""), pool: pool.map((x) => first(x.fr)), right: first(w.fr) };
    } else {
      const nl = variants(w.nl).flatMap((x) => x.split(/\s+\/\s+/));
      q = { instruction: "Vertaal naar het Nederlands", prompt: esc(w.fr), accepted: uniq(nl.concat(nl.map((x) => x.replace(/^(een|de|het)\s+/i, "")))), answerShown: esc(w.nl), pool: pool.map((x) => first(x.nl)), right: first(w.nl) };
    }
    q = base(u, { ...q, page: w.p || u.page, direction: dir, isNoun: isNoun && dir === "nl-fr", hint: w.hint_nl && dir === "nl-fr" ? w.hint_nl : "", key: `${u.id}:${i}:${dir}`, itemLabel: `${w.fr} = ${w.nl}`, tag: opts.tag || "vertaling" });
    if (typed(level, opts.pTyped ?? 0.5)) return Object.assign(q, { mode: "text" });
    return Object.assign(q, { mode: "mc", options: mcOpts(q.right, q.pool, level).map((o) => ({ v: o, html: esc(o) })), answer: q.right });
  }
  const dirFor = (s, forced) => forced || (s.dir === "both" ? (Math.random() < 0.5 ? "nl-fr" : "fr-nl") : s.dir || "both");
  const vocabUnit = (id, label, page, list, rule, opts = {}) => unit({
    id, group: "V", label, page, rule, vocab: true,
    cases: () => list.map((w, i) => ({ w, i })),
    gen(level, c, s, dir) { return vocabQ(this, c.w, c.i, dirFor(s, dir), level, list, opts); },
  });
  vocabUnit("rappelle", "Vocabulaire – On se rappelle ?", "102", L.rappelle, "Leer elk zelfstandig naamwoord met zijn lidwoord (le, la, l', les).");
  vocabUnit("decouvre", "Vocabulaire – On découvre !", "104-106", L.decouvre, "Leer elk zelfstandig naamwoord met zijn lidwoord. Bij l' en les staat het geslacht: l'anorak (m), l'éclaircie (f).");
  vocabUnit("meteo", "Il fait quel temps ?", "103, 106, 108", L.meteo, "Il fait beau / chaud / froid / frais / mauvais / nuageux / pluvieux · Il y a du soleil / du vent / du brouillard · Il pleut · Il neige · Le temps est variable.", { icon: true, tag: "meteo", instrNlFr: "Il fait quel temps ? Zeg het in het Frans" });
  vocabUnit("activites", "On va … (activités)", "103, 107", L.activites, "faire du ski, faire de la plongée, faire de l'escalade, jouer au beach-volley, prendre un bain de soleil …");
  vocabUnit("saisons", "Les saisons et c'est où ?", "103, 106", [...L.saisons, ...L.richtingen.map((r) => ({ ...r, icon: r.icon }))], "en automne, en hiver, en été – maar au printemps · dans le nord, dans le sud, dans l'est, dans l'ouest.", { tag: "saison" });

  // ---------- Complète la phrase ----------
  const ZINNEN = L.decouvre.filter((w) => w.zin);
  unit({
    id: "trous", group: "E", label: "Complète la phrase", page: "104-106",
    rule: "Lees de hele zin: welk woord uit de woordenlijst past? Let op meervoud (des nuages) en vervoeging (on annonce, on prévoit).",
    cases: () => ZINNEN.map((w, i) => ({ w, i })),
    gen(level, { w, i }) {
      const ans = w.zin.match(/\[([^\]]+)\]/)[1];
      const q = base(this, { instruction: "Complète la phrase.", prompt: esc(w.zin.replace(/\[[^\]]+\]/, "_____")), hint: `${w.nl}`, page: w.p,
        accepted: [ans], answerShown: esc(w.zin.replace(/\[([^\]]+)\]/, "$1")), key: `trous:${i}`, itemLabel: w.zin.replace(/\[([^\]]+)\]/, "[$1]"), tag: "vertaling" });
      if (typed(level, 0.7)) return Object.assign(q, { mode: "text" });
      const pool = ZINNEN.filter((x) => x !== w && !!x.g === !!w.g).map((x) => x.zin.match(/\[([^\]]+)\]/)[1]);
      return Object.assign(q, { mode: "mc", options: mcOpts(ans, pool, level).map((o) => ({ v: o, html: esc(o) })), answer: ans });
    },
  });

  // ---------- Quel mot cherchons-nous ? (oef. 27) ----------
  unit({
    id: "definitions", group: "E", label: "Quel mot cherchons-nous ? (oef. 27)", page: "101",
    rule: "Lees de omschrijving en zoek het woord uit de woordenlijst. Schrijf het met een bepaald lidwoord: le, la, l' of les.",
    cases: () => L.definitions.map((d, i) => ({ d, i })),
    gen(level, { d, i }) {
      const q = base(this, { instruction: "Quel mot cherchons-nous ? Ajoute un article défini.", prompt: esc(d.def), accepted: variants(d.fr), answerShown: esc(d.fr), isNoun: true, direction: "nl-fr",
        key: `def:${i}`, itemLabel: `${d.def} → ${d.fr}`, tag: "vertaling", page: d.bron === "boek" ? "101" : "102-106" });
      if (typed(level, 0.6)) return Object.assign(q, { mode: "text" });
      const pool = L.definitions.filter((x) => x !== d).map((x) => first(x.fr));
      return Object.assign(q, { mode: "mc", options: mcOpts(first(d.fr), pool, level).map((o) => ({ v: o, html: esc(o) })), answer: first(d.fr) });
    },
  });

  // ---------- Fais des phrases avec les mots donnés (oef. 26) ----------
  function chunkSentence(zin, seed) {
    const words = zin.replace(/\s+([!?])/g, " $1").split(" ");
    const out = [];
    let k = 0, s = seed;
    while (k < words.length) { s = (s * 9301 + 49297) % 233280; const size = 1 + (s % 3); out.push(words.slice(k, k + size).join(" ")); k += size; }
    return out.map((c) => c.replace(/ /g, " "));
  }
  const PHRASES = [
    ...L.phrases.map((p) => ({ ...p })),
    ...ZINNEN.map((w, i) => ({ zin: w.zin.replace(/\[([^\]]+)\]/, "$1"), bron: "zin" , seed: i + 3 }))
      .filter((p) => p.zin.split(" ").length >= 5)
      .map((p) => ({ ...p, stukken: chunkSentence(p.zin, p.seed) }))
      .filter((p) => p.stukken.length >= 3 && p.stukken.length <= 6),
  ];
  unit({
    id: "phrases", group: "E", label: "Fais des phrases avec les mots donnés (oef. 26)", page: "101",
    rule: "Zoek eerst het onderwerp en het werkwoord. Een hoofdletter staat vooraan, het leesteken (. ! ?) achteraan.",
    cases: () => PHRASES.map((p, i) => ({ p, i })),
    gen(level, { p, i }) {
      let chunks = shuffle(p.stukken);
      for (let t = 0; t < 5 && chunks.join(" ") === p.stukken.join(" "); t++) chunks = shuffle(p.stukken);
      return base(this, { mode: "order", instruction: "Fais des phrases avec les mots donnés.", prompt: "", chunks, accepted: [p.zin, ...(p.alt || [])],
        answerShown: esc(p.zin), key: `phrase:${i}`, itemLabel: p.zin, tag: "phrase", page: p.bron === "boek" ? "101" : "104-106" });
    },
  });

  // ---------- le / la / l' / les  en  un / une ----------
  const NOUNS = [...L.rappelle, ...L.decouvre].filter((w) => w.g).map((w) => {
    const v = first(w.fr), sp = splitArt(v);
    return { ...w, v, art: sp.art, noun: sp.noun };
  });
  unit({
    id: "articles", group: "G", label: "Ajoute un article défini (le, la, l', les) / un, une", page: "102-105",
    rule: "le = mannelijk, la = vrouwelijk, l' = voor een klinker of stomme h (m of v!), les = meervoud. Bij l' moet je het geslacht kennen voor un/une: un anorak, une éclaircie.",
    cases: () => NOUNS.map((w, i) => ({ w, i })),
    gen(level, { w, i }) {
      if (w.art === "l'" && Math.random() < 0.5) {
        const ans = w.g === "m" ? "un" : "une";
        return base(this, { mode: typed(level, 0.4) ? "text" : "mc", instruction: "un of une?", prompt: `_____ ${esc(w.noun)} <small>(${esc(w.nl)})</small>`, accepted: [ans], options: ["un", "une"].map((o) => ({ v: o, html: o })), answer: ans,
          answerShown: `${ans} ${esc(w.noun)}`, key: `art:${i}:unune`, itemLabel: `${ans} ${w.noun}`, tag: "article", page: w.p });
      }
      const ans = w.art;
      return base(this, { mode: typed(level, 0.4) ? "text" : "mc", instruction: "Ajoute un article défini: le, la, l' of les.", prompt: `_____ ${esc(w.noun)} <small>(${esc(w.nl)})</small>`,
        accepted: ans === "l'" ? ["l'", "l"] : [ans], options: ["le", "la", "l'", "les"].map((o) => ({ v: o, html: o })), answer: ans,
        answerShown: esc(w.v) + (ans === "l'" || ans === "les" ? ` (${w.g})` : ""), key: `art:${i}`, itemLabel: w.v, tag: "article", page: w.p });
    },
  });

  // ---------- du / de la / de l' / au / à  ·  en / au + saison  ·  dans le / l' ----------
  const PART = [
    ...L.activites.filter((a) => a.lid).map((a) => ({ voor: a.lid[0], ans: a.lid[1], na: a.lid[2], opts: a.lid[1] === "au" || a.lid[1] === "à" ? ["au", "à la", "à l'", "aux", "à"] : ["du", "de la", "de l'", "des"], nl: a.nl, p: a.p, uitleg: "activiteit" })),
    ...L.partitif_meteo.map(([voor, ans, na]) => ({ voor, ans, na, opts: ["du", "de la", "de l'", "des"], p: "104-108", uitleg: "weer" })),
    ...L.saisons.map((x) => ({ voor: "", ans: x.prep, na: x.seizoen, opts: ["en", "au", "à la", "dans le"], nl: x.nl, p: x.p, uitleg: "seizoen" })),
    ...L.richtingen.map((x) => ({ voor: "dans", ans: x.art, na: x.fr.replace(/^dans (le |l')/, ""), opts: ["le", "la", "l'", "les"], nl: x.nl, p: x.p, uitleg: "richting" })),
  ];
  unit({
    id: "partitif", group: "G", label: "du, de la, de l', au · en / au printemps · dans le / l'", page: "103-108",
    rule: "faire du ski (m) · faire de la plongée (f) · faire de l'escalade (klinker) · jouer au volley (à + le = au) · il y a du vent · en été, en automne, en hiver, maar au printemps · dans le nord / dans l'est.",
    cases: () => PART.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      const glue = x.ans.endsWith("'") ? "" : " ";
      const zin = `${x.voor ? esc(x.voor) + " " : ""}_____ ${esc(x.na)}`.replace(/^_/, "_");
      const tag = x.uitleg === "seizoen" ? "saison" : "partitif";
      return base(this, { mode: typed(level, 0.4) ? "text" : "mc", instruction: "Vul aan.", prompt: zin + (x.nl ? ` <small>(${esc(x.nl)})</small>` : ""), accepted: [x.ans, x.ans.replace("'", "")],
        options: uniq([x.ans, ...x.opts]).slice(0, 5).map((o) => ({ v: o, html: esc(o) })), answer: x.ans,
        answerShown: `${x.voor ? esc(x.voor) + " " : ""}<b>${esc(x.ans)}</b>${glue}${esc(x.na)}`, key: `part:${i}`, itemLabel: `${x.voor} ${x.ans}${glue}${x.na}`.trim(), tag, page: x.p });
    },
  });

  // ---------- het weer morgen: il va + infinitief ----------
  unit({
    id: "futur", group: "G", label: "Il pleut → Demain, il va pleuvoir.", page: "106, 108",
    rule: "Wat er gaat gebeuren: il va + infinitief. Il va pleuvoir · Il va neiger · Il va faire beau.",
    cases: () => L.futur.map((f, i) => ({ f, i })),
    gen(level, { f, i }) {
      const q = base(this, { instruction: "Zet in de toekomst (futur proche).", prompt: `Aujourd'hui : ${esc(f.nu)}<br>Demain : Il _____ <small>(${esc(f.inf)})</small>`, accepted: [f.morgen, "il " + f.morgen],
        answerShown: `Il ${esc(f.morgen)}.`, key: `futur:${i}`, itemLabel: `Demain, il ${f.morgen}.`, tag: "futur", hint: f.nl });
      if (typed(level, 0.5)) return Object.assign(q, { mode: "text" });
      const verb = f.morgen.replace(/^va /, ""), nu = f.nu.replace(/^Il /, "").replace(/\.$/, "");
      const opts = shuffle(uniq([f.morgen, nu, "vas " + verb, "va " + nu.replace(/^fait /, "fait ")])).slice(0, 4);
      if (!opts.includes(f.morgen)) opts[0] = f.morgen;
      return Object.assign(q, { mode: "mc", options: shuffle(opts).map((o) => ({ v: o, html: esc(o) })), answer: f.morgen });
    },
  });

  // ---------- Il fait chaud / C'est chaud ----------
  unit({
    id: "chaud", group: "G", label: "Il fait chaud of C'est chaud ?", page: "102",
    rule: "Il fait chaud = het weer is warm. C'est chaud = het eten, de drank of een ding is warm.",
    cases: () => L.chaud.map((c, i) => ({ c, i })),
    gen(level, { c, i }) {
      const m = c.zin.match(/\[([^\]]+)\]/)[1].split(" / ");
      const opts = m.map((o, k) => ({ v: k === 0 ? "il fait" : "c'est", html: esc(o) }));
      return base(this, { mode: "mc", instruction: "Kies: het weer of een ding?", prompt: esc(c.zin.replace(/\[[^\]]+\]/, "_____")), options: opts, answer: c.juist,
        answerShown: esc(m[c.juist === "il fait" ? 0 : 1]) + " — " + esc(c.uitleg), key: `chaud:${i}`, itemLabel: c.zin, tag: "chaud" });
    },
  });

  // ---------- Actes de parole ----------
  const ACTES = [
    ...L.actes.map((a) => ({ t: "vraag", ...a })),
    ...L.conseils.map((a) => ({ t: "conseil", vraag: a.situatie, ok: a.ok, fout: a.fout })),
    ...L.oublie.map(([voor, ans, na]) => ({ t: "de", voor, ans, na })),
  ];
  unit({
    id: "actes", group: "G", label: "Actes de parole: parler du temps, donner des conseils", page: "108",
    rule: "Tu vas où ? → Je vais à la côte. · Tu vas faire quoi ? → Je vais faire … · Il fait quel temps ? → Il fait … · Raad geven: Il faut / Il vaut mieux + infinitief, N'oublie pas de/d' + infinitief · Reageren: D'accord. / Bonne idée. / Merci pour le conseil.",
    cases: () => ACTES.map((a, i) => ({ a, i })),
    gen(level, { a, i }) {
      if (a.t === "de") return base(this, { mode: "mc", instruction: "de of d' ?", prompt: `${esc(a.voor)} _____ ${esc(a.na)}`, options: ["de", "d'"].map((o) => ({ v: o, html: o })), answer: a.ans,
        answerShown: `${esc(a.voor)} ${esc(a.ans)}${a.ans === "de" ? " " : ""}${esc(a.na)}`, key: `actes:${i}`, itemLabel: `${a.voor} ${a.ans} ${a.na}`, tag: "actes" });
      const opts = shuffle([a.ok, ...shuffle(a.fout).slice(0, nOpts(level))]);
      return base(this, { mode: "mc", instruction: a.t === "vraag" ? "Kies het passende antwoord." : "Welke raad past bij deze situatie?", prompt: esc(a.vraag),
        options: opts.map((o) => ({ v: o, html: esc(o) })), answer: a.ok, answerShown: esc(a.ok), key: `actes:${i}`, itemLabel: `${a.vraag} → ${a.ok}`, tag: "actes" });
    },
  });

  // ============================================================
  // TOETS SAMENSTELLEN
  // ============================================================
  const casesOf = (u) => u.cases();
  function makeQuiz(s) {
    const sel = UNITS.filter((u) => s.units.includes(u.id));
    if (!sel.length) return [];
    const out = [];
    const fin = (u, q) => Object.assign(q, { _case: q._case });
    if (s.count === "all") {
      sel.forEach((u) => casesOf(u).forEach((c) => {
        if (u.vocab && s.dir === "both" && s.bothDirs) ["nl-fr", "fr-nl"].forEach((d) => out.push(Object.assign(u.gen(s.level, c, s, d), { _c: c })));
        else out.push(Object.assign(u.gen(s.level, c, s), { _c: c }));
      }));
      return shuffle(out);
    }
    const decks = {};
    for (let i = 0; out.length < s.count && i < s.count * 4; i++) {
      const u = pick(sel.flatMap((x) => (x.vocab ? [x, x] : [x])));
      if (!decks[u.id] || !decks[u.id].length) decks[u.id] = shuffle(casesOf(u));
      const c = decks[u.id].pop();
      out.push(fin(u, Object.assign(u.gen(s.level, c, s), { _c: c })));
    }
    return shuffle(out);
  }
  function countAll(s) {
    return UNITS.filter((u) => s.units.includes(u.id)).reduce((a, u) => a + casesOf(u).length * (u.vocab && s.dir === "both" && s.bothDirs ? 2 : 1), 0);
  }
  const KEY_UNIT = { trous: "trous", def: "definitions", phrase: "phrases", art: "articles", part: "partitif", futur: "futur", chaud: "chaud", actes: "actes" };
  function fromKey(key, level, s = {}) {
    const [pre, idx, dir] = key.split(":"), u = UNITS.find((x) => x.id === (KEY_UNIT[pre] || pre));
    if (!u) return null;
    const c = u.cases()[+idx];
    if (!c) return null;
    const d = u.vocab ? (dir === "nl-fr" || dir === "fr-nl" ? dir : undefined) : undefined;
    return Object.assign(u.gen(level, c, { dir: s.dir || "both" }, d), { _c: c });
  }
  function regen(q, level) {
    const u = UNITS.find((x) => x.id === q.unit);
    return q._c ? Object.assign(u.gen(level, q._c, { dir: "both" }, q.direction || undefined), { _c: q._c }) : { ...q };
  }

  // ============================================================
  // VERBETEREN
  // ============================================================
  function check(given, q, level) {
    let r;
    if (q.mode === "mc") r = norm(given) === norm(q.answer) ? { status: "correct" } : { status: "wrong", tag: q.tag || "fout" };
    else if (q.mode === "order") r = q.accepted.some((a) => norm(a) === norm(given)) ? { status: "correct" } : { status: "wrong", tag: "phrase" };
    else {
      const a = norm(given), acc = q.accepted.map(norm);
      if (!a) r = { status: "wrong", tag: q.tag };
      else if (acc.includes(a)) r = { status: "correct" };
      else if (acc.some((x) => strip(x) === strip(a))) r = { status: "accent", tag: "accent" };
      else if (q.isNoun && acc.some((x) => strip(splitArt(x).noun) === strip(splitArt(a).noun))) r = { status: "article", tag: "article" };
      else if (acc.some((x) => x.length > 3 && lev(strip(x), strip(a)) <= 1)) r = { status: "spelling", tag: "spelling" };
      else r = { status: "wrong", tag: q.tag || "fout" };
    }
    r.points = r.status === "correct" ? 1 : r.status === "accent" ? (level === "hard" ? 0 : 1) : 0;
    if (r.status === "accent" && level === "hard") r.strictNote = "(op 'Moeilijk' telt een accentfout als fout)";
    return r;
  }

  // ============================================================
  // FOUTANALYSE
  // ============================================================
  function conclusions(results) {
    const out = [], total = results.length, pts = results.reduce((a, r) => a + r.points, 0), pct = total ? Math.round((pts / total) * 100) : 0;
    out.push(pct >= 90 ? { type: "good", text: `Knap! ${pct}% juist.` } : pct >= 70 ? { type: "ok", text: `${pct}% juist: een goede basis, nog enkele werkpunten.` } : { type: "bad", text: `${pct}% juist: deze leerstof moet nog grondig herhaald worden.` });
    const tags = {};
    results.forEach((r) => { if (r.status !== "correct" && r.tag && TAGS[r.tag]) tags[r.tag] = (tags[r.tag] || 0) + 1; });
    Object.entries(tags).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => { const g = TAGS[t]; out.push({ type: n >= 2 ? "bad" : "ok", text: `<b>${g.title}</b> (${n}×): ${g.advice}${g.page ? ` <small>p.${g.page}</small>` : ""}` }); });
    const dir = (d) => { const rs = results.filter((r) => r.q.direction === d); return rs.length ? rs.reduce((a, r) => a + r.points, 0) / rs.length : null; };
    const nf = dir("nl-fr"), fn = dir("fr-nl");
    if (nf !== null && fn !== null && results.filter((r) => r.q.direction).length >= 6 && fn - nf > 0.2) out.push({ type: "ok", text: `Frans → Nederlands lukt beter (${Math.round(fn * 100)}%) dan Nederlands → Frans (${Math.round(nf * 100)}%): je herkent de woorden, maar kan ze nog niet zelf schrijven. Oefen extra NL ➔ FR.` });
    if (!results.some((r) => r.status !== "correct") && total) out.push({ type: "good", text: "Geen enkele fout. Probeer eens een hoger niveau of meer vragen." });
    return out;
  }

  // ============================================================
  // KAARTEN (studiemodule): per woord eerst herkennen (FR → NL), dan zelf schrijven (NL → FR)
  // ============================================================
  const gOf = (w) => (w.g === "m" || w.g === "f" ? w.g : "");
  function kaarten(s) {
    const sel = s && Array.isArray(s.units) ? s.units : null;
    const dir = (s && s.dir) || "both";
    const dirs = dir === "both" ? ["fr-nl", "nl-fr"] : [dir];
    const out = [];
    UNITS.filter((u) => u.vocab && (!sel || sel.includes(u.id))).forEach((u) => u.cases().forEach(({ w, i }) => {
      const page = w.p || u.page, zin = w.zin ? esc(w.zin.replace(/\[([^\]]+)\]/, "$1")) : "", g = gOf(w);
      const gl = g && /^(l'|les )/i.test(w.fr) ? ` <small>(${g})</small>` : "";
      const icon = w.icon ? `<span class="icon">${w.icon}</span>` : "";
      dirs.forEach((d) => out.push(d === "fr-nl"
        ? { key: `${u.id}:${i}:fr-nl`, unit: u.id, soort: "FR ➔ NL", ask: "Wat betekent dit?", front: esc(w.fr) + gl, g, back: icon + esc(w.nl), info: zin ? `<i>${zin}</i>` : "", page, label: `${w.fr} = ${w.nl}`, lang: "fr" }
        : { key: `${u.id}:${i}:nl-fr`, unit: u.id, soort: "NL ➔ FR", ask: g ? "Hoe zeg je dit in het Frans (met lidwoord)?" : "Hoe zeg je dit in het Frans?", front: icon + esc(w.nl), back: esc(w.fr) + gl, backG: g, info: zin ? `<i>${zin}</i>` : "", tip: w.hint_nl ? esc(w.hint_nl) : "", page, label: `${w.nl} = ${w.fr}`, lang: "fr",
            na: dirs.length > 1 ? `${u.id}:${i}:fr-nl` : undefined }));
    }));
    return out;
  }

  // ============================================================
  // Aansluiting op de gedeelde app
  // ============================================================
  Vakken.register({
    id: "frans-2-t2", vak: I.vak, icon: I.icon, theme: I.theme, titel: I.titel, klas: I.klas, bron: I.bron,
    groups: [
      { id: "V", short: "vocabulaire", titel: "Vocabulaire", p: "102-108" },
      { id: "E", short: "oefeningen", titel: "Oefeningen zoals in het boek", p: "101-106" },
      { id: "G", short: "grammaire", titel: "Grammaire & actes de parole", p: "102-108" },
    ],
    units: UNITS.map((u) => ({ id: u.id, group: u.group, label: u.label, page: u.page })),
    quick: [
      { label: "Alles", select: () => true },
      { label: "📚 Enkel vocabulaire", select: (u) => u.group === "V" },
      { label: "✍️ Oefeningen zoals in het boek", select: (u) => u.group === "E" },
      { label: "🧩 Grammaire & actes de parole", select: (u) => u.group === "G" },
    ],
    settings: [
      { key: "dir", label: 'Richting <span class="muted">(vocabulaire)</span>', type: "radio", default: "both",
        options: [{ v: "nl-fr", label: "NL ➔ FR" }, { v: "fr-nl", label: "FR ➔ NL" }, { v: "both", label: "Beide" }] },
      { key: "bothDirs", type: "checkbox", default: false, label: "Elk woord in <b>beide</b> richtingen vragen (NL ➔ FR én FR ➔ NL)", showIf: (s) => s.dir === "both" },
    ],
    levels: {
      easy: { title: "🙂 Makkelijk", desc: "alles meerkeuze (zinsbouw blijft tikken)" },
      normal: { title: "💪 Normaal", desc: "meerkeuze + typen, accentfout telt nog als goed" },
      hard: { title: "🔥 Moeilijk", desc: "alles typen, accent en lidwoord moeten juist zijn" },
    },
    allInfo: "<b>Eindtoets-modus:</b> elk woord, elke zin en elke oefening uit de gekozen onderdelen komt precies één keer aan bod.",
    keyboard: ["é", "è", "ê", "à", "â", "ç", "ù", "û", "ô", "î", "ë", "ï", "'"], keyboardLabel: "Klik om accenten in te voegen:",
    statusText: { accent: "Bijna: let op het accent.", article: "Het woord is juist, maar het lidwoord niet.", spelling: "Bijna: één letter fout." },
    tags: TAGS,
    makeQuiz, countAll, check, conclusions, regen, fromKey,
    kaarten, kaartUnits: UNITS.filter((u) => u.vocab).map((u) => u.id),
    _UNITS: UNITS, // voor tests
  });
})();
