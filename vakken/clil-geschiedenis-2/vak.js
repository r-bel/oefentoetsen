// ============================================================
// VAK – CLIL Geschiedenis in het Frans (2de middelbaar)
// Vragen in het Frans zoals in de cursus; Nederlandse hulp waar nuttig.
// Leerstof: inhoud.js. Elk onderdeel = unit({ id, group, items(s), gen(level, i, s) }).
// ============================================================
(function () {
  "use strict";
  const I = Vakken.inhoud("clil-geschiedenis-2");
  const { VOCAB, CM, MOTS, TABLEAU, CHRONO, GEO, INDO, PAS_INDO, DEFS, TAGS, JO_VOCAB, OLYMPIE, JO_QUEST, JO_CHRONO, JO_SPORTS, JO_PHRASES } = I;

  const rnd = (n) => Math.floor(Math.random() * n);
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uniq = (arr) => [...new Set(arr)];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const strip = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const norm = (s) => String(s ?? "").toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.!?;:«»"()]/g, " ").replace(/\s+/g, " ").trim();
  const noArt = (s) => s.replace(/^(une|un|les|le|la|des|du|de la)\s+/, "").replace(/^(de l'|l')/, "");
  const typed = (level, p = 0.5) => (level === "easy" ? false : level === "hard" || Vakken.vast ? true : Math.random() < p);
  const nOpts = (level) => (level === "easy" ? 3 : 4);
  const CM_NAAM = { C: "la Crète (Cnossos)", M: "Mycènes" };

  // tekstcontrole: juist / accent / fout (lidwoord mag weg)
  function checkText(given, accepted) {
    const g = norm(given), acc = accepted.flatMap((a) => a.split(/\s+\/\s+/)).map(norm);
    if (!g) return { status: "wrong" };
    const ok = (x) => acc.includes(x) || acc.map(noArt).includes(noArt(x));
    if (ok(g)) return { status: "correct" };
    const parts = g.split(/\s*[\/,;]\s*|\s+of\s+|\s+ou\s+/).filter(Boolean); // meerdere betekenissen samen
    if (parts.length > 1 && parts.every(ok)) return { status: "correct" };
    if (acc.map((a) => strip(noArt(a))).includes(strip(noArt(g)))) return { status: "accent", tag: "accent" };
    return { status: "wrong" };
  }

  // ============================================================
  // ONDERDELEN
  // ============================================================
  const UNITS = [];
  const unit = (u) => { UNITS.push(u); return u; };
  const base = (u, o) => Object.assign({ unit: u.id, unitLabel: u.label, group: u.group, page: u.page, rule: u.rule }, o);
  const mc = (q, right, wrong, level) => Object.assign(q, { mode: "mc", options: shuffle(uniq([right, ...shuffle(uniq(wrong.filter((w) => w !== right))).slice(0, nOpts(level) - 1)])).map((o) => ({ v: o, html: esc(o) })), answer: right });

  // ---------- V. vocabulaire ----------
  function vocabUnit(id, group, label, page, rule, LIST) {
    return unit({
      id, group, label, page, tag: "vocab", rule,
      items: () => LIST.map((w, i) => ({ w, i })),
      gen(level, { w, i }, s, dir) {
        dir = dir || (s.dir === "both" || !s.dir ? (Math.random() < 0.5 ? "fr-nl" : "nl-fr") : s.dir);
        if (dir === "fr-nl") {
          const q = base(this, { instruction: "Traduis en néerlandais.", prompt: esc(w.fr), answerShown: esc(w.nl), key: `${id}:${i}:fr-nl`, itemLabel: `${w.fr} = ${w.nl}`, direction: dir });
          if (typed(level)) return Object.assign(q, { mode: "text", noKeyboard: true, chk: (g) => checkText(g, w.nl.split(" / ").concat(w.nl.split(" / ").map((x) => x.replace(/^(een|de|het)\s+/, "")))) });
          return mc(q, w.nl, LIST.map((x) => x.nl), level);
        }
        const q = base(this, { instruction: "Traduis en français (avec l'article).", prompt: `<span class="icon">${w.icon}</span>${esc(w.nl)}`, answerShown: esc(w.fr), key: `${id}:${i}:nl-fr`, itemLabel: `${w.nl} = ${w.fr}`, direction: dir });
        if (typed(level)) return Object.assign(q, { mode: "text", chk: (g) => checkText(g, [w.fr]) });
        return mc(q, w.fr, LIST.map((x) => x.fr), level);
      },
    });
  }
  function motdefUnit(id, group, label, page, rule, LIST) {
    return unit({
      id, group, label, page, tag: "vocab", rule,
      items: () => LIST.map((w, i) => ({ w, i })),
      gen(level, { w, i }) {
        const q = base(this, { instruction: "Cherche le mot qui correspond.", prompt: `<span class="icon">${w.icon}</span>${esc(w.def)}`, answerShown: `${esc(w.fr)} <small>(${esc(w.nl)})</small>`, key: `${id}:${i}`, itemLabel: `${w.def} → ${w.fr}` });
        if (level === "hard") return Object.assign(q, { mode: "text", chk: (g) => checkText(g, [w.fr]) });
        return mc(q, w.fr, LIST.map((x) => x.fr), level);
      },
    });
  }
  const VOCAB_UNITS = ["vocab", "jovocab"];
  vocabUnit("vocab", "V", "Vocabulaire FR ↔ NL", "39", "Leer elk woord met zijn lidwoord: un orfèvre, une forteresse, un masque mortuaire, l'agriculture, le pouvoir, une guerre, du commerce, une tombe royale, un mur d'enceinte.", VOCAB);
  motdefUnit("motdef", "V", "Cherche le mot qui correspond", "39", "Lees de omschrijving en zoek het woord uit de lijst van p.39.", VOCAB);

  // ---------- C. Crète ↔ Mycènes ----------
  unit({
    id: "cm", group: "C", label: "Crète ou Mycènes ?", page: "40-41", tag: "cm",
    rule: TAGS.cm.advice,
    items: () => CM.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      return base(this, { mode: "mc", instruction: "Crète ou Mycènes ?", prompt: esc(x.s), options: ["C", "M"].map((c) => ({ v: c, html: esc(CM_NAAM[c]) })), answer: x.c, answerShown: esc(CM_NAAM[x.c]), key: `cm:${i}`, itemLabel: `${x.s} → ${x.c === "C" ? "Crète" : "Mycènes"}`, tag: "cm" });
    },
  });
  // bank-vragen (tableau, chronologie, géographie): meerkeuze, op 'moeilijk' typen als typ: true
  function bankUnit(id, group, label, page, tag, bank, rule, pool) {
    return unit({
      id, group, label, page, tag, rule,
      items: () => bank.map((x, i) => ({ x, i })),
      gen(level, { x, i }) {
        const show = x.show || x.a[0];
        const q = base(this, { instruction: label, prompt: esc(x.q), answerShown: esc(show) + (x.x ? ` <small>(${esc(x.x)})</small>` : ""), key: `${id}:${i}`, itemLabel: `${x.q} → ${show}`, page: x.p || page, tag });
        if (x.typ && typed(level, 0.35) && level !== "easy") return Object.assign(q, { mode: "text", hint: level === "normal" ? `mots à employer: ${shuffle(pool ? pool.filter((m) => m !== show).slice(0, 3).concat(show) : [show]).join(" / ")}` : "", chk: (g) => checkText(g, x.a) });
        const wrong = x.opts || (pool || bank.map((b) => b.show || b.a[0])).filter((m) => !x.a.includes(m));
        return mc(q, show, wrong, level);
      },
    });
  }
  bankUnit("tableau", "C", "Remplis le tableau (Crète / Mycènes)", "40-41", "cm", TABLEAU, "Gebruik de woorden van p.41: palais / forteresse / ouvert / fermé / fresques / minoenne / mycénienne / Doriens / Mycéniens / une éruption volcanique …", MOTS);

  // ---------- T. chronologie ----------
  bankUnit("chrono", "T", "Chronologie", "37-42", "dates", CHRONO, TAGS.dates.advice);

  // ---------- G. géographie + Indo-Européens ----------
  bankUnit("geo", "G", "La carte de la Grèce", "38, 42", "geo", GEO, TAGS.geo.advice);
  unit({
    id: "indo", group: "G", label: "Les peuples indo-européens", page: "38", tag: "indo",
    rule: TAGS.indo.advice,
    items: () => INDO.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      const neg = level !== "easy" && Math.random() < 0.35;
      if (neg) {
        const bad = PAS_INDO[i % PAS_INDO.length];
        return base(this, { mode: "mc", instruction: "Lequel n'est PAS un peuple indo-européen ?", prompt: "Expansion des Indo-Européens", options: shuffle([bad, ...shuffle(INDO).slice(0, nOpts(level) - 1)]).map((o) => ({ v: o, html: esc(o) })), answer: bad, answerShown: esc(bad), key: `indo:${i}`, itemLabel: `indo-européen: ${x}`, tag: "indo" });
      }
      return base(this, { mode: "mc", instruction: "Lequel est un peuple indo-européen ?", prompt: "Expansion des Indo-Européens", options: shuffle([x, ...shuffle(PAS_INDO).slice(0, nOpts(level) - 1)]).map((o) => ({ v: o, html: esc(o) })), answer: x, answerShown: esc(x), key: `indo:${i}`, itemLabel: `indo-européen: ${x}`, tag: "indo" });
    },
  });

  // ---------- L. Leçon 6: définitions ----------
  unit({
    id: "defs", group: "L", label: "Fais la bonne combinaison (Hellas, la Grèce, polis, acropole)", page: "42", tag: "defs",
    rule: TAGS.defs.advice,
    items: () => DEFS.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      if (Math.random() < 0.5 || level === "easy") {
        const q = base(this, { instruction: "Fais la bonne combinaison: que signifie …", prompt: esc(x.t), answerShown: esc(x.d), key: `defs:${i}`, itemLabel: `${x.t} = ${x.d}`, tag: "defs" });
        return mc(q, x.d, DEFS.map((d) => d.d), level);
      }
      const q = base(this, { instruction: "Fais la bonne combinaison: quel mot correspond ?", prompt: esc(x.d), answerShown: esc(x.t), key: `defs:${i}`, itemLabel: `${x.d} = ${x.t}`, tag: "defs" });
      if (level === "hard") return Object.assign(q, { mode: "text", chk: (g) => checkText(g, [x.t]) });
      return mc(q, x.t, DEFS.map((d) => d.t), level);
    },
  });


  // ---------- JO. Les jeux Olympiques (p.50-57) ----------
  vocabUnit("jovocab", "JV", "Vocabulaire des JO FR ↔ NL", "50-57", "Leer elk woord met lidwoord: le sanctuaire, un autel, le stade, l'hippodrome, la palestre, le gymnase, une couronne d'olivier, le pugilat, la lutte …", JO_VOCAB);
  motdefUnit("jomotdef", "JV", "JO: cherche le mot qui correspond", "50-57", "Lees de omschrijving en zoek het woord.", JO_VOCAB);

  // het heiligdom van Olympia: nummer ↔ gebouw ↔ functie
  const olyNum = (o) => `n° ${o.n}`;
  unit({
    id: "olynum", group: "JO", label: "Le sanctuaire d'Olympie: à quoi réfèrent les numéros ?", page: "50-51", tag: "olympie",
    rule: TAGS.olympie.advice,
    items: () => OLYMPIE.map((o, i) => ({ o, i })),
    gen(level, { o, i }) {
      const q = base(this, { instruction: "Regarde la reconstitution du sanctuaire d'Olympie. À quoi réfère le numéro … ?", prompt: `<span class="icon">🏛️</span>Numéro <b>${o.n}</b>`, answerShown: `${o.n} = ${esc(o.t)}`, key: `olynum:${i}`, itemLabel: `${o.n} = ${o.t}`, tag: "olympie" });
      if (level === "hard") return Object.assign(q, { mode: "text", chk: (g) => checkText(g, [o.t]) });
      return mc(q, o.t, OLYMPIE.map((x) => x.t), level);
    },
  });
  unit({
    id: "olyfn", group: "JO", label: "Olympie: quel bâtiment ? (fonction)", page: "51, 54", tag: "olympie",
    rule: TAGS.olympie.advice,
    items: () => OLYMPIE.map((o, i) => ({ o, i })),
    gen(level, { o, i }) {
      if (Math.random() < 0.5 && !Vakken.vast) {
        const q = base(this, { instruction: "Fais la bonne combinaison: à quoi sert …", prompt: esc(o.t), answerShown: esc(o.f), key: `olyfn:${i}`, itemLabel: `${o.t} = ${o.f}`, tag: "olympie" });
        return mc(q, o.f, OLYMPIE.map((x) => x.f), level);
      }
      const q = base(this, { instruction: "Fais la bonne combinaison: quel bâtiment ?", prompt: esc(o.f), answerShown: `${esc(o.t)} <small>(${olyNum(o)})</small>`, key: `olyfn:${i}`, itemLabel: `${o.f} = ${o.t}`, tag: "olympie" });
      if (level === "hard") return Object.assign(q, { mode: "text", chk: (g) => checkText(g, [o.t]) });
      return mc(q, o.t, OLYMPIE.map((x) => x.t), level);
    },
  });
  // sporten: omschrijving → sport, en "fait partie du pentathlon ?"
  const SPORT_POOL = JO_SPORTS.map((x) => x.a[0]);
  unit({
    id: "josport", group: "JO", label: "Les épreuves: le pentathlon et les autres sports", page: "53", tag: "sport",
    rule: TAGS.sport.advice,
    items: () => JO_SPORTS.map((x, i) => ({ x, i })),
    gen(level, { x, i }) {
      if (level !== "easy" && Math.random() < 0.35 && !Vakken.vast) {
        const inP = x.s === "pentathlon";
        return base(this, { mode: "mc", instruction: "Est-ce que ce sport fait partie du pentathlon ?", prompt: esc(x.a[0]), options: [{ v: "oui", html: "oui, dans le pentathlon" }, { v: "non", html: "non, pas dans le pentathlon" }], answer: inP ? "oui" : "non", answerShown: inP ? "oui" : "non", key: `josport:${i}`, itemLabel: `${x.a[0]}: ${x.s}`, tag: "sport" });
      }
      const q = base(this, { instruction: "Quel sport ?", prompt: esc(x.q), answerShown: `${esc(x.a[0])} <small>(${esc(x.s)})</small>`, key: `josport:${i}`, itemLabel: `${x.q} → ${x.a[0]}`, tag: "sport" });
      if (typed(level, 0.35) && level !== "easy") return Object.assign(q, { mode: "text", hint: level === "normal" ? `mots à employer: ${shuffle(SPORT_POOL).join(" / ")}` : "", chk: (g) => checkText(g, x.a) });
      return mc(q, x.a[0], SPORT_POOL, level);
    },
  });
  bankUnit("joquest", "JQ", "Les jeux Olympiques: questions des groupes A–E", "50-57", "jo", JO_QUEST, TAGS.jo.advice);
  bankUnit("jochrono", "JQ", "Les jeux Olympiques: chronologie", "50-57", "jodates", JO_CHRONO, TAGS.jodates.advice);
  // vragen correct formuleren (woordvolgorde)
  const nz = (t) => norm(t).replace(/\s*\?\s*$/, "").replace(/\s+'/g, "'").replace(/'\s+/g, "'");
  unit({
    id: "jophrase", group: "JQ", label: "Fais de bonnes questions (mots dans le bon ordre)", page: "50", tag: "fout",
    rule: "Een vraag in het Frans: vraagwoord (Qui / Quel / Pourquoi / Qu'est-ce que / Est-ce que) vooraan, het vraagteken achteraan met een spatie ervoor.",
    items: () => JO_PHRASES.map((p, i) => ({ p, i })),
    gen(level, { p, i }) {
      let chunks = shuffle(p.stukken);
      for (let t = 0; t < 6 && chunks.join(" ") === p.stukken.join(" "); t++) chunks = shuffle(p.stukken);
      return base(this, { mode: "order", instruction: "Fais de bonnes questions: mets les mots dans le bon ordre.", prompt: "", chunks, answerShown: esc(p.zin), key: `jophrase:${i}`, itemLabel: p.zin,
        chk: (g) => (nz(g) === nz(p.zin) ? { status: "correct" } : { status: "wrong" }) });
    },
  });

  // ============================================================
  // TOETS
  // ============================================================
  function makeQuiz(s) {
    const units = UNITS.filter((u) => s.units.includes(u.id));
    const both = s.dir === "both" && s.bothDirs;
    const all = [];
    units.forEach((u) => u.items(s).forEach((it) => {
      if (VOCAB_UNITS.includes(u.id) && both) { all.push([u, it, "fr-nl"], [u, it, "nl-fr"]); } else all.push([u, it]);
    }));
    let pick;
    if (s.count === "all") pick = all;
    else { pick = []; while (pick.length < s.count && all.length) pick.push(...shuffle(all).slice(0, s.count - pick.length)); }
    const qs = pick.map(([u, it, d]) => u.gen(s.level, it, s, d));
    return s.ordered ? qs : shuffle(qs);
  }
  const countAll = (s) => UNITS.filter((u) => s.units.includes(u.id)).reduce((a, u) => a + u.items(s).length * (VOCAB_UNITS.includes(u.id) && s.dir === "both" && s.bothDirs ? 2 : 1), 0);
  function regen(q, level) { const u = UNITS.find((x) => x.id === q.unit); return fromKey(q.key, level) || q; }
  function fromKey(key, level, s = {}) {
    const [id, a, d] = key.split(":"), u = UNITS.find((x) => x.id === id), i = +a;
    if (!u || isNaN(i)) return null;
    const it = u.items(s)[i];
    return it ? u.gen(level, it, { dir: d || "both" }, d) : null;
  }
  function check(given, q, level) {
    let r = q.mode === "mc" ? (given === q.answer ? { status: "correct" } : { status: "wrong", tag: q.tag }) : q.chk(given, level);
    if (r.status !== "correct" && !r.tag) r.tag = q.tag || "fout";
    r.points = r.status === "correct" ? 1 : r.status === "accent" ? (level === "hard" ? 0 : 1) : 0;
    if (r.status === "accent" && level === "hard") r.strictNote = "(op 'Moeilijk' telt een accentfout als fout)";
    return r;
  }
  function conclusions(results) {
    const out = [], total = results.length, pts = results.reduce((a, r) => a + r.points, 0), pct = total ? Math.round((pts / total) * 100) : 0;
    out.push(pct >= 90 ? { type: "good", text: `Très bien ! ${pct}% juist.` } : pct >= 70 ? { type: "ok", text: `${pct}% juist: een goede basis, nog enkele werkpunten.` } : { type: "bad", text: `${pct}% juist: lees de cursus (p.37-42, p.50-57) nog eens en oefen opnieuw.` });
    const tags = {};
    results.forEach((r) => { if (r.status !== "correct" && TAGS[r.tag] && r.tag !== "fout") tags[r.tag] = (tags[r.tag] || 0) + 1; });
    Object.entries(tags).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => { const g = TAGS[t]; out.push({ type: n >= 2 ? "bad" : "ok", text: `<b>${g.title}</b> (${n}×): ${g.advice}${g.page ? ` <small>p.${g.page}</small>` : ""}` }); });
    return out;
  }

  // ============================================================
  // KAARTEN (studiemodule) – zelfde sleutels als de toetsvragen
  // ============================================================
  const KAART_UNITS = ["vocab", "cm", "tableau", "chrono", "geo", "defs", "jovocab", "olynum", "olyfn", "josport", "joquest", "jochrono"];
  function kaarten(s) {
    const sel = s && Array.isArray(s.units) ? s.units : KAART_UNITS;
    const dir = (s && s.dir) || "both", dirs = dir === "both" ? ["fr-nl", "nl-fr"] : [dir];
    const out = [];
    const voc = (id, LIST, page) => { if (sel.includes(id)) LIST.forEach((w, i) => dirs.forEach((d) => out.push(d === "fr-nl"
      ? { key: `${id}:${i}:fr-nl`, unit: id, soort: "FR ➔ NL", ask: "Que signifie … ?", front: esc(w.fr), back: `<span class="icon">${w.icon}</span>${esc(w.nl)}`, info: `<i>${esc(w.def)}</i>`, page, label: `${w.fr} = ${w.nl}`, lang: "fr" }
      : { key: `${id}:${i}:nl-fr`, unit: id, soort: "NL ➔ FR", ask: "En français, avec l'article ?", front: `<span class="icon">${w.icon}</span>${esc(w.nl)}`, back: esc(w.fr), info: `<i>${esc(w.def)}</i>`, page, label: `${w.nl} = ${w.fr}`, lang: "fr", na: dirs.length > 1 ? `${id}:${i}:fr-nl` : undefined }))); };
    voc("vocab", VOCAB, "39");
    if (sel.includes("cm")) CM.forEach((x, i) => out.push({ key: `cm:${i}`, unit: "cm", soort: "Crète ou Mycènes ?", ask: "Crète ou Mycènes ?", front: esc(x.s), back: esc(CM_NAAM[x.c]), page: "40-41", label: `${x.s} → ${CM_NAAM[x.c]}`, lang: "fr" }));
    const bank = (id, arr, soort) => { if (sel.includes(id)) arr.forEach((x, i) => out.push({ key: `${id}:${i}`, unit: id, soort, ask: "", front: esc(x.q), back: esc(x.show || x.a[0]), info: x.x ? esc(x.x) : "", page: x.p || "40", label: `${x.q} → ${x.show || x.a[0]}`, lang: "fr" })); };
    bank("tableau", TABLEAU, "Tableau"); bank("chrono", CHRONO, "Chronologie"); bank("geo", GEO, "Carte");
    voc("jovocab", JO_VOCAB, "50-57");
    if (sel.includes("olynum")) OLYMPIE.forEach((o, i) => out.push({ key: `olynum:${i}`, unit: "olynum", soort: "Olympie", ask: "À quoi réfère le numéro … ?", front: `Numéro ${o.n}`, back: esc(o.t), info: esc(o.f), page: "50-51", label: `${o.n} = ${o.t}`, lang: "fr" }));
    if (sel.includes("olyfn")) OLYMPIE.forEach((o, i) => out.push({ key: `olyfn:${i}`, unit: "olyfn", soort: "Olympie", ask: "Quel bâtiment ?", front: esc(o.f), back: esc(o.t), page: "51, 54", label: `${o.f} = ${o.t}`, lang: "fr" }));
    if (sel.includes("josport")) JO_SPORTS.forEach((x, i) => out.push({ key: `josport:${i}`, unit: "josport", soort: "Sport", ask: "Quel sport ?", front: esc(x.q), back: esc(x.a[0]), info: esc(x.s), page: "53", label: `${x.q} → ${x.a[0]}`, lang: "fr" }));
    bank("joquest", JO_QUEST, "Jeux Olympiques"); bank("jochrono", JO_CHRONO, "Chronologie JO");
    if (sel.includes("defs")) DEFS.forEach((x, i) => out.push({ key: `defs:${i}`, unit: "defs", soort: "Leçon 6", ask: "Que signifie … ?", front: esc(x.t), back: esc(x.d), page: "42", label: `${x.t} = ${x.d}`, lang: "fr" }));
    return out;
  }

  Vakken.register({
    id: "clil-geschiedenis-2", vak: I.vak, icon: I.icon, theme: I.theme, titel: I.titel, klas: I.klas, bron: I.bron,
    groups: [
      { id: "V", short: "vocabulaire", titel: "Vocabulaire (p.39)", p: "39" },
      { id: "C", short: "Crète/Mycènes", titel: "Crète et Mycènes (p.40-41)", p: "40-41" },
      { id: "T", short: "chronologie", titel: "Chronologie (p.37, 40, 42)", p: "37-42" },
      { id: "G", short: "carte", titel: "Cartes: la Grèce et les Indo-Européens (p.38, 42)", p: "38, 42" },
      { id: "L", short: "leçon 6", titel: "Leçon 6: la société grecque (p.42)", p: "42" },
      { id: "JV", short: "vocabulaire JO", titel: "Les jeux Olympiques: vocabulaire (p.50-57)", p: "50-57" },
      { id: "JO", short: "Olympie + sports", titel: "Les jeux Olympiques: le sanctuaire d'Olympie et les sports (p.50-55)", p: "50-55" },
      { id: "JQ", short: "questions JO", titel: "Les jeux Olympiques: questions A–E, chronologie (p.50-57)", p: "50-57" },
    ],
    units: UNITS.map((u) => ({ id: u.id, group: u.group, label: u.label, page: u.page })),
    quick: [
      { label: "Alles", select: () => true },
      { label: "📚 Vocabulaire", select: (u) => u.group === "V" },
      { label: "🏛️ Crète / Mycènes", select: (u) => u.group === "C" },
      { label: "🗺️ Cartes + dates", select: (u) => u.group === "G" || u.group === "T" },
      { label: "🏅 Jeux Olympiques", select: (u) => u.group[0] === "J" },
    ],
    settings: [
      { key: "dir", label: 'Richting <span class="muted">(vocabulaire)</span>', type: "radio", default: "both", options: [{ v: "fr-nl", label: "FR ➔ NL" }, { v: "nl-fr", label: "NL ➔ FR" }, { v: "both", label: "Beide" }] },
      { key: "bothDirs", type: "checkbox", default: false, label: "Elk woord in <b>beide</b> richtingen vragen", showIf: (s) => s.dir === "both" },
    ],
    levels: {
      easy: { title: "🙂 Makkelijk", desc: "alles meerkeuze" },
      normal: { title: "💪 Normaal", desc: "meerkeuze + soms zelf typen (met woordenlijst)" },
      hard: { title: "🔥 Moeilijk", desc: "meer zelf typen, accenten moeten juist zijn" },
    },
    allInfo: "<b>Eindtoets-modus:</b> elk woord, elke uitspraak en elke vraag uit de gekozen onderdelen komt precies één keer aan bod.",
    keyboard: ["é", "è", "ê", "à", "â", "ç", "ô", "î", "ï", "'", "«", "»"], keyboardLabel: "Klik om accenten in te voegen:",
    statusText: { accent: "Bijna: let op het accent." },
    tags: TAGS,
    makeQuiz, countAll, check, conclusions, regen, fromKey,
    kaarten, kaartUnits: KAART_UNITS,
    _UNITS: UNITS, _checkText: checkText,
  });
})();
