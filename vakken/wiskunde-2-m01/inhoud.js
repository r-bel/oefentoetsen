// ============================================================
// INHOUD – Wiskunde 2de middelbaar, Nando 2 – Meetkunde module 01
// Transformaties van het vlak en symmetrie (die Keure)
//
// Hier stuur je de leerstof bij ZONDER aan de vraaglogica (vak.js) te komen:
//   - onderdelen: naam, pagina's en de uitleg ("rule") die bij een fout verschijnt
//   - begrippen, waar/niet-waar-stellingen, figuren en ruimtefiguren
//   - fouttypes: titel + tip die in het resultaat en in "Mijn voortgang" verschijnen
// HTML mag (bv. <sub>, <i>). V("XY") tekent een vector met pijltje.
// Een vraag wijzigen = een regel aanpassen; een stelling toevoegen = een regel bijplakken.
// ============================================================
(function () {
  const V = (s) => `<span class="vec">${s}</span>`;
  // hoekpunten van een regelmatige n-hoek (voor de figuren hieronder)
  const reg = (n, r = 1.6, rot = 90) => Array.from({ length: n }, (_, k) => { const a = (rot + (k * 360) / n) * Math.PI / 180; return [r * Math.cos(a), r * Math.sin(a)]; });

  // ---------- doelen (uit de studiewijzer) ----------
  const DOELEN = [
    { id: "D1", titel: "Transformaties van het vlak", p: "3-9" },
    { id: "D2", titel: "Eigenschappen van transformaties", p: "10-14" },
    { id: "D3", titel: "Symmetrie", p: "15-18" },
  ];

  // ---------- onderdelen: naam, pagina's, uitleg bij een fout ----------
  const UNITS = {
    lezen: { doel: "D1", label: "Notaties lezen", page: "3-6",
      rule: "s<sub><i>a</i></sub>(A) = A′: A′ is het beeld van A door spiegeling om de as <i>a</i>. Kleine letter = as, hoofdletter = punt. r<sub>(O, α)</sub>: α > 0 tegenwijzerzin, α < 0 wijzerzin." },
    schrijven: { doel: "D1", label: "Notaties schrijven", page: "3-6",
      rule: "s<sub><i>a</i></sub>(A) = A′: A′ is het beeld van A door spiegeling om de as <i>a</i>. Kleine letter = as, hoofdletter = punt. r<sub>(O, α)</sub>: α > 0 tegenwijzerzin, α < 0 wijzerzin." },
    begrippen: { doel: "D1", label: "Begrippen", page: "3-11",
      rule: "Kijk de 'Merk op'-kaders op p.3-6 en de wiskundetaal op p.1 nog eens na." },
    herkennen: { doel: "D1", label: "Transformatie herkennen", page: "3-9",
      rule: "Spiegeling om een as: de figuur klapt om (oriëntatie keert om). Translatie: alles schuift evenwijdig met de vector. Rotatie: de figuur draait rond O. Puntspiegeling = rotatie over 180°." },
    rooster: { doel: "D1", label: "Beeldpunten op een rooster", page: "9, 30-32",
      rule: "Lees de notatie eerst: wat is de transformatie, wat het origineel, wat het beeld? Bij s<sub>…</sub>(…) = Q zoek je het origineel: welk punt komt op Q terecht?" },
    hoek: { doel: "D1", label: "Rotatiehoeken", page: "5, 9, 24",
      rule: "Tegenwijzerzin = positieve hoek, wijzerzin = negatieve hoek. Bij n gelijk verdeelde plaatsen is één plaats verder draaien 360° : n. Hoeken die 360° verschillen geven hetzelfde beeld: r<sub>(O, −210°)</sub> = r<sub>(O, 150°)</sub>." },
    coord: { doel: "D1", label: "Coördinaten van beeldpunten", page: "14, 32-33",
      rule: "s<sub>x</sub>: (a, b) → (a, −b) · s<sub>y</sub>: (a, b) → (−a, b) · s<sub>O</sub> = r<sub>(O, 180°)</sub>: (a, b) → (−a, −b) · r<sub>(O, 90°)</sub>: (a, b) → (−b, a) · r<sub>(O, −90°)</sub>: (a, b) → (b, −a) · s<sub><i>d</i></sub> (y = x): (a, b) → (b, a) · translatie: tel de vector op." },
    tekenen: { doel: "D1", label: "Beeld construeren (klikken)", page: "3-6, 25-28",
      rule: "Stappenplannen: spiegeling om een as (p.25): loodlijn, zelfde afstand aan de overkant · translatie (p.26): evenwijdig, zelfde lengte en zin · rotatie (p.27): zelfde afstand tot het centrum, hoek in de juiste zin · puntspiegeling (p.28): het centrum is het midden van [AA′]." },
    eigenschappen: { doel: "D2", label: "Eigenschappen toepassen", page: "10-14, 34-36",
      rule: "Spiegeling om een as, translatie, rotatie en puntspiegeling zijn isometrieën: ze bewaren collineariteit, evenwijdigheid, lengte, hoekgrootte, loodrechte stand en oppervlakte. Alleen bij een translatie en een puntspiegeling is het beeld van een rechte evenwijdig met die rechte." },
    wnw_eig: { doel: "D2", label: "Waar of niet waar (transformaties)", page: "3-14",
      rule: "Lees de uitleg bij elke stelling en herhaal p.3-14." },
    sym_figuren: { doel: "D3", label: "Symmetrie: driehoeken en vierhoeken", page: "15-16",
      rule: "Driehoeken: 0, 1 of 3 assen, nooit een symmetriemiddelpunt. Vierhoeken: parallellogram 0 assen, ruit en rechthoek 2, vierkant 4; alle parallellogrammen hebben een symmetriemiddelpunt (snijpunt van de diagonalen)." },
    sym_overig: { doel: "D3", label: "Symmetrie: veelhoeken, cirkel en letters", page: "15-18",
      rule: "Een regelmatige n-hoek heeft n symmetrieassen en is enkel puntsymmetrisch als n even is. Een cirkel heeft oneindig veel assen. Puntsymmetrisch = na een halve draai (180°) valt de figuur op zichzelf." },
    sym_ruimte: { doel: "D3", label: "Symmetrie in ruimtefiguren", page: "17-18",
      rule: "Een kubus heeft 9 symmetrievlakken, een balk (3 verschillende afmetingen) 3. In een kubus en een balk is het snijpunt van de ruimtediagonalen het symmetriemiddelpunt. Een bol heeft oneindig veel symmetrievlakken." },
    sym_begrippen: { doel: "D3", label: "Begrippen en waar/niet waar (symmetrie)", page: "15-18",
      rule: "Kijk de definities en 'Merk op'-kaders op p.15-17 nog eens na." },
  };

  // uitleg per soort constructie (klikvragen)
  const TEKEN_REGELS = {
    as: "Spiegeling om een as (stappenplan p.25): teken de loodlijn door A op <i>a</i> en zet A′ even ver aan de andere kant van <i>a</i>.",
    punt: "Puntspiegeling (stappenplan p.28): M is het midden van [AA′]. Tel de hokjes van A naar M en tel er vanaf M nog eens evenveel bij.",
    trans: `Translatie (stappenplan p.26): verschuif A evenveel hokjes naar rechts/links en naar boven/onder als de vector ${V("XY")} (van X naar Y).`,
    rot: "Rotatie (stappenplan p.27): |MA| = |MA′| en de hoek AMA′ is 90°. Positieve hoek = tegenwijzerzin ↺, negatieve hoek = wijzerzin ↻.",
  };

  // ---------- begrippen (invullen) – a = aanvaarde antwoorden, show = getoond antwoord ----------
  const BEGRIPPEN = [
    { q: "Een punt dat zichzelf als beeld heeft, noemen we een …", a: ["dekpunt"], p: "3" },
    { q: "Twee vlakke figuren met dezelfde vorm en dezelfde grootte noemen we … figuren.", a: ["congruente", "congruent"], show: "congruente", p: "3" },
    { q: "Een ander woord voor translatie is …", a: ["verschuiving"], p: "4" },
    { q: `${V("XY")} en ${V("YX")} hebben een andere zin. Het zijn … vectoren.`, a: ["tegengestelde", "tegengesteld"], show: "tegengestelde", p: "4" },
    { q: "Een vector bepaalt de richting, de zin en de … van een translatie.", a: ["grootte", "afstand", "lengte"], show: "grootte", p: "4" },
    { q: "Een positieve rotatiehoek (bv. 60°) betekent draaien in …", a: ["tegenwijzerzin"], p: "5" },
    { q: "Een negatieve rotatiehoek (bv. −60°) betekent draaien in …", a: ["wijzerzin"], p: "5" },
    { q: "Spiegelen om een punt O is hetzelfde als roteren rond O over … (graden)", a: ["180", "180°", "-180"], show: "180°", p: "6" },
    { q: "Spiegelen om een punt noemen we ook een …", a: ["puntspiegeling"], p: "6" },
    { q: "De rechte waarom je spiegelt, heet de …", a: ["spiegelas", "as"], show: "spiegelas", p: "3" },
    { q: "Een transformatie die afstanden en hoekgroottes behoudt, noemen we een …", a: ["isometrie"], p: "11" },
    { q: "Een transformatie waarbij je een schaalmodel krijgt (niet congruent), is een …", a: ["homothetie"], p: "11" },
  ];

  // ---------- waar of niet waar: [stelling, waar?, uitleg] ----------
  const WNW_EIG = [
    ["Een translatie over een vector bewaart de loodrechte stand.", true, "Alle vier de transformaties bewaren de loodrechte stand (p.12)."],
    ["Het beeld van een rechte door een rotatie is altijd evenwijdig met die rechte.", false, "Enkel bij een translatie en een puntspiegeling (p.12)."],
    ["r<sub>(O, −210°)</sub> en r<sub>(O, 150°)</sub> geven hetzelfde beeld.", true, "−210° + 360° = 150° (p.5)."],
    ["Een spiegeling om een punt O is hetzelfde als een rotatie rond O over 180°.", true, "Merk op op p.6."],
    [`${V("XY")} en ${V("YX")} zijn gelijke vectoren.`, false, "Ze hebben een andere zin: tegengestelde vectoren (p.4)."],
    ["Een punt op de spiegelas is een dekpunt.", true, "Het heeft zichzelf als beeld (p.3)."],
    ["Bij een spiegeling om een as is de afstand van A tot de as gelijk aan de afstand van A′ tot de as.", true, "Merk op op p.3."],
    ["Een rotatie bewaart de oppervlakte van een figuur.", true, "Het beeld is congruent, dus de oppervlakte blijft behouden (p.12)."],
    ["Een homothetie is een isometrie.", false, "Bij een homothetie verandert de grootte (p.11)."],
    ["Het beeld van een rechte door een puntspiegeling is een rechte die evenwijdig is met de oorspronkelijke rechte.", true, "p.12."],
    ["Een samenstelling van een spiegeling en een translatie geeft een figuur die congruent is met de oorspronkelijke figuur.", true, "p.6."],
    ["Bij een translatie bepaalt de vector enkel de richting.", false, "De vector bepaalt richting, zin én grootte (p.4)."],
  ];
  const WNW_SYM = [
    ["Elke driehoek heeft minstens één symmetrieas.", false, "Een ongelijkbenige driehoek heeft er geen (p.15)."],
    ["Als een vlakke figuur spiegelsymmetrisch is om een punt, dan is ze ook spiegelsymmetrisch om een as.", false, "Een parallellogram heeft een symmetriemiddelpunt maar geen symmetrieas (p.16)."],
    ["Een cirkel heeft oneindig veel symmetrieassen.", true, "Elke rechte door het middelpunt is een symmetrieas."],
    ["Een regelmatige n-hoek is altijd spiegelsymmetrisch om een punt.", false, "Enkel als n even is (bv. een gelijkzijdige driehoek niet)."],
    ["Een regelmatige n-hoek heeft n symmetrieassen.", true, "Bv. een vierkant: 4, een regelmatige vijfhoek: 5."],
    ["Een vlakke figuur met minstens 2 symmetrieassen is ook spiegelsymmetrisch om een punt.", false, "Een gelijkzijdige driehoek heeft 3 assen maar geen symmetriemiddelpunt."],
    ["Een bol heeft oneindig veel symmetrievlakken.", true, "Elk vlak door het middelpunt."],
    ["Een balk heeft minstens drie symmetrievlakken.", true, "p.17-18."],
    ["Een kubus heeft zes symmetrievlakken.", false, "Een kubus heeft er negen (p.17)."],
    ["Een cilinder heeft een symmetrievlak dat evenwijdig is met het grondvlak.", true, "Het vlak halverwege de hoogte."],
    ["Driehoeken hebben geen symmetriemiddelpunt.", true, "p.16."],
    ["De symmetrieas van een gelijkbenige driehoek is ook de hoogtelijn uit de top.", true, "Ook bissectrice, zwaartelijn en middelloodlijn (p.15)."],
    ["Een ruit heeft 4 symmetrieassen.", false, "Een ruit heeft er 2: de diagonalen (p.16)."],
    ["Het symmetriemiddelpunt van een parallellogram is het snijpunt van de diagonalen.", true, "p.16."],
  ];

  // ---------- begrippen symmetrie ----------
  const SYM_BEGR = [
    { q: "Een vlakke figuur die spiegelsymmetrisch is om een as, noemen we ook …", a: ["lijnsymmetrisch"], p: "15" },
    { q: "Een vlakke figuur die spiegelsymmetrisch is om een punt, noemen we ook …", a: ["puntsymmetrisch"], p: "16" },
    { q: "Het punt waarom een figuur spiegelsymmetrisch is, heet het …", a: ["symmetriemiddelpunt"], p: "16" },
    { q: "Het vlak waarom een ruimtefiguur spiegelsymmetrisch is, heet een …", a: ["symmetrievlak"], p: "17" },
    { q: "Een as waarom een vlakke figuur zichzelf als beeld heeft, heet een …", a: ["symmetrieas"], p: "15" },
  ];

  // ---------- vlakke figuren: ax = aantal symmetrieassen, mp = symmetriemiddelpunt? ----------
  const FIGS = [
    { name: "een ongelijkbenige driehoek", pts: [[-1.8, -1], [1.6, -1], [0.5, 1.2]], ax: 0, mp: false },
    { name: "een gelijkbenige driehoek", pts: [[-1.2, -1.1], [1.2, -1.1], [0, 1.5]], ax: 1, mp: false, marks: [[0, 2], [1, 2]] },
    { name: "een gelijkzijdige driehoek", pts: reg(3, 1.6, 90), ax: 3, mp: false },
    { name: "een rechthoekige driehoek (niet gelijkbenig)", pts: [[-1.5, -1.1], [1.7, -1.1], [-1.5, 1.1]], ax: 0, mp: false },
    { name: "een willekeurige vierhoek", pts: [[-1.6, -1], [1.3, -1.3], [1.8, 0.9], [-0.6, 1.3]], ax: 0, mp: false },
    { name: "een vlieger", pts: [[0, 1.5], [1.1, 0.5], [0, -1.6], [-1.1, 0.5]], ax: 1, mp: false },
    { name: "een gelijkbenig trapezium", pts: [[-1.9, -1], [1.9, -1], [1, 1], [-1, 1]], ax: 1, mp: false },
    { name: "een rechthoekig trapezium", pts: [[-1.6, -1], [1.7, -1], [0.4, 1], [-1.6, 1]], ax: 0, mp: false },
    { name: "een parallellogram", pts: [[-1.9, -1], [0.9, -1], [1.9, 1], [-0.9, 1]], ax: 0, mp: true, tag: "sym_parallellogram" },
    { name: "een ruit", pts: [[0, 1.6], [1.1, 0], [0, -1.6], [-1.1, 0]], ax: 2, mp: true },
    { name: "een rechthoek", pts: [[-1.9, -1], [1.9, -1], [1.9, 1], [-1.9, 1]], ax: 2, mp: true },
    { name: "een vierkant", pts: [[-1.3, -1.3], [1.3, -1.3], [1.3, 1.3], [-1.3, 1.3]], ax: 4, mp: true },
  ];
  const FIGS2 = [
    { name: "een regelmatige vijfhoek", pts: reg(5), ax: 5, mp: false },
    { name: "een regelmatige zeshoek", pts: reg(6, 1.6, 0), ax: 6, mp: true },
    { name: "een regelmatige achthoek", pts: reg(8, 1.6, 22.5), ax: 8, mp: true },
    { name: "een cirkel", circle: true, ax: Infinity, mp: true },
    { name: "de letter H", strokes: [[[-1, -1.5], [-1, 1.5]], [[1, -1.5], [1, 1.5]], [[-1, 0], [1, 0]]], ax: 2, mp: true },
    { name: "de letter N", strokes: [[[-1, -1.5], [-1, 1.5], [1, -1.5], [1, 1.5]]], ax: 0, mp: true },
    { name: "de letter Z", strokes: [[[-1, 1.5], [1, 1.5], [-1, -1.5], [1, -1.5]]], ax: 0, mp: true },
    { name: "de letter T", strokes: [[[-1.3, 1.5], [1.3, 1.5]], [[0, 1.5], [0, -1.5]]], ax: 1, mp: false },
    { name: "de letter E", strokes: [[[1, 1.5], [-1, 1.5], [-1, -1.5], [1, -1.5]], [[-1, 0], [0.7, 0]]], ax: 1, mp: false },
    { name: "de letter X", strokes: [[[-1, 1.5], [1, -1.5]], [[-1, -1.5], [1, 1.5]]], ax: 2, mp: true },
    { name: "de letter F", strokes: [[[1, 1.5], [-1, 1.5], [-1, -1.5]], [[-1, 0], [0.7, 0]]], ax: 0, mp: false },
  ];

  // ---------- ruimtefiguren: vl = aantal symmetrievlakken, mp = symmetriemiddelpunt? (kind = tekening) ----------
  const SOLIDS = [
    { kind: "kubus", name: "een kubus", vl: 9, mp: true },
    { kind: "balk", name: "een balk (lengte, breedte en hoogte zijn verschillend)", vl: 3, mp: true },
    { kind: "balkV", name: "een balk met een vierkant grondvlak (hoogte ≠ zijde grondvlak)", vl: 5, mp: true },
    { kind: "prisma", name: "een recht prisma met een gelijkzijdige driehoek als grondvlak", vl: 4, mp: false },
    { kind: "cilinder", name: "een cilinder", vl: Infinity, mp: true },
    { kind: "kegel", name: "een kegel", vl: Infinity, mp: false },
    { kind: "bol", name: "een bol", vl: Infinity, mp: true },
    { kind: "piramide", name: "een regelmatige vierzijdige piramide (vierkant grondvlak)", vl: 4, mp: false },
  ];

  // ---------- fouttypes: titel, tip en pagina ----------
  const TAGS = {
    teken_rotatie: { title: "Wijzerzin en tegenwijzerzin verwisseld", advice: "Een positieve hoek = <b>tegenwijzerzin</b> ↺, een negatieve hoek = <b>wijzerzin</b> ↻.", page: "5" },
    as_verwisseld: { title: "x-as en y-as verwisseld", advice: "Bij s<sub>x</sub> verandert enkel het teken van de <b>y</b>-coördinaat, bij s<sub>y</sub> enkel dat van de <b>x</b>-coördinaat.", page: "32" },
    coord_omgewisseld: { title: "x en y omgewisseld", advice: "Rotatie over 90°: (a, b) → (−b, a); over −90°: (a, b) → (b, −a). Alleen bij spiegelen om y = x wissel je gewoon om.", page: "33" },
    tegengestelde_vector: { title: "Verschoven in de verkeerde zin", advice: `${V("XY")} gaat van X naar Y. ${V("YX")} is de tegengestelde vector.`, page: "4" },
    punt_vs_as: { title: "Spiegeling om een punt en om een as verward", advice: "Kleine letter s<sub><i>a</i></sub> = spiegelen om een <b>as</b>; hoofdletter s<sub>M</sub> = spiegelen om een <b>punt</b> (= draaien over 180°).", page: "3, 6" },
    notatie_volgorde: { title: "Beeld en origineel omgedraaid", advice: "s<sub><i>a</i></sub>(A) = A′: tussen haakjes staat het <b>origineel</b>, na het gelijkheidsteken het <b>beeld</b>.", page: "3" },
    afstand_as: { title: "Wel loodrecht, maar verkeerde afstand", advice: "Het beeld ligt even ver van de as als het origineel, aan de andere kant.", page: "3, 25" },
    hoek_fout: { title: "Verkeerde hoek", advice: "Tel de plaatsen tussen A en B en vermenigvuldig met 360° : n. Hoeken die 360° verschillen zijn gelijkwaardig.", page: "5" },
    teken_fout: { title: "Tekenfout in een coördinaat", advice: "Controleer elk teken apart: welke coördinaat verandert van teken?", page: "32" },
    translatie_fout: { title: "Translatie verkeerd berekend", advice: "Bereken eerst de vector: Q − P. Tel die dan op bij A.", page: "4" },
    niet_verplaatst: { title: "Punt niet verplaatst", advice: "Het beeld is (behalve bij een dekpunt) een ánder punt.", page: "3" },
    verwarring: { title: "Soort transformatie verward", advice: "Kijk naar de oriëntatie (omgeklapt = spiegeling), de richting (evenwijdig verschoven = translatie) en de draaiing.", page: "3-6" },
    eigenschap: { title: "Eigenschap niet toegepast", advice: "Isometrieën bewaren lengte, hoekgrootte en oppervlakte: het beeld is congruent.", page: "12" },
    sym_parallellogram: { title: "Parallellogram en symmetrie", advice: "Een parallellogram heeft <b>geen</b> symmetrieas, wel een symmetriemiddelpunt.", page: "16" },
    sym_assen: { title: "Aantal symmetrieassen", advice: "Vouw in gedachten: valt de ene helft precies op de andere?", page: "15-16" },
    sym_middelpunt: { title: "Symmetriemiddelpunt", advice: "Draai de figuur in gedachten een halve toer (180°): valt ze op zichzelf?", page: "16-17" },
    sym_vlakken: { title: "Aantal symmetrievlakken", advice: "Kubus 9, balk 3 — tel ook de schuine (diagonale) vlakken.", page: "17" },
  };

  Vakken.setInhoud("wiskunde-2-m01", {
    vak: "Wiskunde", icon: "📐", theme: "blue",
    titel: "Transformaties van het vlak en symmetrie", klas: "2de middelbaar",
    bron: "Nando 2 – Meetkunde module 01 (die Keure)",
    levels: {
      easy: { title: "🙂 Makkelijk", desc: "alles meerkeuze" },
      normal: { title: "💪 Normaal", desc: "meerkeuze + zelf invullen en aanklikken" },
      hard: { title: "🔥 Moeilijk", desc: "zelf invullen, driehoeken construeren, kortste hoek verplicht" },
    },
    allInfo: "<b>Eindtoets-modus:</b> elk soort vraag, elke figuur en elke stelling uit de gekozen onderdelen komt precies één keer aan bod. Op het einde krijg je per onderdeel een oordeel.",
    DOELEN, UNITS, TEKEN_REGELS, BEGRIPPEN, WNW_EIG, WNW_SYM, SYM_BEGR, FIGS, FIGS2, SOLIDS, TAGS,
  });
})();
