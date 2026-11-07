// ============================================================
// Vakkenregister. Elk vak (eigenlijk: vak + hoofdstuk/cahier) is een
// zelfstandige module in vakken/<id>/ die zich hier registreert.
//
//   vakken/<id>/inhoud.js  → de leerstof (data; hier stuur je inhoud bij)
//   vakken/<id>/vak.js     → de vraagtypes en verbetering (logica)
//
// Een vakmodule levert dit object aan Vakken.register({...}):
//
//   id        unieke code, ook gebruikt in de link (#v/<id>) en de voortgang
//   vak       vaknaam voor het hoofdmenu ("Frans", "Wiskunde", …)
//   icon      emoji voor de kaart
//   theme     kleurthema: "rose" | "blue" | "green" | "amber"
//   titel     titel van het hoofdstuk/cahier
//   klas      leerjaar, bv. "5de leerjaar" of "2de middelbaar"
//   bron      handboek/cursus
//   groups    [{ id, short, titel, p }]  – missies, doelen, hoofdstukken
//   units     [{ id, group, label, page, kind?, defaultOn? }] – selecteerbare onderdelen
//   kinds     optioneel { kind: "Kop" } – subkoppen binnen een groep
//   quick     [{ label, select(unit) → bool }] – snelkeuzeknoppen
//   settings  extra instellingen: [{ key, label, type: "radio"|"checkbox", options?, default, inAllInfo?, showIf?(s) }]
//   levels    { easy|normal|hard: { title, desc } }
//   allInfo   HTML-uitleg bij "Alle" (eindtoets)
//   keyboard  optioneel: extra toetsen bij typvragen (bv. Franse accenten) + keyboardLabel
//   statusText  optioneel: extra statusteksten (bv. { accent: "Bijna: let op het accent." })
//   tags      { fouttype: { title, advice, page } } – gebruikt in resultaat én voortgang
//   makeQuiz(settings) → vragen      countAll(settings) → aantal
//   check(given, q, level) → { status: correct|equiv|…|wrong, points, tag?, note? }
//   conclusions(results) → [{ type: good|ok|bad, text }]   (vak-specifieke analyse)
//   regen(q, level) → nieuwe vraag van hetzelfde soort (optioneel)
//
// Een vraag (q) bevat minstens: unit, unitLabel, group, page, instruction (HTML),
// prompt (HTML), mode (mc|text|num|coord|click), answerShown (HTML) en key (stabiel
// id voor de voortgang). Zie docs/VAK-TOEVOEGEN.md.
// ============================================================
(function () {
  "use strict";
  const list = [];
  const inhoud = {};
  window.Vakken = {
    list,
    register(mod) {
      if (list.some((v) => v.id === mod.id)) throw new Error("Vak bestaat al: " + mod.id);
      list.push(mod);
    },
    get: (id) => list.find((v) => v.id === id),
    // inhoud.js-bestanden registreren hun leerstof hier; vak.js haalt ze op
    setInhoud(id, data) { inhoud[id] = data; },
    inhoud: (id) => inhoud[id],
  };
})();
