// ============================================================
// INHOUD – Frans 2de middelbaar · Le temps et les vacances (p.101-108)
// "À retenir": On se rappelle ? / On découvre ! / Actes de parole + oefeningen 26-27
// Er komt later meer: voeg nieuwe lessen toe als extra blok in LESSEN (zelfde opbouw).
//
// Woord:  { fr: "la plage", nl: "het strand", g: "f", p: 105, zin: "J'aime … sur la [plage].", def: "…" }
//   g    geslacht m | f (uit de kleurcodes / (m) (f) in het boek); mv: true = meervoud
//   zin  voorbeeldzin uit het boek; het geoefende woord staat tussen [ ] (= oranje in het boek)
//   def  omschrijving in het Frans voor "Quel mot cherchons-nous ?" (bron: "boek" of "eigen")
//   Alternatieven: " / " = of, (…) = optioneel.
// ============================================================
(function () {
  const LES1 = {
    id: "t2-1", titel: "Le temps et les vacances", p: "101-108",

    // ---------- On se rappelle ? (p.102) ----------
    rappelle: [
      { fr: "l'arbre", nl: "de boom", g: "m", p: 102 },
      { fr: "les bois", nl: "het bos", g: "m", mv: true, p: 102 },
      { fr: "la botte", nl: "de laars", g: "f", p: 102 },
      { fr: "la campagne", nl: "het platteland", g: "f", p: 102 },
      { fr: "la casquette", nl: "de pet", g: "f", p: 102 },
      { fr: "l'eau", nl: "het water", g: "f", p: 102 },
      { fr: "la gourde", nl: "de drinkfles", g: "f", p: 102 },
      { fr: "la mer", nl: "de zee", g: "f", p: 102 },
      { fr: "la montagne", nl: "de berg", g: "f", p: 102 },
      { fr: "la nature", nl: "de natuur", g: "f", p: 102 },
      { fr: "la neige", nl: "de sneeuw", g: "f", p: 102 },
      { fr: "le parapluie", nl: "de paraplu", g: "m", p: 102 },
      { fr: "le pull", nl: "de trui", g: "m", p: 102 },
      { fr: "le sac à dos", nl: "de rugzak", g: "m", p: 102 },
      { fr: "le soleil", nl: "de zon", g: "m", p: 102 },
      { fr: "le temps", nl: "het weer", g: "m", p: 102, hint_nl: "zoals in: Wat voor weer is het?" },
      { fr: "le vent", nl: "de wind", g: "m", p: 102 },
      { fr: "la veste", nl: "de jas / de vest", g: "f", p: 102 },
      { fr: "prochain / prochaine", nl: "volgend(e)", soort: "adj", p: 102 },
      { fr: "demain", nl: "morgen", soort: "inv", p: 102 },
      { fr: "après-demain", nl: "overmorgen", soort: "inv", p: 102 },
      { fr: "aujourd'hui", nl: "vandaag", soort: "inv", p: 102 },
    ],

    // ---------- On découvre ! (p.104-106) ----------
    decouvre: [
      { fr: "l'anorak", nl: "de windjas", g: "m", p: 104, zin: "En automne, je porte un [anorak] pour avoir chaud." },
      { fr: "le bikini", nl: "de bikini", g: "m", p: 104, zin: "Elle porte son nouveau [bikini] à la plage." },
      { fr: "le bonnet", nl: "de muts", g: "m", p: 104, zin: "Mets ton [bonnet] ! Il fait froid." },
      { fr: "le brouillard", nl: "de mist", g: "m", p: 104, zin: "On ne voit rien avec tout ce [brouillard]." },
      { fr: "la capitale", nl: "de hoofdstad", g: "f", p: 104, zin: "Bruxelles est la [capitale] de la Belgique." },
      { fr: "la chaussure de marche", nl: "de wandelschoen", g: "f", p: 104, zin: "Il me faut des [chaussures de marche] pour la randonnée." },
      { fr: "la côte", nl: "de kust", g: "f", p: 104, zin: "Nous allons passer nos vacances à la [côte]." },
      { fr: "le coup de vent", nl: "de windstoot", g: "m", p: 104, zin: "Fais attention, il y a des [coups de vent] aujourd'hui." },
      { fr: "la crème solaire", nl: "de zonnecrème", g: "f", p: 104, zin: "N'oublie pas de mettre de la [crème solaire] avant d'aller à la plage." },
      { fr: "le degré", nl: "de graad", g: "m", p: 104, zin: "Il fait trente [degrés] aujourd'hui." },
      { fr: "le désert", nl: "de woestijn", g: "m", p: 104, zin: "Dans le [désert], il fait très chaud pendant la journée." },
      { fr: "l'éclaircie", nl: "de opklaring", g: "f", p: 104, zin: "Après la pluie, il y a une [éclaircie]." },
      { fr: "la forêt", nl: "het woud", g: "f", p: 104, zin: "Nous faisons de l'accrobranche dans la [forêt]." },
      { fr: "la grêle", nl: "de hagel", g: "f", p: 105, zin: "On prévoit de la [grêle] pour demain." },
      { fr: "l'imper(méable) / la veste de pluie", nl: "de regenjas", g: "m", p: 105, zin: "Mets ton [imperméable], il pleut dehors." },
      { fr: "les jumelles", nl: "de verrekijker", g: "f", mv: true, p: 105, zin: "J'emploie des [jumelles] pour observer les animaux." },
      { fr: "les lunettes de soleil", nl: "de zonnebril", g: "f", mv: true, p: 105, zin: "Le temps est très ensoleillé, mets tes [lunettes de soleil]." },
      { fr: "la météo", nl: "het weerbericht", g: "f", p: 105, zin: "La [météo] annonce de la neige pour aujourd'hui." },
      { fr: "le nuage", nl: "de wolk", g: "m", p: 105, zin: "Les enfants aiment regarder les formes des [nuages]." },
      { fr: "l'orage", nl: "het onweer", g: "m", p: 105, zin: "Un [orage] approche, il vaut mieux rentrer." },
      { fr: "la plage", nl: "het strand", g: "f", p: 105, zin: "J'aime construire des châteaux de sable sur la [plage]." },
      { fr: "la pluie", nl: "de regen", g: "f", p: 105, zin: "Ouvre ton parapluie, il y a de la [pluie] !" },
      { fr: "la rando(nnée)", nl: "de trektocht", g: "f", p: 105, zin: "On fait de la [randonnée] en montagne ce week-end." },
      { fr: "la rivière", nl: "de rivier", g: "f", p: 105, zin: "La famille organise un piquenique au bord de la [rivière]." },
      { fr: "le short de bain", nl: "de zwemshort", g: "m", p: 105, zin: "N'oublie pas ton [short de bain] pour aller à la piscine." },
      { fr: "la température", nl: "de temperatuur", g: "f", p: 105, zin: "Quelle est la [température] dehors ?" },
      { fr: "la vallée", nl: "de vallei", g: "f", p: 105, zin: "Je fais du parapente dans la [vallée]." },
      // verbes
      { fr: "annoncer", nl: "aankondigen", soort: "verbe", p: 106, zin: "On [annonce] du beau temps." },
      { fr: "geler", nl: "vriezen", soort: "verbe", p: 106, zin: "En hiver, l'eau peut [geler] la nuit." },
      { fr: "grêler", nl: "hagelen", soort: "verbe", p: 106, zin: "Il va [grêler] cet après-midi." },
      { fr: "neiger", nl: "sneeuwen", soort: "verbe", p: 106, zin: "Il commence à [neiger] en octobre au Canada." },
      { fr: "pleuvoir", nl: "regenen", soort: "verbe", p: 106, zin: "Demain, il va [pleuvoir]." },
      { fr: "prévoir", nl: "voorspellen", soort: "verbe", p: 106, zin: "On [prévoit] du beau temps pour le weekend." },
      // mots invariables
      { fr: "dehors", nl: "buiten", soort: "inv", p: 106, zin: "Quel temps fait-il [dehors] ?" },
      { fr: "là-bas", nl: "daar(ginds)", soort: "inv", p: 106, zin: "Tu veux voyager [là-bas] ?" },
    ],

    // ---------- Il fait quel temps ? (p.103, 106, 108) ----------
    meteo: [
      { fr: "Il fait beau.", nl: "Het is mooi weer.", icon: "☀️", grp: "zon", p: 103 },
      { fr: "Il fait chaud.", nl: "Het is warm.", icon: "🌡️☀️", grp: "warm", p: 103 },
      { fr: "Il fait froid.", nl: "Het is koud.", icon: "🌡️❄️", grp: "koud", p: 103 },
      { fr: "Il fait mauvais.", nl: "Het is slecht weer.", icon: "⛈️", grp: "slecht", p: 103 },
      { fr: "Il neige.", nl: "Het sneeuwt.", icon: "🌨️", grp: "sneeuw", p: 103 },
      { fr: "Il pleut.", nl: "Het regent.", icon: "🌧️", grp: "regen", p: 103 },
      { fr: "Il y a du soleil.", nl: "De zon schijnt. / Er is zon.", icon: "☀️", grp: "zon", p: 103 },
      { fr: "Il y a du vent.", nl: "Het waait. / Er is wind.", icon: "🌬️", grp: "wind", p: 103 },
      { fr: "Il fait frais.", nl: "Het is fris.", icon: "🌡️ 5°", grp: "fris", p: 106 },
      { fr: "Il fait nuageux.", nl: "Het is bewolkt.", icon: "☁️", grp: "wolk", p: 106 },
      { fr: "Il fait pluvieux.", nl: "Het is regenachtig.", icon: "🌧️", grp: "regen", p: 106 },
      { fr: "Le temps est variable.", nl: "Het weer is wisselvallig.", icon: "⛅", grp: "variabel", p: 106 },
      { fr: "Il y a du brouillard.", nl: "Het is mistig. / Er is mist.", icon: "🌫️", grp: "mist", p: 108 },
    ],
    // onderscheid (p.102)
    chaud: [
      { zin: "En été, [Il fait chaud / C'est chaud].", juist: "il fait", uitleg: "het weer → Il fait chaud." },
      { zin: "Attention, la soupe ! [Il fait chaud / C'est chaud].", juist: "c'est", uitleg: "een gerecht/ding → C'est chaud." },
      { zin: "Dans le désert, pendant la journée, [Il fait chaud / C'est chaud].", juist: "il fait", uitleg: "het weer → Il fait chaud." },
      { zin: "Ne touche pas ton chocolat ! [Il fait chaud / C'est chaud].", juist: "c'est", uitleg: "een drank/ding → C'est chaud." },
      { zin: "Aujourd'hui, il y a du soleil et [il fait chaud / c'est chaud].", juist: "il fait", uitleg: "het weer → il fait chaud." },
      { zin: "Mon café ? [Il fait chaud / C'est chaud], attends un peu !", juist: "c'est", uitleg: "een drank → C'est chaud." },
    ],

    // ---------- seizoenen en windrichtingen (p.103, 106) ----------
    saisons: [
      { fr: "en automne", nl: "in de herfst", seizoen: "automne", prep: "en", p: 103 },
      { fr: "en hiver", nl: "in de winter", seizoen: "hiver", prep: "en", p: 103 },
      { fr: "au printemps", nl: "in de lente", seizoen: "printemps", prep: "au", p: 103 },
      { fr: "en été", nl: "in de zomer", seizoen: "été", prep: "en", p: 103 },
    ],
    richtingen: [
      { fr: "dans le nord", nl: "in het noorden", icon: "↑", art: "le", p: 106 },
      { fr: "dans l'est", nl: "in het oosten", icon: "→", art: "l'", p: 106 },
      { fr: "dans le sud", nl: "in het zuiden", icon: "↓", art: "le", p: 106 },
      { fr: "dans l'ouest", nl: "in het westen", icon: "←", art: "l'", p: 106 },
    ],

    // ---------- activiteiten: On va … (p.103, 107) ----------
    // lid = het deel dat in "du / de la / de l' / au …" gevraagd wordt; NL-vertalingen zijn eigen vertalingen
    activites: [
      { fr: "écouter de la musique", nl: "naar muziek luisteren", lid: ["écouter", "de la", "musique"], p: 103 },
      { fr: "faire du cyclisme / faire du vélo", nl: "fietsen", lid: ["faire", "du", "vélo"], p: 103 },
      { fr: "faire de l'escalade", nl: "klimmen", lid: ["faire", "de l'", "escalade"], p: 103 },
      { fr: "traîner en ville / trainer en ville", nl: "rondhangen in de stad", p: 103 },
      { fr: "nager", nl: "zwemmen", p: 103 },
      { fr: "jouer à un jeu", nl: "een spel spelen", lid: ["jouer", "à", "un jeu"], p: 103 },
      { fr: "faire du shopping", nl: "shoppen / winkelen", lid: ["faire", "du", "shopping"], p: 103 },
      { fr: "faire du ski", nl: "skiën", lid: ["faire", "du", "ski"], p: 107 },
      { fr: "faire du VTT", nl: "mountainbiken", lid: ["faire", "du", "VTT"], p: 107 },
      { fr: "rouler en quad", nl: "met een quad rijden", p: 107 },
      { fr: "faire de la plongée", nl: "duiken", lid: ["faire", "de la", "plongée"], p: 107 },
      { fr: "faire du snowboard", nl: "snowboarden", lid: ["faire", "du", "snowboard"], p: 107 },
      { fr: "jouer au (beach-)volley", nl: "(beach)volleybal spelen", lid: ["jouer", "au", "beach-volley"], p: 107 },
      { fr: "faire une excursion en jeep", nl: "een jeeptocht maken", p: 107 },
      { fr: "faire de l'accrobranche", nl: "boomklimmen / een klimparcours in de bomen doen", lid: ["faire", "de l'", "accrobranche"], p: 107 },
      { fr: "faire du (kite)surf", nl: "(kite)surfen", lid: ["faire", "du", "surf"], p: 107 },
      { fr: "prendre un bain de soleil", nl: "zonnebaden", p: 107 },
      { fr: "faire du parapente", nl: "paragliden", lid: ["faire", "du", "parapente"], p: 107 },
      { fr: "faire de la randonnée", nl: "een trektocht maken", lid: ["faire", "de la", "randonnée"], p: 105 },
    ],
    // extra du/de la/de l' bij het weer (Actes de parole p.108, zinnen p.104-106)
    partitif_meteo: [
      ["Il y a", "du", "soleil."], ["Il y a", "du", "vent."], ["Il y a", "du", "brouillard."],
      ["On prévoit", "de la", "grêle pour demain."], ["Ouvre ton parapluie, il y a", "de la", "pluie !"],
      ["La météo annonce", "de la", "neige pour aujourd'hui."], ["On annonce", "du", "beau temps."],
    ],

    // ---------- futur proche bij het weer (p.106, 108) ----------
    futur: [
      { nu: "Il pleut.", inf: "pleuvoir", morgen: "va pleuvoir", nl: "Het gaat regenen." },
      { nu: "Il neige.", inf: "neiger", morgen: "va neiger", nl: "Het gaat sneeuwen." },
      { nu: "Il fait beau.", inf: "faire beau", morgen: "va faire beau", nl: "Het gaat mooi weer zijn." },
      { nu: "Il grêle.", inf: "grêler", morgen: "va grêler", nl: "Het gaat hagelen." },
      { nu: "Il gèle.", inf: "geler", morgen: "va geler", nl: "Het gaat vriezen." },
      { nu: "Il fait nuageux.", inf: "faire nuageux", morgen: "va faire nuageux", nl: "Het gaat bewolkt zijn." },
      { nu: "Il fait froid.", inf: "faire froid", morgen: "va faire froid", nl: "Het gaat koud zijn." },
    ],

    // ---------- Actes de parole (p.108): vraag → passend antwoord ----------
    actes: [
      { vraag: "Tu vas où ?", ok: "Je vais à la côte.", fout: ["Je vais faire de l'accrobranche.", "Il fait froid.", "Merci pour le conseil."] },
      { vraag: "Vous allez où ?", ok: "Nous allons à la montagne.", fout: ["Nous allons jouer au beach-volley.", "Il fait 15 degrés.", "Bonne idée."] },
      { vraag: "Tu vas faire quoi ?", ok: "Je vais faire de l'accrobranche.", fout: ["Je vais à la côte.", "Il va pleuvoir.", "D'accord."] },
      { vraag: "Vous allez faire quelles activités ?", ok: "Nous allons jouer au beach-volley.", fout: ["Nous allons à la montagne.", "Il y a du vent.", "Très bien."] },
      { vraag: "Il fait quel temps à la mer ?", ok: "Il fait beau.", fout: ["C'est chaud.", "On va à la mer.", "Je vais faire une rando."] },
      { vraag: "Tu sais quel temps il va faire ?", ok: "Il va faire nuageux.", fout: ["Je vais à la montagne.", "Merci pour le conseil.", "Il faut emporter de l'eau."] },
      { vraag: "On prévoit quel temps là-bas ?", ok: "Il va pleuvoir.", fout: ["On va faire du ski.", "D'accord.", "Nous allons à la côte."] },
      { vraag: "Et la température ?", ok: "Il fait 15 degrés.", fout: ["Il fait mauvais.", "Je vais à la côte.", "Bonne idée."] },
      { vraag: "Il fait quelle température ?", ok: "La température est de 15 degrés.", fout: ["Le temps est variable.", "Il y a du vent.", "On va nager."] },
      { vraag: "Mon conseil, c'est de mettre des lunettes de soleil.", ok: "Merci pour le conseil.", fout: ["Il fait froid.", "Je vais à la montagne.", "Il va neiger."] },
      { vraag: "N'oublie pas d'emporter de l'eau.", ok: "D'accord.", fout: ["Il fait 15 degrés.", "Tu vas où ?", "Il neige."] },
    ],
    // situatie → passende raad
    conseils: [
      { situatie: "Il pleut.", ok: "N'oublie pas ton parapluie.", fout: ["Mets tes lunettes de soleil.", "Il faut mettre de la crème solaire.", "Prends ton short de bain."] },
      { situatie: "Il fait très chaud et il y a du soleil.", ok: "Il faut mettre de la crème solaire.", fout: ["Mets ton bonnet.", "N'oublie pas ton anorak.", "Il vaut mieux mettre des bottes."] },
      { situatie: "Il fait froid et il neige.", ok: "Mets ton bonnet.", fout: ["Prends ton bikini.", "Il faut mettre des lunettes de soleil.", "N'oublie pas ton short de bain."] },
      { situatie: "On fait une rando de 10 km.", ok: "Il faut des chaussures de marche.", fout: ["Il vaut mieux prendre un bain de soleil.", "Mets ton bikini.", "N'oublie pas ton parapluie."] },
      { situatie: "Il y a beaucoup de soleil.", ok: "Il vaut mieux mettre des lunettes de soleil.", fout: ["Mets ton imperméable.", "N'oublie pas ton bonnet.", "Il faut des bottes."] },
      { situatie: "On va à la plage.", ok: "N'oublie pas ton short de bain.", fout: ["Il faut des chaussures de marche.", "Mets ton anorak.", "Prends tes jumelles pour le ski."] },
      { situatie: "On va observer les animaux.", ok: "Emporte tes jumelles.", fout: ["Mets ton bikini.", "N'oublie pas ton parapluie.", "Il faut de la crème solaire."] },
      { situatie: "Il y a des coups de vent.", ok: "Mets ton anorak.", fout: ["Prends un bain de soleil.", "Mets ton short de bain.", "Il faut mettre de la crème solaire."] },
    ],
    // N'oublie pas de / d' + infinitief (p.108)
    oublie: [
      ["N'oublie pas", "de", "mettre de la crème solaire."], ["N'oublie pas", "d'", "emporter de l'eau."],
      ["N'oubliez pas", "de", "prendre vos jumelles."], ["N'oublie pas", "d'", "ouvrir ton parapluie."],
      ["Mon conseil, c'est", "de", "mettre un bonnet."], ["Mon conseil, c'est", "d'", "emporter une gourde."],
    ],

    // ---------- oefening 27 (p.101) + extra omschrijvingen ----------
    definitions: [
      { def: "Un objet pratique qu'on porte sur le dos pour emporter des affaires.", fr: "le sac à dos", bron: "boek" },
      { def: "La ville principale d'un pays.", fr: "la capitale", bron: "boek" },
      { def: "Un grand espace avec beaucoup d'arbres.", fr: "la forêt / les bois", bron: "boek" },
      { def: "La description du temps qu'il fait chaque jour, comme le soleil, la pluie ou le vent.", fr: "la météo", bron: "boek" },
      { def: "Je ne suis pas le sud, ni l'est ou l'ouest.", fr: "le nord", bron: "boek" },
      { def: "Le moment quand on voit le soleil entre les nuages.", fr: "l'éclaircie", bron: "boek" },
      { def: "La saison où les feuilles des arbres changent de couleur et tombent.", fr: "l'automne", bron: "boek" },
      { def: "On l'ouvre quand il pleut.", fr: "le parapluie", bron: "eigen" },
      { def: "On le met sur la tête quand il fait froid.", fr: "le bonnet", bron: "eigen" },
      { def: "Une bouteille qu'on emporte pour boire pendant une randonnée.", fr: "la gourde", bron: "eigen" },
      { def: "On les utilise pour voir des choses qui sont très loin.", fr: "les jumelles", bron: "eigen" },
      { def: "On la met sur la peau pour ne pas brûler au soleil.", fr: "la crème solaire", bron: "eigen" },
      { def: "Il est blanc ou gris et il flotte dans le ciel.", fr: "le nuage", bron: "eigen" },
      { def: "L'espace bas entre deux montagnes.", fr: "la vallée", bron: "eigen" },
      { def: "Un grand espace avec du sable où il ne pleut presque jamais.", fr: "le désert", bron: "eigen" },
      { def: "La région au bord de la mer.", fr: "la côte", bron: "eigen" },
      { def: "Quand il est là, on ne voit presque rien dehors.", fr: "le brouillard", bron: "eigen" },
      { def: "La saison la plus froide de l'année.", fr: "l'hiver", bron: "eigen" },
      { def: "La saison où les fleurs reviennent.", fr: "le printemps", bron: "eigen" },
      { def: "Une longue marche dans la nature.", fr: "la randonnée", bron: "eigen" },
    ],

    // ---------- oefening 26 (p.101): Fais des phrases avec les mots donnés ----------
    // stukken = de woordgroepen uit het boek; zin = de juiste zin; alt = andere goede volgordes
    phrases: [
      { stukken: ["Tu", "pour aller nager", "dans la mer ?", "ton bikini", "mets"], zin: "Tu mets ton bikini pour aller nager dans la mer ?", bron: "boek" },
      { stukken: ["pour demain", "annonce", "des coups de vent", "et après-demain.", "On"], zin: "On annonce des coups de vent pour demain et après-demain.", bron: "boek" },
      { stukken: ["mettre", "Il vaut mieux", "dans ton sac à dos.", "ton pull"], zin: "Il vaut mieux mettre ton pull dans ton sac à dos.", bron: "boek" },
      { stukken: ["des chaussures de marche", "emportez", "la rando de 10 km ?", "Vous", "pour faire"], zin: "Vous emportez des chaussures de marche pour faire la rando de 10 km ?", bron: "boek" },
      { stukken: ["toujours", "des éclaircies !", "il y a", "Après la pluie,"], zin: "Après la pluie, il y a toujours des éclaircies !", bron: "boek" },
    ],
  };

  // ---------- fouttypes ----------
  const TAGS = {
    accent: { title: "Accenten", short: "accent", advice: "Let op é, è, ê, à, â, ç, î, ô … Je kent het woord, schrijf het nauwkeurig." },
    article: { title: "Lidwoord / geslacht", short: "lidwoord", advice: "Leer elk zelfstandig naamwoord met zijn lidwoord. Bij l' staat het geslacht erbij: l'anorak (m), l'éclaircie (f).", page: "102-105" },
    spelling: { title: "Bijna juist (één letter)", short: "spelling", advice: "Schrijf deze woorden een paar keer over." },
    vertaling: { title: "Woordenschat", short: "woord", advice: "Herhaal de woordenlijst: lees, dek af, schrijf, verbeter.", page: "102-106" },
    meteo: { title: "Het weer", short: "weer", advice: "Il fait beau / chaud / froid / frais / mauvais / nuageux / pluvieux · Il y a du soleil / du vent / du brouillard · Il pleut · Il neige.", page: "103, 106" },
    partitif: { title: "du / de la / de l' / au", short: "du/de la", advice: "faire du ski (m), faire de la plongée (f), faire de l'escalade (klinker), jouer au volley (à + le).", page: "103, 107" },
    saison: { title: "en / au bij seizoenen", short: "en/au", advice: "en été, en automne, en hiver – maar au printemps.", page: "103" },
    futur: { title: "Het weer morgen (futur proche)", short: "il va …", advice: "aller + infinitief: Il va pleuvoir. Il va neiger. Il va faire beau.", page: "106, 108" },
    chaud: { title: "Il fait chaud of C'est chaud", short: "il fait/c'est", advice: "Il fait chaud = het weer is warm. C'est chaud = het (eten, drinken, ding) is warm.", page: "102" },
    actes: { title: "Taalhandelingen", short: "taalhandeling", advice: "Herhaal de vragen en antwoorden bij 'Parler du temps / Donner des conseils'.", page: "108" },
    phrase: { title: "Zinsbouw", short: "zinsbouw", advice: "Begin bij het onderwerp, dan het werkwoord, dan de rest. Hoofdletter = begin, leesteken = einde.", page: "101" },
    fout: { title: "Fout", short: "fout", advice: "" },
  };

  Vakken.setInhoud("frans-2", {
    vak: "Frans", icon: "🇫🇷", theme: "rose", klas: "2de middelbaar",
    titel: "Le temps et les vacances", bron: "leerstof p.101-108 (wordt aangevuld)",
    LESSEN: [LES1], TAGS,
  });
})();
