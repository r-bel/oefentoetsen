// ============================================================
// Studiemodule – schermen: "Vandaag oefenen", Mijn toetsen (planning),
// flashcards met herhaalschema en de studie-instellingen.
// De rekenlogica (Leitner, dagplanning) staat in core/studie.js.
// Wordt door app.js aangesloten via StudieUI.init(api).
// ============================================================
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const D = Studie.date;
  const DAGNAAM = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const RATING = { nee: "✗ Wist ik niet", twijfel: "~ Twijfel", ja: "✓ Wist ik" };
  let api = null, esc = null;
  let sess = null;           // lopende kaartsessie
  let unlockedUntil = 0;     // pincode: 10 minuten open na juiste code
  const fmtDay = (s) => D.parse(s).toLocaleDateString("nl-BE", { weekday: "short", day: "numeric", month: "short" });
  const plainTxt = (h) => String(h || "").replace(/<small>.*?<\/small>/g, "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/\s+/g, " ").trim();

  // ---------- instellingen ----------
  const cfg = () => Studie.config((window.APP_CONFIG || {}).studie, Store.studieCfg());
  const needPin = () => { const c = cfg(); return c.wiePlant === "ouder" && /^\d{4}$/.test(c.pin || "") && Date.now() > unlockedUntil; };
  function withPin(fn) {
    if (!needPin()) return fn();
    const box = $("#pinBox");
    box.classList.remove("hidden");
    $("#pinInput").value = ""; $("#pinMsg").textContent = "";
    setTimeout(() => $("#pinInput").focus(), 30);
    box.onsubmit = (e) => {
      e.preventDefault();
      if ($("#pinInput").value === cfg().pin) { unlockedUntil = Date.now() + 10 * 60e3; box.classList.add("hidden"); fn(); }
      else $("#pinMsg").textContent = "Verkeerde code.";
    };
    $("#pinCancel").onclick = () => box.classList.add("hidden");
  }

  // ---------- kaarten per toets ----------
  const cardCache = {};
  function cardsFor(v, sel) {
    if (!v || !v.kaarten) return [];
    const k = v.id + "|" + JSON.stringify(sel || null);
    return (cardCache[k] = cardCache[k] || v.kaarten(sel));
  }
  const defaults = (v) => { const s = {}; (v.settings || []).forEach((x) => (s[x.key] = x.default)); return s; };
  const gramUnits = (v, sel) => (sel.units || []).filter((u) => !(v.kaartUnits || []).includes(u));
  const upcoming = () => Store.toetsen().filter((t) => Vakken.get(t.vak) && D.diff(D.today(), t.datum) >= 0);
  const planSessions = (t) => Store.sessions(t.vak).filter((s) => s.plan === t.id && !s.isRetry);
  // laatste dag vóór de dichtstbijzijnde toets waarin deze kaart zit
  function capMap(vakId) {
    const m = {};
    upcoming().filter((t) => t.vak === vakId).forEach((t) => {
      const cap = D.addDays(t.datum, -1);
      cardsFor(Vakken.get(vakId), t.sel).forEach((c) => { if (!m[c.key] || cap < m[c.key]) m[c.key] = cap; });
    });
    return m;
  }
  function plans(day) {
    const items = upcoming().map((t) => {
      const v = Vakken.get(t.vak);
      return { toets: t, cards: cardsFor(v, t.sel), store: Store.kaarten(t.vak), acc: Store.recentAcc(t.vak), sessions: planSessions(t), hasQuiz: (t.sel.units || []).length > 0, gramUnits: gramUnits(v, t.sel), target: Store.dayTarget(day || D.today(), t.id) };
    });
    const ps = Studie.planToday(items, cfg(), day || D.today(), { secPerKaart: Store.secPerKaart() });
    ps.forEach((p) => { if (!p.past && p.newTarget != null && Store.dayTarget(day || D.today(), p.id) === undefined) Store.dayTarget(day || D.today(), p.id, p.newTarget); });
    return ps;
  }
  function streak() {
    const log = Store.log(); let n = 0, d = D.today();
    if (!(log[d] && log[d].n)) d = D.addDays(d, -1);
    while (log[d] && (log[d].n || log[d].q)) { n++; d = D.addDays(d, -1); }
    return n;
  }
  const bar = (p) => `<div class="bar"><div class="${p >= 80 ? "ok" : p >= 50 ? "warn" : "bad"}" style="width:${Math.max(2, p)}%"></div></div>`;
  const boxes = (m) => `<div class="boxes" title="nieuw · doos 1 … doos 5">${m.boxes.map((n, i) => `<span class="bx b${i}"><b>${n}</b><small>${i ? i : "nieuw"}</small></span>`).join("")}</div>`;
  const dagenTxt = (n) => (n === 0 ? "vandaag" : n === 1 ? "morgen" : `nog ${n} dagen`);

  // ============================================================
  // VANDAAG OEFENEN (bovenaan het hoofdmenu)
  // ============================================================
  function renderToday() {
    const box = $("#todayBox");
    if (!box) return;
    // gedeeld toestel: eerst vragen wie er oefent (één keer per bezoek)
    const profs = Store.profiles();
    let ask = false;
    try { ask = Store.meta("vraagWie") && profs.length > 1 && !sessionStorage.getItem("oefentoetsen-wie"); } catch (e) { ask = false; }
    if (ask) {
      box.innerHTML = `<div class="card who"><h2>👋 Wie oefent er?</h2><div class="quick center">${profs.map((p) => `<button type="button" class="chipbtn big2" data-who="${p.id}">${esc(p.name)}</button>`).join("")}</div></div>`;
      $$("[data-who]").forEach((b) => b.addEventListener("click", () => { Store.setActive(b.dataset.who); try { sessionStorage.setItem("oefentoetsen-wie", "1"); } catch (e) {} api.renderProfile(); api.route(); }));
      return;
    }
    const ps = plans(), day = D.today(), c = cfg();
    if (!ps.length) {
      box.innerHTML = `<div class="card today empty"><div class="todayhead"><h2>📅 Vandaag oefenen</h2><a class="small btnlink ghost" href="#instellingen">⚙️</a></div>
        <p class="muted">Plan je volgende toets: dan krijg je elke dag een kort studieplan met flashcards en proeftoetsen, verdeeld tot de toetsdag.</p>
        <a class="btnlink primary" href="#plan/nieuw">📅 Toets plannen</a> <a class="btnlink ghost" href="#plan">Mijn toetsen</a></div>`;
      return;
    }
    const st = streak();
    const totMin = ps.reduce((s, p) => s + (p.cardsDone ? 0 : p.estMin) + (p.quiz && !p.quiz.done ? p.quizMin : 0), 0);
    const rows = ps.map((p) => {
      const t = p.toets, v = Vakken.get(t.vak);
      const tasks = [];
      if (p.nCards) {
        if (!p.cardsDone) tasks.push(`<button type="button" class="task primary" data-act="cards" data-t="${t.id}">🃏 ${[p.due.length ? `${p.due.length} herhalen` : "", p.new.length ? `${p.new.length} nieuw` : ""].filter(Boolean).join(" · ")} <small>±${p.estMin} min</small></button>`);
        else tasks.push(`<div class="task done">✓ Kaarten klaar voor vandaag <button type="button" class="small ghost" data-act="extra" data-t="${t.id}">+ extra blok</button></div>`);
      }
      if (p.quiz) tasks.push(p.quiz.done ? `<div class="task done">✓ ${p.daysLeft <= c.proefDagen ? "Proeftoets" : "Oefenreeks"} gedaan</div>`
        : `<button type="button" class="task ${p.nCards && !p.cardsDone ? "" : "primary"}" data-act="quiz" data-t="${t.id}">📝 ${esc(p.quiz.label)} <small>${p.quiz.count} vragen · ±${p.quizMin} min</small></button>`);
      const notes = [];
      if (p.isToday) notes.push("🍀 Vandaag is de toets! Een korte opwarming en dan: succes.");
      else if (!p.studyDay) notes.push("Vandaag is een rustdag in je planning — oefenen mag altijd.");
      if (p.krap) notes.push(`⏱️ Krap: om alles op tijd te leren zijn er vandaag ${p.newWanted} nieuwe kaarten nodig. Verhoog de tijd per dag in de instellingen of oefen een extra blok.`);
      if (p.locked && !p.new.length && p.cardsDone) notes.push(`${p.locked} kaarten wachten tot de vorige stap zit (bv. eerst de betekenis, dan de middenkolom).`);
      return `<div class="trow theme-${v.theme}">
        <div class="thead"><span class="vakicon">${v.icon}</span><div class="tname"><b>${esc(v.vak)} – ${esc(t.naam || v.titel)}</b><small>toets ${fmtDay(t.datum)} · ${dagenTxt(p.daysLeft)}</small></div>
          <div class="tmast" title="beheersing van de kaarten">${p.nCards ? `${p.mastery.pct}%${bar(p.mastery.pct)}` : ""}</div></div>
        <div class="ttasks">${tasks.join("") || `<div class="task done">✓ Niets meer voor vandaag</div>`}</div>
        ${notes.map((n) => `<p class="small ${/Krap/.test(n) ? "warnline" : "muted"}">${n}</p>`).join("")}
      </div>`;
    }).join("");
    box.innerHTML = `<div class="card today"><div class="todayhead"><h2>📅 Vandaag oefenen</h2>${st ? `<span class="streak">🔥 ${st} ${st === 1 ? "dag" : "dagen"} op rij</span>` : ""}</div>
      ${rows}
      <div class="todayfoot"><span class="muted small">${totMin ? `Samen ±${totMin} min (doel ${c.minuten} min per dag)` : "Alles gedaan voor vandaag 🎉"}</span>
        <span><a class="small btnlink ghost" href="#plan">📅 Mijn toetsen</a> <a class="small btnlink ghost" href="#instellingen">⚙️ Instellingen</a></span></div></div>`;
    $$("#todayBox [data-act]").forEach((b) => b.addEventListener("click", () => {
      const t = Store.toets(b.dataset.t), p = ps.find((x) => x.id === b.dataset.t);
      if (b.dataset.act === "quiz") startPlanQuiz(t, p.quiz);
      else location.hash = `#studie/${t.id}${b.dataset.act === "extra" ? "/extra" : ""}`;
    }));
  }

  // ---------- proeftoets / oefenreeks uit de planning ----------
  function startPlanQuiz(t, task) {
    const v = Vakken.get(t.vak);
    const s = { ...defaults(v), ...t.sel, level: task.level, count: task.count, plan: t.id, mode: task.mode };
    if (task.mode === "oefen") s.units = task.units;
    history.replaceState(null, "", "#v/" + v.id);
    api.setVak(v);
    if (task.mode === "fouten") {
      const pl = api.errorPlan(v, s.units);
      if (pl.items.length || pl.units.length) return api.startErrorQuiz(v, { ...s, descPrefix: `${task.label} · ${t.naam || ""} · ` });
      s.mode = "proef"; s.level = "hard"; task = { ...task, label: "Proeftoets (moeilijk)" };
    }
    s.desc = `${task.label}${t.naam ? " · " + t.naam : ""} · ` + api.describeSettings(v, s);
    api.start(s, null, false, true);
  }
  // na elke toets: juiste/foute antwoorden verplaatsen ook de kaarten (zelfde sleutels)
  function afterQuiz(v, settings, results) {
    if (!v.kaarten) return;
    const keys = new Set(cardsFor(v, null).map((c) => c.key));
    const caps = capMap(v.id), day = D.today(), c = cfg(), store = Store.kaarten(v.id);
    let n = 0;
    results.forEach((r) => {
      if (!r.q.key || !keys.has(r.q.key)) return;
      const ok = r.status === "correct" || r.points >= 1;
      Store.setKaart(v.id, r.q.key, Studie.fromResult(store[r.q.key], ok, day, c, caps[r.q.key]));
      n++;
    });
    Store.logDay(day, { q: 1 });
    return n;
  }

  // ============================================================
  // FLASHCARDS
  // ============================================================
  // #studie/<toetsId>[/extra]   of   #studie/vrij/<vakId> (keuze uit het instellingenscherm)
  let freeSel = null;
  function openSession(tid, extra) {
    const day = D.today(), c = cfg();
    let v, cards, title, t = null;
    if (tid === "vrij") {
      v = Vakken.get(extra); if (!v || !freeSel) return location.replace("#v/" + (v ? v.id : ""));
      cards = cardsFor(v, freeSel); title = `${v.vak} – flashcards`; extra = "vrij";
    } else {
      t = Store.toets(tid); v = t && Vakken.get(t.vak);
      if (!v) return location.replace("#/");
      cards = cardsFor(v, t.sel); title = `${v.vak} – ${t.naam || v.titel}`;
    }
    const store = Store.kaarten(v.id);
    let queue;
    if (t && !extra) {
      const p = plans(day).find((x) => x.id === t.id);
      queue = p ? [...p.due, ...p.new] : [];
    } else {
      // vrij of extra blok: eerst wat aan de beurt is, dan nieuw, dan de laagste dozen (vooruit herhalen)
      const keys = new Set(cards.map((x) => x.key));
      const unlocked = (x) => !x.na || !keys.has(x.na) || (store[x.na] && store[x.na].b >= 2);
      const due = cards.filter((x) => store[x.key] && store[x.key].d <= day);
      const nw = cards.filter((x) => !store[x.key] && unlocked(x)).slice(0, c.blok);
      const rest = cards.filter((x) => store[x.key] && store[x.key].d > day && store[x.key].l !== day && store[x.key].b < Studie.MAXB).sort((a, b) => store[a.key].b - store[b.key].b);
      queue = [...due, ...nw, ...rest].slice(0, c.blok * (extra === "vrij" ? 2 : 1)).map((x) => x.key);
    }
    api.setVak(v); api.setTheme(v.theme);
    document.title = title;
    const byKey = Object.fromEntries(cards.map((x) => [x.key, x]));
    sess = { t, v, byKey, queue: queue.filter((k) => byKey[k]), total: 0, done: 0, stats: { ja: 0, twijfel: 0, nee: 0 }, again: {}, inBlock: 0, block: 1, caps: capMap(v.id), title, start: Date.now() };
    sess.total = sess.queue.length;
    $("#stTitle").textContent = title;
    api.show("screen-study");
    if (!sess.total) return endSession(true);
    $("#stEnd").classList.add("hidden"); $("#stEnd").innerHTML = ""; $("#stCard").classList.remove("hidden");
    nextCard();
    Analytics.event(`kaarten/${v.id}`);
  }
  function nextCard() {
    if (!sess.queue.length) return endSession();
    if (sess.inBlock >= cfg().blok) return pauseBlock();
    const card = sess.byKey[sess.queue[0]];
    sess.card = card; sess.flipped = false; sess.t0 = Date.now();
    $("#stCounter").textContent = `Kaart ${Math.min(sess.done + 1, sess.total)} van ${sess.total}` + (sess.total > cfg().blok ? ` · blok ${sess.block}` : "");
    $("#stBar").style.width = (sess.done / sess.total) * 100 + "%";
    const e = Store.kaarten(sess.v.id)[card.key];
    $("#stSoort").innerHTML = `${esc(card.soort || "")}${e ? ` · doos ${e.b}` : ` · <b class="newtag">nieuw</b>`}${card.page ? ` · <span class="muted">${api.pg(card.page)}</span>` : ""}`;
    $("#stAsk").textContent = card.ask || "";
    $("#stFront").className = "ffront " + (card.frontCls || "") + (card.g ? " g-" + card.g : "");
    $("#stFront").innerHTML = card.front;
    $("#stBack").className = "fback hidden";
    $("#stBack").innerHTML = "";
    const speak = card.lang && "speechSynthesis" in window;
    $("#stBtns").innerHTML = `<button type="button" class="primary big" id="flipBtn">Draai om ↻ <small class="kbd">spatie</small></button>` + (card.tip ? `<button type="button" class="small ghost" id="tipBtn">💡 Tip</button>` : "") + (speak ? ` <button type="button" class="small ghost" id="sayBtn" aria-label="Uitspraak">🔊</button>` : "");
    $("#flipBtn").addEventListener("click", flip);
    if (card.tip) $("#tipBtn").addEventListener("click", (ev) => { ev.currentTarget.outerHTML = `<div class="hint">${card.tip}</div>`; });
    if (speak) $("#sayBtn").addEventListener("click", () => say(card));
  }
  function say(card) {
    try {
      const fr = card.key.endsWith(":fr-nl") ? card.front : card.back;
      const u = new SpeechSynthesisUtterance(plainTxt(fr).split(" / ")[0]); u.lang = "fr-FR"; u.rate = 0.9;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) {}
  }
  function flip() {
    if (!sess || sess.flipped) return;
    const card = sess.card; sess.flipped = true;
    $("#stBack").className = "fback " + (card.backCls || "") + (card.backG ? " g-" + card.backG : "");
    $("#stBack").innerHTML = `<div class="fans">${card.back}</div>` + (card.info ? `<div class="finfo">${card.info}</div>` : "") + (card.tip ? `<div class="finfo muted">💡 ${card.tip}</div>` : "");
    const speak = card.lang && "speechSynthesis" in window;
    $("#stBtns").innerHTML = `<div class="rate">${["nee", "twijfel", "ja"].map((r, i) => `<button type="button" class="r-${r}" data-r="${r}">${RATING[r]} <small class="kbd">${i + 1}</small></button>`).join("")}</div>` + (speak ? `<button type="button" class="small ghost" id="sayBtn">🔊 Uitspraak</button>` : "");
    $$("[data-r]").forEach((b) => b.addEventListener("click", () => rateCard(b.dataset.r)));
    if (speak) $("#sayBtn").addEventListener("click", () => say(card));
  }
  function rateCard(r) {
    if (!sess || !sess.flipped) return;
    const card = sess.card, day = D.today(), c = cfg();
    const sec = Math.round((Date.now() - sess.t0) / 1000);
    const store = Store.kaarten(sess.v.id);
    const e = Studie.rate(store[card.key], r, day, c, sess.caps[card.key]);
    Store.setKaart(sess.v.id, card.key, e, r === "ja", sec);
    Store.logDay(day, { n: 1, sec: Math.min(60, sec), ok: r === "ja" ? 1 : 0 });
    sess.stats[r]++; sess.inBlock++;
    sess.queue.shift();
    // niet gekend: nog eens in deze sessie (na een paar andere kaarten), maximaal twee keer
    if (r === "nee" && (sess.again[card.key] || 0) < 2) { sess.again[card.key] = (sess.again[card.key] || 0) + 1; sess.queue.splice(Math.min(3, sess.queue.length), 0, card.key); }
    else sess.done++;
    nextCard();
  }
  function pauseBlock() {
    const s = sess.stats;
    $("#stCard").classList.add("hidden");
    $("#stEnd").classList.remove("hidden");
    $("#stEnd").innerHTML = `<h2>Blok ${sess.block} klaar 👏</h2><p>${s.ja} ✓ · ${s.twijfel} ~ · ${s.nee} ✗ tot nu toe · nog ${sess.queue.length} kaarten</p>
      <div class="actions"><button type="button" class="primary" id="nextBlock">Volgend blok ➔</button><button type="button" id="stopBlock">Stoppen voor nu</button></div>`;
    $("#nextBlock").addEventListener("click", () => { sess.block++; sess.inBlock = 0; $("#stEnd").classList.add("hidden"); $("#stEnd").innerHTML = ""; $("#stCard").classList.remove("hidden"); nextCard(); });
    $("#stopBlock").addEventListener("click", () => endSession());
    $("#nextBlock").focus();
  }
  function endSession(empty) {
    Store.commit();
    const v = sess.v, t = sess.t, s = sess.stats, n = s.ja + s.twijfel + s.nee;
    $("#stCard").classList.add("hidden");
    $("#stEnd").classList.remove("hidden");
    $("#stBar").style.width = "100%";
    const cards = t ? cardsFor(v, t.sel) : cardsFor(v, freeSel);
    const store = Store.kaarten(v.id), m = Studie.mastery(cards, store);
    const tomorrow = Studie.dueOn(cards, store, D.addDays(D.today(), 1));
    const p = t ? plans().find((x) => x.id === t.id) : null;
    const quizBtn = p && p.quiz && !p.quiz.done ? `<button type="button" class="primary" id="stQuiz">📝 ${esc(p.quiz.label)}</button>` : "";
    const min = Math.max(1, Math.round((Date.now() - sess.start) / 60000));
    $("#stEnd").innerHTML = (empty ? `<h2>Niets meer te herhalen 🎉</h2><p class="muted">Alle kaarten van ${t ? "deze toets" : "deze keuze"} zijn voor vandaag gedaan.</p>`
      : `<h2>Goed gewerkt! 🎉</h2><div class="kpis"><div><b>${s.ja}</b><small>✓ wist ik</small></div><div><b>${s.twijfel}</b><small>~ twijfel</small></div><div><b>${s.nee}</b><small>✗ nog niet</small></div><div><b>${min}′</b><small>minuten</small></div></div>`) +
      `<h2 class="mt">Beheersing ${t ? "voor de toets" : "van deze keuze"}: ${m.pct}%</h2>${bar(m.pct)}${boxes(m)}
      <p class="muted small">Doos 1 = nog moeilijk, doos 5 = zit goed. Wat je kent, komt pas na een paar dagen terug; wat je nog niet kent, morgen weer.${tomorrow ? ` Morgen komen er <b>${tomorrow}</b> kaarten terug.` : ""}${t ? ` Toets ${fmtDay(t.datum)} (${dagenTxt(D.diff(D.today(), t.datum))}).` : ""}</p>
      ${n && s.nee + s.twijfel > n / 2 ? `<p class="warnline small">Veel kaarten zitten nog niet. Morgen komen ze terug; de planning neemt dan wat minder nieuwe kaarten.</p>` : ""}
      <div class="actions">${quizBtn}<button type="button" id="stMore">+ Nog een blok</button><a class="btnlink ${quizBtn ? "" : "primary"}" href="#/">📅 Terug naar Vandaag</a></div>`;
    if ($("#stQuiz")) $("#stQuiz").addEventListener("click", () => startPlanQuiz(t, p.quiz));
    $("#stMore").addEventListener("click", () => openSession(t ? t.id : "vrij", t ? "extra" : v.id));
    sess.ended = true;
  }
  document.addEventListener("keydown", (e) => {
    if (!$("#screen-study").classList.contains("active") || !sess || sess.ended || $("#stCard").classList.contains("hidden")) return;
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (!sess.flipped && (e.key === " " || e.key === "Enter")) { e.preventDefault(); flip(); }
    else if (sess.flipped && /^[123]$/.test(e.key)) { e.preventDefault(); rateCard(["nee", "twijfel", "ja"][+e.key - 1]); }
  });

  // ============================================================
  // INSTELLINGENSCHERM VAN EEN VAK: flashcards + "plan een toets"
  // ============================================================
  let curSel = null;
  function syncSetup(v, s) {
    curSel = s;
    const n = s.units.length ? cardsFor(v, s).length : 0;
    $("#flashBtn").classList.toggle("hidden", !n);
    $("#flashBtn").innerHTML = `🃏 Flashcards <small>(${n} kaarten)</small>`;
    if (!$("#planForm").classList.contains("hidden")) planInfo(v, s);
  }
  function planInfo(v, s) {
    const n = cardsFor(v, s).length, g = gramUnits(v, s);
    const datum = $("#planDatum").value, days = datum ? D.diff(D.today(), datum) : null;
    const per = days > 0 && n ? Math.ceil(n / Math.max(1, D.studyDays(D.today(), D.addDays(datum, -1), cfg()) - (days >= 5 ? 2 : days >= 3 ? 1 : 0))) : null;
    $("#planInfo").innerHTML = [n ? `${n} kaarten` : "", g.length ? `${g.length} ${g.length === 1 ? "onderdeel" : "onderdelen"} met oefenreeksen` : "", per ? `±${per} nieuwe kaarten per dag` : "", days !== null && days < 1 ? `<span class="warnline">kies een datum na vandaag</span>` : "", days >= 1 && days <= 2 ? "weinig tijd: de app neemt alles samen" : ""].filter(Boolean).join(" · ");
  }
  function openPlanForm(v, t) {
    withPin(() => {
      $("#planForm").classList.remove("hidden");
      $("#planForm").dataset.tid = t ? t.id : "";
      $("#planNaam").value = t ? t.naam || "" : "";
      $("#planDatum").value = t ? t.datum : D.addDays(D.today(), 7);
      $("#planDatum").min = D.addDays(D.today(), 1);
      $("#planSave").textContent = t ? "💾 Wijzigingen bewaren" : "📅 Bewaar in mijn planning";
      planInfo(v, api.readSettings());
      setTimeout(() => $("#planForm").scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    });
  }
  function bindSetup() {
    $("#flashBtn").addEventListener("click", () => { freeSel = api.readSettings(); location.hash = `#studie/vrij/${api.getVak().id}`; });
    $("#planBtn").addEventListener("click", () => openPlanForm(api.getVak(), null));
    $("#planCancel").addEventListener("click", () => $("#planForm").classList.add("hidden"));
    $("#planDatum").addEventListener("input", () => planInfo(api.getVak(), api.readSettings()));
    $("#planForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = api.getVak(), s = api.readSettings(), datum = $("#planDatum").value;
      if (!s.units.length) return api.toast("Kies minstens één onderdeel.");
      if (!datum || D.diff(D.today(), datum) < 1) return api.toast("Kies een datum na vandaag.");
      // automatische naam: de gekozen leerstof, zonder richting/instellingen
      const naam = $("#planNaam").value.trim() || api.describeSettings(v, { ...s, count: 0 }).split(" · ").filter((x) => !/:| vragen$/.test(x)).join(" · ") || v.titel;
      const id = Store.saveToets({ ...($("#planForm").dataset.tid ? { id: $("#planForm").dataset.tid } : {}), vak: v.id, naam: naam.slice(0, 80), datum, sel: { ...s, count: undefined } });
      Store.setPrefs(v.id, s);
      $("#planForm").classList.add("hidden");
      Analytics.event(`plan/${v.id}`);
      api.toast("Toets gepland. Je vindt elke dag je taken bij 📅 Vandaag oefenen.");
      location.hash = "#plan/" + id;
    });
  }

  // ============================================================
  // MIJN TOETSEN
  // ============================================================
  function openPlan(arg) {
    api.setTheme("indigo"); document.title = "Mijn toetsen";
    const box = $("#planBody"), all = Store.toetsen(), today = D.today();
    const ps = plans(), up = all.filter((t) => D.diff(today, t.datum) >= 0), past = all.filter((t) => D.diff(today, t.datum) < 0).reverse();
    const c = cfg();
    $("#planName").textContent = Store.activeName();
    const choose = `<div class="card ${arg === "nieuw" ? "" : "hidden"}" id="vakChoose"><h2>Voor welk vak?</h2><div class="vakcards">${Vakken.list.map((m) => `<a class="vakcard theme-${m.theme}" href="#v/${m.id}/plan"><span class="vakicon">${m.icon}</span><span class="vakbody"><b>${esc(m.vak)} – ${esc(m.titel)}</b><small>${esc(m.klas)}</small></span><span class="vakgo">›</span></a>`).join("")}</div>
      <p class="muted small">Je kiest daarna de leerstof zoals bij een oefentoets (onderdelen, bereik, richting) en de datum.</p></div>`;
    const card = (t) => {
      const v = Vakken.get(t.vak); if (!v) return "";
      const p = ps.find((x) => x.id === t.id), cards = cardsFor(v, t.sel), m = Studie.mastery(cards, Store.kaarten(v.id));
      const dl = D.diff(today, t.datum), ss = planSessions(t);
      const proef = ss.filter((s) => s.mode === "proef").map((s) => `${s.level === "hard" ? "moeilijk" : "normaal"} ${s.pct}%`);
      const milestones = dl > 0 ? [
        cards.length ? `kaarten tot ${fmtDay(D.addDays(t.datum, -1))}` : "",
        c.proef ? `proeftoetsen vanaf ${fmtDay(D.addDays(t.datum, -Math.min(dl, c.proefDagen)))}` : "",
      ].filter(Boolean).join(" · ") : "";
      return `<div class="card plancard theme-${v.theme} ${arg === t.id ? "flashy" : ""}" id="pc-${t.id}">
        <div class="thead"><span class="vakicon">${v.icon}</span><div class="tname"><b>${esc(v.vak)} – ${esc(t.naam || v.titel)}</b><small>${fmtDay(t.datum)} · ${dl >= 0 ? dagenTxt(dl) : "voorbij"}</small></div></div>
        <p class="muted small">${esc(api.describeSettings(v, { ...t.sel, count: 0 }).replace(/ · 0 vragen$/, ""))}</p>
        ${cards.length ? `<div class="mrow"><span>Beheersing kaarten <b>${m.pct}%</b></span>${bar(m.pct)}</div>${boxes(m)}` : `<p class="muted small">Geen kaarten in deze keuze: de planning maakt dagelijkse oefenreeksen.</p>`}
        ${milestones ? `<p class="small">📌 ${milestones}</p>` : ""}
        ${proef.length ? `<p class="small">📝 Proeftoetsen: ${proef.join(" · ")}</p>` : ""}
        ${p && p.krap ? `<p class="warnline small">⏱️ Krap gepland: verhoog de tijd per dag of oefen extra blokken.</p>` : ""}
        <div class="actions left">${dl >= 0 && cards.length ? `<a class="btnlink primary small" href="#studie/${t.id}">🃏 Studeer nu</a>` : ""}
          <button type="button" class="small" data-edit="${t.id}">✎ Aanpassen</button><button type="button" class="small ghost" data-del="${t.id}">🗑 Verwijderen</button></div></div>`;
    };
    box.innerHTML = choose +
      (up.length ? up.map(card).join("") : `<div class="card center"><p class="muted">Nog geen toetsen gepland.</p></div>`) +
      (past.length ? `<details class="card pastlist"><summary><b>Afgelopen toetsen (${past.length})</b></summary>${past.map(card).join("")}</details>` : "");
    $$("[data-edit]").forEach((b) => b.addEventListener("click", () => { const t = Store.toets(b.dataset.edit); location.hash = `#v/${t.vak}/plan/${t.id}`; }));
    $$("[data-del]").forEach((b) => b.addEventListener("click", () => withPin(() => {
      if (!b.dataset.armed) { b.dataset.armed = "1"; b.textContent = "Zeker? Klik nogmaals"; setTimeout(() => { delete b.dataset.armed; b.textContent = "🗑 Verwijderen"; }, 4000); return; }
      Store.deleteToets(b.dataset.del); api.toast("Toets verwijderd (de kaarten en de voortgang blijven bewaard)."); openPlan();
    })));
    $("#planNew").onclick = () => withPin(() => { $("#vakChoose").classList.remove("hidden"); $("#vakChoose").scrollIntoView({ behavior: "smooth" }); });
    $("#icsBtn").classList.toggle("hidden", !up.length);
    api.show("screen-plan");
    if (arg && arg !== "nieuw") { const el = document.getElementById("pc-" + arg); if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 60); }
    Analytics.page("/plan", "Mijn toetsen");
  }
  function exportIcs() {
    const c = cfg(), today = D.today(), ev = [];
    upcoming().forEach((t) => {
      const v = Vakken.get(t.vak), name = `${v.vak} – ${t.naam || v.titel}`;
      ev.push({ uid: "toets-" + t.id, date: t.datum, title: `📝 Toets ${name}` });
      for (let d = D.addDays(today, 0); D.diff(d, t.datum) > 0; d = D.addDays(d, 1)) {
        if (!D.isStudyDay(d, c)) continue;
        const dl = D.diff(d, t.datum);
        const wat = c.proef && dl <= c.proefDagen ? (dl === c.proefDagen ? "proeftoets + kaarten" : dl === 1 ? "laatste herhaling + proeftoets (moeilijk)" : "toets op je fouten + kaarten") : "flashcards herhalen";
        ev.push({ uid: `studie-${t.id}-${d}`, date: d, time: c.studieUur, minutes: Math.round(c.minuten / Math.max(1, upcoming().length)) + 5, title: `🃏 Studeren ${v.vak} (${wat})`, desc: `Open de oefentoetsen-site › Vandaag oefenen. Toets op ${t.datum}.` });
      }
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([Studie.ics(ev)], { type: "text/calendar" }));
    a.download = "studieplanning.ics";
    document.body.appendChild(a); a.click(); a.remove();
    api.toast("Agendabestand gemaakt: open het om de studiemomenten in je agenda te zetten.");
  }

  // ============================================================
  // STUDIE-INSTELLINGEN (per leerling; standaard uit config.js)
  // ============================================================
  function openSettings() {
    withPin(() => renderSettings());
  }
  function renderSettings() {
    api.setTheme("indigo"); document.title = "Studie-instellingen";
    const c = cfg(), acc = Vakken.list.map((v) => [v, Store.recentAcc(v.id)]).filter(([, a]) => a !== null);
    const seg = (key, opts, cur, fmt = (x) => x) => `<div class="seg seg${Math.min(5, opts.length)}">${opts.map((o) => `<label><input type="radio" name="sc-${key}" value="${o}" ${String(o) === String(cur) ? "checked" : ""}><span>${fmt(o)}</span></label>`).join("")}</div>`;
    const days = [1, 2, 3, 4, 5, 6, 0];
    $("#cfgBody").innerHTML = `
      <div class="section-label">Tijd per dag <span class="muted">(alle toetsen samen)</span></div>${seg("minuten", [10, 15, 20, 30, 45], c.minuten, (x) => x + " min")}
      <div class="section-label">Kaarten per blokje</div>${seg("blok", [5, 10, 15, 20], c.blok)}
      <div class="section-label">Studiedagen</div><div class="quick">${days.map((d) => `<label class="daychip"><input type="checkbox" data-day="${d}" ${c.dagen.includes(d) ? "checked" : ""}><span>${DAGNAAM[d]}</span></label>`).join("")}</div>
      <div class="section-label">Proeftoetsen in de planning</div>${seg("proef", ["aan", "uit"], c.proef ? "aan" : "uit")}
      <div class="section-label">Eerste proeftoets … dagen voor de toets</div>${seg("proefDagen", [2, 3, 4, 5], c.proefDagen)}
      <div class="section-label">Vragen per proeftoets / oefenreeks</div>${seg("proefVragen", [10, 15, 20, 30], c.proefVragen)}${seg("oefenReeks", [5, 10, 15, 20], c.oefenReeks, (x) => x + " per reeks")}
      <div class="section-label">Wie plant?</div>${seg("wiePlant", ["iedereen", "ouder"], c.wiePlant, (x) => (x === "ouder" ? "Enkel de ouder (pincode)" : "Iedereen (het kind plant zelf)"))}
      <div id="pinRow" class="${c.wiePlant === "ouder" ? "" : "hidden"}"><label class="small">Pincode (4 cijfers) <input id="cfgPin" class="answer shortans" inputmode="numeric" maxlength="4" value="${esc(c.pin || "")}"></label>
        <p class="muted small">De pincode beschermt de planning en deze instellingen tegen per ongeluk wijzigen. Het is geen echte beveiliging: alles staat enkel op dit toestel.</p></div>
      <div class="section-label">Toestel</div><label class="check"><input type="checkbox" id="cfgWho" ${Store.meta("vraagWie") ? "checked" : ""}> Gedeeld toestel: bij het openen vragen wie er oefent</label>
      <div class="section-label">Studiemoment in de agenda (.ics)</div><input id="cfgUur" type="time" class="answer shortans" value="${esc(c.studieUur)}">
      <div class="card inner mt"><b>Wat de app zelf meet</b><p class="muted small">Tempo: ${Store.secPerKaart() ? `±${Math.round(Store.secPerKaart())} seconden per kaart` : "nog niet gemeten"} (bepaalt hoeveel kaarten in je tijd passen).<br>
        ${acc.length ? acc.map(([v, a]) => `${v.icon} ${esc(v.vak)} ${esc(v.klas)}: ${Math.round(a * 100)}% gekend bij de laatste kaarten${a < 0.6 ? " → trager tempo met nieuwe kaarten" : a > 0.85 ? " → sneller tempo met nieuwe kaarten" : ""}`).join("<br>") : "Trefzekerheid: nog te weinig kaarten."}</p></div>
      <div class="actions"><button type="button" id="cfgReset" class="small ghost">Standaardwaarden herstellen</button><a class="btnlink small" href="#/">✓ Klaar</a></div>`;
    const save = (patch) => { Store.setStudieCfg(patch); };
    $$("#cfgBody input[type=radio]").forEach((el) => el.addEventListener("change", () => {
      const k = el.name.slice(3), val = el.value;
      save({ [k]: k === "proef" ? val === "aan" : k === "wiePlant" ? val : +val });
      if (k === "wiePlant") { $("#pinRow").classList.toggle("hidden", val !== "ouder"); if (val === "ouder") unlockedUntil = Date.now() + 10 * 60e3; }
    }));
    $$("[data-day]").forEach((el) => el.addEventListener("change", () => {
      const d = $$("[data-day]").filter((x) => x.checked).map((x) => +x.dataset.day);
      if (!d.length) { el.checked = true; return api.toast("Minstens één studiedag."); }
      save({ dagen: d });
    }));
    $("#cfgPin").addEventListener("input", (e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); e.target.value = v; if (v.length === 4 || !v) save({ pin: v }); });
    $("#cfgWho").addEventListener("change", (e) => Store.meta("vraagWie", e.target.checked));
    $("#cfgUur").addEventListener("change", (e) => save({ studieUur: e.target.value || "17:00" }));
    $("#cfgReset").addEventListener("click", () => { Store.setStudieCfg({ minuten: undefined, blok: undefined, dagen: undefined, proef: undefined, proefDagen: undefined, proefVragen: undefined, oefenReeks: undefined, wiePlant: undefined, pin: undefined, studieUur: undefined }); renderSettings(); api.toast("Standaardwaarden hersteld."); });
    $("#cfgName").textContent = Store.activeName();
    api.show("screen-studiecfg");
    Analytics.page("/instellingen", "Studie-instellingen");
  }

  // ============================================================
  // ROUTER-HAAK
  // ============================================================
  function route(h) {
    const parts = h.split("/");
    if (parts[0] === "plan") { openPlan(parts[1]); return true; }
    if (parts[0] === "studie") { openSession(parts[1], parts[2]); return true; }
    if (parts[0] === "instellingen") { openSettings(); return true; }
    return false;
  }
  function init(a) {
    api = a; esc = a.esc;
    bindSetup();
    $("#icsBtn").addEventListener("click", exportIcs);
    $("#stStop").addEventListener("click", () => { if (sess && !sess.ended) endSession(); });
    $("#todayBtn").addEventListener("click", () => { location.hash = "#/"; });
  }
  window.StudieUI = { init, route, renderToday, syncSetup, openPlanForm, afterQuiz, _plans: plans };
})();
