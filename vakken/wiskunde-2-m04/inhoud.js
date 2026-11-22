// ============================================================
// INHOUD – Wiskunde 2de middelbaar · getallenleer en algebra, module 4: Machten
// Bron: bordboek module 04 (p. 1-31): instap, 1 machten met een gehele exponent, 2 rekenregels
// voor machten met eenzelfde grondtal, 3 macht van een macht, 4 macht van een product,
// 5 macht van een quotiënt, 6 wetenschappelijke schrijfwijze, signaaloefeningen,
// differentiatietraject (D1-D65) en studiewijzer.
//
// Opgaven in een korte schrijfwijze (vak.js rekent de oplossing zelf uit, exact):
//   2^-3 macht · (−3)^5 haakjes · [ ] vierkante haakjes · {2/5} breukstreep (gestapeld)
//   · of * vermenigvuldigen · : delen · 3a^2b implicit product · 0,4 kommagetal
// Een item: [label, opgave, extra?]  extra = { pos: positieve exponent vragen, p: pagina }
// Nieuwe items: ACHTERAAN een lijst toevoegen (de voortgang hangt aan de plaats).
// ============================================================
(function () {
  const GROUPS = [
    { id: "H1", titel: "1 Machten met een gehele exponent", short: "gehele exponent", p: "3-4" },
    { id: "H2", titel: "2 Rekenregels voor machten met eenzelfde grondtal", short: "zelfde grondtal", p: "5-6" },
    { id: "H3", titel: "3 Macht van een macht", short: "macht van een macht", p: "7" },
    { id: "H4", titel: "4 Macht van een product", short: "macht van een product", p: "8" },
    { id: "H5", titel: "5 Macht van een quotiënt", short: "macht van een quotiënt", p: "9-10" },
    { id: "H6", titel: "Alle rekenregels door elkaar + vraagstukken", short: "door elkaar", p: "10, 20" },
    { id: "H7", titel: "6 Wetenschappelijke schrijfwijze", short: "wetenschappelijk", p: "11" },
    { id: "B", titel: "Begrippen, definities en rekenregels + theorieblad", short: "begrippen", p: "3-11" },
  ];

  // ---------- reken uit (waarde) ----------
  const REKEN_H1 = [
    ["verwerking 2a", "4^-3"], ["verwerking 2b", "(-6)^-2"], ["verwerking 2c", "({5/2})^-2"], ["verwerking 2d", "(-1,5)^-4"],
    ["verwerking 2e", "-({8/4})^-6"], ["verwerking 2f", "({1/10})^-5"],
    ["signaal 1a", "4^-2"], ["signaal 1b", "({2/3})^-3"], ["signaal 1c", "(-1)^-4"], ["signaal 1d", "({-4/7})^-1"], ["signaal 1e", "({-1/2})^-5"], ["signaal 1f", "5^-1"],
    ["D2a", "2^-3"], ["D2b", "10^-4"], ["D2c", "2^-1"], ["D2d", "2^-5"], ["D2e", "10^-3"], ["D2f", "10^-1"], ["D2g", "10^-2"], ["D2h", "2^-2"],
    ["D3a", "5^-2"], ["D3b", "(-3)^-4"], ["D3c", "1^-9"], ["D3d", "(-2)^-5"], ["D3e", "12^-1"], ["D3f", "(-10)^-4"], ["D3g", "4^-3"], ["D3h", "8^-2"],
    ["D4a", "({-9/7})^-2"], ["D4b", "({3/2})^-4"], ["D4c", "({1/14})^-1"], ["D4d", "({-3/5})^-3"], ["D4e", "({5/8})^-2"], ["D4f", "({-9/11})^-1"], ["D4g", "({-2/3})^-3"], ["D4h", "({8/16})^-5"],
    ["D7a", "0,5^-3"], ["D7b", "(-0,1)^-5"], ["D7c", "(-0,2)^-4"], ["D7d", "0,3^-3"],
    ["D9a", "-2^-6"], ["D9b", "-(-17)^-1"], ["D9c", "(-0,1)^-3"], ["D9d", "-({3/2})^-4"],
    ["voorbeeld p.4", "(-10)^-5"], ["voorbeeld p.4", "(-3)^-4"], ["voorbeeld p.4", "(-0,3)^-3"],
  ];
  // ---------- schrijf als macht met een positieve exponent ----------
  const POS_H1 = [
    ["verwerking 1a", "7^-6"], ["verwerking 1b", "({13/21})^-2"], ["verwerking 1c", "(-19)^-5"], ["verwerking 1d", "(0,4)^-4"], ["verwerking 1e", "({-7/4})^-1"], ["verwerking 1f", "(-8)^-8"],
    ["D10a", "a^-4"], ["D10b", "({a/b})^-5"], ["D10c", "({1/b})^-3"],
    ["voorbeeld p.4", "5^-2"], ["voorbeeld p.4", "({-2/7})^-2"], ["voorbeeld p.4", "({4/5})^-1"],
  ];
  // het tegengestelde / het omgekeerde (verwerking 3)
  const TEGEN = [
    ["verwerking 3a", "het tegengestelde van", "({-2/7})^3", "({2/7})^3"],
    ["verwerking 3b", "het omgekeerde van", "10^-100", "10^100"],
    ["extra", "het omgekeerde van", "({3/5})^4", "({5/3})^4"],
    ["extra", "het tegengestelde van", "(-2)^5", "2^5"],
    ["extra", "het omgekeerde van", "7^-3", "7^3"],
    ["extra", "het tegengestelde van", "-3^4", "3^4"],
  ];
  // D1: vul aan met −1, 0 of 1
  const VUL_EXP = [
    ["D1a", "2^?", "2", 1], ["D1b", "10^?", "{1/10}", -1], ["D1c", "10^?", "1", 0], ["D1d", "(-5)^?", "-5", 1],
    ["D1e", "({-2/3})^?", "{-3/2}", -1], ["D1f", "(-2)^?", "1", 0], ["D1g", "(-1)^?", "-1", 1], ["D1h", "7^?", "{1/7}", -1],
  ];
  // positief of negatief zonder uit te rekenen (D8, D35)
  const TEKEN = [
    ["D8a", "-7^5"], ["D8b", "-(-1,9)^8"], ["D8c", "({5/3})^-5"], ["D8d", "(-2)^-4"], ["D8e", "-(-0,7)^-7"], ["D8f", "(-3)^-9"], ["D8g", "-(-4)^0"], ["D8h", "({-4/9})^-2"],
    ["D35a", "[(-7)^2]^3"], ["D35b", "-[(-4)^6]^5"], ["D35c", "-[(-4)^2]^8"], ["D35d", "[(-2)^3]^3"], ["D35e", "-(3^-4)^8"], ["D35f", "-(-8^-2)^4"], ["D35g", "[(-5)^3]^-3"], ["D35h", "-(-1^-3)^-3"],
  ];
  // vergelijk met >, = of < (D14)
  const VERGELIJK = [
    ["D14a", "10^-6", "10^-8"], ["D14b", "({3/2})^-4", "({3/2})^-5"], ["D14c", "({1/2})^-4", "4^2"], ["D14d", "-10^-10", "-10^-9"],
    ["D14e", "({-5/8})^0", "({-5/8})^-1"], ["D14f", "-(-1)^-8", "-1^-8"], ["D14g", "0,1^-9", "0,1^-3"], ["D14h", "({-5/4})^-2", "0,8^2"],
  ];
  // welke uitdrukking hoort niet in het rijtje? (D5 + eigen rijtjes in dezelfde stijl)
  const RIJTJES = [
    ["D5", ["(-1)^-3", "-1^-1", "-1^3", "-3^0", "(-1)^-2"]],
    ["extra", ["2^-2", "({1/2})^2", "{1/4}", "4^-1", "(-2)^-2", "-2^-2"]],
    ["extra", ["10^-3", "0,001", "{1/1000}", "({1/10})^3", "(-10)^-3"]],
    ["extra", ["(-3)^2", "9", "3^2", "-3^2", "({1/3})^-2"]],
  ];

  // ---------- 2 rekenregels voor machten met eenzelfde grondtal ----------
  const POS_H2 = [ // schrijf als één macht met een positieve exponent
    ["verwerking 4a", "3^9·3^6"], ["verwerking 4b", "({9/7})^5:({9/7})^2"], ["verwerking 4c", "4^3·4·4^-5"], ["verwerking 4d", "0,1^-3:0,1^-5"], ["verwerking 4e", "({-2/3})^4·({-2/3})^-2"], ["verwerking 4f", "(-8)^6:(-8)^10"],
    ["D23a", "a^3·a^4"], ["D23b", "b^-5·b^-2"], ["D23c", "c^10:c^3"], ["D23d", "d^-3:d^-6"], ["D23e", "e^-12·e^6"], ["D23f", "f^-4·f^6"], ["D23g", "g^-1:g"], ["D23h", "h^3·h^4·h^2·h"], ["D23i", "k^-5·k^2"],
  ];
  const REKEN_H2 = [ // schrijf als één macht en reken uit indien mogelijk
    ["verwerking 5a", "17^4·17^-3"], ["verwerking 5b", "(-13)^5:(-13)^3"], ["verwerking 5c", "4^2·4^5·4^-4"], ["verwerking 5d", "({-5/4})^6:({-5/4})^3"], ["verwerking 5e", "a^2·a^4·a^-7"], ["verwerking 5f", "b^-3·b^7:b^-4"],
    ["signaal 2a", "2^4·2^2"], ["signaal 2b", "(-10)^7:(-10)^5"], ["signaal 2c", "(-0,5)^-6·(-0,5)^7·(-0,5)"], ["signaal 2d", "({3/5})^-9:({3/5})^-8"], ["signaal 2e", "{a^9/a^-6}"], ["signaal 2f", "a·a^2·a^-2·a^-1"],
    ["D19a", "2^3·2^4"], ["D19b", "a·a^5"], ["D19c", "0,1^4·0,1^2"], ["D19d", "y^2·y·y"], ["D19e", "({3/2})^2·({3/2})^2"], ["D19f", "(-3)^3·(-3)"],
    ["D20a", "10^8:10^5"], ["D20b", "a^7:a^5"], ["D20c", "{3^8/3^7}"], ["D20d", "{x^12/x^4}"], ["D20e", "0,5^6:0,5^4"], ["D20f", "{y^7/y^7}"],
    ["D21a", "2^8·2^-5"], ["D21b", "a^-3·a^5"], ["D21c", "x^-4·x^2"], ["D21d", "y^-4·y^6·y^-3"], ["D21e", "({2/3})^4·({2/3})^-6"], ["D21f", "x^3·x^-3"],
    ["D22a", "10^-2:10^2"], ["D22b", "a^9:a^-3"], ["D22c", "{2^-2/2^-5}"], ["D22d", "0,1^4:0,1^-2"], ["D22e", "y^-6:y^-7"], ["D22f", "{x^-5/x^6}"],
    ["D24a", "{a^3·a/a^2}"], ["D24b", "x^2·y·x^3·y·x^4"], ["D24c", "{a^20·b^15/a^10·b^5}"], ["D24d", "{x^4/x^2·x^5}"], ["D24e", "{a^2·a^-4/a}"], ["D24f", "{x^3·y/x·x^2}"],
  ];
  // kan je de rekenregel gebruiken? (D17)
  const KAN_REGEL = [
    ["D17", "2·2^4", "verm"], ["D17", "10^5:2^3", "nee"], ["D17", "a^4-a^-3", "nee"], ["D17", "{6^9/6^2}", "deel"], ["D17", "10:10^-2", "deel"],
    ["D17", "({-3/4})^5·({-3/4})^6", "verm"], ["D17", "0,5^4+0,5^2", "nee"], ["D17", "{q^3/q^7}", "deel"], ["D17", "2^6·5^-6", "nee"], ["D17", "m·m^2·m^3", "verm"],
    ["extra", "3^4·4^3", "nee"], ["extra", "x^5:x^5", "deel"],
  ];
  // vul aan met + of − (D18)
  const PLUSMIN = [
    ["D18a", "4^7·4^3", "4", "7", "3", "+"], ["D18b", "0,3^4:0,3", "0,3", "4", "1", "−"], ["D18c", "(-9)^-1:(-9)^6", "(-9)", "-1", "6", "−"],
    ["extra", "a^-2·a^5", "a", "-2", "5", "+"], ["extra", "x^8:x^-3", "x", "8", "(-3)", "−"],
  ];

  // ---------- 3 macht van een macht ----------
  const POS_H3 = [
    ["verwerking 6a", "(2^3)^3"], ["verwerking 6b", "[({-1/4})^-3]^2"], ["verwerking 6c", "[(-3,75)^2]^-2"], ["verwerking 6d", "[({7/3})^-4]^-1"],
    ["signaal 3a", "(2^2)^3"], ["signaal 3b", "(10^3)^-1"], ["signaal 3c", "(a^-4)^4"], ["signaal 3d", "[(-a)^3]^6"],
    ["D34a", "(a^5)^2"], ["D34b", "(b^3)^2"], ["D34c", "(-c^2)^3"], ["D34d", "(-d^4)^3"], ["D34e", "(e^-6)^-4"], ["D34f", "(f^-5)^3"], ["D34g", "(g^7)^-1"], ["D34h", "(h^3)^4"],
  ];
  const REKEN_H3 = [
    ["verwerking 7a", "[(-2)^2]^3"], ["verwerking 7b", "[({3/2})^-2]^-2"], ["verwerking 7c", "[(0,1)^2]^-2"], ["verwerking 7d", "(a^4)^-3"],
    ["D33a", "(3^3)^2"], ["D33b", "[(-2)^2]^4"], ["D33c", "(0,1^2)^2"], ["D33d", "(5^-1)^3"], ["D33e", "(9^3)^0"], ["D33f", "(12^-2)^-1"], ["D33g", "[(-1)^6]^-4"], ["D33h", "(4^-1)^-3"],
    ["voorbeeld p.7", "[(-2)^-2]^3"], ["D31", "(2^3)^2"], ["D31", "(10^2)^3"], ["D31", "(2^-2)^-3"], ["D31", "(10^-1)^4"], ["D31", "(10^-5)^2"],
  ];

  // ---------- 4 macht van een product ----------
  const ZONDER_H4 = [ // schrijf zonder haakjes (en reken uit)
    ["verwerking 8b", "(3y)^7"], ["verwerking 8c", "(xyz)^8"], ["verwerking 8d", "(0,5x^4)^4"], ["verwerking 8e", "(-8x^8)^2"], ["verwerking 8f", "(-7xy^2z^3)^-3"],
    ["verwerking 9a", "(-xy^2)^3"], ["verwerking 9b", "(2p)^5"], ["verwerking 9c", "(-4x^-2)^-2"], ["verwerking 9d", "(10p^3q^4)^2"], ["verwerking 9e", "(a^-2b^3)^-4"], ["verwerking 9f", "(0,3k^4)^2"],
    ["signaal 4a", "(2a)^4"], ["signaal 4b", "(-10b)^-2"], ["signaal 4c", "(0,1a^2b)^3"], ["signaal 4d", "(-3ab)^0"],
    ["D43a", "(4a)^2"], ["D43b", "(-5b)^3"], ["D43c", "(2c)^-4"], ["D43d", "(0,1d)^3"], ["D43e", "(ef)^7"], ["D43f", "(-6fg)^2"], ["D43g", "(0,5gh)^-1"], ["D43h", "-(-3h)^4"],
    ["D44a", "(ab^2)^2"], ["D44b", "(3a^2b)^3"], ["D44c", "(-5c^2d^-1)^-3"], ["D44d", "(0,3c^4d^3)^2"], ["D44f", "(ef)^2·e^2f^2"],
    ["voorbeeld p.8", "(-4xy)^2"], ["voorbeeld p.8", "(-5xy)^-2"], ["voorbeeld p.8", "(0,1x^3)^5"],
  ];
  const REKEN_H4 = [
    ["verwerking 8a", "(-5·9)^2"], ["D42a", "(-2·3)^2"], ["D42b", "(2·9)^-1"], ["D42c", "(-4·5)^3"], ["D42d", "(2·10)^-2"], ["voorbeeld p.8", "(-2·9)^2"], ["merk op p.8", "2^3·5^3"],
  ];
  const GELIJK = [ // = of ≠ (D41, D47)
    ["D41a", "(2·9)^3", "2^3·9^3"], ["D41b", "(ab)^4", "a^4·b^4"], ["D41c", "(-3ab)^4", "-3^4a^4b^4"], ["D41d", "(0,5x)^2", "0,5^2x^2"],
    ["D47a", "({2/5})^3", "{2^3/5^3}"], ["D47b", "({-3/8})^2", "{(-3)^2/8}"], ["D47c", "({9/11})^5", "{9^5/11^5}"], ["D47d", "({-7/2})^4", "{-7^4/2^4}"],
    ["extra", "(2+3)^2", "2^2+3^2"], ["extra", "(-2x)^3", "-8x^3"], ["extra", "(3a)^2", "3a^2"], ["extra", "({x/2})^-1", "{2/x}"],
  ];

  // ---------- 5 macht van een quotiënt ----------
  const ZONDER_H5 = [
    ["verwerking 10a", "({-2/3})^3"], ["verwerking 10b", "({4/7})^-2"], ["verwerking 10c", "({a^2/b^3})^2"], ["verwerking 10d", "({3a^3/2})^2"],
    ["signaal 5a", "({-2/3})^4"], ["signaal 5b", "({4/9})^-2"], ["signaal 5c", "({a^2/10})^2"], ["signaal 5d", "({-5a/b})^3"],
    ["D48a", "({1/3})^4"], ["D48b", "({-2/5})^3"], ["D48c", "({-1/2})^6"], ["D48d", "({1/10})^6"], ["D48e", "({e/f})^2"], ["D48f", "2,2^2"], ["D48g", "({4/14})^-2"], ["D48h", "({a/b})^-5"],
    ["D49a", "({2a/3})^2"], ["D49b", "({-3b/4c})^3"], ["D49c", "({-6c/7d})^-2"], ["D49d", "({c/3d})^4"],
    ["voorbeeld p.9", "({-5/9})^3"], ["voorbeeld p.9", "({-13/11})^-5"],
  ];
  const SLIM = [ // reken slim uit met de rekenregels (verwerking 11, D50, merk op)
    ["verwerking 11a", "0,1^5·20^5"], ["verwerking 11b", "{90^4/30^4}"], ["verwerking 11c", "{64^-2/128^-2}"], ["verwerking 11d", "6^7·15^7:9^7"],
    ["D50a", "125^3:25^3"], ["D50b", "2^4·5^4"], ["D50c", "32^5:16^5"], ["D50d", "4^3·25^3"], ["D50e", "45^4:15^4"], ["D50f", "5^3·0,2^3"],
    ["merk op p.9", "{125^3/25^3}"], ["merk op p.8", "2^3·5^3"],
  ];

  // ---------- door elkaar: kleur de juiste oplossingen (verwerking 12) ----------
  const KLEUR = [
    ["(-2)^2·(-2)^4", ["(-2)^6", "2^6", "64", "(-2)^8"]],
    ["9^2·3^-4", ["3^4·3^-4", "1", "3", "{3/2}"]],
    ["(2^3)^4·(5^6)^2", ["10^12", "2^7·5^8", "10^25", "10^24"]],
    ["2^3·2^4", ["2^7", "2^12", "4^7", "48"]],
    ["(-1^-2)^-3", ["2^3", "{1/2^3}", "-1", "1"]],
    ["-0,5^-3", ["8", "-{1/8}", "-8", "{1/8}"]],
    ["2^2·50^2", ["400", "100^4", "10000", "100"]],
    ["{(2^2·2)^2/2}", ["2^5", "2^6", "2^3", "2^2"]],
    ["21^5:7^5", ["3^5", "3", "3^0", "3^10"]],
    ["-5^-2", ["10", "-{1/25}", "25", "{1/25}"]],
    ["4^4:2^2", ["2", "2^8:2^2", "2^6", "64"]],
    ["(-4)^2:(-2)^4", ["(-2)^6", "(-4)^6", "1", "(-2)^0"]],
    ["(-3^4)^2", ["3^8", "-3^8", "-3^6", "3^6"]],
    ["25·5^2", ["25^2", "5^4", "125^2", "800"]],
    ["(-5)^4:(-5)^2", ["(-5)^2", "5^2", "25", "-25"]],
    // D12: kleur het juiste antwoord
    ["{1/4^-2}", ["{-1/16}", "16", "8", "-8"]],
    ["({-5/7})^-5", ["({5/7})^-5", "({5/7})^5", "({7/5})^5", "({-7/5})^5"]],
    ["-5^-2", ["-25", "25", "{1/10}", "{-1/25}"]],
    ["(0,01)^-3", ["-0,03", "0,000001", "-1000000", "1000000"]],
    ["{1/4}", ["-4^-1", "-2^-2", "(-2)^-2", "1^-4"]],
    ["(-3)^-3", ["-9", "{1/9}", "27", "{-1/27}"]],
  ];
  // vraagstukken (instap, D25, D26, opdracht 13)
  const VRAAG = [
    { l: "instap opdracht 1", q: "Een waterhyacint bedekt bij de start van een onderzoek 1 km². De bedekte oppervlakte verdubbelt elke dag. Hoe groot (in km²) was de bedekte oppervlakte 3 dagen vóór het onderzoek?", a: "2^-3", eenheid: "km²", uitleg: "1 dag vroeger = de helft: 2⁻¹, 2 dagen: 2⁻², 3 dagen: 2⁻³ = 1/8 km²" },
    { l: "instap opdracht 1", q: "Dezelfde waterhyacint (1 km² bij de start, elke dag dubbel zo groot). Hoe groot is de bedekte oppervlakte 3 dagen ná de start?", a: "2^3", eenheid: "km²", uitleg: "2³ = 8 km²" },
    { l: "instap opdracht 1", q: "Dezelfde waterhyacint. Hoe groot was de bedekte oppervlakte 1 dag vóór het onderzoek?", a: "2^-1", eenheid: "km²", uitleg: "2⁻¹ = 1/2 km²" },
    { l: "D25", q: "Een normaal gesprek is 10⁶ keer luider dan het stilste hoorbare geluid, een opstijgend vliegtuig 10¹⁴ keer. Hoeveel keer luider is het vliegtuig dan een normaal gesprek?", a: "10^14:10^6", eenheid: "keer", uitleg: "10¹⁴ : 10⁶ = 10⁸ = 100 000 000 keer" },
    { l: "D26a", q: "Bereken de helft van 2¹⁰.", a: "2^10:2", eenheid: "", uitleg: "2¹⁰ : 2 = 2⁹ = 512" },
    { l: "D26b", q: "De massa van een zandkorrel is ongeveer 10⁻³ gram. Hoeveel zandkorrels zitten er ongeveer in een zandzak van 10 kg (= 10⁴ gram)?", a: "10^4:10^-3", eenheid: "zandkorrels", uitleg: "10⁴ : 10⁻³ = 10⁷ = 10 000 000" },
    { l: "D26c", q: "Een microscoop vergroot een voorwerp 10⁵ keer. In werkelijkheid is het voorwerp 10⁻⁵ cm. Hoe groot is het vergrote voorwerp (in cm)?", a: "10^-5·10^5", eenheid: "cm", uitleg: "10⁻⁵ · 10⁵ = 10⁰ = 1 cm" },
    { l: "D60b", q: "De temperatuur aan het oppervlak van de zon is ongeveer 6000 °C, in de kern ongeveer 15 miljoen °C. Hoeveel keer warmer is de kern?", a: "15000000:6000", eenheid: "keer", uitleg: "15 000 000 : 6000 = 2500 = 2,5 · 10³" },
  ];

  // ---------- 6 wetenschappelijke schrijfwijze ----------
  // naar wetenschappelijke schrijfwijze: [label, getal (gewone schrijfwijze of tekst), context?]
  const NAAR_WET = [
    ["verwerking 13a", "170000000", "De massa van een blauwe vinvis is ongeveer 170 000 000 gram."],
    ["verwerking 13b", "0,000001", "Een molecule is 0,000001 mm dik."],
    ["verwerking 13c", "1400000000", "De zon heeft een diameter van ongeveer 1 400 000 000 meter."],
    ["verwerking 13d", "0,00000001", "Een nanocapsule is 0,00000001 meter dik."],
    ["signaal 6a", "31622400", "Een schrikkeljaar duurt 31 622 400 seconden."],
    ["signaal 6b", "0,000014", "Een vrouwelijke vlooi drinkt ongeveer 0,000014 liter bloed per dag."],
    ["signaal 6c", "940000000", "De omtrek van de baan van de aarde rond de zon is iets meer dan 940 miljoen kilometer."],
    ["signaal 6d", "0,017", "Een dun menselijk haar is 0,017 millimeter dik."],
    ["signaal 6e", "620000000000", "Elk jaar wordt er wereldwijd ongeveer 620 miljard kilogram graan geteeld."],
    ["signaal 6f", "0,0000000001", "Een waterstofatoom heeft een doorsnede van ongeveer 0,0000000001 meter."],
    ["signaal 6g", "1500000000", "In Vlaanderen worden jaarlijks meer dan 1 miljard 500 miljoen eieren gegeten."],
    ["D57a", "2000000"], ["D57b", "0,00006"], ["D57c", "48400"], ["D57d", "0,00021"], ["D57e", "540000000"], ["D57f", "0,007"], ["D57g", "71000"], ["D57h", "0,000101"],
    ["D57i", "0,42"], ["D57j", "32000000000"], ["D57k", "3,9"], ["D57l", "0,00000004"], ["D57m", "0,3·10^8"], ["D57n", "71·10^-2"], ["D57o", "0,84·10^-10"], ["D57p", "133·10^-5"],
    ["D59a", "0,003", "Een bloedplaatje is 0,003 mm groot."], ["D59b", "0,0075", "Een rode bloedcel is 0,0075 mm groot."], ["D59c", "0,012", "Een witte bloedcel is 0,012 mm groot."],
    ["D60a", "4500000000", "De zon is ongeveer 4,5 miljard jaar oud."],
    ["D61a", "26000000000", "Een baby heeft bij de geboorte ongeveer 26 miljard cellen."],
    ["D61b", "6000000000000000000", "In een donderwolk zijn er ongeveer 6 triljoen regendruppels."],
    ["D61c", "0,0001", "Een menselijke eicel heeft een diameter van 0,0001 meter."],
    ["D61d", "0,0000000033", "Het licht heeft voor het afleggen van één meter ongeveer 0,0000000033 seconde nodig."],
    ["D61e", "41000000000000000", "De dichtstbijzijnde ster (Proxima Centauri) bevindt zich op ongeveer 41 000 000 000 000 000 meter."],
  ];
  // terug naar de gewone schrijfwijze: [label, mantisse, exponent]
  const TERUG = [
    ["verwerking 14a", "7,2", 8], ["verwerking 14b", "5,3", -4], ["verwerking 14c", "1,01", 10], ["verwerking 14d", "8,28", -7],
    ["D58a", "7,3", 3], ["D58b", "1,21", -6], ["D58c", "3", -4], ["D58d", "5,001", 8], ["D58g", "1,93", 6], ["D58h", "1,8", -7], ["D58i", "6,01", 2], ["D58j", "1,038", -5],
    ["voorbeeld p.11", "5,4", 9], ["voorbeeld p.11", "1,453", 13], ["voorbeeld p.11", "2,89", -9],
  ];
  // staat dit in wetenschappelijke schrijfwijze? (D55)
  const IS_WET = [
    ["12,3", 4], ["0,7", 3], ["100", 2], ["2,82", 14], ["10000", null], ["7,9", 3], ["0,99", 12], ["0,139", -3], ["3,2", -3], ["0,000028", null], ["1,44", -3], ["1,73", -10],
  ];
  // vul de exponent aan (D56)
  const VUL_WET = [
    ["D56a", "230000", "2,3"], ["D56b", "0,00005", "5"], ["D56c", "458000000", "4,58"], ["D56d", "1500", "1,5"],
    ["D56e", "0,000000097", "9,7"], ["D56f", "0,0004001", "4,001"], ["D56g", "24679000", "2,4679"], ["D56h", "0,008", "8"],
  ];
  // rekenen met de wetenschappelijke schrijfwijze (D65)
  const REKEN_WET = [
    ["voorbeeld D65", "7,4·10^8-3,9·10^7"], ["voorbeeld D65", "2,8·10^5·5·10^5"],
    ["D65a", "4,2·10^5+2,25·10^5"], ["D65b", "4,8·10^9-2,7·10^9"], ["D65c", "1,8·10^7·2·10^5"], ["D65d", "{4,5·10^14/2,25·10^8}"], ["D65e", "(1,2·10^3)^2"], ["D65f", "4,4·10^-2+4·10^-3"],
    ["D65g", "8,18·10^-6-1,15·10^-6"], ["D65h", "3,6·10^-3·5·10^2"], ["D65i", "{7,2·10^9/8·10^3}"], ["D65j", "(4·10^2)^-3"], ["D65k", "{3,9·10^-5/1,3·10^2}"], ["D65l", "-2,5·10^-6·4·10^2"],
  ];
  // rangschikken (D64, instap opdracht 2)
  const ORDEN = [
    { l: "D64", q: "Plaats van klein naar groot.", items: ["0,35", "0,035", "3·10^-4", "0,005", "5·10^-2", "35·10^-3", "3,5·10^-2"] },
    { l: "instap opdracht 2", q: "Rangschik de planeten volgens hun diameter (in km), van klein naar groot.", namen: true,
      items: [["Mercurius", "4,878·10^3"], ["Venus", "1,2104·10^4"], ["Mars", "6,792·10^3"], ["Uranus", "5,1118·10^4"], ["Jupiter", "1,42984·10^5"], ["Aarde", "1,2756·10^4"], ["Neptunus", "4,9528·10^4"], ["Saturnus", "1,20536·10^5"]] },
    { l: "extra", q: "Plaats van klein naar groot.", items: ["10^-2", "10^3", "10^-5", "10^0", "10^2"] },
    { l: "extra", q: "Plaats van klein naar groot.", items: ["2,5·10^4", "9·10^3", "1,2·10^5", "3·10^-1", "8·10^-2"] },
  ];
  // SI-voorvoegsels (D62)
  const SI = [
    ["kilo", "k", 3], ["mega", "M", 6], ["giga", "G", 9], ["tera", "T", 12], ["hecto", "h", 2], ["deka", "da", 1],
    ["deci", "d", -1], ["centi", "c", -2], ["milli", "m", -3], ["micro", "μ", -6], ["nano", "n", -9], ["pico", "p", -12],
  ];

  // ---------- begrippen, definities, rekenregels ----------
  const BEGRIPPEN = [
    { t: "grondtal", d: "Bij de macht 4³ is 4 het grondtal: het getal dat herhaald vermenigvuldigd wordt.", p: "3" },
    { t: "exponent", d: "Bij de macht 4³ is 3 de exponent: hoeveel keer het grondtal als factor voorkomt.", p: "3" },
    { t: "macht", d: "Een product van gelijke factoren, kort geschreven als aⁿ (grondtal a, exponent n).", p: "3" },
    { t: "a⁰", d: "a⁰ = 1 (met a ≠ 0)", p: "3" },
    { t: "a¹", d: "a¹ = a", p: "3" },
    { t: "a⁻ᵐ", d: "a⁻ᵐ = 1/aᵐ (met a ≠ 0): een negatieve exponent geeft het omgekeerde.", p: "4" },
    { t: "(a/b)⁻ᵐ", d: "(a/b)⁻ᵐ = (b/a)ᵐ (met a ≠ 0 en b ≠ 0): keer de breuk om en maak de exponent positief.", p: "4" },
    { t: "aᵐ · aᵖ", d: "aᵐ · aᵖ = aᵐ⁺ᵖ: behoud het grondtal en tel de exponenten op.", p: "5" },
    { t: "aᵐ : aᵖ", d: "aᵐ : aᵖ = aᵐ⁻ᵖ: behoud het grondtal en trek de exponenten van elkaar af.", p: "6" },
    { t: "(aᵐ)ᵖ", d: "(aᵐ)ᵖ = aᵐ·ᵖ: behoud het grondtal en vermenigvuldig de exponenten.", p: "7" },
    { t: "(a · b)ᵐ", d: "(a · b)ᵐ = aᵐ · bᵐ: verhef elke factor van het product tot die macht.", p: "8" },
    { t: "(a : b)ᵐ", d: "(a : b)ᵐ = aᵐ : bᵐ, of (a/b)ᵐ = aᵐ/bᵐ: verhef deeltal en deler (teller en noemer) tot die macht.", p: "9" },
    { t: "wetenschappelijke schrijfwijze", d: "Een getal geschreven als product van een decimaal getal met 1 cijfer (≠ 0) voor de komma en een macht van 10.", p: "11" },
  ];
  const REGELVRAGEN = [
    ["Wat is het grondtal van (−3)⁵?", "−3", "3", "5", "−243"],
    ["Wat is de exponent van 4³?", "3", "4", "64", "12"],
    ["Wat is −3² ?", "−9", "9", "−6", "6"],
    ["Wat is (−3)² ?", "9", "−9", "−6", "6"],
    ["Wat is 7⁰ ?", "1", "0", "7", "−7"],
    ["Wat is (−5)¹ ?", "−5", "5", "1", "−1"],
    ["Hoe schrijf je 2⁻⁴ met een positieve exponent?", "1/2⁴", "−2⁴", "2⁴", "−1/2⁴"],
    ["(2/5)⁻² = …", "(5/2)²", "(2/5)²", "−(2/5)²", "(−2/5)²"],
    ["Om machten met eenzelfde grondtal te vermenigvuldigen …", "behoud je het grondtal en tel je de exponenten op", "vermenigvuldig je de grondtallen en de exponenten", "behoud je het grondtal en vermenigvuldig je de exponenten", "tel je de grondtallen op"],
    ["Om machten met eenzelfde grondtal te delen …", "behoud je het grondtal en trek je de exponenten van elkaar af", "deel je de exponenten door elkaar", "deel je de grondtallen en behoud je de exponent", "trek je de grondtallen af"],
    ["Om een macht van een macht te bepalen …", "behoud je het grondtal en vermenigvuldig je de exponenten", "behoud je het grondtal en tel je de exponenten op", "verhef je het grondtal tot de som van de exponenten", "vermenigvuldig je grondtal en exponent"],
    ["Om een product tot een macht te verheffen …", "verhef je elke factor van dat product tot die macht", "verhef je enkel de eerste factor", "tel je de factoren op en verhef je de som", "vermenigvuldig je de exponent met elke factor"],
    ["Om een breuk tot een macht te verheffen …", "verhef je de teller en de noemer tot die macht", "verhef je enkel de teller", "verhef je enkel de noemer", "keer je de breuk om"],
    ["Een macht van een negatief grondtal met een even exponent is …", "positief", "negatief", "nul", "soms positief, soms negatief"],
    ["Een macht van een negatief grondtal met een oneven exponent is …", "negatief", "positief", "nul", "altijd 1"],
    ["Mag je 2³ + 2⁴ schrijven als 2⁷?", "nee: voor een som bestaat geen rekenregel (2³ + 2⁴ = 24)", "ja: exponenten optellen", "ja: grondtallen optellen", "nee, het is 2¹²"],
    ["Welke getallen staan in wetenschappelijke schrijfwijze?", "3 · 10⁸ en 1,3 · 10⁻⁷", "54 · 10⁸ en 0,13 · 10⁻⁶", "300 000 000", "0,3 · 10⁹"],
    ["In 2,89 · 10⁻⁹ staat de komma …", "9 plaatsen naar links verschoven (0,00000000289)", "9 plaatsen naar rechts", "op dezelfde plaats", "8 plaatsen naar links"],
    ["Wat betekent kilo (k)?", "10³", "10⁶", "10⁻³", "10²"],
    ["Wat betekent micro (μ)?", "10⁻⁶", "10⁻³", "10⁻⁹", "10⁶"],
  ];

  // ---------- theorieblad "M4 – Rekenregels voor machten" (definities + rekenregels in woorden en symbolen) ----------
  // s = symbolen (HTML), w = in woorden
  const Q0 = "ℚ<sub>0</sub>";
  const fr = (a, b) => `<span class="fr"><span>${a}</span><span>${b}</span></span>`;
  const THEORIE = [
    { naam: "Definitie machten", w: "aⁿ is een product van n gelijke factoren a (n > 1); a¹ = a en a⁰ = 1 met a ≠ 0.",
      s: "<i>a</i><sup><i>n</i></sup> = <i>a</i> · <i>a</i> · … · <i>a</i> (<i>n</i> factoren, <i>n</i> > 1) · <i>a</i><sup>1</sup> = <i>a</i> · <i>a</i><sup>0</sup> = 1 met <i>a</i> ≠ 0" },
    { naam: "Macht met een negatieve exponent", w: "Een macht met een negatieve exponent is het omgekeerde van de macht met de positieve exponent.",
      s: `∀ <i>a</i> ∈ ${Q0}, ∀ <i>m</i> ∈ ℕ : <i>a</i><sup>−<i>m</i></sup> = ${fr("1", "<i>a</i><sup><i>m</i></sup>")}` },
    { naam: "Breuk met een negatieve exponent", w: "Een breuk met een negatieve exponent: keer de breuk om en maak de exponent positief.",
      s: `∀ <i>a</i>, <i>b</i> ∈ ${Q0}, ∀ <i>m</i> ∈ ℕ : (${fr("<i>a</i>", "<i>b</i>")})<sup>−<i>m</i></sup> = (${fr("<i>b</i>", "<i>a</i>")})<sup><i>m</i></sup>` },
    { naam: "Machten met eenzelfde grondtal vermenigvuldigen", w: "Om machten met eenzelfde grondtal te vermenigvuldigen, behoud je het grondtal en tel je de exponenten bij elkaar op.",
      s: `∀ <i>a</i> ∈ ${Q0}, ∀ <i>m</i>, <i>p</i> ∈ ℤ : <i>a</i><sup><i>m</i></sup> · <i>a</i><sup><i>p</i></sup> = <i>a</i><sup><i>m</i>+<i>p</i></sup>` },
    { naam: "Machten met eenzelfde grondtal delen", w: "Om machten met eenzelfde grondtal te delen, behoud je het grondtal en trek je de exponenten van elkaar af.",
      s: `∀ <i>a</i> ∈ ${Q0}, ∀ <i>m</i>, <i>p</i> ∈ ℤ : <i>a</i><sup><i>m</i></sup> : <i>a</i><sup><i>p</i></sup> = <i>a</i><sup><i>m</i>−<i>p</i></sup>` },
    { naam: "Macht van een macht", w: "Om een macht van een macht te bepalen, behoud je het grondtal en vermenigvuldig je de exponenten met elkaar.",
      s: `∀ <i>a</i> ∈ ${Q0}, ∀ <i>m</i>, <i>p</i> ∈ ℤ : (<i>a</i><sup><i>m</i></sup>)<sup><i>p</i></sup> = <i>a</i><sup><i>m</i>·<i>p</i></sup>` },
    { naam: "Macht van een product", w: "Om een product tot een macht te verheffen, verhef je elke factor van dat product tot die macht.",
      s: `∀ <i>a</i>, <i>b</i> ∈ ${Q0}, ∀ <i>m</i> ∈ ℤ : (<i>a</i> · <i>b</i>)<sup><i>m</i></sup> = <i>a</i><sup><i>m</i></sup> · <i>b</i><sup><i>m</i></sup>` },
    { naam: "Macht van een quotiënt", w: "Om een quotiënt tot een macht te verheffen, verhef je deler en deeltal tot die macht.",
      s: `∀ <i>a</i>, <i>b</i> ∈ ${Q0}, ∀ <i>m</i> ∈ ℤ : (<i>a</i> : <i>b</i>)<sup><i>m</i></sup> = <i>a</i><sup><i>m</i></sup> : <i>b</i><sup><i>m</i></sup>` },
    { naam: "Macht van een breuk", w: "Om een breuk tot een macht te verheffen, verhef je teller en noemer tot die macht.",
      s: `∀ <i>a</i>, <i>b</i> ∈ ${Q0}, ∀ <i>m</i> ∈ ℤ : (${fr("<i>a</i>", "<i>b</i>")})<sup><i>m</i></sup> = ${fr("<i>a</i><sup><i>m</i></sup>", "<i>b</i><sup><i>m</i></sup>")}` },
  ];
  // vragen over de schrijfwijze met kwantoren (theorieblad + D52)
  const KWANTOR = [
    ["Wat betekent <b>∀ a ∈ ℚ<sub>0</sub></b>?", "voor elk rationaal getal a, verschillend van 0", "er bestaat een rationaal getal a", "voor elk natuurlijk getal a", "voor elk rationaal getal a, ook 0"],
    ["Wat betekent <b>∀ m, p ∈ ℤ</b>?", "voor alle gehele getallen m en p (ook negatieve)", "voor alle natuurlijke getallen m en p", "voor alle rationale getallen m en p", "voor één geheel getal m en één geheel getal p"],
    ["Wat betekent <b>∀ m ∈ ℕ</b>?", "voor elk natuurlijk getal m (0, 1, 2, 3 …)", "voor elk geheel getal m", "voor elk negatief getal m", "voor elk rationaal getal m"],
    ["Waarom staat er ℚ<sub>0</sub> (en niet ℚ) bij het grondtal?", "het grondtal mag niet 0 zijn (0 tot een negatieve macht of 0⁰ bestaat niet)", "omdat het grondtal altijd positief moet zijn", "omdat het grondtal een geheel getal moet zijn", "omdat de exponent niet 0 mag zijn"],
    ["Welk symbool betekent 'voor alle' (voor elk)?", "∀", "∈", "ℤ", "ℚ"],
    ["Wat betekent het symbool <b>∈</b>?", "is een element van (behoort tot)", "voor alle", "is gelijk aan", "is groter dan"],
    ["Bij welke regels mogen de exponenten <b>gehele getallen</b> (ℤ) zijn?", "bij alle vijf de rekenregels (vermenigvuldigen, delen, macht van een macht, product, quotiënt)", "enkel bij vermenigvuldigen", "bij geen enkele: enkel natuurlijke getallen", "enkel bij de macht van een macht"],
    ["In de definitie a<sup>−m</sup> = 1/a<sup>m</sup> is m een element van …", "ℕ (een natuurlijk getal)", "ℤ", "ℚ<sub>0</sub>", "ℝ"],
  ];

  const TAGS = {
    negexp: { title: "Negatieve exponent", short: "neg. exponent", advice: "a⁻ᵐ = 1/aᵐ en (a/b)⁻ᵐ = (b/a)ᵐ: een negatieve exponent maakt het getal niet negatief, maar keert het om.", page: "4" },
    teken: { title: "Teken (haakjes!)", short: "teken", advice: "(−3)² = 9 maar −3² = −9: zonder haakjes hoort de exponent enkel bij het getal. Negatief grondtal: even exponent → positief, oneven → negatief.", page: "3" },
    regel: { title: "Rekenregel verward", short: "rekenregel", advice: "Vermenigvuldigen → exponenten optellen · delen → aftrekken · macht van een macht → vermenigvuldigen · product/quotiënt → elke factor tot die macht.", page: "5-9" },
    vorm: { title: "Vorm van het antwoord", short: "vorm", advice: "Lees de opdracht: als één macht? met een positieve exponent? zonder haakjes? uitgerekend?", page: "" },
    wet: { title: "Wetenschappelijke schrijfwijze", short: "wetenschappelijk", advice: "Eén cijfer (≠ 0) voor de komma, dan · 10 tot een macht. Komma naar links verschuiven → exponent groter; naar rechts → kleiner (negatief bij getallen kleiner dan 1).", page: "11" },
    reken: { title: "Rekenfout", short: "rekenfout", advice: "Werk stap voor stap: eerst de rekenregel toepassen, dan pas uitrekenen. Controleer het teken.", page: "" },
    begrip: { title: "Begrippen en regels", short: "begrippen", advice: "Herhaal de definities (a⁰ = 1, a⁻ᵐ = 1/aᵐ) en de vijf rekenregels in woorden en in symbolen.", page: "3-11" },
    fout: { title: "Fout", short: "fout", advice: "", page: "" },
  };

  Vakken.setInhoud("wiskunde-2-m04", {
    vak: "Wiskunde", icon: "🔢", theme: "blue",
    titel: "Module 4 – Machten", klas: "2de middelbaar",
    bron: "getallenleer en algebra, module 4 (p. 1-31) + theorieblad rekenregels",
    levels: {
      easy: { title: "🙂 Makkelijk", desc: "meerkeuze" },
      normal: { title: "💪 Normaal", desc: "meerkeuze + zelf uitrekenen en typen" },
      hard: { title: "🔥 Moeilijk", desc: "alles zelf typen; de vorm (positieve exponent, zonder haakjes) moet kloppen" },
    },
    allInfo: "<b>Eindtoets-modus:</b> elke oefening uit de gekozen onderdelen (verwerkingsopdrachten, signaaloefeningen en het differentiatietraject) komt één keer aan bod.",
    GROUPS, REKEN_H1, POS_H1, TEGEN, VUL_EXP, TEKEN, VERGELIJK, RIJTJES, POS_H2, REKEN_H2, KAN_REGEL, PLUSMIN, POS_H3, REKEN_H3,
    ZONDER_H4, REKEN_H4, GELIJK, ZONDER_H5, SLIM, KLEUR, VRAAG, NAAR_WET, TERUG, IS_WET, VUL_WET, REKEN_WET, ORDEN, SI, BEGRIPPEN, REGELVRAGEN, THEORIE, KWANTOR, TAGS,
  });
})();
