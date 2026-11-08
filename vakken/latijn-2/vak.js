// ============================================================
// VAK – Latijn 2de middelbaar: woordenschat + woordvorming + herkennen
// Afspraken (op vraag van de ouder):
//   - nooit vertalen van Nederlands naar Latijn, enkel Latijn → Nederlands
//   - de middenkolom (genitief/geslacht, vormen, stamtijden) wordt apart geoefend
//   - de leerling kiest zelf "van nr. … tot nr. …" (geldt voor alle woordvragen)
//   - grammatica: woordvorming, verbuiging, geslacht, vervoeging, + datief
// De woorden en teksten staan in inhoud.js.
// ============================================================
(function () {
  "use strict";
  const I = Vakken.inhoud("latijn-2");
  const { WOORDEN, ACHTERVOEGSELS, VOORVOEGSELS, DEKL_NAAM, DEKL_REGEL, VERV_NAAM, GS_NAAM, TAGS } = I;

  // ---------- hulpfuncties ----------
  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rnd(a.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uniq = (arr) => [...new Set(arr)];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const noMacron = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC");
  const norm = (s) => String(s ?? "").toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.!?:"()]/g, " ").replace(/\s+/g, " ").trim();
  const lev = (a, b) => {
    if (Math.abs(a.length - b.length) > 2) return 3;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  };
  const head = (la) => la.split(/,|\s\+|\sof\s/)[0].trim();            // "crēdere, ~ō + dat." → "crēdere"
  const typed = (level, p = 0.6) => (level === "easy" ? false : level === "hard" ? true : Math.random() < p);
  const nOpts = (level) => (level === "easy" ? 3 : 4);
  const NUMS = WOORDEN.map((w) => w.nr);
  const MIN = Math.min(...NUMS), MAX = Math.max(...NUMS);
  const SECTIES = uniq(WOORDEN.map((w) => w.sec)).map((sec) => { const n = WOORDEN.filter((w) => w.sec === sec).map((w) => w.nr); return { sec, v: [Math.min(...n), Math.max(...n)] }; });
  const inRange = (s) => { const r = s.bereik || [MIN, MAX]; return WOORDEN.filter((w) => w.nr >= r[0] && w.nr <= r[1]); };
  const show = (w) => `${esc(w.la)}${w.mid ? `<span class="midcol">${esc(w.mid)}</span>` : ""}`;

  // ---------- vertaling Latijn → Nederlands ----------
  function nlVariants(nl) {
    const out = [];
    nl.split(/;|,/).map((x) => x.trim()).filter(Boolean).forEach((p) => {
      const forms = p.includes("(") ? [p.replace(/\(([^)]*)\)/g, "$1"), p.replace(/\s*\([^)]*\)\s*/g, " ")] : [p];
      forms.forEach((f) => { f = norm(f); out.push(f, f.replace(/^(de|het|een)\s+/, ""), f.replace(/^zich\s+/, "")); });
    });
    return uniq(out.filter(Boolean));
  }
  // komma's, puntkomma's, schuine strepen en "of" tussen betekenissen zijn nooit verplicht:
  // "bewaren redden" = "bewaren; redden"
  function checkNl(given, q) {
    const clean = norm(given).replace(/[;,/]+/g, " ").replace(/\s+/g, " ").trim();
    if (!clean) return { status: "wrong", tag: "betekenis" };
    const ok = (seg) => q.accepted.includes(seg) || q.accepted.includes(seg.replace(/^(de|het|een)\s+/, ""));
    // 1. elk expliciet gescheiden deel of het geheel
    const parts = norm(given).split(/\s*[;,/]\s*|\s+of\s+/).map((x) => x.trim()).filter(Boolean);
    if (ok(clean) || parts.some(ok)) return { status: "correct" };
    // 2. zonder leestekens: kan de zin opgesplitst worden in aanvaarde betekenissen (eventueel met "of")?
    const w = clean.split(" ").filter((x) => x !== "of");
    const dp = [true];
    for (let i = 1; i <= w.length; i++) { dp[i] = false; for (let j = 0; j < i && !dp[i]; j++) if (dp[j] && ok(w.slice(j, i).join(" "))) dp[i] = true; }
    if (dp[w.length]) return { status: "correct" };
    const cand = [...parts, clean];
    if (cand.some((p) => q.accepted.some((a) => a.length > 4 && lev(a, p.replace(/^(de|het|een)\s+/, "")) <= 1))) return { status: "spelling", tag: "spelling" };
    return { status: "wrong", tag: "betekenis" };
  }

  // ---------- middenkolom ----------
  // verwachte delen per woord: [{ label, forms:[…aanvaarde vormen met lengtetekens] }]
  function midSpec(w) {
    const m = w.mid;
    if (!m || /^\(/.test(m)) return null;
    if (w.soort === "nw") {
      const [gen, gsRaw] = m.split(",").map((x) => x.trim());
      const spec = { kind: "nw", gen, gs: gsRaw ? gsRaw.replace(".", "") : null };
      spec.prompt = `Geef de genitief${w.mv ? " (meervoud)" : ""}${spec.gs ? " én het geslacht (m., v. of o.)" : ""}`;
      return spec;
    }
    if (w.soort === "bn") {
      if (m.includes(";")) return { kind: "bn3", gen: m.split(";")[1].trim(), prompt: "Geef de genitief (m., v. en o. zijn in de nominatief gelijk)" };
      const stem = w.la.replace(/us$/, "");
      return { kind: "bn", f: stem + "a", n: stem + "um", prompt: "Geef de vrouwelijke en onzijdige vorm (middenkolom)" };
    }
    if (w.soort === "ww") {
      const [perf, sup] = m.split(",").map((x) => x.trim());
      return { kind: "ww", perf, sup: sup === "-" ? null : sup, prompt: "Geef het perfectum en het supinum (middenkolom)" };
    }
    return null;
  }
  const tokens = (s) => String(s ?? "").toLowerCase().replace(/[~]/g, " ").replace(/[,;/]/g, " ").split(/\s+/).map((t) => t.replace(/^-+|\.+$/g, "")).filter(Boolean);
  // vergelijk één token met een verwachte vorm: "ok" | "macron" | "spelling" | null
  // een gewone i (met punt) in plaats van ī telt altijd als juist, ook op moeilijk
  const iEq = (x) => x.replace(/[īíìïî]/g, "i");
  function cmpTok(t, exp) {
    if (!t) return null;
    t = iEq(t); exp = iEq(exp.toLowerCase());
    if (t === exp) return "ok";
    if (noMacron(t) === noMacron(exp)) return "macron";
    if (exp.length > 4 && lev(noMacron(t), noMacron(exp)) <= 1) return "spelling";
    return null;
  }
  const worst = (rs) => (rs.includes(null) ? null : rs.includes("spelling") ? "spelling" : rs.includes("macron") ? "macron" : "ok");
  function checkMid(given, q, level) {
    const sp = q.spec, t = tokens(given).filter((x) => x !== "-");
    let res, partial = null;
    if (sp.kind === "nw") {
      const gsTok = t.find((x) => /^(m|v|o|f|n|mannelijk|vrouwelijk|onzijdig)$/.test(x));
      const g = cmpTok(t.filter((x) => x !== gsTok)[0], sp.gen);
      if (!g) return { status: "wrong", tag: "middenkolom" };
      res = g;
      if (sp.gs) {
        const map = { f: "v", n: "o", mannelijk: "m", vrouwelijk: "v", onzijdig: "o" };
        const gs = gsTok ? map[gsTok] || gsTok : null;
        if (gs && gs !== sp.gs) return { status: "wrong", tag: "geslacht", note: "De genitief is juist, maar het geslacht niet." };
        if (!gs) partial = "Genitief juist, maar het geslacht ontbreekt.";
      }
    } else if (sp.kind === "bn") {
      const ok = (a, b) => worst([cmpTok(a, sp.f) || cmpTok(a, "a"), cmpTok(b, sp.n) || cmpTok(b, "um")]);
      res = ok(t[0], t[1]);
      if (!res) return { status: "wrong", tag: "middenkolom" };
    } else if (sp.kind === "bn3") {
      res = cmpTok(t[t.length - 1], sp.gen);
      if (!res) return { status: "wrong", tag: "middenkolom" };
    } else {
      const p = cmpTok(t[0], sp.perf), s = sp.sup ? cmpTok(t[1], sp.sup) : "ok";
      if (!p && s && sp.sup) return { status: "wrong", tag: "middenkolom", note: "Het supinum is juist, het perfectum niet." };
      if (p && !s) return { status: "wrong", tag: "middenkolom", note: t[1] ? "Het perfectum is juist, het supinum niet." : "Het perfectum is juist, maar het supinum ontbreekt." };
      res = worst([p, s]);
      if (!res) return { status: "wrong", tag: "middenkolom" };
    }
    if (res === "spelling") return { status: "spelling", tag: "spelling" };
    if (partial) return { status: "partial", tag: "geslacht", note: partial };
    // ontbrekende of verkeerde lengtetekens zijn nooit fout (op geen enkel niveau); we tonen enkel de schrijfwijze
    if (res === "macron") return { status: "correct", note: `Met lengtetekens: ${q.answerShown.replace(/&amp;/g, "&")}` };
    return { status: "correct" };
  }
  // geloofwaardige foute middenkolommen voor meerkeuze
  function midDistractors(w, sp) {
    const out = [];
    if (sp.kind === "nw") {
      const st = sp.gen.replace(/(ae|ī|is|ūs|ōrum)$/, "");
      const ends = w.mv ? ["ārum", "ōrum", "um", "uum"] : ["ae", "ī", "is", "ūs"];
      ends.forEach((e) => out.push(st + e + (sp.gs ? ", " + sp.gs + "." : "")));
      if (sp.gs) ["m", "v", "o"].filter((g) => g !== sp.gs).forEach((g) => out.push(`${sp.gen}, ${g}.`));
    } else if (sp.kind === "bn") out.push("~is, ~e", "~a, ~ō", "~ī, ~ae", "~ae, ~ī");
    else if (sp.kind === "bn3") out.push("~, ~; fēlīcī", "~a, ~um", "~, ~; fēlīcae");
    else {
      const stem = head(w.la).replace(/(āre|ēre|ere|īre|esse|re)$/, "");
      ["āvī, ātum", "uī, itum", "sī, sum", "xī, ctum"].forEach((e) => out.push(stem + e.split(", ")[0] + ", " + stem + e.split(", ")[1]));
      const others = WOORDEN.filter((x) => x.soort === "ww" && x.mid && x !== w);
      out.push(...shuffle(others).slice(0, 2).map((x) => x.mid));
      if (sp.sup) out.push(`${sp.perf}, ${sp.sup.replace(/um$/, "us")}`);
    }
    return uniq(out).filter((x) => noMacron(x) !== noMacron(w.mid));
  }

  // ---------- vorm herkennen (middenkolom → woord) ----------
  function recogForms(w) {
    const sp = midSpec(w);
    if (!sp) return [];
    if (sp.kind === "nw") return noMacron(sp.gen) !== noMacron(head(w.la)) ? [{ f: sp.gen, wat: w.mv ? "de genitief meervoud" : "de genitief" }] : [];
    if (sp.kind === "ww") return [{ f: sp.perf, wat: "het perfectum" }, ...(sp.sup ? [{ f: sp.sup, wat: "het supinum" }] : [])];
    return [];
  }

  // ============================================================
  // ONDERDELEN
  // ============================================================
  const UNITS = [];
  const unit = (u) => { UNITS.push(u); return u; };
  const base = (u, o) => Object.assign({ unit: u.id, unitLabel: u.label, group: u.group, page: u.page, rule: u.rule }, o);

  // 1. vertalen Latijn → Nederlands
  unit({
    id: "vertalen", group: "W", label: "Vertalen: Latijn → Nederlands", page: "woordenlijst",
    rule: "Leer per woord de Nederlandse betekenis(sen). Eén juiste betekenis volstaat.",
    items: (s) => inRange(s),
    gen(level, w, s) {
      const q = base(this, {
        instruction: "Vertaal naar het Nederlands", prompt: esc(w.la), promptClass: "latin",
        hint: level !== "hard" && w.afl ? `denk aan: ${w.afl}` : "", page: `§${w.sec} · nr. ${w.nr}`,
        answerShown: esc(w.nl), accepted: nlVariants(w.nl), key: `vertalen:${w.nr}`, itemLabel: `${w.nr}. ${w.la} → ${w.nl}`, nr: w.nr,
      });
      if (typed(level, 0.6)) return Object.assign(q, { mode: "text", lang: "nl", noKeyboard: true });
      const pool = shuffle(inRange(s).length >= 6 ? inRange(s) : WOORDEN).filter((x) => x.nl !== w.nl);
      const same = pool.filter((x) => x.soort === w.soort), other = pool.filter((x) => x.soort !== w.soort);
      const opts = shuffle([w.nl, ...uniq([...same, ...other].map((x) => x.nl)).slice(0, nOpts(level))]);
      return Object.assign(q, { mode: "mc", options: opts.map((o) => ({ v: o, html: esc(o) })), answer: w.nl });
    },
  });

  // 2. middenkolom aanvullen
  unit({
    id: "midden", group: "W", label: "Middenkolom: genitief, vormen, stamtijden", page: "woordenlijst",
    rule: "Naamwoord: genitief (+ geslacht bij de 3e verbuiging). Bijvoeglijk naamwoord: vrouwelijke en onzijdige vorm. Werkwoord: perfectum en supinum. Onveranderlijk woord: de woordsoort.",
    items: (s) => inRange(s).filter((w) => w.mid),
    gen(level, w) {
      const common = { prompt: show({ la: w.la }), promptClass: "latin", page: `§${w.sec} · nr. ${w.nr}`, key: `midden:${w.nr}`, itemLabel: `${w.nr}. ${w.la} – ${w.mid}`, nr: w.nr };
      if (/^\(/.test(w.mid)) { // onveranderlijk woord: woordsoort
        const opts = ["(bijwoord)", "(ondersch. voegw.)", "(nevensch. voegw.)", "(voorzetsel)"];
        return base(this, { ...common, mode: "mc", instruction: "Wat staat er in de middenkolom (welke woordsoort)?", options: shuffle(uniq([w.mid, ...opts]).slice(0, 4)).map((o) => ({ v: o, html: esc(o) })), answer: w.mid, answerShown: esc(w.mid), tag: "woordsoort" });
      }
      const sp = midSpec(w);
      const q = base(this, { ...common, instruction: sp.prompt, spec: sp, answerShown: esc(w.mid) });
      if (typed(level, 0.6)) return Object.assign(q, { mode: "text", lang: "la", short: false, check: "mid" });
      const opts = shuffle([w.mid, ...shuffle(midDistractors(w, sp)).slice(0, nOpts(level))]);
      return Object.assign(q, { mode: "mc", options: opts.map((o) => ({ v: o, html: esc(o) })), answer: w.mid, tag: "middenkolom" });
    },
  });
  // 3. vorm herkennen (middenkolom → woord)
  unit({
    id: "herkennen", group: "W", label: "Vorm herkennen: van welk woord?", page: "woordenlijst",
    rule: "Leer de middenkolom zo dat je ook in een tekst herkent van welk woord een vorm komt (bv. attulī → afferre).",
    items: (s) => inRange(s).filter((w) => recogForms(w).length),
    gen(level, w, s) {
      const f = pick(recogForms(w)), ans = head(w.la);
      const q = base(this, {
        instruction: `Van welk woord is dit ${f.wat}? Geef de eerste kolom (het woord zoals in de woordenlijst).`,
        prompt: esc(f.f), promptClass: "latin", page: `§${w.sec} · nr. ${w.nr}`, answerShown: esc(w.la) + " – " + esc(w.nl),
        key: `herkennen:${w.nr}`, itemLabel: `${w.nr}. ${f.f} → ${w.la}`, nr: w.nr, target: ans,
      });
      if (typed(level, 0.5)) return Object.assign(q, { mode: "text", lang: "la", check: "lemma" });
      const pool = uniq(shuffle(WOORDEN.filter((x) => x.soort === w.soort && head(x.la) !== ans)).map((x) => head(x.la)));
      const opts = shuffle([ans, ...pool.slice(0, nOpts(level))]);
      return Object.assign(q, { mode: "mc", options: opts.map((o) => ({ v: o, html: esc(o) })), answer: ans, tag: "middenkolom" });
    },
  });

  // 4. woordvorming: achtervoegsels
  const SFX_ITEMS = [
    ...ACHTERVOEGSELS.map((g) => ({ t: "duidt", g })),
    ...ACHTERVOEGSELS.flatMap((g) => g.woorden.map((w) => ({ t: "woord", g, w }))),
  ];
  unit({
    id: "achtervoegsels", group: "G", label: "Woordvorming: achtervoegsels -tor, -or, -ium", page: "kader woordvorming",
    rule: "-tor / -sor = de persoon die handelt (scrīptor = de schrijver); -or = de handeling (amor = de liefde); -ium = het resultaat van de handeling (aedificium = het gebouw).",
    items: () => SFX_ITEMS, noRange: true,
    gen(level, it) {
      if (it.t === "duidt") {
        const all = ACHTERVOEGSELS.map((g) => g.duidt);
        return base(this, { mode: "mc", instruction: "Wat duidt dit achtervoegsel aan?", prompt: esc(it.g.sfx), promptClass: "latin", options: shuffle(all).map((o) => ({ v: o, html: esc(o) })), answer: it.g.duidt, answerShown: esc(it.g.duidt), tag: "woordvorming", key: `sfx:${it.g.sfx}`, itemLabel: `achtervoegsel ${it.g.sfx}` });
      }
      const [ww, wwNl, afg, afgNl] = it.w, first = afgNl.split(";")[0].trim();
      const q = base(this, {
        instruction: `Het woord komt van <b>${esc(ww)}</b> (${esc(wwNl)}). Wat betekent het?`, prompt: esc(afg), promptClass: "latin",
        answerShown: esc(afgNl), accepted: nlVariants(afgNl), key: `sfx:${afg}`, itemLabel: `${afg} (← ${head(ww)}) = ${first}`, tag: "woordvorming",
      });
      if (typed(level, 0.5)) return Object.assign(q, { mode: "text", lang: "nl", noKeyboard: true });
      const others = uniq(shuffle(ACHTERVOEGSELS.flatMap((g) => g.woorden).filter((x) => x !== it.w)).map((x) => x[3].split(";")[0].trim()));
      const opts = shuffle([first, ...others.slice(0, nOpts(level))]);
      return Object.assign(q, { mode: "mc", options: opts.map((o) => ({ v: o, html: esc(o) })), answer: first });
    },
  });

  // 5. woordvorming: voorvoegsels
  const VV_ALL = ["naar; (tot) bij", "weg van", "over", "uit", "in; binnen", "samen met"];
  unit({
    id: "voorvoegsels", group: "G", label: "Woordvorming: voorvoegsels ad-, ab-, trāns-", page: "kader woordvorming",
    rule: "ad- = naar; (tot) bij · ab- = weg van · trā(ns)- = over. Let op: ad- en ab- veranderen soms van vorm (afferre, attulī, allātum ← ad-; auferre, āmittere ← ab-).",
    items: (s) => inRange(s).filter((w) => w.vv),
    gen(level, w) {
      const V = VOORVOEGSELS[w.vv], h = head(w.la);
      const hidden = !noMacron(h).startsWith(noMacron(V.vorm.replace(/[()-]/g, "").slice(0, 2))) || /^(af|au|ā|trād)/.test(h);
      if (hidden || Math.random() < 0.35) {
        const opts = ["ad-", "ab-", "trā(ns)-", "ex-", "in-"];
        return base(this, { mode: "mc", instruction: "Welk voorvoegsel zit in dit werkwoord?", prompt: esc(w.la), promptClass: "latin", page: `§${w.sec} · nr. ${w.nr}`,
          options: shuffle([V.vorm, ...shuffle(opts.filter((o) => o !== V.vorm)).slice(0, nOpts(level))]).map((o) => ({ v: o, html: esc(o) })), answer: V.vorm,
          answerShown: `${esc(V.vorm)} (${esc(V.betekenis)})`, tag: "woordvorming", key: `vv:${w.nr}`, itemLabel: `${w.nr}. ${h}: voorvoegsel`, nr: w.nr });
      }
      return base(this, { mode: "mc", instruction: `Wat betekent het voorvoegsel <b>${esc(V.vorm)}</b> in dit werkwoord?`, prompt: `${esc(w.la)} <small>= ${esc(w.nl)}</small>`, promptClass: "latin", page: `§${w.sec} · nr. ${w.nr}`,
        options: shuffle([V.betekenis, ...shuffle(VV_ALL.filter((o) => o !== V.betekenis)).slice(0, nOpts(level))]).map((o) => ({ v: o, html: esc(o) })), answer: V.betekenis,
        answerShown: esc(V.betekenis), tag: "woordvorming", key: `vv:${w.nr}`, itemLabel: `${w.nr}. ${h}: betekenis ${V.vorm}`, nr: w.nr });
    },
  });

  // 6. verbuiging herkennen
  unit({
    id: "verbuiging", group: "G", label: "Verbuiging herkennen (via de genitief)", page: "woordenlijst",
    rule: Object.entries(DEKL_REGEL).slice(0, 4).map(([k, v]) => `${DEKL_NAAM[k]}: ${v}`).join(" · "),
    items: (s) => inRange(s).filter((w) => w.soort === "nw" && w.dekl),
    gen(level, w) {
      const gen = w.mid.split(",")[0];
      const opts = [1, 2, 3, 4].map((k) => ({ v: String(k), html: esc(DEKL_NAAM[k]) }));
      return base(this, { mode: "mc", instruction: "Tot welke verbuiging behoort dit woord?", prompt: `${esc(w.la)}, ${esc(gen)}`, promptClass: "latin", page: `§${w.sec} · nr. ${w.nr}`,
        options: level === "easy" ? shuffle(opts.filter((o) => o.v === String(w.dekl)).concat(shuffle(opts.filter((o) => o.v !== String(w.dekl))).slice(0, 2))) : opts,
        answer: String(w.dekl), answerShown: `${esc(DEKL_NAAM[w.dekl])} (${esc(DEKL_REGEL[w.dekl])})`, tag: "verbuiging", key: `dekl:${w.nr}`, itemLabel: `${w.nr}. ${w.la}: verbuiging`, nr: w.nr });
    },
  });

  // 7. geslacht
  unit({
    id: "geslacht", group: "G", label: "Geslacht van zelfstandige naamwoorden", page: "woordenlijst",
    rule: "1e verbuiging (-a, -ae): meestal vrouwelijk · 2e verbuiging: -us meestal mannelijk, -um onzijdig · 3e verbuiging: leer het geslacht uit de middenkolom (m., v., o.).",
    items: (s) => inRange(s).filter((w) => w.soort === "nw" && w.gs),
    gen(level, w) {
      const gen = w.mid.split(",")[0];
      return base(this, { mode: "mc", instruction: "Welk geslacht heeft dit woord?", prompt: `${esc(w.la)}, ${esc(gen)} <small>(${esc(w.nl)})</small>`, promptClass: "latin", page: `§${w.sec} · nr. ${w.nr}`,
        options: ["m", "v", "o"].map((g) => ({ v: g, html: esc(GS_NAAM[g]) })), answer: w.gs, answerShown: esc(GS_NAAM[w.gs]), tag: "geslacht", key: `gs:${w.nr}`, itemLabel: `${w.nr}. ${w.la}: geslacht`, nr: w.nr });
    },
  });

  // 8. vervoeging
  unit({
    id: "vervoeging", group: "G", label: "Vervoeging van werkwoorden", page: "woordenlijst",
    rule: "Kijk naar de infinitief én de 1e persoon: -āre, ~ō = 1e · -ēre, ~eō = 2e · -ere, ~ō = 3e · -ere, ~iō = 3e op -iō · -īre, ~iō = 4e · samenstellingen van esse, īre en ferre zijn onregelmatig.",
    items: (s) => inRange(s).filter((w) => w.soort === "ww" && w.verv),
    gen(level, w) {
      const keys = Object.keys(VERV_NAAM), k = String(w.verv);
      const chosen = level === "hard" ? keys : [k, ...shuffle(keys.filter((x) => x !== k)).slice(0, nOpts(level))];
      return base(this, { mode: "mc", instruction: "Tot welke vervoeging behoort dit werkwoord?", prompt: esc(w.la.replace(/\s*\+\s*dat\./, "")), promptClass: "latin", page: `§${w.sec} · nr. ${w.nr}`,
        options: shuffle(chosen).map((x) => ({ v: x, html: esc(VERV_NAAM[x]) })), answer: k, answerShown: esc(VERV_NAAM[k]), tag: "vervoeging", key: `verv:${w.nr}`, itemLabel: `${w.nr}. ${head(w.la)}: vervoeging`, nr: w.nr });
    },
  });

  // 9. werkwoorden met datief
  unit({
    id: "datief", group: "G", label: "Werkwoorden met datief (+ dat.)", page: "woordenlijst",
    rule: "In de woordenlijst staat '+ dat.' bij werkwoorden die met een datief gebruikt worden: crēdere, accēdere, adesse, placēre …",
    items: (s) => inRange(s).filter((w) => w.naamval === "dat."),
    gen(level, w, s) {
      const pool = uniq(shuffle((inRange(s).filter((x) => x.soort === "ww" && !x.naamval).length >= 3 ? inRange(s) : WOORDEN).filter((x) => x.soort === "ww" && !x.naamval)).map((x) => head(x.la)));
      const ans = head(w.la);
      return base(this, { mode: "mc", instruction: "Welk werkwoord wordt met een datief gebruikt?", prompt: "", page: `§${w.sec} · nr. ${w.nr}`,
        options: shuffle([ans, ...pool.slice(0, nOpts(level))]).map((o) => ({ v: o, html: `<span class="latin">${esc(o)}</span>` })), answer: ans,
        answerShown: `${esc(w.la)} (${esc(w.nl)})`, tag: "naamval", key: `dat:${w.nr}`, itemLabel: `${w.nr}. ${ans} + dat.`, nr: w.nr });
    },
  });

  // ============================================================
  // TOETS SAMENSTELLEN
  // ============================================================
  const items = (u, s) => u.items(s);
  function makeQuiz(s) {
    const sel = UNITS.filter((u) => s.units.includes(u.id) && items(u, s).length);
    if (!sel.length) return [];
    const out = [];
    if (s.count === "all") {
      sel.forEach((u) => items(u, s).forEach((it) => out.push(u.gen(s.level, it, s))));
      return shuffle(out);
    }
    const decks = {};
    for (let i = 0; out.length < s.count && i < s.count * 4; i++) {
      // vertaling en middenkolom krijgen meer gewicht dan grammatica
      const weighted = sel.flatMap((u) => (u.group === "W" ? [u, u, u] : [u]));
      const u = pick(weighted);
      if (!decks[u.id] || !decks[u.id].length) decks[u.id] = shuffle(items(u, s));
      out.push(u.gen(s.level, decks[u.id].pop(), s));
    }
    return shuffle(out);
  }
  const countAll = (s) => UNITS.filter((u) => s.units.includes(u.id)).reduce((a, u) => a + items(u, s).length, 0);
  // foutgerichte toets: vraag opnieuw maken op basis van de bewaarde sleutel (bv. "vertalen:352")
  const KEY_UNIT = { vertalen: "vertalen", midden: "midden", herkennen: "herkennen", vv: "voorvoegsels", dekl: "verbuiging", gs: "geslacht", verv: "vervoeging", dat: "datief", sfx: "achtervoegsels" };
  function fromKey(key, level, s = {}) {
    const i = key.indexOf(":"), pre = key.slice(0, i), rest = key.slice(i + 1), u = UNITS.find((x) => x.id === KEY_UNIT[pre]);
    if (!u) return null;
    const all = { bereik: [MIN, MAX] };
    if (pre === "sfx") { const it = SFX_ITEMS.find((x) => (x.t === "duidt" ? x.g.sfx : x.w[2]) === rest); return it ? u.gen(level, it, all) : null; }
    const nr = +rest, r = s.bereik || [MIN, MAX];
    if (nr < r[0] || nr > r[1]) return null; // buiten het gekozen bereik
    const it = u.items({ bereik: [nr, nr] })[0];
    return it ? u.gen(level, it, all) : null;
  }
  function regen(q, level) {
    const u = UNITS.find((x) => x.id === q.unit);
    const it = q.nr ? u.items({ bereik: [q.nr, q.nr] })[0] : null;
    return it ? u.gen(level, it, { bereik: [MIN, MAX] }) : { ...q };
  }

  // ============================================================
  // VERBETEREN
  // ============================================================
  function check(given, q, level) {
    let r;
    if (q.mode === "mc") r = given === q.answer ? { status: "correct" } : { status: "wrong", tag: q.tag || (q.unit === "vertalen" ? "betekenis" : "fout") };
    else if (q.check === "mid") r = checkMid(given, q, level);
    else if (q.check === "lemma") {
      const t = tokens(given)[0], c = cmpTok(t, q.target);
      r = c === "ok" ? { status: "correct" } : c === "macron" ? { status: "correct", note: `Met lengtetekens: ${q.target}` } : c === "spelling" ? { status: "spelling", tag: "spelling" } : { status: "wrong", tag: "middenkolom" };
    } else r = checkNl(given, q);
    // punten: lengtetekens tellen nooit mee; "bijna volledig" (geslacht vergeten) telt niet op niveau moeilijk
    r.points = r.status === "correct" ? 1 : (r.status === "lengteteken" || r.status === "partial") ? (level === "hard" ? 0 : 1) : 0;
    if (r.status === "partial" && level === "hard") r.strictNote = "(op 'Moeilijk' moet alles volledig zijn)";
    return r;
  }

  // ============================================================
  // FOUTANALYSE
  // ============================================================
  function conclusions(results) {
    const out = [], total = results.length, pts = results.reduce((a, r) => a + r.points, 0), pct = total ? Math.round((pts / total) * 100) : 0;
    out.push(pct >= 90 ? { type: "good", text: `Knap! ${pct}% juist.` } : pct >= 70 ? { type: "ok", text: `${pct}% juist: een goede basis, nog enkele werkpunten.` } : { type: "bad", text: `${pct}% juist: deze woorden moeten nog grondig herhaald worden.` });
    const tags = {};
    results.forEach((r) => { if (r.status !== "correct" && r.tag && TAGS[r.tag]) tags[r.tag] = (tags[r.tag] || 0) + 1; });
    Object.entries(tags).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => out.push({ type: n >= 2 ? "bad" : "ok", text: `<b>${TAGS[t].title}</b> (${n}×): ${TAGS[t].advice}` }));
    const wrongNrs = uniq(results.filter((r) => !r.points && r.q.nr).map((r) => r.q.nr)).sort((a, b) => a - b);
    if (wrongNrs.length) out.push({ type: "ok", text: `Herhaal de woorden met nummer: ${wrongNrs.join(", ")}.` });
    if (!results.some((r) => r.status !== "correct") && total) out.push({ type: "good", text: "Geen enkele fout. Probeer eens <i>moeilijk</i> of een groter bereik." });
    return out;
  }

  // ============================================================
  // Aansluiting op de gedeelde app
  // ============================================================
  Vakken.register({
    id: "latijn-2", vak: I.vak, icon: I.icon, theme: I.theme, titel: I.titel, klas: I.klas, bron: I.bron,
    groups: [{ id: "W", short: "woorden", titel: "Woordenschat", p: "" }, { id: "G", short: "grammatica", titel: "Grammatica", p: "" }],
    units: UNITS.map((u) => ({ id: u.id, group: u.group, label: u.label, page: u.page })),
    quick: [
      { label: "Alles", select: () => true },
      { label: "📖 Vertalen + middenkolom", select: (u) => u.id === "vertalen" || u.id === "midden" },
      { label: "📚 Enkel woordenschat", select: (u) => u.group === "W" },
      { label: "🧩 Enkel grammatica", select: (u) => u.group === "G" },
    ],
    settings: [
      { key: "bereik", type: "range", label: "Welke woorden? <span class=\"muted\">(nummers uit de woordenlijst)</span>", min: MIN, max: MAX, default: [MIN, MAX],
        presets: [{ label: "Alles", v: [MIN, MAX] }, ...SECTIES.map((x) => ({ label: x.sec, v: x.v }))],
        hint: "Geldt voor alle vragen over woorden (ook grammatica). De kaders 'woordvorming: achtervoegsels' hebben geen nummers en komen altijd aan bod als je ze aanvinkt." },
    ],
    describe: (s) => `woorden ${s.bereik[0]}–${s.bereik[1]} (${inRange(s).length})`,
    levels: {
      easy: { title: "🙂 Makkelijk", desc: "alles meerkeuze" },
      normal: { title: "💪 Normaal", desc: "meerkeuze + typen; lengtetekens (ā, ē…) hoeven niet" },
      hard: { title: "🔥 Moeilijk", desc: "alles zelf typen; geslacht moet erbij (lengtetekens hoeven niet)" },
    },
    allInfo: "<b>Eindtoets-modus:</b> elk woord uit het gekozen bereik komt per aangevinkt onderdeel precies één keer aan bod.",
    keyboard: ["ā", "ē", "ī", "ō", "ū", "~", ","], keyboardLabel: "Lengtetekens invoegen:",
    statusText: { spelling: "Bijna: één letter fout.", partial: "Bijna!" },
    tags: TAGS,
    makeQuiz, countAll, check, conclusions, regen, fromKey,
    _UNITS: UNITS, _norm: norm, // voor tests
  });
})();
