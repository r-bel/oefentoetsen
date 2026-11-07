// ============================================================
// INHOUD – Latijn 2de middelbaar: woordenschat (genummerd) + woordvorming
// Bron: foto's 261107 (woordenlijst 3.3 – 3.6, nrs. 344–408). Wordt aangevuld.
//
// NIEUWE WOORDEN TOEVOEGEN = een regel bijplakken in WOORDEN (zelfde volgorde als het boek).
// Velden per woord:
//   nr      nummer uit het boek (gebruikt voor "van nr. … tot nr. …")
//   sec     sectie/paragraaf (bv. "3.3")
//   la      eerste kolom zoals in het boek (bv. "claudere, ~ō")
//   mid     middenkolom zoals in het boek (bv. "clausī, clausum"); "" = leeg in het boek
//   nl      vertaling; alternatieven met ";" (elk alternatief wordt aanvaard), (…) = optioneel
//   soort   nw (zelfst. nw) | bn (bijv. nw) | ww (werkwoord) | bw (bijwoord) | vw (voegwoord)
//   gs      geslacht (nw): m | v | o        dekl  verbuiging (nw): 1-4        verv  vervoeging (ww): 1 | 2 | 3 | 3io | 4 | onr
//   naamval optioneel: naamval die erbij hoort ("dat." bij crēdere + dat.)
//   vet     vetgedrukt in het boek     s2  met superscript ² in het boek
//   afl     optioneel: afgeleid woord (bv. "Ndl. het krediet") – verschijnt als hint
// Lengtetekens: ā ē ī ō ū (kopieer ze uit een bestaande regel).
// ============================================================
(function () {
  const W = (nr, sec, la, mid, nl, soort, extra = {}) => ({ nr, sec, la, mid, nl, soort, ...extra });

  const WOORDEN = [
    // ---------- 3.3 ----------
    W(344, "3.3", "equus", "equī", "het paard", "nw", { gs: "m", dekl: 2, vet: true }),
    W(345, "3.3", "porta", "portae", "de poort", "nw", { gs: "v", dekl: 1, vet: true }),
    W(346, "3.3", "statua", "statuae", "het standbeeld", "nw", { gs: "v", dekl: 1 }),
    W(347, "3.3", "exemplum", "exemplī", "het voorbeeld", "nw", { gs: "o", dekl: 2, vet: true }),
    W(348, "3.3", "arma", "armōrum", "de wapens", "nw", { gs: "o", dekl: 2, mv: true, vet: true, afl: "Fr. les armes" }),
    W(349, "3.3", "fīnis", "fīnis, m.", "de grens; het einde; het doel", "nw", { gs: "m", dekl: 3, vet: true }),
    W(350, "3.3", "servāre, ~ō", "", "bewaren; redden", "ww", { verv: 1, vet: true }),
    W(351, "3.3", "claudere, ~ō", "clausī, clausum", "sluiten", "ww", { verv: 3, vet: true }),
    W(352, "3.3", "crēdere, ~ō + dat.", "crēdidī, crēditum", "geloven; vertrouwen; toevertrouwen", "ww", { verv: 3, naamval: "dat.", vet: true, s2: true, afl: "Ndl. het krediet" }),
    W(353, "3.3", "relinquere, ~ō", "relīquī, relictum", "achterlaten; verlaten", "ww", { verv: 3, vet: true }),
    W(354, "3.3", "scrībere, ~ō", "scrīpsī, scrīptum", "schrijven", "ww", { verv: 3, vet: true, afl: "Ndl. de scriptie" }),
    W(355, "3.3", "trādere, ~ō", "trādidī, trāditum", "overhandigen; toevertrouwen", "ww", { verv: 3, vet: true, afl: "Ndl. de traditie" }),
    W(356, "3.3", "reperīre, ~iō", "repperī, repertum", "vinden; te weten komen", "ww", { verv: 4, vet: true }),
    W(357, "3.3", "accipere, ~iō", "accēpī, acceptum", "ontvangen; vernemen", "ww", { verv: "3io", vet: true }),
    W(358, "3.3", "recipere, ~iō", "recēpī, receptum", "ontvangen", "ww", { verv: "3io", vet: true }),
    // ---------- 3.4 ----------
    W(359, "3.4", "praeda", "praedae", "de buit; de prooi", "nw", { gs: "v", dekl: 1, vet: true }),
    W(360, "3.4", "imperium", "imperiī", "de heerschappij; het opperbevel; het rijk", "nw", { gs: "o", dekl: 2, vet: true, s2: true }),
    W(361, "3.4", "certus", "~a, ~um", "zeker", "bn", { vet: true }),
    W(362, "3.4", "tempestās", "tempestātis, v.", "de tijd; de storm", "nw", { gs: "v", dekl: 3, vet: true, afl: "Fr. la tempête" }),
    W(363, "3.4", "possidēre, ~eō", "possēdī, possessum", "bezitten; beheersen", "ww", { verv: 2 }),
    W(364, "3.4", "fortasse", "(bijwoord)", "misschien", "bw", { s2: true }),
    // woordvorming: ad-
    W(365, "3.4", "accēdere, ~ō + dat.", "accessī, accessum", "naderen", "ww", { verv: 3, naamval: "dat.", vet: true, vv: "ad" }),
    W(366, "3.4", "addūcere, ~ō", "addūxī, adductum", "brengen naar", "ww", { verv: 3, vet: true, s2: true, vv: "ad" }),
    W(367, "3.4", "adspicere, ~iō", "adspexī, adspectum", "aankijken", "ww", { verv: "3io", vet: true, vv: "ad" }),
    W(368, "3.4", "adesse, ~sum + dat.", "adfuī, -", "aanwezig zijn; helpen", "ww", { verv: "onr", naamval: "dat.", vet: true, vv: "ad" }),
    W(369, "3.4", "adīre, ~eō", "adiī, aditum", "gaan naar; bezoeken", "ww", { verv: "onr", vet: true, vv: "ad" }),
    W(370, "3.4", "afferre, ~ferō", "attulī, allātum", "brengen (naar)", "ww", { verv: "onr", vet: true, vv: "ad" }),
    // woordvorming: ab-
    W(371, "3.4", "āmittere, ~ō", "āmīsī, āmissum", "verliezen", "ww", { verv: 3, vet: true, s2: true, vv: "ab" }),
    W(372, "3.4", "abicere, ~iō", "abiēcī, abiectum", "wegwerpen; neerwerpen", "ww", { verv: "3io", vv: "ab" }),
    W(373, "3.4", "abesse, ~sum", "āfuī, -", "afwezig zijn; verwijderd zijn", "ww", { verv: "onr", vet: true, vv: "ab" }),
    W(374, "3.4", "abīre, ~eō", "abiī, abitum", "weggaan", "ww", { verv: "onr", vet: true, vv: "ab" }),
    W(375, "3.4", "auferre, ~ferō", "abstulī, ablātum", "wegnemen", "ww", { verv: "onr", vet: true, vv: "ab", afl: "Ndl. de ablatief" }),
    // woordvorming: trāns-
    W(376, "3.4", "trādere, ~ō", "trādidī, trāditum", "overhandigen; toevertrouwen", "ww", { verv: 3, vet: true, vv: "trans", afl: "Ndl. de traditie" }),
    W(377, "3.4", "trānsferre, ~ferō", "trānstulī, trānslātum", "overbrengen", "ww", { verv: "onr", vv: "trans" }),
    W(378, "3.4", "trānsīre, ~eō", "trānsiī, trānsitum", "oversteken", "ww", { verv: "onr", vet: true, vv: "trans" }),
    // ---------- 3.5 ----------
    W(379, "3.5", "spēlunca", "spēluncae", "de grot", "nw", { gs: "v", dekl: 1, s2: true, afl: "Ndl. de spelonk" }),
    W(380, "3.5", "saxum", "saxī", "het rotsblok", "nw", { gs: "o", dekl: 2, vet: true }),
    W(381, "3.5", "posterus", "~a, ~um", "volgend", "bn", { vet: true, s2: true }),
    W(382, "3.5", "validus", "~a, ~um", "krachtig; sterk", "bn", { vet: true, s2: true }),
    W(383, "3.5", "fūr", "fūris, m.", "de dief", "nw", { gs: "m", dekl: 3, s2: true }),
    W(384, "3.5", "sanguis", "sanguinis, m.", "het bloed", "nw", { gs: "m", dekl: 3, vet: true, s2: true, afl: "Fr. le sang" }),
    W(385, "3.5", "mēns", "mentis, v.", "de geest; het verstand", "nw", { gs: "v", dekl: 3, vet: true, s2: true }),
    W(386, "3.5", "vulnus", "vulneris, o.", "de wonde", "nw", { gs: "o", dekl: 3, vet: true }),
    W(387, "3.5", "exitus", "exitūs", "de uitgang; de afloop", "nw", { gs: "m", dekl: 4, s2: true }),
    W(388, "3.5", "adiuvāre, ~ō", "adiūvī, adiūtum", "helpen", "ww", { verv: 1 }),
    W(389, "3.5", "placēre, ~eō + dat.", "", "bevallen; aanstaan", "ww", { verv: 2, naamval: "dat.", vet: true }),
    W(390, "3.5", "rīdēre, ~eō", "rīsī, rīsum", "(uit)lachen", "ww", { verv: 2 }),
    W(391, "3.5", "bibere, ~ō", "bibī, -", "drinken", "ww", { verv: 3 }),
    W(392, "3.5", "canere, ~ō", "cecinī, -", "zingen; bezingen", "ww", { verv: 3, vet: true }),
    W(393, "3.5", "fluere, ~ō", "flūxī, flūxum", "vloeien", "ww", { verv: 3 }),
    W(394, "3.5", "intellegere, ~ō", "intellēxī, intellēctum", "begrijpen", "ww", { verv: 3, vet: true }),
    W(395, "3.5", "vīvere, ~ō", "vīxī, vīctum", "leven", "ww", { verv: 3, vet: true }),
    W(396, "3.5", "offerre, ~ferō", "obtulī, oblātum", "aanbieden", "ww", { verv: "onr", vet: true, afl: "Ndl. het offer" }),
    W(397, "3.5", "bene", "(bijwoord)", "goed", "bw", { vet: true }),
    W(398, "3.5", "forte", "(bijwoord)", "toevallig", "bw", { vet: true, s2: true }),
    W(399, "3.5", "frūstrā", "(bijwoord)", "tevergeefs", "bw", { vet: true, s2: true }),
    W(400, "3.5", "multum of multō", "(bijwoord)", "veel", "bw", { vet: true, s2: true }),
    W(401, "3.5", "sīcut", "(ondersch. voegw.)", "zoals", "vw"),
    // ---------- 3.6 ----------
    W(402, "3.6", "modus", "modī", "de wijze; de maat", "nw", { gs: "m", dekl: 2, vet: true, s2: true }),
    W(403, "3.6", "annus", "annī", "het jaar", "nw", { gs: "m", dekl: 2, vet: true }),
    W(404, "3.6", "fēlix", "~, ~; fēlīcis", "gelukkig", "bn"),
    W(405, "3.6", "docēre, ~eō", "docuī, doctum", "onderwijzen", "ww", { verv: 2, vet: true, afl: "Ndl. doceren" }),
    W(406, "3.6", "dēligere, ~ō", "dēlēgī, dēlēctum", "uitkiezen", "ww", { verv: 3, vet: true, s2: true }),
    W(407, "3.6", "frangere, ~ō", "frēgī, frāctum", "breken", "ww", { verv: 3, afl: "Ndl. fragiel, de fractie" }),
    W(408, "3.6", "sūmere, ~ō", "sūmpsī, sūmptum", "nemen", "ww", { verv: 3, vet: true }),
  ];

  // ---------- woordvorming (kaders in het boek) ----------
  // achtervoegsels: [werkwoord, betekenis ww, afgeleid woord, betekenis afgeleid woord (alternatieven met ;)]
  const ACHTERVOEGSELS = [
    { sfx: "-tor / -sor", duidt: "de persoon die handelt", woorden: [
      ["currere, ~ō", "lopen", "cursor, -ōris", "de loper"],
      ["imperāre, ~ō", "bevelen; opeisen", "imperātor", "de bevelhebber; de keizer; de heerser"],
      ["scrībere, ~ō", "schrijven", "scrīptor", "de schrijver"],
      ["vincere, ~ō", "overwinnen; overtreffen", "victor", "de overwinnaar"],
    ] },
    { sfx: "-or", duidt: "de handeling", woorden: [
      ["amāre, ~ō", "beminnen; houden van", "amor, -ōris", "de liefde"],
      ["clāmāre, ~ō", "roepen", "clāmor", "het geroep; de kreet"],
      ["dolēre, ~eō", "lijden; betreuren", "dolor", "de pijn; het verdriet; de smart"],
      ["errāre, ~ō", "zwerven; zich vergissen", "error", "de vergissing; de dwaling; het zwerven"],
      ["labōrāre, ~ō", "werken; lijden", "labor", "het werk; de inspanning; de moeite"],
      ["timēre, ~eō", "vrezen; bang zijn", "timor", "de vrees; de angst"],
    ] },
    { sfx: "-ium", duidt: "het resultaat van de handeling", woorden: [
      ["aedificāre, ~ō", "bouwen", "aedificium, -iī", "het gebouw"],
      ["gaudēre, ~eō", "blij zijn", "gaudium", "de vreugde; de blijdschap"],
      ["incendere, ~ō", "in brand steken", "incendium", "de brand"],
    ] },
  ];
  const VOORVOEGSELS = {
    ad: { vorm: "ad-", betekenis: "naar; (tot) bij" },
    ab: { vorm: "ab-", betekenis: "weg van" },
    trans: { vorm: "trā(ns)-", betekenis: "over" },
  };

  // ---------- namen van verbuigingen en vervoegingen (pas aan aan de termen van de klas) ----------
  const DEKL_NAAM = { 1: "1e verbuiging", 2: "2e verbuiging", 3: "3e verbuiging", 4: "4e verbuiging", 5: "5e verbuiging" };
  const DEKL_REGEL = { 1: "genitief op -ae", 2: "genitief op -ī", 3: "genitief op -is", 4: "genitief op -ūs", 5: "genitief op -eī" };
  const VERV_NAAM = { 1: "1e vervoeging (-āre)", 2: "2e vervoeging (-ēre, ~eō)", 3: "3e vervoeging (-ere, ~ō)", "3io": "3e vervoeging op -iō (-ere, ~iō)", 4: "4e vervoeging (-īre, ~iō)", onr: "onregelmatig (esse, īre, ferre …)" };
  const GS_NAAM = { m: "mannelijk", v: "vrouwelijk", o: "onzijdig" };

  // ---------- fouttypes: titel, tip ----------
  const TAGS = {
    lengteteken: { title: "Lengtetekens", short: "lengteteken", advice: "Het woord is juist, maar let op de lengtetekens (ā, ē, ī, ō, ū): ze horen bij de vorm.", page: "" },
    spelling: { title: "Bijna juist (één letter)", short: "spelling", advice: "Schrijf deze vormen een paar keer over.", page: "" },
    betekenis: { title: "Betekenis", short: "betekenis", advice: "Leer de woorden met afdekken: lees het Latijnse woord, zeg de vertaling, controleer.", page: "" },
    middenkolom: { title: "Middenkolom (genitief / stamtijden)", short: "middenkolom", advice: "Leer de middenkolom altijd mee: bij een naamwoord de genitief (en het geslacht), bij een werkwoord perfectum en supinum.", page: "" },
    geslacht: { title: "Geslacht vergeten of fout", short: "geslacht", advice: "Bij de 3e verbuiging staat het geslacht in de middenkolom (m., v., o.): leer het mee.", page: "" },
    verbuiging: { title: "Verbuiging herkennen", short: "verbuiging", advice: "Kijk naar de genitief: -ae = 1e, -ī = 2e, -is = 3e, -ūs = 4e verbuiging.", page: "" },
    vervoeging: { title: "Vervoeging herkennen", short: "vervoeging", advice: "Kijk naar de infinitief én de 1e persoon: -āre = 1e, -ēre/~eō = 2e, -ere/~ō = 3e, -ere/~iō = 3e op -iō, -īre/~iō = 4e. Samenstellingen van esse, īre, ferre zijn onregelmatig.", page: "" },
    woordvorming: { title: "Woordvorming", short: "woordvorming", advice: "-tor/-sor = de persoon die handelt, -or = de handeling, -ium = het resultaat. ad- = naar, (tot) bij; ab- = weg van; trā(ns)- = over.", page: "" },
    naamval: { title: "Werkwoorden met datief", short: "naamval", advice: "Let op '+ dat.' in de woordenlijst: crēdere, accēdere, adesse, placēre … worden met een datief gebruikt.", page: "" },
    woordsoort: { title: "Woordsoort", short: "woordsoort", advice: "Bij onveranderlijke woorden staat de woordsoort in de middenkolom: (bijwoord), (ondersch. voegw.).", page: "" },
    fout: { title: "Fout", short: "fout", advice: "", page: "" },
  };

  Vakken.setInhoud("latijn-2", {
    vak: "Latijn", icon: "🏛️", theme: "amber", klas: "2de middelbaar",
    titel: "Woordenschat & woordvorming", bron: "woordenlijst 3.3 – 3.6 (wordt aangevuld)",
    WOORDEN, ACHTERVOEGSELS, VOORVOEGSELS, DEKL_NAAM, DEKL_REGEL, VERV_NAAM, GS_NAAM, TAGS,
  });
})();
