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
  const { WOORDEN, ACHTERVOEGSELS, VOORVOEGSELS, DEKL_NAAM, DEKL_REGEL, VERV_NAAM, GS_NAAM, TAGS, CAPITA } = I;

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
  // snelkeuzes per caput (de paragrafen kan je met de nummers kiezen)
  const CAPS = uniq(WOORDEN.map((w) => w.sec.split(".")[0])).map((c) => { const n = WOORDEN.filter((w) => w.sec.split(".")[0] === c).map((w) => w.nr); return { c, naam: (CAPITA || {})[c] || "", v: [Math.min(...n), Math.max(...n)] }; });
  const inRange = (s) => { const r = s.bereik || [MIN, MAX]; return WOORDEN.filter((w) => w.nr >= r[0] && w.nr <= r[1] && (s.welke !== "vet" || w.vet)); };
  const show = (w) => `${esc(w.la)}${w.mid ? `<span class="midcol">${esc(w.mid)}</span>` : ""}`;

  // ---------- vertaling Latijn → Nederlands ----------
  function nlVariants(nl) {
    const out = [];
    nl.split(/;|,/).map((x) => x.trim()).filter(Boolean).forEach((p) => {
      const forms = p.includes("(") ? [p.replace(/\(([^)]*)\)/g, "$1"), p.replace(/\s*\([^)]*\)\s*/g, " ")] : [p];
      // "zegt hij/zij" → ook "zegt hij", "zegt zij"
      const sl = []; forms.forEach((f) => { const m = f.match(/^(.*?)(\S+)\/(\S+)(.*)$/); if (m) sl.push(m[1] + m[2] + m[4], m[1] + m[3] + m[4], f.replace("/", " ")); });
      forms.push(...sl);
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
      const g = gsRaw && gsRaw.match(/^(m|v|o)\./);
      if (/geen/.test(gen)) return null;
      const spec = { kind: "nw", gen, gs: g ? g[1] : null };
      spec.prompt = `Geef de genitief${w.mv ? " (meervoud)" : ""}${spec.gs ? " én het geslacht (m., v. of o.)" : ""}`;
      return spec;
    }
    if (w.soort === "bn") {
      if (/;\s*\S/.test(m)) return { kind: "bn3", gen: m.split(";")[1].trim(), prompt: "Geef de genitief (m., v. en o. zijn in de nominatief gelijk)" };
      if (/^~ae, ~a$/.test(m)) { const st = head(w.la).replace(/ī$/, ""); return { kind: "bn", f: st + "ae", n: st + "a", sf: "ae", sn: "a", prompt: "Geef de vrouwelijke en onzijdige vorm (meervoud, middenkolom)" }; }
      if (!m.startsWith("~")) { const [f, n] = m.split(",").map((x) => x.trim().replace(/;$/, "")); return { kind: "bn", f, n, prompt: "Geef de vrouwelijke en onzijdige vorm (middenkolom)" }; }
      const stem = head(w.la).replace(/us$/, "");
      return { kind: "bn", f: stem + "a", n: stem + "um", prompt: "Geef de vrouwelijke en onzijdige vorm (middenkolom)" };
    }
    if (w.soort === "ww" && /\bsum$/.test(m)) return { kind: "dep", perf: m, prompt: "Geef het perfectum (middenkolom)" };
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
      const ok = (a, b) => worst([cmpTok(a, sp.f) || cmpTok(a, sp.sf || "a"), cmpTok(b, sp.n) || cmpTok(b, sp.sn || "um")]);
      res = ok(t[0], t[1]);
      if (!res) return { status: "wrong", tag: "middenkolom" };
    } else if (sp.kind === "dep") {
      const exp = tokens(sp.perf);
      res = worst(exp.map((e, i) => cmpTok(t[i], e)));
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
    else if (sp.kind === "dep") { const st = sp.perf.replace(/(ātus|itus|tus|sus|us) sum$/, ""); out.push(st + "ātus sum", st + "itus sum", st + "sus sum", st + "tus est"); out.push(...shuffle(WOORDEN.filter((x) => x.dep && x.mid && x !== w)).slice(0, 2).map((x) => x.mid)); }
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
    if (sp.kind === "dep") return [{ f: sp.perf, wat: "het perfectum" }];
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
    items: (s) => inRange(s).filter((w) => w.mid && (/^\(/.test(w.mid) || midSpec(w))),
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

  // 7. geslacht
  unit({
    id: "geslacht", group: "G", label: "Geslacht van zelfstandige naamwoorden", page: "woordenlijst",
    rule: "1e klasse: -a, -ae (rosa) meestal vrouwelijk, -us/-er, -ī (avus) mannelijk, -um, -ī (dōnum) onzijdig · 2e klasse: leer het geslacht uit de middenkolom (m., v., o.) · 3e klasse: -us, -ūs (fructus) meestal mannelijk (manus en domus: vrouwelijk), -ēs, -eī (rēs) vrouwelijk (diēs: m. en v.).",
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
  // GRAMMATICA: NAAMWOORDEN (klassen) EN WERKWOORDEN (tijden) – tabellen in grammatica.js
  // ============================================================
  const G = I.GRAM;
  const NVL = { nom: "nom.", acc: "acc.", gen: "gen.", dat: "dat.", abl: "abl.", voc: "voc." };
  const GSL = { m: "m.", v: "v.", o: "o." };
  const GTL = { enk: "enk.", mv: "mv." };
  const cellTxt = (c) => { const [n, g] = c.split("."); return `${NVL[n]} ${GTL[g]}`; };
  const cellLang = (c) => { const [n, g] = c.split("."); return `${G.NV_NAAM[n]} ${g === "mv" ? "meervoud" : "enkelvoud"}`; };
  const anTxt = (a) => `${NVL[a.n]} ${GSL[a.gs]} ${GTL[a.g]}`;
  const lat = (x) => `<span class="latin">${esc(x)}</span>`;
  const cmpForm = (given, exp) => cmpTok(String(given || "").trim().toLowerCase().replace(/[.!?]/g, "").replace(/\s+/g, " "), exp);
  function bestOf(given, list) {
    let best = null;
    for (const e of list) { const r = cmpForm(given, e); if (r === "ok") return "ok"; if (r === "macron") best = "macron"; else if (r === "spelling" && !best) best = "spelling"; }
    return best;
  }
  const formResult = (res, shown, tag) => (res === "ok" ? { status: "correct" } : res === "macron" ? { status: "correct", note: `Met lengtetekens: ${shown}` } : res === "spelling" ? { status: "spelling", tag: "spelling" } : { status: "wrong", tag });
  const memo = (fn) => { const m = new Map(); return (w) => { if (!m.has(w)) m.set(w, fn(w)); return m.get(w); }; };
  const nf = memo(G.nounForms), af = memo(G.adjForms), vs = memo(G.verbSpec);
  const vf = memo((w) => (vs(w) ? G.verbForms(vs(w)) : null));
  const NOUNS = WOORDEN.filter((w) => nf(w)), ADJS = WOORDEN.filter((w) => af(w)), VERBS = WOORDEN.filter((w) => vs(w));
  const rangeOr = (s, all, min = 4) => { const r = inRange(s).filter((w) => all.includes(w)); return r.length >= min ? r : all; };
  const genOf = (w) => (w.mid || "").split(",")[0].trim();
  const klOk = (s, w) => !s || !s.nwKlasse || s.nwKlasse === "alle" || (w.soort === "nw" ? nf(w) && String(G.modelKlasse(nf(w).model)) === s.nwKlasse : G.adjInfo(w) && String(G.adjInfo(w).klasse) === s.nwKlasse);
  const tijdOf = (s) => (s && s.wwTijd && s.wwTijd !== "alle" ? s.wwTijd : null);
  const nounShow = (w) => `${esc(head(w.la))}, ${esc(w.mid)}`;
  // cellen met een vorm (vocatief minder vaak)
  function cellsOf(forms, opts = {}) {
    let c = Object.keys(forms).filter((k) => forms[k]);
    if (opts.noVoc || Math.random() < 0.75) c = c.filter((k) => !k.startsWith("voc")) ;
    return c;
  }
  // in welke cellen staat deze vorm? → [{n, g}]
  const cellsWith = (forms, f) => Object.keys(forms).filter((k) => forms[k] && forms[k].includes(f)).map((k) => { const [n, g] = k.split("."); return { n, g }; });
  const ALL_AN = G.NV.flatMap((n) => G.GS.flatMap((gs) => G.GETAL.map((g) => ({ n, gs, g }))));
  const anKey = (a) => `${a.n}|${a.gs}|${a.g}`;
  const PICK_NW = [
    { label: "naamval", opts: G.NV.map((n) => ({ v: n, html: NVL[n] })) },
    { label: "genus", opts: G.GS.map((g) => ({ v: g, html: GSL[g] })) },
    { label: "getal", opts: G.GETAL.map((g) => ({ v: g, html: GTL[g] })) },
  ];

  // ---------- N1. klasse en model ----------
  const MODEL_OPTS = ["avus", "rosa", "dōnum", "dux", "corpus", "fructus", "rēs"];
  unit({
    id: "verbuiging", group: "N", label: "Klasse en model herkennen", page: "leerstofoverzicht klassen",
    rule: "Kijk naar de woordenlijst (nominatief + genitief): -us/-er, -ī (m.) = avus · -a, -ae = rosa · -um, -ī (o.) = dōnum → 1e klasse. Anders, -is = dux/māter · anders, -is + o. = corpus → 2e klasse. -us, -ūs = fructus · -ēs, -eī = rēs → 3e klasse. Adjectieven: ~a, ~um = 1e klasse; genitief op -is = 2e klasse.",
    items: (s) => inRange(s).filter((w) => ((w.soort === "nw" && nf(w)) || (w.soort === "bn" && G.adjInfo(w))) && klOk(s, w)),
    gen(level, w) {
      const common = { promptClass: "latin", page: `§${w.sec} · nr. ${w.nr}`, tag: "verbuiging", key: `dekl:${w.nr}`, nr: w.nr };
      if (w.soort === "bn") {
        const A = G.adjInfo(w), opts = [{ v: "1", html: "1e klasse (zoals bonus, bona, bonum)" }, { v: "2", html: "2e klasse (zoals fēlīx, fortis, ācer)" }];
        return base(this, { ...common, mode: "mc", instruction: "Tot welke klasse behoort dit adjectief?", prompt: `${esc(w.la)}<span class="midcol">${esc(w.mid)}</span>`, options: opts, answer: String(A.klasse),
          answerShown: `${A.klasse}e klasse${A.groep ? " – " + esc(G.ADJ_GROEP[A.groep]) : ""}`, itemLabel: `${w.nr}. ${w.la}: klasse` });
      }
      const m = nf(w).model, k = G.modelKlasse(m), kOnly = level === "easy" || !MODEL_OPTS.includes(m);
      const shown = `${G.KLASSE_NAAM[k]} – model ${esc(G.modelNaam(m))}`;
      if (kOnly) return base(this, { ...common, mode: "mc", instruction: "Tot welke klasse behoort dit substantief?", prompt: nounShow(w),
        options: [1, 2, 3].map((x) => ({ v: String(x), html: G.KLASSE_NAAM[x] })), answer: String(k), answerShown: shown, itemLabel: `${w.nr}. ${head(w.la)}: klasse` });
      const opts = level === "hard" ? MODEL_OPTS : [m, ...shuffle(MODEL_OPTS.filter((x) => x !== m)).slice(0, 3)];
      return base(this, { ...common, mode: "mc", instruction: "Welk model volgt dit substantief?", prompt: nounShow(w),
        options: (level === "hard" ? opts : shuffle(opts)).map((x) => ({ v: x, html: `<span class="latin">${esc(G.MODEL_LABEL[x])}</span> <small>(${G.KLASSE_NAAM[G.MODELLEN[x].klasse]})</small>` })),
        answer: m, answerShown: shown, itemLabel: `${w.nr}. ${head(w.la)}: model` });
    },
  });

  // ---------- N2. vorm maken ----------
  unit({
    id: "nw_vorm", group: "N", label: "Substantief: gevraagde vorm maken", page: "leerstofoverzicht klassen",
    rule: "Zoek eerst het model (via de genitief), neem de stam (genitief zonder uitgang) en plak de uitgang van de gevraagde naamval en het getal erachter.",
    items: (s) => inRange(s).filter((w) => nf(w) && klOk(s, w)),
    gen(level, w) {
      const F = nf(w).forms, cell = pick(cellsOf(F)), ans = F[cell];
      const q = base(this, { instruction: `Geef de <b>${cellLang(cell)}</b>`, prompt: nounShow(w), promptClass: "latin", hint: level === "easy" ? `model ${G.modelNaam(nf(w).model)}` : "",
        page: `§${w.sec} · nr. ${w.nr}`, answerShown: esc(ans.join(" of ")), accepted: ans, tag: "vormen", key: `nvorm:${w.nr}`, itemLabel: `${w.nr}. ${head(w.la)}: ${cellTxt(cell)}`, nr: w.nr });
      if (typed(level, 0.6)) return Object.assign(q, { mode: "text", lang: "la", check: "form", short: true });
      const others = uniq(Object.values(F).filter(Boolean).flat()).filter((f) => !ans.includes(f));
      const opts = shuffle([ans[0], ...shuffle(others).slice(0, nOpts(level))]);
      return Object.assign(q, { mode: "mc", options: opts.map((o) => ({ v: o, html: lat(o) })), answer: ans[0] });
    },
  });

  // ---------- N3. tabel invullen ----------
  unit({
    id: "nw_tabel", group: "N", label: "Substantief: tabel invullen (verbuigen)", page: "leerstofoverzicht klassen",
    rule: "Leer de tabellen per model: nom. – acc. – gen. – dat. – abl. (enkelvoud en meervoud). Bij dux/māter is de gen. mv. meestal -um, soms -ium (urbium).",
    items: (s) => inRange(s).filter((w) => nf(w) && klOk(s, w)),
    gen(level, w) {
      const R = nf(w), F = R.forms;
      let getallen = R.mvOnly ? ["mv"] : level === "easy" ? [pick(["enk", "mv"])] : ["enk", "mv"];
      const cells = getallen.flatMap((g) => ["nom", "acc", "gen", "dat", "abl"].map((n) => `${n}.${g}`));
      const st = genOf(w).replace(/is$/, "");
      const acc = cells.map((c) => F[c] || (c === "gen.mv" ? [st + "um", st + "ium"] : []));
      return base(this, { mode: "fields", instruction: `Verbuig: vul de tabel aan${getallen.length === 1 ? ` (${getallen[0] === "mv" ? "meervoud" : "enkelvoud"})` : ""}`,
        prompt: nounShow(w), promptClass: "latin", page: `§${w.sec} · nr. ${w.nr}`,
        fields: cells.map((c) => ({ label: cellTxt(c), short: false })), cells, acc,
        answerShown: cells.map((c, i) => `${cellTxt(c)} <span class="latin">${esc(acc[i].join("/"))}</span>`).join(" · "),
        tag: "vormen", key: `ntab:${w.nr}`, itemLabel: `${w.nr}. ${head(w.la)}: tabel`, nr: w.nr, check: "table" });
    },
  });

  // ---------- N4. naamval, genus, getal bepalen ----------
  function nounAnalyses(w, f, gsList) {
    return cellsWith(nf(w).forms, f).flatMap((c) => (gsList || G.gsOf(w)).map((gs) => ({ ...c, gs })));
  }
  function adjCellsFor(a, gs, f) { return cellsWith(af(a).forms[gs], f); }
  unit({
    id: "nw_bepalen", group: "N", label: "Naamval, genus en getal bepalen", page: "leerstofoverzicht klassen",
    rule: "Zoek het woord in de woordenlijst (model + geslacht), vergelijk de uitgang met de tabel. Eén vorm kan soms meer naamvallen zijn (rosae = gen. of dat. enk., of nom. mv.). Een adjectief stemt overeen in naamval, genus en getal.",
    items: (s) => inRange(s).filter((w) => nf(w) && klOk(s, w)),
    gen(level, w, s) {
      const F = nf(w).forms, cell = pick(cellsOf(F, { noVoc: level === "easy" })), f = F[cell][0];
      let gsList = G.gsOf(w), prompt = lat(f), valid, phrase = null;
      if (gsList.length > 1) gsList = [pick(gsList)];
      valid = nounAnalyses(w, f, gsList);
      // naamwoordgroep: adjectief + substantief
      if (level !== "easy" && Math.random() < 0.5) {
        const gs = gsList[0], adjs = shuffle(rangeOr(s, ADJS)).filter((a) => af(a).forms[gs][cell]);
        if (adjs.length) {
          const a = adjs[0], af0 = af(a).forms[gs][cell][0], ac = adjCellsFor(a, gs, af0);
          valid = valid.filter((x) => ac.some((c) => c.n === x.n && c.g === x.g));
          phrase = Math.random() < 0.5 ? `${af0} ${f}` : `${f} ${af0}`;
          prompt = lat(phrase) + `<small> (${esc(head(a.la))} + ${esc(head(w.la))})</small>`;
        }
      }
      if (!phrase) prompt += `<small> (${esc(head(w.la))}, ${esc(w.mid)})</small>`;
      const vk = new Set(valid.map(anKey));
      const q = base(this, { instruction: phrase ? "Geef naamval, genus en getal van de naamwoordgroep." : "Geef naamval, genus en getal.", prompt, promptClass: "latin",
        page: `§${w.sec} · nr. ${w.nr}`, valid: [...vk], answerShown: uniq(valid.map(anTxt)).join(" <i>of</i> "), tag: "bepalen",
        key: `nbep:${w.nr}`, itemLabel: `${w.nr}. ${phrase || f}: naamval/genus/getal`, nr: w.nr });
      if (level === "easy") {
        const right = pick(valid), wrong = shuffle(ALL_AN.filter((a) => !vk.has(anKey(a)) && (a.gs === right.gs || a.n === right.n)));
        const opts = shuffle([right, ...wrong.slice(0, 3)]);
        return Object.assign(q, { mode: "mc", options: opts.map((a) => ({ v: anKey(a), html: anTxt(a) })), answer: anKey(right) });
      }
      return Object.assign(q, { mode: "pick", picks: PICK_NW, check: "pick" });
    },
  });

  // ---------- N5. congruentie: juiste vorm in de naamwoordgroep ----------
  unit({
    id: "congruentie", group: "N", label: "Naamwoordgroep: vervang door de juiste vorm", page: "oefening klassen",
    rule: "Bepaal eerst naamval en getal van de naamwoordgroep (adjectief + substantief), en geef dan het andere substantief in dezelfde naamval en hetzelfde getal.",
    items: (s) => inRange(s).filter((w) => nf(w) && klOk(s, w)),
    gen(level, w, s) {
      for (let t = 0; t < 30; t++) {
        const n1 = pick(rangeOr(s, NOUNS)), F1 = nf(n1).forms, gs = pick(G.gsOf(n1)), F2 = nf(w).forms;
        if (n1 === w) continue;
        const adjs = rangeOr(s, ADJS);
        const cell = pick(Object.keys(F1).filter((k) => F1[k] && F2[k] && !k.startsWith("voc")));
        if (!cell) continue;
        const a = shuffle(adjs).find((x) => af(x).forms[gs][cell]);
        if (!a) continue;
        const f1 = F1[cell][0], fa = af(a).forms[gs][cell][0];
        const ac = adjCellsFor(a, gs, fa), nc = cellsWith(F1, f1);
        const P = nc.filter((c) => ac.some((x) => x.n === c.n && x.g === c.g)).map((c) => `${c.n}.${c.g}`).filter((c) => !c.startsWith("voc"));
        const good = uniq(P.flatMap((c) => F2[c] || []));
        if (!good.length) continue;
        const bad = uniq(Object.keys(F2).filter((k) => F2[k] && !k.startsWith("voc")).flatMap((k) => F2[k])).filter((f) => !good.includes(f) && !cellsWith(F2, f).some((c) => P.includes(`${c.n}.${c.g}`)));
        if (bad.length < 2) continue;
        const ans = F2[pick(P.filter((c) => F2[c]))][0];
        const ph = `${fa} ${f1}`;
        const q = base(this, { instruction: `Vervang <b>${esc(f1)}</b> door de juiste vorm van <b>${esc(head(w.la))}</b> (${esc(w.mid)}).`, prompt: lat(ph), promptClass: "latin",
          page: `§${w.sec} · nr. ${w.nr}`, accepted: good, answerShown: `${esc(good.join(" of "))} <small>(${uniq(P.map(cellTxt)).join(" of ")})</small>`, tag: "congruentie",
          key: `cong:${w.nr}`, itemLabel: `${w.nr}. ${ph} → ${head(w.la)}`, nr: w.nr });
        if (level === "hard") return Object.assign(q, { mode: "text", lang: "la", check: "form", short: true });
        const opts = shuffle([ans, ...shuffle(bad).slice(0, level === "easy" ? 2 : 3)]);
        return Object.assign(q, { mode: "mc", options: opts.map((o) => ({ v: o, html: lat(o) })), answer: ans });
      }
      return this.genFallback(level, w);
    },
    genFallback(level, w) { return UNITS.find((u) => u.id === "nw_vorm").gen(level, w); },
  });

  // ---------- N6. adjectieven 2e klasse ----------
  unit({
    id: "bn2", group: "N", label: "Adjectieven 2e klasse (fēlīx, fortis, ācer)", page: "theorie adjectieven 2e klasse",
    rule: "Groep 1: één vorm (fēlīx, fēlīx, fēlīx) · groep 2: twee vormen (fortis, fortis, forte) · groep 3: drie vormen (ācer, ācris, ācre). Uitgangen: acc. -em (o. = nom.), gen. -is, dat. -ī, abl. -ī · mv.: -ēs (o. -ia), gen. -ium, dat./abl. -ibus.",
    items: (s) => inRange(s).filter((w) => af(w) && af(w).info.klasse === 2),
    gen(level, w) {
      const A = af(w), common = { promptClass: "latin", page: `§${w.sec} · nr. ${w.nr}`, nr: w.nr };
      if (Math.random() < 0.35 && !A.info.mvOnly) {
        return base(this, { ...common, mode: "mc", instruction: "Tot welke groep behoort dit adjectief?", prompt: `${esc(w.la)}<span class="midcol">${esc(w.mid)}</span>`,
          options: [1, 2, 3].map((g) => ({ v: String(g), html: esc(G.ADJ_GROEP[g]) })), answer: String(A.info.groep), answerShown: esc(G.ADJ_GROEP[A.info.groep]), tag: "adjectief",
          key: `bn2:${w.nr}`, itemLabel: `${w.nr}. ${head(w.la)}: groep` });
      }
      const gs = pick(A.info.groep === 3 ? ["m", "v", "o"] : ["m", "o"]), F = A.forms[gs], cell = pick(cellsOf(F, { noVoc: true })), ans = F[cell];
      const q = base(this, { ...common, instruction: `Geef de <b>${cellLang(cell)}</b>, <b>${{ m: "mannelijk", v: "vrouwelijk", o: "onzijdig" }[gs]}</b>`,
        prompt: `${esc(w.la)}<span class="midcol">${esc(w.mid)}</span>`, answerShown: esc(ans.join(" of ")), accepted: ans, tag: "adjectief",
        key: `bn2:${w.nr}`, itemLabel: `${w.nr}. ${head(w.la)}: ${cellTxt(cell)} ${gs}.` });
      if (typed(level, 0.6)) return Object.assign(q, { mode: "text", lang: "la", check: "form", short: true });
      const others = uniq(G.GS.flatMap((g) => Object.values(A.forms[g]).filter(Boolean).flat())).filter((f) => !ans.includes(f));
      return Object.assign(q, { mode: "mc", options: shuffle([ans[0], ...shuffle(others).slice(0, nOpts(level))]).map((o) => ({ v: o, html: lat(o) })), answer: ans[0] });
    },
  });

  // ---------- N7. modellen (de tabellen zelf) ----------
  const MODEL_WOORDEN = [
    { la: "avus", mid: "avī", nl: "de grootvader", soort: "nw", gs: "m", dekl: 2 },
    { la: "rosa", mid: "rosae", nl: "de roos", soort: "nw", gs: "v", dekl: 1 },
    { la: "dōnum", mid: "dōnī", nl: "het geschenk", soort: "nw", gs: "o", dekl: 2 },
    { la: "dux", mid: "ducis, m.", nl: "de leider", soort: "nw", gs: "m", dekl: 3 },
    { la: "māter", mid: "mātris, v.", nl: "de moeder", soort: "nw", gs: "v", dekl: 3 },
    { la: "corpus", mid: "corporis, o.", nl: "het lichaam", soort: "nw", gs: "o", dekl: 3 },
    { la: "fructus", mid: "fructūs", nl: "de vrucht", soort: "nw", gs: "m", dekl: 4 },
    { la: "rēs", mid: "reī", nl: "de zaak", soort: "nw", gs: "v", dekl: 5 },
  ];
  const MODEL_ADJ = Object.values(G.ADJ_MODELLEN).map((x) => ({ ...x, nl: "" }));
  const MOD_ITEMS = [
    ...MODEL_WOORDEN.flatMap((w) => Object.keys(nf(w).forms).filter((c) => nf(w).forms[c] && !c.startsWith("voc")).map((c) => ({ w, c }))),
    ...MODEL_ADJ.flatMap((w) => (w.klasse === 1 || w.groep === 3 ? ["m", "v", "o"] : ["m", "o"]).flatMap((gs) => Object.keys(af(w).forms[gs]).filter((c) => !c.startsWith("voc")).map((c) => ({ w, c, gs })))),
  ];
  const modKey = (it) => `mod:${head(it.w.la)}:${it.c}${it.gs ? ":" + it.gs : ""}`;
  unit({
    id: "modellen", group: "N", label: "Modeltabellen (avus … rēs, bonus, fēlīx, fortis, ācer)", page: "leerstofoverzicht klassen",
    rule: "Ken de modeltabellen vanbuiten: 1e klasse avus, rosa, dōnum · 2e klasse dux/māter, corpus · 3e klasse fructus, rēs · adjectieven bonus (1e klasse) en fēlīx, fortis, ācer (2e klasse).",
    items: () => MOD_ITEMS, noRange: true,
    gen(level, it) {
      const F = it.gs ? af(it.w).forms[it.gs] : nf(it.w).forms, ans = F[it.c];
      const gsTxt = it.gs ? `, ${{ m: "mannelijk", v: "vrouwelijk", o: "onzijdig" }[it.gs]}` : "";
      const q = base(this, { instruction: `Geef de <b>${cellLang(it.c)}${gsTxt}</b> van het model`, prompt: `${esc(it.w.la)}<span class="midcol">${esc(it.w.mid)}</span>`, promptClass: "latin",
        answerShown: esc(ans.join(" of ")), accepted: ans, tag: "vormen", key: modKey(it), itemLabel: `${head(it.w.la)}: ${cellTxt(it.c)}${it.gs ? " " + it.gs + "." : ""}` });
      if (typed(level, 0.6)) return Object.assign(q, { mode: "text", lang: "la", check: "form", short: true });
      const all = it.gs ? G.GS.flatMap((g) => Object.values(af(it.w).forms[g])) : Object.values(F);
      const others = uniq(all.filter(Boolean).flat()).filter((f) => !ans.includes(f));
      return Object.assign(q, { mode: "mc", options: shuffle([ans[0], ...shuffle(others).slice(0, nOpts(level))]).map((o) => ({ v: o, html: lat(o) })), answer: ans[0] });
    },
  });

  // ============================================================
  // WERKWOORDEN
  // ============================================================
  const WIJSL = { ind: "ind.", imp: "imp." };
  const TIJDL = { praes: "praes.", imperf: "imperf.", fut: "fut. s." };
  const persL = (p) => `${p}${p === "1" ? "ste" : "de"} p.`;
  // "act. ind. fut. s. 3de p. mv." (zoals in de klas)
  const wwTxt = (k) => { const x = G.keyParts(k); return x.tijd === "imp" ? `${x.vorm}. imp. praes. ${persL(x.p)} ${GTL[x.g]}` : `${x.vorm}. ind. ${TIJDL[x.tijd]} ${persL(x.p)} ${GTL[x.g]}`; };
  const wwLang = (k) => { const x = G.keyParts(k); return x.tijd === "imp" ? `imperatief ${x.g === "mv" ? "meervoud" : "enkelvoud"}` : `${G.VORM_NAAM[x.vorm]} · ${G.TIJD_NAAM[x.tijd]} · ${persL(x.p)} ${x.g === "mv" ? "meervoud" : "enkelvoud"}`; };
  const anWW = (k) => { const x = G.keyParts(k); return x.tijd === "imp" ? `${x.vorm}|imp|praes|${x.p}|${x.g}` : `${x.vorm}|ind|${x.tijd}|${x.p}|${x.g}`; };
  const PICK_WW = [
    { label: "vorm", opts: [{ v: "act", html: "act." }, { v: "pass", html: "pass." }] },
    { label: "wijs", opts: [{ v: "ind", html: "ind." }, { v: "imp", html: "imp." }] },
    { label: "tijd", opts: [{ v: "praes", html: "praes." }, { v: "imperf", html: "imperf." }, { v: "fut", html: "fut. s." }] },
    { label: "persoon", opts: G.PERS.map((p) => ({ v: p, html: persL(p) })) },
    { label: "getal", opts: G.GETAL.map((g) => ({ v: g, html: GTL[g] })) },
  ];
  const verbShow = (w) => `${esc(head(w.la))} <small>(${esc(w.nl)})</small>`;
  const isRegular = (w) => vs(w) && vs(w).kind !== "onr";
  // willekeurige vormsleutel (imperatief zelden)
  function pickKey(F, opt = {}) {
    let ks = Object.keys(F);
    if (opt.noImp || Math.random() < 0.9) ks = ks.filter((k) => !k.includes(".imp."));
    if (opt.tijd) ks = ks.filter((k) => k.includes(`.${opt.tijd}.`));
    return pick(ks);
  }
  const keysWith = (F, f) => Object.keys(F).filter((k) => F[k].includes(f));

  // ---------- V1. werkwoordsvorm bepalen (de tempel) ----------
  unit({
    id: "ww_bepalen", group: "V", label: "Werkwoordsvorm bepalen (vorm, wijs, tijd, persoon, getal)", page: "tempel van het werkwoord",
    rule: "Tempel van het werkwoord: vorm (act./pass.) · wijs (ind./imp.) · tijd (praes./imperf./fut. s.) · persoon (1-2-3) · getal (enk./mv.). Imperfectum = -ba- · futurum = -b- + bindklinker (amāre, monēre) of -ē-/-a- (tegere, audīre, capere).",
    items: (s) => inRange(s).filter((w) => vs(w)),
    gen(level, w, s) {
      const F = vf(w), k = pickKey(F, { tijd: tijdOf(s) }), f = F[k][0], valid = uniq(keysWith(F, f).map(anWW));
      const q = base(this, { instruction: "Determineer deze werkwoordsvorm.", prompt: lat(f), promptClass: "latin", hint: level === "easy" ? `van ${head(w.la)} (${w.nl})` : "",
        page: `§${w.sec} · nr. ${w.nr}`, valid, answerShown: uniq(keysWith(F, f).map(wwTxt)).join(" <i>of</i> ") + ` <small>(${esc(head(w.la))})</small>`, tag: "bepalen_ww",
        key: `wbep:${w.nr}`, itemLabel: `${w.nr}. ${f}: bepalen`, nr: w.nr });
      if (level === "easy") {
        const wrong = shuffle(Object.keys(F).filter((x) => !F[x].includes(f) && G.keyParts(x).p === G.keyParts(k).p)).map(wwTxt);
        const opts = shuffle([wwTxt(k), ...uniq(wrong).slice(0, 3)]);
        return Object.assign(q, { mode: "mc", options: opts.map((o) => ({ v: o, html: esc(o) })), answer: wwTxt(k) });
      }
      return Object.assign(q, { mode: "pick", picks: PICK_WW, check: "pick" });
    },
  });

  // ---------- V2. vorm maken ----------
  unit({
    id: "ww_vorm", group: "V", label: "Werkwoord: gevraagde vorm maken", page: "leerstofoverzicht werkwoord",
    rule: "Zoek het vervoegingsmodel (amāre, monēre, tegere, audīre, capere of onregelmatig), neem de stam en voeg de tijdkenmerken en de uitgang toe.",
    items: (s) => inRange(s).filter((w) => vs(w)),
    gen(level, w, s) {
      const F = vf(w), k = pickKey(F, { tijd: tijdOf(s) }), ans = F[k];
      const q = base(this, { instruction: `Geef: <b>${esc(wwTxt(k))}</b> <small>(${esc(wwLang(k))})</small>`, prompt: verbShow(w), promptClass: "latin",
        page: `§${w.sec} · nr. ${w.nr}`, accepted: ans, answerShown: esc(ans.join(" of ")), tag: "vormen_ww", key: `wvorm:${w.nr}`, itemLabel: `${w.nr}. ${head(w.la)}: ${wwTxt(k)}`, nr: w.nr });
      if (typed(level, 0.6)) return Object.assign(q, { mode: "text", lang: "la", check: "form", short: false });
      const x = G.keyParts(k);
      const near = Object.keys(F).filter((y) => !F[y].includes(ans[0]) && G.keyParts(y).p === x.p && G.keyParts(y).g === x.g).map((y) => F[y][0]);
      const opts = shuffle([ans[0], ...shuffle(uniq(near)).slice(0, nOpts(level))]);
      return Object.assign(q, { mode: "mc", options: opts.map((o) => ({ v: o, html: lat(o) })), answer: ans[0] });
    },
  });

  // ---------- V3. tabel vervoegen ----------
  unit({
    id: "ww_tabel", group: "V", label: "Werkwoord: tabel invullen (vervoegen)", page: "leerstofoverzicht werkwoord",
    rule: "Vervoeg per persoon: 1ste, 2de, 3de p. enkelvoud en meervoud. Actief: -ō/-m, -s, -t, -mus, -tis, -nt · passief: -or/-r, -ris, -tur, -mur, -minī, -ntur.",
    items: (s) => inRange(s).filter((w) => vs(w)),
    gen(level, w, s) {
      const F = vf(w), v = vs(w), vorm = v.pass && Math.random() < 0.4 ? "pass" : "act", tijd = tijdOf(s) || pick(G.TIJD);
      const cells = ["1.enk", "2.enk", "3.enk", "1.mv", "2.mv", "3.mv"].map((x) => `${vorm}.${tijd}.${x}`), acc = cells.map((c) => F[c]);
      return base(this, { mode: "fields", instruction: `Vervoeg in de <b>${G.VORM_NAAM[vorm]}e indicatief ${G.TIJD_NAAM[tijd]}</b>`.replace("actiefe", "actieve").replace("passiefe", "passieve"),
        prompt: verbShow(w), promptClass: "latin", page: `§${w.sec} · nr. ${w.nr}`,
        fields: cells.map((c) => { const x = G.keyParts(c); return { label: `${persL(x.p)} ${GTL[x.g]}` }; }), cells, acc,
        answerShown: acc.map((a) => `<span class="latin">${esc(a[0])}</span>`).join(", "), tag: "vormen_ww", key: `wtab:${w.nr}`, itemLabel: `${w.nr}. ${head(w.la)}: ${vorm}. ${G.TIJD_NAAM[tijd]}`, nr: w.nr, check: "table" });
    },
  });

  // ---------- V4. futurum splitsen ----------
  const splitTxt = (parts) => parts.filter(Boolean).join("-");
  unit({
    id: "ww_splitsen", group: "V", label: "Futurum: splitsen in stam – kenletter – (bindklinker) – uitgang", page: "futurum simplex",
    rule: "amāre, monēre: stam + kenletter b + eventueel bindklinker + uitgang (amā-b-i-t, amā-b-u-nt, amā-b-e-ris). tegere, audīre, capere: stam + kenletter ē (a in de 1ste p. enk.) + uitgang (teg-a-m, audi-ē-s, capi-e-nt).",
    items: (s) => inRange(s).filter(isRegular),
    gen(level, w) {
      const v = vs(w), vorm = v.pass && Math.random() < 0.4 ? "pass" : "act", i = rnd(6), parts = G.futSplit(v, vorm)[i], f = parts.join(""), ans = splitTxt(parts);
      const key = `${vorm}.fut.${(i % 3) + 1}.${i < 3 ? "enk" : "mv"}`;
      const q = base(this, { instruction: "Splits deze futurumvorm in stam – kenletter – (bindklinker) – uitgang.", prompt: lat(f) + `<small> (${esc(head(w.la))})</small>`, promptClass: "latin",
        page: `§${w.sec} · nr. ${w.nr}`, parts: parts.filter(Boolean), answerShown: `<span class="latin">${esc(ans)}</span> <small>(${esc(wwTxt(key))})</small>`, tag: "splitsen",
        key: `wspl:${w.nr}`, itemLabel: `${w.nr}. ${f}: splitsen`, nr: w.nr });
      if (level === "hard" || (level === "normal" && Math.random() < 0.5)) return Object.assign(q, { mode: "text", lang: "la", check: "split", instruction: q.instruction + " Typ de delen met streepjes ertussen (bv. amā-b-u-nt)." });
      const p = parts.filter(Boolean), wrongs = [];
      if (p[0].length > 2) wrongs.push([p[0].slice(0, -1), p[0].slice(-1) + p[1], ...p.slice(2)].join("-"));
      wrongs.push([p[0] + p[1], ...p.slice(2)].join("-"));
      if (p.length > 2) wrongs.push([p[0], p[1] + p[2], ...p.slice(3)].join("-"));
      wrongs.push([p[0], p.slice(1).join("")].join("-"));
      const opts = shuffle([ans, ...uniq(wrongs).filter((x) => x !== ans).slice(0, 3)]);
      return Object.assign(q, { mode: "mc", options: opts.map((o) => ({ v: o, html: lat(o) })), answer: ans });
    },
  });

  // ---------- V5. verwar niet: welke tijd? ----------
  unit({
    id: "ww_verwar", group: "V", label: "Verwar niet: praesens, imperfectum of futurum?", page: "futurum simplex",
    rule: "Verwar niet: tegēs (fut.) ↔ tegis (praes.) · tegēris (pass. fut.) ↔ tegeris (pass. praes.) · monēs is praesens! · monēbit (fut.) ↔ monēbat (imperf.) · erunt (fut.) ↔ erant (imperf.).",
    items: (s) => inRange(s).filter((w) => vs(w)),
    gen(level, w, s) {
      const F = vf(w), v = vs(w), p = pick(G.PERS), g = pick(G.GETAL), vorm = v.pass && level !== "easy" && Math.random() < 0.4 ? "pass" : "act", tijd = tijdOf(s) || pick(G.TIJD);
      const target = F[`${vorm}.${tijd}.${p}.${g}`][0];
      let cand = G.TIJD.map((t) => F[`${vorm}.${t}.${p}.${g}`][0]);
      if (level === "hard" && v.pass) cand = cand.concat(G.TIJD.map((t) => F[`${vorm === "act" ? "pass" : "act"}.${t}.${p}.${g}`][0]));
      const opts = shuffle(uniq(cand));
      const what = level === "hard" && v.pass ? `${G.VORM_NAAM[vorm]} ${G.TIJD_NAAM[tijd]}` : G.TIJD_NAAM[tijd];
      return base(this, { mode: "mc", instruction: `Welke vorm is <b>${esc(what)}</b>?`, prompt: verbShow(w), promptClass: "latin", page: `§${w.sec} · nr. ${w.nr}`,
        options: opts.map((o) => ({ v: o, html: lat(o) })), answer: target, answerShown: `${lat(target)} <small>(${esc(wwTxt(`${vorm}.${tijd}.${p}.${g}`))})</small>`, tag: "tijd",
        key: `verw:${w.nr}`, itemLabel: `${w.nr}. ${head(w.la)}: ${what}`, nr: w.nr });
    },
  });

  // ---------- V6. van welk werkwoord? ----------
  unit({
    id: "ww_inf", group: "V", label: "Van welk werkwoord? (infinitief praesens)", page: "futurum simplex",
    rule: "Haal tijdkenmerk en uitgang weg en zoek het werkwoord in de woordenlijst. Let op onregelmatige vormen: ībō → īre, fīent → fierī, poterunt → posse, feram → ferre, volam → velle.",
    items: (s) => inRange(s).filter((w) => vs(w)),
    gen(level, w, s) {
      const F = vf(w), k = pickKey(F, { tijd: tijdOf(s) }), f = F[k][0], ans = head(w.la);
      const q = base(this, { instruction: "Van welk werkwoord komt deze vorm? Geef de (actieve) infinitief praesens.", prompt: lat(f), promptClass: "latin", page: `§${w.sec} · nr. ${w.nr}`,
        target: ans, answerShown: `${lat(ans)} – ${esc(w.nl)} <small>(${esc(wwTxt(k))})</small>`, tag: "herkennen_ww", key: `winf:${w.nr}`, itemLabel: `${w.nr}. ${f} → ${ans}`, nr: w.nr });
      if (typed(level, 0.5)) return Object.assign(q, { mode: "text", lang: "la", check: "lemma" });
      const v = vs(w), pool = rangeOr(s, VERBS, 6).filter((x) => head(x.la) !== ans);
      const like = pool.filter((x) => vs(x).kind === v.kind || head(x.la).slice(0, 3) === ans.slice(0, 3));
      const opts = shuffle([ans, ...uniq(shuffle(like).concat(shuffle(pool)).map((x) => head(x.la))).slice(0, nOpts(level))]);
      return Object.assign(q, { mode: "mc", options: opts.map((o) => ({ v: o, html: lat(o) })), answer: ans });
    },
  });

  // ---------- V7. vervoegingsmodel ----------
  const MODELS_WW = ["1", "2", "3", "4", "3io"];
  unit({
    id: "ww_model", group: "V", label: "Vervoegingsmodel herkennen (amāre, monēre, tegere, audīre, capere)", page: "futurum simplex",
    rule: "Zoek het werkwoord in de woordenlijst: -āre = amāre · -ēre, ~eō = monēre · -ere, ~ō = tegere · -īre, ~iō = audīre · -ere, ~iō = capere ('Oh zo lekker': facere, fugere, rapere, iacere, capere, cupere).",
    items: (s) => inRange(s).filter(isRegular),
    gen(level, w, s) {
      const F = vf(w), k = pickKey(F, { noImp: true, tijd: tijdOf(s) }), f = F[k][0], m = vs(w).kind;
      return base(this, { mode: "mc", instruction: "Volgens welk model wordt dit werkwoord vervoegd?", prompt: lat(f), promptClass: "latin", hint: level === "easy" ? `van ${head(w.la)}` : "",
        page: `§${w.sec} · nr. ${w.nr}`, options: MODELS_WW.map((x) => ({ v: x, html: `<span class="latin">${G.MODEL_WW[x]}</span>` })), answer: m,
        answerShown: `${lat(G.MODEL_WW[m])} <small>(${esc(head(w.la))}, ${esc(w.nl)} · ${esc(wwTxt(k))})</small>`, tag: "vervoeging", key: `wmod:${w.nr}`, itemLabel: `${w.nr}. ${head(w.la)}: model`, nr: w.nr });
    },
  });

  // ---------- V8. vertalen ----------
  const NL_ALT = [["ik"], ["jij", "je"], ["hij", "zij", "ze", "het"], ["wij", "we"], ["jullie"], ["zij", "ze"]];
  const VERT_ITEMS = Object.keys(G.NL_WW).map((inf) => WOORDEN.find((w) => w.soort === "ww" && head(w.la) === inf && vs(w))).filter(Boolean);
  function nlAccepted(nl, k) {
    const x = G.keyParts(k), i = G.slot(x.p, x.g), rest = nl.split(" ").slice(1).join(" ");
    return NL_ALT[i].map((p) => norm(`${p} ${rest}`));
  }
  unit({
    id: "ww_vertalen", group: "V", label: "Werkwoordsvorm vertalen (ik zal …, hij werd …)", page: "futurum simplex",
    rule: "praesens: hij bemint / hij wordt bemind · imperfectum (onvoltooid verleden tijd): hij beminde / hij werd bemind · futurum (onvoltooid toekomende tijd): hij zal beminnen / hij zal bemind worden.",
    items: () => VERT_ITEMS, noRange: true,
    gen(level, w, s) {
      const inf = head(w.la), F = vf(w), tj = tijdOf(s);
      const keys = Object.keys(F).filter((k) => !k.includes(".imp.") && G.nlVorm(inf, k) && (!tj || k.includes(`.${tj}.`)));
      const k = pick(keys), nl = G.nlVorm(inf, k), f = F[k][0];
      const q = base(this, { instruction: "Vertaal deze werkwoordsvorm.", prompt: lat(f) + `<small> (${esc(inf)}: ${esc(/;/.test(G.NL_WW[inf]) ? w.nl : G.NL_WW[inf].split("|")[3])})</small>`, promptClass: "latin", page: "futurum simplex",
        answerShown: `${esc(nl)} <small>(${esc(wwTxt(k))})</small>`, accepted: nlAccepted(nl, k), tag: "vertalen_ww", key: `wvert:${inf}`, itemLabel: `${f} = ${nl}` });
      if (level === "hard") return Object.assign(q, { mode: "text", lang: "nl", noKeyboard: true, check: "nlww" });
      const x = G.keyParts(k);
      const near = keys.filter((y) => y !== k && (G.keyParts(y).p === x.p && G.keyParts(y).g === x.g)).map((y) => G.nlVorm(inf, y));
      const far = keys.filter((y) => y !== k && G.keyParts(y).tijd === x.tijd).map((y) => G.nlVorm(inf, y));
      const opts = shuffle([nl, ...uniq(shuffle(near).concat(shuffle(far))).filter((o) => o !== nl).slice(0, nOpts(level))]);
      return Object.assign(q, { mode: "mc", options: opts.map((o) => ({ v: o, html: esc(o) })), answer: nl });
    },
  });

  // ---------- R. regels en begrippen ----------
  const REGEL_ITEMS = G.REGELS.map(([id, vraag, antw, ...fout]) => ({ id, vraag, antw, fout }));
  unit({
    id: "regels", group: "R", label: "Regels en begrippen (klassen, datief, futurum, verwar niet)", page: "samenvatting grammatica",
    rule: "Lees de samenvatting nog eens na in de leerkaarten (studeren → kaarten 'Regels').",
    items: () => REGEL_ITEMS, noRange: true,
    gen(level, it) {
      const opts = shuffle([it.antw, ...it.fout.slice(0, level === "easy" ? 2 : 3)]);
      return base(this, { mode: "mc", instruction: it.vraag, prompt: "", options: opts.map((o) => ({ v: o, html: o })), answer: it.antw, answerShown: it.antw, tag: "regels",
        key: `regel:${it.id}`, itemLabel: `regel: ${it.vraag.replace(/<[^>]+>/g, "")}` });
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
  const KEY_UNIT = { vertalen: "vertalen", midden: "midden", herkennen: "herkennen", vv: "voorvoegsels", dekl: "verbuiging", gs: "geslacht", verv: "vervoeging", dat: "datief", sfx: "achtervoegsels",
    nvorm: "nw_vorm", ntab: "nw_tabel", nbep: "nw_bepalen", cong: "congruentie", bn2: "bn2", mod: "modellen",
    wbep: "ww_bepalen", wvorm: "ww_vorm", wtab: "ww_tabel", wspl: "ww_splitsen", verw: "ww_verwar", winf: "ww_inf", wmod: "ww_model", wvert: "ww_vertalen", regel: "regels" };
  function fromKey(key, level, s = {}) {
    const i = key.indexOf(":"), pre = key.slice(0, i), rest = key.slice(i + 1), u = UNITS.find((x) => x.id === KEY_UNIT[pre]);
    if (!u) return null;
    const all = { bereik: [MIN, MAX] };
    Object.assign(all, { nwKlasse: s.nwKlasse, wwTijd: s.wwTijd });
    if (pre === "sfx") { const it = SFX_ITEMS.find((x) => (x.t === "duidt" ? x.g.sfx : x.w[2]) === rest); return it ? u.gen(level, it, all) : null; }
    if (pre === "mod") { const it = MOD_ITEMS.find((x) => modKey(x) === key); return it ? u.gen(level, it, all) : null; }
    if (pre === "wvert") { const it = VERT_ITEMS.find((x) => head(x.la) === rest); return it ? u.gen(level, it, all) : null; }
    if (pre === "regel") { const it = REGEL_ITEMS.find((x) => x.id === rest); return it ? u.gen(level, it, all) : null; }
    const nr = +rest, r = s.bereik || [MIN, MAX];
    if (!u.noRange && (nr < r[0] || nr > r[1])) return null; // buiten het gekozen bereik
    const it = u.items({ bereik: [nr, nr] }).find((x) => x.nr === nr);
    return it ? u.gen(level, it, all) : null;
  }
  function regen(q, level) {
    return (q.key && fromKey(q.key, level)) || { ...q };
  }

  // ============================================================
  // VERBETEREN
  // ============================================================
  function check(given, q, level) {
    let r;
    if (q.mode === "mc") r = given === q.answer ? { status: "correct" } : { status: "wrong", tag: q.tag || (q.unit === "vertalen" ? "betekenis" : "fout") };
    else if (q.check === "mid") r = checkMid(given, q, level);
    else if (q.check === "form") r = formResult(bestOf(given, q.accepted), q.accepted[0], q.tag);
    else if (q.check === "table") {
      const res = given.map((g, i) => bestOf(g, q.acc[i]));
      const bad = q.cells.map((c, i) => (res[i] === "ok" || res[i] === "macron" ? null : q.fields[i].label)).filter(Boolean);
      if (!bad.length) r = res.includes("macron") ? { status: "correct", note: "Let wel op de lengtetekens (zie hieronder)." } : { status: "correct" };
      else r = { status: "wrong", tag: q.tag, note: `${q.cells.length - bad.length} van ${q.cells.length} juist. Fout: ${bad.join(", ")}.` };
      if (r.status === "correct" && res.includes("macron")) r.note = `Met lengtetekens: ${q.acc.map((a) => a[0]).join(", ")}`;
    } else if (q.check === "pick") {
      const key = given.join("|");
      if (q.valid.includes(key)) r = { status: "correct" };
      else {
        const lbl = q.picks.map((x) => x.label);
        const best = q.valid.map((v) => v.split("|")).map((v) => v.map((x, i) => x === given[i])).sort((a, b) => b.filter(Boolean).length - a.filter(Boolean).length)[0];
        const ok = lbl.filter((_, i) => best[i]), ko = lbl.filter((_, i) => !best[i]);
        r = { status: "wrong", tag: q.tag, note: ok.length ? `Juist: ${ok.join(", ")}. Fout: ${ko.join(", ")}.` : "" };
      }
    } else if (q.check === "split") {
      const t = String(given).trim().toLowerCase().split(/\s*[-\/|·.\s]\s*/).filter(Boolean);
      const res = t.length === q.parts.length ? worst(q.parts.map((p, i) => (iEq(t[i]) === iEq(p) ? "ok" : noMacron(iEq(t[i])) === noMacron(iEq(p)) ? "macron" : null))) : null;
      r = res === "ok" ? { status: "correct" } : res === "macron" ? { status: "correct", note: `Met lengtetekens: ${q.parts.join("-")}` } : { status: "wrong", tag: "splitsen" };
    } else if (q.check === "nlww") {
      const g = norm(given);
      r = q.accepted.includes(g) ? { status: "correct" } : q.accepted.some((a) => lev(a, g) <= 1) ? { status: "spelling", tag: "spelling" } : { status: "wrong", tag: "vertalen_ww" };
    }
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
  // KAARTEN (studiemodule): eerst de betekenis, pas daarna de middenkolom
  //   na: "vertalen:<nr>" → de middenkolomkaart komt pas als de betekenis zit
  // ============================================================
  const SOORT_NAAM = { nw: "zelfst. naamwoord", bn: "bijv. naamwoord", ww: "werkwoord", bw: "bijwoord", vw: "voegwoord" };
  const wordInfo = (w) => [
    w.soort === "nw" && w.gs ? `${GS_NAAM[w.gs]}${w.dekl ? " · " + DEKL_NAAM[w.dekl] : ""}` : w.soort === "ww" && w.verv ? VERV_NAAM[w.verv] : SOORT_NAAM[w.soort] || "",
    w.naamval ? "+ " + w.naamval : "",
  ].filter(Boolean).join(" · ");
  const KAART_UNITS = ["vertalen", "midden", "regels"];
  // grammaticakaarten: regels + volledige tabellen (modellen en werkwoorden)
  const ptab = (head1, rows) => `<table class="ptab"><tr>${head1.map((h) => `<th>${h}</th>`).join("")}</tr>${rows.map((r) => `<tr>${r.map((c, i) => (i ? `<td class="latin">${esc(c)}</td>` : `<th>${c}</th>`)).join("")}</tr>`).join("")}</table>`;
  const PERS_RIJ = ["1ste p. enk.", "2de p. enk.", "3de p. enk.", "1ste p. mv.", "2de p. mv.", "3de p. mv."];
  function grammarCards() {
    const out = REGEL_ITEMS.map((it) => ({ key: `regel:${it.id}`, unit: "regels", soort: "Regel", ask: "Weet je het antwoord?", front: it.vraag, back: it.antw, page: "samenvatting grammatica", label: `regel: ${it.vraag.replace(/<[^>]+>/g, "")}` }));
    MODEL_WOORDEN.forEach((w) => {
      const F = nf(w).forms, m = nf(w).model;
      out.push({ key: `tab:${head(w.la)}`, unit: "regels", soort: "Tabel", ask: "Verbuig dit model (enk. en mv.)",
        front: `${esc(w.la)}<span class="midcol">${esc(w.mid)}</span>`, frontCls: "latin", info: `${G.KLASSE_NAAM[G.modelKlasse(m)]} · ${esc(w.nl)}`,
        back: ptab(["", "enk.", "mv."], G.NV.map((n) => [NVL[n], F[`${n}.enk`][0], F[`${n}.mv`] ? F[`${n}.mv`][0] : "-um / -ium"])), page: "leerstofoverzicht klassen", label: `tabel ${head(w.la)}` });
    });
    MODEL_ADJ.forEach((w) => {
      const A = af(w).forms;
      out.push({ key: `tab:${head(w.la)}`, unit: "regels", soort: "Tabel", ask: "Verbuig dit adjectief (m. – v. – o.)",
        front: esc(w.la), frontCls: "latin", info: esc(w.titel),
        back: ["enk", "mv"].map((g) => ptab([GTL[g], "m.", "v.", "o."], G.NV.map((n) => [NVL[n], ...G.GS.map((x) => A[x][`${n}.${g}`][0])]))).join(""), page: "adjectieven", label: `tabel ${head(w.la)}` });
    });
    const wwModels = Object.values(G.MODEL_WW).map((inf) => WOORDEN.find((x) => x.soort === "ww" && head(x.la) === inf)).filter(Boolean);
    const wwOnr = Object.keys(G.ONR).map((inf) => WOORDEN.find((x) => x.soort === "ww" && head(x.la) === inf)).filter((x) => x && vs(x));
    [...wwModels, ...wwOnr].forEach((w) => {
      const F = vf(w), inf = head(w.la);
      G.TIJD.forEach((t) => {
        const hasP = !!F[`pass.${t}.1.enk`];
        out.push({ key: `tab:${inf}:${t}`, unit: "regels", soort: "Tabel", ask: `Vervoeg: indicatief ${G.TIJD_NAAM[t]}${hasP ? " (actief en passief)" : ""}`,
          front: esc(inf), frontCls: "latin", info: esc(w.nl),
          back: ptab(hasP ? ["", "actief", "passief"] : ["", "actief"], PERS_RIJ.map((pr, i) => { const k = `${(i % 3) + 1}.${i < 3 ? "enk" : "mv"}`; return [pr, F[`act.${t}.${k}`][0], ...(hasP ? [F[`pass.${t}.${k}`][0]] : [])]; })),
          page: G.TIJD_NAAM[t], label: `tabel ${inf} ${G.TIJD_NAAM[t]}` });
      });
    });
    return out;
  }
  function kaarten(s) {
    const sel = s && Array.isArray(s.units) ? s.units : KAART_UNITS;
    const words = s ? inRange(s) : WOORDEN;
    const out = [];
    words.forEach((w) => {
      const page = `§${w.sec} · nr. ${w.nr}`;
      if (sel.includes("vertalen")) out.push({ key: `vertalen:${w.nr}`, unit: "vertalen", soort: "Betekenis", ask: "Wat betekent dit woord?",
        front: esc(w.la), frontCls: "latin", back: esc(w.nl), info: (w.mid ? `<span class="latin">${esc(w.mid)}</span> · ` : "") + esc(wordInfo(w)),
        tip: w.afl ? `denk aan: ${esc(w.afl)}` : "", page, label: `${w.nr}. ${w.la} → ${w.nl}` });
      if (sel.includes("midden") && w.mid) out.push({ key: `midden:${w.nr}`, unit: "midden", soort: "Middenkolom", ask: "Wat staat er in de middenkolom?",
        front: esc(w.la), frontCls: "latin", back: esc(w.mid), backCls: "latin", info: esc(w.nl), page, label: `${w.nr}. ${w.la} – ${w.mid}`, na: `vertalen:${w.nr}` });
    });
    if (sel.includes("regels")) out.push(...grammarCards());
    return out;
  }

  // ============================================================
  // Aansluiting op de gedeelde app
  // ============================================================
  Vakken.register({
    id: "latijn-2", vak: I.vak, icon: I.icon, theme: I.theme, titel: I.titel, klas: I.klas, bron: I.bron,
    groups: [
      { id: "W", short: "woorden", titel: "Woordenschat", p: "" },
      { id: "N", short: "naamwoorden", titel: "Grammatica: substantieven en adjectieven (klassen)", p: "" },
      { id: "V", short: "werkwoorden", titel: "Grammatica: werkwoorden (praesens, imperfectum, futurum)", p: "" },
      { id: "G", short: "woordvorming", titel: "Woordvorming en woordenlijst", p: "" },
      { id: "R", short: "regels", titel: "Regels en begrippen", p: "" },
    ],
    units: UNITS.map((u) => ({ id: u.id, group: u.group, label: u.label, page: u.page })),
    quick: [
      { label: "Alles", select: () => true },
      { label: "📖 Vertalen + middenkolom", select: (u) => u.id === "vertalen" || u.id === "midden" },
      { label: "📚 Enkel woordenschat", select: (u) => u.group === "W" },
      { label: "🧩 Substantieven + adjectieven", select: (u) => u.group === "N" },
      { label: "⚙️ Werkwoorden", select: (u) => u.group === "V" },
      { label: "🏟️ Caput 8: 3e klasse + futurum", select: (u) => ["verbuiging", "nw_vorm", "nw_tabel", "nw_bepalen", "congruentie", "ww_bepalen", "ww_vorm", "ww_splitsen", "ww_verwar", "ww_vertalen", "ww_inf", "regels"].includes(u.id) },
    ],
    settings: [
      { key: "bereik", type: "range", label: "Welke woorden? <span class=\"muted\">(nummers uit de woordenlijst)</span>", min: MIN, max: MAX, default: [MIN, MAX],
        presets: [{ label: "Alles", v: [MIN, MAX] }, ...CAPS.map((x) => ({ label: `${x.c} ${x.naam}`, v: x.v }))],
        hint: "Geldt voor alle vragen over woorden (ook grammatica). Een paragraaf kiezen? Typ de nummers (bv. 344 tot 358 = §3.3). De kaders 'woordvorming: achtervoegsels' hebben geen nummers en komen altijd aan bod als je ze aanvinkt." },
      { key: "welke", type: "radio", label: "Welke woorden in dat bereik?", default: "alle",
        options: [{ v: "alle", label: "Alle woorden" }, { v: "vet", label: "Enkel vetgedrukte <small>(750 meest frequente)</small>" }] },
      { key: "nwKlasse", type: "radio", label: "Substantieven en adjectieven: welke klasse? <span class=\"muted\">(grammatica)</span>", default: "alle",
        options: [{ v: "alle", label: "Alle klassen" }, { v: "1", label: "1e klasse <small>(avus, rosa, dōnum, bonus)</small>" }, { v: "2", label: "2e klasse <small>(dux, māter, corpus, fēlīx, fortis, ācer)</small>" }, { v: "3", label: "3e klasse <small>(fructus, rēs)</small>" }] },
      { key: "wwTijd", type: "radio", label: "Werkwoorden: welke tijd? <span class=\"muted\">(grammatica)</span>", default: "alle",
        options: [{ v: "alle", label: "Alle tijden" }, { v: "praes", label: "praesens" }, { v: "imperf", label: "imperfectum" }, { v: "fut", label: "futurum simplex" }] },
    ],
    describe: (s) => `woorden ${s.bereik[0]}–${s.bereik[1]}${s.welke === "vet" ? " (enkel vetgedrukt)" : ""} (${inRange(s).length})${s.nwKlasse && s.nwKlasse !== "alle" ? ` · ${s.nwKlasse}e klasse` : ""}${s.wwTijd && s.wwTijd !== "alle" ? ` · ${{ praes: "praesens", imperf: "imperfectum", fut: "futurum" }[s.wwTijd]}` : ""}`,
    levels: {
      easy: { title: "🙂 Makkelijk", desc: "alles meerkeuze" },
      normal: { title: "💪 Normaal", desc: "meerkeuze + typen; lengtetekens (ā, ē…) hoeven niet" },
      hard: { title: "🔥 Moeilijk", desc: "alles zelf typen; geslacht moet erbij (lengtetekens hoeven niet)" },
    },
    allInfo: "<b>Eindtoets-modus:</b> elk woord uit het gekozen bereik komt per aangevinkt onderdeel precies één keer aan bod.",
    keyboard: ["ā", "ē", "ī", "ō", "ū", "~", ",", "-"], keyboardLabel: "Lengtetekens invoegen:",
    statusText: { spelling: "Bijna: één letter fout.", partial: "Bijna!" },
    tags: TAGS,
    makeQuiz, countAll, check, conclusions, regen, fromKey,
    kaarten, kaartUnits: KAART_UNITS,
    _UNITS: UNITS, _norm: norm, // voor tests
  });
})();
