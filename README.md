# Oefentoetsen

Eén statische web-app (HTML/CSS/JS, geen build, geen server, geen login) met oefentoetsen per vak.
De vakken staan als hoofdmenu op de startpagina. Dubbelklik `index.html` om lokaal te openen (werkt ook offline).

Live: `https://r-bel.github.io/oefentoetsen/` · rechtstreeks naar een vak: `…/oefentoetsen/#v/<vak-id>`
(bv. `#v/frans-5a`, `#v/wiskunde-2-m01`) · voortgang: `#voortgang`.

## Opbouw: kern + vakmodules
```
index.html                  alle schermen: vakken → instellingen → toets → resultaat, en "Mijn voortgang"
css/style.css               opmaak + kleurthema's per vak (body[data-theme])
js/config.js                koffieknop, feedbackmail, bezoekersstatistieken (aan/uit)
js/core/vakken.js           vakkenregister + beschrijving van de vak-interface
js/core/store.js            voortgang in de browser (localStorage), per leerling-profiel
js/core/app.js              gedeelde interface: menu, instellingen, antwoordmodi, verbetering, resultaat, voortgang
js/core/geo.js              SVG-tekenhulp (roosters, assenstelsels, figuren) – herbruikbaar voor elk meetkundevak
js/core/analytics.js        optionele, anonieme bezoekersstatistieken (GoatCounter), standaard UIT
vakken/<id>/inhoud.js       de LEERSTOF van dat vak  → hier stuur je inhoud bij
vakken/<id>/vak.js          de VRAAGTYPES + verbetering van dat vak → hier stuur je vragen/logica bij
vakken/<id>/leerstof.json   (optioneel) samenvatting van het handboek als context voor mens/AI – niet ingelezen
docs/VAK-TOEVOEGEN.md       hoe je een vak bijstuurt of een nieuw vak toevoegt
```
De kern weet niets van Frans of wiskunde: alles wat vak-specifiek is (onderdelen, niveau-omschrijvingen,
extra instellingen zoals de vertaalrichting, accenttoetsen, fouttypes en tips, vraagtypes) zit in de vakmodule.
Een vak bijsturen raakt dus nooit een ander vak.

## Vakken
| id | vak | inhoud | vraagtypes |
|---|---|---|---|
| `frans-5a` | Frans 5de leerjaar – Cahier A (Missions 1-3 + Destination A) | woordenlijsten, zinnen, grammaticaregels | vertalen NL↔FR, vervoegen, lidwoorden, meervoud, … |
| `wiskunde-2-m01` | Wiskunde 2de middelbaar – Nando 2, Meetkunde module 01 | begrippen, stellingen, figuren, uitleg, fouttypes | notaties, rooster, coördinaten, rotatiehoeken, klik-constructies, symmetrie |
| `frans-2-t2` | Frans 2de middelbaar – Trajet 2 · 1 (p.101-108) | woordenschat met geslacht en voorbeeldzinnen, weer, seizoenen, activiteiten, windrichtingen, actes de parole, oef. 26-27 | in boekstijl: vocabulaire NL↔FR, Complète la phrase, Quel mot cherchons-nous ?, Fais des phrases (zinsbouw), lidwoorden, du/de la/au, en/au, il va + infinitief, il fait/c'est chaud, actes de parole |
| `latijn-2` | Latijn 2de middelbaar – genummerde woordenlijst (nu 344–408) + woordvorming | woordenlijst (eerste kolom, middenkolom, vertaling), woordvormingskaders | enkel Latijn → Nederlands, middenkolom (genitief/geslacht, vormen, stamtijden), vorm herkennen, woordvorming, verbuiging, geslacht, vervoeging, + datief; keuze "van nr. … tot nr. …" |

## Voortgang (lokaal, geen server)
- Elke afgewerkte toets wordt in de browser bewaard: vak, niveau, score, score per onderdeel, fouttypes,
  en per vraag/woord hoe vaak het juist/fout ging.
- **Leerlingprofielen** (rechtsboven): meerdere kinderen op hetzelfde toestel, elk met eigen voortgang. Geen wachtwoord.
- **Mijn voortgang**: per vak en per niveau → aantal toetsen, gemiddelde, trend, werkpunten (onderdelen < 75%)
  met knop *Oefen mijn werkpunten*, fouten die blijven terugkomen (+ tip), woorden/vragen die moeilijk blijven,
  wat goed gekend is en de geschiedenis.
- **Toets op basis van je fouten** (knop bij de instellingen en in *Mijn voortgang*): stelt een toets samen uit de
  vragen/woorden die eerder fout gingen (vooral herhaaldelijk en recent fout), aangevuld met onderdelen met een lage
  score of terugkerende fouttypes. Werkt per vak; elke vakmodule levert daarvoor `fromKey(key, niveau)`.
- **Geschiedenis** toont per toets een leesbare beschrijving van de instellingen (onderdelen, richting/bereik, aantal, foutgericht).
- **Exporteer / importeer**: voortgang als JSON-bestand (bv. om naar een ander toestel over te zetten).
- Wissen van browsergegevens = voortgang weg. Dat is de prijs van "geen server".

## Bezoekersstatistieken
Actief via GoatCounter (account `oefentoetsen`, dashboard: https://oefentoetsen.goatcounter.com), zonder cookies.
Uitzetten: `goatcounterCode: ""` in `js/config.js`. Dan worden geteld: paginabezoeken,
welk vak geopend, toets gestart/afgerond per vak en niveau. Geen namen, antwoorden of scores per leerling.

## Roadmap
1. **AI-verbetersuggesties per vak en niveau**: `Store.summary(vakId, niveau)` geeft al een compacte samenvatting
   (werkpunten, terugkerende fouttypes, moeilijke items, trend). Die kan later naar een AI gestuurd worden voor
   persoonlijke tips of een gerichte oefenreeks. Opties: (a) de leerling/ouder kopieert de samenvatting naar een
   AI-assistent, (b) een kleine serverless functie met eigen API-sleutel (de sleutel mag niet in de publieke site).
2. Spaced repetition: woorden/vragen uit "Blijft moeilijk" vaker laten terugkomen.
3. Meer vakken/hoofdstukken (zie `docs/VAK-TOEVOEGEN.md`).
4. Semi-commercieel: koffieknop (klaar, staat uit), suggestiemail, eigen domein.
   Let op auteursrecht: inhoud komt uit uitgeverscursussen – voor publiek gebruik eerst nagaan wat mag.

## Publiceren op GitHub Pages
1. Nieuwe repo `oefentoetsen`, inhoud van deze map in de root.
2. *Settings → Pages → Deploy from a branch → main / (root)*.
3. De oude sites: vervang in de repo's `oefentoets-frans` en `oefentoets-wiskunde` de `index.html` door
   de doorverwijspagina uit de map `doorverwijzingen` (naast deze map). Oude links blijven zo werken.
   (De voortgang van de oude losse apps wordt niet overgenomen, enkel de laatste instellingen.)
