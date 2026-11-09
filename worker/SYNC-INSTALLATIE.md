# Synchronisatie installeren (eenmalig, ±10 minuten)

De synchronisatie gebruikt een kleine **Cloudflare Worker** met **Workers KV** als opslag.
Het gratis abonnement volstaat ruim (100.000 leesacties en 1.000 schrijfacties per dag).

## 1. Account
Maak een gratis account op <https://dash.cloudflare.com/sign-up> (enkel e-mail en wachtwoord, geen betaalgegevens nodig).

## 2. Aanmelden vanop je pc
In deze map (`worker/`), in een terminal:
```
npx wrangler login
```
Er opent een browservenster: meld aan en klik op *Allow*.

## 3. Opslag aanmaken
```
npx wrangler kv namespace create SYNC
```
Kopieer de `id` uit het antwoord naar `wrangler.toml` (in plaats van `VUL-IN-NA-STAP-3`).

## 4. Online zetten
```
npx wrangler deploy
```
Het antwoord toont het adres, bv. `https://oefentoetsen-sync.<jouw-naam>.workers.dev`.
Controle: dat adres openen in de browser toont `oefentoetsen-sync ok`.

## 5. Aanzetten in de site
Zet dat adres in `js/config.js` bij `syncUrl`, verhoog `?v=` in `index.html` en publiceer.
Daarna verschijnt in ⚙️ Instellingen het blok **Toestellen koppelen**.

## Gebruik
- Op het eerste toestel: *Nieuwe synccode maken*.
- Op elk ander toestel: scan de QR-code, open de link, of geef de code in bij *Ik heb al een code*.
- Daarna gaat alles vanzelf: na elke oefensessie en bij het openen van de app.

## Privacy en veiligheid
- De gegevens worden in de browser versleuteld (AES-GCM, sleutel afgeleid uit de code). De server ziet
  enkel een willekeurig id en een versleuteld pakket: geen namen, scores of antwoorden.
- Wie de code kent, kan de gegevens lezen en aanpassen: deel hem enkel binnen het gezin.
  Code kwijt of gelekt? *Ontkoppel* alle toestellen en maak een nieuwe code.
- Pakketten die 400 dagen niet gebruikt worden, verdwijnen automatisch.
