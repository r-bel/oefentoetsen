// ============================================================
// Synchronisatie tussen toestellen – zonder account, met een synccode.
//
//  - Eén code per gezin (bv. "K7QM-2XPA-…", 80 bits). Wie de code heeft, kan meedoen.
//  - Uit de code worden twee dingen afgeleid: een opslag-id (SHA-256) en een sleutel (PBKDF2).
//    De server ziet enkel het id en een versleuteld pakket (AES-GCM): geen namen, geen scores.
//  - Elk toestel houdt alles lokaal; bij het synchroniseren worden de versies samengevoegd
//    (Store.mergeRemote). Offline werken kan dus gewoon; de volgende keer wordt alles samengelegd.
//  - De server is een kleine Cloudflare Worker (map worker/). Adres in config.js (syncUrl);
//    leeg = synchronisatie verborgen.
// ============================================================
(function () {
  "use strict";
  const KEY = "oefentoetsen-sync";
  const ALPH = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // geen 0/O, 1/I
  const cfgUrl = () => (window.__SYNC_URL || (window.APP_CONFIG || {}).syncUrl || "").replace(/\/+$/, "");
  const supported = () => !!(window.crypto && crypto.subtle && window.fetch && window.TextEncoder);
  const enc = new TextEncoder(), dec = new TextDecoder();
  const b64 = (buf) => { let s = ""; const a = new Uint8Array(buf); for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); };
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const hex = (buf) => [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, "0")).join("");

  // ---------- toestand op dit toestel (niet mee in reservekopieën) ----------
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } };
  const put = (o) => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} };

  // ---------- code ----------
  function newCode() {
    const r = crypto.getRandomValues(new Uint8Array(16));
    const s = [...r].map((x) => ALPH[x % 32]).join("");
    return s.match(/.{4}/g).join("-");
  }
  function normCode(c) {
    const t = [...String(c || "").toUpperCase()].filter((ch) => ALPH.includes(ch)).join("");
    return t.length === 16 ? t.match(/.{4}/g).join("-") : null;
  }

  // ---------- versleuteling ----------
  const keyCache = {};
  async function keys(code) {
    if (keyCache[code]) return keyCache[code];
    const raw = enc.encode(code.replace(/-/g, ""));
    const id = hex(await crypto.subtle.digest("SHA-256", enc.encode("oefentoetsen-id:" + code.replace(/-/g, ""))));
    const base = await crypto.subtle.importKey("raw", raw, "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: enc.encode("oefentoetsen-sync-v1"), iterations: 150000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    return (keyCache[code] = { id, key });
  }
  async function gz(bytes, mode) {
    const s = new Blob([bytes]).stream().pipeThrough(mode === "c" ? new CompressionStream("gzip") : new DecompressionStream("gzip"));
    return new Uint8Array(await new Response(s).arrayBuffer());
  }
  async function encrypt(obj, key) {
    let data = enc.encode(JSON.stringify(obj)), z = 0;
    if (window.CompressionStream) { try { data = await gz(data, "c"); z = 1; } catch (e) {} }
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
    return JSON.stringify({ f: 1, z, iv: b64(iv), ct: b64(ct), t: new Date().toISOString() });
  }
  async function decrypt(text, key) {
    const o = JSON.parse(text);
    let data = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(o.iv) }, key, unb64(o.ct)));
    if (o.z) data = await gz(data, "d");
    return JSON.parse(dec.decode(data));
  }

  // ---------- status ----------
  let status = "uit", busy = false, timer = null, applying = false, lastError = "";
  const listeners = [];
  function setStatus(s, err) { status = s; lastError = err || ""; listeners.forEach((f) => { try { f(status); } catch (e) {} }); badge(); }
  function badge() {
    const b = document.getElementById("syncBadge");
    if (!b) return;
    const st = get();
    b.classList.toggle("hidden", !st.code || !cfgUrl());
    const map = { ok: ["☁️✓", "Gesynchroniseerd"], bezig: ["☁️…", "Bezig met synchroniseren"], offline: ["☁️⏸", "Offline: wordt later gesynchroniseerd"], fout: ["☁️!", "Synchronisatie mislukt"], nieuwer: ["☁️⬆", "Een ander toestel heeft een nieuwere versie van de app: herlaad de pagina"], uit: ["☁️", ""] };
    const [txt, title] = map[status] || map.uit;
    b.textContent = txt; b.title = title + (st.last ? ` · laatst ${new Date(st.last).toLocaleString("nl-BE")}` : "");
  }

  // ---------- één synchronisatieronde: ophalen → samenvoegen → (indien nodig) opsturen ----------
  async function syncNow(opts = {}) {
    const st = get(), url = cfgUrl();
    if (!st.code || !url || !supported()) return { ok: false };
    if (busy) { schedule(1500); return { ok: false, busy: true }; }
    busy = true; setStatus("bezig");
    try {
      const { id, key } = await keys(st.code);
      const r = await fetch(`${url}/s/${id}`, { cache: "no-store" });
      if (!r.ok && r.status !== 404) throw new Error("server " + r.status); // 204/404 = nog niets online
      let remote = null, changed = false;
      if (r.status === 200) remote = await decrypt(await r.text(), key);
      if (remote) {
        applying = true;
        const m = Store.mergeRemote(remote, opts.join || !st.joined);
        applying = false;
        if (m.newer) { busy = false; setStatus("nieuwer"); return { ok: false, newer: true }; }
        changed = m.changed;
      }
      const mine = Store.syncPayload();
      if (!remote || Store.canonical(mine) !== Store.canonical(remote)) {
        const body = await encrypt(mine, key);
        const w = await fetch(`${url}/s/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body });
        if (!w.ok) throw new Error("server " + w.status);
      }
      put({ ...get(), joined: true, last: new Date().toISOString() });
      busy = false; setStatus("ok");
      if (changed) window.dispatchEvent(new CustomEvent("oefentoetsen-sync", { detail: { changed } }));
      return { ok: true, changed, pushed: true };
    } catch (e) {
      applying = false; busy = false;
      const off = !navigator.onLine || e instanceof TypeError;
      setStatus(off ? "offline" : "fout", e.message || String(e));
      return { ok: false, error: e.message };
    }
  }
  function schedule(ms = 4000) { clearTimeout(timer); timer = setTimeout(() => syncNow(), ms); }

  // ---------- koppelen / ontkoppelen ----------
  async function link(code) {
    const c = normCode(code);
    if (!c) throw new Error("Ongeldige code");
    put({ code: c, joined: false });
    const r = await syncNow({ join: true });
    if (!r.ok && !r.busy) { if (r.newer) return r; put({}); setStatus("uit"); throw new Error(r.error || "Synchronisatie mislukt"); }
    return r;
  }
  function unlink() { put({}); setStatus("uit"); }
  async function wipeOnline() {
    const st = get(); if (!st.code) return;
    const { id } = await keys(st.code);
    await fetch(`${cfgUrl()}/s/${id}`, { method: "DELETE" });
  }
  const linkUrl = (code) => location.origin + location.pathname + "#koppel/" + code;

  // ---------- QR-code (bibliotheek pas laden als ze nodig is) ----------
  function qrSvg(text) {
    return new Promise((resolve) => {
      const make = () => { try { const q = window.qrcode(0, "M"); q.addData(text); q.make(); resolve(q.createSvgTag({ cellSize: 4, margin: 2, scalable: true })); } catch (e) { resolve(""); } };
      if (window.qrcode) return make();
      const s = document.createElement("script");
      s.src = "js/lib/qrcode.js"; s.onload = make; s.onerror = () => resolve("");
      document.head.appendChild(s);
    });
  }

  // ---------- paneel in de studie-instellingen ----------
  function renderPanel(el, ui) {
    if (!el) return;
    if (!cfgUrl() || !supported()) { el.innerHTML = ""; return; }
    const st = get(), esc = ui.esc;
    if (!st.code) {
      el.innerHTML = `<div class="section-label">Toestellen koppelen</div>
        <p class="muted small">Oefent je kind op meer dan één toestel (gsm, tablet, laptop)? Koppel ze met een synccode: dan staan de voortgang, de planning en de kaarten overal. Geen account nodig; alles wordt versleuteld met de code voordat het verstuurd wordt.</p>
        <div class="actions left"><button type="button" class="primary" id="syNew">☁️ Nieuwe synccode maken</button><button type="button" id="syHave">Ik heb al een code</button></div>
        <form id="syJoin" class="planform hidden"><label>Synccode <input id="syCode" class="answer" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="XXXX-XXXX-XXXX-XXXX"></label>
          <div class="actions left"><button type="submit" class="primary">Koppel dit toestel</button></div><div id="syMsg" class="muted small"></div></form>`;
      el.querySelector("#syNew").addEventListener("click", async (e) => {
        e.currentTarget.disabled = true;
        try { await link(newCode()); ui.toast("Synccode gemaakt. Koppel nu je andere toestellen met de code of de QR-code."); } catch (err) { ui.toast("Kon de server niet bereiken: " + err.message); }
        renderPanel(el, ui);
      });
      el.querySelector("#syHave").addEventListener("click", () => { el.querySelector("#syJoin").classList.remove("hidden"); el.querySelector("#syCode").focus(); });
      el.querySelector("#syJoin").addEventListener("submit", async (e) => {
        e.preventDefault();
        const c = normCode(el.querySelector("#syCode").value);
        if (!c) { el.querySelector("#syMsg").textContent = "Een code heeft 16 tekens, bv. K7QM-2XPA-9RTB-HC4W."; return; }
        el.querySelector("#syMsg").textContent = "Bezig met koppelen…";
        try { await link(c); ui.afterLink(); } catch (err) { el.querySelector("#syMsg").textContent = "Koppelen mislukt: " + err.message; }
      });
      return;
    }
    el.innerHTML = `<div class="section-label">Toestellen koppelen</div>
      <div class="syncbox"><div class="syqr" id="syQr"></div><div class="syinfo">
        <p class="small">☁️ Dit toestel is gekoppeld. Open op een ander toestel de link of scan de QR-code, of geef daar de code in bij <i>Ik heb al een code</i>.</p>
        <p class="sycode"><span id="syCodeTxt">••••-••••-••••-${esc(st.code.slice(-4))}</span> <button type="button" class="small ghost" id="syShow">toon</button></p>
        <div class="actions left"><button type="button" class="small" id="syCopy">🔗 Kopieer link</button>${navigator.share ? `<button type="button" class="small" id="syShare">Delen…</button>` : ""}<button type="button" class="small" id="syNow">↻ Nu synchroniseren</button></div>
        <p class="muted small" id="syStatus"></p></div></div>
      <p class="muted small">Wie de code heeft, kan de voortgang zien en aanpassen: deel hem enkel binnen het gezin. Op de server staat enkel een versleuteld pakket.</p>
      <div class="actions left"><button type="button" class="small ghost" id="syUnlink">Ontkoppel dit toestel</button><button type="button" class="small ghost" id="syWipe">Online kopie wissen</button></div>`;
    const url = linkUrl(st.code);
    const showStatus = () => { const s = get(); const t = { ok: "Gesynchroniseerd", bezig: "Bezig…", offline: "Offline: wordt later gesynchroniseerd", fout: "Mislukt: " + lastError, nieuwer: "Een ander toestel heeft een nieuwere app-versie: herlaad de pagina", uit: "" }[status] || ""; const n = el.querySelector("#syStatus"); if (n) n.textContent = [t, s.last ? "laatst " + new Date(s.last).toLocaleString("nl-BE", { dateStyle: "short", timeStyle: "short" }) : ""].filter(Boolean).join(" · "); };
    showStatus(); listeners.push(showStatus);
    qrSvg(url).then((svg) => { const q = el.querySelector("#syQr"); if (q) q.innerHTML = svg; });
    el.querySelector("#syShow").addEventListener("click", (e) => { el.querySelector("#syCodeTxt").textContent = st.code; e.currentTarget.remove(); });
    el.querySelector("#syCopy").addEventListener("click", async () => { try { await navigator.clipboard.writeText(url); ui.toast("Link gekopieerd."); } catch (e) { prompt("Kopieer deze link:", url); } });
    if (el.querySelector("#syShare")) el.querySelector("#syShare").addEventListener("click", () => navigator.share({ title: "Oefentoetsen koppelen", text: "Open deze link om dit toestel te koppelen aan onze oefentoetsen:", url }).catch(() => {}));
    el.querySelector("#syNow").addEventListener("click", () => syncNow());
    const arm = (b, txt, fn) => b.addEventListener("click", () => { if (!b.dataset.armed) { b.dataset.armed = "1"; const o = b.textContent; b.textContent = txt; setTimeout(() => { delete b.dataset.armed; b.textContent = o; }, 4000); return; } fn(); });
    arm(el.querySelector("#syUnlink"), "Zeker? Klik nogmaals", () => { unlink(); ui.toast("Ontkoppeld. De gegevens blijven op dit toestel."); renderPanel(el, ui); });
    arm(el.querySelector("#syWipe"), "Wist de online kopie voor alle toestellen – klik nogmaals", async () => { try { await wipeOnline(); unlink(); ui.toast("Online kopie gewist en dit toestel ontkoppeld. Andere gekoppelde toestellen zetten hun gegevens terug online zolang ze gekoppeld blijven."); } catch (e) { ui.toast("Wissen mislukt."); } renderPanel(el, ui); });
  }

  // ---------- opstarten ----------
  function init() {
    if (!supported()) return;
    Store.onSave(() => { if (!applying && get().code) schedule(); });
    window.addEventListener("online", () => get().code && schedule(500));
    document.addEventListener("visibilitychange", () => {
      if (!get().code) return;
      if (document.visibilityState === "visible") { const l = get().last; if (!l || Date.now() - new Date(l).getTime() > 30e3) schedule(300); }
      else if (timer) { clearTimeout(timer); syncNow(); } // nog niet verstuurde wijzigingen meteen sturen
    });
    if (get().code) schedule(800);
    badge();
  }
  window.Sync = { init, syncNow, link, unlink, newCode, normCode, renderPanel, linked: () => !!get().code, enabled: () => !!cfgUrl() && supported(), status: () => status, onStatus: (f) => listeners.push(f), _keys: keys, _encrypt: encrypt, _decrypt: decrypt };
})();
