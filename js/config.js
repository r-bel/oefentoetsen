// Instellingen van de site (geen code nodig om aan/uit te zetten).
window.APP_CONFIG = {
  titel: "Oefentoetsen",

  // Koffieknop (semi-commercieel)
  showCoffee: false,            // true = zichtbaar
  buyMeACoffeeUrl: "",          // bv. "https://buymeacoffee.com/<naam>" (leeg = "binnenkort"-melding)
  feedbackEmail: "",            // bv. "oefentoetsen@voorbeeld.be" (leeg = knop verborgen)

  // Bezoekersstatistieken (later). Privacyvriendelijk, zonder cookies.
  // GoatCounter: maak een gratis account (bv. "oefentoetsen") en vul de code in.
  // Dan worden paginabezoeken en per vak het starten/afronden van een toets geteld
  // (geen namen, geen antwoorden, geen scores per leerling).
  goatcounterCode: "oefentoetsen", // statistieken: https://oefentoetsen.goatcounter.com (leeg = uit)

  // Studiemodule: standaardwaarden voor elke leerling (een leerling/ouder kan ze
  // wijzigen via "Studie-instellingen"). Volledige lijst en uitleg: js/core/studie.js (DEFAULTS).
  studie: {
    minuten: 20,          // studietijd per dag, alle toetsen samen
    blok: 10,             // kaarten per blokje
    dagen: [1, 2, 3, 4, 5, 6, 0], // studiedagen: 1 = maandag … 6 = zaterdag, 0 = zondag
    proef: true,          // proeftoetsen in de laatste dagen opnemen
    proefDagen: 3,        // eerste proeftoets zoveel dagen voor de toets
    wiePlant: "iedereen", // "iedereen" of "ouder" (planning en instellingen achter een pincode)
  },
  // Synchronisatie tussen toestellen (synccode, zonder account). Adres van de Cloudflare Worker
  // uit de map worker/ (zie worker/SYNC-INSTALLATIE.md). Leeg = synchronisatie verborgen.
  syncUrl: "https://oefentoetsen-sync.dirkdhaenens.workers.dev",

  // "eigen" = enkel voor het eigen gezin; "gedeeld" = de site wordt breder gedeeld.
  // Vanaf fase 2 (leerkaarten) bepaalt dit hoe dicht uitleg bij het lesmateriaal mag blijven.
  gebruik: "eigen",
};
