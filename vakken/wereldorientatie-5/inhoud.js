// ============================================================
// INHOUD – Wereldoriëntatie 5de leerjaar · Europa aardrijkskundig
// Bron: werkbundel "Europa aardrijkskundig" (11 bladen) + toetswijzer.
//   1 EU ↔ Europees continent · 2 lidstaten van de EU · 3 landelijk of stedelijk
//   4 de drie reliëfvormen · 5 werken met de atlas · 6 de windroos · 7 water in Europa
//   8 landen van Europa · 9-10 schaal berekenen · 11 toetswijzer
// De kaart zelf staat in kaart.js (landen, hoofdsteden, gebergten, rivieren).
// Nieuwe vragen: voeg ze ACHTERAAN een lijst toe (de voortgang hangt aan de plaats).
// Een bank-vraag: { q, a: juist antwoord, alt?: [ook goed], opts?: [foute keuzes], x?: uitleg, p: blad }
// ============================================================
(function () {
  // ---------- begrippen (toetswijzer + bladen 1, 4, 5, 6) ----------
  const BEGRIPPEN = [
    { t: "hellingsgraad", d: "Het percentage waarmee een gebied stijgt of daalt.", p: "4" },
    { t: "bevolkingsdichtheid", d: "De hoeveelheid inwoners op een bepaalde oppervlakte (aantal inwoners per km²).", p: "5" },
    { t: "zeestraat", d: "Een smalle waterdoorgang die twee grotere watermassa's met elkaar verbindt en tegelijk twee stukken land van elkaar scheidt.", p: "7" },
    { t: "schiereiland", d: "Een 'eiland' dat toch nog met een stukje vast hangt aan het vasteland.", p: "7" },
    { t: "eiland", d: "Een stuk land volledig omgeven door water.", p: "7" },
    { t: "golf", d: "Een grote inham in de kustlijn.", p: "7" },
    { t: "schaal", d: "Geeft weer hoeveel keer de kaart verkleind is.", p: "9" },
    { t: "Europese Unie", d: "Een samenwerking tussen verschillende landen op het Europese continent.", p: "1" },
    { t: "Europees continent", d: "Het werelddeel Europa: alle landen van Europa, ook de landen die niet bij de EU horen.", p: "1" },
    { t: "register", d: "Lijst (op alfabet) van alle landen, steden, rivieren … achteraan in de atlas, met het kaartnummer.", p: "5" },
    { t: "inhoudstafel", d: "Overzicht van de verschillende kaarten per gebied, vooraan in de atlas.", p: "5" },
    { t: "natuurkundige kaart", d: "Toont hoe hoog of laag een plaats ligt tegenover de zeespiegel, met gebergten, rivieren, zeeën en meren.", p: "5" },
    { t: "staatkundige kaart", d: "Toont de landen, de landsgrenzen, de hoofdsteden en de steden.", p: "5" },
    { t: "thematische kaart", d: "Een kaart over één bepaald onderwerp (thema), bv. toerisme, de euro, zeehavens.", p: "5" },
    { t: "windroos", d: "Tekening die de windrichtingen (noorden, oosten, zuiden, westen …) op een kaart aanduidt.", p: "6" },
  ];

  // ---------- reliëfvormen (blad 4) ----------
  const RELIEF = [
    { q: "Een zoutvlakte zonder enig hoogteverschil, zo ver je kan kijken.", a: "vlak", p: "4" },
    { q: "Hoge, steile toppen met sneeuw erop.", a: "bergachtig", p: "4" },
    { q: "Een diepe vallei met een rivier, tussen hoge, steile rotswanden.", a: "bergachtig", p: "4" },
    { q: "Zacht glooiend land met lage, ronde hoogtes.", a: "heuvelachtig", p: "4" },
    { q: "De polders aan de Belgische kust.", a: "vlak", p: "4" },
    { q: "De Vlaamse Ardennen (rond Oudenaarde).", a: "heuvelachtig", p: "4" },
    { q: "De Alpen.", a: "bergachtig", p: "4" },
    { q: "Een gebied met weilanden die op en af gaan, maar nergens echt hoog of steil.", a: "heuvelachtig", p: "4" },
    { q: "Een landschap waar de hellingsgraad bijna 0 % is.", a: "vlak", p: "4" },
    { q: "Een landschap met de grootste hellingsgraad.", a: "bergachtig", p: "4" },
    { q: "De Pyreneeën.", a: "bergachtig", p: "4" },
    { q: "Nederland: bijna overal even hoog, soms zelfs lager dan de zee.", a: "vlak", p: "4" },
  ];

  // ---------- landelijk of stedelijk (blad 3) ----------
  const LANDSTAD = [
    { q: "Een skyline met hoge torens en wolkenkrabbers.", a: "stedelijk", p: "3" },
    { q: "Groene weiden met bomen en hagen, enkele verspreide boerderijen.", a: "landelijk", p: "3" },
    { q: "Satellietbeeld: een dicht netwerk van straten met huizenblokken tegen elkaar.", a: "stedelijk", p: "3" },
    { q: "Satellietbeeld: een haven met dokken, kranen en grote opslagtanks.", a: "stedelijk", p: "3" },
    { q: "Satellietbeeld: een lappendeken van akkers en velden, met een beekje ertussen.", a: "landelijk", p: "3" },
    { q: "Satellietbeeld: veel grote fabrieksgebouwen, parkings en autosnelwegen.", a: "stedelijk", p: "3" },
    { q: "Satellietbeeld: bossen, een paar landwegen en enkele kleine dorpjes.", a: "landelijk", p: "3" },
    { q: "Satellietbeeld: een groot station met veel sporen, omringd door appartementen.", a: "stedelijk", p: "3" },
    { q: "Satellietbeeld: weilanden met koeien en een boerderij met een erf.", a: "landelijk", p: "3" },
  ];

  // ---------- water in Europa (blad 7) ----------
  const WATER = [
    { q: "Water stroomt altijd van … naar …", a: "hoog naar laag", opts: ["laag naar hoog", "noord naar zuid", "west naar oost"], p: "7" },
    { q: "Waar ontspringt een rivier meestal?", a: "in een hoger gebied (bv. in de bergen)", opts: ["in de zee", "in een vlakte aan de kust", "in een stad"], p: "7" },
    { q: "Waar mondt een rivier uit?", a: "in de zee", alt: ["zee"], opts: ["in de bergen", "aan de bron", "in een gletsjer"], p: "7" },
    { q: "De Straat van Gibraltar (tussen Spanje en Afrika) is een …", a: "zeestraat", p: "7" },
    { q: "De Golf van Biskaje (tussen Frankrijk en Spanje) is een …", a: "golf", p: "7" },
    { q: "Spanje en Portugal liggen samen op het Iberisch …", a: "schiereiland", p: "7" },
    { q: "Mallorca (in de Middellandse Zee) is een …", a: "eiland", p: "7" },
    { q: "Italië (de 'laars') is een …", a: "schiereiland", p: "7" },
    { q: "Sicilië is een …", a: "eiland", p: "7" },
    { q: "Het Kanaal tussen Frankrijk en Engeland is een …", a: "zeestraat", p: "7" },
    { q: "Scandinavië (Noorwegen en Zweden) is een …", a: "schiereiland", p: "7" },
    { q: "IJsland is een …", a: "eiland", p: "7" },
    { q: "Kreta (bij Griekenland) is een …", a: "eiland", p: "7" },
    { q: "De Bosporus (bij Istanbul) verbindt de Zwarte Zee met de Zee van Marmara. Het is een …", a: "zeestraat", p: "7" },
    { q: "De Golf van Bothnië (tussen Zweden en Finland) is een …", a: "golf", p: "7" },
    { q: "Denemarken (Jutland) is een …", a: "schiereiland", p: "7" },
  ];

  // ---------- welke kaartsoort? (blad 5) ----------
  // a: natuurkundige | staatkundige | thematische; alt: ook goed
  const KAARTSOORT = [
    { q: "Ik wil bepalen welke rivier er door Parijs loopt.", a: "natuurkundige", p: "5" },
    { q: "Ik wil weten waar er in Europa grote zeehavens te vinden zijn.", a: "thematische", p: "5" },
    { q: "Ik wil bepalen welke zee er grenst aan het zuiden van Italië.", a: "staatkundige", alt: ["natuurkundige"], x: "zeeën staan op de staatkundige én op de natuurkundige kaart", p: "5" },
    { q: "Ik wil bepalen welke bergketen er in het noorden van Spanje ligt.", a: "natuurkundige", p: "5" },
    { q: "Ik wil te weten komen in welke landen men met de euro betaalt.", a: "thematische", p: "5" },
    { q: "Ik wil bepalen wat de afstand is tussen de hoofdstad van Polen en de hoofdstad van Zwitserland.", a: "staatkundige", p: "5" },
    { q: "Ik wil weten welke soort toerisme er is in de Alpen.", a: "thematische", p: "5" },
    { q: "Ik wil weten hoe hoog de Mont Blanc is.", a: "natuurkundige", p: "5" },
    { q: "Ik wil weten welke landen aan Duitsland grenzen.", a: "staatkundige", p: "5" },
    { q: "Ik zoek de hoofdstad van Litouwen.", a: "staatkundige", p: "5" },
    { q: "Ik wil weten waar in Europa de meeste mensen wonen (bevolkingsdichtheid).", a: "thematische", p: "5" },
    { q: "Ik wil weten welk klimaat er in Griekenland is.", a: "thematische", p: "5" },
    { q: "Ik wil weten in welke zee de Donau uitmondt.", a: "natuurkundige", p: "5" },
    { q: "Ik wil weten of het noorden van Polen laag of hoog ligt.", a: "natuurkundige", p: "5" },
    { q: "Ik wil weten welke landen lid zijn van de Europese Unie.", a: "thematische", alt: ["staatkundige"], x: "de EU-kaart is een thematische kaart; op een staatkundige kaart zie je de landen", p: "5" },
    { q: "Ik zoek de grens tussen Spanje en Portugal.", a: "staatkundige", p: "5" },
    { q: "Ik wil weten waar in Frankrijk wijn wordt gemaakt.", a: "thematische", p: "5" },
  ];

  // ---------- werken met de atlas (blad 5) ----------
  const ATLAS = [
    { q: "Je wil de stad Lyon opzoeken in de atlas. Waar kijk je?", a: "in het register", opts: ["in de inhoudstafel", "op de eerste kaart", "bij de schaal"], p: "5" },
    { q: "Je zoekt een kaart van Europa over toerisme. Waar kijk je het snelst?", a: "in de inhoudstafel", opts: ["in het register", "bij de windroos", "bij de schaal"], p: "5" },
    { q: "Waar staat het register in de atlas?", a: "achteraan", opts: ["vooraan", "in het midden", "op elke kaart"], p: "5" },
    { q: "Waar staat de inhoudstafel in de atlas?", a: "vooraan", opts: ["achteraan", "in het midden", "op elke kaart"], p: "5" },
    { q: "Hoe staan de namen in het register gerangschikt?", a: "alfabetisch (A → Z)", opts: ["per land", "van groot naar klein", "per kaartnummer"], p: "5" },
    { q: "Wat vind je in het register bij een plaatsnaam?", a: "het kaartnummer en het vakje op de kaart", opts: ["het aantal inwoners", "de schaal", "de hoofdstad"], p: "5" },
    { q: "Waar staat de schaal van een kaart in de atlas?", a: "bovenaan de kaart", opts: ["in het register", "achteraan de atlas", "in de inhoudstafel"], p: "9" },
    { q: "Welke soort kaart toont landen met elk een andere kleur en hun grenzen?", a: "staatkundige kaart", opts: ["natuurkundige kaart", "thematische kaart"], p: "5" },
    { q: "Op welke soort kaart zie je met kleuren hoe hoog het land ligt (groen = laag, bruin = hoog)?", a: "natuurkundige kaart", opts: ["staatkundige kaart", "thematische kaart"], p: "5" },
  ];

  // ---------- Europa en de EU (blad 1-2) ----------
  const EU = [
    { q: "Wat is de Europese Unie?", a: "een samenwerking tussen verschillende landen op het Europese continent", opts: ["het werelddeel Europa", "één groot land in Europa", "een gebergte in Europa"], p: "1" },
    { q: "Wat is het Europese continent?", a: "het werelddeel Europa", opts: ["een samenwerking tussen Europese landen", "de landen met de euro", "een eiland in de Middellandse Zee"], p: "1" },
    { q: "Hoeveel landen zijn lid van de Europese Unie?", a: "27", opts: ["12", "31", "50"], p: "2" },
    { q: "Welk gebergte vormt in het oosten de grens van het Europese continent (met Azië)?", a: "het Oeralgebergte", opts: ["de Alpen", "de Pyreneeën", "de Karpaten"], p: "11" },
    { q: "Welke werelddelen (continenten) zijn er?", a: "Europa, Azië, Afrika, Amerika, Oceanië en Antarctica", opts: ["Europa, Azië, Afrika en Amerika", "Europa, de EU, Azië en Afrika", "België, Europa, Azië en Afrika"], p: "1" },
    { q: "Welk werelddeel ligt ten zuiden van Europa, aan de overkant van de Middellandse Zee?", a: "Afrika", opts: ["Azië", "Amerika", "Oceanië"], p: "1" },
    { q: "Welk werelddeel ligt ten oosten van Europa?", a: "Azië", opts: ["Afrika", "Amerika", "Oceanië"], p: "1" },
    { q: "Zwitserland en Noorwegen liggen in Europa. Zijn ze lid van de EU?", a: "nee", opts: ["ja"], p: "2" },
    { q: "Het Verenigd Koninkrijk is …", a: "geen lid meer van de EU (sinds 2020)", opts: ["lid van de EU", "geen deel van Europa", "een deel van Frankrijk"], p: "2" },
    { q: "In welke stad zijn veel instellingen van de Europese Unie gevestigd?", a: "Brussel", opts: ["Parijs", "Berlijn", "Londen"], p: "2" },
  ];

  // ---------- bevolkingsdichtheid: ongeveer (oppervlakte in km², inwoners per km²) – rekenvoorbeelden ----------
  const DICHT = [
    ["België", 30500, 380], ["Nederland", 41500, 430], ["Frankrijk", 550000, 120], ["Duitsland", 357000, 235], ["Spanje", 506000, 95],
    ["Italië", 302000, 195], ["Polen", 312000, 120], ["Zweden", 450000, 23], ["Luxemburg", 2600, 250], ["Malta", 320, 1700],
    ["Ierland", 70000, 75], ["Portugal", 92000, 115], ["Griekenland", 132000, 80], ["Oostenrijk", 84000, 110], ["Denemarken", 43000, 140], ["Noorwegen", 385000, 14],
  ];

  // ---------- windroos (blad 6) ----------
  const WIND = [
    { k: "N", n: "noorden" }, { k: "NO", n: "noordoosten" }, { k: "O", n: "oosten" }, { k: "ZO", n: "zuidoosten" },
    { k: "Z", n: "zuiden" }, { k: "ZW", n: "zuidwesten" }, { k: "W", n: "westen" }, { k: "NW", n: "noordwesten" },
  ];

  // ---------- fouttypes ----------
  const TAGS = {
    land: { title: "Landen op de kaart", short: "landen", advice: "Oefen de blinde kaart: zoek eerst de grote landen (Frankrijk, Duitsland, Spanje, Italië, Polen) en zoek dan de kleinere landen rond hen.", page: "2, 8" },
    hoofdstad: { title: "Hoofdsteden", short: "hoofdsteden", advice: "Leer land + hoofdstad als paar (België – Brussel). Let op de Nederlandse namen: Wenen, Praag, Warschau, Boedapest, Boekarest, Lissabon, Kopenhagen.", page: "2" },
    gebergte: { title: "Gebergten", short: "gebergten", advice: "Alpen = midden van Europa (Frankrijk, Zwitserland, Italië, Oostenrijk) · Pyreneeën = grens Frankrijk–Spanje · Oeral = in Rusland, de grens met Azië.", page: "11" },
    rivier: { title: "Rivieren", short: "rivieren", advice: "Seine = door Parijs naar het Kanaal · Rijn = van de Alpen (Zwitserland) langs Duitsland naar Nederland · Donau = de lange rivier van Duitsland via Wenen en Boedapest naar de Zwarte Zee.", page: "11" },
    begrip: { title: "Begrippen", short: "begrippen", advice: "Herhaal de begrippenlijst van de toetswijzer (hellingsgraad, bevolkingsdichtheid, zeestraat, schiereiland, eiland, golf, schaal).", page: "11" },
    relief: { title: "Reliëf en gebieden", short: "reliëf", advice: "Vlak = geen hoogteverschil · heuvelachtig = lage, glooiende hoogtes · bergachtig = hoog en steil. Stedelijk = veel gebouwen en straten · landelijk = velden, weiden, bossen.", page: "3-4" },
    water: { title: "Water", short: "water", advice: "Water stroomt van hoog naar laag: het ontspringt in hoger gebied en mondt uit in de zee. Zeestraat = smalle doorgang · golf = grote inham · eiland = helemaal water rond · schiereiland = hangt nog vast.", page: "7" },
    atlas: { title: "Werken met de atlas", short: "atlas", advice: "Plaats zoeken → register (achteraan) · kaart zoeken → inhoudstafel (vooraan) · hoogte, rivieren, gebergten → natuurkundig · landen, grenzen, steden → staatkundig · één onderwerp → thematisch.", page: "5" },
    wind: { title: "Windroos", short: "windroos", advice: "In wijzerzin: N – NO – O – ZO – Z – ZW – W – NW. Zonder windroos is de bovenkant van de kaart het noorden. Trucje: Nooit Op Zondag Wassen.", page: "6" },
    schaal: { title: "Schaal", short: "schaal", advice: "1 : 15 000 000 → 1 cm op de kaart = 15 000 000 cm = 150 km. Vermenigvuldig de cm op de kaart met 150. Van cm naar km: 5 nullen weg (: 100 000).", page: "9-10" },
    dicht: { title: "Bevolkingsdichtheid", short: "dichtheid", advice: "Bevolkingsdichtheid = aantal inwoners : oppervlakte (km²). De uitkomst is 'inwoners per km²'.", page: "5, 11" },
    spelling: { title: "Spelling", short: "spelling", advice: "Bijna juist: let op de schrijfwijze van de naam.", page: "" },
    fout: { title: "Fout", short: "fout", advice: "", page: "" },
  };

  Vakken.setInhoud("wereldorientatie-5", {
    vak: "Wereldoriëntatie", icon: "🌍", theme: "green",
    titel: "Europa aardrijkskundig", klas: "5de leerjaar",
    bron: "werkbundel Europa aardrijkskundig + toetswijzer (11 bladen)",
    BEGRIPPEN, RELIEF, LANDSTAD, WATER, KAARTSOORT, ATLAS, EU, DICHT, WIND, TAGS,
  });
})();
