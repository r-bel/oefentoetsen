// ============================================================
// INHOUD – CLIL Geschiedenis in het Frans (2de middelbaar)
// Bron: cursus geschiedenis in het Frans, p.37-42:
//   p.37  Mycènes sombre (guerres et migrations)
//   p.38-41 Quiz « L'arrivée des Grecs »: carte, Indo-Européens, vocabulaire (photos),
//           Crète ↔ Mycènes (tableau + images + mots à employer)
//   p.42  Leçon 6: la société grecque – installation, Hellas / la Grèce / polis / acropole
// Er komt later meer: voeg nieuwe items toe ACHTERAAN een lijst (de voortgang hangt aan de plaats).
//
// Een vraag (bank-item): { q, a: [aanvaarde antwoorden…], show?, opts?: [foute keuzes], x?: uitleg, p: pagina }
//   - opts ontbreekt → foute keuzes komen uit de andere antwoorden van hetzelfde onderdeel (of uit "pool")
//   - typ: true → op 'moeilijk' zelf typen (anders altijd meerkeuze)
// Foto's uit de cursus gebruiken we niet (auteursrecht); we werken met een omschrijving en een icoon.
// ============================================================
(function () {
  // ---------- vocabulaire (p.39, oef. 3 « Cherche le mot qui correspond ») ----------
  const VOCAB = [
    { fr: "un orfèvre", nl: "een goudsmid", icon: "💍", def: "Il fabrique des bijoux en or ou en argent." },
    { fr: "une forteresse", nl: "een vesting / een burcht", icon: "🏰", def: "Un endroit fortifié, avec des murs épais, pour se défendre." },
    { fr: "un masque mortuaire", nl: "een dodenmasker", icon: "🎭", def: "Un masque (souvent en or) posé sur le visage d'un mort, comme le « masque d'Agamemnon »." },
    { fr: "l'agriculture", nl: "de landbouw", icon: "🌾", def: "Cultiver la terre et élever des animaux." },
    { fr: "le pouvoir", nl: "de macht", icon: "👑", def: "Pouvoir décider pour les autres, commander." },
    { fr: "une guerre", nl: "een oorlog", icon: "⚔️", def: "Un combat armé entre des peuples ou des pays." },
    { fr: "du commerce", nl: "handel", icon: "🛍️", def: "Acheter et vendre des marchandises." },
    { fr: "une tombe royale", nl: "een koningsgraf", icon: "⚱️", def: "L'endroit où on enterre un roi." },
    { fr: "un mur d'enceinte", nl: "een ringmuur / een omwalling", icon: "🧱", def: "Un grand mur tout autour d'une ville ou d'une forteresse." },
  ];

  // ---------- Crète ou Mycènes ? (p.40-41) ----------
  // c = "C" (Crète / Cnossos) of "M" (Mycènes)
  const CM = [
    { s: "La civilisation minoenne (ou crétoise)", c: "C" },
    { s: "La civilisation mycénienne", c: "M" },
    { s: "Point culminant: de -2000 à -1400", c: "C" },
    { s: "Point culminant: de -1400 à -1200", c: "M" },
    { s: "C'est un palais (Cnossos).", c: "C" },
    { s: "C'est une forteresse.", c: "M" },
    { s: "Des magasins autour d'une cour intérieure", c: "C" },
    { s: "Construite sur une colline", c: "M" },
    { s: "Caractère ouvert (pas de murs de défense)", c: "C" },
    { s: "Caractère fermé (un grand mur d'enceinte)", c: "M" },
    { s: "Le labyrinthe", c: "C" },
    { s: "Le minotaure", c: "C" },
    { s: "L'acropole", c: "M" },
    { s: "Les cyclopes (les murs « cyclopéens »)", c: "M" },
    { s: "La guerre de Troie", c: "M" },
    { s: "Les fresques avec le taureau et les dauphins", c: "C" },
    { s: "Les fresques avec une femme et un char", c: "M" },
    { s: "Terminée par une éruption volcanique + l'invasion par les Mycéniens", c: "C" },
    { s: "Terminée par l'invasion par les Doriens", c: "M" },
  ];

  // ---------- le tableau à remplir (p.40), avec les « mots à employer » (p.41) ----------
  const MOTS = ["labyrinthe", "mycénienne", "forteresse", "fresques", "une éruption volcanique", "-2000 à -1400", "ouvert", "fermé", "minoenne", "Doriens", "sur une colline", "-1400 à -1200", "crétoise", "cyclope", "Troie", "Mycéniens", "palais", "minotaure", "acropole", "magasins autour d'une cour intérieure"];
  const TABLEAU = [
    { q: "Crète – Nom: la civilisation m… ou c…", a: ["minoenne ou crétoise", "minoenne", "crétoise"], show: "minoenne ou crétoise", typ: true },
    { q: "Mycènes – Nom: la civilisation m…", a: ["mycénienne"], typ: true },
    { q: "Crète – Point culminant: de … à …", a: ["-2000 à -1400"] },
    { q: "Mycènes – Point culminant: de … à …", a: ["-1400 à -1200"] },
    { q: "Crète – Architecture: Cnossos est un p…", a: ["palais"], typ: true },
    { q: "Mycènes – Architecture: Mycènes est une …", a: ["forteresse"], typ: true },
    { q: "Crète – Architecture: une caractéristique de Cnossos", a: ["magasins autour d'une cour intérieure"], opts: ["sur une colline", "un mur d'enceinte", "une acropole"] },
    { q: "Mycènes – Architecture: une caractéristique de Mycènes", a: ["sur une colline"], opts: ["magasins autour d'une cour intérieure", "sans murs de défense", "un labyrinthe"] },
    { q: "Peinture: des peintures avec de l'aquarelle sur les murs mouillés: ce sont des …", a: ["fresques", "des fresques"], show: "fresques", typ: true },
    { q: "Crète – Caractère:", a: ["ouvert"], opts: ["fermé"] },
    { q: "Mycènes – Caractère:", a: ["fermé", "ferme"], show: "fermé", opts: ["ouvert"] },
    { q: "Crète – La civilisation est terminée par … + l'invasion par les Mycéniens", a: ["une éruption volcanique"], typ: true },
    { q: "Crète – La civilisation est terminée par une éruption volcanique + l'invasion par les …", a: ["Mycéniens"], typ: true },
    { q: "Mycènes – La civilisation est terminée par l'invasion par les …", a: ["Doriens"], typ: true },
    { q: "Le palais de Cnossos: c'est l'image numéro …", a: ["1"], opts: ["2", "3", "4"] },
    { q: "La forteresse de Mycènes: c'est l'image numéro …", a: ["2"], opts: ["1", "3", "4"] },
  ];

  // ---------- chronologie (p.37, p.40, p.42) ----------
  const CHRONO = [
    { q: "Entre quelles dates les Grecs se sont-ils installés dans le bassin méditerranéen ?", a: ["entre -2000 et -1200"], opts: ["entre -1200 et -1000", "entre -3000 et -2000", "entre -1400 et -1200"], p: "42" },
    { q: "1250 – 1000 a. C.: que se passe-t-il ?", a: ["Les principautés mycéniennes s'affaiblissent."], opts: ["La civilisation minoenne commence.", "Les Grecs arrivent en Crète.", "Cnossos est construit."], x: "principauté = vorstendom", p: "37" },
    { q: "1200 a. C.: que se passe-t-il ?", a: ["Quelques centres mycéniens sont détruits."], opts: ["Les principautés mycéniennes s'affaiblissent.", "Une éruption volcanique détruit Mycènes.", "Les Mycéniens arrivent en Crète."], p: "37" },
    { q: "Pourquoi la culture mycénienne disparaît-elle ?", a: ["Des guerres et des migrations"], opts: ["Une éruption volcanique", "L'invasion par les Romains", "Une maladie"], x: "« Mycènes sombre (gaat ten onder) dans des guerres et des migrations »", p: "37" },
    { q: "De grands groupes de gens déménagent dans le monde grec. Comment appelle-t-on ça ?", a: ["des migrations"], opts: ["du commerce", "des fresques", "des colonies"], p: "37" },
    { q: "Le point culminant (summum, apogée) de la Crète:", a: ["de -2000 à -1400"], opts: ["de -1400 à -1200", "de -1200 à -1000", "de -3000 à -2000"], p: "40" },
    { q: "Le point culminant (summum, apogée) de Mycènes:", a: ["de -1400 à -1200"], opts: ["de -2000 à -1400", "de -1200 à -1000", "de -1600 à -1400"], p: "40" },
  ];

  // ---------- géographie (p.38 carte de la Grèce, p.42 carte des colonies) ----------
  const GEO = [
    { q: "La mer à l'est de la Grèce, entre la Grèce et la Turquie actuelle:", a: ["la Mer Égée", "la mer egee", "mer egee"], show: "la Mer Égée", opts: ["la Mer Ionienne", "la Mer Noire", "la Mer de Crète"], p: "38" },
    { q: "La mer à l'ouest de la Grèce, entre la Grèce et l'Italie:", a: ["la Mer Ionienne", "mer ionienne"], show: "la Mer Ionienne", opts: ["la Mer Égée", "la Mer de Marmara", "la Mer Noire"], p: "38" },
    { q: "Mycènes se trouve …", a: ["dans le Péloponnèse (Argolide), au sud de la Grèce continentale"], opts: ["sur l'île de Crète", "en Asie Mineure (Turquie actuelle)", "en Macédoine, au nord de la Grèce"], p: "38" },
    { q: "Troie se trouve …", a: ["en Asie Mineure (Turquie actuelle), près des Dardanelles"], opts: ["dans le Péloponnèse", "sur l'île de Crète", "en Italie"], p: "38" },
    { q: "La Crète, c'est …", a: ["une grande île au sud de la mer Égée"], opts: ["une ville du Péloponnèse", "une mer à l'ouest de la Grèce", "une région en Turquie"], p: "38" },
    { q: "Cnossos se trouve …", a: ["sur l'île de Crète"], opts: ["dans le Péloponnèse", "en Asie Mineure", "en Macédoine"], p: "38" },
    { q: "Les Grecs se sont installés surtout dans la partie … de la Méditerranée.", a: ["orientale", "orientale (Est)", "est", "l'est"], show: "orientale (Est)", opts: ["occidentale (Ouest)"], typ: true, p: "42" },
  ];

  // ---------- Indo-Européens (p.38, oef. 2) ----------
  const INDO = ["les Grecs", "les Latins", "les Celtes", "les Germains", "les Slaves", "les Baltes", "les Albanais", "les Hittites", "les Perses (Iraniens)", "les Aryens (Indiens)", "les Tokhariens"];
  const PAS_INDO = ["les Égyptiens", "les Phéniciens", "les Chinois", "les Arabes", "les Babyloniens", "les Mayas"];

  // ---------- définitions (p.42, exercice 1 « Fais la bonne combinaison ») ----------
  const DEFS = [
    { t: "Hellas", d: "le nom que les Grecs donnent à leur pays" },
    { t: "la Grèce", d: "nom dérivé (= afgeleid) du latin « Magna Graecia »" },
    { t: "une polis", d: "une ville-état / une cité-état / une cité grecque" },
    { t: "une acropole", d: "un plateau rocheux au milieu d'une polis, avec une fonction religieuse ou politique" },
  ];

  const TAGS = {
    vocab: { title: "Vocabulaire", short: "woord", advice: "Leer de woorden met lidwoord (un/une/le/la) en hun betekenis. Kijk naar het icoon of de omschrijving.", page: "39" },
    accent: { title: "Accent", short: "accent", advice: "Let op é, è, ê, ç… (orfèvre, éruption, Égée).", page: "" },
    cm: { title: "Crète of Mycènes verward", short: "Crète/Mycènes", advice: "Crète = Cnossos = palais, ouvert, labyrinthe, minotaure, -2000 à -1400. Mycènes = forteresse sur une colline, fermé, acropole, cyclopes, Troie, -1400 à -1200.", page: "40-41" },
    dates: { title: "Data", short: "data", advice: "Crète -2000 à -1400 · Mycènes -1400 à -1200 · installation des Grecs -2000 à -1200 · Mycènes sombre 1250 – 1000.", page: "37, 40, 42" },
    geo: { title: "Kaart", short: "kaart", advice: "Mer Égée = oost, Mer Ionienne = west, Crète = eiland in het zuiden, Mycènes in de Peloponnesos, Troie in Klein-Azië (Turkije).", page: "38" },
    indo: { title: "Indo-Européens", short: "indo", advice: "Grecs, Latins, Celtes, Germains, Slaves, Baltes, Albanais, Hittites, Perses (Iraniens), Aryens (Indiens), Tokhariens.", page: "38" },
    defs: { title: "Begrippen Leçon 6", short: "begrippen", advice: "Hellas = naam die de Grieken zelf gebruiken · la Grèce = van het Latijn « Magna Graecia » · polis = stadstaat · acropole = rotsplateau met religieuze of politieke functie.", page: "42" },
    fout: { title: "Fout", short: "fout", advice: "", page: "" },
  };

  Vakken.setInhoud("clil-geschiedenis-2", {
    vak: "Geschiedenis (CLIL)", icon: "🏺", theme: "amber",
    titel: "L'arrivée des Grecs – Crète et Mycènes", klas: "2de middelbaar",
    bron: "cursus geschiedenis in het Frans – p.37-42",
    VOCAB, CM, MOTS, TABLEAU, CHRONO, GEO, INDO, PAS_INDO, DEFS, TAGS,
  });
})();
