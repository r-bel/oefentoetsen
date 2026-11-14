// ============================================================
// INHOUD – Nederlands 2de middelbaar · DEEL 1 "Een warm welkom" (p.23-74), les 1-5, 8 en taalschat
// (les 6 en 7 staan in inhoud.js). Eigen zinnen en woorden in de stijl van het werkboek; de theorie is
// in eigen woorden samengevat. p = pagina in het boek (voor "van p. … tot p. …").
// Wordt geladen na inhoud.js en vóór vak.js.
// ============================================================
(function () {
  const I = Vakken.inhoud("nederlands-2");

  // ---------- les 1: reclame (p.24-29) ----------
  // merk, medium of doelgroep?
  const RECLAME_MMD = [
    ["Coca-Cola", "merk"], ["Nike", "merk"], ["HEMA", "merk"], ["Lego", "merk"], ["Colruyt", "merk"], ["Samsung", "merk"],
    ["een folder in de brievenbus", "medium"], ["een reclamespot op televisie", "medium"], ["een gesponsorde post op Instagram", "medium"], ["de verpakking van een product", "medium"],
    ["een advertentie in de krant", "medium"], ["een reclame op de radio", "medium"], ["een filmpje op YouTube", "medium"], ["een affiche aan de bushalte", "medium"],
    ["jonge kinderen", "doelgroep"], ["tieners", "doelgroep"], ["studenten (18+)", "doelgroep"], ["volwassenen", "doelgroep"], ["70-plussers", "doelgroep"], ["liefhebbers van wielersport", "doelgroep"],
  ];
  // slogans (verzonnen merken): [slogan met [bijvoeglijk naamwoord], merk]
  const SLOGANS = [
    ["Fruitella: het [frisste] sapje van het land!", "Fruitella"], ["Velox: de [snelste] fiets voor de [slimste] rijder.", "Velox"],
    ["Bakkerij Korst: elke ochtend [vers] en [warm].", "Bakkerij Korst"], ["Schoenen Stap: [comfortabel] van 's morgens tot 's avonds.", "Schoenen Stap"],
    ["Zonnig Reizen: uw [onvergetelijke] vakantie begint hier.", "Zonnig Reizen"], ["Pixa: [scherpe] foto's, [eerlijke] prijs.", "Pixa"],
    ["Choco Max: [romige] chocolade voor iedereen!", "Choco Max"], ["Fris & Fruitig: de [lekkerste] start van je dag.", "Fris & Fruitig"],
  ];
  // stellingen: [stelling, juist?, uitleg]
  const RECLAME_STELLING = [
    ["Reclame wil naamsbekendheid verwerven en de consument overtuigen om het product te kopen.", true, "Dat is precies het doel van reclame."],
    ["Bedrijven maken voor elke doelgroep exact dezelfde reclame.", false, "Bedrijven passen hun reclame (en het medium) aan hun doelpubliek aan."],
    ["Een slogan is een korte, wervende zin die bij een bedrijf of product hoort.", true, "Een slogan of slagzin is kort en wervend."],
    ["Een slogan wordt elke maand veranderd.", false, "Een slogan wordt niet vaak aangepast en is algemeen bekend."],
    ["De merknaam staat vaak in de slogan, om naamsbekendheid te creëren.", true, "Zo onthoud je het merk beter."],
    ["Goedgekozen bijvoeglijke naamwoorden maken een reclameboodschap sterker.", true, "Bv. 'het lekkerste', 'ongelooflijk snel'."],
    ["In reclame wordt nooit overdreven.", false, "Reclame overdrijft vaak om de consument te verleiden; ze kan misleidend zijn."],
    ["Een flyer voor een kleuterfeest gebruikt best felle kleuren.", true, "Felle kleuren trekken de aandacht van kinderen."],
    ["Een reclame op TikTok bereikt vooral 70-plussers.", false, "Sociale media bereiken vooral jongeren."],
    ["Je moet zelf nadenken of een product doet wat de reclame belooft.", true, "Reclame is vaak misleidend: wees kritisch."],
  ];

  // ---------- les 2: lay-out (p.30-33) ----------
  const LAYOUT_TIPS = [
    ["Zorg voor een duidelijke structuur.", true], ["Gebruik tussentitels in een doorlopende tekst.", true], ["Beperk het gebruik van kleur.", true],
    ["Wees voorzichtig met vette en cursieve tekst.", true], ["Zet belangrijke informatie duidelijk zichtbaar en volledig.", true], ["Laat voldoende witruimte.", true],
    ["Houd rekening met de doelgroep (bv. geen klein lettertype voor ouderen).", true], ["Kies een leesbaar lettertype en een gepaste lettergrootte.", true],
    ["Gebruik zoveel mogelijk verschillende kleuren en lettertypes.", false], ["Zet de tekst zo dicht mogelijk op elkaar, zonder witregels.", false],
    ["Zet alle tekst vet, dan valt alles op.", false], ["Verstop de datum en het adres onderaan in kleine letters.", false],
    ["Schrijf alles in één lange alinea zonder tussentitels.", false], ["Gebruik een piepklein lettertype op een affiche voor senioren.", false],
  ];

  // ---------- les 3: de uitnodiging (p.34-39) ----------
  // onderdelen van een uitnodiging (theorie) + eigen uitnodigingen waarin telkens één onderdeel ontbreekt
  const UITN_ONDERDELEN = ["de organisator (wie nodigt uit?)", "de reden (wat is er te doen?)", "de datum", "het tijdstip", "de locatie", "wat je moet meebrengen of dragen", "hoe en wanneer je je moet inschrijven of bevestigen"];
  const UITNODIGINGEN = [
    { titel: "Spelletjesavond", delen: { org: "De leerlingenraad", reden: "nodigt je uit voor een gezellige spelletjesavond", datum: "op vrijdag 14 maart", tijd: "van 19.00 tot 22.00 u.", plaats: "in de refter van de school", mee: "Breng je favoriete gezelschapsspel mee!", inschr: "Schrijf je in bij je klastitularis vóór 7 maart." } },
    { titel: "Rommelmarkt", delen: { org: "Het oudercomité", reden: "organiseert een rommelmarkt ten voordele van de schoolreis", datum: "op zondag 6 april", tijd: "vanaf 9.00 u.", plaats: "op de speelplaats", mee: "Breng zelf een tafel en je spullen mee.", inschr: "Een standplaats reserveer je via rommelmarkt@school.be." } },
    { titel: "Verrassingsfeest", delen: { org: "Lotte en Amir", reden: "nodigen je uit op het verrassingsfeest voor Yara's vijftiende verjaardag", datum: "op zaterdag 10 mei", tijd: "om 18.30 u.", plaats: "in jeugdhuis De Kelder, Kerkstraat 12", mee: "Dresscode: iets met glitter!", inschr: "Laat vóór 3 mei weten of je komt (en verklap niets aan Yara!)." } },
    { titel: "Pyjamafilmavond", delen: { org: "De chiro", reden: "nodigt alle leden uit voor een pyjamafilmavond", datum: "op zaterdag 22 februari", tijd: "van 19.30 tot 23.00 u.", plaats: "in het chirolokaal", mee: "Breng je pyjama, een kussen en een dekentje mee.", inschr: "Inschrijven kan tot woensdag 19 februari bij de leiding." } },
  ];
  const DEEL_NAAM = { org: "de organisator (wie nodigt uit?)", reden: "de reden (wat is er te doen?)", datum: "de datum", tijd: "het tijdstip", plaats: "de locatie", mee: "wat je moet meebrengen of dragen", inschr: "hoe en wanneer je je moet inschrijven of bevestigen" };
  // topische vragen: [antwoord met [gemarkeerd deel], vraagwoord]
  const TOPISCH = [
    ["Het feest begint [om 20.00 u.].", "wanneer"], ["Het feest vindt plaats [in zaal De Linde].", "waar"], ["[Esther en Marcel] geven een trouwfeest.", "wie"],
    ["We vieren feest [omdat oma tachtig wordt].", "waarom"], ["Je schrijft je in [via een e-mail naar de leiding].", "hoe"], ["We organiseren [een quizavond].", "wat"],
    ["De receptie is [op 28 oktober].", "wanneer"], ["Je moet [een verkleedkostuum] meebrengen.", "wat"], ["Het kamp gaat door [in de Ardennen].", "waar"],
    ["[De scouts] organiseren een spaghettiavond.", "wie"], ["Je bevestigt je komst [telefonisch].", "hoe"], ["Het toernooi wordt georganiseerd [om geld in te zamelen voor de club].", "waarom"],
    ["[Tennisclub De Snaar] nodigt je uit.", "wie"], ["We komen samen [aan de ingang van het station].", "waar"], ["Inschrijven kan [tot en met 10 juni].", "wanneer"],
    ["We gaan [een kampvuur maken en liedjes zingen].", "wat"],
  ];

  // ---------- les 4: woordvorming (p.40-45) ----------
  // [woord, soort, delen]
  const WOORDVORMING = [
    ["boom", "grondwoord", "boom"], ["tafel", "grondwoord", "tafel"], ["feest", "grondwoord", "feest"], ["school", "grondwoord", "school"], ["reis", "grondwoord", "reis"], ["dag", "grondwoord", "dag"], ["werk", "grondwoord", "werk"], ["pijn", "grondwoord", "pijn"],
    ["lessenrooster", "samenstelling", "lessen + rooster"], ["gangpad", "samenstelling", "gang + pad"], ["roofvogel", "samenstelling", "roof + vogel"], ["tomatenpuree", "samenstelling", "tomaten + puree"],
    ["wereldreis", "samenstelling", "wereld + reis"], ["reisverzekering", "samenstelling", "reis + verzekering"], ["fruitfeest", "samenstelling", "fruit + feest"], ["kaasrol", "samenstelling", "kaas + rol"],
    ["denkpiste", "samenstelling", "denk + piste"], ["voetbalveld", "samenstelling", "voet + bal + veld"], ["verjaardagsfeest", "samenstelling", "verjaardag + s + feest"], ["schoolreis", "samenstelling", "school + reis"],
    ["ongeluk", "afleiding", "on + geluk"], ["onhoorbaar", "afleiding", "on + hoor + baar"], ["verkleuring", "afleiding", "ver + kleur + ing"], ["tafeltje", "afleiding", "tafel + tje"],
    ["boompje", "afleiding", "boom + p + je"], ["slangetje", "afleiding", "slang + e + tje"], ["onverantwoord", "afleiding", "on + verantwoord"], ["gevecht", "afleiding", "ge + vecht"],
    ["vriendelijk", "afleiding", "vriend + e + lijk"], ["schoonheid", "afleiding", "schoon + heid"], ["leerling", "afleiding", "leer + ling"], ["bakker", "afleiding", "bak + k + er"],
    ["onvergetelijk", "afleiding", "on + vergeet + e + lijk"], ["herschrijven", "afleiding", "her + schrijven"], ["ontstaan", "afleiding", "ont + staan"], ["beestje", "afleiding", "beest + je"],
  ];
  // voorvoegsels met betekenis (afleidingen uit vreemde talen)
  const VOORVOEGSELS = [
    ["co-", "mee, samen met", "coöperatie"], ["vice-", "tweede, onder-", "vicevoorzitter"], ["anti-", "tegen, geen", "anticlimax"], ["inter-", "tussen", "interventie"],
    ["re-", "opnieuw", "reconstructie"], ["pseudo-", "vals, zogenaamd", "pseudo-intellectueel"], ["pre-", "voor", "prematuur"], ["de-", "ongedaan maken", "demotiveren"],
    ["semi-", "half, niet volledig", "semiprofessioneel"], ["aarts-", "eerst, hoogst", "aartsmoeilijk"],
  ];
  // tegengestelde (antoniem) met een voor- of achtervoegsel: [grondwoord, antoniem]
  const ANTONIEMEN = [
    ["mobiel", "immobiel"], ["draaglijk", "ondraaglijk"], ["capabel", "incapabel"], ["rationeel", "irrationeel"], ["symmetrisch", "asymmetrisch"], ["legaal", "illegaal"],
    ["sociaal", "asociaal"], ["hoop", "wanhoop"], ["motivatie", "demotivatie"], ["monteren", "demonteren"], ["orde", "wanorde"], ["zuiver", "onzuiver"],
    ["typisch", "atypisch"], ["hydratatie", "dehydratatie"], ["illusie", "desillusie"], ["potent", "impotent"], ["met geur", "geurloos"], ["met einde", "eindeloos"],
    ["mogelijk", "onmogelijk"], ["logisch", "onlogisch"], ["regelmatig", "onregelmatig"], ["respect", "disrespect"],
  ];
  // verkleinwoorden: [woord, verkleinwoord]
  const VERKLEIN = [
    ["tafel", "tafeltje"], ["slang", "slangetje"], ["boom", "boompje"], ["oma", "omaatje"], ["gat", "gaatje"], ["koning", "koninkje"], ["raam", "raampje"], ["bal", "balletje"],
    ["vis", "visje"], ["hoed", "hoedje"], ["baard", "baardje"], ["kostuum", "kostuumpje"], ["vinger", "vingertje"], ["doek", "doekje"], ["bol", "bolletje"], ["auto", "autootje"],
    ["foto", "fotootje"], ["bloem", "bloemetje"], ["kam", "kammetje"], ["weg", "weggetje"], ["woning", "woninkje"], ["stoel", "stoeltje"], ["blad", "blaadje"], ["pad", "paadje"],
    ["film", "filmpje"], ["arm", "armpje"],
  ];

  // ---------- les 5: trema en koppelteken (p.46-52) ----------
  // juiste schrijfwijze: [juist, fout(en)…, regel]
  const TK_SPELLING = [
    ["reünie", "reunie", "trema: klinkerbotsing in een grondwoord"], ["beëindigen", "be-eindigen", "trema in een afleiding (be + einde)"], ["tweeënzestig", "tweeenzestig", "trema in samengestelde telwoorden met twee en drie"],
    ["industriële", "industriele", "trema bij verbuiging (industrieel → industriële)"], ["commerciële", "commerciele", "trema bij verbuiging"], ["geëvacueerd", "geevacueerd", "trema bij vervoeging"],
    ["ruïne", "ruine", "trema: klinkerbotsing in een grondwoord"], ["poëzie", "poezie", "trema: klinkerbotsing in een grondwoord"], ["hygiënisch", "hygienisch", "trema: klinkerbotsing"],
    ["oase", "oäse", "geen trema: je kunt 'oa' niet fout uitspreken"], ["museum", "museüm", "geen trema bij de Latijnse uitgang -eum"], ["opticien", "opticiën", "geen trema bij de Franse uitgang -ien"],
    ["industrieel", "industriëel", "geen trema in de combinatie -ieel"], ["zee-egel", "zeeëgel", "koppelteken: klinkerbotsing in een samenstelling"], ["auto-ongeluk", "autoöngeluk", "koppelteken: klinkerbotsing in een samenstelling"],
    ["milieu-inspectie", "milieuïnspectie", "koppelteken in een samenstelling"], ["na-apen", "naäpen", "koppelteken in een samenstelling"], ["olie-industrie", "olieïndustrie", "koppelteken in een samenstelling"],
    ["cd-speler", "cdspeler", "koppelteken bij afkortingen"], ["A-attest", "Aattest", "koppelteken bij letters"], ["2-delig", "2delig", "koppelteken bij cijfers"],
    ["West-Azië", "Westazië", "koppelteken bij aardrijkskundige namen"], ["Sint-Jozef", "Sint Jozef", "koppelteken na Sint"], ["zwart-wit", "zwartwit", "twee gelijkwaardige delen"],
    ["doe-het-zelver", "doehetzelver", "reeks woorden die samen een geheel vormen"], ["ex-vriendin", "exvriendin", "koppelteken na ex-"], ["niet-roker", "nietroker", "koppelteken na niet-"],
    ["anti-Frans", "antiFrans", "voorvoegsel + hoofdletter"], ["in- en uitvoer", "in en uitvoer", "weglatingsstreepje om herhaling te vermijden"], ["cafeïne", "cafeine", "trema"],
    ["modeacademie", "mode-academie", "geen koppelteken: 'ea' geeft geen leesprobleem"], ["ex-lief", "exlief", "koppelteken na ex-"], ["geïnspecteerd", "geinspecteerd", "trema bij vervoeging"],
    ["reliëf", "relief", "trema"], ["slaolie", "sla-olie", "geen koppelteken: 'ao' geeft geen leesprobleem"], ["beïnvloeden", "beinvloeden", "trema in een afleiding"],
    ["calorieën", "calorieen", "meervoud op -ie met klemtoon achteraan: -ën"], ["naïef", "naief", "trema"], ["gecreëerd", "gecreeerd", "trema bij vervoeging"],
    ["kopieën", "kopieen", "meervoud: -ën"], ["gedesoriënteerd", "gedesorienteerd", "trema"], ["reële", "reele", "trema bij verbuiging"],
  ];
  // waarom een koppelteken? [woord, regel-id]
  const KT_REGELS = {
    klinker: "om klinkerbotsing te voorkomen", teken: "bij letters, cijfers, tekens of afkortingen", aardr: "bij een aardrijkskundige naam", sint: "na Sint / St.",
    gelijk: "twee gelijkwaardige delen", reeks: "een reeks woorden die samen een geheel vormen", ex: "na ex-, niet-, non-, oud-, bijna-", hoofd: "voorvoegsel + hoofdletter", herhaling: "om herhaling te vermijden",
  };
  const KT_WOORDEN = [
    ["zee-egel", "klinker"], ["auto-ongeluk", "klinker"], ["bio-energie", "klinker"], ["ruimte-encyclopedie", "klinker"], ["mini-enquête", "klinker"],
    ["cd-speler", "teken"], ["wc-papier", "teken"], ["tv-presentator", "teken"], ["€-teken", "teken"], ["A-attest", "teken"],
    ["Oost-Vlaanderen", "aardr"], ["West-Azië", "aardr"], ["Antwerpen-Centraal", "aardr"], ["Sint-Jozef", "sint"], ["sint-bernardshond", "sint"], ["St-Niklaaskerk", "sint"],
    ["zwart-wit", "gelijk"], ["priester-dichter", "gelijk"], ["componist-dirigent", "gelijk"], ["woon-werkverkeer", "gelijk"],
    ["doe-het-zelver", "reeks"], ["kat-en-muisspel", "reeks"], ["wist-je-datje", "reeks"], ["vergeet-mij-nietje", "reeks"],
    ["ex-drummer", "ex"], ["oud-leerling", "ex"], ["niet-roker", "ex"], ["non-fictie", "ex"], ["anti-Frans", "hoofd"], ["on-Vlaams", "hoofd"],
    ["in- en uitvoer", "herhaling"], ["land- en tuinbouw", "herhaling"], ["fiets- en wandelroute", "herhaling"],
  ];
  // meervoud van woorden op -ie: [enkelvoud, meervoud(en)…]
  const IE_MEERVOUD = [
    ["allergie", "allergieën"], ["biografie", "biografieën"], ["amfibie", "amfibieën"], ["calorie", "calorieën"], ["melodie", "melodieën"], ["industrie", "industrieën"],
    ["bacterie", "bacteriën"], ["porie", "poriën"], ["olie", "oliën"], ["knie", "knieën"], ["kopie", "kopieën"], ["theorie", "theorieën"],
    ["kolonie", "kolonies", "koloniën"], ["tragedie", "tragedies", "tragediën"], ["provincie", "provincies", "provinciën"], ["categorie", "categorieën"],
  ];
  const TK_WOORDFAMILIE = [
    ["de creatie", "creatief", "creëren", "gecreëerd"], ["de poëzie", "poëtisch", "–", "–"], ["de financiën", "financieel", "financieren", "gefinancierd"],
    ["de ruïne", "–", "ruïneren", "geruïneerd"], ["de oriëntatie", "–", "oriënteren", "georiënteerd"],
  ];

  // ---------- les 8: het bijwoord (p.61-65) ----------
  // [zin met [woord], is bijwoord?, waarover zegt het iets (ww | bn | bw | tw | zin | -), uitleg]
  const BIJWOORD_ZINNEN = [
    ["Geert herstelde de ketting [snel].", true, "ww", "zegt iets over 'herstelde' (werkwoord)"],
    ["Zijn kleding is [erg] ouderwets.", true, "bn", "zegt iets over 'ouderwets' (bijvoeglijk naamwoord)"],
    ["De crimineel keek [ijzig] kalm.", true, "bw", "zegt iets over 'kalm' (bijwoord)"],
    ["Hij werkte er [bijna] twee uur aan.", true, "tw", "zegt iets over 'twee' (telwoord)"],
    ["De vertegenwoordiger kwam [helaas] niet opdagen.", true, "zin", "zegt iets over de hele zin"],
    ["De boodschap werd [compleet] anders geïnterpreteerd.", true, "bw", "zegt iets over 'anders' (bijwoord)"],
    ["Apple heeft de bal [volledig] misgeslagen.", true, "ww", "zegt iets over 'misgeslagen' (werkwoord)"],
    ["Het filmpje werd [circa] één miljoen keer bekeken.", true, "tw", "zegt iets over 'één miljoen' (telwoord)"],
    ["Muziek heeft een [ontzettend] grote invloed op ons koopgedrag.", true, "bn", "zegt iets over 'grote' (bijvoeglijk naamwoord)"],
    ["We laten ons [heel] onbewust leiden.", true, "bw", "zegt iets over 'onbewust' (bijwoord)"],
    ["[Gelukkig] was niemand gewond.", true, "zin", "zegt iets over de hele zin"],
    ["De bus kwam [gisteren] te laat.", true, "ww", "zegt iets over 'kwam' (werkwoord)"],
    ["Er waren [ongeveer] dertig leerlingen.", true, "tw", "zegt iets over 'dertig' (telwoord)"],
    ["Mijn zus zingt [prachtig].", true, "ww", "zegt iets over 'zingt' (werkwoord)"],
    ["Het was een [moeilijke] discussie.", false, "-", "bijvoeglijk naamwoord: zegt iets over het zelfstandig naamwoord 'discussie'"],
    ["Hij kreeg een [snelle] fiets.", false, "-", "bijvoeglijk naamwoord bij 'fiets'"],
    ["Ze kocht [mooie] schoenen.", false, "-", "bijvoeglijk naamwoord bij 'schoenen'"],
    ["Dat is een [typisch] menselijke reactie.", true, "bn", "zegt iets over 'menselijke' (bijvoeglijk naamwoord)"],
    ["Bedrijven gebruiken [felle] kleuren.", false, "-", "bijvoeglijk naamwoord bij 'kleuren'"],
    ["De klant kocht [onbewust] meer wijn.", true, "ww", "zegt iets over 'kocht' (werkwoord)"],
    ["Dat is een [eeuwenoude] reactie.", false, "-", "bijvoeglijk naamwoord bij 'reactie'"],
    ["De verkoopcijfers zijn [ferm] gestegen.", true, "ww", "zegt iets over 'gestegen' (werkwoord)"],
    ["De spot werd [nogal] kneuterig gevonden.", true, "bw", "zegt iets over 'kneuterig'"],
    ["[Misschien] moet je een lijstje bijhouden.", true, "zin", "zegt iets over de hele zin"],
  ];
  const BW_WAAROVER = { ww: "een werkwoord", bn: "een bijvoeglijk naamwoord", bw: "een ander bijwoord", tw: "een telwoord", zin: "de hele zin" };
  // soorten bijwoorden: [bijwoord, soort]
  const BW_SOORTEN = [
    ["nu", "tijd"], ["binnenkort", "tijd"], ["later", "tijd"], ["gisteren", "tijd"], ["straks", "tijd"], ["toen", "tijd"], ["altijd", "tijd"], ["soms", "tijd"],
    ["hier", "plaats"], ["daar", "plaats"], ["overal", "plaats"], ["ergens", "plaats"], ["nergens", "plaats"], ["buiten", "plaats"], ["binnen", "plaats"], ["thuis", "plaats"],
    ["erg", "graad"], ["zeer", "graad"], ["heel", "graad"], ["nogal", "graad"], ["bijna", "graad"], ["te", "graad"], ["ontzettend", "graad"], ["enigszins", "graad"],
    ["waarom", "vragend"], ["waar", "vragend"], ["wanneer", "vragend"], ["hoe", "vragend"], ["hoelang", "vragend"], ["waarheen", "vragend"],
  ];
  const BW_SOORT_NAAM = { tijd: "bijwoord van tijd", plaats: "bijwoord van plaats", graad: "bijwoord van graad (hoeveelheid)", vragend: "vragend bijwoord" };
  // vragend bijwoord of vragend voornaamwoord? [vraag met [woord], soort]
  const VRAAGWOORDEN = [
    ["[Waar] zie je misleidende reclame?", "bw"], ["[Welk] bedrijf heeft de beste slogan?", "vnw"], ["[Wie] maakt die reclame?", "vnw"], ["[Wiens] reclamespot blijft hangen?", "vnw"],
    ["[Hoe] heb jij je laten verleiden?", "bw"], ["[Waarom] overdrijft reclame zo vaak?", "bw"], ["[Wanneer] begint de uitverkoop?", "bw"], ["[Wat] verkoopt die winkel?", "vnw"],
    ["[Welke] slogan vind je het grappigst?", "vnw"], ["[Hoelang] duurt een reclameblok?", "bw"], ["[Waarheen] ga je op reis?", "bw"], ["[Wat] wil je voor je verjaardag?", "vnw"],
  ];

  // ---------- taalschat: de uitnodiging (p.66-69) ----------
  const SYNONIEMEN = [
    ["traditiegetrouw", "klassiek, traditioneel"], ["banaal", "alledaags, ordinair"], ["exclusief", "uitgesloten, uitsluitend"], ["genereus", "vrijgevig, gul"],
    ["inventief", "vindingrijk, origineel"], ["luxueus", "kostbaar, rijkelijk"], ["solitair", "eenzaam, geïsoleerd"], ["exceptioneel", "uitzonderlijk, buitengewoon"],
    ["minutieus", "nauwkeurig, zorgvuldig"], ["beknopt", "kort, bondig"], ["cruciaal", "doorslaggevend, essentieel"], ["chique", "deftig, elegant"],
  ];
  // bijvoeglijk naamwoord → zelfstandig naamwoord uit dezelfde woordfamilie
  const BN_ZN = [["klassiek", "de klassieker"], ["exclusief", "de exclusiviteit"], ["uitsluitend", "de uitsluiting"], ["kostbaar", "de kostbaarheid"], ["geïsoleerd", "het isolement"], ["genereus", "de generositeit"], ["luxueus", "de luxe"]];
  // werkwoorden voor 'vragen': [zin met ___, juist werkwoord (vervoegd), infinitief]
  const VRAGEN_WW = [
    ["Ik ___ dat jullie nu stil zijn!", "eis", "eisen"], ["Op zijn knieën ___ hij om vergeving.", "smeekte", "smeken"], ["Ik wil je graag ___ voor mijn vakantiefuif.", "uitnodigen", "uitnodigen"],
    ["Kun jij voorzichtig bij de leerkracht ___ of de toets moeilijk was?", "polsen", "polsen"], ["Na urenlang te zijn ___ door de politie, gaf de dief toe.", "ondervraagd", "ondervragen"],
    ["Voor je boeken kunt ontlenen, moet je een bibliotheekpasje ___.", "aanvragen", "aanvragen"], ["Wij ___ alle bezoekers hun ticket te tonen aan de ingang.", "verzoeken", "verzoeken"],
    ["Bij verdere vragen ___ wij u graag via onze website.", "informeren", "informeren"], ["Na het eerste trimester ___ veel leerlingen naar vakantie.", "verlangen", "verlangen"],
    ["Stan ___ of jij zin hebt om mee naar de bioscoop te gaan.", "vraagt zich af", "zich afvragen"],
  ];
  // informeel → formeler synoniem
  const FORMEEL = [["deelnemen", "participeren"], ["uitkiezen", "selecteren"], ["proeven", "degusteren"], ["maken", "vervaardigen"], ["waarderen", "appreciëren"], ["bevestigen", "confirmeren"], ["aanmelden", "registreren"], ["het genoegen", "het plezier"], ["de collectie", "de verzameling"], ["de aanmaning", "de betaalherinnering"]];
  // uitdrukkingen en spreekwoorden
  const UITDRUKKINGEN = [
    ["met de deur in huis vallen", "meteen zeggen waar het op staat"], ["iets in petto hebben", "een verrassing voor iemand hebben"], ["in de schijnwerpers staan", "veel aandacht krijgen"],
    ["iemand in de watten leggen", "iemand verwennen"], ["alles uit de kast halen", "tot het uiterste gaan"], ["tegen zachte prijsjes", "aan lage prijzen"],
    ["als de kat van huis is, dansen de muizen op tafel", "als er geen toezicht is, doet men waar men zin in heeft"], ["de rode loper uitrollen", "iemand feestelijk ontvangen"],
    ["een gegeven paard moet je niet in de bek kijken", "wees niet kritisch over gekregen cadeaus"], ["een feestje bouwen", "uitbundig feesten"],
    ["iemand met open armen ontvangen", "iemand hartelijk ontvangen"], ["de boel op stelten zetten", "voor veel drukte en plezier zorgen"],
    ["in het middelpunt van de belangstelling staan", "veel aandacht krijgen"], ["voor een prikje", "voor heel weinig geld"],
  ];

  // ---------- begrippen deel 1 (ook als leerkaarten): p = pagina ----------
  const BEGRIPPEN_D1 = [
    { q: "Wat is het doel van reclame?", a: "naamsbekendheid verwerven en de consument overtuigen en activeren om het product te kopen", p: 26 },
    { q: "Wat is een doelgroep (doelpubliek)?", a: "de groep mensen die een bedrijf met zijn reclame wil bereiken", p: 26 },
    { q: "Wat is een slogan (slagzin)?", a: "een korte, wervende zin die bij een bedrijf, product of reclame hoort", p: 27 },
    { q: "Waarom wordt reclame soms misleidend genoemd?", a: "ze overdrijft om de consument te verleiden; het product doet niet altijd wat beloofd wordt", p: 28 },
    { q: "Wat is lay-out?", a: "het uitzicht van een tekst of document: hoe alles geordend en vormgegeven is", p: 31 },
    { q: "Waarom is een goede lay-out belangrijk?", a: "ze geeft structuur in één oogopslag en maakt een document betrouwbaar; een slechte lay-out brengt de boodschap slecht over", p: 31 },
    { q: "Wat is een uitnodiging?", a: "een persuasieve tekst die iemand wil aanzetten tot actie (komen naar …)", p: 36 },
    { q: "Welke informatie hoort op een uitnodiging?", a: "organisator, datum, tijdstip, locatie, reden, wat je moet meebrengen, of en hoe je je moet inschrijven", p: 36 },
    { q: "Wat zijn topische vragen (W-vragen)?", a: "vragen om gericht informatie te verzamelen; ze beginnen met wie, wat, waar, waarom, wanneer of hoe", p: 36 },
    { q: "Wat is een samenstelling?", a: "twee of meer (grond)woorden die je aan elkaar plakt tot een nieuw woord (lessenrooster)", p: 40 },
    { q: "Wat is een afleiding?", a: "een grondwoord met een voorvoegsel of achtervoegsel erbij (ongeluk, verkleuring)", p: 40 },
    { q: "Is een verkleinwoord een samenstelling of een afleiding?", a: "een afleiding (tafel + tje = tafeltje)", p: 41 },
    { q: "Wanneer schrijf je een trema?", a: "om klinkerbotsing te voorkomen in een grondwoord of afleiding (reünie, beëindigen), bij samengestelde telwoorden (tweeënzestig) en bij verbuiging/vervoeging (industriële)", p: 47 },
    { q: "Wanneer schrijf je géén trema?", a: "als je de klinkers niet fout kunt uitspreken (oase), in -ieel/-ieer/-iee (industrieel), en bij de uitgangen -ien, -ienne, -eum (opticien, museum)", p: 47 },
    { q: "Hoe vorm je het meervoud van woorden op -ie?", a: "klemtoon achteraan: -ën (allergieën); klemtoon niet achteraan: -n met trema (bacteriën); soms ook -s (kolonies)", p: 48 },
    { q: "Wanneer gebruik je een koppelteken bij klinkerbotsing?", a: "in een samenstelling (zee-egel, auto-ongeluk); in een grondwoord of afleiding gebruik je een trema", p: 50 },
    { q: "Welke andere gevallen krijgen een koppelteken?", a: "letters/cijfers/afkortingen (cd-speler), aardrijkskundige namen (West-Azië), Sint-, gelijkwaardige delen (zwart-wit), reeksen (doe-het-zelver), ex-/niet-/oud-, voorvoegsel + hoofdletter (anti-Frans)", p: 50 },
    { q: "Wat gebeurt er met het trema als je het woord afbreekt aan het einde van een regel?", a: "het trema verdwijnt (ru-ines)", p: 48 },
    { q: "Waarover kan een bijwoord iets meer vertellen?", a: "over een werkwoord, een bijvoeglijk naamwoord, een ander bijwoord, een telwoord of een hele zin", p: 62 },
    { q: "Hoe onderscheid je een bijwoord van een bijvoeglijk naamwoord?", a: "een bijvoeglijk naamwoord zegt iets over een zelfstandig naamwoord; een bijwoord niet", p: 62 },
    { q: "Wat is het verschil tussen een vragend voornaamwoord en een vragend bijwoord?", a: "wie, wat, welke, wiens zijn vragende voornaamwoorden; waar, wanneer, waarom, hoe zijn vragende bijwoorden", p: 65 },
  ];

  Object.assign(I, {
    RECLAME_MMD, SLOGANS, RECLAME_STELLING, LAYOUT_TIPS, UITN_ONDERDELEN, UITNODIGINGEN, DEEL_NAAM, TOPISCH,
    WOORDVORMING, VOORVOEGSELS, ANTONIEMEN, VERKLEIN, TK_SPELLING, KT_REGELS, KT_WOORDEN, IE_MEERVOUD, TK_WOORDFAMILIE,
    BIJWOORD_ZINNEN, BW_WAAROVER, BW_SOORTEN, BW_SOORT_NAAM, VRAAGWOORDEN, SYNONIEMEN, BN_ZN, VRAGEN_WW, FORMEEL, UITDRUKKINGEN, BEGRIPPEN_D1,
  });
})();
