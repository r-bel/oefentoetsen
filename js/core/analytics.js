// ============================================================
// Bezoekersstatistieken (optioneel, standaard UIT).
// Enkel actief als APP_CONFIG.goatcounterCode ingevuld is.
// Telt anonieme gebeurtenissen: welk vak geopend/gestart/afgerond.
// ============================================================
(function () {
  "use strict";
  const code = (window.APP_CONFIG || {}).goatcounterCode;
  const queue = [];
  if (code && location.protocol.startsWith("http")) {
    const s = document.createElement("script");
    s.async = true; s.src = "https://gc.zgo.at/count.js";
    s.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
    s.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
    s.onload = () => { queue.splice(0).forEach((e) => send(e)); };
    document.head.appendChild(s);
  }
  function send(e) {
    if (window.goatcounter && window.goatcounter.count) window.goatcounter.count(e);
    else if (code) queue.push(e);
  }
  window.Analytics = {
    page(path, title) { if (code) send({ path, title }); },
    event(name) { if (code) send({ path: name, title: name, event: true }); },
  };
})();
