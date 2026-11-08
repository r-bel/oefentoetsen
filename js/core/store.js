// ============================================================
// Store: voortgang lokaal in de browser (localStorage).
// Geen server, geen login. Per toestel/browser, per leerling-profiel.
//
// Structuur (versie 1):
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
  const KEY = "oefentoetsen-v1";
  const MAX_SESSIONS = 300, MAX_ITEMS = 800, MAX_MISTAKES = 25;
  const strip = (h) => String(h ?? "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
  const uid = () => Math.random().toString(36).slice(2, 9);

  let mem = null; // ook bruikbaar als localStorage geblokkeerd is
  function load() {
    if (mem) return mem;
    try { mem = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { mem = null; }
    if (!mem || mem.version !== 1) {
      const id = uid();
      mem = { version: 1, active: id, profiles: { [id]: newProfile("Ik") } };
      // instellingen van de oude losse apps overnemen (eenmalig)
      try {
        const fr = JSON.parse(localStorage.getItem("oefentoets-frans-settings") || "null");
        const wi = JSON.parse(localStorage.getItem("oefentoets-wiskunde-settings") || "null");
        if (fr) mem.profiles[id].prefs["frans-5a"] = fr;
        if (wi) mem.profiles[id].prefs["wiskunde-2-m01"] = wi;
      } catch (e) {}
      save();
    }
    return mem;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(mem)); return true; } catch (e) { return false; } }
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
      const d = load(); delete d.profiles[id];
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
      save();
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
    exportProfile() { const d = load(); return { app: "oefentoetsen", version: 1, exported: new Date().toISOString(), profile: d.profiles[d.active] }; },
    importProfile(obj) {
      if (!obj || obj.app !== "oefentoetsen" || !obj.profile || !Array.isArray(obj.profile.sessions)) throw new Error("Geen geldig voortgangsbestand.");
      const id = uid(); load().profiles[id] = obj.profile; mem.active = id; save(); return id;
    },
    clearProgress() { const p = P(); p.sessions = []; p.items = {}; save(); },
    strip,
  };
  window.Store = Store;
})();
