// ============================================================
// Store: voortgang lokaal in de browser (localStorage).
// Geen server, geen login. Per toestel/browser, per leerling-profiel.
//
// Structuur (versie 3; v1 had nog geen desc/mode/sel/meta, v2 nog geen studie):
// {
//   version: 1, active: "<profielId>",
//   profiles: {
//     "<id>": {
//       name, created,
//       prefs:    { "<vakId>": laatste instellingen },
//       sessions: [ { id, vak, date, level, count, isRetry, total, points, pct,
//                     units: { unitId: [ok, n] }, tags: { tag: n },
//                     mistakes: [ { unit, tag, item } ] } ],
//       items:    { "<vakId>": { "<key>": { ok, n, last, label, unit } } }
//       studie:   { cfg: { instellingen per leerling (zie core/studie.js DEFAULTS) },
//                   toetsen: [ { id, vak, naam, datum "JJJJ-MM-DD", sel: instellingen, created } ],
//                   kaarten: { "<vakId>": { "<key>": { b doos, d volgende, f eerst, l laatst, n, ok } } },
//                   log:     { "JJJJ-MM-DD": { n kaarten, sec, ok } },
//                   recent:  { "<vakId>": [1,0,1,…] laatste beoordelingen }, sec: gemeten s/kaart }
//     }
//   }
// }
// summary(vakId, level) vat dit samen voor het voortgangsscherm en
// (later) als compacte input voor AI-verbetersuggesties.
// ============================================================
(function () {
  "use strict";
  // ------------------------------------------------------------
  // BELANGRIJK voor nieuwe versies (zie docs/VAK-TOEVOEGEN.md, "Voortgang bewaren"):
  //  - KEY nooit wijzigen: alle bestaande voortgang staat onder deze sleutel.
  //  - Structuur veranderen? Verhoog VERSION en voeg een stap toe in MIGRATIONS.
  //    Oude gegevens worden dan omgezet, nooit weggegooid.
  //  - Voor elke migratie, en als de gegevens onleesbaar zijn, wordt eerst een
  //    reservekopie gemaakt (BACKUP_PREFIX + datum, de laatste 3 blijven bewaard).
  // ------------------------------------------------------------
  const KEY = "oefentoetsen-v1";             // naam is historisch; NIET wijzigen
  const VERSION = 3;                          // huidige structuurversie
  const ROLLING = "oefentoetsen-reserve";     // kopie van de vorige toestand (na elke toets bijgewerkt)
  const BACKUP_PREFIX = "oefentoetsen-backup-";
  const MAX_SESSIONS = 300, MAX_ITEMS = 800, MAX_MISTAKES = 25;
  const strip = (h) => String(h ?? "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
  const uid = () => Math.random().toString(36).slice(2, 9);

  // Migraties: van versie n naar n+1. Altijd gegevens behouden en aanvullen, nooit verwijderen.
  const MIGRATIONS = {
    // 1 → 2: velden die later bijkwamen (beschrijving, modus) krijgen een standaardwaarde
    1: (d) => {
      Object.values(d.profiles || {}).forEach((p) => {
        p.prefs = p.prefs || {}; p.items = p.items || {}; p.sessions = p.sessions || [];
        p.sessions.forEach((s) => { if (s.desc === undefined) s.desc = ""; if (s.mode === undefined) s.mode = ""; if (!s.sel) s.sel = Object.keys(s.units || {}); });
      });
      d.meta = d.meta || { created: new Date().toISOString(), lastExport: null };
      return d;
    },
    // 2 → 3: studiemodule (toetsen plannen, kaarten met herhaalschema)
    2: (d) => { Object.values(d.profiles || {}).forEach(ensure); return d; },
  };
  function ensure(p) {
    p.prefs = p.prefs || {}; p.items = p.items || {}; p.sessions = p.sessions || [];
    const s = (p.studie = p.studie || {});
    s.cfg = s.cfg || {}; s.toetsen = s.toetsen || []; s.kaarten = s.kaarten || {}; s.log = s.log || {}; s.recent = s.recent || {};
    return p;
  }

  const ls = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    keys: () => { try { return Object.keys(localStorage); } catch (e) { return []; } },
    del: (k) => { try { localStorage.removeItem(k); } catch (e) {} },
  };
  function backup(raw, reason) {
    if (!raw) return;
    ls.set(BACKUP_PREFIX + new Date().toISOString().replace(/[:.]/g, "-") + "-" + reason, raw);
    ls.keys().filter((k) => k.startsWith(BACKUP_PREFIX)).sort().slice(0, -3).forEach(ls.del); // laatste 3 houden
  }
  const parse = (raw) => { try { const d = JSON.parse(raw); return d && typeof d === "object" && d.profiles ? d : null; } catch (e) { return null; } };
  const hasData = (d) => d && Object.values(d.profiles || {}).some((p) => (p.sessions || []).length || (p.studie && ((p.studie.toetsen || []).length || Object.keys(p.studie.kaarten || {}).length)));

  let mem = null; // werkt ook als localStorage geblokkeerd is (dan enkel tijdens dit bezoek)
  function load() {
    if (mem) return mem;
    const raw = ls.get(KEY);
    let d = raw ? parse(raw) : null;
    if (raw && !d) backup(raw, "onleesbaar");           // onleesbaar: eerst bewaren, nooit stilzwijgend weg
    // hoofdgegevens weg of leeg, maar er is een reservekopie met toetsen: die terugzetten
    if (!hasData(d)) {
      const res = parse(ls.get(ROLLING) || "");
      if (hasData(res)) d = res;
    }
    if (d) {
      const v = d.version || 1;
      if (v < VERSION) {
        backup(raw, "voor-migratie-v" + v);
        for (let x = v; x < VERSION; x++) if (MIGRATIONS[x]) d = MIGRATIONS[x](d);
        d.version = VERSION;
      }
      // een nieuwere versie dan deze code kent (bv. oude cache): gegevens ongemoeid laten
      mem = d;
      if (!mem.profiles || !Object.keys(mem.profiles).length) { const id = uid(); mem.profiles = { [id]: newProfile("Ik") }; mem.active = id; }
      if (v !== mem.version || raw !== JSON.stringify(mem)) save(false);
      return mem;
    }
    // echt nieuw toestel
    const id = uid();
    mem = { version: VERSION, active: id, profiles: { [id]: newProfile("Ik") }, meta: { created: new Date().toISOString(), lastExport: null } };
    // instellingen van de oude losse apps overnemen (eenmalig)
    try {
      const fr = JSON.parse(ls.get("oefentoets-frans-settings") || "null");
      const wi = JSON.parse(ls.get("oefentoets-wiskunde-settings") || "null");
      if (fr) mem.profiles[id].prefs["frans-5a"] = fr;
      if (wi) mem.profiles[id].prefs["wiskunde-2-m01"] = wi;
    } catch (e) {}
    save(false);
    return mem;
  }
  // rolling = true: eerst de vorige toestand als reserve bewaren (na elke toets)
  function save(rolling = false) {
    const json = JSON.stringify(mem);
    if (rolling) { const prev = ls.get(KEY); if (prev && hasData(parse(prev))) ls.set(ROLLING, prev); }
    if (ls.set(KEY, json)) { notify(); return true; }
    // vol? oudste toetsen inkorten en opnieuw proberen (gegevens van andere profielen blijven)
    Object.values(mem.profiles).forEach((p) => { if (p.sessions.length > 100) p.sessions.splice(0, p.sessions.length - 100); p.sessions.forEach((s) => (s.mistakes = (s.mistakes || []).slice(0, 10))); });
    ls.del(ROLLING);
    const ok = ls.set(KEY, JSON.stringify(mem)); notify(); return ok;
  }
  // luisteraars (synchronisatie): na elke bewaring
  const listeners = [];
  function notify() { listeners.forEach((f) => { try { f(); } catch (e) {} }); }

  // ============================================================
  // SAMENVOEGEN (synchronisatie tussen toestellen)
  // Elk toestel houdt alles lokaal bij; bij het synchroniseren worden twee versies
  // samengevoegd zonder iets te verliezen. Volgorde maakt niet uit (a+b = b+a), dus
  // toestellen die afwisselend offline zijn, komen vanzelf op hetzelfde uit.
  //  - toetsen (sessies): unie op id          - kaarten en items: de laatst gebruikte versie
  //  - geplande toetsen: laatste wijziging     - verwijderd/gewist: via tijdstempels ("tombstones")
  // ============================================================
  const pick = (x, y) => (x === undefined ? y : y === undefined ? x : canonical(x) >= canonical(y) ? x : y); // vaste keuze, onafhankelijk van de volgorde
  const later = (a, b) => ((a || "") >= (b || "") ? a : b);
  const byLater = (x, y, f) => (!x ? y : !y ? x : (x[f] || "") > (y[f] || "") ? x : (x[f] || "") < (y[f] || "") ? y : JSON.stringify(x) >= JSON.stringify(y) ? x : y);
  function mergeProfile(a, b) {
    a = ensure(JSON.parse(JSON.stringify(a))); b = ensure(JSON.parse(JSON.stringify(b)));
    const cleared = later(a.clearedAt, b.clearedAt) || "";
    const p = {};
    [...new Set([...Object.keys(a), ...Object.keys(b)])].forEach((k) => (p[k] = pick(a[k], b[k])));
    if ((b.nameT || "") > (a.nameT || "")) { p.name = b.name; p.nameT = b.nameT; }
    p.created = [a.created, b.created].filter(Boolean).sort()[0];
    if (cleared) p.clearedAt = cleared;
    p.prefs = {};
    [...new Set([...Object.keys(a.prefs), ...Object.keys(b.prefs)])].sort().forEach((k) => (p.prefs[k] = pick(a.prefs[k], b.prefs[k])));
    if (a.name !== b.name && (a.nameT || "") === (b.nameT || "")) p.name = pick(a.name, b.name);
    const ses = {};
    [...b.sessions, ...a.sessions].forEach((x) => { if (!cleared || x.date > cleared) ses[x.id] = x; });
    p.sessions = Object.values(ses).sort((x, y) => (x.date + x.id < y.date + y.id ? -1 : 1)).slice(-MAX_SESSIONS);
    p.items = {};
    [...new Set([...Object.keys(a.items), ...Object.keys(b.items)])].sort().forEach((vak) => {
      const A = a.items[vak] || {}, B = b.items[vak] || {}, out = {};
      [...new Set([...Object.keys(A), ...Object.keys(B)])].sort().forEach((k) => { const e = byLater(A[k], B[k], "last"); if (!cleared || (e.last || "") > cleared) out[k] = e; });
      p.items[vak] = out;
    });
    const sa = a.studie, sb = b.studie, st = (p.studie = {});
    st.cfg = (sb.cfg._t || "") > (sa.cfg._t || "") ? sb.cfg : (sa.cfg._t || "") > (sb.cfg._t || "") ? sa.cfg : pick(sa.cfg, sb.cfg);
    st.del = { ...(sb.del || {}), ...(sa.del || {}) };
    Object.keys(sb.del || {}).forEach((k) => (st.del[k] = later(st.del[k], sb.del[k])));
    const tt = {};
    [...sb.toetsen, ...sa.toetsen].forEach((t) => { const e = byLater(tt[t.id], t, "upd"); tt[t.id] = e; });
    st.toetsen = Object.values(tt).filter((t) => !st.del[t.id]).sort((x, y) => (x.datum + x.id < y.datum + y.id ? -1 : 1));
    const cday = cleared ? cleared.slice(0, 10) : "";
    st.kaarten = {};
    [...new Set([...Object.keys(sa.kaarten), ...Object.keys(sb.kaarten)])].sort().forEach((vak) => {
      const A = sa.kaarten[vak] || {}, B = sb.kaarten[vak] || {}, out = {};
      [...new Set([...Object.keys(A), ...Object.keys(B)])].sort().forEach((k) => {
        let e = byLater(A[k], B[k], "l");
        if (A[k] && B[k] && A[k].l === B[k].l && (A[k].n || 0) !== (B[k].n || 0)) e = (A[k].n || 0) > (B[k].n || 0) ? A[k] : B[k];
        if (!cleared || (e.t ? e.t > cleared : (e.l || "") > cday)) out[k] = e;
      });
      st.kaarten[vak] = out;
    });
    st.log = {};
    [...new Set([...Object.keys(sa.log), ...Object.keys(sb.log)])].sort().forEach((d) => {
      const A = sa.log[d] || {}, B = sb.log[d] || {}, o = {};
      [...new Set([...Object.keys(A), ...Object.keys(B)])].forEach((f) => (o[f] = Math.max(A[f] || 0, B[f] || 0)));
      st.log[d] = o;
    });
    st.recent = {};
    [...new Set([...Object.keys(sa.recent), ...Object.keys(sb.recent)])].sort().forEach((k) => (st.recent[k] = pick(sa.recent[k], sb.recent[k])));
    if (sa.sec || sb.sec) st.sec = pick(sa.sec, sb.sec);
    const da = (sa.dt || {}).day || "", db = (sb.dt || {}).day || "";
    const dt = da === db ? pick(sa.dt, sb.dt) : da > db ? sa.dt : sb.dt;
    if (dt) st.dt = dt;
    return p;
  }
  const isEmptyProfile = (p) => !(p.sessions || []).length && !((p.studie || {}).toetsen || []).length && !Object.values((p.studie || {}).kaarten || {}).some((x) => Object.keys(x).length);
  // canonieke JSON (sleutels gesorteerd) om twee versies te vergelijken
  function canonical(o) {
    if (Array.isArray(o)) return "[" + o.map(canonical).join(",") + "]";
    if (o && typeof o === "object") return "{" + Object.keys(o).filter((k) => o[k] !== undefined).sort().map((k) => JSON.stringify(k) + ":" + canonical(o[k])).join(",") + "}";
    return JSON.stringify(o);
  }
  // vraag de browser om de gegevens niet zomaar op te ruimen (Chrome/Firefox/Edge; Safari beperkt)
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persisted().then((p) => { if (!p) navigator.storage.persist(); }); } catch (e) {}
  function newProfile(name) { return ensure({ name, created: new Date().toISOString(), prefs: {}, sessions: [], items: {} }); }
  const P = () => { const d = load(); if (!d.profiles[d.active]) d.active = Object.keys(d.profiles)[0]; return ensure(d.profiles[d.active]); };
  const S = () => P().studie;

  const Store = {
    // ---------- profielen ----------
    profiles: () => Object.entries(load().profiles).map(([id, p]) => ({ id, name: p.name })),
    activeId: () => (P(), load().active),
    activeName: () => P().name,
    setActive(id) { if (load().profiles[id]) { mem.active = id; save(); } },
    addProfile(name) { const id = uid(); load().profiles[id] = newProfile(name.trim() || "Leerling"); mem.active = id; save(); return id; },
    renameProfile(id, name) { const p = load().profiles[id]; if (p && name.trim()) { p.name = name.trim(); p.nameT = new Date().toISOString(); save(); } },
    deleteProfile(id) {
      const d = load(); backup(ls.get(KEY), "voor-verwijderen"); ls.del(ROLLING); delete d.profiles[id];
      d.tomb = d.tomb || {}; d.tomb[id] = new Date().toISOString(); // ook op gekoppelde toestellen verwijderen
      if (!Object.keys(d.profiles).length) { const n = uid(); d.profiles[n] = newProfile("Ik"); }
      if (!d.profiles[d.active]) d.active = Object.keys(d.profiles)[0];
      save();
    },

    // ---------- instellingen ----------
    getPrefs: (vak) => P().prefs[vak] || null,
    setPrefs(vak, s) { P().prefs[vak] = s; save(); },

    // ---------- resultaten bewaren ----------
    record(vak, settings, results) {
      if (!results.length) return;
      const p = P();
      const units = {}, tags = {};
      let points = 0;
      results.forEach((r) => {
        const u = (units[r.q.unit] = units[r.q.unit] || [0, 0]);
        u[0] += r.points; u[1]++; points += r.points;
        if (r.status !== "correct" && r.tag) tags[r.tag] = (tags[r.tag] || 0) + 1;
      });
      const date = new Date().toISOString();
      p.sessions.push({
        id: uid(), vak, date, level: settings.level, count: settings.count, isRetry: !!settings.isRetry, mode: settings.mode || "", plan: settings.plan || "",
        desc: settings.desc || "", sel: Array.isArray(settings.units) ? settings.units.slice(0, 40) : [],
        total: results.length, points, pct: Math.round((points / results.length) * 100), units, tags,
        mistakes: results.filter((r) => r.status !== "correct").slice(0, MAX_MISTAKES)
          .map((r) => ({ unit: r.q.unit, tag: r.tag || r.status, item: (r.q.itemLabel ? strip(r.q.itemLabel) : strip(r.q.prompt)).slice(0, 120) })),
      });
      if (p.sessions.length > MAX_SESSIONS) p.sessions.splice(0, p.sessions.length - MAX_SESSIONS);
      // per vraag/woord bijhouden (voor "blijft moeilijk")
      const items = (p.items[vak] = p.items[vak] || {});
      results.forEach((r) => {
        if (!r.q.key) return;
        const it = (items[r.q.key] = items[r.q.key] || { ok: 0, n: 0, label: "", unit: r.q.unit });
        it.n++; it.ok += r.points ? 1 : 0; it.last = date; it.lastOk = r.points > 0;
        it.label = (r.q.itemLabel ? strip(r.q.itemLabel) : strip(r.q.prompt) + " → " + strip(r.q.answerShown)).slice(0, 140);
      });
      const keys = Object.keys(items);
      if (keys.length > MAX_ITEMS) keys.sort((a, b) => (items[a].last < items[b].last ? -1 : 1)).slice(0, keys.length - MAX_ITEMS).forEach((k) => delete items[k]);
      save(true);
    },

    // alle bijgehouden vragen/woorden van een vak (voor de foutgerichte toets)
    items(vak) { return Object.entries(P().items[vak] || {}).map(([key, v]) => ({ key, ...v })); },
    // onderdelen waarin een bepaald fouttype voorkwam (uit de bewaarde fouten per toets)
    unitsForTags(vak, tags) {
      const out = {};
      P().sessions.filter((s) => s.vak === vak).forEach((s) => (s.mistakes || []).forEach((m) => { if (tags.includes(m.tag)) out[m.unit] = (out[m.unit] || 0) + 1; }));
      return out;
    },

    sessions(vak, level) {
      return P().sessions.filter((s) => (!vak || s.vak === vak) && (!level || level === "all" || s.level === level));
    },

    // ---------- samenvatting (voortgangsscherm + later AI) ----------
    summary(vak, level = "all") {
      const ss = Store.sessions(vak, level);
      const units = {}, tags = {};
      ss.forEach((s, i) => {
        Object.entries(s.units).forEach(([u, [ok, n]]) => { const x = (units[u] = units[u] || { ok: 0, n: 0, recent: [] }); x.ok += ok; x.n += n; x.recent.push(ok / n); });
        Object.entries(s.tags).forEach(([t, n]) => { const x = (tags[t] = tags[t] || { count: 0, sessions: 0, last: s.date }); x.count += n; x.sessions++; x.last = s.date; });
      });
      Object.values(units).forEach((u) => { u.pct = Math.round((u.ok / u.n) * 100); const r = u.recent.slice(-3); u.recentPct = Math.round((r.reduce((a, b) => a + b, 0) / r.length) * 100); delete u.recent; });
      const items = Object.entries(P().items[vak] || {}).map(([key, v]) => ({ key, ...v, pct: Math.round((v.ok / v.n) * 100) }));
      return {
        profiel: Store.activeName(), vak, level, tests: ss.length,
        lastDate: ss.length ? ss[ss.length - 1].date : null,
        avgPct: ss.length ? Math.round(ss.reduce((a, s) => a + s.pct, 0) / ss.length) : null,
        trend: ss.slice(-12).map((s) => ({ pct: s.pct, date: s.date, level: s.level })),
        units, tags,
        // per vraag/woord (over alle niveaus samen): wat blijft moeilijk?
        hardItems: items.filter((i) => i.n >= 2 && i.ok / i.n < 0.6).sort((a, b) => a.ok / a.n - b.ok / b.n || b.n - a.n).slice(0, 15),
      };
    },

    // ---------- export / import / wissen ----------
    exportProfile() {
      const d = load(); d.meta = d.meta || {}; d.meta.lastExport = new Date().toISOString(); save();
      return { app: "oefentoetsen", version: VERSION, exported: d.meta.lastExport, profile: d.profiles[d.active] };
    },
    // volledige reservekopie (alle leerlingen) als bestand
    exportAll() { const d = load(); d.meta = d.meta || {}; d.meta.lastExport = new Date().toISOString(); save(); return { app: "oefentoetsen", kind: "alles", version: VERSION, exported: d.meta.lastExport, data: d }; },
    importProfile(obj) {
      if (obj && obj.app === "oefentoetsen" && obj.kind === "alles" && obj.data && obj.data.profiles) {
        // alle leerlingen terugzetten: toevoegen naast wat er al is (niets overschrijven)
        backup(ls.get(KEY), "voor-import");
        let d = obj.data; for (let x = d.version || 1; x < VERSION; x++) if (MIGRATIONS[x]) d = MIGRATIONS[x](d);
        Object.values(d.profiles).forEach((p) => { load().profiles[uid()] = ensure(p); });
        save(); return mem.active;
      }
      if (!obj || obj.app !== "oefentoetsen" || !obj.profile || !Array.isArray(obj.profile.sessions)) throw new Error("Geen geldig voortgangsbestand.");
      let w = { profiles: { x: obj.profile } };
      for (let x = obj.version || 1; x < VERSION; x++) if (MIGRATIONS[x]) w = MIGRATIONS[x](w);
      const id = uid(); load().profiles[id] = ensure(w.profiles.x); mem.active = id; save(); return id;
    },
    lastExport: () => (load().meta || {}).lastExport || null,
    clearProgress() { backup(ls.get(KEY), "voor-wissen"); const p = P(); p.sessions = []; p.items = {}; p.studie.kaarten = {}; p.studie.log = {}; p.studie.recent = {}; p.clearedAt = new Date().toISOString(); save(); ls.del(ROLLING); },

    // ---------- studiemodule ----------
    studieCfg: () => S().cfg,
    setStudieCfg(c) { S().cfg = { ...S().cfg, ...c, _t: new Date().toISOString() }; save(); },
    toetsen: () => S().toetsen.slice().sort((a, b) => (a.datum < b.datum ? -1 : 1)),
    toets: (id) => S().toetsen.find((t) => t.id === id) || null,
    saveToets(t) {
      const list = S().toetsen, i = list.findIndex((x) => x.id === t.id);
      const upd = new Date().toISOString();
      if (i >= 0) list[i] = { ...list[i], ...t, upd }; else list.push({ id: uid(), created: upd, ...t, upd });
      save(true); return i >= 0 ? t.id : list[list.length - 1].id;
    },
    deleteToets(id) { backup(ls.get(KEY), "voor-toets-verwijderen"); const st = S(); st.toetsen = st.toetsen.filter((t) => t.id !== id); (st.del = st.del || {})[id] = new Date().toISOString(); save(); },
    kaarten: (vak) => (S().kaarten[vak] = S().kaarten[vak] || {}),
    // e = nieuwe toestand van een kaart; ok = beoordeling juist (voor de trefzekerheid)
    setKaart(vak, key, e, ok, sec) {
      const st = S(); (st.kaarten[vak] = st.kaarten[vak] || {})[key] = { ...e, t: new Date().toISOString() };
      if (ok !== undefined) { const r = (st.recent[vak] = st.recent[vak] || []); r.push(ok ? 1 : 0); if (r.length > 40) r.splice(0, r.length - 40); }
      if (sec) st.sec = st.sec ? Math.round((st.sec * 0.85 + Math.min(60, sec) * 0.15) * 10) / 10 : Math.min(60, sec);
      save();
    },
    recentAcc(vak) { const r = S().recent[vak] || []; return r.length >= 8 ? r.reduce((a, b) => a + b, 0) / r.length : null; },
    secPerKaart: () => S().sec || null,
    logDay(day, add) { const l = (S().log[day] = S().log[day] || { n: 0, sec: 0, ok: 0 }); Object.entries(add).forEach(([k, v]) => (l[k] = (l[k] || 0) + v)); save(); },
    log: () => S().log,
    // dagdoel nieuwe kaarten per toets: één keer per dag vastgelegd, zodat het niet verschuift tijdens het oefenen
    dayTarget(day, tid, val) { const st = S(); if (!st.dt || st.dt.day !== day) st.dt = { day, t: {} }; if (val === undefined) return st.dt.t[tid]; st.dt.t[tid] = val; save(); },
    meta(k, v) { const d = load(); d.meta = d.meta || {}; if (v === undefined) return d.meta[k]; d.meta[k] = v; save(); },
    commit: () => save(true), // na een studiesessie: reservekopie bijwerken

    // ---------- synchronisatie ----------
    onSave(f) { listeners.push(f); },
    canonical,
    // wat er gedeeld wordt tussen toestellen (niet: actieve leerling, toestelinstellingen)
    syncPayload() { const d = load(); return { app: "oefentoetsen", version: VERSION, profiles: d.profiles, tomb: d.tomb || {} }; },
    // gegevens van een ander toestel samenvoegen. join = eerste koppeling: leerlingen met dezelfde naam
    // worden één leerling, en een leeg standaardprofiel ("Ik") verdwijnt. Geeft { changed, newer } terug.
    mergeRemote(remote, join) {
      if (!remote || !remote.profiles) return { changed: false };
      if ((remote.version || 1) > VERSION) return { changed: false, newer: true }; // ander toestel heeft een nieuwere app-versie
      let r = JSON.parse(JSON.stringify(remote));
      for (let x = r.version || 1; x < VERSION; x++) if (MIGRATIONS[x]) r = MIGRATIONS[x](r);
      const d = load(), before = canonical(Store.syncPayload());
      const tomb = { ...(r.tomb || {}), ...(d.tomb || {}) };
      Object.keys(r.tomb || {}).forEach((k) => (tomb[k] = later(tomb[k], r.tomb[k])));
      const local = d.profiles, out = {};
      Object.entries(r.profiles).forEach(([id, p]) => { if (!tomb[id]) out[id] = ensure(p); });
      Object.entries(local).forEach(([id, p]) => {
        if (tomb[id]) return;
        if (out[id]) { out[id] = mergeProfile(p, out[id]); return; }
        if (join) {
          const same = Object.keys(out).find((k) => (out[k].name || "").trim().toLowerCase() === (p.name || "").trim().toLowerCase());
          if (same) { out[same] = mergeProfile(p, out[same]); if (d.active === id) d.active = same; return; }
          if (isEmptyProfile(p) && Object.keys(out).length) { if (d.active === id) d.active = null; return; }
        }
        out[id] = p;
      });
      if (!Object.keys(out).length) { const n = uid(); out[n] = newProfile("Ik"); }
      const changed = canonical({ app: "oefentoetsen", version: VERSION, profiles: out, tomb }) !== before;
      if (changed) { if (join) backup(ls.get(KEY), "voor-koppelen"); else ls.set("oefentoetsen-voor-sync", ls.get(KEY) || ""); d.profiles = out; d.tomb = tomb; }
      if (!d.active || !d.profiles[d.active]) d.active = Object.keys(d.profiles)[0];
      if (changed) save(false);
      return { changed };
    },
    _mergeProfile: mergeProfile, // voor tests
    strip,
  };
  window.Store = Store;
})();
