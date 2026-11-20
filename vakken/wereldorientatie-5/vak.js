// ============================================================
// VAK – Wereldoriëntatie 5de leerjaar · Europa aardrijkskundig
// Blinde kaart (landen, hoofdsteden, gebergten, rivieren) + begrippen + atlas, windroos, schaal en
// bevolkingsdichtheid. Leerstof: inhoud.js · kaart: kaart.js. Elk onderdeel = unit({ id, group, items(s), gen }).
// Elk item heeft een vaste sleutel k → vraagsleutel "<unit>:<k>" (voortgang en leerkaarten).
// ============================================================
(function () {
  "use strict";
  const I = Vakken.inhoud("wereldorientatie-5"), K = Vakken.inhoud("wereldorientatie-5-kaart");
  const { BEGRIPPEN, RELIEF, LANDSTAD, WATER, KAARTSOORT, ATLAS, EU, DICHT, WIND, TAGS } = I;

  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rnd(a.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uniq = (arr) => [...new Set(arr)];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const typed = (level, p = 0.4) => (level === "easy" ? false : level === "hard" || Vakken.vast ? true : Math.random() < p);
  const nOpts = (level) => (level === "easy" ? 3 : 4);
  const fmt = (n) => String(n).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // ---------- tekst en getallen nakijken ----------
  const strip = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const norm = (s) => strip(String(s ?? "").toLowerCase()).replace(/[’‘`´]/g, "'").replace(/[.!?;:"()]/g, " ").replace(/-/g, " ").replace(/\s+/g, " ").trim().replace(/^(de|het|een|in de|in het)\s+/, "");
  function lev(a, b) {
    const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function checkText(given, accepted, tag) {
    const g = norm(given), acc = accepted.map(norm);
    if (!g) return { status: "wrong", tag };
    if (acc.includes(g)) return { status: "correct" };
    if (acc.some((a) => a.length > 4 && lev(a, g) <= (a.length > 7 ? 2 : 1))) return { status: "spelling", tag: "spelling", note: `Schrijf: ${accepted[0]}.` };
    return { status: "wrong", tag };
  }
  const parseNum = (s) => { const t = String(s ?? "").replace(/\s/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."); return t === "" || isNaN(+t) ? null : +t; };
  const eqNum = (a, b, tol = 1e-9) => a != null && Math.abs(a - b) <= tol;

  // ---------- landen ----------
  const SORT = { eu: 0, ext: 1, ander: 2 };
  const LANDEN = K.countries.slice().sort((a, b) => SORT[a.soort] - SORT[b.soort] || a.naam.localeCompare(b.naam, "nl"));
  const LAND = Object.fromEntries(LANDEN.map((c) => [c.id, c]));
  const SOORT_NAAM = { eu: "EU-lidstaten", ext: "VK, Noorwegen, Zwitserland, Rusland", ander: "andere landen van Europa" };
  const landSet = (s) => { const L = s && Array.isArray(s.landen) ? s.landen : ["eu", "ext"]; return LANDEN.filter((c) => L.includes(c.soort)); };
  const ALT_LAND = { gb: ["Groot-Brittannië", "VK", "UK"], cz: ["Tsjechische Republiek"], ba: ["Bosnië", "Bosnië-Herzegovina"], mk: ["Macedonië"], by: ["Belarus"], md: ["Moldova"], nl: ["Holland"] };
  const ALT_HS = { ua: ["Kyiv", "Kiev"], pl: ["Warszawa"], cz: ["Praha"], at: ["Wien"], pt: ["Lisboa"], hu: ["Budapest"], dk: ["København", "Kobenhavn"], ro: ["Bucuresti", "Boekarest"], it: ["Roma"], ch: ["Berne"], ru: ["Moskva"], gr: ["Athenen"], md: ["Chisinau", "Chișinău"] };
  const MINI = ["lu", "mt", "cy"]; // klein: extra cirkel om op te tikken
  const nameMap = (f) => Object.fromEntries(LANDEN.map((c) => [c.id, f(c)]));

  // ---------- de blinde kaart als svg ----------
  function svgMap(o = {}) {
    const has = (set, id) => set && (set === true || set.includes(id));
    const hit = (ok, id) => (ok ? ` data-hit="${id}"` : "");
    let h = `<svg class="map" viewBox="0 0 ${K.W} ${K.H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="blinde kaart van Europa"><path class="bgl" d="${K.bg}"/>`;
    LANDEN.forEach((c) => { h += `<path class="land${o.hl === c.id ? " hl" : ""}" d="${c.d}"${hit(has(o.hitLand, c.id), c.id)}/>`; });
    LANDEN.filter((c) => MINI.includes(c.id) && (has(o.hitLand, c.id) || o.hl === c.id)).forEach((c) => {
      h += `<circle class="mini${o.hl === c.id ? " hl" : ""}" cx="${c.cx}" cy="${c.cy}" r="${o.hl === c.id ? 12 : 9}"${hit(has(o.hitLand, c.id), c.id)}${o.hl === c.id ? ' style="fill:rgba(245,158,11,.35);stroke:#f59e0b;stroke-width:2"' : ""}/>`;
    });
    if (o.geb) K.gebergten.forEach((g) => { h += `<path class="geb${o.hl === g.id ? " hl" : ""}" d="${g.d}"${hit(o.hitGeb, g.id)}/>`; });
    if (o.riv) K.rivieren.forEach((r) => { h += `<path class="riv${o.hl === r.id ? " hl" : ""}" d="${r.d}"${hit(o.hitRiv, r.id)}/>` + (o.hitRiv ? `<path class="rivhit" d="${r.d}" data-hit="${r.id}"/>` : ""); });
    if (o.caps) o.caps.forEach((id) => { const c = LAND[id]; h += `<circle class="cap${o.hlCap === id ? " hl" : ""}" cx="${c.cx}" cy="${c.cy}" r="${o.hlCap === id ? 6.5 : 4.5}"${hit(o.hitCap, id)}/>` + (o.hitCap ? `<circle class="caphit" cx="${c.cx}" cy="${c.cy}" r="11" data-hit="${id}"/>` : ""); });
    if (o.pts) o.pts.forEach((p) => { h += `<circle class="pt" cx="${p.x}" cy="${p.y}" r="7" style="fill:${p.kleur}"/><text class="ptlbl" x="${p.x + 10}" y="${p.y - 8}">${esc(p.label)}</text>`; });
    return h + "</svg>";
  }

  // ============================================================
  // ONDERDELEN
  // ============================================================
  const UNITS = [];
  const unit = (u) => { UNITS.push(u); return u; };
  const base = (u, o) => Object.assign({ unit: u.id, unitLabel: u.label, group: u.group, page: u.page, rule: u.rule, tag: u.tag }, o);
  const mc = (q, right, wrong, level, n) => Object.assign(q, { mode: "mc", options: shuffle(uniq([right, ...shuffle(uniq(wrong.filter((w) => w !== right))).slice(0, (n || nOpts(level)) - 1)])).map((o) => ({ v: o, html: esc(o) })), answer: right });

  // ---------- K. blinde kaart ----------
  unit({
    id: "land_klik", group: "K", label: "Landen aanduiden op de blinde kaart", page: "2, 8", tag: "land",
    rule: TAGS.land.advice,
    items: (s) => landSet(s).map((c) => ({ k: c.id, c })),
    gen(level, { c }) {
      return base(this, { mode: "map", instruction: "Tik op de blinde kaart het land aan:", prompt: `<b>${esc(c.naam)}</b>`, svg: svgMap({ hitLand: true }), answer: c.id, hitNames: nameMap((x) => x.naam),
        mapHint: MINI.includes(c.id) ? "Kleine landen hebben een cirkeltje. Tik op de kaart en klik dan op Controleer." : "", answerShown: esc(c.naam), key: `land_klik:${c.id}`, itemLabel: `kaart: ${c.naam}` });
    },
  });
  unit({
    id: "land_naam", group: "K", label: "Welk land is aangeduid?", page: "2, 8", tag: "land",
    rule: TAGS.land.advice,
    items: (s) => landSet(s).map((c) => ({ k: c.id, c })),
    gen(level, { c }, s) {
      const q = base(this, { instruction: "Welk land is in het oranje aangeduid?", prompt: "", svg: svgMap({ hl: c.id }), answerShown: esc(c.naam), key: `land_naam:${c.id}`, itemLabel: `kaart: ${c.naam}` });
      if (typed(level)) return Object.assign(q, { mode: "text", chk: (g) => checkText(g, [c.naam, ...(ALT_LAND[c.id] || [])], "land") });
      return mc(q, c.naam, landSet(s).map((x) => x.naam), level);
    },
  });
  unit({
    id: "hoofdstad", group: "K", label: "Hoofdsteden kennen (land ↔ hoofdstad)", page: "2", tag: "hoofdstad",
    rule: TAGS.hoofdstad.advice,
    items: (s) => landSet(s).map((c) => ({ k: c.id, c })),
    gen(level, { c }, s, dir) {
      dir = dir || (Math.random() < 0.6 ? "hs" : "land");
      const svg = svgMap({ hl: c.id });
      if (dir === "hs") {
        const q = base(this, { instruction: "Wat is de hoofdstad van …", prompt: `<b>${esc(c.naam)}</b>`, svg, answerShown: esc(c.hoofdstad), key: `hoofdstad:${c.id}`, itemLabel: `${c.naam} – ${c.hoofdstad}` });
        if (typed(level, 0.5)) return Object.assign(q, { mode: "text", chk: (g) => checkText(g, [c.hoofdstad, ...(ALT_HS[c.id] || [])], "hoofdstad") });
        return mc(q, c.hoofdstad, landSet(s).map((x) => x.hoofdstad), level);
      }
      const q = base(this, { instruction: "Van welk land is dit de hoofdstad?", prompt: `<b>${esc(c.hoofdstad)}</b>`, answerShown: esc(c.naam), key: `hoofdstad:${c.id}`, itemLabel: `${c.naam} – ${c.hoofdstad}` });
      if (typed(level, 0.3)) return Object.assign(q, { mode: "text", chk: (g) => checkText(g, [c.naam, ...(ALT_LAND[c.id] || [])], "hoofdstad") });
      return mc(q, c.naam, landSet(s).map((x) => x.naam), level);
    },
  });
  unit({
    id: "hoofdstad_kaart", group: "K", label: "Hoofdsteden aanduiden op de blinde kaart", page: "2", tag: "hoofdstad",
    rule: TAGS.hoofdstad.advice + " Op de kaart: de stip ligt in het land van die hoofdstad.",
    items: (s) => landSet(s).map((c) => ({ k: c.id, c })),
    gen(level, { c }, s) {
      const caps = landSet(s).map((x) => x.id), key = `hoofdstad_kaart:${c.id}`;
      if (level === "easy" || Math.random() < 0.5)
        return base(this, { mode: "map", instruction: "Tik op de blinde kaart de hoofdstad aan:", prompt: `<b>${esc(c.hoofdstad)}</b>`, svg: svgMap({ caps, hitCap: true }), answer: c.id,
          hitNames: nameMap((x) => x.hoofdstad), answerShown: `${esc(c.hoofdstad)} <small>(${esc(c.naam)})</small>`, key, itemLabel: `kaart: ${c.hoofdstad}` });
      const q = base(this, { instruction: "Welke hoofdstad is in het oranje aangeduid?", prompt: "", svg: svgMap({ caps, hlCap: c.id }), answerShown: `${esc(c.hoofdstad)} <small>(${esc(c.naam)})</small>`, key, itemLabel: `kaart: ${c.hoofdstad}` });
      if (typed(level, 0.4)) return Object.assign(q, { mode: "text", chk: (g) => checkText(g, [c.hoofdstad, ...(ALT_HS[c.id] || [])], "hoofdstad") });
      return mc(q, c.hoofdstad, landSet(s).map((x) => x.hoofdstad), level);
    },
  });
  // gebergten en rivieren: aanduiden én benoemen
  const GEB_EXTRA = ["de Karpaten", "de Ardennen", "de Apennijnen"], RIV_EXTRA = ["de Maas", "de Schelde", "de Elbe"];
  const GEB_INFO = { alpen: "midden in Europa: Frankrijk, Zwitserland, Italië, Oostenrijk", pyreneeen: "de grens tussen Frankrijk en Spanje", oeral: "in Rusland: de grens tussen Europa en Azië" };
  const RIV_INFO = { seine: "door Parijs naar het Kanaal (Frankrijk)", rijn: "van de Alpen in Zwitserland, langs Duitsland, naar Nederland en de Noordzee", donau: "van Duitsland via Wenen, Bratislava, Boedapest en Belgrado naar de Zwarte Zee" };
  function natUnit(id, label, tag, lijst, opt, extra, info) {
    return unit({
      id, group: "K", label, page: "11", tag, rule: TAGS[tag].advice,
      items: () => lijst.flatMap((x) => [{ k: `klik-${x.id}`, x, wat: "klik" }, { k: `naam-${x.id}`, x, wat: "naam" }]),
      gen(level, { x, wat, k }) {
        const key = `${id}:${k}`, shown = `${esc(x.naam)} <small>(${esc(info[x.id])})</small>`;
        if (wat === "klik") return base(this, { mode: "map", instruction: `Tik op de kaart aan:`, prompt: `<b>${esc(x.naam)}</b>`, svg: svgMap({ [opt]: true, ["hit" + opt[0].toUpperCase() + opt.slice(1)]: true }), answer: x.id,
          hitNames: Object.fromEntries(lijst.map((y) => [y.id, y.naam])), answerShown: shown, key, itemLabel: `kaart: ${x.naam}` });
        const q = base(this, { instruction: `Welk${tag === "rivier" ? "e rivier" : " gebergte"} is in het oranje aangeduid?`, prompt: "", svg: svgMap({ [opt]: true, hl: x.id }), answerShown: shown, key, itemLabel: `kaart: ${x.naam}` });
        if (level === "hard") return Object.assign(q, { mode: "text", chk: (g) => checkText(g, [x.naam, x.naam.replace(/^(de|het) /, "")], tag) });
        return mc(q, x.naam, [...lijst.map((y) => y.naam), ...(level === "easy" ? [] : extra)], level);
      },
    });
  }
  natUnit("gebergte", "Gebergten: Alpen, Pyreneeën, Oeralgebergte", "gebergte", K.gebergten, "geb", GEB_EXTRA, GEB_INFO);
  natUnit("rivier", "Rivieren: Seine, Donau, Rijn", "rivier", K.rivieren, "riv", RIV_EXTRA, RIV_INFO);
  unit({
    id: "eu_lid", group: "K", label: "Lid van de Europese Unie of niet?", page: "1-2", tag: "land",
    rule: "27 landen zijn lid van de EU. Het Verenigd Koninkrijk (sinds 2020), Noorwegen, Zwitserland en Rusland liggen in Europa maar zijn géén lid.",
    items: () => LANDEN.map((c) => ({ k: c.id, c })),
    gen(level, { c }) {
      const ja = c.soort === "eu";
      return base(this, { mode: "mc", instruction: "Is dit land lid van de Europese Unie?", prompt: `<b>${esc(c.naam)}</b>`, svg: svgMap({ hl: c.id }), options: [{ v: "ja", html: "ja, lid van de EU" }, { v: "nee", html: "nee, geen lid" }], answer: ja ? "ja" : "nee",
        answerShown: ja ? "ja, lid van de EU" : "nee, geen lid van de EU", key: `eu_lid:${c.id}`, itemLabel: `${c.naam}: ${ja ? "EU" : "geen EU"}` });
    },
  });

  // ---------- B. begrippen en landschappen ----------
  unit({
    id: "begrip", group: "B", label: "Begrippenlijst (hellingsgraad, zeestraat, schaal …)", page: "11", tag: "begrip",
    rule: TAGS.begrip.advice,
    items: () => BEGRIPPEN.map((b, i) => ({ k: String(i), b })),
    gen(level, { b, k }) {
      const key = `begrip:${k}`;
      if (Math.random() < 0.5) {
        const q = base(this, { instruction: "Wat betekent dit begrip?", prompt: `<b>${esc(b.t)}</b>`, answerShown: esc(b.d), key, itemLabel: `${b.t}`, page: b.p });
        return mc(q, b.d, BEGRIPPEN.map((x) => x.d), level);
      }
      const q = base(this, { instruction: "Welk begrip hoort bij deze uitleg?", prompt: esc(b.d), answerShown: esc(b.t), key, itemLabel: `${b.t}`, page: b.p });
      if (level === "hard") return Object.assign(q, { mode: "text", chk: (g) => checkText(g, [b.t], "begrip") });
      return mc(q, b.t, BEGRIPPEN.map((x) => x.t), level);
    },
  });
  function bankUnit(id, group, label, page, tag, bank, keuzes, instr) {
    return unit({
      id, group, label, page, tag, rule: TAGS[tag].advice,
      items: () => bank.map((x, i) => ({ k: String(i), x })),
      gen(level, { x, k }) {
        const q = base(this, { instruction: instr || "Kies het juiste antwoord.", prompt: esc(x.q), answerShown: esc(x.a) + (x.x ? ` <small>(${esc(x.x)})</small>` : ""), key: `${id}:${k}`, itemLabel: `${x.q} → ${x.a}`, page: x.p || page });
        if (keuzes) return Object.assign(q, { mode: "mc", options: keuzes.map((o) => ({ v: o, html: esc(o) })), answer: x.a, okAlso: x.alt || [] });
        const r = mc(q, x.a, x.opts || bank.map((b) => b.a), level);
        return Object.assign(r, { okAlso: x.alt || [] });
      },
    });
  }
  bankUnit("relief", "B", "De drie reliëfvormen: vlak, heuvelachtig, bergachtig", "4", "relief", RELIEF, ["vlak", "heuvelachtig", "bergachtig"], "Welke reliëfvorm is dit?");
  bankUnit("landstad", "B", "Landelijk of stedelijk gebied?", "3", "relief", LANDSTAD, ["landelijk", "stedelijk"], "Welk type gebied zie je hier?");
  bankUnit("water", "B", "Water in Europa (zeestraat, golf, eiland, schiereiland)", "7", "water", WATER.map((x) => (x.opts ? x : { ...x, opts: ["zeestraat", "golf", "eiland", "schiereiland"] })));
  bankUnit("europa", "B", "Europa en de Europese Unie", "1-2", "land", EU);

  // ---------- A. atlas, windroos, schaal, bevolkingsdichtheid ----------
  const KS = ["natuurkundige kaart", "staatkundige kaart", "thematische kaart"];
  unit({
    id: "kaartsoort", group: "A", label: "Welke kaartsoort gebruik ik?", page: "5", tag: "atlas",
    rule: TAGS.atlas.advice,
    items: () => KAARTSOORT.map((x, i) => ({ k: String(i), x })),
    gen(level, { x, k }) {
      return base(this, { mode: "mc", instruction: "Welke kaartsoort gebruik je?", prompt: esc(x.q), options: KS.map((o) => ({ v: o, html: esc(o) })), answer: x.a + " kaart", okAlso: (x.alt || []).map((a) => a + " kaart"),
        answerShown: esc(x.a + " kaart") + (x.x ? ` <small>(${esc(x.x)})</small>` : ""), key: `kaartsoort:${k}`, itemLabel: `${x.q} → ${x.a}`, page: x.p });
    },
  });
  bankUnit("atlas", "A", "Werken met de atlas: register en inhoudstafel", "5", "atlas", ATLAS);
  // windroos: afkortingen, wijzerzin, tegenover
  const WIND_ITEMS = [
    ...WIND.map((w, i) => ({ k: `afk-${w.k}`, t: "afk", i })),
    ...WIND.map((w, i) => ({ k: `naam-${w.k}`, t: "naam", i })),
    ...WIND.map((w, i) => ({ k: `na-${w.k}`, t: "na", i })),
    ...WIND.map((w, i) => ({ k: `tegen-${w.k}`, t: "tegen", i })),
    { k: "boven", t: "boven", i: 0 },
  ];
  unit({
    id: "windroos", group: "A", label: "De windroos (N, NO, O, ZO, Z, ZW, W, NW)", page: "6", tag: "wind",
    rule: TAGS.wind.advice,
    items: () => WIND_ITEMS,
    gen(level, it) {
      const w = WIND[it.i], key = `windroos:${it.k}`, names = WIND.map((x) => x.n), afk = WIND.map((x) => x.k);
      const q = (instruction, prompt, ans, pool) => mc(base(this, { instruction, prompt, answerShown: esc(ans), key, itemLabel: `${prompt.replace(/<[^>]+>/g, "")} → ${ans}` }), ans, pool, level, level === "easy" ? 3 : 4);
      if (it.t === "afk") return q("Waarvoor staat deze afkorting op de windroos?", `<b>${w.k}</b>`, w.n, names);
      if (it.t === "naam") {
        const r = base(this, { instruction: "Wat is de afkorting op de windroos?", prompt: `<b>${w.n}</b>`, answerShown: w.k, key, itemLabel: `${w.n} → ${w.k}` });
        if (typed(level, 0.5)) return Object.assign(r, { mode: "text", short: true, chk: (g) => (String(g).trim().toUpperCase().replace(/[^A-Z]/g, "") === w.k ? { status: "correct" } : { status: "wrong", tag: "wind" }) });
        return mc(r, w.k, afk, level, 4);
      }
      if (it.t === "na") return q("Welke windrichting komt hierna, in wijzerzin (zoals de wijzers van de klok)?", `<b>${w.n}</b> → …`, WIND[(it.i + 1) % 8].n, names);
      if (it.t === "tegen") return q("Wat is de tegenovergestelde windrichting?", `<b>${w.n}</b>`, WIND[(it.i + 4) % 8].n, names);
      return q("Er staat geen windroos op de kaart. Welke windrichting is dan de bovenkant van de kaart?", "", "noorden", ["zuiden", "oosten", "westen"]);
    },
  });
  // richting tussen twee hoofdsteden (op de kaart: rechts = oosten, boven = noorden)
  const PAREN = [["be", "fr"], ["gr", "nl"], ["es", "fr"], ["it", "at"], ["de", "dk"], ["pt", "es"], ["pl", "lt"], ["fr", "de"], ["se", "fi"], ["nl", "be"], ["ie", "gb"], ["at", "hu"], ["ro", "bg"], ["cz", "pl"], ["hr", "si"],
    ["dk", "se"], ["lv", "ee"], ["gb", "no"], ["ch", "it"], ["es", "it"], ["fi", "ee"], ["sk", "hu"], ["de", "ch"], ["fr", "es"], ["bg", "gr"], ["ru", "pl"], ["no", "se"], ["be", "lu"], ["mt", "it"], ["cy", "gr"], ["pt", "gb"], ["ee", "ru"]];
  function richting(a, b) {
    const A = LAND[a], B = LAND[b], ang = (Math.atan2(B.cx - A.cx, A.cy - B.cy) * 180) / Math.PI, g = (ang + 360) % 360;
    const idx = Math.round(g / 45) % 8, marge = Math.abs(g - idx * 45 - (idx === 0 && g > 180 ? 360 : 0));
    return { w: WIND[idx], marge: Math.min(marge, 360 - marge) };
  }
  const RICHT = PAREN.filter(([a, b]) => richting(a, b).marge <= 14);
  unit({
    id: "richting", group: "A", label: "In welke richting reis ik? (windroos + kaart)", page: "6", tag: "wind",
    rule: "Kijk van de vertrekplaats (A) naar de aankomstplaats (B). Boven = noorden, rechts = oosten, onder = zuiden, links = westen. Schuin = noordoosten, zuidoosten, zuidwesten of noordwesten.",
    items: (s) => { const ids = landSet(s).map((c) => c.id); return RICHT.filter(([a, b]) => ids.includes(a) && ids.includes(b)).map(([a, b]) => ({ k: `${a}-${b}`, a, b })); },
    gen(level, { k, a, b }) {
      const A = LAND[a], B = LAND[b], { w } = richting(a, b);
      const q = base(this, { instruction: `Je reist van <b>${esc(A.hoofdstad)}</b> (A) naar <b>${esc(B.hoofdstad)}</b> (B). In welke richting reis je?`, prompt: "",
        svg: svgMap({ pts: [{ x: A.cx, y: A.cy, label: "A", kleur: "#22c55e" }, { x: B.cx, y: B.cy, label: "B", kleur: "#ef4444" }] }), answerShown: `naar het ${w.n} (${w.k})`, key: `richting:${k}`, itemLabel: `${A.hoofdstad} → ${B.hoofdstad}: ${w.k}` });
      const opts = level === "easy" ? shuffle([w, ...shuffle(WIND.filter((x) => x !== w)).slice(0, 3)]) : WIND;
      return Object.assign(q, { mode: "mc", options: opts.map((x) => ({ v: x.k, html: `${x.n} (${x.k})` })), answer: w.k });
    },
  });
  // schaal berekenen
  const SCH = [
    // [van, naar, cm op de kaart, schaal (cm), soort]  soort: tabel | km | terug
    ["Brussel", "Madrid", 8.5, 15e6, "tabel"], ["Parijs", "Rome", 7.5, 15e6, "tabel"], ["Praag", "Athene", 10.5, 15e6, "tabel"], ["Berlijn", "Stockholm", 5.5, 15e6, "tabel"],
    ["Lissabon", "Barcelona", 6.5, 15e6, "km"], ["Londen", "Rome", 9.5, 15e6, "km"], ["Brussel", "Wenen", 6, 15e6, "km"], ["Amsterdam", "Warschau", 7, 15e6, "km"], ["Dublin", "Kopenhagen", 8, 15e6, "km"],
    ["Brussel", "Luxemburg", 4, 5e6, "km"], ["Brussel", "Amsterdam", 3.5, 5e6, "km"], ["Madrid", "Lissabon", 5, 10e6, "km"], ["Rome", "Boedapest", 4, 20e6, "km"], ["Oslo", "Helsinki", 4.5, 20e6, "km"],
    ["Parijs", "Berlijn", 0, 15e6, "terug", 900], ["Madrid", "Rome", 0, 15e6, "terug", 1350], ["Brussel", "Praag", 0, 15e6, "terug", 600], ["Wenen", "Bern", 0, 10e6, "terug", 700],
    [null, null, 1, 15e6, "een"], [null, null, 1, 5e6, "een"], [null, null, 1, 25e6, "een"], [null, null, 1, 2e6, "een"],
  ];
  const sch = (n) => `1 : ${fmt(n)}`;
  unit({
    id: "schaal", group: "A", label: "Schaal: werkelijke afstand berekenen", page: "9-10", tag: "schaal",
    rule: TAGS.schaal.advice,
    items: () => SCH.map((x, i) => ({ k: String(i), x })),
    gen(level, { x, k }) {
      const [van, naar, cm, n, soort, km0] = x, kmPerCm = n / 100000, key = `schaal:${k}`;
      const hint = level === "easy" ? `1 cm op de kaart = ${fmt(n)} cm = ${fmt(kmPerCm)} km` : "";
      if (soort === "een") {
        const q = base(this, { instruction: `De schaal van de kaart is <b>${sch(n)}</b>. Hoeveel km in werkelijkheid is 1 cm op de kaart?`, prompt: "", answerShown: `${fmt(kmPerCm)} km <small>(${fmt(n)} cm : 100 000)</small>`, key, itemLabel: `${sch(n)}: 1 cm = ${fmt(kmPerCm)} km` });
        if (level === "easy") return mc(q, `${fmt(kmPerCm)} km`, [`${fmt(kmPerCm * 10)} km`, `${fmt(kmPerCm / 10)} km`, `${fmt(n)} km`, `${fmt(kmPerCm * 100)} km`], level);
        return Object.assign(q, { mode: "num", unitSuffix: "km", chk: (g) => (eqNum(parseNum(g), kmPerCm) ? { status: "correct" } : { status: "wrong", tag: "schaal" }) });
      }
      if (soort === "terug") {
        const ans = km0 / kmPerCm;
        const q = base(this, { instruction: `De schaal is <b>${sch(n)}</b>. In werkelijkheid ligt ${esc(van)} ${fmt(km0)} km van ${esc(naar)}. Hoeveel cm is dat op de kaart?`, prompt: "", hint, answerShown: `${fmt(ans)} cm <small>(${fmt(km0)} km : ${fmt(kmPerCm)} km per cm)</small>`, key, itemLabel: `${van}–${naar}: ${fmt(km0)} km → ${fmt(ans)} cm` });
        return Object.assign(q, { mode: "num", unitSuffix: "cm", chk: (g) => (eqNum(parseNum(g), ans, 0.001) ? { status: "correct" } : { status: "wrong", tag: "schaal" }) });
      }
      const realCm = cm * n, km = cm * kmPerCm;
      const inst = `Bereken de werkelijke afstand tussen <b>${esc(van)}</b> en <b>${esc(naar)}</b>. Schaal <b>${sch(n)}</b>; op de kaart meet je <b>${fmt(cm)} cm</b>.`;
      const shown = `${fmt(realCm)} cm = <b>${fmt(km)} km</b> <small>(${fmt(cm)} × ${fmt(n)} cm, dan 5 nullen weg)</small>`;
      const q = base(this, { instruction: inst, prompt: "", hint, answerShown: shown, key, itemLabel: `${van}–${naar}: ${fmt(cm)} cm → ${fmt(km)} km` });
      if (soort === "tabel" && level !== "easy") return Object.assign(q, { mode: "fields", fields: [{ label: "werkelijkheid", suffix: "cm", num: true }, { label: "werkelijkheid", suffix: "km", num: true, short: true }],
        chk: (g) => { const a = eqNum(parseNum(g[0]), realCm), b = eqNum(parseNum(g[1]), km); return a && b ? { status: "correct" } : { status: "wrong", tag: "schaal", note: b ? "De km zijn juist, maar de cm niet." : a ? "De cm zijn juist; nu nog 5 nullen weg voor de km (: 100 000)." : "" }; } });
      if (level === "easy") return mc(q, `${fmt(km)} km`, [`${fmt(km * 10)} km`, `${fmt(km / 10)} km`, `${fmt(cm * 15)} km`, `${fmt(km + kmPerCm)} km`], level);
      return Object.assign(q, { mode: "num", unitSuffix: "km", chk: (g) => { const v = parseNum(g); return eqNum(v, km) ? { status: "correct" } : { status: "wrong", tag: "schaal", note: eqNum(v, realCm) ? "Dat zijn cm: zet om naar km (5 nullen weg)." : "" }; } });
    },
  });
  // bevolkingsdichtheid
  unit({
    id: "dichtheid", group: "A", label: "Bevolkingsdichtheid berekenen", page: "5, 11", tag: "dicht",
    rule: TAGS.dicht.advice,
    items: () => [{ k: "formule" }, { k: "eenheid" }, ...DICHT.map((x, i) => ({ k: String(i), x }))],
    gen(level, { k, x }) {
      const key = `dichtheid:${k}`;
      if (k === "formule") return mc(base(this, { instruction: "Hoe bereken je de bevolkingsdichtheid?", prompt: "bevolkingsdichtheid = …", answerShown: "aantal inwoners : oppervlakte (km²)", key, itemLabel: "formule bevolkingsdichtheid" }),
        "aantal inwoners : oppervlakte (km²)", ["oppervlakte (km²) : aantal inwoners", "aantal inwoners × oppervlakte (km²)", "aantal inwoners + oppervlakte (km²)"], level, 4);
      if (k === "eenheid") return mc(base(this, { instruction: "In welke eenheid druk je de bevolkingsdichtheid uit?", prompt: "", answerShown: "inwoners per km²", key, itemLabel: "eenheid bevolkingsdichtheid" }),
        "inwoners per km²", ["km² per inwoner", "inwoners per land", "km per inwoner"], level, 4);
      const [land, opp, d] = x, inw = opp * d;
      const q = base(this, { instruction: `<b>${esc(land)}</b> heeft ongeveer <b>${fmt(inw)}</b> inwoners en een oppervlakte van <b>${fmt(opp)} km²</b>. Bereken de bevolkingsdichtheid.`, prompt: "",
        hint: level === "easy" ? "aantal inwoners : oppervlakte" : "", answerShown: `${fmt(d)} inwoners per km² <small>(${fmt(inw)} : ${fmt(opp)})</small>`, key, itemLabel: `${land}: ${fmt(d)} inw./km²` });
      if (level === "easy") return mc(q, `${fmt(d)} inwoners per km²`, [`${fmt(d * 10)} inwoners per km²`, `${fmt(Math.round(d / 10) || 1)} inwoners per km²`, `${fmt(inw + opp)} inwoners per km²`], level);
      return Object.assign(q, { mode: "num", unitSuffix: "inw./km²", chk: (g) => { const v = parseNum(g); return v != null && Math.abs(v - d) <= 1 ? { status: "correct" } : { status: "wrong", tag: "dicht", note: v && Math.abs(v - opp / inw) < 0.01 ? "Omgekeerd gedeeld: inwoners : oppervlakte." : "" }; } });
    },
  });

  // ============================================================
  // TOETS
  // ============================================================
  function makeQuiz(s) {
    const units = UNITS.filter((u) => s.units.includes(u.id));
    const all = [];
    units.forEach((u) => u.items(s).forEach((it) => all.push([u, it])));
    let sel;
    if (s.count === "all") sel = all;
    else { sel = []; while (sel.length < s.count && all.length) sel.push(...shuffle(all).slice(0, s.count - sel.length)); }
    const qs = sel.map(([u, it]) => u.gen(s.level, it, s));
    return s.ordered ? qs : shuffle(qs);
  }
  const countAll = (s) => UNITS.filter((u) => s.units.includes(u.id)).reduce((a, u) => a + u.items(s).length, 0);
  const ALLSET = { landen: ["eu", "ext", "ander"] };
  function fromKey(key, level, s = {}) {
    const i = key.indexOf(":"), id = key.slice(0, i), k = key.slice(i + 1), u = UNITS.find((x) => x.id === id);
    if (!u) return null;
    const it = u.items(ALLSET).find((x) => x.k === k);
    return it ? u.gen(level, it, { ...ALLSET, ...s, landen: (s && s.landen) || ALLSET.landen }) : null;
  }
  function regen(q, level) { return fromKey(q.key, level) || q; }
  function check(given, q, level) {
    let r;
    if (q.mode === "mc") r = given === q.answer || (q.okAlso || []).includes(given) ? { status: "correct" } : { status: "wrong", tag: q.tag };
    else if (q.mode === "map") r = given === q.answer ? { status: "correct" } : { status: "wrong", tag: q.tag, note: q.hitNames && q.hitNames[given] ? `Jij duidde ${q.hitNames[given]} aan.` : "" };
    else r = q.chk(given, level);
    if (r.status !== "correct" && !r.tag) r.tag = q.tag || "fout";
    r.points = r.status === "correct" ? 1 : r.status === "spelling" ? (level === "hard" ? 0 : 1) : 0;
    if (r.status === "spelling" && level === "hard") r.strictNote = "(op 'Moeilijk' moet de spelling juist zijn)";
    return r;
  }
  function conclusions(results) {
    const out = [], total = results.length, pts = results.reduce((a, r) => a + r.points, 0), pct = total ? Math.round((pts / total) * 100) : 0;
    out.push(pct >= 90 ? { type: "good", text: `Super! ${pct}% juist.` } : pct >= 70 ? { type: "ok", text: `${pct}% juist: een goede basis, nog enkele werkpunten.` } : { type: "bad", text: `${pct}% juist: bekijk de bladen en de toetswijzer nog eens en oefen opnieuw.` });
    const tags = {};
    results.forEach((r) => { if (r.status !== "correct" && TAGS[r.tag] && r.tag !== "fout") tags[r.tag] = (tags[r.tag] || 0) + 1; });
    Object.entries(tags).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => { const g = TAGS[t]; out.push({ type: n >= 2 ? "bad" : "ok", text: `<b>${g.title}</b> (${n}×): ${g.advice}${g.page ? ` <small>blad ${g.page}</small>` : ""}` }); });
    return out;
  }

  // ============================================================
  // LEERKAARTEN – zelfde sleutels als de toetsvragen
  // ============================================================
  const KAART_UNITS = ["hoofdstad", "land_naam", "gebergte", "rivier", "begrip", "windroos"];
  function kaarten(s) {
    const sel = s && Array.isArray(s.units) ? s.units : KAART_UNITS, out = [];
    if (sel.includes("hoofdstad")) landSet(s).forEach((c) => out.push({ key: `hoofdstad:${c.id}`, unit: "hoofdstad", soort: "Hoofdstad", ask: "Wat is de hoofdstad?", front: esc(c.naam), back: esc(c.hoofdstad), info: c.soort === "eu" ? "lid van de EU" : "geen lid van de EU", page: "2", label: `${c.naam} – ${c.hoofdstad}` }));
    if (sel.includes("land_naam")) landSet(s).forEach((c) => out.push({ key: `land_naam:${c.id}`, unit: "land_naam", soort: "Blinde kaart", ask: "Welk land is aangeduid?", front: svgMap({ hl: c.id }), back: esc(c.naam), page: "2, 8", label: `kaart: ${c.naam}` }));
    const nat = (id, lijst, info, soort) => { if (sel.includes(id)) lijst.forEach((x) => out.push({ key: `${id}:naam-${x.id}`, unit: id, soort, ask: "Wat is dit?", front: svgMap({ [id === "rivier" ? "riv" : "geb"]: true, hl: x.id }), back: esc(x.naam), info: esc(info[x.id]), page: "11", label: `kaart: ${x.naam}` })); };
    nat("gebergte", K.gebergten, GEB_INFO, "Gebergte"); nat("rivier", K.rivieren, RIV_INFO, "Rivier");
    if (sel.includes("begrip")) BEGRIPPEN.forEach((b, i) => out.push({ key: `begrip:${i}`, unit: "begrip", soort: "Begrip", ask: "Wat betekent …?", front: esc(b.t), back: esc(b.d), page: b.p, label: b.t }));
    if (sel.includes("windroos")) WIND.forEach((w) => out.push({ key: `windroos:afk-${w.k}`, unit: "windroos", soort: "Windroos", ask: "Waarvoor staat …?", front: w.k, back: w.n, page: "6", label: `${w.k} = ${w.n}` }));
    return out;
  }

  Vakken.register({
    id: "wereldorientatie-5", vak: I.vak, icon: I.icon, theme: I.theme, titel: I.titel, klas: I.klas, bron: I.bron,
    groups: [
      { id: "K", short: "blinde kaart", titel: "Blinde kaart (zonder atlas): landen, hoofdsteden, gebergten, rivieren", p: "2, 8, 11" },
      { id: "B", short: "begrippen", titel: "Begrippen, reliëf, landelijk/stedelijk en water", p: "1, 3, 4, 7, 11" },
      { id: "A", short: "atlas", titel: "Werken met de atlas: kaartsoorten, windroos, schaal en bevolkingsdichtheid", p: "5, 6, 9, 10" },
    ],
    units: UNITS.map((u) => ({ id: u.id, group: u.group, label: u.label, page: u.page })),
    quick: [
      { label: "Alles", select: () => true },
      { label: "🗺️ Blinde kaart", select: (u) => u.group === "K" },
      { label: "🏙️ Hoofdsteden", select: (u) => /^hoofdstad/.test(u.id) },
      { label: "📖 Begrippen", select: (u) => u.group === "B" },
      { label: "🧭 Atlas en rekenen", select: (u) => u.group === "A" },
    ],
    settings: [
      { key: "landen", type: "checks", label: "Welke landen?", default: ["eu", "ext"],
        options: [{ v: "eu", label: "EU-lidstaten <small>(27)</small>" }, { v: "ext", label: "VK, Noorwegen, Zwitserland, Rusland" }, { v: "ander", label: "andere landen van Europa <small>(extra)</small>" }],
        hint: "Voor de toets: de 27 EU-landen + VK, Noorwegen, Zwitserland en Rusland (met hoofdsteden)." },
    ],
    describe: (s) => { const L = Array.isArray(s.landen) ? s.landen : ["eu", "ext"]; return `landen: ${L.length ? L.map((x) => SOORT_NAAM[x]).join(" + ") : "geen"} (${landSet(s).length})`; },
    levels: {
      easy: { title: "🙂 Makkelijk", desc: "meerkeuze en aantikken op de kaart" },
      normal: { title: "💪 Normaal", desc: "meerkeuze + soms zelf typen of rekenen; een kleine spelfout mag" },
      hard: { title: "🔥 Moeilijk", desc: "zelf typen en rekenen; de spelling moet juist zijn" },
    },
    allInfo: "<b>Eindtoets-modus:</b> elk land, elke hoofdstad, elk begrip en elke oefening uit de gekozen onderdelen komt precies één keer aan bod.",
    statusText: { spelling: "Bijna juist: let op de spelling." },
    tags: TAGS,
    makeQuiz, countAll, check, conclusions, regen, fromKey,
    // doorloop: sleutels in leerstofvolgorde zonder alle kaarten te tekenen
    doorloopKeys: (s) => UNITS.filter((u) => s.units.includes(u.id)).flatMap((u) => u.items(s).map((it) => [u.id, `${u.id}:${it.k}`])),
    kaarten, kaartUnits: KAART_UNITS,
    _UNITS: UNITS, _svgMap: svgMap, _richting: richting, _RICHT: RICHT,
  });
})();
