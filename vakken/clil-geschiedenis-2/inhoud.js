// ============================================================
// INHOUD – CLIL Geschiedenis in het Frans (2de middelbaar)
// Bron: cursus geschiedenis in het Frans, p.37-42:
//   p.37  Mycènes sombre (guerres et migrations)
//   p.38-41 Quiz « L'arrivée des Grecs »: carte, Indo-Européens, vocabulaire (photos),
//           Crète ↔ Mycènes (tableau + images + mots à employer)
//   p.42  Leçon 6: la société grecque – installation, Hellas / la Grèce / polis / acropole
//   p.50-57 Travail de groupe « Les jeux Olympiques » (groupes A–E + correction):
//           JO classiques ↔ modernes, le sanctuaire d'Olympie, Héraclès, Iphitos, le pentathlon,
//           les vainqueurs, la fin (Théodose 394), Delphes/Corinthe, Coubertin 1896, les anneaux 1914
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

  // ============================================================
  // LES JEUX OLYMPIQUES (p.50-57, travail de groupe A–E)
  // ============================================================
  // ---------- vocabulaire des JO ----------
  const JO_VOCAB = [
    { fr: "le sanctuaire", nl: "het heiligdom", icon: "⛩️", def: "Un lieu sacré, consacré à un dieu (comme Olympie, pour Zeus)." },
    { fr: "un temple", nl: "een tempel", icon: "🏛️", def: "Le bâtiment où habite la statue d'un dieu." },
    { fr: "un autel", nl: "een altaar", icon: "🪨", def: "Une grande pierre où on fait des sacrifices aux dieux." },
    { fr: "le stade", nl: "het stadion / de renbaan", icon: "🏃", def: "La piste de 192 m pour la course à pied." },
    { fr: "l'hippodrome", nl: "de renbaan voor paarden en wagens", icon: "🐎", def: "Une piste de 770 m pour les courses de chars et de chevaux." },
    { fr: "le gymnase", nl: "het gymnasium (oefengebouw)", icon: "🏋️", def: "Le bâtiment où on dort, se baigne et s'entraîne." },
    { fr: "la palestre", nl: "de worstelschool (oefenplein)", icon: "🤼", def: "Un espace en plein air pour faire du saut en longueur, de la lutte, du pugilat." },
    { fr: "un athlète", nl: "een atleet", icon: "🏅", def: "Un sportif qui participe aux jeux." },
    { fr: "le vainqueur", nl: "de winnaar", icon: "🥇", def: "La personne qui remporte une victoire." },
    { fr: "une couronne d'olivier", nl: "een olijfkrans", icon: "🌿", def: "Le prix des vainqueurs aux jeux d'Olympie." },
    { fr: "la course à pied", nl: "de wedloop (lopen)", icon: "🏃‍♂️", def: "Courir le plus vite possible sur la piste du stade." },
    { fr: "le saut en longueur", nl: "het verspringen", icon: "🦘", def: "Sauter le plus loin possible." },
    { fr: "le lancer de disque", nl: "het discuswerpen", icon: "🥏", def: "Lancer un disque le plus loin possible." },
    { fr: "le lancer de javelot", nl: "het speerwerpen", icon: "🎯", def: "Lancer une lance le plus loin possible." },
    { fr: "la lutte", nl: "het worstelen", icon: "🤼‍♂️", def: "Un combat à deux où on essaie de mettre l'autre par terre." },
    { fr: "le pugilat", nl: "het vuistgevecht (oude vorm van boksen)", icon: "🥊", def: "L'ancêtre de la boxe." },
    { fr: "la course de chars", nl: "de wagenrennen", icon: "🏇", def: "Une course avec des chars tirés par des chevaux, dans l'hippodrome." },
    { fr: "une procession", nl: "een processie / een optocht", icon: "🚶", def: "Un long cortège religieux à la fin des jeux." },
    { fr: "un banquet", nl: "een feestmaal", icon: "🍗", def: "Un grand repas de fête." },
    { fr: "un hymne", nl: "een lofzang / een hymne", icon: "🎵", def: "Un chant en l'honneur des dieux ou des vainqueurs, chanté par les poètes." },
    { fr: "une prêtresse", nl: "een priesteres", icon: "🔮", def: "Une femme au service d'un dieu (la Pythie à Delphes)." },
    { fr: "un anneau", nl: "een ring", icon: "⭕", def: "Le symbole olympique en compte cinq." },
    { fr: "un drapeau", nl: "een vlag", icon: "🏳️", def: "Le symbole olympique: un … blanc avec 5 anneaux." },
    { fr: "un siècle", nl: "een eeuw", icon: "💯", def: "Une période de 100 ans." },
  ];

  // ---------- le sanctuaire d'Olympie (groupe A + D) ----------
  // n = numéro sur la reconstitution; f = fonction
  const OLYMPIE = [
    { n: 1, t: "le temple de Zeus", f: "le grand temple (64 m de long) avec la statue géante de Zeus" },
    { n: 2, t: "le temple d'Héra", f: "le temple de la femme de Zeus" },
    { n: 3, t: "l'autel de Zeus", f: "la grande pierre pour les sacrifices à Zeus" },
    { n: 4, t: "le gymnase", f: "le bâtiment où on dort, se baigne et s'entraîne (disque, course…)" },
    { n: 5, t: "la palestre", f: "l'espace en plein air pour le saut en longueur, la lutte, le pugilat" },
    { n: 6, t: "le stade", f: "la piste de 192 m pour la course à pied" },
    { n: 7, t: "l'hippodrome", f: "la piste de 770 m pour les courses de chars et de chevaux" },
    { n: 8, t: "le prytanée", f: "le siège des administrateurs du sanctuaire et le lieu des banquets" },
    { n: 9, t: "les trésors des cités", f: "les petits bâtiments où les cités gardent leurs offrandes" },
  ];

  // ---------- questions des groupes A–E (avec la correction) ----------
  const JO_QUEST = [
    // groupe A
    { q: "Pendant combien de temps est-ce qu'on a organisé les Jeux Olympiques classiques ?", a: ["1160 ans"], opts: ["1502 ans", "776 ans", "394 ans"], x: "de 776 av. J.-C. jusqu'à 394 ap. J.-C.: 776 + 394 = 1160 ans", p: "50" },
    { q: "Il y a combien de siècles entre les JO classiques et les JO modernes de 1896 ?", a: ["15 siècles", "15", "quinze siècles"], show: "15 siècles", opts: ["11 siècles", "19 siècles", "5 siècles"], x: "de 394 à 1896: 1896 − 394 = 1502 ans", typ: true, p: "50" },
    // groupe B
    { q: "Les Jeux Olympiques duraient combien de temps ?", a: ["de 5 à 7 jours", "5 a 7 jours", "5 à 7 jours"], show: "de 5 à 7 jours", opts: ["1 jour", "1 mois", "2 semaines"], typ: true, p: "52" },
    { q: "Qui a créé les Jeux Olympiques selon la légende ?", a: ["Zeus ou Héraclès"], opts: ["Apollon ou Poséidon", "Iphitos", "Pierre de Coubertin"], p: "52" },
    { q: "Depuis quand est-ce que les Jeux Olympiques existent ?", a: ["depuis 1500 av. J.-C."], opts: ["depuis 776 av. J.-C.", "depuis 884 av. J.-C.", "depuis 394 ap. J.-C."], x: "mais ils sont réguliers depuis 776 av. J.-C.", p: "52" },
    { q: "Depuis quand est-ce que les Jeux Olympiques sont réguliers ?", a: ["depuis 776 av. J.-C."], opts: ["depuis 1500 av. J.-C.", "depuis 884 av. J.-C.", "depuis 1896"], p: "52" },
    { q: "Qui est Héraclès ?", a: ["le fils de Zeus"], opts: ["le roi du Péloponnèse", "le dieu de la mer", "un empereur chrétien"], x: "Héraclès protège les athlètes", p: "52" },
    { q: "Héraclès protège qui ?", a: ["les athlètes"], opts: ["les prêtresses", "les marins", "les rois"], typ: true, p: "52" },
    { q: "Donne un exemple des « douze travaux » d'Héraclès.", a: ["tuer un lion monstrueux ou un serpent d'eau à 9 têtes"], opts: ["construire le temple de Zeus", "gagner la course de chars", "finir la guerre contre Sparte"], x: "le serpent d'eau à 9 têtes = l'Hydre", p: "52" },
    // groupe C
    { q: "Qui veut finir la guerre contre Sparte ?", a: ["Iphitos", "Iphitos, un roi du Péloponnèse"], show: "Iphitos, un roi du Péloponnèse", opts: ["Théodose, un empereur chrétien", "Héraclès, le fils de Zeus", "Pierre de Coubertin, un Français"], p: "53" },
    { q: "En quelle année Iphitos veut-il finir la guerre contre Sparte ?", a: ["en 884 av. J.-C."], opts: ["en 776 av. J.-C.", "en 394 ap. J.-C.", "en 1500 av. J.-C."], p: "53" },
    { q: "Qui est la Pythie ?", a: ["une grande prêtresse à Delphes"], opts: ["la femme de Zeus", "une reine de Sparte", "une athlète d'Olympie"], p: "53" },
    { q: "Qu'est-ce que la Pythie conseille à Iphitos ?", a: ["de relancer les jeux d'Olympie"], opts: ["de faire la guerre contre Sparte", "de construire un temple pour Apollon", "d'arrêter les jeux"], p: "53" },
    { q: "Explique le pentathlon.", a: ["penta = 5 en grec: 5 sports"], opts: ["penta = 10 en grec: 10 sports", "une course de chars avec 5 chevaux", "une course de 5 jours"], x: "lancer de disque, lancer de javelot, course à pied, saut en longueur, lutte", p: "53" },
    { q: "Le pugilat, c'est …", a: ["l'ancêtre de la boxe"], opts: ["l'ancêtre du football", "une course de chars", "le lancer de javelot"], p: "53" },
    { q: "Combien mesurait le temple de Zeus ?", a: ["64 m de long", "64 m", "64"], show: "64 m de long", opts: ["192 m de long", "770 m de long", "15 m de long"], x: "dedans: une statue de Zeus extrêmement grande", p: "54" },
    // groupe D
    { q: "Quels sont les 4 bâtiments les plus importants dans l'enceinte sacrée d'Olympie ?", a: ["l'hippodrome, le stade, la palestre, le gymnase"], opts: ["le temple de Zeus, le temple d'Héra, l'autel, le prytanée", "l'acropole, le palais, le labyrinthe, la forteresse", "le théâtre, l'agora, le port, le marché"], p: "54" },
    { q: "Pourquoi est-ce que l'éducation physique est nécessaire pour les Grecs anciens ?", a: ["pour le développement du corps et de l'esprit"], opts: ["pour gagner beaucoup d'argent", "pour faire la guerre contre les Romains", "pour devenir prêtre"], x: "le courage, l'endurance", p: "55" },
    { q: "Comment est-ce qu'on finit les jeux ? Avec des banquets, des processions et …", a: ["des hymnes chantés par les poètes", "des hymnes"], show: "des hymnes chantés par les poètes", opts: ["des combats de gladiateurs", "des médailles d'or", "une course de chars"], typ: true, p: "55" },
    { q: "Qu'est-ce qu'on donne aux vainqueurs ?", a: ["une couronne d'olivier", "une couronne d'olivier + leurs noms inscrits dans la pierre"], show: "une couronne d'olivier", opts: ["une médaille d'or", "beaucoup d'argent", "une maison à Olympie"], x: "et leurs noms étaient inscrits dans la pierre", typ: true, p: "55" },
    { q: "À part la couronne d'olivier, quel honneur reçoivent les vainqueurs ?", a: ["leurs noms sont inscrits dans la pierre"], opts: ["ils deviennent rois", "ils reçoivent une médaille d'or", "ils ne doivent plus payer d'impôts"], p: "55" },
    // groupe E
    { q: "Qui a fini les Jeux Olympiques ?", a: ["l'empereur chrétien Théodose", "Théodose"], show: "l'empereur chrétien Théodose", opts: ["le roi Iphitos", "la Pythie", "Pierre de Coubertin"], typ: true, p: "56" },
    { q: "En quelle année les Jeux Olympiques classiques ont-ils fini ?", a: ["en 394 ap. J.-C.", "394"], show: "en 394 ap. J.-C.", opts: ["en 776 av. J.-C.", "en 884 av. J.-C.", "en 1896"], p: "56" },
    { q: "Pourquoi les JO classiques ont-ils fini ?", a: ["les sportifs sont devenus professionnels et plus violents (+ la conquête romaine)"], opts: ["il n'y avait plus d'athlètes en Grèce", "une éruption volcanique a détruit Olympie", "les femmes voulaient participer"], p: "56" },
    { q: "Les jeux de Delphes sont dédiés à …", a: ["Apollon"], opts: ["Poséidon", "Zeus", "Héra"], typ: true, p: "56" },
    { q: "Les jeux de Corinthe sont dédiés à …", a: ["Poséidon", "Poseidon"], show: "Poséidon", opts: ["Apollon", "Zeus", "Héra"], typ: true, p: "56" },
    { q: "Qu'est-ce qui s'est passé en 1896 ?", a: ["le Français Pierre de Coubertin rassemble à Athènes 295 athlètes de 13 pays"], opts: ["l'empereur Théodose arrête les jeux", "le roi Iphitos relance les jeux d'Olympie", "le drapeau avec 5 anneaux est dessiné"], x: "les premiers JO modernes", p: "57" },
    { q: "Qui a réorganisé les Jeux Olympiques modernes ?", a: ["Pierre de Coubertin", "Coubertin", "le baron Pierre de Coubertin"], show: "Pierre de Coubertin", opts: ["Théodose", "Iphitos", "Héraclès"], x: "un baron français", typ: true, p: "57" },
    { q: "Où ont eu lieu les premiers JO modernes en 1896 ?", a: ["à Athènes", "Athènes", "Athenes"], show: "à Athènes", opts: ["à Olympie", "à Paris", "à Delphes"], typ: true, p: "57" },
    { q: "En 1896, combien d'athlètes et de pays ?", a: ["295 athlètes de 13 pays"], opts: ["13 athlètes de 295 pays", "1160 athlètes de 15 pays", "776 athlètes de 5 pays"], p: "57" },
    { q: "Qu'est-ce qui s'est passé en 1914 ?", a: ["Coubertin fait dessiner 5 anneaux de couleurs différentes sur un drapeau blanc"], opts: ["les premiers JO modernes à Athènes", "Théodose arrête les jeux", "on construit le stade d'Olympie"], x: "c'est le symbole des Jeux Olympiques", p: "57" },
    { q: "Que signifient les 5 anneaux olympiques ?", a: ["les 5 continents (Europe, Afrique, Amérique, Asie, Océanie)"], opts: ["les 5 sports du pentathlon", "les 5 jours des jeux", "les 5 dieux d'Olympie"], x: "la rencontre fraternelle des sportifs des 5 continents", p: "57" },
    { q: "Qui pouvait participer aux JO classiques ?", a: ["seulement les citoyens grecs (des hommes)"], opts: ["tous les habitants de la Méditerranée", "les hommes et les femmes grecs", "les Romains et les Grecs"], x: "les femmes ne pouvaient pas participer", p: "52" },
    { q: "Les JO classiques sont organisés par …", a: ["les Grecs"], opts: ["les Romains", "les Égyptiens", "les Français"], p: "50" },
  ];

  // ---------- chronologie des JO ----------
  const JO_CHRONO = [
    { q: "1500 av. J.-C.", a: ["les premiers jeux à Olympie (selon la tradition)"], p: "52" },
    { q: "884 av. J.-C.", a: ["Iphitos relance les jeux d'Olympie (conseil de la Pythie)"], p: "53" },
    { q: "776 av. J.-C.", a: ["les jeux d'Olympie deviennent réguliers (début des JO classiques)"], p: "50" },
    { q: "394 ap. J.-C.", a: ["l'empereur Théodose arrête les JO classiques"], p: "56" },
    { q: "1896", a: ["les premiers JO modernes à Athènes (Coubertin)"], p: "57" },
    { q: "1914", a: ["le drapeau blanc avec les 5 anneaux olympiques"], p: "57" },
    { q: "Les JO classiques ont duré …", a: ["1160 ans (de 776 av. J.-C. à 394)"], show: "1160 ans (de 776 av. J.-C. à 394)", opts: ["1502 ans (de 394 à 1896)", "776 ans", "15 siècles"], p: "50" },
    { q: "La période sans JO a duré …", a: ["1502 ans ≈ 15 siècles (de 394 à 1896)"], opts: ["1160 ans (de 776 av. J.-C. à 394)", "394 ans", "5 siècles"], p: "50" },
  ];

  // ---------- les sports (pentathlon + autres épreuves) ----------
  const JO_SPORTS = [
    { q: "Lancer un disque le plus loin possible", a: ["le lancer de disque"], s: "pentathlon" },
    { q: "Lancer une lance le plus loin possible", a: ["le lancer de javelot"], s: "pentathlon" },
    { q: "Courir le plus vite possible sur la piste du stade", a: ["la course à pied"], s: "pentathlon" },
    { q: "Sauter le plus loin possible", a: ["le saut en longueur"], s: "pentathlon" },
    { q: "Un combat à deux: mettre l'autre par terre", a: ["la lutte"], s: "pentathlon" },
    { q: "L'ancêtre de la boxe", a: ["le pugilat"], s: "pas dans le pentathlon" },
    { q: "Des chars tirés par des chevaux, dans l'hippodrome", a: ["la course de chars"], s: "pas dans le pentathlon" },
  ];

  // ---------- fais de bonnes questions (mots dans le bon ordre) ----------
  const JO_PHRASES = [
    { zin: "Quelles sont les caractéristiques des jeux classiques ?", stukken: ["Quelles sont", "les caractéristiques", "des jeux", "classiques ?"] },
    { zin: "Quel est le profil d'un athlète grec ?", stukken: ["Quel est", "le profil", "d'un athlète", "grec ?"] },
    { zin: "Est-ce que les JO sont très différents du monde sportif d'aujourd'hui ?", stukken: ["Est-ce que", "les JO", "sont très différents", "du monde sportif", "d'aujourd'hui ?"] },
    { zin: "Qui a créé les Jeux Olympiques selon la légende ?", stukken: ["Qui", "a créé", "les Jeux Olympiques", "selon la légende ?"] },
    { zin: "Qu'est-ce qu'on donne aux vainqueurs ?", stukken: ["Qu'est-ce qu'", "on donne", "aux vainqueurs ?"] },
    { zin: "Pourquoi est-ce que l'éducation physique est nécessaire ?", stukken: ["Pourquoi", "est-ce que", "l'éducation physique", "est nécessaire ?"] },
  ];

  const TAGS = {
    vocab: { title: "Vocabulaire", short: "woord", advice: "Leer de woorden met lidwoord (un/une/le/la) en hun betekenis. Kijk naar het icoon of de omschrijving.", page: "39" },
    accent: { title: "Accent", short: "accent", advice: "Let op é, è, ê, ç… (orfèvre, éruption, Égée).", page: "" },
    cm: { title: "Crète of Mycènes verward", short: "Crète/Mycènes", advice: "Crète = Cnossos = palais, ouvert, labyrinthe, minotaure, -2000 à -1400. Mycènes = forteresse sur une colline, fermé, acropole, cyclopes, Troie, -1400 à -1200.", page: "40-41" },
    dates: { title: "Data", short: "data", advice: "Crète -2000 à -1400 · Mycènes -1400 à -1200 · installation des Grecs -2000 à -1200 · Mycènes sombre 1250 – 1000.", page: "37, 40, 42" },
    geo: { title: "Kaart", short: "kaart", advice: "Mer Égée = oost, Mer Ionienne = west, Crète = eiland in het zuiden, Mycènes in de Peloponnesos, Troie in Klein-Azië (Turkije).", page: "38" },
    indo: { title: "Indo-Européens", short: "indo", advice: "Grecs, Latins, Celtes, Germains, Slaves, Baltes, Albanais, Hittites, Perses (Iraniens), Aryens (Indiens), Tokhariens.", page: "38" },
    defs: { title: "Begrippen Leçon 6", short: "begrippen", advice: "Hellas = naam die de Grieken zelf gebruiken · la Grèce = van het Latijn « Magna Graecia » · polis = stadstaat · acropole = rotsplateau met religieuze of politieke functie.", page: "42" },
    jo: { title: "Les jeux Olympiques", short: "JO", advice: "Olympie = sanctuaire de Zeus · 5 à 7 jours · seulement des citoyens grecs · Héraclès = fils de Zeus, protège les athlètes · Iphitos + la Pythie (884) · vainqueur = couronne d'olivier + nom dans la pierre · Delphes → Apollon, Corinthe → Poséidon · Coubertin 1896 Athènes (295 athlètes, 13 pays) · 1914 drapeau, 5 anneaux = 5 continents.", page: "50-57" },
    olympie: { title: "Le sanctuaire d'Olympie", short: "Olympie", advice: "1 temple de Zeus · 2 temple d'Héra · 3 autel de Zeus · 4 gymnase (dormir, se baigner, s'entraîner) · 5 palestre (plein air: saut, lutte, pugilat) · 6 stade (192 m, course à pied) · 7 hippodrome (770 m, chars) · 8 prytanée (administrateurs, banquets) · 9 trésors des cités.", page: "50-51, 54" },
    jodates: { title: "Data van de JO", short: "data JO", advice: "1500 v.C. eerste spelen · 884 v.C. Iphitos · 776 v.C. regelmatig · 394 n.C. Theodosius stopt · 1896 Athene (Coubertin) · 1914 vlag met 5 ringen. 776 + 394 = 1160 jaar; 1896 − 394 = 1502 jaar ≈ 15 eeuwen.", page: "50-57" },
    sport: { title: "Sporten / pentathlon", short: "sport", advice: "Pentathlon (penta = 5): lancer de disque, lancer de javelot, course à pied, saut en longueur, lutte. Pugilat (= boksen) en course de chars horen er niet bij.", page: "53" },
    fout: { title: "Fout", short: "fout", advice: "", page: "" },
  };

  Vakken.setInhoud("clil-geschiedenis-2", {
    vak: "Geschiedenis (CLIL)", icon: "🏺", theme: "amber",
    titel: "Les Grecs – Crète, Mycènes et les jeux Olympiques", klas: "2de middelbaar",
    bron: "cursus geschiedenis in het Frans – p.37-42 + les jeux Olympiques (p.50-57)",
    VOCAB, CM, MOTS, TABLEAU, CHRONO, GEO, INDO, PAS_INDO, DEFS, TAGS,
    JO_VOCAB, OLYMPIE, JO_QUEST, JO_CHRONO, JO_SPORTS, JO_PHRASES,
  });
})();
