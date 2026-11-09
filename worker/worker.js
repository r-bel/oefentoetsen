// ============================================================
// oefentoetsen-sync – Cloudflare Worker (gratis abonnement volstaat)
// Bewaart per synccode één versleuteld pakket. De server kent de code niet:
// hij krijgt enkel een id (SHA-256 van de code) en versleutelde gegevens (AES-GCM).
//
//   GET    /s/<id>   → het pakket (204 = nog niets)
//   PUT    /s/<id>   → pakket bewaren (max. 2 MB)
//   DELETE /s/<id>   → pakket wissen
//
// Opslag: Workers KV (binding SYNC). Pakketten die 400 dagen niet bijgewerkt worden,
// verdwijnen vanzelf. Enkel de sites in ORIGINS mogen de API vanuit een browser gebruiken.
// ============================================================
const MAX = 2_000_000;
const TTL = 60 * 60 * 24 * 400;

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = (env.ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    const okOrigin = !origin || allowed.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": okOrigin && origin ? origin : allowed[0] || "",
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };
    const res = (body, status = 200, extra = {}) => new Response(body, { status, headers: { ...cors, "Cache-Control": "no-store", ...extra } });
    if (req.method === "OPTIONS") return res(null, 204);
    const url = new URL(req.url);
    if (url.pathname === "/") return res("oefentoetsen-sync ok");
    const m = url.pathname.match(/^\/s\/([a-f0-9]{64})$/);
    if (!m) return res("niet gevonden", 404);
    if (!okOrigin) return res("niet toegelaten", 403);
    const key = "s:" + m[1];

    if (req.method === "GET") {
      const v = await env.SYNC.get(key);
      return v ? res(v, 200, { "Content-Type": "application/json" }) : res(null, 204); // 204 = nog niets bewaard
    }
    if (req.method === "PUT") {
      if (+(req.headers.get("Content-Length") || 0) > MAX) return res("te groot", 413);
      const body = await req.text();
      if (body.length > MAX) return res("te groot", 413);
      let o; try { o = JSON.parse(body); } catch (e) { return res("ongeldig", 400); }
      if (!o || typeof o.iv !== "string" || typeof o.ct !== "string") return res("ongeldig", 400);
      await env.SYNC.put(key, body, { expirationTtl: TTL });
      return res(JSON.stringify({ ok: true }), 200, { "Content-Type": "application/json" });
    }
    if (req.method === "DELETE") {
      await env.SYNC.delete(key);
      return res(JSON.stringify({ ok: true }), 200, { "Content-Type": "application/json" });
    }
    return res("methode niet toegelaten", 405);
  },
};
