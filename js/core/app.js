// ============================================================
// Gedeelde interface voor alle vakken:
// hoofdmenu (vakken) → instellingen → toets → resultaat, en "Mijn voortgang".
// Bevat geen vak-specifieke kennis: alles komt uit de vakmodules.
// ============================================================
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const cfg = window.APP_CONFIG || {};
  const LEVEL_NAME = { easy: "makkelijk", normal: "normaal", hard: "moeilijk" };
  const fmtDate = (iso) => { const d = new Date(iso); return d.toLocaleDateString("nl-BE", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" }); };
  const toast = (msg) => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 3200); };
  // paginaverwijzing: "p.12" bij een getal, anders de tekst zelf (bv. "§3.4 · nr. 370")
  const pg = (x) => (x === undefined || x === null || x === "" ? "" : /^\d/.test(String(x)) ? "p." + esc(x) : esc(x));
  const groupOf = (vak, id) => vak.groups.find((g) => g.id === id) || { id, short: id, titel: id };

  let vak = null;     // actief vak
  let state = null;   // lopende toets
  window.__oefState = () => state; // voor automatische tests

  // ============================================================
  // SCHERMEN & ROUTER (#/ = menu, #v/<id> = vak, #voortgang[/<id>])
  // ============================================================
  function show(id) {
    $$(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
    $("#stopBtn").classList.toggle("hidden", id !== "screen-quiz");
    $("#homeLink").classList.toggle("hidden", id === "screen-home");
    window.scrollTo(0, 0);
  }
  function setTheme(theme) { document.body.dataset.theme = theme || "indigo"; }
  function route() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    if (h.startsWith("v/") && Vakken.get(h.slice(2))) return openSetup(Vakken.get(h.slice(2)));
    if (h.startsWith("voortgang")) return openProgress(h.split("/")[1]);
    openHome();
  }
  window.addEventListener("hashchange", route);

  // ============================================================
  // PROFIEL (leerling) – lokaal, geen login
  // ============================================================
  function renderProfile() {
    const sel = $("#profileSel");
    sel.innerHTML = Store.profiles().map((p) => `<option value="${p.id}" ${p.id === Store.activeId() ? "selected" : ""}>${esc(p.name)}</option>`).join("") +
      `<option value="__new">+ Nieuwe leerling…</option><option value="__rename">✎ Naam wijzigen…</option>`;
  }
  $("#profileSel").addEventListener("change", (e) => {
    const v = e.target.value;
    if (v === "__new" || v === "__rename") {
      $("#profileForm").classList.remove("hidden");
      $("#profileForm").dataset.mode = v;
      $("#profileName").value = v === "__rename" ? Store.activeName() : "";
      $("#profileName").placeholder = v === "__new" ? "Naam van de leerling" : "Nieuwe naam";
      $("#profileName").focus();
      renderProfile();
      return;
    }
    Store.setActive(v); renderProfile(); route();
  });
  $("#profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#profileName").value.trim();
    if (name) {
      if ($("#profileForm").dataset.mode === "__rename") Store.renameProfile(Store.activeId(), name);
      else Store.addProfile(name);
    }
    $("#profileForm").classList.add("hidden");
    renderProfile(); route();
  });
  $("#profileCancel").addEventListener("click", () => $("#profileForm").classList.add("hidden"));

  // ============================================================
  // HOOFDMENU: vakken
  // ============================================================
  function openHome() {
    vak = null; setTheme("indigo");
    document.title = cfg.titel || "Oefentoetsen";
    const byVak = {};
    Vakken.list.forEach((v) => (byVak[v.vak] = byVak[v.vak] || []).push(v));
    $("#vakList").innerHTML = Object.entries(byVak).map(([naam, mods]) => `
      <div class="vakgroup"><h2>${esc(naam)}</h2><div class="vakcards">` + mods.map((m) => {
        const ss = Store.sessions(m.id);
        const last = ss[ss.length - 1];
        return `<a class="vakcard theme-${m.theme}" href="#v/${m.id}">
          <span class="vakicon">${m.icon}</span>
          <span class="vakbody"><b>${esc(m.titel)}</b><small>${esc(m.klas)} · ${esc(m.bron)}</small>
          <span class="vakstat">${ss.length ? `${ss.length} ${ss.length === 1 ? "toets" : "toetsen"} · laatste ${last.pct}%` : "nog niet geoefend"}</span></span>
          <span class="vakgo">›</span></a>`;
      }).join("") + `</div></div>`).join("");
    $("#homeProgressBtn").classList.toggle("hidden", !Store.sessions().length);
    show("screen-home");
    Analytics.page("/", "Menu");
  }

  // ============================================================
  // INSTELLINGEN per vak (opgebouwd uit de vakmodule)
  // ============================================================
  function openSetup(v, preset) {
    vak = v; setTheme(v.theme);
    document.title = `${v.vak} – ${v.titel}`;
    $("#setupIcon").textContent = v.icon;
    $("#setupVak").textContent = `${v.vak} · ${v.klas}`;
    $("#setupTitle").textContent = v.titel;
    $("#setupBron").textContent = v.bron;
    let n = 1;
    const sec = (label, inner, extra = "") => `<div class="section-label">${n++}. ${label}</div>${inner}${extra}`;
    // 1. onderdelen
    const quick = `<div class="quick">${(v.quick || []).map((q, i) => `<button type="button" class="chipbtn" data-quick="${i}">${q.label}</button>`).join("")}<button type="button" class="chipbtn" data-quick="none">Niets</button></div>`;
    const tree = `<div id="unitTree" class="tree">` + v.groups.map((g) => {
      const items = v.units.filter((u) => u.group === g.id);
      if (!items.length) return "";
      const kinds = v.kinds ? Object.keys(v.kinds) : [null];
      const block = (list, title) => !list.length ? "" : `<div class="kindgroup">${title ? `<div class="kindtitle">${esc(title)}</div>` : ""}` + list.map((u) =>
        `<label class="unit"><input type="checkbox" class="unit-cb" data-group="${g.id}" value="${u.id}" ${u.defaultOn !== false ? "checked" : ""}> ${esc(u.label)} <small>${pg(u.page)}</small></label>`).join("") + `</div>`;
      const body = kinds.map((k) => block(items.filter((u) => !k || u.kind === k), k && v.kinds[k])).join("");
      return `<details class="mission" open><summary><label><input type="checkbox" class="mission-cb" data-group="${g.id}"> ${esc(g.titel)} ${g.p ? `<small class="muted">${pg(g.p)}</small>` : ""}</label></summary><div class="kinds ${kinds.length > 1 ? "" : "single"}">${body}</div></details>`;
    }).join("") + `</div>`;
    let html = sec("Wat wil je oefenen?", quick + tree);
    // extra instellingen van het vak (bv. richting bij talen)
    (v.settings || []).forEach((s) => {
      if (s.type === "radio") html += sec(s.label, `<div class="seg seg${s.options.length}">${s.options.map((o) => `<label><input type="radio" name="x-${s.key}" value="${o.v}" ${o.v === s.default ? "checked" : ""}><span>${o.label}</span></label>`).join("")}</div>`);
      // bereik: "van nr. … tot nr. …" met snelkeuzes (bv. per paragraaf)
      if (s.type === "range") html += sec(s.label, `<div class="rangebox"><label>van nr. <input type="number" id="x-${s.key}-from" class="answer rangeinp" min="${s.min}" max="${s.max}" value="${s.default[0]}" inputmode="numeric"></label>
        <label>tot nr. <input type="number" id="x-${s.key}-to" class="answer rangeinp" min="${s.min}" max="${s.max}" value="${s.default[1]}" inputmode="numeric"></label></div>` +
        (s.presets ? `<div class="quick rangepresets">${s.presets.map((p, i) => `<button type="button" class="chipbtn" data-range="${s.key}" data-i="${i}">${p.label} <small>${p.v[0]}–${p.v[1]}</small></button>`).join("")}</div>` : "") +
        (s.hint ? `<div class="muted small">${s.hint}</div>` : ""));
    });
    html += sec("Moeilijkheid", `<div class="seg seg3 tall">${["easy", "normal", "hard"].map((l) => `<label><input type="radio" name="level" value="${l}" ${l === "normal" ? "checked" : ""}><span><b>${v.levels[l].title}</b><small>${v.levels[l].desc}</small></span></label>`).join("")}</div>`);
    html += sec("Aantal vragen", `<div class="seg seg5">${["10", "20", "30", "50"].map((c) => `<label><input type="radio" name="count" value="${c}" ${c === "20" ? "checked" : ""}><span>${c}</span></label>`).join("")}<label><input type="radio" name="count" value="all"><span>Alle 🎯</span></label></div>`,
      `<div id="allInfo" class="allinfo hidden"><div>${v.allInfo || "<b>Eindtoets-modus:</b> alle leerstof van de gekozen onderdelen komt aan bod."}</div>` +
      (v.settings || []).filter((s) => s.type === "checkbox").map((s) => `<label class="check" data-cb="${s.key}"><input type="checkbox" id="x-${s.key}" ${s.default ? "checked" : ""}> ${s.label}</label>`).join("") + `</div>`);
    $("#setupBody").innerHTML = html;

    $$(".mission-cb").forEach((cb) => cb.addEventListener("change", () => { $$(`.unit-cb[data-group="${cb.dataset.group}"]`).forEach((u) => (u.checked = cb.checked)); sync(); }));
    $$(".rangeinp").forEach((el) => el.addEventListener("input", sync));
    $$("[data-range]").forEach((b) => b.addEventListener("click", () => {
      const st = v.settings.find((x) => x.key === b.dataset.range), p = st.presets[+b.dataset.i];
      $(`#x-${st.key}-from`).value = p.v[0]; $(`#x-${st.key}-to`).value = p.v[1]; sync();
    }));
    $$(".unit-cb, #setupBody input[type=radio], #setupBody input[type=checkbox]").forEach((el) => el.addEventListener("change", sync));
    $$("[data-quick]").forEach((b) => b.addEventListener("click", () => {
      const q = b.dataset.quick === "none" ? null : v.quick[+b.dataset.quick];
      $$(".unit-cb").forEach((cb) => (cb.checked = q ? !!q.select(v.units.find((u) => u.id === cb.value)) : false));
      sync();
    }));
    applySettings(preset || Store.getPrefs(v.id));
    sync();
    show("screen-setup");
    Analytics.page("/v/" + v.id, v.vak + " – " + v.titel);
  }
  function readSettings() {
    const s = {
      units: $$(".unit-cb:checked").map((c) => c.value),
      level: $('input[name="level"]:checked').value,
      count: ((x) => (x === "all" ? "all" : +x))($('input[name="count"]:checked').value),
    };
    (vak.settings || []).forEach((x) => {
      if (x.type === "radio") s[x.key] = $(`input[name="x-${x.key}"]:checked`).value;
      else if (x.type === "range") {
        let a = parseInt($(`#x-${x.key}-from`).value, 10), b = parseInt($(`#x-${x.key}-to`).value, 10);
        if (isNaN(a)) a = x.min; if (isNaN(b)) b = x.max;
        if (a > b) [a, b] = [b, a];
        s[x.key] = [Math.max(x.min, a), Math.min(x.max, b)];
      } else s[x.key] = $(`#x-${x.key}`).checked;
    });
    return s;
  }
  function applySettings(s) {
    if (!s) return;
    if (Array.isArray(s.units)) $$(".unit-cb").forEach((c) => (c.checked = s.units.includes(c.value)));
    const set = (n, val) => { const el = $(`input[name="${n}"][value="${val}"]`); if (el) el.checked = true; };
    set("level", s.level); set("count", s.count);
    (vak.settings || []).forEach((x) => {
      if (s[x.key] === undefined) return;
      if (x.type === "radio") set("x-" + x.key, s[x.key]);
      else if (x.type === "range") { if (Array.isArray(s[x.key])) { $(`#x-${x.key}-from`).value = s[x.key][0]; $(`#x-${x.key}-to`).value = s[x.key][1]; } }
      else $(`#x-${x.key}`).checked = !!s[x.key];
    });
  }
  function sync() {
    $$(".mission-cb").forEach((cb) => {
      const units = $$(`.unit-cb[data-group="${cb.dataset.group}"]`);
      const k = units.filter((u) => u.checked).length;
      cb.checked = k === units.length; cb.indeterminate = k > 0 && k < units.length;
    });
    const s = readSettings(), k = s.units.length;
    $("#allInfo").classList.toggle("hidden", s.count !== "all");
    (vak.settings || []).filter((x) => x.type === "checkbox" && x.showIf).forEach((x) => $(`[data-cb="${x.key}"]`).classList.toggle("hidden", !x.showIf(s)));
    (vak.settings || []).filter((x) => x.type === "range").forEach((x) => $$(`[data-range="${x.key}"]`).forEach((b) => { const p = x.presets[+b.dataset.i].v; b.classList.toggle("on", p[0] === s[x.key][0] && p[1] === s[x.key][1]); }));
    const n = s.count === "all" ? vak.countAll(s) : s.count;
    $("#setupMsg").textContent = !k ? "Kies minstens één onderdeel"
      : `${k} ${k === 1 ? "onderdeel" : "onderdelen"} gekozen · ${n} vragen` + (vak.describe ? " · " + vak.describe(s) : "");
  }

  // ============================================================
  // TOETS
  // ============================================================
  function start(settings, questions, isRetry, keepPrefs) {
    questions = questions || vak.makeQuiz(settings);
    if (!questions.length) { $("#setupMsg").textContent = "Kies minstens één onderdeel"; return; }
    if (!isRetry && !keepPrefs) Store.setPrefs(vak.id, settings);
    state = { settings: { ...settings, isRetry: !!isRetry }, questions, i: 0, results: [], answered: false, choice: null, clicks: [], isRetry: !!isRetry };
    show("screen-quiz");
    renderQuestion();
    Analytics.event(`start/${vak.id}/${settings.level}`);
  }
  function insertAt(inp, txt) {
    const s = inp.selectionStart ?? inp.value.length;
    inp.value = inp.value.slice(0, s) + txt + inp.value.slice(inp.selectionEnd ?? s);
    inp.focus(); inp.setSelectionRange(s + txt.length, s + txt.length);
  }

  function renderQuestion() {
    const q = state.questions[state.i];
    Object.assign(state, { answered: false, choice: null, clicks: [], lastInput: null });
    $("#progressBar").style.width = (state.i / state.questions.length) * 100 + "%";
    $("#qCounter").textContent = `Vraag ${state.i + 1} van ${state.questions.length}`;
    $("#qTopic").textContent = q.unitLabel;
    $("#qInstruction").innerHTML = q.instruction;
    $("#qPrompt").innerHTML = q.prompt || "";
    $("#qPrompt").className = "prompt " + (q.promptClass || "");
    $("#qHint").textContent = q.hint || "";
    $("#qFigure").innerHTML = q.svg || "";
    $("#qFeedback").innerHTML = ""; $("#qFeedback").className = "feedback";
    $("#nextBtn").textContent = "Controleer ✓";
    const area = $("#qAnswerArea");

    if (q.mode === "mc") {
      area.innerHTML = `<div class="options">${q.options.map((o, k) => `<button class="option ${o.cls || ""}" data-k="${k}"><span class="key">${k + 1}</span><span>${o.html}</span></button>`).join("")}</div>`;
      $$(".option").forEach((b) => b.addEventListener("click", () => {
        if (state.answered) return;
        $$(".option").forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected"); state.choice = q.options[+b.dataset.k].v;
        submit();
      }));
    } else if (q.mode === "text" || q.mode === "num") {
      const helpers = q.mode === "num" ? ["−"] : q.helpers || [];
      const keyboard = q.mode === "text" && vak.keyboard && !q.noKeyboard ? `<div class="acc-label">${esc(vak.keyboardLabel || "")}</div><div class="accents">${vak.keyboard.map((a) => `<button type="button" class="acc">${a}</button>`).join("")}</div>` : "";
      area.innerHTML = `<div class="row-input"><input id="answer" class="answer ${q.short || q.mode === "num" ? "shortans" : ""}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="${q.mode === "num" ? "decimal" : "text"}" placeholder="${q.mode === "num" ? "getal" : "Typ je antwoord…"}">${q.unitSuffix ? `<span class="suffix">${esc(q.unitSuffix)}</span>` : ""}</div>` +
        (helpers.length ? `<div class="helpers">${helpers.map((h) => `<button type="button" class="hlp acc">${h}</button>`).join("")}</div>` : "") + keyboard;
      const inp = $("#answer");
      $$("#qAnswerArea .acc").forEach((b) => b.addEventListener("click", () => insertAt(inp, b.textContent === "−" ? "-" : b.textContent)));
      setTimeout(() => inp.isConnected && inp.focus(), 30);
    } else if (q.mode === "coord") {
      area.innerHTML = `<div class="coordwrap">${q.coordLabel || "co(A′)"} = (<input id="cx" class="answer" type="text" inputmode="numeric" autocomplete="off" placeholder="x">,<input id="cy" class="answer" type="text" inputmode="numeric" autocomplete="off" placeholder="y">)</div>
        <div class="helpers"><button type="button" class="hlp">−</button><small class="muted" style="align-self:center">minteken in het actieve vakje</small></div>`;
      ["#cx", "#cy"].forEach((id) => $(id).addEventListener("focus", () => (state.lastInput = $(id))));
      $(".hlp").addEventListener("click", () => insertAt(state.lastInput || $("#cx"), "-"));
      $("#cx").addEventListener("keydown", (e) => { if (e.key === "Enter" && !$("#cy").value) { e.preventDefault(); e.stopPropagation(); $("#cy").focus(); } });
      setTimeout(() => $("#cx") && $("#cx").focus(), 30);
    } else if (q.mode === "click") {
      area.innerHTML = `<div class="clickinfo"><span id="clickStatus"></span><button type="button" id="clearClicks" class="small">Wis</button></div>`;
      $("#clearClicks").addEventListener("click", () => { if (!state.answered) { state.clicks = []; drawClicks(); } });
      const svg = $("#qFigure svg");
      svg.addEventListener("click", (e) => onGridClick(e, svg, q));
      drawClicks();
    }
  }

  // klikvragen: klik → dichtstbijzijnd roosterpunt
  function svgPoint(e, svg) {
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    const d = svg.dataset, u = +d.unit, pad = +d.pad;
    return [Math.round((p.x - pad) / u + +d.xmin), Math.round(+d.ymax - (p.y - pad) / u)];
  }
  function onGridClick(e, svg, q) {
    if (state.answered) return;
    const p = svgPoint(e, svg), d = svg.dataset;
    if (p[0] < +d.xmin || p[0] > +d.xmax || p[1] < +d.ymin || p[1] > +d.ymax) return;
    const k = state.clicks.findIndex((c) => c[0] === p[0] && c[1] === p[1]);
    if (k >= 0) state.clicks.splice(k, 1);
    else { state.clicks.push(p); if (state.clicks.length > q.nPts) state.clicks.shift(); }
    drawClicks();
  }
  const svgXY = (svg) => { const d = svg.dataset, u = +d.unit, pad = +d.pad; return [(x) => pad + (x - +d.xmin) * u, (y) => pad + (+d.ymax - y) * u]; };
  const fmtN = (n) => (n < 0 ? "−" + -n : n);
  function drawClicks() {
    const q = state.questions[state.i], svg = $("#qFigure svg");
    if (!svg) return;
    const [X, Y] = svgXY(svg);
    svg.querySelector(".g-marks").innerHTML = state.clicks.map((p, i) => `<circle class="g-mark" cx="${X(p[0])}" cy="${Y(p[1])}" r="6"/><text class="g-marklbl" x="${X(p[0]) + 8}" y="${Y(p[1]) - 8}">${q.names[i]}</text>`).join("");
    $("#clickStatus").innerHTML = state.clicks.length
      ? state.clicks.map((p, i) => `<b>${q.names[i]}(${fmtN(p[0])}, ${fmtN(p[1])})</b>`).join(" · ") + (state.clicks.length < q.nPts ? ` — nog ${q.nPts - state.clicks.length} punt(en)` : "")
      : `Tik op een roosterpunt om ${q.nPts === 1 ? "het beeldpunt" : "de " + q.nPts + " beeldpunten"} aan te duiden.`;
  }
  function drawGiven(svg, pts) {
    const [X, Y] = svgXY(svg);
    svg.querySelector(".g-marks").innerHTML = (pts || []).map((p) => `<circle class="g-mark" cx="${X(p[0])}" cy="${Y(p[1])}" r="6"/><text class="g-marklbl" x="${X(p[0]) + 8}" y="${Y(p[1]) + 16}">jij</text>`).join("");
  }

  const STATUS_TEXT = { correct: "Juist!", equiv: "Bijna!", wrong: "Fout." };
  function readGiven(q) {
    if (q.mode === "mc") return state.choice;
    if (q.mode === "coord") { const x = $("#cx").value.trim(), y = $("#cy").value.trim(); return x && y ? `${x};${y}` : ""; }
    if (q.mode === "click") return state.clicks.length === q.nPts ? state.clicks.map((p) => [...p]) : null;
    return $("#answer").value;
  }
  function givenText(q, g) {
    if (q.mode === "mc") { const o = q.options.find((x) => x.v === g); return o ? o.html : "—"; }
    if (q.mode === "click") return (g || []).map((p, i) => `${q.names[i]}(${fmtN(p[0])}, ${fmtN(p[1])})`).join(" ");
    if (q.mode === "coord") return g ? `(${esc(g.replace(";", ", "))})` : "—";
    return esc(g || "—");
  }

  function submit() {
    if (state.answered) return next();
    const q = state.questions[state.i];
    const given = readGiven(q);
    if (given == null || given === "" || (typeof given === "string" && !given.trim())) {
      $("#qFeedback").className = "feedback warn";
      $("#qFeedback").textContent = q.mode === "click" ? `Duid eerst ${q.nPts} punt(en) aan.` : q.mode === "coord" ? "Vul beide coördinaten in." : "Geef eerst een antwoord.";
      return;
    }
    const r = vak.check(given, q, state.settings.level);
    if (r.status !== "correct" && !r.tag) r.tag = r.status === "wrong" ? "fout" : r.status;
    state.results.push({ q, given, ...r });
    state.answered = true;
    const ok = r.points > 0;
    const fb = $("#qFeedback");
    const stText = { ...STATUS_TEXT, ...(vak.statusText || {}) };
    fb.className = "feedback " + (r.status === "correct" ? "ok" : ok ? "warn" : "bad");
    fb.innerHTML = `<b>${stText[r.status] || stText.wrong}</b>` + (r.note ? ` ${esc(r.note)}` : "") +
      (r.strictNote && !ok ? ` ${esc(r.strictNote)}` : "") +
      (r.status !== "correct" ? ` Juist antwoord: <b>${q.answerShown}</b>` : "") +
      (!ok && q.rule ? `<div class="rule">📘 ${pg(q.page)}: ${q.rule}</div>` : "");
    if (q.mode === "mc") $$(".option").forEach((b) => {
      const o = q.options[+b.dataset.k];
      if (o.v === q.answer) b.classList.add("right");
      else if (b.classList.contains("selected")) b.classList.add("wrongopt");
      b.disabled = true;
    });
    else $$("#qAnswerArea input").forEach((i) => (i.readOnly = true));
    if (q.solutionSvg && r.status !== "correct") {
      $("#qFigure").innerHTML = q.solutionSvg;
      if (q.mode === "click") drawGiven($("#qFigure svg"), given);
    }
    $("#nextBtn").textContent = state.i + 1 < state.questions.length ? "Volgende ➔" : "Bekijk resultaat 🏁";
    $("#nextBtn").focus();
  }
  function next() { state.i++; if (state.i < state.questions.length) renderQuestion(); else finish(); }

  // ============================================================
  // RESULTAAT
  // ============================================================
  function analyse(results) {
    const byUnit = {};
    let points = 0;
    results.forEach((r) => {
      const u = (byUnit[r.q.unit] = byUnit[r.q.unit] || { id: r.q.unit, label: r.q.unitLabel, group: r.q.group, page: (vak.units.find((x) => x.id === r.q.unit) || {}).page || r.q.page, ok: 0, n: 0 });
      u.n++; u.ok += r.points; points += r.points;
    });
    const total = results.length;
    return { byUnit, points, total, pct: total ? Math.round((points / total) * 100) : 0, mistakes: results.filter((r) => r.status !== "correct") };
  }
  function finish() {
    const a = analyse(state.results);
    state.analysis = a;
    Store.record(vak.id, state.settings, state.results);
    Analytics.event(`klaar/${vak.id}/${state.settings.level}`);
    $("#progressBar").style.width = "100%";
    $("#scoreBadge").textContent = a.pct >= 90 ? "🏆 Super gedaan!" : a.pct >= 70 ? "👍 Goed bezig" : a.pct >= 50 ? "💪 Nog even oefenen" : "📖 Herhalen maar!";
    $("#scoreBox").innerHTML = `<div class="big">${a.points} / ${a.total}</div><div class="sub">${a.pct}% juist · niveau ${LEVEL_NAME[state.settings.level]} · ${esc(Store.activeName())}</div>`;
    const conc = vak.conclusions(state.results);
    $("#conclusions").innerHTML = conc.map((c) => `<li class="${c.type}">${c.text}</li>`).join("");
    $("#topicTable").innerHTML = `<table><thead><tr><th>Onderdeel</th><th>Score</th><th></th></tr></thead><tbody>` +
      Object.values(a.byUnit).sort((x, y) => x.ok / x.n - y.ok / y.n).map((u) => {
        const p = Math.round((u.ok / u.n) * 100);
        return `<tr><td>${esc(u.label)} <small>${esc(groupOf(vak, u.group).short)} · ${pg(u.page)}</small></td><td>${u.ok}/${u.n}</td><td><div class="bar"><div class="${p >= 80 ? "ok" : p >= 60 ? "warn" : "bad"}" style="width:${p}%"></div></div></td></tr>`;
      }).join("") + `</tbody></table>`;
    renderFinal(a);
    $("#mistakeList").innerHTML = a.mistakes.length ? a.mistakes.map((r) => {
      const tag = vak.tags && vak.tags[r.tag];
      const fig = r.q.solutionSvg || r.q.svg;
      return `<div class="mistake ${r.points ? "warn" : "bad"}">
        <div class="mq"><small>${esc(r.q.unitLabel)} · ${pg(r.q.page)}</small><br>${r.q.instruction}${r.q.prompt ? `: <b class="${r.q.promptClass || ""}">${r.q.prompt}</b>` : ""}</div>
        ${fig ? `<div class="thumb">${fig}</div>` : ""}
        <div>Jouw antwoord: <span class="given">${givenText(r.q, r.given)}</span> · Juist: <b>${r.q.answerShown}</b>${tag ? ` <span class="tag">${esc(tag.short || tag.title)}</span>` : ""}</div>
      </div>`;
    }).join("") : "<p>Geen fouten!</p>";
    $("#retryMistakesBtn").style.display = a.mistakes.length ? "" : "none";
    $("#retryMistakesBtn").textContent = vak.regen ? "🔁 Oefen dit soort vragen opnieuw" : "🔁 Oefen enkel je fouten opnieuw";
    show("screen-result");
  }
  function renderFinal(a) {
    const full = state.settings.count === "all" && !state.isRetry && state.results.length === state.questions.length;
    $("#finalCard").classList.toggle("hidden", !full);
    if (!full) return;
    const units = Object.values(a.byUnit).sort((x, y) => (x.group + x.label).localeCompare(y.group + y.label));
    const verdict = (u) => { const p = u.ok / u.n; return p === 1 ? ["✅", "Volledig gekend", "ok"] : p >= 0.8 ? ["🟡", "Bijna gekend", "warn"] : ["❌", "Nog niet gekend", "bad"]; };
    const nFull = units.filter((u) => u.ok === u.n).length;
    $("#finalIntro").innerHTML = `Alle leerstof van de ${units.length} gekozen onderdelen werd bevraagd (${a.total} vragen, niveau ${LEVEL_NAME[state.settings.level]}). <b>${nFull} van de ${units.length}</b> onderdelen zijn volledig gekend.` +
      (state.settings.level !== "hard" ? " Tip: een eindtoets op niveau <i>moeilijk</i> geeft de strengste controle." : "");
    $("#finalTable").innerHTML = `<table><thead><tr><th>Onderdeel</th><th>Score</th><th>Oordeel</th></tr></thead><tbody>` +
      units.map((u) => { const [ic, txt, cls] = verdict(u); return `<tr><td>${esc(u.label)} <small>${esc(groupOf(vak, u.group).short)} · ${pg(u.page)}</small></td><td>${Math.round(u.ok)}/${u.n}</td><td class="verdict ${cls}">${ic} ${txt}</td></tr>`; }).join("") +
      `</tbody></table>`;
  }

  // ============================================================
  // MIJN VOORTGANG
  // ============================================================
  let progLevel = "all";
  function openProgress(vakId) {
    const withData = Vakken.list.filter((v) => Store.sessions(v.id).length);
    const v = Vakken.get(vakId) || withData[0] || Vakken.list[0];
    vak = v; setTheme(v.theme);
    document.title = "Mijn voortgang";
    $("#progName").textContent = Store.activeName();
    $("#progTabs").innerHTML = Vakken.list.map((x) => `<a class="chipbtn ${x.id === v.id ? "on" : ""}" href="#voortgang/${x.id}">${x.icon} ${esc(x.vak)} <small>${esc(x.klas)}</small></a>`).join("");
    $("#progLevels").innerHTML = [["all", "Alle niveaus"], ["easy", "🙂 makkelijk"], ["normal", "💪 normaal"], ["hard", "🔥 moeilijk"]]
      .map(([l, t]) => `<button type="button" class="chipbtn ${l === progLevel ? "on" : ""}" data-lvl="${l}">${t}</button>`).join("");
    $$("[data-lvl]").forEach((b) => b.addEventListener("click", () => { progLevel = b.dataset.lvl; openProgress(v.id); }));
    renderProgressBody(v);
    show("screen-progress");
    Analytics.page("/voortgang", "Voortgang");
  }
  function renderProgressBody(v) {
    const S = Store.summary(v.id, progLevel);
    const box = $("#progBody");
    if (!S.tests) {
      box.innerHTML = `<div class="card center"><p>Nog geen toetsen ${progLevel === "all" ? "" : "op niveau <b>" + LEVEL_NAME[progLevel] + "</b> "}voor <b>${esc(v.vak)} – ${esc(v.titel)}</b>.</p><a class="btnlink primary" href="#v/${v.id}">Start een oefentoets</a></div>`;
      return;
    }
    const unitInfo = (id) => v.units.find((u) => u.id === id) || { label: id, page: "?" };
    const units = Object.entries(S.units).map(([id, u]) => ({ id, ...u, ...unitInfo(id), label: unitInfo(id).label }));
    const weak = units.filter((u) => u.n >= 3 && u.pct < 75).sort((a, b) => a.pct - b.pct);
    const strong = units.filter((u) => u.n >= 3 && u.pct >= 90).sort((a, b) => b.pct - a.pct);
    const recurring = Object.entries(S.tags).filter(([t, x]) => x.sessions >= 2 && v.tags && v.tags[t]).sort((a, b) => b[1].count - a[1].count);
    const bar = (p) => `<div class="bar"><div class="${p >= 80 ? "ok" : p >= 60 ? "warn" : "bad"}" style="width:${p}%"></div></div>`;
    const trend = S.trend.map((t) => `<div class="tbar" title="${fmtDate(t.date)} · ${LEVEL_NAME[t.level]}"><div class="${t.pct >= 80 ? "ok" : t.pct >= 60 ? "warn" : "bad"}" style="height:${Math.max(4, t.pct)}%"></div><small>${t.pct}</small></div>`).join("");
    const trendDir = S.trend.length >= 4 ? (() => { const h = Math.floor(S.trend.length / 2), a = S.trend.slice(0, h), b = S.trend.slice(h); const m = (x) => x.reduce((s, t) => s + t.pct, 0) / x.length; const d = m(b) - m(a); return d >= 8 ? "📈 stijgend" : d <= -8 ? "📉 dalend" : "➡️ stabiel"; })() : "";

    box.innerHTML = `
      <div class="card">
        <div class="kpis">
          <div><b>${S.tests}</b><small>toetsen</small></div>
          <div><b>${S.avgPct}%</b><small>gemiddeld</small></div>
          <div><b>${S.trend[S.trend.length - 1].pct}%</b><small>laatste</small></div>
          <div><b>${trendDir || "–"}</b><small>trend</small></div>
        </div>
        <div class="trend">${trend}</div>
        <p class="muted small">Laatste toets: ${fmtDate(S.lastDate)}</p>
      </div>
      <div class="card">
        <h2>🎯 Werkpunten</h2>
        ${weak.length ? `<table><tbody>${weak.map((u) => `<tr><td>${esc(u.label)} <small>${pg(u.page)} · ${u.n} vragen${u.recentPct !== u.pct ? ` · laatste keren ${u.recentPct}%` : ""}</small></td><td>${u.pct}%</td><td>${bar(u.pct)}</td></tr>`).join("")}</tbody></table>
          <button id="practiceWeak" class="primary big">Oefen mijn werkpunten (${weak.length} onderdelen)</button>`
          : `<p class="muted">Geen onderdelen onder 75% (met minstens 3 vragen). ${strong.length ? "Goed bezig!" : "Maak nog wat toetsen voor een duidelijker beeld."}</p>`}
      </div>
      ${recurring.length ? `<div class="card"><h2>🔁 Fouten die blijven terugkomen</h2><ul class="conclusions">${recurring.map(([t, x]) => { const g = v.tags[t]; return `<li class="${x.sessions >= 3 ? "bad" : "ok"}"><b>${esc(g.title)}</b> — ${x.count}× in ${x.sessions} toetsen. ${g.advice}${g.page ? ` <small>${pg(g.page)}</small>` : ""}</li>`; }).join("")}</ul></div>` : ""}
      ${S.hardItems.length ? `<div class="card"><h2>🧩 Blijft moeilijk</h2><p class="muted small">Vragen of woorden die meer dan eens fout gingen (alle niveaus samen).</p><ul class="itemlist">${S.hardItems.map((i) => `<li><span>${esc(i.label)}</span><small>${i.ok}/${i.n} juist${i.lastOk ? " · laatste keer wel juist ✓" : ""}</small></li>`).join("")}</ul></div>` : ""}
      ${strong.length ? `<div class="card"><h2>✅ Goed gekend</h2><p>${strong.map((u) => `${esc(u.label)} <small class="muted">(${u.pct}%)</small>`).join(" · ")}</p></div>` : ""}
      <div class="card"><h2>📋 Geschiedenis</h2><table><thead><tr><th>Datum</th><th>Niveau</th><th>Score</th></tr></thead><tbody>${Store.sessions(v.id, progLevel).slice(-15).reverse().map((s) => `<tr><td>${fmtDate(s.date)}${s.isRetry ? " <small>(herhaling)</small>" : ""}${s.count === "all" ? " <small>(eindtoets)</small>" : ""}</td><td>${LEVEL_NAME[s.level]}</td><td>${s.points}/${s.total} (${s.pct}%)</td></tr>`).join("")}</tbody></table></div>`;
    const pw = $("#practiceWeak");
    if (pw) pw.addEventListener("click", () => {
      const lvl = progLevel === "all" ? (Store.getPrefs(v.id) || {}).level || "normal" : progLevel;
      const base = Store.getPrefs(v.id) || {};
      const s = { ...base, units: weak.map((u) => u.id), level: lvl, count: 20 };
      (v.settings || []).forEach((x) => { if (s[x.key] === undefined) s[x.key] = x.default; });
      vak = v; setTheme(v.theme);
      history.replaceState(null, "", "#v/" + v.id);
      start(s, null, false, true);
    });
  }
  // export / import / wissen
  $("#exportBtn").addEventListener("click", () => {
    const data = JSON.stringify(Store.exportProfile(), null, 1);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data], { type: "application/json" }));
    a.download = `voortgang-${Store.activeName().replace(/\W+/g, "_")}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
  });
  $("#importBtn").addEventListener("click", () => $("#importFile").click());
  $("#importFile").addEventListener("change", async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { Store.importProfile(JSON.parse(await f.text())); renderProfile(); toast("Voortgang geïmporteerd als nieuwe leerling."); route(); }
    catch (err) { toast("Dit bestand kon niet ingelezen worden."); }
    e.target.value = "";
  });
  $("#clearBtn").addEventListener("click", (e) => {
    const b = e.currentTarget;
    if (!b.dataset.armed) { b.dataset.armed = "1"; b.textContent = "Zeker? Klik nogmaals om alles van " + Store.activeName() + " te wissen"; setTimeout(() => { delete b.dataset.armed; b.textContent = "Wis voortgang"; }, 4000); return; }
    Store.clearProgress(); delete b.dataset.armed; b.textContent = "Wis voortgang"; toast("Voortgang gewist."); route();
  });

  // ============================================================
  // KNOPPEN
  // ============================================================
  $("#startBtn").addEventListener("click", () => start(readSettings()));
  $("#nextBtn").addEventListener("click", submit);
  $("#stopBtn").addEventListener("click", () => { if (state.results.length) finish(); else openSetup(vak); });
  $("#againBtn").addEventListener("click", () => start({ ...state.settings, isRetry: false }));
  $("#homeBtn").addEventListener("click", () => openSetup(vak));
  $("#resultProgressBtn").addEventListener("click", () => { location.hash = "#voortgang/" + vak.id; });
  $("#retryMistakesBtn").addEventListener("click", () => {
    const qs = state.analysis.mistakes.map((r) => (vak.regen ? vak.regen(r.q, state.settings.level) : { ...r.q }));
    start(state.settings, qs.sort(() => Math.random() - 0.5), true);
  });
  document.addEventListener("keydown", (e) => {
    if (!$("#screen-quiz").classList.contains("active")) return;
    const q = state && state.questions[state.i];
    if (e.key === "Enter") { e.preventDefault(); submit(); }
    else if (q && q.mode === "mc" && !state.answered && /^[1-9]$/.test(e.key)) { const b = $$(".option")[+e.key - 1]; if (b) b.click(); }
  });

  // koffie / feedback
  const links = [];
  if (cfg.showCoffee) links.push(cfg.buyMeACoffeeUrl
    ? `<a class="coffee" href="${esc(cfg.buyMeACoffeeUrl)}" target="_blank" rel="noopener">☕ Buy me a coffee</a>`
    : `<button type="button" class="coffee" id="coffeeBtn">☕ Buy me a coffee</button>`);
  if (cfg.feedbackEmail) links.push(`<a class="mail" href="mailto:${esc(cfg.feedbackEmail)}?subject=${encodeURIComponent("Suggestie oefentoetsen")}">✉️ Suggestie?</a>`);
  $("#extraLinks").innerHTML = links.join("");
  const cb = $("#coffeeBtn");
  if (cb) cb.addEventListener("click", () => toast("Bedankt! ☕ De koffiepagina komt binnenkort online."));

  renderProfile();
  route();
})();
