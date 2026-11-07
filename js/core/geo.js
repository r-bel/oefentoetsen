// ============================================================
// Geo: kleine SVG-tekenbibliotheek voor roosters, assenstelsels,
// figuren, vectoren en ruimtefiguren. Geen afhankelijkheden.
// Wiskundige coördinaten (y naar boven) → SVG-pixels.
// ============================================================
(function () {
  "use strict";

  const fmt = (n) => (Math.round(n * 100) / 100).toString();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  class Plot {
    // opts: unit (px per eenheid), grid (bool), axes (bool), pad (px), clickable (bool)
    constructor(xmin, xmax, ymin, ymax, opts = {}) {
      Object.assign(this, { xmin, xmax, ymin, ymax });
      this.u = opts.unit || 28;
      this.pad = opts.pad ?? 16;
      this.opts = opts;
      this.w = (xmax - xmin) * this.u + 2 * this.pad;
      this.h = (ymax - ymin) * this.u + 2 * this.pad;
      this.parts = [];
      this.top = [];
      if (opts.grid) this._grid();
      if (opts.axes) this._axes();
    }
    X(x) { return this.pad + (x - this.xmin) * this.u; }
    Y(y) { return this.pad + (this.ymax - y) * this.u; }
    P(p) { return `${fmt(this.X(p[0]))},${fmt(this.Y(p[1]))}`; }

    _grid() {
      const g = [];
      for (let x = Math.ceil(this.xmin); x <= this.xmax; x++) g.push(`<line class="g-grid" x1="${this.X(x)}" y1="${this.Y(this.ymin)}" x2="${this.X(x)}" y2="${this.Y(this.ymax)}"/>`);
      for (let y = Math.ceil(this.ymin); y <= this.ymax; y++) g.push(`<line class="g-grid" x1="${this.X(this.xmin)}" y1="${this.Y(y)}" x2="${this.X(this.xmax)}" y2="${this.Y(y)}"/>`);
      this.parts.push(g.join(""));
    }
    _axes() {
      const a = [];
      if (this.ymin <= 0 && this.ymax >= 0) {
        a.push(`<line class="g-axis" x1="${this.X(this.xmin)}" y1="${this.Y(0)}" x2="${this.X(this.xmax)}" y2="${this.Y(0)}" marker-end="url(#g-arr-axis)"/>`);
        a.push(`<text class="g-axislbl" x="${this.X(this.xmax) - 4}" y="${this.Y(0) + 15}" text-anchor="end">x</text>`);
      }
      if (this.xmin <= 0 && this.xmax >= 0) {
        a.push(`<line class="g-axis" x1="${this.X(0)}" y1="${this.Y(this.ymin)}" x2="${this.X(0)}" y2="${this.Y(this.ymax)}" marker-end="url(#g-arr-axis)"/>`);
        a.push(`<text class="g-axislbl" x="${this.X(0) + 7}" y="${this.Y(this.ymax) + 12}">y</text>`);
      }
      if (this.ymin <= 0 && this.ymax >= 0 && this.xmin <= 0 && this.xmax >= 0) {
        a.push(`<text class="g-tick" x="${this.X(0) - 4}" y="${this.Y(0) + 13}" text-anchor="end">0</text>`);
        a.push(`<text class="g-tick" x="${this.X(1)}" y="${this.Y(0) + 13}" text-anchor="middle">1</text>`);
        a.push(`<text class="g-tick" x="${this.X(0) - 5}" y="${this.Y(1) + 4}" text-anchor="end">1</text>`);
      }
      this.parts.push(a.join(""));
    }

    poly(pts, cls = "g-fig", closed = true) {
      const tag = closed ? "polygon" : "polyline";
      this.parts.push(`<${tag} class="${cls}" points="${pts.map((p) => this.P(p)).join(" ")}"/>`);
      return this;
    }
    seg(p, q, cls = "g-line") {
      this.parts.push(`<line class="${cls}" x1="${fmt(this.X(p[0]))}" y1="${fmt(this.Y(p[1]))}" x2="${fmt(this.X(q[0]))}" y2="${fmt(this.Y(q[1]))}"/>`);
      return this;
    }
    // rechte door p met richting d, afgeknipt op het tekenvenster; label bij het einde
    line(p, d, label, cls = "g-elem") {
      const ts = [];
      const lim = [[this.xmin, this.xmax], [this.ymin, this.ymax]];
      for (let k = 0; k < 2; k++) {
        if (Math.abs(d[k]) < 1e-9) continue;
        for (const v of lim[k]) ts.push((v - p[k]) / d[k]);
      }
      const inside = (t) => { const x = p[0] + t * d[0], y = p[1] + t * d[1]; return x >= this.xmin - 1e-6 && x <= this.xmax + 1e-6 && y >= this.ymin - 1e-6 && y <= this.ymax + 1e-6; };
      const ok = ts.filter(inside).sort((a, b) => a - b);
      const t0 = ok[0], t1 = ok[ok.length - 1];
      const A = [p[0] + t0 * d[0], p[1] + t0 * d[1]], B = [p[0] + t1 * d[0], p[1] + t1 * d[1]];
      this.seg(A, B, cls);
      if (label) {
        // label net binnen het venster bij het "bovenste/rechtse" uiteinde
        const E = B[1] > A[1] || (B[1] === A[1] && B[0] > A[0]) ? B : A;
        const back = E === B ? -0.45 : 0.45;
        const L = [E[0] + back * d[0] / Math.hypot(...d), E[1] + back * d[1] / Math.hypot(...d)];
        this.label(L, label, "g-elemlbl", [10, -6], true);
      }
      return this;
    }
    vector(p, q, labels, cls = "g-vec") {
      this.parts.push(`<line class="${cls}" x1="${fmt(this.X(p[0]))}" y1="${fmt(this.Y(p[1]))}" x2="${fmt(this.X(q[0]))}" y2="${fmt(this.Y(q[1]))}" marker-end="url(#g-arr-vec)"/>`);
      if (labels) {
        this.dot(p, "g-vecdot"); this.dot(q, "g-vecdot");
        this.label(p, labels[0], "g-veclbl", [-8, -8]);
        this.label(q, labels[1], "g-veclbl", [6, -8]);
      }
      return this;
    }
    dot(p, cls = "g-dot", r = 3.6) {
      this.top.push(`<circle class="${cls}" cx="${fmt(this.X(p[0]))}" cy="${fmt(this.Y(p[1]))}" r="${r}"/>`);
      return this;
    }
    label(p, text, cls = "g-lbl", off = [6, -6], italic = false) {
      const anchor = off[0] < 0 ? "end" : "start";
      this.top.push(`<text class="${cls}${italic ? " it" : ""}" x="${fmt(this.X(p[0]) + off[0])}" y="${fmt(this.Y(p[1]) + off[1])}" text-anchor="${anchor}">${esc(text)}</text>`);
      return this;
    }
    point(p, text, cls = "g-dot", off) { this.dot(p, cls); if (text) this.label(p, text, cls === "g-dot" ? "g-lbl" : cls + "-lbl", off || [6, -6]); return this; }
    circle(c, r, cls = "g-fig") { this.parts.push(`<circle class="${cls}" cx="${fmt(this.X(c[0]))}" cy="${fmt(this.Y(c[1]))}" r="${fmt(r * this.u)}"/>`); return this; }
    ellipse(c, rx, ry, cls = "g-solid") { this.parts.push(`<ellipse class="${cls}" cx="${fmt(this.X(c[0]))}" cy="${fmt(this.Y(c[1]))}" rx="${fmt(rx * this.u)}" ry="${fmt(ry * this.u)}"/>`); return this; }
    // halve ellips (voor/achterkant), van hoek a0 naar a1 (radialen)
    arcE(c, rx, ry, a0, a1, cls = "g-solid") {
      const n = 40, pts = [];
      for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([c[0] + rx * Math.cos(a), c[1] + ry * Math.sin(a)]); }
      return this.poly(pts, cls, false);
    }
    raw(s) { this.parts.push(s); return this; }

    svg(extraCls = "") {
      const c = this.opts.clickable;
      const data = true ? ` data-xmin="${this.xmin}" data-xmax="${this.xmax}" data-ymin="${this.ymin}" data-ymax="${this.ymax}" data-unit="${this.u}" data-pad="${this.pad}"` : "";
      return `<svg class="geo ${extraCls}${c ? " clickable" : ""}" viewBox="0 0 ${fmt(this.w)} ${fmt(this.h)}" width="${fmt(this.w)}" height="${fmt(this.h)}"${data} xmlns="http://www.w3.org/2000/svg">
<defs>
 <marker id="g-arr-axis" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="g-axis-head"/></marker>
 <marker id="g-arr-vec" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="g-vec-head"/></marker>
</defs>${this.parts.join("")}<g class="g-top">${this.top.join("")}</g><g class="g-marks"></g></svg>`;
    }
  }

  // Ruimtefiguren in schuine projectie (diepte naar rechtsboven)
  const DEPTH = [0.55, 0.38];
  function box(plot, w, h, d, o = [0, 0]) {
    const D = [DEPTH[0] * d, DEPTH[1] * d];
    const p = (x, y, z) => [o[0] + x + D[0] * z, o[1] + y + D[1] * z];
    const A = p(0, 0, 0), B = p(w, 0, 0), C = p(w, h, 0), E = p(0, h, 0);
    const A2 = p(0, 0, 1), B2 = p(w, 0, 1), C2 = p(w, h, 1), E2 = p(0, h, 1);
    plot.poly([A, B, C, E], "g-solid");
    plot.poly([E, E2, C2, C], "g-solid", false).poly([C2, B2, B], "g-solid", false);
    plot.seg(A, A2, "g-hidden").seg(A2, B2, "g-hidden").seg(A2, E2, "g-hidden");
    return plot;
  }

  window.Geo = { Plot, box, DEPTH };
})();
