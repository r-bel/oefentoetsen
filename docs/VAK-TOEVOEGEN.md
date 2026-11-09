# Een vak bijsturen of toevoegen

## 1. Inhoud bijsturen (meest voorkomend)
Alles staat in `vakken/<id>/inhoud.js`. Pas aan, sla op, ververs de pagina.

**Frans (`frans-5a`)** – JSON binnen `Vakken.setInhoud(...)`:
- woord verbeteren/toevoegen: `missions[].woordenschat[]` → `{ "fr": "un cahier", "nl": "een schrift", "soort": "nw", "geslacht": "m", "p": 15 }`
- alternatieven: `"nl": "de buur(man) / de buurvrouw"` (haakjes = optioneel, ` / ` = of)
- hint bij dubbelzinnige woorden: `"hint_nl": "zoals in: …"`, `"hint_fr": "…"`
- grammaticaregel (uitleg bij fout): `missions[].grammatica[].regel`

**Latijn (`latijn-2`)** – één regel per woord in `WOORDEN`, in de volgorde van het boek:
`W(409, "3.7", "laudāre, ~ō", "", "prijzen", "ww", { verv: 1, vet: true })`
Het bereik (van nr. … tot nr. …) en de snelkeuzes per paragraaf passen zich vanzelf aan.

**Wiskunde (`wiskunde-2-m01`)** – gewone JavaScript-lijsten:
- uitleg bij een fout of paginanummers van een onderdeel: `UNITS`
- begrip toevoegen: regel in `BEGRIPPEN` → `{ q: "vraag met …", a: ["aanvaard", "ook goed"], show: "getoond", p: "4" }`
- stelling toevoegen: regel in `WNW_EIG` of `WNW_SYM` → `["stelling", true/false, "uitleg"]`
- figuur toevoegen: `FIGS`/`FIGS2` (hoekpunten, aantal assen `ax`, symmetriemiddelpunt `mp`)
- tip bij een fouttype: `TAGS`
In de eindtoets (*Alle*) komt elke nieuwe regel automatisch één keer aan bod.

## 2. Vraagtypes bijsturen
In `vakken/<id>/vak.js`.
- Frans: één generator per grammatica-onderdeel (`genEtre`, `genDef`, …) + `COVERAGE` (welke gevallen in de eindtoets).
- Wiskunde: `unit({ id, cases, gen(level, c) })` per onderdeel; `c` = welk geval. Moeilijkheid via `level`
  (`easy` = meerkeuze, `normal` = mix, `hard` = zelf invullen/klikken).
Test na een wijziging alle niveaus eens met 10 vragen en met *Alle*.

## 3. Nieuw vak of hoofdstuk toevoegen
1. Maak `vakken/<nieuw-id>/` (bv. `frans-5b`, `wiskunde-2-m02`).
2. `inhoud.js`: `Vakken.setInhoud("<nieuw-id>", { … leerstof … });`
3. `vak.js`: bouw vragen en roep `Vakken.register({ … })` aan. De velden staan beschreven bovenaan
   `js/core/vakken.js`. Snelste weg: kopieer het vak dat het meest lijkt
   (taal → `frans-5a`, meetkunde → `wiskunde-2-m01`) en vervang de inhoud.
4. Voeg in `index.html` de twee scripts toe (eerst `inhoud.js`, dan `vak.js`) vóór `js/core/app.js`.
5. Het vak verschijnt vanzelf in het hoofdmenu, gegroepeerd per vaknaam (`vak`).

### Vraagformaat (wat de kern verwacht)
| veld | betekenis |
|---|---|
| `unit`, `unitLabel`, `group`, `page` | onderdeel, naam, groep (missie/doel), pagina |
| `instruction`, `prompt` | opdracht en vraag (HTML) |
| `mode` | `mc` (meerkeuze), `text`, `num` (getal), `coord` (x, y), `click` (punten aanklikken op een rooster) |
| `options` / `answer` | bij `mc`: `[{ v, html }]` en de `v` van het juiste antwoord |
| `answerShown`, `rule` | juist antwoord en uitleg die bij een fout verschijnen (HTML) |
| `key`, `itemLabel` | stabiele id + leesbare naam van de vraag/het woord (voor *Mijn voortgang*) |
| `svg`, `solutionSvg` | optionele figuur en oplossingsfiguur (zie `js/core/geo.js`) |
Extra instellingen per vak (`settings`): `radio` (bv. vertaalrichting), `checkbox`, en `range` (van nr. … tot nr. …, met snelkeuzes `presets`).

