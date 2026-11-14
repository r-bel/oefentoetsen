// ============================================================
// GRAMMATICA – Latijn 2de middelbaar: vormleer (naamwoorden en werkwoorden)
// Samengevat uit de leerstofoverzichten van de klas:
//   - substantieven 1e, 2e en 3e klasse (modellen avus, rosa, dōnum · dux, māter, corpus · fructus, rēs)
//   - adjectieven 1e klasse (bonus) en 2e klasse (fēlīx, fortis, ācer)
//   - datief (meewerkend voorwerp)
//   - werkwoorden: indicatief praesens, imperfectum en futurum simplex, actief en passief
//     (modellen amāre, monēre, tegere, audīre, capere) + onregelmatige werkwoorden
//     (esse, posse, īre, fierī, ferre, velle, nōlle, mālle) + imperatief
// Dit bestand bevat de tabellen (data) en de functies die er vormen mee maken.
// Het wordt geladen tussen inhoud.js en vak.js.
// ============================================================
(function () {
  "use strict";
  const I = Vakken.inhoud("latijn-2");
  const head = (la) => la.split(/,|\s\+|\sof\s/)[0].trim();

  // ---------- termen (zoals in de klas) ----------
  const NV = ["nom", "acc", "gen", "dat", "abl", "voc"];
  const NV_NAAM = { nom: "nominatief", acc: "accusatief", gen: "genitief", dat: "datief", abl: "ablatief", voc: "vocatief" };
  const GETAL = ["enk", "mv"];
  const GS = ["m", "v", "o"];
  const CELLS = GETAL.flatMap((g) => NV.map((n) => `${n}.${g}`)); // "nom.enk" …

  // ============================================================
  // SUBSTANTIEVEN
  // ============================================================
  // uitgangen per model: [nom, acc, gen, dat, abl, voc] enk. en mv.  ("N" = nominatief zoals in de woordenlijst)
  const MODELLEN = {
    avus:    { klasse: 1, gs: "m",   wl: "-us (-er), -ī",  enk: ["N", "um", "ī", "ō", "ō", "e"],   mv: ["ī", "ōs", "ōrum", "īs", "īs", "ī"] },
    rosa:    { klasse: 1, gs: "v",   wl: "-a, -ae",        enk: ["a", "am", "ae", "ae", "ā", "a"], mv: ["ae", "ās", "ārum", "īs", "īs", "ae"] },
    "dōnum": { klasse: 1, gs: "o",   wl: "-um, -ī",        enk: ["um", "um", "ī", "ō", "ō", "um"], mv: ["a", "a", "ōrum", "īs", "īs", "a"] },
    dux:     { klasse: 2, gs: "m/v", wl: "anders, -is",    enk: ["N", "em", "is", "ī", "e", "N"],  mv: ["ēs", "ēs", "um", "ibus", "ibus", "ēs"] },
    corpus:  { klasse: 2, gs: "o",   wl: "anders (us), -is (o.)", enk: ["N", "N", "is", "ī", "e", "N"], mv: ["a", "a", "um", "ibus", "ibus", "a"] },
    fructus: { klasse: 3, gs: "m",   wl: "-us, -ūs",       enk: ["us", "um", "ūs", "uī", "ū", "us"], mv: ["ūs", "ūs", "uum", "ibus", "ibus", "ūs"] },
    "rēs":   { klasse: 3, gs: "v",   wl: "-ēs, -eī",       enk: ["ēs", "em", "eī", "eī", "ē", "ēs"], mv: ["ēs", "ēs", "ērum", "ēbus", "ēbus", "ēs"] },
  };
  const MODEL_LABEL = { avus: "avus", rosa: "rosa", "dōnum": "dōnum", dux: "dux / māter", corpus: "corpus", fructus: "fructus", "rēs": "rēs" };
  const KLASSE_NAAM = { 1: "1e klasse", 2: "2e klasse", 3: "3e klasse" };
  // woordenlijst-verbuiging (1-5) → klasse van de klas
  const DEKL_KLASSE = { 1: 1, 2: 1, 3: 2, 4: 3, 5: 3 };

  // uitzonderingen die je apart moet kennen
  const SPECIAAL = {
    deus: { model: "avus", enk: ["deus", "deum", "deī", "deō", "deō", "deus"], mv: [["dī", "deī"], "deōs", "deōrum", ["dīs", "deīs"], ["dīs", "deīs"], ["dī", "deī"]] },
    domus: { model: "fructus", enk: ["domus", "domum", "domūs", "domuī", "domō", "domus"], mv: ["domūs", "domōs", ["domōrum", "domuum"], "domibus", "domibus", "domūs"] },
  };

  const lc = (s) => s.toLowerCase();
  const gsOf = (w) => (w.gs ? [w.gs] : /m\.\/v\./.test(w.mid || "") ? ["m", "v"] : []);

  // model van een substantief uit de woordenlijst (of null als het niet in een model past)
  function nounModel(w) {
    if (w.soort !== "nw" || !w.dekl || !w.mid) return null;
    const N = head(w.la);
    if (/^[A-ZĀĒĪŌŪ]/.test(N) || / /.test(N)) return null; // eigennamen, uitdrukkingen
    if (SPECIAAL[N]) return SPECIAAL[N].model;
    const g = gsOf(w)[0];
    if (w.dekl === 1) return "rosa";
    if (w.dekl === 2) return g === "o" ? (/um$/.test(N) || w.mv ? "dōnum" : null) : (/(us|er|ir)$/.test(N) || w.mv ? "avus" : null);
    if (w.dekl === 3) {
      if (g === "o" && (/(e|al|ar)$/.test(N) || (w.mv && /ium/.test(w.mid)))) return "mare"; // volgt adj. 2e klasse
      return g === "o" ? "corpus" : "dux";
    }
    if (w.dekl === 4) return /ū$/.test(N) ? "cornū" : "fructus";
    if (w.dekl === 5) return "rēs";
    return null;
  }
  // alle vormen van een substantief: { "nom.enk": ["rosa"], … } (eerste vorm = de gewone; null = niet gevraagd)
  function nounForms(w) {
    const model = nounModel(w);
    if (!model) return null;
    const N = head(w.la), gen = (w.mid || "").split(",")[0].trim();
    const out = {};
    const put = (getal, arr) => arr.forEach((e, i) => { out[`${NV[i]}.${getal}`] = e == null ? null : Array.isArray(e) ? e : [e]; });
    if (SPECIAAL[N]) { put("enk", SPECIAAL[N].enk); put("mv", SPECIAAL[N].mv); return { model, forms: out, mvOnly: false }; }
    let st;
    if (w.mv) {
      // enkel meervoud: stam uit de genitief meervoud
      st = gen.replace(/(ārum|ōrum|uum|ērum|ium|um)$/, "");
      if (st === gen) return null;
    } else if (model === "rēs") st = N.replace(/ēs$/, "");
    else st = gen.replace(/(ae|ī|is|ūs|eī|ēī)$/, "");
    if (!st || st === gen) return null;
    let enk, mv;
    if (model === "avus") enk = [N, st + "um", st + "ī", st + "ō", st + "ō", /ius$/.test(N) ? N.replace(/ius$/, "ī") : /us$/.test(N) ? st + "e" : N], mv = MODELLEN.avus.mv.map((e) => st + e);
    if (model === "rosa") enk = MODELLEN.rosa.enk.map((e) => st + e), mv = MODELLEN.rosa.mv.map((e) => st + e);
    if (model === "dōnum") enk = MODELLEN["dōnum"].enk.map((e) => st + e), mv = MODELLEN["dōnum"].mv.map((e) => st + e);
    if (model === "dux") {
      enk = [N, st + "em", st + "is", st + "ī", st + "e", N];
      // genitief meervoud: -um of -ium (urbium) → enkel gekend als het woord enkel meervoud heeft
      mv = [st + "ēs", st + "ēs", w.mv ? gen : null, st + "ibus", st + "ibus", st + "ēs"];
    }
    if (model === "corpus") enk = [N, N, st + "is", st + "ī", st + "e", N], mv = ["a", "a", "um", "ibus", "ibus", "a"].map((e) => st + e);
    if (model === "mare") enk = [N, N, st + "is", st + "ī", st + "ī", N], mv = ["ia", "ia", "ium", "ibus", "ibus", "ia"].map((e) => st + e);
    if (model === "fructus") enk = MODELLEN.fructus.enk.map((e) => st + e), mv = MODELLEN.fructus.mv.map((e) => st + e);
    if (model === "cornū") enk = ["ū", "ū", "ūs", "ū", "ū", "ū"].map((e) => st + e), mv = ["ua", "ua", "uum", "ibus", "ibus", "ua"].map((e) => st + e);
    if (model === "rēs") {
      const ei = /[aeiouāēīōū]$/.test(st) ? "ēī" : "eī";
      enk = [N, st + "em", st + ei, st + ei, st + "ē", N];
      mv = ["ēs", "ēs", "ērum", "ēbus", "ēbus", "ēs"].map((e) => st + e);
    }
    if (!enk) return null;
    if (w.mv) enk = enk.map(() => null);
    put("enk", enk); put("mv", mv);
    return { model, forms: out, mvOnly: !!w.mv };
  }
  // de weergaveklasse van het model (mare volgt de adjectieven, cornū volgt fructus)
  const modelKlasse = (m) => (m === "mare" ? 2 : m === "cornū" ? 3 : MODELLEN[m].klasse);
  const modelNaam = (m) => (m === "mare" ? "mare (zoals adj. 2e klasse)" : m === "cornū" ? "cornū (zoals fructus, onzijdig)" : MODEL_LABEL[m]);

  // ============================================================
  // ADJECTIEVEN
  // ============================================================
  const PRONOMINAAL = /^(ūnus|sōlus|tōtus|nūllus|ūllus|alius|alter|uter|neuter|uterque)$/;
  const ADJ_ZOALS_SUBST = /^(vetus|dīves|pauper)$/; // volgen de substantieven van de 2e klasse
  function adjInfo(w) {
    if (w.soort !== "bn" || !w.mid) return null;
    const N = head(w.la), m = w.mid;
    if (PRONOMINAAL.test(N)) return null;
    // 1e klasse: bonus, bona, bonum
    if (/^~a, ~um$/.test(m) && /us$/.test(N)) return { klasse: 1, st: N.replace(/us$/, ""), N };
    if (/^~ae, ~a$/.test(m) && /ī$/.test(N)) return { klasse: 1, st: N.replace(/ī$/, ""), N, mvOnly: true };
    const f = m.match(/^(\S+)a, (\S+)um$/);
    if (f) return { klasse: 1, st: f[1], N };
    // 2e klasse: drie groepen
    const t = m.match(/^(\S+), (\S+); (\S+)$/);
    if (t) {
      const [, a, b, gen] = t;
      if (/ōris$/.test(gen) || /ium$/.test(gen)) return null; // vergrotende trap / enkel meervoud
      const st = gen.replace(/is$/, "");
      if (ADJ_ZOALS_SUBST.test(N)) return { klasse: 2, groep: 1, st, N, zoalsSubst: true };
      if (a === "~" && b === "~") return { klasse: 2, groep: 1, st, N, o: N };
      if (a === "~" && /e$/.test(b)) return { klasse: 2, groep: 2, st, N, o: b };
      if (/is$/.test(a) && /e$/.test(b)) return { klasse: 2, groep: 3, st, N, v: a, o: b };
    }
    return null;
  }
  // vormen per geslacht: { m: {"nom.enk": [..]}, v: {...}, o: {...} }
  function adjForms(w) {
    const A = adjInfo(w);
    if (!A || A.zoalsSubst) return null;
    const res = { m: {}, v: {}, o: {} };
    const put = (g, getal, arr) => arr.forEach((e, i) => { res[g][`${NV[i]}.${getal}`] = e == null ? null : [e]; });
    const st = A.st;
    if (A.klasse === 1) {
      const vocM = /us$/.test(A.N) ? st + "e" : A.N;
      put("m", "enk", [A.N, st + "um", st + "ī", st + "ō", st + "ō", vocM]); put("m", "mv", ["ī", "ōs", "ōrum", "īs", "īs", "ī"].map((e) => st + e));
      put("v", "enk", ["a", "am", "ae", "ae", "ā", "a"].map((e) => st + e)); put("v", "mv", ["ae", "ās", "ārum", "īs", "īs", "ae"].map((e) => st + e));
      put("o", "enk", ["um", "um", "ī", "ō", "ō", "um"].map((e) => st + e)); put("o", "mv", ["a", "a", "ōrum", "īs", "īs", "a"].map((e) => st + e));
    } else {
      const nomM = A.N, nomV = A.v || A.N, nomO = A.o;
      put("m", "enk", [nomM, st + "em", st + "is", st + "ī", st + "ī", nomM]);
      put("v", "enk", [nomV, st + "em", st + "is", st + "ī", st + "ī", nomV]);
      put("o", "enk", [nomO, nomO, st + "is", st + "ī", st + "ī", nomO]);
      ["m", "v"].forEach((g) => put(g, "mv", ["ēs", "ēs", "ium", "ibus", "ibus", "ēs"].map((e) => st + e)));
      put("o", "mv", ["ia", "ia", "ium", "ibus", "ibus", "ia"].map((e) => st + e));
    }
    if (A.mvOnly) GS.forEach((g) => NV.forEach((n) => (res[g][`${n}.enk`] = null)));
    return { info: A, forms: res };
  }
  // modellen van de adjectieven (voor tabellen en kaarten)
  const ADJ_MODELLEN = {
    bonus: { klasse: 1, titel: "bonus, bona, bonum (goed)", la: "bonus", mid: "~a, ~um", soort: "bn" },
    "fēlīx": { klasse: 2, groep: 1, titel: "groep 1: fēlīx, fēlīx, fēlīx (gelukkig) – nominatief gelijk in de 3 geslachten", la: "fēlīx", mid: "~, ~; fēlīcis", soort: "bn" },
    fortis: { klasse: 2, groep: 2, titel: "groep 2: fortis, fortis, forte (sterk, dapper)", la: "fortis", mid: "~, forte; fortis", soort: "bn" },
    "ācer": { klasse: 2, groep: 3, titel: "groep 3: ācer, ācris, ācre (scherp, fel)", la: "ācer", mid: "ācris, ācre; ācris", soort: "bn" },
  };
  const ADJ_GROEP = {
    1: "groep 1: één vorm voor m., v. en o. (fēlīx, fēlīx, fēlīx)",
    2: "groep 2: twee vormen (fortis, fortis, forte)",
    3: "groep 3: drie vormen (ācer, ācris, ācre)",
  };

  // ============================================================
  // WERKWOORDEN
  // ============================================================
  const TIJD = ["praes", "imperf", "fut"];                       // onvoltooide tijden (praesensstam)
  const TIJD_VOLT = ["perf", "plqpf", "futex"];                   // voltooide tijden (perfectumstam / participium)
  const TIJD_ALLE = [...TIJD, ...TIJD_VOLT];
  const TIJD_NAAM = { praes: "praesens", imperf: "imperfectum", fut: "futurum simplex", perf: "perfectum", plqpf: "plusquamperfectum", futex: "futurum exactum" };
  const VORM_NAAM = { act: "actief", pass: "passief" };
  const PERS = ["1", "2", "3"];
  const slot = (p, g) => (g === "mv" ? 3 : 0) + (+p - 1);
  const MODEL_WW = { 1: "amāre", 2: "monēre", 3: "tegere", "3io": "capere", 4: "audīre" };
  const MODEL_WW_NL = { "amāre": "beminnen", "monēre": "waarschuwen", tegere: "bedekken", "audīre": "horen", capere: "nemen" };

  // uitgangen (na de stam) per model en tijd: [6 personen]
  const R = {
    1: { st: /āre$/, praes: { act: ["ō", "ās", "at", "āmus", "ātis", "ant"], pass: ["or", "āris", "ātur", "āmur", "āminī", "antur"] }, imp: ["ā", "āte"], iv: "ā", fv: "ā" },
    2: { st: /ēre$/, praes: { act: ["eō", "ēs", "et", "ēmus", "ētis", "ent"], pass: ["eor", "ēris", "ētur", "ēmur", "ēminī", "entur"] }, imp: ["ē", "ēte"], iv: "ē", fv: "ē" },
    3: { st: /ere$/, praes: { act: ["ō", "is", "it", "imus", "itis", "unt"], pass: ["or", "eris", "itur", "imur", "iminī", "untur"] }, imp: ["e", "ite"], iv: "ē", fv: "" },
    "3io": { st: /ere$/, praes: { act: ["iō", "is", "it", "imus", "itis", "iunt"], pass: ["ior", "eris", "itur", "imur", "iminī", "iuntur"] }, imp: ["e", "ite"], iv: "iē", fv: "i" },
    4: { st: /īre$/, praes: { act: ["iō", "īs", "it", "īmus", "ītis", "iunt"], pass: ["ior", "īris", "ītur", "īmur", "īminī", "iuntur"] }, imp: ["ī", "īte"], iv: "iē", fv: "i" },
  };
  const IMPERF = { act: ["bam", "bās", "bat", "bāmus", "bātis", "bant"], pass: ["bar", "bāris", "bātur", "bāmur", "bāminī", "bantur"] };
  // futurum: [kenletter, bindklinker, uitgang]
  const FUT_B = { act: [["b", "", "ō"], ["b", "i", "s"], ["b", "i", "t"], ["b", "i", "mus"], ["b", "i", "tis"], ["b", "u", "nt"]],
    pass: [["b", "", "or"], ["b", "e", "ris"], ["b", "i", "tur"], ["b", "i", "mur"], ["b", "i", "minī"], ["b", "u", "ntur"]] };
  const FUT_E = { act: [["a", "", "m"], ["ē", "", "s"], ["e", "", "t"], ["ē", "", "mus"], ["ē", "", "tis"], ["e", "", "nt"]],
    pass: [["a", "", "r"], ["ē", "", "ris"], ["ē", "", "tur"], ["ē", "", "mur"], ["ē", "", "minī"], ["e", "", "ntur"]] };
  const IMP_ONR = { "dīcere": ["dīc", "dīcite"], "dūcere": ["dūc", "dūcite"], facere: ["fac", "facite"] };

  // onregelmatige werkwoorden: tabellen per tijd (actief); ferre ook passief
  const ONR = {
    esse: { inf: "esse", nl: "zijn", praes: "sum es est sumus estis sunt", imperf: "eram erās erat erāmus erātis erant", fut: "erō eris erit erimus eritis erunt" },
    posse: { inf: "posse", nl: "kunnen", praes: "possum potes potest possumus potestis possunt", imperf: "poteram poterās poterat poterāmus poterātis poterant", fut: "poterō poteris poterit poterimus poteritis poterunt" },
    "īre": { inf: "īre", nl: "gaan", praes: "eō īs it īmus ītis eunt", imperf: "ībam ībās ībat ībāmus ībātis ībant", fut: "ībō ībis ībit ībimus ībitis ībunt", imp: ["ī", "īte"] },
    "fierī": { inf: "fierī", nl: "worden; gebeuren", praes: "fīō fīs fit fīmus fītis fīunt", imperf: "fīēbam fīēbās fīēbat fīēbāmus fīēbātis fīēbant", fut: "fīam fīēs fīet fīēmus fīētis fīent" },
    ferre: { inf: "ferre", nl: "dragen; brengen", praes: "ferō fers fert ferimus fertis ferunt", imperf: "ferēbam ferēbās ferēbat ferēbāmus ferēbātis ferēbant", fut: "feram ferēs feret ferēmus ferētis ferent",
      pass: { praes: "feror ferris fertur ferimur feriminī feruntur", imperf: "ferēbar ferēbāris ferēbātur ferēbāmur ferēbāminī ferēbantur", fut: "ferar ferēris ferētur ferēmur ferēminī ferentur" }, imp: ["fer", "ferte"] },
    velle: { inf: "velle", nl: "willen", praes: "volō vīs vult volumus vultis volunt", imperf: "volēbam volēbās volēbat volēbāmus volēbātis volēbant", fut: "volam volēs volet volēmus volētis volent" },
    "nōlle": { inf: "nōlle", nl: "niet willen", praes: "nōlō nōn_vīs nōn_vult nōlumus nōn_vultis nōlunt", imperf: "nōlēbam nōlēbās nōlēbat nōlēbāmus nōlēbātis nōlēbant", fut: "nōlam nōlēs nōlet nōlēmus nōlētis nōlent" },
    "mālle": { inf: "mālle", nl: "liever willen", praes: "mālō māvīs māvult mālumus māvultis mālunt", imperf: "mālēbam mālēbās mālēbat mālēbāmus mālēbātis mālēbant", fut: "mālam mālēs mālet mālēmus mālētis mālent" },
  };
  const sp = (s) => s.split(" ").map((x) => x.replace("_", " "));

  // werkwoorden zonder passief (onovergankelijk): op basis van de betekenis
  const ONOVERG = /^(zich |zijn|gaan|komen|lopen|slapen|staan|liggen|zitten|wonen|blijven|leven|sterven|vallen|groeien|vluchten|terugkeren|wandelen|zwerven|varen|rennen|werken|lachen|huilen|zwijgen|aankomen|vertrekken|naderen|ontsnappen|ontstaan|heersen|twijfelen|aanwezig|afwezig|nuttig|overblijven|weggaan|binnengaan|buitengaan|oversteken|voorbijgaan|ten onder|schitteren|bloeien|blij zijn|stilstaan|uitblinken|gehoorzamen|dienen|haasten|zich haasten|strijden|vechten|razen|branden|zeilen|zwemmen|wachten|treuren|klagen|jagen|dansen|zingen|spelen|kunnen|willen|niet willen|liever willen|worden|vloeien|durven|gewoon zijn|verschijnen|geoorloofd|zwijgen|gezond|sterk zijn|gebeuren|treuren|liggen|zitten|regeren)/;

  // beschrijving van een werkwoord uit de woordenlijst (of een model): { inf, kind: 1|2|3|3io|4|onr, base, prefix, pass }
  function verbSpec(w) {
    if (w.soort !== "ww" || !w.verv) return null;
    const inf = head(w.la);
    if (w.dep && !ONR[inf]) return null;
    if (/\s/.test(inf) || /^[A-Z]/.test(inf)) return null;
    if (w.verv === "onr") {
      if (ONR[inf]) return perfInfo({ inf, kind: "onr", base: inf, prefix: "", pass: inf === "ferre" }, w);
      if (inf === "prōdesse") return null;
      for (const b of ["esse", "īre", "ferre"]) if (inf.endsWith(b) && inf !== b) return perfInfo({ inf, kind: "onr", base: b, prefix: inf.slice(0, -b.length), pass: b === "ferre" && !ONOVERG.test(w.nl || "") }, w);
      return null;
    }
    const k = String(w.verv);
    const r = R[k];
    if (!r || !r.st.test(inf) || inf === "dare") return null;
    const trans = !ONOVERG.test(w.nl || "") && w.naamval !== "dat.";
    return perfInfo({ inf, kind: k, st: inf.replace(r.st, ""), pass: trans }, w);
  }
  // perfectumstam en participium perfectum uit de middenkolom (of volgens het model bij amāre, monēre, audīre)
  // werkwoorden waarvan de stamtijden niet uit het model volgen (lege middenkolom) of die halfdeponens zijn
  const PERF_FIX = { "augēre": "auxī, auctum", "audēre": "", "solēre": "", "gaudēre": "", "maerēre": "", "licēre": "" };
  function perfInfo(v, w) {
    if (v.inf === "fierī") return v;
    if (v.inf in PERF_FIX && !PERF_FIX[v.inf]) return v;
    const mid = (PERF_FIX[v.inf] || w.mid || "").trim();
    let perf = null, sup = null;
    if (mid && !/^\(/.test(mid) && !/sum$/.test(mid)) {
      [perf, sup] = mid.split(",").map((x) => x && x.trim());
      if (sup === "-" || sup === "–") sup = null;
    } else if (!mid && v.kind !== "onr") {
      if (v.kind === "1") { perf = v.st + "āvī"; sup = v.st + "ātum"; }
      if (v.kind === "2") { perf = v.st + "uī"; sup = v.st + "itum"; }
      if (v.kind === "4") { perf = v.st + "īvī"; sup = v.st + "ītum"; }
    }
    if (perf && /ī$/.test(perf) && !/\s/.test(perf)) {
      v.perf = perf; v.pst = perf.slice(0, -1);
      v.iPerf = /iī$/.test(perf) && (v.base === "īre" || v.inf === "īre");   // iī, rediī: samengetrokken vormen (īstī, īstis)
    }
    if (sup && /um$/.test(sup) && v.pass) v.ppp = sup.slice(0, -2);
    return v;
  }
  // alle vormen: { "act.praes.1.enk": ["amō"], …, "act.imp.2.enk": [..] }
  function verbForms(v) {
    const out = {};
    const put = (vorm, tijd, arr) => arr.forEach((f, i) => { out[`${vorm}.${tijd}.${(i % 3) + 1}.${i < 3 ? "enk" : "mv"}`] = [f]; });
    if (v.kind === "onr") {
      const T = ONR[v.base], pre = v.prefix;
      TIJD.forEach((t) => put("act", t, sp(T[t]).map((f) => pre + f)));
      if (v.pass && T.pass) TIJD.forEach((t) => put("pass", t, sp(T.pass[t]).map((f) => pre + f)));
      if (T.imp) { out["act.imp.2.enk"] = [pre + T.imp[0]]; out["act.imp.2.mv"] = [pre + T.imp[1]]; }
      out["act.inf.0.0"] = [pre + T.inf];
      if (v.pass && T.pass) out["pass.inf.0.0"] = [pre + "ferrī"];
      return addPerf(v, out);
    }
    const r = R[v.kind], s = v.st;
    put("act", "praes", r.praes.act.map((e) => s + e));
    put("act", "imperf", IMPERF.act.map((e) => s + r.iv + e));
    put("act", "fut", futSplit(v, "act").map((x) => x.join("")));
    if (v.pass) {
      put("pass", "praes", r.praes.pass.map((e) => s + e));
      put("pass", "imperf", IMPERF.pass.map((e) => s + r.iv + e));
      put("pass", "fut", futSplit(v, "pass").map((x) => x.join("")));
    }
    const imp = IMP_ONR[v.inf] || [s + r.imp[0], s + r.imp[1]];
    out["act.imp.2.enk"] = [imp[0]]; out["act.imp.2.mv"] = [imp[1]];
    out["act.inf.0.0"] = [v.inf];
    if (v.pass) out["pass.inf.0.0"] = [v.kind === "3" || v.kind === "3io" ? s + "ī" : v.inf.replace(/e$/, "ī")];
    return addPerf(v, out);
  }
  // voltooide tijden: actief = perfectumstam + uitgangen; passief = participium perfectum + vorm van esse
  const PERF_ACT = { perf: ["ī", "istī", "it", "imus", "istis", "ērunt"], plqpf: ["eram", "erās", "erat", "erāmus", "erātis", "erant"], futex: ["erō", "eris", "erit", "erimus", "eritis", "erint"] };
  const ESSE_BIJ = { perf: "sum es est sumus estis sunt", plqpf: "eram erās erat erāmus erātis erant", futex: "erō eris erit erimus eritis erunt" };
  function addPerf(v, out) {
    const put = (vorm, tijd, arr) => arr.forEach((f, i) => { out[`${vorm}.${tijd}.${(i % 3) + 1}.${i < 3 ? "enk" : "mv"}`] = Array.isArray(f) ? f : [f]; });
    if (v.pst) TIJD_VOLT.forEach((t) => put("act", t, PERF_ACT[t].map((e, i) => {
      const f = v.pst + e;
      if (v.iPerf && t === "perf" && (i === 1 || i === 4)) return [v.pst.slice(0, -1) + "ī" + e.slice(1), f]; // īstī / iistī
      return f;
    })));
    if (v.ppp) TIJD_VOLT.forEach((t) => put("pass", t, ESSE_BIJ[t].split(" ").map((e, i) => {
      const enk = i < 3, b = v.ppp;
      const g = enk ? [b + "us", b + "a", ...(i === 2 ? [b + "um"] : [])] : [b + "ī", b + "ae", ...(i === 5 ? [b + "a"] : [])];
      return g.map((x) => `${x} ${e}`);
    })));
    return out;
  }
  // futurum gesplitst: [stam, kenletter, bindklinker, uitgang] per persoon (enkel regelmatige werkwoorden)
  function futSplit(v, vorm) {
    const r = R[v.kind];
    if (v.kind === "1" || v.kind === "2") return FUT_B[vorm].map(([k, b, u]) => [v.st + r.fv, k, b, u]);
    return FUT_E[vorm].map(([k, b, u]) => [v.st + r.fv, k, b, u]);
  }
  const keyParts = (k) => { const [vorm, tijd, p, g] = k.split("."); return { vorm, tijd, p, g }; };
  const isVolt = (k) => TIJD_VOLT.includes(keyParts(k).tijd);

  // ---------- Nederlandse vertaling van een werkwoordsvorm ----------
  // ik | jij | hij | wij (= infinitief) | ovt enk. | ovt mv. | voltooid deelwoord ; bijwoord (niet / liever)
  const NL_WW = {
    "amāre": "bemin|bemint|bemint|beminnen|beminde|beminden|bemind",
    "monēre": "waarschuw|waarschuwt|waarschuwt|waarschuwen|waarschuwde|waarschuwden|gewaarschuwd",
    tegere: "bedek|bedekt|bedekt|bedekken|bedekte|bedekten|bedekt",
    "audīre": "hoor|hoort|hoort|horen|hoorde|hoorden|gehoord",
    capere: "neem|neemt|neemt|nemen|nam|namen|genomen",
    "laudāre": "prijs|prijst|prijst|prijzen|prees|prezen|geprezen",
    "clāmāre": "roep|roept|roept|roepen|riep|riepen|geroepen",
    "portāre": "draag|draagt|draagt|dragen|droeg|droegen|gedragen",
    "vidēre": "zie|ziet|ziet|zien|zag|zagen|gezien",
    "habēre": "heb|hebt|heeft|hebben|had|hadden|gehad",
    "timēre": "vrees|vreest|vreest|vrezen|vreesde|vreesden|gevreesd",
    "terrēre": "maak bang|maakt bang|maakt bang|maken bang|maakte bang|maakten bang|bang gemaakt",
    "dūcere": "leid|leidt|leidt|leiden|leidde|leidden|geleid",
    mittere: "zend|zendt|zendt|zenden|zond|zonden|gezonden",
    "scrībere": "schrijf|schrijft|schrijft|schrijven|schreef|schreven|geschreven",
    vincere: "overwin|overwint|overwint|overwinnen|overwon|overwonnen|overwonnen",
    legere: "lees|leest|leest|lezen|las|lazen|gelezen",
    "dīcere": "zeg|zegt|zegt|zeggen|zei|zeiden|gezegd",
    facere: "maak|maakt|maakt|maken|maakte|maakten|gemaakt",
    "venīre": "kom|komt|komt|komen|kwam|kwamen|-",
    "invenīre": "vind|vindt|vindt|vinden|vond|vonden|gevonden",
    "dormīre": "slaap|slaapt|slaapt|slapen|sliep|sliepen|-",
    "aperīre": "open|opent|opent|openen|opende|openden|geopend",
    "servāre": "red|redt|redt|redden|redde|redden|gered",
    "dēlēre": "verniel|vernielt|vernielt|vernielen|vernielde|vernielden|vernield",
    "movēre": "beweeg|beweegt|beweegt|bewegen|bewoog|bewogen|bewogen",
    accipere: "ontvang|ontvangt|ontvangt|ontvangen|ontving|ontvingen|ontvangen",
    esse: "ben|bent|is|zijn|was|waren|-",
    posse: "kan|kunt|kan|kunnen|kon|konden|-",
    "īre": "ga|gaat|gaat|gaan|ging|gingen|-",
    ferre: "draag|draagt|draagt|dragen|droeg|droegen|gedragen",
    velle: "wil|wilt|wil|willen|wilde|wilden|-",
    "nōlle": "wil|wilt|wil|willen|wilde|wilden|-;niet",
    "mālle": "wil|wilt|wil|willen|wilde|wilden|-;liever",
    "fierī": "word|wordt|wordt|worden|werd|werden|-",
  };
  const PRON = ["ik", "jij", "hij", "wij", "jullie", "zij"];
  const ZAL = ["zal", "zult", "zal", "zullen", "zullen", "zullen"];
  const WORD = ["word", "wordt", "wordt", "worden", "worden", "worden"];
  // voltooid deelwoord en hulpwerkwoord voor de voltooide tijden
  const NL_VOLT = { esse: ["geweest", "z"], posse: ["gekund", "h"], "īre": ["gegaan", "z"], velle: ["gewild", "h"], "nōlle": ["gewild", "h"], "mālle": ["gewild", "h"],
    "venīre": ["gekomen", "z"], "dormīre": ["geslapen", "h"], "fierī": ["geworden", "z"] };
  const HEB = ["heb", "hebt", "heeft", "hebben", "hebben", "hebben"], BEN = ["ben", "bent", "is", "zijn", "zijn", "zijn"];
  // alle aanvaarde vertalingen (perfectum: OVT én VTT)
  function nlAlle(inf, key) {
    const { vorm, tijd, p, g } = keyParts(key);
    if (!TIJD_VOLT.includes(tijd)) { const x = nlVorm(inf, key); return x ? [x] : []; }
    const raw = NL_WW[inf];
    if (!raw || tijd === "imp" || tijd === "inf") return [];
    const [main, adv] = raw.split(";");
    const parts = main.split("|"), vd0 = parts[6];
    const [vd, aux] = NL_VOLT[inf] || [vd0, "h"];
    if (vd === "-") return [];
    const i = slot(p, g), pr = PRON[i], a = adv ? adv + " " : "";
    if (vorm === "act") {
      const hulp = aux === "z" ? BEN : HEB;
      if (tijd === "perf") return [nlVorm(inf, key.replace(".perf.", ".imperf.")), `${pr} ${hulp[i]} ${a}${vd}`];
      if (tijd === "plqpf") return [`${pr} ${aux === "z" ? (i < 3 ? "was" : "waren") : (i < 3 ? "had" : "hadden")} ${a}${vd}`];
      return [`${pr} ${ZAL[i]} ${a}${vd} ${aux === "z" ? "zijn" : "hebben"}`];
    }
    if (vd0 === "-") return [];
    if (tijd === "perf") return [`${pr} ${i < 3 ? "werd" : "werden"} ${vd0}`, `${pr} ${BEN[i]} ${vd0}`];
    if (tijd === "plqpf") return [`${pr} ${i < 3 ? "was" : "waren"} ${vd0}`];
    return [`${pr} ${ZAL[i]} ${vd0} zijn`];
  }
  function nlVorm(inf, key) {
    const raw = NL_WW[inf];
    if (!raw) return null;
    if (isVolt(key)) return (nlAlle(inf, key) || [])[0] || null;
    const [main, adv] = raw.split(";");
    const [ik, jij, hij, mv, ovt, ovtMv, vd] = main.split("|");
    const { vorm, tijd, p, g } = keyParts(key);
    if (tijd === "imp" || tijd === "inf") return null;
    const i = slot(p, g), pr = PRON[i];
    // "maak bang": scheidbaar deel achteraan bij de toekomende tijd ("ik zal bang maken")
    const split = (x) => { const m = x.match(/^(\S+) (\S+)$/); return m ? [m[1], m[2]] : [x, ""]; };
    const advP = adv ? " " + adv : "";
    if (vorm === "act") {
      if (tijd === "praes") { const [f, rest] = split([ik, jij, hij, mv, mv, mv][i]); return `${pr} ${f}${advP}${rest ? " " + rest : ""}`; }
      if (tijd === "imperf") { const [f, rest] = split(i < 3 ? ovt : ovtMv); return `${pr} ${f}${advP}${rest ? " " + rest : ""}`; }
      const [f, rest] = split(mv); return `${pr} ${ZAL[i]}${advP} ${rest ? rest + " " : ""}${f}`;
    }
    if (vd === "-") return null;
    if (tijd === "praes") return `${pr} ${WORD[i]} ${vd}`;
    if (tijd === "imperf") return `${pr} ${i < 3 ? "werd" : "werden"} ${vd}`;
    return `${pr} ${ZAL[i]} ${vd} worden`;
  }

  // ============================================================
  // REGELS (kennisvragen + leerkaarten), in eigen woorden
  // ============================================================
  // [id, vraag, antwoord, foute keuzes…]
  const REGELS = [
    // klassen van de substantieven
    ["kl-avus", "Woordenlijst <b>-us (-er), -ī</b> (m.): welk model en welke klasse?", "avus – 1e klasse", "dux – 2e klasse", "fructus – 3e klasse", "dōnum – 1e klasse"],
    ["kl-rosa", "Woordenlijst <b>-a, -ae</b> (v.): welk model en welke klasse?", "rosa – 1e klasse", "rēs – 3e klasse", "avus – 1e klasse", "māter – 2e klasse"],
    ["kl-donum", "Woordenlijst <b>-um, -ī</b> (o.): welk model en welke klasse?", "dōnum – 1e klasse", "corpus – 2e klasse", "avus – 1e klasse", "fructus – 3e klasse"],
    ["kl-dux", "Woordenlijst <b>anders, -is</b> (m./v.): welk model en welke klasse?", "dux / māter – 2e klasse", "avus – 1e klasse", "fructus – 3e klasse", "corpus – 2e klasse"],
    ["kl-corpus", "Woordenlijst <b>anders, -is</b> + <b>o.</b>: welk model?", "corpus – 2e klasse", "dux – 2e klasse", "dōnum – 1e klasse", "rēs – 3e klasse"],
    ["kl-fructus", "Woordenlijst <b>-us, -ūs</b>: welk model en welke klasse?", "fructus – 3e klasse", "avus – 1e klasse", "corpus – 2e klasse", "rēs – 3e klasse"],
    ["kl-res", "Woordenlijst <b>-ēs, -eī</b>: welk model en welke klasse?", "rēs – 3e klasse", "dux – 2e klasse", "fructus – 3e klasse", "rosa – 1e klasse"],
    ["kl-gen", "Waaraan herken je in de woordenlijst het best de klasse van een substantief?", "aan de genitief (2de vorm)", "aan de nominatief", "aan het geslacht", "aan de betekenis"],
    // 3e klasse: uitzonderingen
    ["fr-gs", "Welk geslacht hebben de meeste woorden op -us, -ūs (zoals fructus)?", "mannelijk", "vrouwelijk", "onzijdig", "altijd onzijdig"],
    ["fr-manus", "Welk geslacht hebben <i>manus</i> en <i>domus</i>?", "vrouwelijk", "mannelijk", "onzijdig", "manus m., domus v."],
    ["fr-dies", "Welk geslacht heeft <i>diēs</i>?", "mannelijk én vrouwelijk", "enkel vrouwelijk", "enkel mannelijk", "onzijdig"],
    ["fr-res", "Welk geslacht hebben de woorden van het model rēs meestal?", "vrouwelijk", "mannelijk", "onzijdig", "mannelijk én onzijdig"],
    ["fr-domus", "Welke vormen van <i>domus</i> komen uit de 1e klasse?", "abl. enk. domō, acc. mv. domōs, gen. mv. domōrum", "nom. enk. domus en gen. enk. domūs", "dat. enk. domuī en dat. mv. domibus", "geen enkele"],
    ["fr-cornu", "<i>cornū</i> (de hoorn) is onzijdig. Hoe luidt de nom./acc. mv.?", "cornua", "cornūs", "cornuum", "cornibus"],
    ["fr-stam", "Waarom staat er <i>fructibus</i> (en niet fructubus) in de dat./abl. mv.?", "de stam wordt fructi-", "het is een uitzondering op rēs", "het volgt het model corpus", "fructus is onzijdig"],
    ["fr-deus", "Welke bijzondere vormen heeft <i>deus</i>?", "nom. mv. dī, dat./abl. mv. dīs, voc. deus", "voc. dee, nom. mv. deōs", "gen. deūs, dat. deuī", "geen, deus volgt avus volledig"],
    ["fr-ium", "Wat is de genitief meervoud van <i>urbs</i> (de stad)?", "urbium", "urbum", "urbōrum", "urbuum"],
    ["fr-mare", "Welke substantieven volgen de adjectieven van de 2e klasse?", "mare, animal, mīlia, moenia", "vetus, dīves, pauper", "fructus, rēs", "avus, rosa, dōnum"],
    ["fr-vetus", "Welke adjectieven volgen de substantieven van de 2e klasse (dux)?", "vetus, dīves, pauper", "fēlīx, fortis, ācer", "mare, animal, moenia", "bonus, pulcher, miser"],
    // adjectieven
    ["adj-1", "Hoe herken je een adjectief van de 1e klasse in de woordenlijst?", "~a, ~um (bonus, bona, bonum)", "~, ~; gen. op -is", "~, ~e; gen. op -is", "-us, -ūs"],
    ["adj-2", "Hoe herken je een adjectief van de 2e klasse in de woordenlijst?", "genitief op -is (bv. fēlīx, fēlīcis)", "genitief op -ī", "genitief op -ae", "het eindigt altijd op -is"],
    ["adj-g1", "Bij welke groep van de adjectieven (2e klasse) is de nominatief in de drie geslachten gelijk?", "groep 1 (fēlīx)", "groep 2 (fortis)", "groep 3 (ācer)", "bij geen enkele"],
    ["adj-g2", "Welk adjectief hoort bij groep 2 (twee vormen in de nominatief)?", "fortis, fortis, forte", "fēlīx, fēlīx, fēlīx", "ācer, ācris, ācre", "bonus, bona, bonum"],
    ["adj-g3", "Welk adjectief hoort bij groep 3 (drie vormen in de nominatief)?", "ācer, ācris, ācre", "fortis, fortis, forte", "fēlīx, fēlīx, fēlīx", "miser, misera, miserum"],
    ["adj-abl", "Wat is de ablatief enkelvoud van een adjectief van de 2e klasse (fortis)?", "fortī (op -ī)", "forte (op -e)", "fortō", "fortibus"],
    ["adj-gen", "Wat is de genitief meervoud van een adjectief van de 2e klasse (fortis)?", "fortium", "fortum", "fortōrum", "fortibus"],
    ["adj-o", "Hoe eindigt de nom./acc. mv. onzijdig van een adjectief van de 2e klasse?", "-ia (fortia)", "-a (forta)", "-ēs (fortēs)", "-ua (fortua)"],
    ["adj-cong", "Waarin stemt een adjectief overeen met het substantief waarbij het hoort?", "in naamval, genus en getal", "enkel in naamval", "in klasse en uitgang", "enkel in getal"],
    // datief
    ["dat-fn", "Welke zinsfunctie heeft een datief meestal?", "meewerkend voorwerp", "onderwerp", "lijdend voorwerp", "bijwoordelijke bepaling van plaats"],
    ["dat-vert", "Hoe vertaal je een datief meestal?", "met 'aan' of 'voor' (soms valt het voorzetsel weg)", "met 'van'", "met 'door'", "met 'in' of 'op'"],
    ["dat-speler", "Wie is de datief in een zin als 'De moeder geeft het kind een appel'?", "het kind (de derde speler)", "de moeder", "een appel", "geeft"],
    ["dat-1", "Wat is de datief enkelvoud van <i>avus</i>, <i>rosa</i> en <i>dōnum</i>?", "avō, rosae, dōnō", "avī, rosā, dōnī", "avum, rosam, dōnum", "avīs, rosīs, dōnīs"],
    ["dat-1mv", "Wat is de datief meervoud van <i>avus</i>, <i>rosa</i> en <i>dōnum</i>?", "avīs, rosīs, dōnīs", "avōs, rosās, dōna", "avōrum, rosārum, dōnōrum", "avibus, rosibus, dōnibus"],
    ["dat-2", "Wat is de datief van <i>dux</i> (enk. en mv.)?", "ducī – ducibus", "ducis – ducum", "ducem – ducēs", "duce – ducibus"],
    ["dat-3", "Wat is de datief van <i>fructus</i> en <i>rēs</i> (enkelvoud)?", "fructuī – reī", "fructū – rē", "fructūs – reī", "fructum – rem"],
    ["dat-voor", "<i>Pater fīliō librum emit.</i> Hoe vertaal je fīliō?", "voor de zoon", "aan de zoon", "van de zoon", "met de zoon"],
    // werkwoord: futurum
    ["fut-bet", "Wat drukt een indicatief futurum simplex uit?", "een handeling of toestand in de toekomst", "een handeling die bezig was in het verleden", "een bevel", "een handeling die nu gebeurt"],
    ["fut-vert", "Met welke tijd vertaal je een futurum simplex?", "onvoltooid toekomende tijd (ik zal …)", "onvoltooid verleden tijd (ik …de)", "onvoltooid tegenwoordige tijd", "voltooid verleden tijd"],
    ["fut-12", "Hoe vorm je het futurum bij amāre en monēre?", "stam + kenletter b + (bindklinker) + uitgang", "stam + kenletter ē (a in de 1ste p. enk.) + uitgang", "stam + ba + uitgang", "stam + ēba + uitgang"],
    ["fut-345", "Hoe vorm je het futurum bij tegere, audīre en capere?", "stam + kenletter ē (a in de 1ste p. enk.) + uitgang", "stam + kenletter b + (bindklinker) + uitgang", "stam + ba + uitgang", "stam + ēba + uitgang"],
    ["fut-onr", "Welke werkwoorden hebben een onregelmatig futurum?", "enkel esse en posse", "alle onregelmatige werkwoorden", "esse, īre en ferre", "geen enkel werkwoord"],
    ["fut-ire", "Hoe luidt het futurum van īre (1ste p. enk.)?", "ībō", "eam", "ībam", "eō"],
    ["fut-velle", "Hoe luidt het futurum van velle (1ste p. enk.)?", "volam", "volēbō", "volō", "velam"],
    ["fut-ferre", "Hoe luidt het futurum van ferre (1ste p. enk. actief)?", "feram", "ferēbō", "ferō", "ferēbam"],
    ["fut-fieri", "Hoe luidt het futurum van fierī (1ste p. enk.)?", "fīam", "fīēbō", "fīō", "fīēbam"],
    ["imperf-vorm", "Hoe herken je een imperfectum?", "aan -ba- (amābam, tegēbam)", "aan -b- + bindklinker (amābō)", "aan -ē- (tegēs)", "aan -ri- (amāris)"],
    ["vn-teges", "<i>tegēs</i> of <i>tegis</i>: welke vorm is futurum?", "tegēs (tegis is praesens)", "tegis (tegēs is praesens)", "allebei", "geen van beide"],
    ["vn-tegeris", "<i>tegēris</i> of <i>tegeris</i>: welke vorm is futurum passief?", "tegēris (tegeris is praesens)", "tegeris (tegēris is praesens)", "allebei", "geen van beide"],
    ["vn-mones", "<i>monēs</i> – welke tijd?", "praesens (2de p. enk. van monēre)", "futurum (zoals tegēs)", "imperfectum", "imperatief"],
    ["vn-monebit", "<i>monēbit</i> of <i>monēbat</i>: welke vorm is futurum?", "monēbit (monēbat is imperfectum)", "monēbat (monēbit is imperfectum)", "allebei", "geen van beide"],
    ["vn-erunt", "<i>erunt</i> of <i>erant</i>: welke vorm is futurum?", "erunt (erant is imperfectum)", "erant (erunt is imperfectum)", "allebei", "geen van beide"],
    ["tempel", "Wat bepaal je bij een werkwoordsvorm (de 'tempel' van het werkwoord)?", "vorm, wijs, tijd, persoon en getal", "naamval, genus en getal", "stam en uitgang", "klasse en model"],
    ["io-ww", "Welke werkwoorden gaan zoals capere (op -iō)? Ezelsbrug: 'Oh zo lekker!'", "facere, fugere, rapere, iacere, capere, cupere, (…)spicere", "facere, dīcere, dūcere, ferre", "amāre, monēre, audīre", "esse, posse, īre"],
    ["imp-kort", "Welke vier werkwoorden hebben een korte imperatief enkelvoud?", "dīc, dūc, fac, fer", "dīce, dūce, face, fere", "ī, es, fer, fac", "amā, monē, tege, audī"],
    ["iacere", "Wat is het verschil tussen <i>iacere</i> en <i>iacēre</i>?", "iacere = werpen, iacēre = liggen", "iacere = liggen, iacēre = werpen", "allebei werpen", "er is geen verschil"],
  ];

  // grote tabellen voor de leerkaarten
  function tabelNw(model) {
    const M = MODELLEN[model];
    const voorbeeld = { avus: ["av", "avus"], rosa: ["ros", "rosa"], "dōnum": ["dōn", "dōnum"], dux: ["duc", "dux"], corpus: ["corpor", "corpus"], fructus: ["fruct", "fructus"], "rēs": ["r", "rēs"] }[model];
    const f = (e) => (e === "N" ? voorbeeld[1] : voorbeeld[0] + (model === "fructus" && e === "ibus" ? "ibus" : e));
    return { enk: M.enk.map(f), mv: M.mv.map(f) };
  }

  // ============================================================
  // LEERWERKBOEK PER CAPUT (taalstudie caput 1-3), samengevat in eigen woorden
  // ============================================================
  const CAPUT_INFO = {
    1: { naam: "Oraculum", taal: ["substantieven en adjectieven (klassen)", "naamvallen en functies", "voorzetsels", "onvoltooide tijden (praesens, imperfectum, futurum simplex)"] },
    2: { naam: "Troia", taal: ["actieve indicatief perfectum (stamtijden)", "praesens of perfectum?", "gebruik van de tijden in een verhaal", "persoonlijke en bezittelijke voornaamwoorden"] },
    3: { naam: "Itinera", taal: ["passieve indicatief perfectum", "aanwijzende voornaamwoorden hic, iste, ille", "plusquamperfectum en futurum exactum", "aanwijzende voornaamwoorden is, idem, ipse"] },
  };
  // "Ken je deze woorden nog?" (herhalingswoorden bij de lectuurteksten)
  const KEN_JE_NOG = {
    1: ["ideō", "itaque", "ibi", "ubi", "cum", "dum", "tum", "fera", "famēs", "vātēs", "somnium", "mīrus", "dēnique", "quamquam", "laudāre", "iūdicium", "iūdicāre"],
    2: ["īrātus", "laetus", "maestus", "timidus", "nāvis", "exspectāre", "ōrāre", "iter", "lītus", "sacer", "citō", "tantum", "nox", "et", "aut", "at", "ad", "scelus", "saevus", "hasta"],
    3: ["somnium", "umbra", "alius", "aliēnus", "ubi", "ignis", "quaerere", "ōrāculum", "reddere", "saxum", "rīdēre", "comes", "nēmō", "vulnus", "nihil", "appellāre", "habēre", "haurīre", "relinquere", "corripere"],
  };

  // ---------- voorzetsels (caput 1) ----------
  const VOORZETSELS = [
    ["ad", "acc", "naar; tot; bij"], ["ante", "acc", "vóór"], ["apud", "acc", "bij"], ["circum", "acc", "rondom"], ["inter", "acc", "tussen; tijdens"],
    ["ob", "acc", "tegenover; wegens"], ["per", "acc", "door; gedurende"], ["post", "acc", "achter; na"], ["praeter", "acc", "voorbij; behalve"], ["trāns", "acc", "over"],
    ["ā / ab", "abl", "van; door"], ["cum", "abl", "met"], ["dē", "abl", "van; over"], ["ē / ex", "abl", "uit; vanaf"], ["prō", "abl", "voor; in plaats van"], ["sine", "abl", "zonder"],
    ["in", "acc", "naar; tegen (richting)"], ["in", "abl", "in; op (plaats)"], ["sub", "acc", "tot onder (richting); omstreeks"], ["sub", "abl", "onder (plaats); omstreeks"],
  ];

  // ---------- naamvallen en functies (caput 1): zin, [[doelwoord]], naamval, functie, (rol van de BWB) ----------
  const FUNCTIES = { O: "onderwerp (O)", NWD: "naamwoordelijk deel (NWD)", LV: "lijdend voorwerp (LV)", MV: "meewerkend voorwerp (MV)", BVB: "bijvoeglijke bepaling (BVB)", BWB: "bijwoordelijke bepaling (BWB)", HV: "handelend voorwerp (HV)", AANSPR: "aanspreking" };
  const ZINNEN_FUNCTIE = [
    ["[[Dionȳsius]] potēns tyrannus erat.", "nom", "O"],
    ["Dionȳsius potēns [[tyrannus]] erat.", "nom", "NWD"],
    ["Malum [[ingenium]] habēbat.", "acc", "LV"],
    ["Omnium [[incolārum]] dīvitissimus erat.", "gen", "BVB"],
    ["Cottīdiē [[possessiōnēs]] augēbat.", "acc", "LV"],
    ["[[In rēgiā magnificā]] habitābat.", "abl", "BWB", "plaats"],
    ["Semper multitūdinem [[servōrum]] circum sē habēbat.", "gen", "BVB"],
    ["[[Servō]] collum committere nōn audēbat.", "dat", "MV"],
    ["[[Fīliae]] barbam et capillōs patris tondēbant.", "nom", "O"],
    ["Fīliae barbam et capillōs [[patris]] tondēbant.", "gen", "BVB"],
    ["Interdum [[nocte]] ad cubicula eārum veniēbat.", "abl", "BWB", "tijd"],
    ["Servī circum lectum [[fossam lātam altamque]] faciunt.", "acc", "LV"],
    ["Dē lectō [[manibus suīs]] ponticulum aufert.", "abl", "BWB", "middel"],
    ["Dionȳsius [[in campō]] corpus exercēre solēbat.", "abl", "BWB", "plaats"],
    ["Deinde [[servō]] gladium suum trādēbat.", "dat", "MV"],
    ["[[Magnō studiō]] lūdere incipit.", "abl", "BWB", "wijze"],
    ["Dionȳsius [[īrātā vōce]] custōdibus imperat.", "abl", "BWB", "wijze"],
    ["Dionȳsius īrātā vōce [[custōdibus]] imperat.", "dat", "MV"],
    ["Interficite [[gladiō]] et propinquum et servum!", "abl", "BWB", "middel"],
    ["Per multōs diēs nuptiae [[ā servīs]] parābantur.", "abl", "HV"],
    ["[[Per multōs diēs]] nuptiae ā servīs parābantur.", "acc", "BWB", "tijd"],
    ["Servae [[flōribus]] mēnsās ōrnābant.", "abl", "BWB", "middel"],
    ["Servae flōribus [[mēnsās longissimās]] ōrnābant.", "acc", "LV"],
    ["[[Illō diē]] magnus numerus hospitum in rēgiam convēnit.", "abl", "BWB", "tijd"],
    ["Illō diē magnus numerus [[hospitum]] in rēgiam convēnit.", "gen", "BVB"],
    ["Illō diē magnus numerus hospitum [[in rēgiam]] convēnit.", "acc", "BWB", "plaats (richting)"],
    ["In trīclīniō [[omnibus]] optimae epulae offeruntur.", "dat", "MV"],
    ["Nōnnūllī senēs [[vīnō]] fessī sunt.", "abl", "BWB", "oorzaak"],
    ["[[Discordiae]] facinore omnēs hunc diem in memoriā tenēbunt.", "gen", "BVB"],
    ["Magister librum [[Mārcō]] dat.", "dat", "MV"],
    ["Amphitheātrum [[ā servō]] aedificātur.", "abl", "HV"],
    ["[[Vīnī]] deus dormit.", "gen", "BVB"],
    ["Ō miserī [[cīvēs]], quanta īnsānia est?", "voc", "AANSPR"],
    ["Cassandra [[trīstia]] parentibus praedīcit.", "acc", "LV"],
    ["Cassandra trīstia [[parentibus]] praedīcit.", "dat", "MV"],
    ["[[Magnō amōre]] ā novīs parentibus ēdūcitur.", "abl", "BWB", "wijze"],
    ["Magnō amōre [[ā novīs parentibus]] ēdūcitur.", "abl", "HV"],
    ["In silvā obscūrā subitō [[ingentem ursum]] cōnspiciunt.", "acc", "LV"],
    ["Vērus amīcus est [[rāra avis]].", "nom", "NWD"],
    ["[[Nocte]] Rūfus sub ponte dormit.", "abl", "BWB", "tijd"],
    ["Nocte Rūfus [[sub ponte]] dormit.", "abl", "BWB", "plaats"],
    ["Dominus [[servum]] monet.", "acc", "LV"],
  ];

  // ---------- voornaamwoorden: tabellen [nom, acc, gen, dat, abl] ----------
  const tab = (enk, mv) => { const r = {}; ["m", "v", "o"].forEach((g, gi) => { r[g] = {}; NV.slice(0, 5).forEach((n, ni) => { r[g][`${n}.enk`] = enk[ni].split(" ")[gi].split("/"); r[g][`${n}.mv`] = mv[ni].split(" ")[gi].split("/"); }); }); return r; };
  const AANWIJZEND = {
    hic: { titel: "hic, haec, hoc", nl: "deze, dit (hier bij mij)", t: tab(["hic haec hoc", "hunc hanc hoc", "huius huius huius", "huic huic huic", "hōc hāc hōc"], ["hī hae haec", "hōs hās haec", "hōrum hārum hōrum", "hīs hīs hīs", "hīs hīs hīs"]) },
    iste: { titel: "iste, ista, istud", nl: "die, dat (daar bij jou)", t: tab(["iste ista istud", "istum istam istud", "istīus istīus istīus", "istī istī istī", "istō istā istō"], ["istī istae ista", "istōs istās ista", "istōrum istārum istōrum", "istīs istīs istīs", "istīs istīs istīs"]) },
    ille: { titel: "ille, illa, illud", nl: "die, dat (ginder bij hem)", t: tab(["ille illa illud", "illum illam illud", "illīus illīus illīus", "illī illī illī", "illō illā illō"], ["illī illae illa", "illōs illās illa", "illōrum illārum illōrum", "illīs illīs illīs", "illīs illīs illīs"]) },
    is: { titel: "is, ea, id", nl: "die, dat · hij, zij, het · zijn, haar, hun", t: tab(["is ea id", "eum eam id", "eius eius eius", "eī eī eī", "eō eā eō"], ["iī eae ea", "eōs eās ea", "eōrum eārum eōrum", "eīs/iīs eīs/iīs eīs/iīs", "eīs/iīs eīs/iīs eīs/iīs"]) },
    idem: { titel: "īdem, eadem, idem", nl: "dezelfde, hetzelfde", t: tab(["īdem eadem idem", "eundem eandem idem", "eiusdem eiusdem eiusdem", "eīdem eīdem eīdem", "eōdem eādem eōdem"], ["iīdem eaedem eadem", "eōsdem eāsdem eadem", "eōrundem eārundem eōrundem", "eīsdem/iīsdem eīsdem/iīsdem eīsdem/iīsdem", "eīsdem/iīsdem eīsdem/iīsdem eīsdem/iīsdem"]) },
    ipse: { titel: "ipse, ipsa, ipsum", nl: "zelf", t: tab(["ipse ipsa ipsum", "ipsum ipsam ipsum", "ipsīus ipsīus ipsīus", "ipsī ipsī ipsī", "ipsō ipsā ipsō"], ["ipsī ipsae ipsa", "ipsōs ipsās ipsa", "ipsōrum ipsārum ipsōrum", "ipsīs ipsīs ipsīs", "ipsīs ipsīs ipsīs"]) },
  };
  // persoonlijke voornaamwoorden (1ste, 2de p. en reflexief sē): [vorm, persoon, getal(len), naamval, vertaling]
  const PERSOONLIJK = [
    ["ego", "1", "enk", "nom", "ik"], ["mē", "1", "enk", "acc", "mij"], ["meī", "1", "enk", "gen", "van mij"], ["mihi", "1", "enk", "dat", "(aan/voor) mij"], ["mē", "1", "enk", "abl", "(door/met) mij"],
    ["tū", "2", "enk", "nom", "jij"], ["tē", "2", "enk", "acc", "jou"], ["tuī", "2", "enk", "gen", "van jou"], ["tibi", "2", "enk", "dat", "(aan/voor) jou"], ["tē", "2", "enk", "abl", "(door/met) jou"],
    ["sē", "3", "enk/mv", "acc", "zich(zelf)"], ["suī", "3", "enk/mv", "gen", "van zich(zelf)"], ["sibi", "3", "enk/mv", "dat", "(aan/voor) zich(zelf)"], ["sē", "3", "enk/mv", "abl", "(door/met) zich(zelf)"],
    ["nōs", "1", "mv", "nom", "wij"], ["nōs", "1", "mv", "acc", "ons"], ["nostrī", "1", "mv", "gen", "van ons"], ["nostrum", "1", "mv", "gen", "van ons"], ["nōbīs", "1", "mv", "dat", "(aan/voor) ons"], ["nōbīs", "1", "mv", "abl", "(door/met) ons"],
    ["vōs", "2", "mv", "nom", "jullie"], ["vōs", "2", "mv", "acc", "jullie"], ["vestrī", "2", "mv", "gen", "van jullie"], ["vestrum", "2", "mv", "gen", "van jullie"], ["vōbīs", "2", "mv", "dat", "(aan/voor) jullie"], ["vōbīs", "2", "mv", "abl", "(door/met) jullie"],
  ];
  const BEZITTELIJK = [
    { la: "meus", mid: "~a, ~um", nl: "mijn", soort: "bn" }, { la: "tuus", mid: "~a, ~um", nl: "jouw, je", soort: "bn" }, { la: "suus", mid: "~a, ~um", nl: "zijn, haar, hun (eigen)", soort: "bn" },
    { la: "noster", mid: "nostra, nostrum", nl: "onze, ons", soort: "bn" }, { la: "vester", mid: "vestra, vestrum", nl: "jullie", soort: "bn" },
  ];
  // voornaamwoorden in een zin vertalen (reflexief of niet): [zin met [[vnw]], juiste vertaling, foute vertalingen…]
  const VNW_ZINNEN = [
    ["Māter [[sē]] in speculō videt.", "zich(zelf) – de moeder", "haar – een ander", "hem", "ons"],
    ["Māter [[eam]] in viā videt.", "haar – de dochter", "zich(zelf) – de moeder", "hem", "hen"],
    ["Valerius et Mārcia [[sē]] in speculō vident.", "zich(zelf) – Valerius en Marcia", "hen – de dochters", "ons", "haar"],
    ["Valerius et Mārcia [[eās]] in viā vident.", "hen – de twee dochters", "zich(zelf) – Valerius en Marcia", "haar", "hem"],
    ["Cottīdiē Mārcus cum cane [[suō]] ambulat.", "zijn (eigen) – van Marcus", "zijn – van iemand anders", "haar", "jouw"],
    ["Hodiē pater cum cane [[eius]] ambulat.", "zijn – van Marcus", "zijn (eigen) – van vader", "hun", "mijn"],
    ["Mārcus et Quīntus cum cane [[suō]] ambulant.", "hun (eigen) – van Marcus en Quintus", "zijn – van iemand anders", "jullie", "onze"],
    ["Hodiē pater cum cane [[eōrum]] ambulat.", "hun – van Marcus en Quintus", "zijn (eigen) – van vader", "haar", "onze"],
    ["Priamus Agelaum [[suum]] īnfantem occīdere iussit.", "zijn (eigen) – van Priamus", "zijn – van Agelaus", "haar", "jouw"],
    ["Hecuba, uxor [[eius]], frūstrā exclāmāvit.", "zijn – van Priamus", "haar (eigen) – van Hecuba", "hun", "mijn"],
    ["‘Priame, adspice saltem fīlium [[tuum]]!’", "jouw – van Priamus", "zijn (eigen)", "mijn", "haar"],
    ["‘Melius est hunc fīlium sacrificāre quam tōtam urbem [[nostram]] flammīs obicere.’", "onze", "jullie", "hun", "zijn"],
    ["Hecuba īnfantem in fiscellam imposuit et [[eum]] Agelaō trādidit.", "hem – de baby", "zich(zelf) – Hecuba", "haar", "hen"],
    ["Agelaus, quamquam rēgī fidēlis erat, nōn semper [[eī]] paruit.", "(aan) hem – de koning", "(aan) zich – Agelaus", "haar", "hen"],
    ["Īnfantem in locō remōtō exposuit, quod [[sēcum]] cōgitāvit: ‘Īnfāns perībit.’", "bij zichzelf – Agelaus", "met hem – de baby", "met mij", "met ons"],
    ["Īnfāns ā novīs parentibus [[suīs]] ēdūcitur.", "zijn (eigen) – van de baby", "hun – van iemand anders", "jullie", "mijn"],
    ["Clytaemnēstra cum Oreste fīliō domum rediit.", "met haar zoon (bezitter blijkt uit de context)", "met zijn zoon", "met de zoon van Agamemnon", "met jouw zoon"],
    ["Diāna ē caelō dēscendit [[eamque]] abstulit.", "en haar – Iphigenia", "en zich(zelf) – Diana", "en hem", "en hen"],
  ];

  // ---------- regels per caput ----------
  const REGELS_CAPUT = {
    1: [
      ["c1-kl", "Welke klassen volgen de adjectieven?", "de 1e of de 2e klasse", "de 1e, 2e of 3e klasse", "enkel de 2e klasse", "enkel de 3e klasse"],
      ["c1-adj2", "Waarin verschillen substantieven en adjectieven van de 2e klasse? (abl. enk. – nom./acc. o. mv. – gen. mv.)", "subst. -e, -a, -um · adj. -ī, -ia, -ium", "subst. -ī, -ia, -ium · adj. -e, -a, -um", "ze verschillen nergens", "enkel in de nominatief"],
      ["c1-zelfst-m", "Een zelfstandig gebruikt adjectief in het mannelijk (bv. omnēs) gaat meestal over …", "personen (allen)", "dingen (alles)", "dieren", "plaatsen"],
      ["c1-zelfst-o", "Een zelfstandig gebruikt adjectief in het onzijdig (bv. trīstia) gaat meestal over …", "dingen (droevige dingen)", "personen (droevige mensen)", "plaatsen", "tijden"],
      ["c1-bona", "Wat betekent <i>bona</i> (zelfstandig gebruikt, o. mv.)?", "goederen, bezittingen", "goede mensen", "een goed mens", "het goede (enk.)"],
      ["c1-nom", "Welke functies heeft een nominatief?", "onderwerp of naamwoordelijk deel", "lijdend voorwerp", "meewerkend voorwerp", "bijvoeglijke bepaling"],
      ["c1-acc", "Welke functie heeft een accusatief zonder voorzetsel meestal?", "lijdend voorwerp", "onderwerp", "meewerkend voorwerp", "handelend voorwerp"],
      ["c1-gen", "Welke functie heeft een genitief meestal en hoe vertaal je hem?", "bijvoeglijke bepaling – 'van'", "meewerkend voorwerp – 'aan'", "lijdend voorwerp – zonder voorzetsel", "bijwoordelijke bepaling – 'met'"],
      ["c1-dat", "Welke functie heeft een datief meestal en hoe vertaal je hem?", "meewerkend voorwerp – '(aan) / (voor)'", "bijvoeglijke bepaling – 'van'", "handelend voorwerp – 'door'", "onderwerp"],
      ["c1-abl", "Welke functie heeft een ablatief meestal?", "bijwoordelijke bepaling (middel, tijd, plaats, wijze, oorzaak)", "lijdend voorwerp", "onderwerp", "meewerkend voorwerp"],
      ["c1-hv", "Wat is <i>ā servō</i> in <i>Amphitheātrum ā servō aedificātur</i>?", "handelend voorwerp (bij een passief gezegde) – door de slaaf", "meewerkend voorwerp – aan de slaaf", "bijvoeglijke bepaling – van de slaaf", "lijdend voorwerp"],
      ["c1-voc", "Waarvoor dient de vocatief?", "om iemand aan te spreken", "voor het onderwerp", "voor het lijdend voorwerp", "voor de tijd"],
      ["c1-vz-in", "<i>in</i> + accusatief en <i>in</i> + ablatief: wat is het verschil?", "+ acc. = naar (richting) · + abl. = in, op (plaats)", "+ acc. = in (plaats) · + abl. = naar (richting)", "er is geen verschil", "+ acc. = met · + abl. = zonder"],
      ["c1-vz-sub", "<i>sub</i> + accusatief en <i>sub</i> + ablatief: wat is het verschil?", "+ acc. = tot onder (richting) · + abl. = onder (plaats)", "+ acc. = onder (plaats) · + abl. = tot onder (richting)", "er is geen verschil", "+ acc. = boven · + abl. = onder"],
      ["c1-ott", "Met welke Nederlandse tijd vertaal je een indicatief praesens?", "onvoltooid tegenwoordige tijd (OTT)", "onvoltooid verleden tijd (OVT)", "onvoltooid toekomende tijd (OTkT)", "voltooid tegenwoordige tijd (VTT)"],
      ["c1-imperf", "Waaraan herken je een indicatief imperfectum?", "aan de kenletters ba of ēba", "aan de kenletter b of ē", "aan era of eri", "aan de perfectumstam"],
      ["c1-ie", "Waarom staat er <i>tegeris</i> en <i>cape</i> (en niet tegiris, capi)?", "een korte i wordt een korte e vóór -r en in de imp. enk.", "het zijn onregelmatige werkwoorden", "het is een futurum", "het is een perfectum"],
      ["c1-infp", "Wat is de passieve infinitief praesens van <i>tegere</i> en <i>capere</i>?", "tegī en capī", "tegerī en caperī", "tēctum en captum", "tegēre en capēre"],
      ["c1-onr", "Welke onregelmatige werkwoorden zijn in álle tijden onregelmatig?", "enkel esse en posse", "īre, fierī, velle, nōlle, mālle, ferre", "alle onregelmatige werkwoorden", "geen enkel werkwoord"],
      ["c1-onr2", "<i>Īre, fierī, velle, nōlle, mālle</i> en <i>ferre</i> zijn onregelmatig in …", "enkel de indicatief praesens", "alle tijden", "enkel het futurum", "enkel het imperfectum"],
    ],
    2: [
      ["c2-stamt", "Welke drie stamtijden heeft een Latijns werkwoord?", "infinitief praesens + ind. praes. 1ste p. – act. ind. perfectum 1ste p. – participium perfectum", "praesens – imperfectum – futurum", "nominatief – genitief – geslacht", "infinitief – imperatief – participium"],
      ["c2-perfst", "Waarvoor gebruik je de perfectumstam (amāv-)?", "voor de actieve voltooide tijden", "voor de onvoltooide tijden", "voor de passieve voltooide tijden", "voor de imperatief"],
      ["c2-pppst", "Waarvoor gebruik je de participium-perfectumstam (amāt-)?", "voor de passieve voltooide tijden", "voor de actieve voltooide tijden", "voor de onvoltooide tijden", "voor de infinitief praesens"],
      ["c2-uitg", "Wat zijn de uitgangen van de actieve indicatief perfectum?", "-ī, -istī, -it, -imus, -istis, -ērunt", "-ō, -s, -t, -mus, -tis, -nt", "-m, -s, -t, -mus, -tis, -nt", "-eram, -erās, -erat …"],
      ["c2-vert", "Hoe vertaal je een indicatief perfectum?", "OVT (ik beminde) of VTT (ik heb bemind)", "enkel OTT", "VVT (ik had bemind)", "OTkT (ik zal beminnen)"],
      ["c2-zijn", "Met welk hulpwerkwoord vertaal je <i>mānsī</i> en <i>fūgī</i> in de VTT?", "zijn (ik ben gebleven, ik ben gevlucht)", "hebben", "worden", "zullen"],
      ["c2-model", "Waar vind je de stamtijden van werkwoorden volgens tegere en capere?", "altijd in de woordenlijst", "ze volgen het model", "ze bestaan niet", "in de imperatief"],
      ["c2-esse", "Wat zijn de stamtijden van esse, posse en ferre?", "fuī – potuī – tulī, lātum", "esī – possī – ferī", "erō – poterō – feram", "fuit – potuit – tulit"],
      ["c2-accidit", "<i>accidit</i>: praesens of perfectum?", "allebei mogelijk: praesens- en perfectumstam zijn gelijk", "enkel praesens", "enkel perfectum", "imperfectum"],
      ["c2-veni", "Wat is het verschil tussen <i>venī</i> en <i>vēnī</i>?", "venī = imp. (kom!) · vēnī = perf. (ik kwam)", "venī = perf. · vēnī = imp.", "er is geen verschil", "venī = futurum"],
      ["c2-ostendi", "<i>ostendī</i> kan zijn …", "pass. inf. praes. (getoond worden) of act. ind. perf. 1ste p. enk. (ik toonde)", "enkel een imperatief", "enkel praesens", "een futurum"],
      ["c2-impf", "Wat drukt een imperfectum uit in een verhaal?", "beschrijving / achtergrond, of een herhaling of gewoonte", "de snel opeenvolgende acties", "iets wat nog moet gebeuren", "een bevel"],
      ["c2-verhaal", "Wat drukt het verhalend perfectum uit?", "de opeenvolgende acties op de voorgrond (vertalen met OVT)", "de achtergrond", "een gewoonte", "iets in de toekomst"],
      ["c2-mededel", "Waaraan herken je een mededelend perfectum en hoe vertaal je het?", "het staat tussen aanhalingstekens – VTT", "het staat vooraan in de zin – OVT", "het heeft een kenletter ba – OVT", "het staat in de passief – OTkT"],
      ["c2-hist", "Wat doet een historisch praesens in een verhaal?", "het brengt spannende handelingen dichterbij (OTT of OVT)", "het beschrijft de achtergrond", "het geeft een gewoonte weer", "het drukt de toekomst uit"],
      ["c2-se", "Wanneer gebruik je <i>sē</i> / <i>suus</i> (reflexief)?", "als het verwijst naar het onderwerp", "als het verwijst naar iemand anders dan het onderwerp", "enkel in het meervoud", "enkel bij een imperatief"],
      ["c2-eius", "Wanneer gebruik je <i>eum, eam</i> / <i>eius, eōrum</i> (niet-reflexief)?", "als het verwijst naar iemand of iets anders dan het onderwerp", "als het verwijst naar het onderwerp", "enkel bij de 1ste persoon", "enkel in een vraag"],
      ["c2-mecum", "Hoe zeg je 'met mij' en 'met ons'?", "mēcum, nōbīscum", "cum mē, cum nōbīs", "mihi cum, nōbīs cum", "meum, nostrum"],
      ["c2-bez", "Welke verbuiging volgen meus, tuus, suus, noster, vester?", "die van bonus, bona, bonum", "die van fortis", "die van dux", "ze zijn onveranderlijk"],
      ["c2-voor", "Wat betekent het als het bezittelijk voornaamwoord vóór de kern staat (<i>Tuī mīlitēs</i>)?", "de bezitter wordt beklemtoond: 'jouw eigen soldaten'", "het is een fout", "het betekent 'jullie'", "het is een vraag"],
      ["c2-geen", "Er staat geen bezittelijk voornaamwoord (<i>cum Oreste fīliō</i>). Wat doe je in het Nederlands?", "een bezittelijk voornaamwoord toevoegen volgens de context (met haar zoon)", "niets toevoegen", "altijd 'zijn' toevoegen", "het woord weglaten"],
    ],
    3: [
      ["c3-pass", "Hoe vorm je de passieve indicatief perfectum?", "participium perfectum + indicatief praesens van esse (amātus sum)", "perfectumstam + uitgangen (amāvī)", "praesensstam + ba (amābar)", "participium + imperfectum van esse"],
      ["c3-cong", "Waarmee congrueert het participium perfectum in <i>urbs dēlēta est</i>?", "met het onderwerp, in naamval, genus en getal", "met het lijdend voorwerp", "met niets: het is onveranderlijk", "met het werkwoord esse"],
      ["c3-passvert", "Hoe vertaal je <i>urbs dēlēta est</i> als verhalend en als mededelend perfectum?", "de stad werd verwoest · de stad is verwoest", "de stad wordt verwoest · de stad zal verwoest worden", "de stad was verwoest · de stad had verwoest", "de stad verwoest · de stad verwoestte"],
      ["c3-ferre", "Wat is het participium perfectum van ferre (en afferre)?", "lātus (allātus)", "fertus (affertus)", "tulus (attulus)", "ferrātus"],
      ["c3-plqpf", "Hoe vorm je de actieve indicatief plusquamperfectum?", "perfectumstam + era + uitgang (amāveram)", "perfectumstam + eri + uitgang", "praesensstam + ēba + uitgang", "participium + sum"],
      ["c3-futex", "Hoe vorm je de actieve indicatief futurum exactum?", "perfectumstam + eri/er + uitgang (amāverō, amāveris)", "perfectumstam + era + uitgang", "praesensstam + b + uitgang", "participium + eram"],
      ["c3-futex3", "Wat is de 3de p. mv. van het actieve futurum exactum van amāre?", "amāverint", "amāverunt", "amāvērunt", "amāverant"],
      ["c3-plqpfvert", "Met welke tijd vertaal je een plusquamperfectum?", "voltooid verleden tijd (VVT): ik had bemind", "voltooid toekomende tijd: ik zal bemind hebben", "onvoltooid verleden tijd", "voltooid tegenwoordige tijd"],
      ["c3-futexvert", "Met welke tijd vertaal je een futurum exactum?", "voltooid toekomende tijd (VTkT): ik zal bemind hebben (soms OTT of VTT)", "voltooid verleden tijd", "onvoltooid tegenwoordige tijd, altijd", "onvoltooid verleden tijd"],
      ["c3-voort", "Wat drukt een plusquamperfectum uit?", "een handeling vóór een andere handeling in het verleden", "een handeling vóór een andere handeling in de toekomst", "een gewoonte", "een bevel"],
      ["c3-passplq", "Hoe vorm je het passieve plusquamperfectum en futurum exactum?", "participium perfectum + eram (plqpf.) / erō (fut. ex.)", "perfectumstam + era / eri", "participium perfectum + sum", "praesensstam + ba / b"],
      ["c3-hic", "Wat is het verschil tussen hic, iste en ille?", "hic = deze (bij mij) · iste = die (bij jou) · ille = die (ginder)", "hic = die (ginder) · ille = deze (bij mij)", "ze betekenen allemaal 'zelf'", "hic = hij · iste = zij · ille = het"],
      ["c3-ius", "Welke typische uitgangen hebben de aanwijzende voornaamwoorden in het enkelvoud?", "gen. -ius, dat. -ī, nom./acc. o. meestal -d", "gen. -ī, dat. -ō, nom./acc. o. -um", "gen. -is, dat. -ī, nom./acc. o. -e", "gen. -ae, dat. -ae, nom./acc. o. -a"],
      ["c3-haec", "Welke vormen kan <i>haec</i> zijn?", "nom. v. enk. en nom./acc. o. mv.", "enkel nom. v. enk.", "acc. v. enk.", "gen. mv."],
      ["c3-hicvolgt", "Waarnaar kan <i>hic</i> ook verwijzen (Creūsa haec dīxit: …)?", "naar iets wat volgt: het volgende", "enkel naar iets wat voorafging", "naar de spreker zelf", "naar een plaats ver weg"],
      ["c3-is1", "<i>Eōs humī prōstrāvit.</i> Hoe vertaal je het zelfstandig gebruikte <i>is</i>?", "als persoonlijk voornaamwoord: hij, zij, het (hier: hen)", "als 'die, dat'", "als 'zijn, haar, hun'", "als 'zelf'"],
      ["c3-is2", "<i>Inter eōs cyclōpēs</i>: hoe vertaal je <i>is</i> als congruerende BVB?", "als aanwijzend voornaamwoord: die (tussen die cyclopen)", "als hij, zij, het", "als zijn, haar, hun", "als dezelfde"],
      ["c3-is3", "<i>Spēluncam eius intrāvit.</i> Hoe vertaal je <i>eius</i>?", "als bezittelijk voornaamwoord: zijn grot", "als 'die grot'", "als 'hem'", "als 'zichzelf'"],
      ["c3-idem", "Hoe is <i>īdem</i> opgebouwd?", "is + dem (īdem, idem; -m- vóór -d- wordt -n-: eundem)", "ipse + dem", "is + ipse", "idem is onveranderlijk"],
      ["c3-ipse", "Wat betekent <i>Polyphēmus ipse rediit</i>?", "Polyphemus zelf keerde terug", "dezelfde Polyphemus keerde terug", "die Polyphemus keerde terug", "Polyphemus keerde naar zichzelf terug"],
    ],
  };

  Object.assign(I, {
    GRAM: {
      NV, NV_NAAM, GETAL, GS, CELLS, MODELLEN, MODEL_LABEL, KLASSE_NAAM, DEKL_KLASSE, SPECIAAL, ADJ_MODELLEN, ADJ_GROEP,
      TIJD, TIJD_VOLT, TIJD_ALLE, TIJD_NAAM, VORM_NAAM, PERS, MODEL_WW, MODEL_WW_NL, ONR, NL_WW, REGELS,
      CAPUT_INFO, KEN_JE_NOG, VOORZETSELS, FUNCTIES, ZINNEN_FUNCTIE, AANWIJZEND, PERSOONLIJK, BEZITTELIJK, VNW_ZINNEN, REGELS_CAPUT,
      nounModel, nounForms, modelKlasse, modelNaam, adjInfo, adjForms, verbSpec, verbForms, futSplit, keyParts, isVolt, nlVorm, nlAlle, slot, gsOf, tabelNw,
    },
  });
})();
