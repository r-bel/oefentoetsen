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
    { id: "G", titel: "Getallenkennis: getallen tot 1 000 000, breuken, rijen, kans", short: "getallenkennis", p: "" },
    { id: "H", titel: "Hoofdrekenen: breuken, natuurlijke getallen, kommagetallen", short: "hoofdrekenen", p: "" },
    { id: "C", titel: "Cijferen met kommagetallen", short: "cijferen", p: "" },
    { id: "M", titel: "Meten en metend rekenen: klok, winst/verlies, hoeken", short: "meten", p: "" },
    { id: "K", titel: "Meetkunde: vierhoeken, driehoeken, cirkel", short: "meetkunde", p: "" },
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
      rule: "Rode wijzer = uren, blauwe wijzer = minuten, groene wijzer = seconden. VM (voormiddag) = 0 tot 12 uur, NM (namiddag) = 12 tot 24 uur: tel 12 bij het uur. 3:45 VM = 15:45 NM." },
    tijdsverschil: { group: "M", label: "Tijdsverschil berekenen", page: "10F oef 11",
      rule: "Tel verder vanaf het vroegste tijdstip: eerst tot een rond uur, dan de hele uren, dan de rest. Of: trek af en wissel 1 uur in voor 60 minuten (en 1 minuut voor 60 seconden) als het nodig is." },
    klok_kiezen: { group: "M", label: "Welke klok? (wijzers)", page: "10F oef 12",
      rule: "Let op de kleine wijzer: om 1:50 staat hij bijna op de 2. 'Half twee' is 1:30 (een half uur vóór twee uur); 'tien voor half twee' is 1:20." },
    uur_woorden: { group: "M", label: "Uur in woorden ↔ digitaal", page: "10F oef 12",
      rule: "'Half twee' = 1:30 (half op weg naar twee). 'Vijf over half drie' = 2:35. 'Kwart voor vier' = 3:45. Bij 'voor half' en 'over half' tel je vanaf het halve uur." },
    winst: { group: "M", label: "Vraagstukken: inkoopprijs, verkoopprijs, winst", page: "10G oef 13",
      rule: "Verkoopprijs = inkoopprijs + winst · Inkoopprijs = verkoopprijs − winst · Winst = verkoopprijs − inkoopprijs · Verlies = inkoopprijs − verkoopprijs. Werk met V (vraag), B (bewerking), A (antwoord)." },
    // ---- toetswijzer: aanvullingen (eigen oefeningen) ----
    getal_lezen: { group: "G", label: "Getallen tot 1 000 000 lezen en schrijven", page: "toetswijzer getallenkennis",
      rule: "Lees per groep van drie: eerst de duizendtallen, dan 'duizend', dan de rest. 305 040 = driehonderdvijfduizend veertig. Elke groep na 'duizend' heeft 3 cijfers: vul aan met nullen (veertig → 040). Schrijf aaneen; na 'duizend' een spatie." },
    plaatswaarde: { group: "G", label: "Waarde van een cijfer: M, HD, TD, D, H, T, E", page: "toetswijzer getallenkennis",
      rule: "M = miljoen · HD = honderdduizendtal · TD = tienduizendtal · D = duizendtal · H = honderdtal · T = tiental · E = eenheid. 98 705 = 9 TD, 8 D, 7 H en 5 E (0 T). Hoeveel D in totaal in 487 305? → 487 D." },
    rijen: { group: "G", label: "Rijen aanvullen met een gegeven sprong", page: "toetswijzer getallenkennis",
      rule: "Doe telkens dezelfde sprong vanaf het vorige getal (+ = groter, − = kleiner). Controleer: het getal na een gat moet weer kloppen met de sprong. Breuken: tel enkel de tellers op als de noemer gelijk is." },
    kans: { group: "G", label: "Kansberekening", page: "toetswijzer getallenkennis",
      rule: "Kans = aantal gunstige mogelijkheden op het totaal aantal mogelijkheden. Dobbelsteen: 6 mogelijkheden. 3 rode op 10 knikkers → kans op rood = 3 op 10 = 3/10. Woorden: onmogelijk (0) – kleine kans – even veel kans als geen kans (1/2) – grote kans – zeker (1)." },
    hr_nat: { group: "H", label: "Hoofdrekenen met natuurlijke getallen (rekentrucjes)", page: "toetswijzer hoofdrekenen",
      rule: "× 5 = × 10 : 2 · × 25 = × 100 : 4 · × 50 = × 100 : 2 · : 5 = × 2 : 10 · : 25 = × 4 : 100 · : 50 = × 2 : 100. + 1 998 = + 2 000 − 2. Splits: 48 × 6 = 40 × 6 + 8 × 6." },
    hr_komma: { group: "H", label: "Hoofdrekenen met kommagetallen", page: "toetswijzer hoofdrekenen",
      rule: "× 10, 100, 1000: komma 1, 2, 3 plaatsen naar rechts · : 10, 100, 1000: naar links. 0,25 × 8: reken 25 × 8 = 200 honderdsten = 2. 4,8 : 6 = 48 tienden : 6 = 8 tienden = 0,8. Ook hier: × 5 = × 10 : 2, × 25 = × 100 : 4." },
    breuk_geheel: { group: "H", label: "Breuk optellen bij / aftrekken van een natuurlijk getal", page: "toetswijzer hoofdrekenen",
      rule: "Schrijf het getal als breuk met dezelfde noemer: 1 + 1/4 = 4/4 + 1/4 = 5/4 · 3 − 2/3 = 9/3 − 2/3 = 7/3." },
    hoek_soort: { group: "M", label: "Soort hoek: scherp, recht, stomp", page: "toetswijzer meten",
      rule: "Scherpe hoek: kleiner dan 90° · rechte hoek: precies 90° · stompe hoek: groter dan 90° (en kleiner dan 180°). Twijfel je? Meet met de geodriehoek." },
    hoek_meten: { group: "M", label: "Hoeken meten tot op 1°", page: "toetswijzer meten",
      rule: "Leg het middelpunt van de gradenboog op het hoekpunt en de 0-lijn op het eerste been. Lees de schaal die bij dat been op 0 begint (buiten of binnen). Elk klein streepje = 1°. Controleer: scherpe hoek < 90°, stompe hoek > 90°." },
    hoek_tekenen: { group: "M", label: "Hoeken tekenen tot op 1°", page: "toetswijzer meten",
      rule: "Teken het eerste been, leg het middelpunt op het hoekpunt en 0 op het been. Zet een stipje bij het juiste aantal graden (op de schaal die op 0 begint bij jouw been) en verbind met het hoekpunt." },
    vierhoeken: { group: "K", label: "Vierhoeken: eigenschappen controleren en benoemen (vierhoekentoren)", page: "toetswijzer meetkunde",
      rule: "Controleer: zijn overstaande zijden evenwijdig? Zijn de zijden even lang? Zijn de hoeken recht? Toren: vierhoek → trapezium (min. 1 paar evenwijdige zijden) → parallellogram (2 paar) → rechthoek (4 rechte hoeken) en ruit (4 gelijke zijden) → vierkant (allebei)." },
    driehoeken: { group: "K", label: "Driehoeken benoemen volgens zijden en hoeken", page: "toetswijzer meetkunde",
      rule: "Hoeken: scherphoekig (3 scherpe hoeken), rechthoekig (1 rechte hoek), stomphoekig (1 stompe hoek). Zijden: gelijkzijdig (3 gelijke zijden), gelijkbenig (2 gelijke zijden), ongelijkzijdig (geen gelijke zijden). De 3 hoeken samen = 180°." },
    cirkel: { group: "K", label: "Cirkel: middelpunt, straal, diameter, passeropening", page: "toetswijzer meetkunde",
      rule: "Passeropening = straal. Diameter = 2 × straal (dwars door het middelpunt). Alle punten van de cirkel liggen even ver (de straal) van het middelpunt." },
    vierhoek_tekenen: { group: "K", label: "Een gevraagde vierhoek tekenen (rooster)", page: "toetswijzer meetkunde",
      rule: "Rechthoek: 4 rechte hoeken, overstaande zijden even lang. Vierkant: ook 4 gelijke zijden. Parallellogram: van C ga je dezelfde stap als van B naar A. Ruit: 4 gelijke zijden. Tel de hokjes en controleer met je geodriehoek." },
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
    { q: "Wat betekenen M, HD, TD, D, H, T, E?", a: "miljoen, honderdduizendtal, tienduizendtal, duizendtal, honderdtal, tiental, eenheid", x: "98 705 = 9 TD, 8 D, 7 H en 5 E" },
    { q: "Hoe bereken je een kans?", a: "aantal gunstige mogelijkheden op het totaal aantal mogelijkheden", x: "3 rode op 10 knikkers → 3 op 10 = 3/10" },
    { q: "Rekentruc × 25 en : 25?", a: "× 25 = × 100 : 4 · : 25 = × 4 : 100", x: "36 × 25 = 3 600 : 4 = 900" },
    { q: "Rekentruc × 50 en : 50?", a: "× 50 = × 100 : 2 · : 50 = × 2 : 100", x: "68 × 50 = 6 800 : 2 = 3 400" },
    { q: "Rekentruc × 5 en : 5?", a: "× 5 = × 10 : 2 · : 5 = × 2 : 10", x: "486 × 5 = 4 860 : 2 = 2 430" },
    { q: "Scherpe, rechte en stompe hoek?", a: "scherp < 90° · recht = 90° · stomp > 90°", x: "meet met de gradenboog tot op 1°" },
    { q: "Welke vierhoek heeft 4 gelijke zijden en 4 rechte hoeken?", a: "het vierkant", x: "een vierkant is ook een rechthoek, ruit, parallellogram en trapezium" },
    { q: "Wat is een trapezium?", a: "een vierhoek met minstens 1 paar evenwijdige zijden", x: "een parallellogram heeft er 2 paar" },
    { q: "Gelijkbenige driehoek?", a: "2 gelijke zijden", x: "gelijkzijdig: 3 gelijke zijden · ongelijkzijdig: geen" },
    { q: "Stomphoekige driehoek?", a: "een driehoek met 1 stompe hoek", x: "rechthoekig: 1 rechte hoek · scherphoekig: 3 scherpe hoeken" },
    { q: "Passeropening voor een cirkel met diameter 8 cm?", a: "4 cm (de straal)", x: "diameter = 2 × straal" },
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
    wijzers: { title: "Uur- en minutenwijzer verwisseld", short: "wijzers", advice: "De rode (korte) wijzer toont het uur, de blauwe (lange) de minuten, de groene de seconden.", page: "10F" },
    half: { title: "'Half twee' en co.", short: "half", advice: "'Half twee' is 1:30, niet 2:30: het is een half uur vóór twee uur.", page: "10F" },
    tijdsverschil: { title: "Tijdsverschil", short: "tijd", advice: "Tel verder in stappen: tot een rond uur, dan hele uren, dan de rest. 1 uur = 60 minuten.", page: "10F" },
    winst: { title: "Winst en verlies", short: "winst", advice: "VP = IP + winst. Lees goed: per stuk of in totaal?", page: "10G" },
    getallen: { title: "Grote getallen lezen en schrijven", short: "getallen", advice: "Werk per groep van drie cijfers. Na 'duizend' volgt altijd een groep van 3 cijfers (veertig → 040).", page: "" },
    plaatswaarde: { title: "Plaatswaarde", short: "M HD TD …", advice: "Schrijf het getal in een tabel M | HD TD D | H T E. Lege plaats = 0.", page: "" },
    rijen: { title: "Rijen", short: "rijen", advice: "Doe telkens dezelfde sprong; controleer met het getal dat na het gat komt.", page: "" },
    kans: { title: "Kans", short: "kans", advice: "Kans = gunstig op totaal. Tel eerst alle mogelijkheden (alle knikkers, alle vakken, 6 bij een dobbelsteen).", page: "" },
    hoofdrekenen: { title: "Hoofdrekenen", short: "hoofdrekenen", advice: "Gebruik de rekentrucjes (× 5 = × 10 : 2, × 25 = × 100 : 4 …) en let op de plaats van de komma.", page: "" },
    hoeken: { title: "Soort hoek", short: "hoek", advice: "Scherp < 90° · recht = 90° · stomp > 90°.", page: "" },
    hoeken_meten: { title: "Hoeken meten/tekenen", short: "graden", advice: "0 op het eerste been, en lees de schaal die daar op 0 begint. Elk klein streepje = 1°.", page: "" },
    vierhoeken: { title: "Vierhoeken", short: "vierhoeken", advice: "Controleer evenwijdige zijden, gelijke zijden en rechte hoeken; gebruik de vierhoekentoren.", page: "" },
    driehoeken: { title: "Driehoeken", short: "driehoeken", advice: "Hoeken: scherp-, recht-, stomphoekig (kijk naar de grootste hoek). Zijden: gelijkzijdig, gelijkbenig, ongelijkzijdig.", page: "" },
    cirkel: { title: "Cirkel", short: "cirkel", advice: "Passeropening = straal = helft van de diameter.", page: "" },
    fout: { title: "Fout", short: "fout", advice: "", page: "" },
  };

  Vakken.setInhoud("wiskunde-5", {
    vak: "Wiskunde", icon: "🧮", theme: "green",
    titel: "Toetswijzer: getallenkennis, hoofdrekenen, cijferen, meten en meetkunde", klas: "5de leerjaar",
    bron: "herhaling les 1-12 + toetswijzer (aangevuld met eigen oefeningen)",
    levels: {
      easy: { title: "🙂 Makkelijk", desc: "veel meerkeuze, kleinere getallen" },
      normal: { title: "💪 Normaal", desc: "meerkeuze + zelf invullen; niet vereenvoudigd telt nog als goed" },
      hard: { title: "🔥 Moeilijk", desc: "alles zelf invullen, uitkomst altijd vereenvoudigen" },
    },
    allInfo: "<b>Eindtoets-modus:</b> elk soort oefening uit de gekozen onderdelen komt aan bod, zoals op de herhalingsbladen.",
    GROUPS, UNITS, BEGRIPPEN, UUR_WOORDEN, GETAL_WOORD, WINKELS, TAGS,
  });
})();
