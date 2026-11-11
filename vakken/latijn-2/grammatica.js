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
  const TIJD = ["praes", "imperf", "fut"];
  const TIJD_NAAM = { praes: "praesens", imperf: "imperfectum", fut: "futurum simplex" };
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
  const ONOVERG = /^(zich |zijn|gaan|komen|lopen|slapen|staan|liggen|zitten|wonen|blijven|leven|sterven|vallen|groeien|vluchten|terugkeren|wandelen|zwerven|varen|rennen|werken|lachen|huilen|zwijgen|aankomen|vertrekken|naderen|ontsnappen|ontstaan|heersen|twijfelen|aanwezig|afwezig|nuttig|overblijven|weggaan|binnengaan|buitengaan|oversteken|voorbijgaan|ten onder|schitteren|bloeien|blij zijn|stilstaan|uitblinken|gehoorzamen|dienen|haasten|zich haasten|strijden|vechten|razen|branden|zeilen|zwemmen|wachten|treuren|klagen|jagen|dansen|zingen|spelen|kunnen|willen|niet willen|liever willen|worden)/;

  // beschrijving van een werkwoord uit de woordenlijst (of een model): { inf, kind: 1|2|3|3io|4|onr, base, prefix, pass }
  function verbSpec(w) {
    if (w.soort !== "ww" || !w.verv) return null;
    const inf = head(w.la);
    if (w.dep && !ONR[inf]) return null;
    if (/\s/.test(inf) || /^[A-Z]/.test(inf)) return null;
    if (w.verv === "onr") {
      if (ONR[inf]) return { inf, kind: "onr", base: inf, prefix: "", pass: inf === "ferre" };
      if (inf === "prōdesse") return null;
      for (const b of ["esse", "īre", "ferre"]) if (inf.endsWith(b) && inf !== b) return { inf, kind: "onr", base: b, prefix: inf.slice(0, -b.length), pass: false };
      return null;
    }
    const k = String(w.verv);
    const r = R[k];
    if (!r || !r.st.test(inf) || inf === "dare") return null;
    const trans = !ONOVERG.test(w.nl || "") && w.naamval !== "dat.";
    return { inf, kind: k, st: inf.replace(r.st, ""), pass: trans };
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
      return out;
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
    return out;
  }
  // futurum gesplitst: [stam, kenletter, bindklinker, uitgang] per persoon (enkel regelmatige werkwoorden)
  function futSplit(v, vorm) {
    const r = R[v.kind];
    if (v.kind === "1" || v.kind === "2") return FUT_B[vorm].map(([k, b, u]) => [v.st + r.fv, k, b, u]);
    return FUT_E[vorm].map(([k, b, u]) => [v.st + r.fv, k, b, u]);
  }
  const keyParts = (k) => { const [vorm, tijd, p, g] = k.split("."); return { vorm, tijd, p, g }; };

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
  function nlVorm(inf, key) {
    const raw = NL_WW[inf];
    if (!raw) return null;
    const [main, adv] = raw.split(";");
    const [ik, jij, hij, mv, ovt, ovtMv, vd] = main.split("|");
    const { vorm, tijd, p, g } = keyParts(key);
    if (tijd === "imp") return null;
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

  Object.assign(I, {
    GRAM: {
      NV, NV_NAAM, GETAL, GS, CELLS, MODELLEN, MODEL_LABEL, KLASSE_NAAM, DEKL_KLASSE, SPECIAAL, ADJ_MODELLEN, ADJ_GROEP,
      TIJD, TIJD_NAAM, VORM_NAAM, PERS, MODEL_WW, MODEL_WW_NL, ONR, NL_WW, REGELS,
      nounModel, nounForms, modelKlasse, modelNaam, adjInfo, adjForms, verbSpec, verbForms, futSplit, keyParts, nlVorm, slot, gsOf, tabelNw,
    },
  });
})();
