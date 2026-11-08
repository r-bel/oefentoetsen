// ============================================================
// Store: voortgang lokaal in de browser (localStorage).
// Geen server, geen login. Per toestel/browser, per leerling-profiel.
//
// Structuur (versie 2; versie 1 had nog geen desc/mode/sel/meta):
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
  const VERSION = 2;                          // huidige structuurversie
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
  };

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
  const hasData = (d) => d && Object.values(d.profiles || {}).some((p) => (p.sessions || []).length);

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
    if (ls.set(KEY, json)) return true;
    // vol? oudste toetsen inkorten en opnieuw proberen (gegevens van andere profielen blijven)
    Object.values(mem.profiles).forEach((p) => { if (p.sessions.length > 100) p.sessions.splice(0, p.sessions.length - 100); p.sessions.forEach((s) => (s.mistakes = (s.mistakes || []).slice(0, 10))); });
    ls.del(ROLLING);
    return ls.set(KEY, JSON.stringify(mem));
  }
  // vraag de browser om de gegevens niet zomaar op te ruimen (Chrome/Firefox/Edge; Safari beperkt)
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persisted().then((p) => { if (!p) navigator.storage.persist(); }); } catch (e) {}
  function newProfile(name) { return { name, created: new Date().toISOString(), prefs: {}, sessions: [], items: {} }; }
  const P = () => { const d = load(); if (!d.profiles[d.active]) d.active = Object.keys(d.profiles)[0]; return d.profiles[d.active]; };

  const Store = {
    // ---------- profielen ----------
    profiles: () => Object.entries(load().profiles).map(([id, p]) => ({ id, name: p.name })),
    activeId: () => (P(), load().active),
    activeName: () => P().name,
    setActive(id) { if (load().profiles[id]) { mem.active = id; save(); } },
    addProfile(name) { const id = uid(); load().profiles[id] = newProfile(name.trim() || "Leerling"); mem.active = id; save(); return id; },
    renameProfile(id, name) { const p = load().profiles[id]; if (p && name.trim()) { p.name = name.trim(); save(); } },
    deleteProfile(id) {
      const d = load(); backup(ls.get(KEY), "voor-verwijderen"); ls.del(ROLLING); delete d.profiles[id];
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
        id: uid(), vak, date, level: settings.level, count: settings.count, isRetry: !!settings.isRetry, mode: settings.mode || "",
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
        Object.values(d.profiles).forEach((p) => { load().profiles[uid()] = p; });
        save(); return mem.active;
      }
      if (!obj || obj.app !== "oefentoetsen" || !obj.profile || !Array.isArray(obj.profile.sessions)) throw new Error("Geen geldig voortgangsbestand.");
      let p = obj.profile;
      if ((obj.version || 1) < VERSION) p = MIGRATIONS[1]({ profiles: { x: p } }).profiles.x;
      const id = uid(); load().profiles[id] = p; mem.active = id; save(); return id;
    },
    lastExport: () => (load().meta || {}).lastExport || null,
    clearProgress() { backup(ls.get(KEY), "voor-wissen"); const p = P(); p.sessions = []; p.items = {}; save(); ls.del(ROLLING); },
    strip,
  };
  window.Store = Store;
})();
