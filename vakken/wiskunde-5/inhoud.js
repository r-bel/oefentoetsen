// ============================================================
// INHOUD – Wiskunde 5de leerjaar · herhaling les 1 t/m 12
// Bron: herhalingsbladen 10A–10G ter voorbereiding van de toets.
//
// De oefeningen zelf worden telkens nieuw berekend in vak.js (andere getallen elke keer).
// Hier stuur je bij: de onderdelen (naam, uitleg bij een fout), de begrippen voor de
// flashcards, de fouttypes met tips en de moeilijkheidsgraden.
// Uitleg in eigen woorden (V–B–A bij vraagstukken,
// "Ik schat" bij cijferen, VM/NM bij de klok).
// ============================================================
(function () {
  const GROUPS = [
    { id: "G", titel: "Getallenkennis – breuken", short: "breuken", p: "10A-10B" },
    { id: "H", titel: "Hoofdrekenen met breuken", short: "hoofdrekenen", p: "10C" },
    { id: "C", titel: "Cijferen met kommagetallen", short: "cijferen", p: "10D-10E" },
    { id: "M", titel: "Meten: klok en winst/verlies", short: "meten", p: "10F-10G" },
  ];

  // onderdelen: naam, blad, uitleg die verschijnt bij een fout
  const UNITS = {
    gehelen: { group: "G", label: "Onechte breuk → gehelen en een breuk", page: "10A oef 1",
      rule: "Hoeveel keer past de noemer in de teller? Dat zijn de gehelen; wat overblijft is de nieuwe teller. 12/5 → 5 past 2 keer in 12, rest 2 → 2 en 2/5." },
    breuk: { group: "G", label: "Gehelen en een breuk → breuk", page: "10A oef 2",
      rule: "Gehelen × noemer + teller = nieuwe teller; de noemer blijft. 3 en 7/8 → 3 × 8 + 7 = 31 → 31/8." },
    vereenvoudig: { group: "G", label: "Breuken vereenvoudigen", page: "10A oef 3",
      rule: "Deel teller én noemer door hetzelfde getal, zo groot mogelijk (de grootste gemeenschappelijke deler). 12/16 → beide delen door 4 → 3/4." },
    ordenen: { group: "G", label: "Breuken ordenen (klein → groot)", page: "10A oef 4",
      rule: "Maak de breuken eerst gelijknamig (zelfde noemer). Dan vergelijk je enkel de tellers. Bij dezelfde teller: hoe groter de noemer, hoe kleiner de breuk." },
    gelijkwaardig: { group: "G", label: "Gelijkwaardige breuken", page: "10B oef 5",
      rule: "Gelijkwaardige breuken hebben dezelfde waarde: teller en noemer zijn met hetzelfde getal vermenigvuldigd of gedeeld. 1/2 = 4/8 = 5/10." },
    getallenas: { group: "G", label: "Breuken op de getallenas", page: "10B oef 6",
      rule: "Zet alle breuken op dezelfde noemer als de streepjes van de as (hier achtsten tussen 0 en 1). 3/4 = 6/8 → het 6de streepje na 0." },
    optellen: { group: "H", label: "Breuken optellen", page: "10C oef 7",
      rule: "Maak de breuken eerst gelijknamig, tel dan enkel de tellers op; de noemer blijft. Vereenvoudig de uitkomst waar het kan. 1/4 + 1/5 = 5/20 + 4/20 = 9/20." },
    aftrekken: { group: "H", label: "Breuken aftrekken", page: "10C oef 8",
      rule: "Maak de breuken eerst gelijknamig, trek dan de tellers af; de noemer blijft. Bij 3 − 1/9: schrijf 3 als 27/9. Vereenvoudig waar het kan." },
    breukvan: { group: "H", label: "Een breuk van een getal", page: "10C oef 9",
      rule: "Eerst delen door de noemer, dan vermenigvuldigen met de teller. 2/3 van 18 = (18 : 3) × 2 = 12." },
    cijfer_plusmin: { group: "C", label: "Kommagetallen optellen en aftrekken", page: "10D oef 10",
      rule: "Zet komma onder komma (eenheden onder eenheden). Vul aan met nullen zodat elk getal evenveel cijfers na de komma heeft. Schat eerst, controleer daarna." },
    cijfer_maal: { group: "C", label: "Vermenigvuldigen met een kommagetal", page: "10D-10E oef 10",
      rule: "Reken eerst zonder komma. Tel daarna hoeveel cijfers na de komma er in de opgave staan: zoveel cijfers na de komma in de uitkomst. Je schatting toont of de komma goed staat." },
    cijfer_deel: { group: "C", label: "Delen met rest (q en r)", page: "10D-10E oef 10",
      rule: "Deel zoals gewoonlijk; zet de komma in het quotiënt zodra je de komma van het deeltal passeert. Stop bij evenveel cijfers na de komma als in het deeltal. Controle: q × deler + r = deeltal." },
    schatten: { group: "C", label: "Schatten", page: "10D-10E oef 10",
      rule: "Rond af naar getallen waarmee je makkelijk rekent (bv. 28,056 → 28 en 4,982 → 5) en reken met die afgeronde getallen." },
    klok_lezen: { group: "M", label: "Klok lezen: VM en NM", page: "10F oef 11",
      rule: "Korte wijzer = uren, lange wijzer = minuten, dunne wijzer = seconden. VM (voormiddag) = 0 tot 12 uur, NM (namiddag) = 12 tot 24 uur: tel 12 bij het uur. 3:45 VM = 15:45 NM." },
    tijdsverschil: { group: "M", label: "Tijdsverschil berekenen", page: "10F oef 11",
      rule: "Tel verder vanaf het vroegste tijdstip: eerst tot een rond uur, dan de hele uren, dan de rest. Of: trek af en wissel 1 uur in voor 60 minuten (en 1 minuut voor 60 seconden) als het nodig is." },
    klok_kiezen: { group: "M", label: "Welke klok? (wijzers)", page: "10F oef 12",
      rule: "Let op de kleine wijzer: om 1:50 staat hij bijna op de 2. 'Half twee' is 1:30 (een half uur vóór twee uur); 'tien voor half twee' is 1:20." },
    uur_woorden: { group: "M", label: "Uur in woorden ↔ digitaal", page: "10F oef 12",
      rule: "'Half twee' = 1:30 (half op weg naar twee). 'Vijf over half drie' = 2:35. 'Kwart voor vier' = 3:45. Bij 'voor half' en 'over half' tel je vanaf het halve uur." },
    winst: { group: "M", label: "Vraagstukken: inkoopprijs, verkoopprijs, winst", page: "10G oef 13",
      rule: "Verkoopprijs = inkoopprijs + winst · Inkoopprijs = verkoopprijs − winst · Winst = verkoopprijs − inkoopprijs · Verlies = inkoopprijs − verkoopprijs. Werk met V (vraag), B (bewerking), A (antwoord)." },
    begrippen: { group: "M", label: "Begrippen (flashcards)", page: "les 1-12",
      rule: "Leer de woorden zoals in de klas: teller, noemer, gelijknamig, vereenvoudigen, gelijkwaardig, quotiënt (q), rest (r), VM/NM, inkoopprijs, verkoopprijs, winst, verlies." },
  };

  // begrippen: vraag (voorkant) → antwoord (achterkant); eigen woorden
  const BEGRIPPEN = [
    { q: "Hoe heet het getal ONDER de breukstreep?", a: "de noemer", x: "3/8: 8 is de noemer (in hoeveel gelijke delen verdeeld)" },
    { q: "Hoe heet het getal BOVEN de breukstreep?", a: "de teller", x: "3/8: 3 is de teller (hoeveel delen je neemt)" },
    { q: "Breuken met dezelfde noemer noemen we …", a: "gelijknamige breuken", x: "2/5 en 4/5 zijn gelijknamig" },
    { q: "Breuken met dezelfde waarde noemen we …", a: "gelijkwaardige breuken", x: "1/2 = 4/8 = 5/10" },
    { q: "Een breuk waarvan de teller groter is dan de noemer heet een …", a: "onechte breuk", x: "12/5 = 2 en 2/5" },
    { q: "Teller en noemer delen door hetzelfde getal heet …", a: "vereenvoudigen", x: "12/16 = 3/4 (delen door 4)" },
    { q: "Hoe neem je 2/3 van 18?", a: "eerst : 3, dan × 2", x: "(18 : 3) × 2 = 12" },
    { q: "Wat betekenen q en r bij een deling?", a: "q = quotiënt (uitkomst), r = rest", x: "controle: q × deler + r = deeltal" },
    { q: "Waar zet je de komma bij optellen en aftrekken onder elkaar?", a: "komma onder komma", x: "eenheden onder eenheden; vul aan met nullen" },
    { q: "Wat betekenen VM en NM?", a: "VM = voormiddag (0–12 u), NM = namiddag (12–24 u)", x: "4:15 VM = 16:15 NM" },
    { q: "Hoe laat is 'tien voor half twee'?", a: "1:20 (of 13:20)", x: "half twee = 1:30, tien minuten vroeger" },
    { q: "Verkoopprijs = …", a: "inkoopprijs + winst", x: "€ 37 + € 8 = € 45" },
    { q: "Inkoopprijs = …", a: "verkoopprijs − winst", x: "€ 45 − € 8 = € 37" },
    { q: "Wanneer maak je verlies?", a: "als de verkoopprijs kleiner is dan de inkoopprijs", x: "verlies = inkoopprijs − verkoopprijs" },
    { q: "Wat doe je eerst bij een cijferoefening?", a: "schatten", x: "28,056 + 4,982 → ik schat 28 + 5 = 33" },
  ];

  // uur in woorden (5 minuten-stappen); {u} = het uur, {v} = het volgende uur
  const UUR_WOORDEN = {
    0: "{u} uur", 5: "vijf over {u}", 10: "tien over {u}", 15: "kwart over {u}", 20: "tien voor half {v}", 25: "vijf voor half {v}",
    30: "half {v}", 35: "vijf over half {v}", 40: "tien over half {v}", 45: "kwart voor {v}", 50: "tien voor {v}", 55: "vijf voor {v}",
  };
  const GETAL_WOORD = ["twaalf", "een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien", "elf", "twaalf"];

  // vraagstukken winst/verlies: {n} = aantal, {x} = artikel enkelvoud, {xs} = meervoud
  const WINKELS = [
    { wie: "Stan", winkel: "speelgoedwinkel", x: "skateboard", xs: "skateboards", vp: [35, 60], w: [5, 12] },
    { wie: "Lotte", winkel: "fietsenwinkel", x: "fietshelm", xs: "fietshelmen", vp: [25, 55], w: [4, 15] },
    { wie: "Mo", winkel: "sportwinkel", x: "voetbal", xs: "voetballen", vp: [15, 30], w: [3, 9] },
    { wie: "Ines", winkel: "boekenwinkel", x: "strip", xs: "strips", vp: [9, 16], w: [2, 5] },
    { wie: "Jens", winkel: "muziekwinkel", x: "ukelele", xs: "ukeleles", vp: [40, 80], w: [8, 20] },
  ];

  const TAGS = {
    gehelen: { title: "Gehelen uit een breuk halen", short: "gehelen", advice: "Hoeveel keer past de noemer in de teller? Dat zijn de gehelen; de rest wordt de teller.", page: "10A" },
    breuk_omzetten: { title: "Gehelen omzetten naar een breuk", short: "omzetten", advice: "Gehelen × noemer + teller. Vergeet de teller niet op te tellen.", page: "10A" },
    niet_vereenvoudigd: { title: "Niet (volledig) vereenvoudigd", short: "vereenvoudigen", advice: "Zoek het grootste getal waardoor teller én noemer deelbaar zijn. Kan het nog verder? Dan opnieuw delen.", page: "10A" },
    ordenen: { title: "Breuken vergelijken", short: "ordenen", advice: "Maak eerst gelijknamig. Zelfde teller: een grotere noemer geeft een kleinere breuk (3/16 < 3/8).", page: "10A" },
    gelijkwaardig: { title: "Gelijkwaardige breuken", short: "gelijkwaardig", advice: "Vermenigvuldig of deel teller en noemer met hetzelfde getal.", page: "10B" },
    getallenas: { title: "Breuk op de getallenas", short: "getallenas", advice: "Tel de streepjes tussen 0 en 1: dat is de noemer. Zet de breuk op die noemer en tel zoveel streepjes vanaf 0.", page: "10B" },
    noemers_opgeteld: { title: "Noemers opgeteld of afgetrokken", short: "noemers", advice: "Noemers tel je nooit op! Maak eerst gelijknamig; enkel de tellers tel je op of trek je af.", page: "10C" },
    gelijknamig: { title: "Gelijknamig maken", short: "gelijknamig", advice: "Zoek een gemeenschappelijke noemer (een veelvoud van beide noemers) en pas de tellers aan.", page: "10C" },
    breukvan: { title: "Breuk van een getal", short: "breuk van", advice: "Eerst delen door de noemer, dan maal de teller.", page: "10C" },
    komma: { title: "Komma op de verkeerde plaats", short: "komma", advice: "Schat eerst: je schatting toont hoe groot de uitkomst ongeveer moet zijn. Komma onder komma bij + en −; bij × tel je de cijfers na de komma.", page: "10D" },
    rekenfout: { title: "Rekenfout bij cijferen", short: "rekenfout", advice: "Werk netjes in het rooster, onthoud de overdrachten en controleer met je schatting.", page: "10D" },
    rest: { title: "Quotiënt of rest", short: "q en r", advice: "Controle: q × deler + r moet het deeltal geven. De rest is altijd kleiner dan de deler.", page: "10D" },
    schatten: { title: "Schatten", short: "schatten", advice: "Rond af naar makkelijke getallen en reken daarmee.", page: "10D" },
    vm_nm: { title: "VM en NM", short: "VM/NM", advice: "NM = uur + 12 (2:30 VM → 14:30 NM).", page: "10F" },
    wijzers: { title: "Uur- en minutenwijzer verwisseld", short: "wijzers", advice: "De korte, dikke wijzer toont het uur; de lange de minuten.", page: "10F" },
    half: { title: "'Half twee' en co.", short: "half", advice: "'Half twee' is 1:30, niet 2:30: het is een half uur vóór twee uur.", page: "10F" },
    tijdsverschil: { title: "Tijdsverschil", short: "tijd", advice: "Tel verder in stappen: tot een rond uur, dan hele uren, dan de rest. 1 uur = 60 minuten.", page: "10F" },
    winst: { title: "Winst en verlies", short: "winst", advice: "VP = IP + winst. Lees goed: per stuk of in totaal?", page: "10G" },
    fout: { title: "Fout", short: "fout", advice: "", page: "" },
  };

  Vakken.setInhoud("wiskunde-5", {
    vak: "Wiskunde", icon: "🧮", theme: "green",
    titel: "Breuken, cijferen, klok en winst", klas: "5de leerjaar",
    bron: "herhaling les 1-12",
    levels: {
      easy: { title: "🙂 Makkelijk", desc: "veel meerkeuze, kleinere getallen" },
      normal: { title: "💪 Normaal", desc: "meerkeuze + zelf invullen; niet vereenvoudigd telt nog als goed" },
      hard: { title: "🔥 Moeilijk", desc: "alles zelf invullen, uitkomst altijd vereenvoudigen" },
    },
    allInfo: "<b>Eindtoets-modus:</b> elk soort oefening uit de gekozen onderdelen komt aan bod, zoals op de herhalingsbladen.",
    GROUPS, UNITS, BEGRIPPEN, UUR_WOORDEN, GETAL_WOORD, WINKELS, TAGS,
  });
})();
