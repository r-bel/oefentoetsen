// ============================================================
// INHOUD – Nederlands 2de middelbaar · les 6 Vragende voornaamwoorden, les 7 Het telwoord (p.53-60)
// De oefenzinnen zijn eigen zinnen in de stijl van het werkboek (geen teksten uit het boek).
// Een zin aanvullen = een regel bijplakken. [woord] = het onderstreepte/gemarkeerde woord.
// ============================================================
(function () {
  // ---------- les 6: vragende voornaamwoorden ----------
  // invullen: ___ = de plaats van het vragend voornaamwoord; a = aanvaarde antwoorden (eerste = getoond)
  const VVN_INVUL = [
    { z: "___ heeft mijn fiets geleend?", a: ["Wie"], x: "naar een persoon → wie" },
    { z: "___ ga je deze zomer doen?", a: ["Wat"], x: "naar een zaak/handeling → wat" },
    { z: "___ trein moet ik nemen naar Gent, die van 8 of die van 9 uur?", a: ["Welke"], x: "een keuze uit enkele mogelijkheden → welke" },
    { z: "___ boek lees je nu voor de klas?", a: ["Welk"], x: "een keuze, bij een het-woord → welk (bij de-woorden en meervoud: welke)" },
    { z: "Ik vond een gsm onder de bank. ___ gsm is dit? Van Jonas?", a: ["Wiens"], x: "van wie is iets (bezit) → wiens" },
    { z: "___ is de naam van je kat?", a: ["Wat"], x: "naar iets (de naam) → wat" },
    { z: "___ zit er naast jou in de klas?", a: ["Wie"], x: "naar een persoon → wie" },
    { z: "___ kleur heeft je nieuwe fiets?", a: ["Welke"], x: "een keuze uit kleuren → welke (de kleur)" },
    { z: "___ fiets staat er tegen de muur? Die van Sara?", a: ["Wiens"], x: "van wie is iets → wiens" },
    { z: "___ zou er gebeurd zijn als je beter had opgelet?", a: ["Wat"], x: "naar een zaak/gebeurtenis → wat" },
    { z: "___ sporten doe je graag?", a: ["Welke"], x: "een keuze, meervoud → welke" },
    { z: "___ heeft de laatste koek opgegeten?", a: ["Wie"], x: "naar een persoon → wie" },
    { z: "___ huis is het grootste van de straat?", a: ["Welk"], x: "een keuze, bij een het-woord (het huis) → welk" },
    { z: "___ eet je het liefst als ontbijt?", a: ["Wat"], x: "naar een zaak → wat" },
    { z: "___ hond blaft er zo luid? Die van de buurman?", a: ["Wiens"], x: "van wie is het dier → wiens" },
    { z: "___ leerkracht geeft jullie wiskunde?", a: ["Welke"], x: "een keuze uit de leerkrachten → welke" },
    { z: "___ wint er volgens jou de wedstrijd?", a: ["Wie"], x: "naar een persoon → wie" },
    { z: "___ dier zou je graag als huisdier hebben?", a: ["Welk"], x: "een keuze, bij een het-woord (het dier) → welk" },
  ];
  // herkennen (V of X): is het onderstreepte woord een vragend voornaamwoord?
  const VVN_HERKEN = [
    { z: "[Wie] heeft de deur opengelaten?", v: true },
    { z: "[Wat] wil je later worden?", v: true },
    { z: "[Welke] film kijken we vanavond?", v: true },
    { z: "[Wiens] jas ligt hier op de grond?", v: true },
    { z: "[Welk] lied zingen we op het feest?", v: true },
    { z: "[Wat] zou er in die doos zitten?", v: true },
    { z: "[Wie] komt er morgen op bezoek?", v: true },
    { z: "[Waarom] ben je te laat?", v: false, x: "waarom = vragend bijwoord (naar de reden)" },
    { z: "[Waar] heb je je sleutels gelegd?", v: false, x: "waar = vragend bijwoord (naar de plaats)" },
    { z: "[Wanneer] begint de vakantie?", v: false, x: "wanneer = vragend bijwoord (naar de tijd)" },
    { z: "[Hoe] ben je naar school gekomen?", v: false, x: "hoe = vragend bijwoord (naar de manier)" },
    { z: "[Weer] regent het de hele dag.", v: false, x: "weer = bijwoord, het is geen vraag" },
    { z: "[Waarmee] heb je die tekening gemaakt?", v: false, x: "waarmee = vragend voornaamwoordelijk bijwoord, geen vragend voornaamwoord" },
    { z: "[Hoeveel] kost een ticket voor de film?", v: false, x: "hoeveel vraagt naar een aantal (telwoord), geen vragend voornaamwoord" },
    { z: "[Wederom] valt de les wiskunde uit.", v: false, x: "wederom = opnieuw (bijwoord)" },
  ];
  // de juiste vraag bij een antwoord: [ ] = het gemarkeerde deel; q = vraag met {} op de plaats van het voornaamwoord
  const VVN_VRAAG = [
    { antw: "[Lotte] heeft de taart gebakken.", q: "{} heeft de taart gebakken?", a: "Wie" },
    { antw: "Ik wil [een nieuwe gsm] voor mijn verjaardag.", q: "{} wil je voor je verjaardag?", a: "Wat" },
    { antw: "[Het haar van Emma] is lang.", q: "{} haar is lang?", a: "Wiens" },
    { antw: "We nemen [de blauwe] tent mee, niet de groene.", q: "{} tent nemen we mee?", a: "Welke" },
    { antw: "[Mijn broer] draagt een rode pet.", q: "{} draagt een rode pet?", a: "Wie" },
    { antw: "Daan heeft [een koptelefoon] rond zijn nek.", q: "{} heeft Daan rond zijn nek?", a: "Wat" },
    { antw: "[De fiets van Noah] staat in de gang.", q: "{} fiets staat in de gang?", a: "Wiens" },
    { antw: "Ik kies [het grootste] stuk taart.", q: "{} stuk taart kies je?", a: "Welk" },
    { antw: "[Sam en Yara] dragen een gele bril.", q: "{} dragen een gele bril?", a: "Wie" },
    { antw: "In de tas zit [een boterham met kaas].", q: "{} zit er in de tas?", a: "Wat" },
    { antw: "Ik zit in [de tweede] klas.", q: "In {} klas zit je?", a: "welke" },
    { antw: "[De hond van de buren] liep weg.", q: "{} hond liep weg?", a: "Wiens" },
  ];

  // ---------- les 7: het telwoord ----------
  // soort: bh = bepaald hoofdtelwoord · oh = onbepaald hoofdtelwoord · br = bepaald rangtelwoord · or = onbepaald rangtelwoord
  const TELWOORD_ZINNEN = [
    { z: "Ik heb [drie] broers en één zus.", s: "bh" },
    { z: "Er passen [twintig] leerlingen in het lokaal.", s: "bh" },
    { z: "Mijn opa is [vijfenzeventig] jaar geworden.", s: "bh" },
    { z: "Baby's leren lopen als ze ongeveer [anderhalf] jaar oud zijn.", s: "bh" },
    { z: "België telt bijna [twaalf miljoen] inwoners.", s: "bh" },
    { z: "We kregen [tien] minuten pauze.", s: "bh" },
    { z: "[Veel] leerlingen komen met de fiets naar school.", s: "oh" },
    { z: "Er stonden [weinig] auto's op de parking.", s: "oh" },
    { z: "[Enkele] spelers waren geblesseerd.", s: "oh" },
    { z: "[Sommige] mensen houden van spruitjes.", s: "oh" },
    { z: "Op de grond lagen [verscheidene] boeken.", s: "oh" },
    { z: "Ik heb [genoeg] tijd om mijn huiswerk te maken.", s: "oh" },
    { z: "Er zijn [talloze] talen in de wereld.", s: "oh" },
    { z: "Mijn zus heeft [meerdere] hobby's.", s: "oh" },
    { z: "Ons huis is het [derde] huis van de straat.", s: "br" },
    { z: "Ze werd [eerste] in de zwemwedstrijd.", s: "br" },
    { z: "Mijn verjaardag valt op de [zesentwintigste] van de maand.", s: "br" },
    { z: "Dit is al de [tiende] keer dat ik het zeg!", s: "br" },
    { z: "Mijn oma vierde haar [honderdste] verjaardag.", s: "br" },
    { z: "We wonen op de [vijfde] verdieping.", s: "br" },
    { z: "Het [laatste] woord is nog niet gezegd!", s: "or" },
    { z: "Ik zit in de [middelste] rij van de bus.", s: "or" },
    { z: "Voor de [zoveelste] keer vergat hij zijn boek.", s: "or" },
    { z: "De [hoeveelste] ben jij in de rij?", s: "or" },
    { z: "Dit is de [voorlaatste] les van het jaar.", s: "or" },
  ];
  const SOORT_NAAM = { bh: "bepaald hoofdtelwoord", oh: "onbepaald hoofdtelwoord", br: "bepaald rangtelwoord", or: "onbepaald rangtelwoord" };

  // spelling: welke schrijfwijze is juist? (eerste = juist)
  const SPELLING = [
    { o: ["drie miljoen", "driemiljoen"], x: "miljoen, miljard … zijn zelfstandige naamwoorden: altijd apart" },
    { o: ["zeventien miljard", "zeventienmiljard"], x: "miljard is een zelfstandig naamwoord: apart" },
    { o: ["tweemaal", "twee maal"], x: "combinaties met 'maal' schrijf je aan elkaar, behalve in een formule (drie maal acht)" },
    { o: ["Drie maal acht is vierentwintig.", "Driemaal acht is vierentwintig."], x: "in een formule voor vermenigvuldigen schrijf je 'maal' los" },
    { o: ["twee derde van de klas", "tweederde van de klas"], x: "bij een breuk schrijf je teller en noemer als aparte woorden" },
    { o: ["drie vierde van de taart", "drievierde van de taart"], x: "teller en noemer apart" },
    { o: ["tweeduizend vijfhonderd", "tweeduizendvijfhonderd"], x: "na duizend volgt een spatie" },
    { o: ["tweeëntwintig", "tweeentwintig"], x: "trema: tweeëntwintig, drieëntwintig (anders lees je 'tweeen')" },
    { o: ["achtentwintigste", "achtentwintigde"], x: "vanaf twintig eindigt het rangtelwoord op -ste" },
    { o: ["negentiende", "negentienste"], x: "tot en met negentien: -de (behalve eerste, achtste)" },
    { o: ["Er zijn negentien proefbuizen nodig.", "Er zijn 19 proefbuizen nodig."], x: "getallen tot en met twintig schrijf je voluit" },
    { o: ["Neem 3 l water.", "Neem drie l water."], x: "bij een officiële afkorting (l, kg, km …) schrijf je cijfers" },
    { o: ["Ik heb twaalf knikkers.", "Ik heb 12 knikkers."], x: "tot en met twintig voluit" },
    { o: ["Voeg 5 g suiker toe.", "Voeg vijf g suiker toe."], x: "cijfers bij een officiële afkorting" },
  ];

  // begrippen (ook als flashcards)
  const BEGRIPPEN = [
    { q: "Welke vragende voornaamwoorden ken je?", a: "wie, wat, welke (welk) en wiens" },
    { q: "Wanneer gebruik je 'wie'?", a: "als je naar een persoon vraagt" },
    { q: "Wanneer gebruik je 'wat'?", a: "als je naar een zaak of een gebeurtenis vraagt" },
    { q: "Wanneer gebruik je 'welke' of 'welk'?", a: "als je een keuze vraagt (welk bij het-woorden, welke bij de-woorden en meervoud)" },
    { q: "Wanneer gebruik je 'wiens'?", a: "als je vraagt van wie iets is (bezit)" },
    { q: "Wat is een hoofdtelwoord?", a: "een telwoord dat een aantal weergeeft (drie, veel)" },
    { q: "Wat is een rangtelwoord?", a: "een telwoord dat een volgorde of rangschikking weergeeft (derde, laatste)" },
    { q: "Wanneer is een telwoord bepaald?", a: "als het exacte informatie geeft (vijf, vierde)" },
    { q: "Wanneer is een telwoord onbepaald?", a: "als het geen exacte informatie geeft (sommige, laatste)" },
    { q: "Tot welk getal schrijf je voluit?", a: "tot en met twintig (behalve bij een officiële afkorting: 3 l)" },
    { q: "Hoe schrijf je getallen boven duizend voluit?", a: "met een spatie na duizend (tweeduizend vijfhonderd)" },
    { q: "Hoe schrijf je een breuk voluit?", a: "teller en noemer apart (twee derde)" },
    { q: "Schrijf je 'tweemaal' aan elkaar of los?", a: "aan elkaar, behalve in een formule (drie maal acht)" },
    { q: "Hoe schrijf je 'miljoen' en 'miljard'?", a: "altijd apart: het zijn zelfstandige naamwoorden (drie miljoen)" },
  ];

  const TAGS = {
    vvn_keuze: { title: "Wie, wat, welke of wiens?", short: "vragend vnw", advice: "Wie = persoon · wat = zaak of gebeurtenis · welke/welk = keuze (welk bij het-woord) · wiens = van wie (bezit).", page: "53" },
    vvn_herken: { title: "Vragend voornaamwoord herkennen", short: "herkennen", advice: "Alleen wie, wat, welke/welk en wiens zijn vragende voornaamwoorden. Waarom, waar, wanneer, hoe zijn vragende bijwoorden.", page: "53-54" },
    hoofd_rang: { title: "Hoofdtelwoord of rangtelwoord", short: "hoofd/rang", advice: "Hoofdtelwoord = aantal (drie, veel). Rangtelwoord = volgorde, plaats in een rij (derde, laatste).", page: "57" },
    bepaald: { title: "Bepaald of onbepaald", short: "bepaald", advice: "Bepaald = exact (vijf, vierde). Onbepaald = niet exact (sommige, veel, laatste, middelste).", page: "57" },
    voluit: { title: "Telwoorden voluit schrijven", short: "voluit", advice: "Aan elkaar tot duizend, spatie na duizend (tweeduizend vijfhonderd), miljoen apart, trema in tweeëntwintig, rangtelwoord vanaf twintig op -ste.", page: "60" },
    spelling: { title: "Spelling van telwoorden", short: "spelling", advice: "Tot twintig voluit (behalve bij l, kg …), breuk apart (twee derde), tweemaal aan elkaar behalve in formules, miljoen apart.", page: "60" },
    trema: { title: "Trema vergeten", short: "trema", advice: "tweeëntwintig, drieëntwintig: het trema toont dat een nieuwe lettergreep begint.", page: "60" },
    spatie: { title: "Spatie na duizend", short: "spatie", advice: "Na duizend komt een spatie: drieduizend vijfhonderdachtenveertig.", page: "60" },
    fout: { title: "Fout", short: "fout", advice: "", page: "" },
  };

  Vakken.setInhoud("nederlands-2", {
    vak: "Nederlands", icon: "📝", theme: "indigo",
    titel: "Vragende voornaamwoorden en het telwoord", klas: "2de middelbaar", bron: "les 6-7 (p.53-60)",
    VVN_INVUL, VVN_HERKEN, VVN_VRAAG, TELWOORD_ZINNEN, SOORT_NAAM, SPELLING, BEGRIPPEN, TAGS,
  });
})();
