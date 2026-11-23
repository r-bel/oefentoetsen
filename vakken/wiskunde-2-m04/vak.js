// ============================================================
// VAK – Wiskunde 2de middelbaar · module 4: Machten
// De opgaven staan in inhoud.js in een korte schrijfwijze. Hier zit:
//   - een kleine parser (opgaven én antwoorden van de leerling: 2^-3, (-3)^5, 16/49, 0,0001, 16x^2y^2 …)
//   - exact rekenen (breuken met BigInt, eentermen met letters: 16x²y², a⁸/b¹²)
//   - weergave als wiskunde (machten, breukstreep), nakijken op waarde én vorm
//     (één macht? positieve exponent? zonder haakjes? uitgerekend?)
// Elk onderdeel = unit({ id, group, list, gen(level, c) }); c = het nummer van de opgave in de lijst.
// ============================================================
(function () {
  "use strict";
  const I = Vakken.inhoud("wiskunde-2-m04");
  const { GROUPS, TAGS } = I;

  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rnd(a.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const typed = (level, p = 0.6) => (level === "easy" ? false : level === "hard" || Vakken.vast ? true : Math.random() < p);
  const nOpts = (level) => (level === "easy" ? 3 : 4);

  // ============================================================
  // BREUKEN (exact, BigInt)
  // ============================================================
  const big = (x) => BigInt(x);
  const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a || 1n; };
  const Q = (n, d = 1n) => { n = big(n); d = big(d); if (d === 0n) throw new Error("deling door 0"); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; };
  const qAdd = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d), qSub = (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d);
  const qMul = (a, b) => Q(a.n * b.n, a.d * b.d), qDiv = (a, b) => Q(a.n * b.d, a.d * b.n);
  const qPow = (a, e) => { if (e === 0) return Q(1); if (e < 0) { if (a.n === 0n) throw new Error("0 tot een negatieve macht"); return qPow(Q(a.d, a.n), -e); } let r = Q(1); for (let i = 0; i < e; i++) r = qMul(r, a); return r; };
  const qEq = (a, b) => a.n === b.n && a.d === b.d;
  const qCmp = (a, b) => { const x = a.n * b.d - b.n * a.d; return x > 0n ? 1 : x < 0n ? -1 : 0; };
  const qInt = (a) => (a.d === 1n ? Number(a.n) : null);
  // kommagetal "0,0625" / "1 000" → breuk
  function qDec(s) {
    const t = String(s).replace(/\s/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(".", ",");
    const m = t.match(/^(-?)(\d*)(?:,(\d+))?$/);
    if (!m || (!m[2] && !m[3])) return null;
    const dec = m[3] || "", n = big((m[2] || "0") + dec) * (m[1] ? -1n : 1n);
    return Q(n, 10n ** big(dec.length));
  }
  // breuk als kommagetal als dat kort kan (enkel factoren 2 en 5 in de noemer)
  function qDecStr(a, max = 8) {
    let d = a.d, k = 0; while (d % 2n === 0n) d /= 2n; while (d % 5n === 0n) d /= 5n;
    if (d !== 1n) return null;
    for (k = 0; k <= max; k++) { const p = 10n ** big(k); if ((p * a.n) % a.d === 0n) { const v = (p * a.n) / a.d, neg = v < 0n, s = (neg ? -v : v).toString().padStart(k + 1, "0"); return (neg ? "−" : "") + (k ? s.slice(0, -k) + "," + s.slice(-k) : s); } }
    return null;
  }
  const thou = (s) => s.replace(/^(−?)(\d+)/, (m, sg, d) => sg + d.replace(/\B(?=(\d{3})+(?!\d))/g, " "));

  // ============================================================
  // WAARDE = coëfficiënt · letters^exponent  (eenterm)
  // ============================================================
  const V = (c, v = {}) => { const o = {}; Object.keys(v).sort().forEach((k) => { if (v[k]) o[k] = v[k]; }); return { c, v: o }; };
  const hasVars = (x) => Object.keys(x.v).length > 0;
  const vMul = (a, b) => { const v = { ...a.v }; Object.entries(b.v).forEach(([k, e]) => (v[k] = (v[k] || 0) + e)); return V(qMul(a.c, b.c), v); };
  const vDiv = (a, b) => { const v = { ...a.v }; Object.entries(b.v).forEach(([k, e]) => (v[k] = (v[k] || 0) - e)); return V(qDiv(a.c, b.c), v); };
  const vPow = (a, e) => { const v = {}; Object.entries(a.v).forEach(([k, x]) => (v[k] = x * e)); return V(qPow(a.c, e), v); };
  const vAdd = (a, b, sign) => { if (hasVars(a) || hasVars(b)) { if (JSON.stringify(a.v) !== JSON.stringify(b.v)) throw new Error("som met letters"); } return V(sign > 0 ? qAdd(a.c, b.c) : qSub(a.c, b.c), a.v); };
  const vEq = (a, b) => a && b && qEq(a.c, b.c) && JSON.stringify(a.v) === JSON.stringify(b.v);
  const vKey = (a) => `${a.c.n}/${a.c.d}|${JSON.stringify(a.v)}`;

  // ============================================================
  // PARSER: opgaven (inhoud.js) en antwoorden van de leerling
  // ============================================================
  function tokenize(s) {
    const t = String(s).replace(/[−–—]/g, "-").replace(/[×*]/g, "·").replace(/÷/g, ":").replace(/\s+/g, "");
    const out = [];
    for (let i = 0; i < t.length;) {
      const c = t[i];
      if (/\d/.test(c) || ((c === "," || c === ".") && /\d/.test(t[i + 1] || ""))) {
        let j = i; while (j < t.length && /[\d,.]/.test(t[j])) j++;
        let num = t.slice(i, j);
        // "10^-3,10^4" komt niet voor; een komma achteraan is geen deel van het getal
        while (/[,.]$/.test(num)) { num = num.slice(0, -1); j--; }
        out.push({ k: "num", s: num }); i = j; continue;
      }
      if (/[a-zA-Z]/.test(c)) { out.push({ k: "var", s: c.toLowerCase() }); i++; continue; }
      if ("+-·:/^()[]{}".includes(c)) { out.push({ k: c }); i++; continue; }
      throw new Error("onbekend teken " + c);
    }
    return out;
  }
  function parse(s) {
    const T = tokenize(s);
    let i = 0;
    const peek = () => T[i], eat = (k) => { if (!T[i] || T[i].k !== k) throw new Error("verwacht " + k); return T[i++]; };
    function sum(stop) {
      let a = term(stop);
      while (peek() && (peek().k === "+" || peek().k === "-")) { const op = T[i++].k; a = { t: "add", op, a, b: term(stop) }; }
      return a;
    }
    function term(stop) {
      let a = unary(stop);
      for (;;) {
        const p = peek();
        if (!p) break;
        if (p.k === "·" || p.k === ":" || (p.k === "/" && !stop)) { i++; a = { t: "mul", op: p.k, a, b: unary(stop) }; continue; }
        if (p.k === "var" || p.k === "(" || p.k === "[" || p.k === "{" || (p.k === "num" && a.t !== "num" && endsLetter(a))) { a = { t: "mul", op: "imp", a, b: unary(stop) }; continue; }
        break;
      }
      return a;
    }
    const endsLetter = (a) => a.t === "var" || (a.t === "pow" && a.b.t === "var") || (a.t === "mul" && endsLetter(a.b));
    function unary(stop) {
      const p = peek();
      if (p && (p.k === "-" || p.k === "+")) { i++; const e = unary(stop); return p.k === "-" ? { t: "neg", e } : e; }
      return power(stop);
    }
    function power(stop) {
      const b = atom();
      if (peek() && peek().k === "^") {
        i++;
        let sg = 1;
        if (peek() && (peek().k === "-" || peek().k === "+")) { sg = peek().k === "-" ? -1 : 1; i++; }
        let e;
        if (peek() && peek().k === "(") { i++; e = sum(); eat(")"); }
        else if (peek() && peek().k === "num") e = { t: "num", s: T[i++].s };
        else throw new Error("exponent verwacht");
        return { t: "pow", b, e: sg < 0 ? { t: "neg", e } : e };
      }
      return b;
    }
    function atom() {
      const p = T[i++];
      if (!p) throw new Error("onvolledig");
      if (p.k === "num") return { t: "num", s: p.s };
      if (p.k === "var") return { t: "var", n: p.s };
      if (p.k === "(") { const e = sum(); eat(")"); return { t: "par", e, br: "(" }; }
      if (p.k === "[") { const e = sum(); eat("]"); return { t: "par", e, br: "[" }; }
      if (p.k === "{") { const a = sum(true); eat("/"); const b = sum(true); eat("}"); return { t: "frac", a, b }; }
      throw new Error("onverwacht " + p.k);
    }
    const r = sum();
    if (i < T.length) throw new Error("rest");
    return r;
  }
  function ev(n) {
    switch (n.t) {
      case "num": { const q = qDec(n.s); if (!q) throw new Error("getal"); return V(q); }
      case "var": return V(Q(1), { [n.n]: 1 });
      case "par": return ev(n.e);
      case "frac": return vDiv(ev(n.a), ev(n.b));
      case "neg": return vMul(V(Q(-1)), ev(n.e));
      case "pow": { const e = ev(n.e); if (hasVars(e) || e.c.d !== 1n) throw new Error("exponent"); return vPow(ev(n.b), Number(e.c.n)); }
      case "mul": return n.op === ":" || n.op === "/" ? vDiv(ev(n.a), ev(n.b)) : vMul(ev(n.a), ev(n.b));
      case "add": return vAdd(ev(n.a), ev(n.b), n.op === "+" ? 1 : -1);
    }
    throw new Error("?");
  }
  const tryVal = (s) => { try { return ev(parse(s)); } catch (e) { return null; } };
  const val = (s) => ev(parse(s));

  // ============================================================
  // WEERGAVE
  // ============================================================
  const F = (a, b) => `<span class="fr"><span>${a}</span><span>${b}</span></span>`;
  const sup = (x) => `<sup>${x}</sup>`;
  const minus = (s) => String(s).replace(/-/g, "−");
  function html(n) {
    switch (n.t) {
      case "num": return thou(minus(n.s));
      case "var": return `<i>${n.n}</i>`;
      case "par": return n.br === "[" ? `[${html(n.e)}]` : `(${html(n.e)})`;
      case "frac": return F(html(n.a), html(n.b));
      case "neg": return "−" + html(n.e);
      case "pow": return html(n.b) + sup(expTxt(n.e));
      case "mul": { const un = (x) => (x.t === "par" && x.br === "(" ? x.e : x); if (n.op === "/") return F(html(un(n.a)), html(un(n.b))); return n.op === "imp" ? html(n.a) + html(n.b) : `${html(n.a)} ${n.op === ":" ? ":" : "·"} ${html(n.b)}`; }
      case "add": return `${html(n.a)} ${n.op === "+" ? "+" : "−"} ${html(n.b)}`;
    }
    return "";
  }
  const expTxt = (e) => (e.t === "neg" ? "−" + expTxt(e.e) : e.t === "num" ? e.s : e.t === "par" ? expTxt(e.e) : "?");
  const H = (s) => `<span class="mth">${html(parse(s))}</span>`;
  // een breuk-coëfficiënt als HTML
  function qHtml(q, opts = {}) {
    const neg = q.n < 0n, a = neg ? -q.n : q.n;
    if (q.d === 1n) return (neg ? "−" : "") + thou(a.toString());
    const dec = opts.dec ? qDecStr(q, 7) : null;
    return (neg ? "−" : "") + F(thou(a.toString()), thou(q.d.toString())) + (dec ? ` <small>= ${thou(dec)}</small>` : "");
  }
  // waarde als HTML: 16x²y², −8/27, a⁸/b¹², x⁴/16
  function vHtml(x, opts = {}) {
    if (!hasVars(x)) return qHtml(x.c, opts);
    const neg = x.c.n < 0n, cn = neg ? -x.c.n : x.c.n, cd = x.c.d;
    const L = (arr) => arr.map(([k, e]) => `<i>${k}</i>${e === 1 ? "" : sup(e)}`).join("");
    const pos = Object.entries(x.v).filter(([, e]) => e > 0), negv = Object.entries(x.v).filter(([, e]) => e < 0).map(([k, e]) => [k, -e]);
    const top = (cn === 1n && pos.length ? "" : thou(cn.toString())) + L(pos), bot = (cd === 1n ? "" : thou(cd.toString())) + L(negv);
    return (neg ? "−" : "") + (bot ? F(top || "1", bot) : top);
  }
  // als één macht met een positieve exponent (zoekt een grondtal uit de opgave)
  function powForm(x, ast) {
    const atom = [], comp = [];
    const unwrap = (b) => { while (b.t === "par") b = b.e; return b; };
    const isAtom = (b) => { b = unwrap(b); return b.t === "num" || b.t === "var" || (b.t === "frac" && b.a.t !== "pow" && b.b.t !== "pow" && !hasVars(ev(b))) || (b.t === "neg" && isAtom(b.e)); };
    (function walk(n) { if (!n) return; if (n.t === "pow") { try { (isAtom(n.b) ? atom : comp).push(ev(n.b)); } catch (e) {} } ["a", "b", "e"].forEach((k) => n[k] && typeof n[k] === "object" && walk(n[k])); })(ast);
    const bases = [...atom, ...comp];
    for (const b of bases) {
      if (qEq(b.c, Q(1)) && !hasVars(b)) continue;
      for (let n = -60; n <= 60; n++) {
        if (n === 0) continue;
        let p; try { p = vPow(b, n); } catch (e) { continue; }
        if (vEq(p, x)) return { b, n };
        if (vEq(vMul(V(Q(-1)), p), x)) return { b, n, neg: true };
      }
    }
    return null;
  }
  function baseHtml(b) { // grondtal tussen haakjes als het negatief, een breuk of een kommagetal is
    if (hasVars(b)) { const s = vHtml(b); return /^−|fr/.test(s) || Object.keys(b.v).length > 1 || !qEq(b.c, Q(1)) ? `(${s})` : s; }
    const s = qHtml(b.c), dec = b.c.d !== 1n ? qDecStr(b.c, 4) : null;
    if (dec && b.c.d <= 10000n && !/^1\//.test(dec) && (b.c.d === 10n || b.c.d === 100n || b.c.d === 2n || b.c.d === 4n || b.c.d === 5n) && b.c.n % b.c.d !== 0n && false) return `(${dec})`;
    return b.c.n < 0n || b.c.d !== 1n ? `(${s})` : s;
  }
  function powHtml(pf) {
    let { b, n } = pf;
    const simple = (x) => (!hasVars(x) ? x.c.d === 1n : Object.keys(x.v).length === 1 && Object.values(x.v)[0] === 1 && qEq(x.c, Q(1)));
    let out;
    if (n < 0) {
      // positieve exponent: 1/aⁿ (geheel getal of letter) of (b/a)ⁿ (breuk)
      const inv = vPow(b, -1);
      if (simple(b)) out = Math.abs(n) === 1 ? F("1", vHtml(b)) : F("1", baseHtml(b) + sup(-n));
      else out = Math.abs(n) === 1 ? vHtml(inv) : baseHtml(inv) + sup(-n);
    } else out = n === 1 ? vHtml(b) : baseHtml(b) + sup(n);
    if (pf.neg) out = out.startsWith("−") ? out.slice(1) : "−" + out;
    return out;
  }

  // ============================================================
  // NAKIJKEN
  // ============================================================
  function studentAst(g) { try { return parse(g); } catch (e) { return null; } }
  const negExpIn = (n) => !!n && ((n.t === "pow" && n.e.t === "neg") || ["a", "b", "e"].some((k) => n[k] && typeof n[k] === "object" && negExpIn(n[k])));
  const countPow = (n) => (!n ? 0 : (n.t === "pow" ? 1 : 0) + ["a", "b", "e"].reduce((s, k) => s + (n[k] && typeof n[k] === "object" && n.t !== "pow" ? countPow(n[k]) : 0), 0) + (n.t === "pow" ? countPow(n.b) : 0));
  const hasPowOfProduct = (n) => !!n && ((n.t === "pow" && (() => { let b = n.b; while (b.t === "par") b = b.e; return b.t === "mul" || b.t === "frac" || (b.t === "neg" && b.e.t !== "num"); })()) || ["a", "b", "e"].some((k) => n[k] && typeof n[k] === "object" && hasPowOfProduct(n[k])));
  const numPowLeft = (n) => !!n && ((n.t === "pow" && (() => { try { return !hasVars(ev(n.b)); } catch (e) { return false; } })()) || ["a", "b", "e"].some((k) => n[k] && typeof n[k] === "object" && numPowLeft(n[k])));
  // soort: "val" (uitrekenen), "pow" (één macht, positieve exponent), "zonder" (zonder haakjes)
  function checkExpr(g, target, soort, level) {
    const a = studentAst(g);
    if (!a) return { status: "wrong", note: "Dit kan ik niet lezen. Schrijf bv. 2^-3, (-3)^5, 16/49, 0,25 of 16x^2y^2." };
    let x; try { x = ev(a); } catch (e) { return { status: "wrong", note: "Dit kan ik niet uitrekenen." }; }
    if (!vEq(x, target)) {
      if (vEq(vMul(V(Q(-1)), x), target)) return { status: "wrong", tag: "teken", note: "Het teken klopt niet." };
      try { if (vEq(vPow(x, -1), target)) return { status: "wrong", tag: "negexp", note: "Je hebt het omgekeerde: let op de negatieve exponent." }; } catch (e) {}
      return { status: "wrong" };
    }
    if (soort === "pow") {
      if (negExpIn(a)) return { status: "equiv", tag: "vorm", note: "Juiste waarde, maar schrijf met een positieve exponent." };
      if (countPow(a) > 1) return { status: "equiv", tag: "vorm", note: "Juiste waarde, maar schrijf als één macht." };
    }
    if (soort === "zonder" && hasPowOfProduct(a)) return { status: "equiv", tag: "vorm", note: "Juiste waarde, maar schrijf zonder haakjes." };
    if (soort === "val" && !hasVars(target) && numPowLeft(a) && qInt(target.c) !== null && Math.abs(qInt(target.c)) < 1e7) return { status: "equiv", tag: "vorm", note: "Juist, maar reken nog uit." };
    return { status: "correct" };
  }
  const HELPERS = ["^", "−", "/", "(", ")", "·"];
  const preview = (g) => { try { return `<span class="mth">${html(parse(g))}</span>`; } catch (e) { return "…"; } };

  // foute keuzes (meerkeuze): typische fouten op de opgave
  function mutate(n, f) { const m = f(n); if (m) return m; const o = { ...n }; ["a", "b", "e"].forEach((k) => { if (n[k] && typeof n[k] === "object") o[k] = mutate(n[k], f); }); return o; }
  function distractors(src, target) {
    const ast = parse(src), out = [];
    const add = (x) => { if (x && !vEq(x, target) && !out.some((y) => vEq(x, y))) out.push(x); };
    const tryAst = (m) => { try { add(ev(m)); } catch (e) {} };
    tryAst(mutate(ast, (n) => (n.t === "pow" && n.e.t === "neg" ? { ...n, e: n.e.e } : null)));                 // negatieve exponent genegeerd
    tryAst(mutate(ast, (n) => (n.t === "pow" && n.b.t === "par" && n.b.e.t === "neg" ? { t: "neg", e: { ...n, b: n.b.e.e } } : null))); // haakjes vergeten
    tryAst(mutate(ast, (n) => (n.t === "pow" && n.b.t === "pow" ? { t: "pow", b: n.b.b, e: { t: "num", s: String((() => { try { return Number(ev(n.b.e).c.n) + Number(ev(n.e).c.n); } catch (e) { return 1; } })()) } } : null))); // exponenten opgeteld i.p.v. vermenigvuldigd
    // vermenigvuldigen: exponenten vermenigvuldigd i.p.v. opgeteld · delen: opgeteld i.p.v. afgetrokken
    tryAst(mutate(ast, (n) => {
      if (n.t !== "mul" || n.op === "imp" || n.a.t !== "pow" || n.b.t !== "pow") return null;
      let x, y; try { if (!vEq(ev(n.a.b), ev(n.b.b))) return null; x = Number(ev(n.a.e).c.n); y = Number(ev(n.b.e).c.n); } catch (e) { return null; }
      const e = n.op === "·" ? x * y : x + y;
      return Math.abs(e) > 12 || e === x + (n.op === "·" ? y : -y) ? null : { t: "pow", b: n.a.b, e: e < 0 ? { t: "neg", e: { t: "num", s: String(-e) } } : { t: "num", s: String(e) } };
    }));
    add(vMul(V(Q(-1)), target));
    try { add(vPow(target, -1)); } catch (e) {}
    try { add(vMul(V(Q(-1)), vPow(target, -1))); } catch (e) {}
    if (out.length < 3) add(vMul(V(Q(2)), target));
    return out;
  }

  // ============================================================
  // ONDERDELEN
  // ============================================================
  const UNITS = [];
  const unit = (u) => { u.cases = u.list.length; UNITS.push(u); return u; };
  const base = (u, o) => Object.assign({ unit: u.id, unitLabel: u.label, group: u.group, page: u.page, rule: u.rule, tag: u.tag }, o);
  const mcQ = (q, rightHtml, wrongHtml, level, n) => { const opts = shuffle([rightHtml, ...shuffle([...new Set(wrongHtml.filter((w) => w !== rightHtml))]).slice(0, (n || nOpts(level)) - 1)]); return Object.assign(q, { mode: "mc", options: opts.map((o) => ({ v: o, html: o })), answer: rightHtml }); };
  const pgOf = (lbl, def) => { const m = String(lbl).match(/p\.(\d+)/); return m ? m[1] : def; };

  // opgave → waarde (uitrekenen / één macht / zonder haakjes)
  function exprUnit(id, group, label, page, list, soort, instr, rule, tag) {
    return unit({ id, group, label, page, list, rule, tag,
      gen(level, c) {
        const [lbl, src] = this.list[c], ast = parse(src), target = ev(ast);
        const pf = soort === "pow" ? powForm(target, ast) : null;
        const show = pf ? powHtml(pf) + (hasVars(target) ? "" : ` <small>= ${vHtml(target, { dec: true })}</small>`) : vHtml(target, { dec: true });
        const q = base(this, { instruction: instr, prompt: `<span class="mth">${html(ast)}</span> = …`, answerShown: show, key: `${id}:${c}`, itemLabel: `${lbl}: ${src.replace(/[{}]/g, "")}`, caseIdx: c, page: pgOf(lbl, page) });
        if (typed(level)) return Object.assign(q, { mode: "text", noKeyboard: true, helpers: HELPERS, preview, short: false, chk: (g, lv) => checkExpr(g, target, soort, lv) });
        const right = pf ? powHtml(pf) : vHtml(target);
        const wrong = distractors(src, target).map((x) => { if (pf) { const p2 = powForm(x, ast); if (p2) return powHtml(p2); } return vHtml(x); });
        return mcQ(q, right, wrong, level);
      } });
  }
  const R = {
    def: "Definities: a⁰ = 1, a¹ = a, a⁻ᵐ = 1/aᵐ en (a/b)⁻ᵐ = (b/a)ᵐ (a, b ≠ 0). Haakjes! (−3)² = 9 maar −3² = −9.",
    zelf: "Zelfde grondtal: aᵐ · aᵖ = aᵐ⁺ᵖ (exponenten optellen) en aᵐ : aᵖ = aᵐ⁻ᵖ (exponenten aftrekken). Geen regel voor een som of verschil!",
    mm: "Macht van een macht: (aᵐ)ᵖ = aᵐ·ᵖ – behoud het grondtal en vermenigvuldig de exponenten.",
    prod: "Macht van een product: (a · b)ᵐ = aᵐ · bᵐ – verhef elke factor (ook het getal ervoor!) tot die macht.",
    quot: "Macht van een quotiënt: (a/b)ᵐ = aᵐ/bᵐ – verhef teller en noemer. Negatieve exponent: eerst omkeren.",
    wet: "Wetenschappelijke schrijfwijze: één cijfer (≠ 0) voor de komma · 10ⁿ. 170 000 000 = 1,7 · 10⁸ (komma 8 plaatsen naar links) · 0,000014 = 1,4 · 10⁻⁵ (komma 5 plaatsen naar rechts).",
  };

  // ---------- H1 machten met een gehele exponent ----------
  exprUnit("h1_reken", "H1", "Reken uit (negatieve exponent)", "4", I.REKEN_H1, "val", "Reken uit.", R.def, "negexp");
  exprUnit("h1_pos", "H1", "Schrijf als een macht met een positieve exponent", "4", I.POS_H1, "pow", "Schrijf als een macht met een positieve exponent.", R.def, "negexp");
  unit({ id: "h1_tegen", group: "H1", label: "Het tegengestelde en het omgekeerde (als macht)", page: "4", list: I.TEGEN, tag: "negexp",
    rule: "Het tegengestelde van x is −x (teken wisselen); het omgekeerde van x is 1/x (breuk omkeren, of de exponent van teken wisselen).",
    gen(level, c) {
      const [lbl, wat, src, ans] = this.list[c], target = val(ans);
      const q = base(this, { instruction: `Noteer als een macht: ${wat} …`, prompt: H(src), answerShown: H(ans), key: `h1_tegen:${c}`, itemLabel: `${lbl}: ${wat} ${src.replace(/[{}]/g, "")}`, caseIdx: c });
      if (typed(level, 0.5)) return Object.assign(q, { mode: "text", noKeyboard: true, helpers: HELPERS, preview, chk: (g, lv) => checkExpr(g, target, "pow", lv) });
      const alt = wat.includes("omgekeerde") ? [`−${html(parse(src))}`, html(parse(ans.replace(/\^(\d+)/, "^-$1")))] : [html(parse(src.replace(/\^-?/, (m) => (m === "^-" ? "^" : "^-")))), H(ans.replace(/\^/, "^-"))];
      return mcQ(q, H(ans), [...alt, `−${H(ans)}`], level);
    } });
  unit({ id: "h1_vul", group: "H1", label: "Vul aan: exponent −1, 0 of 1", page: "3-4", list: I.VUL_EXP, tag: "negexp", rule: R.def,
    gen(level, c) {
      const [lbl, src, rechts, e] = this.list[c];
      const q = base(this, { instruction: "Vul aan met −1, 0 of 1 als exponent.", prompt: `<span class="mth">${html(parse(src.replace("?", "9"))).replace(">9<", ">…<")}</span> = ${H(rechts)}`, answerShown: minus(String(e)), key: `h1_vul:${c}`, itemLabel: `${lbl}: ${src} = ${rechts}`, caseIdx: c });
      return Object.assign(q, { mode: "mc", options: ["-1", "0", "1"].map((x) => ({ v: x, html: minus(x) })), answer: String(e) });
    } });
  unit({ id: "h1_teken", group: "H1", label: "Positief of negatief? (zonder uit te rekenen)", page: "3", list: I.TEKEN, tag: "teken",
    rule: "Negatief grondtal: even exponent → positief, oneven exponent → negatief (ook bij een negatieve exponent). Een minteken vóór de macht (zonder haakjes) maakt het resultaat tegengesteld.",
    gen(level, c) {
      const [lbl, src] = this.list[c], x = val(src), pos = qCmp(x.c, Q(0)) > 0;
      return base(this, { mode: "mc", instruction: "Is het resultaat positief of negatief? (zonder uit te rekenen)", prompt: H(src), options: [{ v: "pos", html: "positief" }, { v: "neg", html: "negatief" }], answer: pos ? "pos" : "neg",
        answerShown: `${pos ? "positief" : "negatief"} <small>(${vHtml(x)})</small>`, key: `h1_teken:${c}`, itemLabel: `${lbl}: ${src.replace(/[{}]/g, "")}`, caseIdx: c });
    } });
  unit({ id: "h1_verg", group: "H1", label: "Vergelijk met >, = of <", page: "4", list: I.VERGELIJK, tag: "negexp", rule: R.def,
    gen(level, c) {
      const [lbl, l, r] = this.list[c], k = qCmp(val(l).c, val(r).c), ans = k > 0 ? ">" : k < 0 ? "<" : "=";
      return base(this, { mode: "mc", instruction: "Vul aan met >, = of <.", prompt: `${H(l)} … ${H(r)}`, options: [">", "=", "<"].map((x) => ({ v: x, html: esc(x) })), answer: ans,
        answerShown: `${H(l)} ${esc(ans)} ${H(r)} <small>(${vHtml(val(l))} en ${vHtml(val(r))})</small>`, key: `h1_verg:${c}`, itemLabel: `${lbl}: ${l} … ${r}`, caseIdx: c });
    } });
  unit({ id: "h1_rij", group: "H1", label: "Welke uitdrukking hoort niet in het rijtje?", page: "15", list: I.RIJTJES, tag: "teken", rule: R.def,
    gen(level, c) {
      const [lbl, items] = this.list[c], vals = items.map(val), cnt = vals.map((x) => vals.filter((y) => vEq(x, y)).length), odd = cnt.indexOf(Math.min(...cnt));
      return base(this, { mode: "mc", instruction: "Welke uitdrukking hoort niet in het rijtje?", prompt: "", options: shuffle(items.map((s, i) => ({ v: String(i), html: H(s) }))), answer: String(odd),
        answerShown: `${H(items[odd])} = ${vHtml(vals[odd])}; de andere zijn ${vHtml(vals[(odd + 1) % vals.length])}`, key: `h1_rij:${c}`, itemLabel: `${lbl}: rijtje`, caseIdx: c });
    } });

  // ---------- H2 eenzelfde grondtal ----------
  exprUnit("h2_pos", "H2", "Schrijf als één macht met een positieve exponent", "5-6", I.POS_H2, "pow", "Schrijf als één macht met een positieve exponent.", R.zelf, "regel");
  exprUnit("h2_reken", "H2", "Schrijf als één macht en reken uit indien mogelijk", "5-6", I.REKEN_H2, "val", "Schrijf als één macht en reken uit indien mogelijk (letters ≠ 0).", R.zelf, "regel");
  unit({ id: "h2_kan", group: "H2", label: "Kan je de rekenregel gebruiken?", page: "19", list: I.KAN_REGEL, tag: "regel", rule: R.zelf,
    gen(level, c) {
      const [lbl, src, a] = this.list[c], L = { verm: "ja: vermenigvuldigen (aᵐ · aᵖ = aᵐ⁺ᵖ)", deel: "ja: delen (aᵐ : aᵖ = aᵐ⁻ᵖ)", nee: "nee (ander grondtal, of een som/verschil)" };
      return base(this, { mode: "mc", instruction: "Kan je een rekenregel voor machten met eenzelfde grondtal gebruiken?", prompt: H(src), options: ["verm", "deel", "nee"].map((x) => ({ v: x, html: L[x] })), answer: a,
        answerShown: L[a], key: `h2_kan:${c}`, itemLabel: `${lbl}: ${src}`, caseIdx: c });
    } });
  unit({ id: "h2_pm", group: "H2", label: "Vul aan met + of −", page: "19", list: I.PLUSMIN, tag: "regel", rule: R.zelf,
    gen(level, c) {
      const [lbl, src, b, m, p, a] = this.list[c];
      return base(this, { mode: "mc", instruction: "Vul aan met + of −.", prompt: `${H(src)} = <span class="mth">${html(parse(b))}<sup>${minus(m)} … ${minus(p)}</sup></span>`, options: ["+", "−"].map((x) => ({ v: x, html: x })), answer: a,
        answerShown: `${a} <small>(${a === "+" ? "vermenigvuldigen: exponenten optellen" : "delen: exponenten aftrekken"})</small>`, key: `h2_pm:${c}`, itemLabel: `${lbl}: ${src}`, caseIdx: c });
    } });

  // ---------- H3 macht van een macht ----------
  exprUnit("h3_pos", "H3", "Macht van een macht: schrijf als één macht (positieve exponent)", "7", I.POS_H3, "pow", "Schrijf als één macht met een positieve exponent.", R.mm, "regel");
  exprUnit("h3_reken", "H3", "Macht van een macht: schrijf als één macht en reken uit", "7", I.REKEN_H3, "val", "Schrijf als één macht en reken uit indien mogelijk.", R.mm, "regel");

  // ---------- H4 macht van een product ----------
  exprUnit("h4_zonder", "H4", "Schrijf zonder haakjes en reken uit", "8", I.ZONDER_H4, "zonder", "Schrijf zonder haakjes. Reken uit indien mogelijk (letters ≠ 0).", R.prod, "regel");
  exprUnit("h4_reken", "H4", "Macht van een product: werk uit", "8", I.REKEN_H4, "val", "Werk uit (reken slim).", R.prod, "regel");
  unit({ id: "h4_gelijk", group: "H4", label: "Vul aan met = of ≠", page: "24-25", list: I.GELIJK, tag: "regel", rule: R.prod + " " + R.quot,
    gen(level, c) {
      const [lbl, l, r] = this.list[c], eq = vEq(val(l), val(r));
      return base(this, { mode: "mc", instruction: "Vul aan met = of ≠ (letters ≠ 0).", prompt: `${H(l)} … ${H(r)}`, options: [{ v: "=", html: "=" }, { v: "≠", html: "≠" }], answer: eq ? "=" : "≠",
        answerShown: `${eq ? "=" : "≠"} <small>(${vHtml(val(l))} ${eq ? "=" : "en"} ${vHtml(val(r))})</small>`, key: `h4_gelijk:${c}`, itemLabel: `${lbl}: ${l} … ${r}`, caseIdx: c });
    } });

  // ---------- H5 macht van een quotiënt ----------
  exprUnit("h5_zonder", "H5", "Macht van een quotiënt: werk uit", "9", I.ZONDER_H5, "zonder", "Schrijf zonder haakjes. Reken uit indien mogelijk (letters ≠ 0).", R.quot, "regel");
  exprUnit("h5_slim", "H5", "Reken slim uit met de rekenregels", "10", I.SLIM, "val", "Reken uit door slim te rekenen met de rekenregels.", "Omgekeerd gebruiken: 2³ · 5³ = (2 · 5)³ = 10³ en 125³ : 25³ = (125 : 25)³ = 5³.", "regel");

  // ---------- H6 door elkaar ----------
  unit({ id: "h6_kleur", group: "H6", label: "Duid alle juiste oplossingen aan (soms meerdere)", page: "10, 18", list: I.KLEUR, tag: "regel", rule: "Reken elke keuze uit en vergelijk met de opgave. Let op haakjes en het teken.",
    gen(level, c) {
      const [src, opts] = this.list[c], x = val(src), ok = opts.map((o, i) => (vEq(val(o), x) ? String(i) : null)).filter((v) => v !== null);
      return base(this, { mode: "multi", check: "multi", instruction: "Pas de rekenregels toe. Duid <b>alle</b> juiste oplossingen aan.", prompt: H(src) + " =", multiLabel: "juist", opts: opts.map((o, i) => ({ v: String(i), html: H(o) })), answerSet: ok,
        answerShown: ok.map((i) => H(opts[+i])).join(" · ") + ` <small>(= ${vHtml(x)})</small>`, key: `h6_kleur:${c}`, itemLabel: `kleur: ${src.replace(/[{}]/g, "")}`, caseIdx: c,
        chk: (g) => { const s = (g && g.sel) || [], te = ok.filter((i) => !s.includes(i)), tv = s.filter((i) => !ok.includes(i)); return !te.length && !tv.length ? { status: "correct" } : { status: "wrong", note: te.length ? `Vergeten: ${te.length}.` : "Niet alles is juist." }; } });
    } });
  unit({ id: "h6_vraag", group: "H6", label: "Vraagstukken met machten", page: "2, 20", list: I.VRAAG, tag: "reken", rule: "Schrijf de bewerking met machten en pas de rekenregels toe.",
    gen(level, c) {
      const it = this.list[c], x = val(it.a);
      const q = base(this, { instruction: esc(it.q), prompt: "", answerShown: `${vHtml(x, { dec: true })} ${esc(it.eenheid)} <small>(${esc(it.uitleg)})</small>`, key: `h6_vraag:${c}`, itemLabel: `${it.l}: vraagstuk`, caseIdx: c, page: it.l });
      if (typed(level, 0.7)) return Object.assign(q, { mode: "text", noKeyboard: true, helpers: HELPERS, preview, unitSuffix: it.eenheid, chk: (g, lv) => checkExpr(g, x, "any", lv) });
      return mcQ(q, vHtml(x), distractors(it.a, x).map((y) => vHtml(y)), level);
    } });

  // ---------- H7 wetenschappelijke schrijfwijze ----------
  // getal → mantisse en exponent
  function wetVan(q) { const neg = q.n < 0n, a = neg ? Q(-q.n, q.d) : q; let e = 0, m = a; while (qCmp(m, Q(10)) >= 0) { m = qDiv(m, Q(10)); e++; } while (qCmp(m, Q(1)) < 0) { m = qMul(m, Q(10)); e--; } return { m: neg ? Q(-m.n, m.d) : m, e }; }
  const mStr = (m) => thou(qDecStr(m, 12) || "?");
  const wetHtml = (w) => `${mStr(w.m)} · 10${sup(minus(String(w.e)))}`;
  function wetFields(q, target) {
    const w = wetVan(target);
    return Object.assign(q, { mode: "fields", fields: [{ label: "", ph: "1,7", num: true, short: true }, { label: "· 10 tot de macht", ph: "8", num: true, short: true }],
      chk: (g) => {
        const m = qDec(g[0]), e = parseInt(String(g[1]).replace(/[−–]/g, "-"), 10);
        if (!m || isNaN(e)) return { status: "wrong", tag: "wet" };
        const v = qMul(m, qPow(Q(10), e)), a = m.n < 0n ? Q(-m.n, m.d) : m;
        if (!qEq(v, target)) return { status: "wrong", tag: "wet", note: qEq(m, w.m) ? "Het getal voor de komma is juist, de exponent niet." : "" };
        if (qCmp(a, Q(1)) < 0 || qCmp(a, Q(10)) >= 0) return { status: "equiv", tag: "wet", note: "Juiste waarde, maar er moet precies één cijfer (≠ 0) voor de komma staan." };
        return { status: "correct" };
      } });
  }
  unit({ id: "h7_naar", group: "H7", label: "Schrijf in wetenschappelijke schrijfwijze", page: "11", list: I.NAAR_WET, tag: "wet", rule: R.wet,
    gen(level, c) {
      const [lbl, getal, ctx] = this.list[c], target = val(getal).c, w = wetVan(target);
      const prompt = /·/.test(getal) ? H(getal) : thou(minus(getal));
      const q = base(this, { instruction: ctx ? `${esc(ctx)}<br>Schrijf het getal in wetenschappelijke schrijfwijze.` : "Schrijf in wetenschappelijke schrijfwijze.", prompt: `<span class="mth">${prompt}</span>`, answerShown: wetHtml(w), key: `h7_naar:${c}`, itemLabel: `${lbl}: ${getal}`, caseIdx: c });
      if (typed(level, 0.7)) return wetFields(q, target);
      const opts = [w, { m: w.m, e: w.e + 1 }, { m: w.m, e: w.e - 1 }, { m: w.m, e: -w.e }, { m: qMul(w.m, Q(10)), e: w.e - 1 }].map(wetHtml);
      return mcQ(q, opts[0], opts.slice(1), level);
    } });
  unit({ id: "h7_terug", group: "H7", label: "Schrijf zonder macht van 10", page: "11", list: I.TERUG, tag: "wet", rule: R.wet,
    gen(level, c) {
      const [lbl, m, e] = this.list[c], target = qMul(qDec(m), qPow(Q(10), e)), s = thou(qDecStr(target, 20));
      const q = base(this, { instruction: "Schrijf het getal zonder macht van 10.", prompt: `<span class="mth">${thou(m)} · 10${sup(minus(String(e)))}</span>`, answerShown: s, key: `h7_terug:${c}`, itemLabel: `${lbl}: ${m}·10^${e}`, caseIdx: c });
      if (typed(level, 0.7)) return Object.assign(q, { mode: "text", noKeyboard: true, short: true, chk: (g) => { const x = qDec(String(g).replace(/[−–]/g, "-")); return x && qEq(x, target) ? { status: "correct" } : { status: "wrong", tag: "wet", note: x && qEq(x, qMul(qDec(m), qPow(Q(10), -e))) ? "De komma is de verkeerde kant op geschoven." : "" }; } });
      const alt = [qMul(target, Q(10)), qDiv(target, Q(10)), qMul(qDec(m), qPow(Q(10), -e))].map((x) => thou(qDecStr(x, 24)));
      return mcQ(q, s, alt, level);
    } });
  unit({ id: "h7_is", group: "H7", label: "Staat het getal in wetenschappelijke schrijfwijze?", page: "27", list: I.IS_WET, tag: "wet", rule: R.wet,
    gen(level, c) {
      const [m, e] = this.list[c], a = qDec(m), ok = e !== null && qCmp(a, Q(1)) >= 0 && qCmp(a, Q(10)) < 0;
      const shown = e === null ? thou(m) : `${thou(m)} · 10${sup(minus(String(e)))}`;
      return base(this, { mode: "mc", instruction: "Staat dit getal in wetenschappelijke schrijfwijze?", prompt: `<span class="mth">${shown}</span>`, options: [{ v: "ja", html: "ja" }, { v: "nee", html: "nee" }], answer: ok ? "ja" : "nee",
        answerShown: ok ? "ja" : `nee <small>(${e === null ? "geen macht van 10" : "er moet precies één cijfer (≠ 0) voor de komma staan"}: ${wetHtml(wetVan(e === null ? a : qMul(a, qPow(Q(10), e))))})</small>`, key: `h7_is:${c}`, itemLabel: `D55: ${m}${e === null ? "" : "·10^" + e}`, caseIdx: c });
    } });
  unit({ id: "h7_vul", group: "H7", label: "Vul de exponent aan", page: "27", list: I.VUL_WET, tag: "wet", rule: R.wet,
    gen(level, c) {
      const [lbl, getal, m] = this.list[c], w = wetVan(qDec(getal));
      const q = base(this, { instruction: "Vul aan met een exponent zodat de gelijkheid klopt.", prompt: `<span class="mth">${thou(getal)} = ${thou(m)} · 10${sup("…")}</span>`, answerShown: minus(String(w.e)), key: `h7_vul:${c}`, itemLabel: `${lbl}: ${getal}`, caseIdx: c });
      if (typed(level, 0.7)) return Object.assign(q, { mode: "num", chk: (g) => (parseInt(String(g).replace(/[−–]/g, "-"), 10) === w.e ? { status: "correct" } : { status: "wrong", tag: "wet" }) });
      return Object.assign(q, { mode: "mc", options: shuffle([w.e, w.e + 1, w.e - 1, -w.e].filter((x, i, a) => a.indexOf(x) === i)).map((x) => ({ v: String(x), html: minus(String(x)) })), answer: String(w.e) });
    } });
  unit({ id: "h7_reken", group: "H7", label: "Rekenen met de wetenschappelijke schrijfwijze", page: "30", list: I.REKEN_WET, tag: "wet",
    rule: "Optellen/aftrekken: eerst dezelfde macht van 10 (7,4·10⁸ − 0,39·10⁸). Vermenigvuldigen/delen: de getallen apart en de machten van 10 apart (2,8·5 = 14 en 10⁵·10⁵ = 10¹⁰ → 1,4·10¹¹).",
    gen(level, c) {
      const [lbl, src] = this.list[c], target = val(src).c;
      const q = base(this, { instruction: "Reken uit en noteer je antwoord in wetenschappelijke schrijfwijze.", prompt: H(src), answerShown: wetHtml(wetVan(target)), key: `h7_reken:${c}`, itemLabel: `${lbl}: ${src.replace(/[{}]/g, "")}`, caseIdx: c });
      if (typed(level, 0.7)) return wetFields(q, target);
      const w = wetVan(target), opts = [w, { m: w.m, e: w.e + 1 }, { m: w.m, e: w.e - 1 }, { m: qMul(w.m, Q(-1)), e: w.e }].map(wetHtml);
      return mcQ(q, opts[0], opts.slice(1), level);
    } });
  unit({ id: "h7_orden", group: "H7", label: "Rangschik van klein naar groot", page: "2, 30", list: I.ORDEN, tag: "wet", rule: "Vergelijk eerst de machten van 10 (in wetenschappelijke schrijfwijze), daarna het getal ervoor.",
    gen(level, c) {
      const it = this.list[c], items = it.namen ? it.items.map(([n, v]) => ({ k: n, v: val(v).c, h: `${esc(n)} <small>${H(v)}</small>` })) : it.items.map((s) => ({ k: s, v: val(s).c, h: H(s) }));
      const sorted = items.slice().sort((a, b) => qCmp(a.v, b.v)), byK = Object.fromEntries(items.map((x) => [x.k, x]));
      const chunks = shuffle(items.map((x) => x.k));
      return base(this, { mode: "order", instruction: esc(it.q), prompt: "", chunks, chunkHtml: (k) => byK[k].h, orderPh: "… van klein naar groot …", answerShown: sorted.map((x) => x.h).join(" &lt; "),
        key: `h7_orden:${c}`, itemLabel: `${it.l}: rangschikken`, caseIdx: c,
        chk: (g) => { const ks = String(g).split(" "); const vs = []; let i = 0; for (const x of chunks.slice().sort((a, b) => b.length - a.length)) { /* namen zonder spaties */ } const seq = ks.map((k) => byK[k]); if (seq.some((x) => !x)) return { status: "wrong" }; for (i = 1; i < seq.length; i++) if (qCmp(seq[i - 1].v, seq[i].v) > 0) return { status: "wrong", tag: "wet", note: `Fout vanaf ${seq[i].k.replace(/\^/g, "^")}.` }; return { status: "correct" }; } });
    } });
  unit({ id: "h7_si", group: "H7", label: "SI-voorvoegsels (kilo, mega, milli, micro …)", page: "29", list: I.SI.concat(I.SI), tag: "wet", rule: "k = 10³, M = 10⁶, G = 10⁹, T = 10¹² · m = 10⁻³, μ = 10⁻⁶, n = 10⁻⁹, p = 10⁻¹² · h = 10², da = 10¹, d = 10⁻¹, c = 10⁻².",
    gen(level, c) {
      const [naam, sym, e] = this.list[c], dir = c < I.SI.length, P = (x) => `10${sup(minus(String(x)))}`;
      if (dir) return mcQ(base(this, { instruction: "Welke factor hoort bij dit voorvoegsel?", prompt: `${esc(naam)} (${esc(sym)})`, answerShown: P(e), key: `h7_si:${c}`, itemLabel: `${naam} = 10^${e}`, caseIdx: c }), P(e), I.SI.filter((x) => x[2] !== e).map((x) => P(x[2])), level);
      return mcQ(base(this, { instruction: "Welk voorvoegsel hoort bij deze factor?", prompt: P(e), answerShown: `${esc(naam)} (${esc(sym)})`, key: `h7_si:${c}`, itemLabel: `10^${e} = ${naam}`, caseIdx: c }), `${esc(naam)} (${esc(sym)})`, I.SI.filter((x) => x[2] !== e).map((x) => `${esc(x[0])} (${esc(x[1])})`), level);
    } });

  // ---------- RV rekenvaardigheid: kommagetallen vermenigvuldigen (RV9) en delen (RV10) ----------
  const decH = (q) => thou(qDecStr(q, 12) || "?");
  const RVR = {
    verm: "Stappenplan: 1) bepaal het TEKEN (even aantal mintekens → positief, oneven → negatief) · 2) denk de komma weg en bereken het product · 3) plaats de komma terug: tel de cijfers na de komma van elke factor op.",
    deel: "Stappenplan: 1) bepaal het TEKEN (even aantal mintekens → positief, oneven → negatief) · 2) zorg voor evenveel cijfers na de komma bij deeltal en deler (nullen toevoegen), laat de komma's weg · 3) bereken het quotiënt.",
  };
  function rvUnit(id, label, page, list, rule) {
    return unit({ id, group: "RV", label, page, list, rule, tag: "komma",
      gen(level, c) {
        const [lbl, src] = this.list[c], t = val(src).c;
        const q = base(this, { instruction: "Reken uit.", prompt: `${H(src)} =`, answerShown: decH(t), key: `${id}:${c}`, itemLabel: `${lbl}: ${src}`, caseIdx: c, page: lbl });
        if (typed(level, 0.7)) return Object.assign(q, { mode: "text", noKeyboard: true, short: true, helpers: ["−"], chk: (g) => {
          const x = qDec(String(g).replace(/[−–]/g, "-"));
          if (!x) return { status: "wrong", tag: "komma", note: "Typ een getal, bv. −0,72." };
          if (qEq(x, t)) return { status: "correct" };
          if (qEq(x, Q(-t.n, t.d))) return { status: "wrong", tag: "teken", note: "Het teken klopt niet: tel de mintekens." };
          for (const k of [10n, 100n, 1000n]) if (qEq(x, qMul(t, Q(k))) || qEq(x, qDiv(t, Q(k)))) return { status: "wrong", tag: "komma", note: "De cijfers kloppen, maar de komma staat verkeerd." };
          return { status: "wrong", tag: "reken" };
        } });
        const fout = [qMul(t, Q(10)), qDiv(t, Q(10)), Q(-t.n, t.d), qMul(t, Q(100)), qDiv(t, Q(100))].filter((x) => !qEq(x, t)).map(decH);
        return mcQ(q, decH(t), fout, level);
      } });
  }
  rvUnit("rv9", "RV9 Kommagetallen vermenigvuldigen", "RV9", I.RV9, RVR.verm);
  rvUnit("rv10", "RV10 Kommagetallen delen", "RV10", I.RV10, RVR.deel);
  unit({ id: "rv_teken", group: "RV", label: "Het teken bepalen (mintekens tellen)", page: "RV9-RV10", list: I.RV_TEKEN, tag: "teken",
    rule: "Tel de mintekens: een even aantal → positief resultaat, een oneven aantal → negatief resultaat.",
    gen(level, c) {
      const src = this.list[c], t = val(src).c, pos = qCmp(t, Q(0)) > 0, n = (src.match(/-/g) || []).length;
      return base(this, { mode: "mc", instruction: "Is het resultaat positief of negatief? (tel de mintekens)", prompt: H(src), options: [{ v: "pos", html: "positief" }, { v: "neg", html: "negatief" }], answer: pos ? "pos" : "neg",
        answerShown: `${pos ? "positief" : "negatief"} <small>(${n} ${n === 1 ? "minteken" : "mintekens"}: ${n % 2 ? "oneven" : "even"} → ${decH(t)})</small>`, key: `rv_teken:${c}`, itemLabel: `teken: ${src}`, caseIdx: c });
    } });
  unit({ id: "rv_stap", group: "RV", label: "Stappenplan: komma's weglaten en terugplaatsen", page: "RV9-RV10", list: [...I.RV_GELIJK.map((x) => ["deel", x]), ...I.RV_KOMMA.map((x) => ["verm", x])], tag: "komma",
    rule: RVR.verm + " " + RVR.deel,
    gen(level, c) {
      const [soort, it] = this.list[c];
      if (soort === "deel") {
        const [src, ok] = it, a = parse(src);
        // foute keuzes: de komma's gewoon weglaten zonder evenveel cijfers na de komma
        // foute keuzes: de komma's weglaten zonder evenveel cijfers na de komma, of een nul te veel
        const naief = src.replace(/,/g, "").replace(/(^|[^\d])0+(?=\d)/g, "$1");
        const [l, r] = ok.split(":"), more = (x) => x.replace(/(\d+)(\)?)$/, "$10$2");
        const opts = [...new Set([naief, `${more(l)}:${r}`, `${l}:${more(r)}`].filter((x) => x !== ok))];
        return mcQ(base(this, { instruction: "Stap 2 bij delen: zorg voor evenveel cijfers na de komma en laat de komma's weg. Welke deling krijg je?", prompt: `<span class="mth">${html(a)}</span>`, answerShown: `${H(ok)} <small>= ${decH(val(src).c)}</small>`, key: `rv_stap:${c}`, itemLabel: `stap deling: ${src}`, caseIdx: c }),
          H(ok), opts.map(H), level);
      }
      const [src, n] = it;
      const q = base(this, { instruction: "Stap 3 bij vermenigvuldigen: hoeveel cijfers na de komma krijgt het product (voor je nullen achteraan schrapt)?", prompt: H(src), answerShown: `${n} <small>(product = ${decH(val(src).c)})</small>`, key: `rv_stap:${c}`, itemLabel: `stap product: ${src}`, caseIdx: c });
      if (typed(level, 0.5)) return Object.assign(q, { mode: "num", chk: (g) => (parseInt(g, 10) === n ? { status: "correct" } : { status: "wrong", tag: "komma" }) });
      return Object.assign(q, { mode: "mc", options: [...new Set([n, n - 1, n + 1, Math.max(1, n - 2)])].filter((x) => x >= 0).map((x) => ({ v: String(x), html: String(x) })), answer: String(n) });
    } });
  unit({ id: "rv_regels", group: "RV", label: "Rekenregels en stappenplan (kennis)", page: "RV9-RV10", list: I.RV_REGELS, tag: "begrip", rule: RVR.verm + " " + RVR.deel,
    gen(level, c) {
      const [vraag, ok, ...fout] = this.list[c];
      return mcQ(base(this, { instruction: esc(vraag), prompt: "", answerShown: esc(ok), key: `rv_regels:${c}`, itemLabel: vraag, caseIdx: c }), esc(ok), fout.map(esc), level);
    } });

  // ---------- B begrippen ----------
  unit({ id: "b_begrip", group: "B", label: "Begrippen, definities en rekenregels (in woorden)", page: "3-11", list: I.BEGRIPPEN, tag: "begrip", rule: "Herhaal de kaders 'definitie' en 'rekenregel' (in woorden en in symbolen).",
    gen(level, c) {
      const b = this.list[c];
      if (c % 2 === 0 || level === "easy") return mcQ(base(this, { instruction: "Wat is juist?", prompt: esc(b.t), answerShown: esc(b.d), key: `b_begrip:${c}`, itemLabel: b.t, caseIdx: c, page: b.p }), esc(b.d), this.list.filter((x) => x !== b).map((x) => esc(x.d)), level);
      return mcQ(base(this, { instruction: "Welk begrip of welke regel past bij deze uitleg?", prompt: esc(b.d), answerShown: esc(b.t), key: `b_begrip:${c}`, itemLabel: b.t, caseIdx: c, page: b.p }), esc(b.t), this.list.filter((x) => x !== b).map((x) => esc(x.t)), level);
    } });
  unit({ id: "b_regels", group: "B", label: "Kennisvragen: grondtal, exponent, teken, regels", page: "3-11", list: I.REGELVRAGEN, tag: "begrip", rule: R.def,
    gen(level, c) {
      const [vraag, ok, ...fout] = this.list[c];
      return mcQ(base(this, { instruction: esc(vraag), prompt: "", answerShown: esc(ok), key: `b_regels:${c}`, itemLabel: vraag, caseIdx: c }), esc(ok), fout.map(esc), level);
    } });

  // ---------- theorieblad: definities en rekenregels in woorden én symbolen ----------
  // de formule zelf niet afbreken (enkel na de kwantoren)
  const TH = I.THEORIE.map((t) => ({ ...t, s: t.s.replace(/^(.*?[ℤℕ]) : (.*)$/, '$1 : <span style="white-space:nowrap">$2</span>') })), TH_ITEMS = TH.flatMap((t, i) => [["naam-w", i], ["naam-s", i], ["w-s", i], ["s-w", i]]);
  unit({ id: "b_theorie", group: "B", label: "Theorieblad: rekenregels in woorden en in symbolen", page: "theorieblad", list: TH_ITEMS, tag: "begrip",
    rule: "Leer per rekenregel de naam, de regel in woorden en de regel in symbolen (met ∀ a ∈ ℚ₀, ∀ m, p ∈ ℤ).",
    gen(level, c) {
      const [soort, i] = this.list[c], t = TH[i], ander = TH.filter((x) => x !== t);
      const q = (instr, prompt, ok, fout, shown) => mcQ(base(this, { instruction: instr, prompt, promptClass: "theorie", answerShown: shown, key: `b_theorie:${c}`, itemLabel: `theorie: ${t.naam} (${soort})`, caseIdx: c }), ok, fout, level);
      if (soort === "naam-w") return q("Welke regel in woorden hoort hierbij?", `<b>${esc(t.naam)}</b>`, esc(t.w), ander.map((x) => esc(x.w)), esc(t.w));
      if (soort === "naam-s") return q("Welke regel in symbolen hoort hierbij?", `<b>${esc(t.naam)}</b>`, t.s, ander.map((x) => x.s), t.s);
      if (soort === "w-s") return q("Welke regel in symbolen hoort bij deze regel in woorden?", esc(t.w), t.s, ander.map((x) => x.s), t.s);
      return q("Welke rekenregel of definitie is dit?", t.s, esc(t.naam), ander.map((x) => esc(x.naam)), `${esc(t.naam)} <small>– ${esc(t.w)}</small>`);
    } });
  unit({ id: "b_kwantor", group: "B", label: "Theorieblad: kwantoren lezen (∀, ∈, ℚ₀, ℕ, ℤ)", page: "theorieblad, D52", list: I.KWANTOR, tag: "begrip",
    rule: "∀ = voor alle (voor elk) · ∈ = is een element van · ℚ₀ = de rationale getallen zonder 0 · ℕ = natuurlijke getallen · ℤ = gehele getallen.",
    gen(level, c) {
      const [vraag, ok, ...fout] = this.list[c];
      return mcQ(base(this, { instruction: vraag, prompt: "", answerShown: ok, key: `b_kwantor:${c}`, itemLabel: `kwantor: ${vraag.replace(/<[^>]+>/g, "")}`, caseIdx: c }), ok, fout, level);
    } });

  // ============================================================
  // TOETS
  // ============================================================
  function makeQuiz(s) {
    const units = UNITS.filter((u) => s.units.includes(u.id));
    if (!units.length) return [];
    const out = [];
    if (s.count === "all") { units.forEach((u) => { for (let c = 0; c < u.cases; c++) out.push(u.gen(s.level, c)); }); return s.ordered ? out : shuffle(out); }
    const decks = {};
    for (let i = 0; out.length < s.count && i < s.count * 3; i++) {
      const u = units[i % units.length];
      if (!decks[u.id] || !decks[u.id].length) decks[u.id] = shuffle([...Array(u.cases).keys()]);
      out.push(u.gen(s.level, decks[u.id].pop()));
    }
    return shuffle(out);
  }
  const countAll = (s) => UNITS.filter((u) => s.units.includes(u.id)).reduce((a, u) => a + u.cases, 0);
  function fromKey(key, level) { const [id, c] = key.split(":"), u = UNITS.find((x) => x.id === id), ci = +c; return u && !isNaN(ci) && ci < u.cases ? u.gen(level, ci) : null; }
  function regen(q, level) { return fromKey(q.key, level) || q; }
  function check(given, q, level) {
    let r;
    if (q.mode === "mc") r = given === q.answer ? { status: "correct" } : { status: "wrong", tag: q.tag };
    else r = q.chk(given, level) || { status: "wrong" };
    if (r.status !== "correct" && !r.tag) r.tag = q.tag || "fout";
    r.points = r.status === "correct" ? 1 : r.status === "equiv" ? (level === "hard" ? 0 : 1) : 0;
    if (r.status === "equiv" && level === "hard") r.strictNote = "(op 'Moeilijk' moet ook de vorm kloppen)";
    return r;
  }
  function conclusions(results) {
    const out = [], total = results.length, pts = results.reduce((a, r) => a + r.points, 0), pct = total ? Math.round((pts / total) * 100) : 0;
    out.push(pct >= 90 ? { type: "good", text: `Super! ${pct}% juist.` } : pct >= 70 ? { type: "ok", text: `${pct}% juist: een goede basis, nog enkele werkpunten.` } : { type: "bad", text: `${pct}% juist: herhaal de rekenregels (studiewijzer p. 31) en oefen opnieuw.` });
    const byG = {};
    results.forEach((r) => { const g = (byG[r.q.group] = byG[r.q.group] || { ok: 0, n: 0 }); g.n++; g.ok += r.points; });
    GROUPS.forEach((g) => { const x = byG[g.id]; if (x && x.ok / x.n < 0.8) out.push({ type: x.ok / x.n < 0.6 ? "bad" : "ok", text: `<b>${esc(g.titel)}</b>: ${Math.round(x.ok)}/${x.n} <small>p. ${g.p}</small>` }); });
    const tags = {};
    results.forEach((r) => { if (r.status !== "correct" && TAGS[r.tag] && r.tag !== "fout") tags[r.tag] = (tags[r.tag] || 0) + 1; });
    Object.entries(tags).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => { const g = TAGS[t]; out.push({ type: n >= 2 ? "bad" : "ok", text: `<b>${g.title}</b> (${n}×): ${g.advice}${g.page ? ` <small>p. ${g.page}</small>` : ""}` }); });
    return out;
  }

  // ============================================================
  // LEERKAARTEN: begrippen en regels
  // ============================================================
  const KAART_UNITS = ["b_theorie", "b_begrip", "h7_si"];
  function kaarten(s) {
    const sel = s && Array.isArray(s.units) ? s.units : KAART_UNITS, out = [];
    if (sel.includes("b_theorie")) TH.forEach((t, i) => out.push({ key: `b_theorie:${TH_ITEMS.findIndex((x) => x[1] === i && x[0] === "naam-s")}`, unit: "b_theorie", soort: "Theorieblad", ask: "Ken je de regel in woorden én in symbolen?", front: `<b>${esc(t.naam)}</b>`, back: `${t.s}<br><br>${esc(t.w)}`, page: "theorieblad", label: t.naam }));
    if (sel.includes("b_begrip")) I.BEGRIPPEN.forEach((b, c) => out.push({ key: `b_begrip:${c}`, unit: "b_begrip", soort: "Begrip / regel", ask: "Wat weet je hierover?", front: esc(b.t), back: esc(b.d), page: b.p, label: b.t }));
    if (sel.includes("h7_si")) I.SI.forEach((x, c) => out.push({ key: `h7_si:${c}`, unit: "h7_si", soort: "SI-voorvoegsel", ask: "Welke factor?", front: `${esc(x[0])} (${esc(x[1])})`, back: `10${sup(minus(String(x[2])))}`, page: "29", label: `${x[0]} = 10^${x[2]}` }));
    return out;
  }

  Vakken.register({
    id: "wiskunde-2-m04", vak: I.vak, icon: I.icon, theme: I.theme, titel: I.titel, klas: I.klas, bron: I.bron,
    groups: GROUPS.map((g) => ({ id: g.id, short: g.short, titel: g.titel, p: g.p })),
    units: UNITS.map((u) => ({ id: u.id, group: u.group, label: u.label, page: u.page })),
    quick: [
      { label: "Alles", select: () => true },
      { label: "✏️ Rekenregels (1-5)", select: (u) => /^H[1-5]$/.test(u.group) },
      { label: "🔀 Door elkaar + vraagstukken", select: (u) => u.group === "H6" },
      { label: "🔬 Wetenschappelijke schrijfwijze", select: (u) => u.group === "H7" },
      { label: "📖 Begrippen + theorieblad", select: (u) => u.group === "B" },
      { label: "🧮 RV9-RV10 kommagetallen", select: (u) => u.group === "RV" },
      { label: "📄 Theorieblad rekenregels", select: (u) => u.id === "b_theorie" || u.id === "b_kwantor" },
    ],
    settings: [],
    levels: I.levels, allInfo: I.allInfo,
    statusText: { equiv: "Bijna: de waarde klopt, maar de vorm niet." },
    tags: TAGS,
    makeQuiz, countAll, check, conclusions, regen, fromKey,
    kaarten, kaartUnits: KAART_UNITS,
    _UNITS: UNITS, _parse: parse, _val: tryVal, _vHtml: vHtml, _checkExpr: checkExpr, _powForm: powForm, _powHtml: powHtml,
  });
})();