`check(given, q, level)` geeft `{ status, points, tag }` terug; `tag` is het fouttype (moet in `tags` staan om
een tip te tonen en in de voortgang mee te tellen).

### Kaarten voor de studiemodule (flashcards)
Een vak levert optioneel `kaarten(instellingen)` en `kaartUnits` (de onderdelen die kaarten hebben).
`kaarten(null)` geeft alle kaarten van het vak; met instellingen enkel die van de keuze (onderdelen, bereik, richting).
Een kaart: `{ key, unit, soort, ask, front, back, info?, tip?, page?, label, frontCls?, backCls?, g?/backG? (m|f: kleur
van het geslacht), lang? ("fr" = uitspraakknop), na? }`.
- **`key` = dezelfde sleutel als de toetsvraag** (bv. `vertalen:351`): dan verplaatst een juist/fout antwoord in een
  toets ook de kaart in de herhaaldozen.
- **`na`**: de kaart komt pas als de genoemde kaart zit (doos 2+), bv. eerst de betekenis, dan de middenkolom;
  eerst FR → NL, dan NL → FR.
- Onderdelen zonder kaarten (grammatica, figuren) krijgen in de planning automatisch dagelijkse oefenreeksen,
  waarvan het niveau stijgt zodra het zit.

## 4. Werkwijze met Claude (van foto's naar toets)
1. Foto's van de cursus in een map (bv. `261107 Briek Wiskunde 2de latijn`).
2. Laat Claude de leerstof uitlezen naar `leerstof.json` (context) en `inhoud.js` (wat de app gebruikt).
3. Kies/maak de vraagtypes in `vak.js`, test alle niveaus, publiceer.

## 5. Na elke wijziging: versie ophogen
Browsers bewaren de scripts een tijd in hun cache. Verhoog daarom in `index.html` overal `?v=…` (bv. `?v=2` → `?v=3`),
zodat iedereen meteen de nieuwe versie krijgt en kern en vakken nooit door elkaar lopen.

## 6. Voortgang bewaren bij nieuwe versies
De voortgang staat in de browser van de leerling (localStorage, sleutel `oefentoetsen-v1`). Een nieuwe versie van
de site raakt die gegevens niet, zolang je deze regels volgt:
- **Adres niet wijzigen.** De gegevens horen bij het adres (`www.dirkdhaenens.com`). Een ander domein of een andere
  repo-naam = een lege voortgang (dan via *Reservekopie maken* / *terugzetten* overzetten).
- **Sleutel niet wijzigen.** `KEY` in `js/core/store.js` blijft `oefentoetsen-v1`, ook al heet de structuur nu versie 3.
- **Kaartsleutels niet hernummeren.** De herhaaldozen hangen aan de `key` van elke kaart (bv. `vertalen:351`,
  `rappelle:3:fr-nl`). Nieuwe woorden achteraan of met een nieuw nummer toevoegen; bestaande sleutels laten staan.
- **Structuur aanpassen = migratie.** Verhoog `VERSION` en voeg in `MIGRATIONS` een stap toe die oude gegevens omzet
  en aanvult. Nooit velden verwijderen of de gegevens leegmaken. Vóór elke migratie wordt automatisch een
  reservekopie gemaakt (`oefentoetsen-backup-…`, de laatste 3 blijven).
- **Id's stabiel houden.** De geschiedenis verwijst naar het vak-id (`latijn-2`), de onderdeel-id's (`vertalen`)
  en de vraagsleutels (`vertalen:352`). Een naam of label mag je vrij aanpassen; een id liever niet. Moet een id toch
  wijzigen, voeg dan een migratiestap toe die de oude id in sessies en items vervangt.
- **Vangnetten die er al zijn:** na elke toets een reservekopie van de vorige toestand (`oefentoetsen-reserve`),
  automatisch terugzetten als de hoofdgegevens weg of onleesbaar zijn, onleesbare gegevens worden apart bewaard,
  een nieuwere structuur (oude cache) wordt nooit overschreven, en de browser wordt gevraagd de opslag te bewaren.
- **Wat de site niet kan voorkomen:** het wissen van browsergegevens door de gebruiker, en Safari op iPhone/iPad
  dat sitegegevens wist na 7 dagen zonder bezoek. Daarvoor dient *Reservekopie maken* (alle leerlingen in één bestand);
  *Mijn voortgang* herinnert eraan.
