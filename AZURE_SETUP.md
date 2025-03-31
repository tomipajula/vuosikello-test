# Azure Static Web Apps -asetukset

Kun määrität Azure Static Web Apps -sovelluksen Azure-portaalissa, käytä seuraavia asetuksia:

## Perusasetukset
- **Resurssiryhmä**: RgVuosikello
- **Nimi**: Vuosikello (tai haluamasi nimi)
- **Hosting-suunnitelma**: Free
- **Azure Functions ja staging-ympäristö**: Ei tarvita

## Lähdekoodi-integraatio
- **Deployment source**: GitHub
- **Organization**: tomipajula
- **Repository**: vuosikello
- **Branch**: master

## Build-asetukset
- **Build presets**: React
- **App location**: `/vuosikello` (vuosikello-kansio)
- **Api location**: _(jätä tyhjäksi)_
- **Output location**: `build`

## Yleisimmät ongelmat ja ratkaisut

### 1. Useita workflow-tiedostoja
Jos repositoriossa on useita Azure Static Web Apps workflow -tiedostoja, poista kaikki paitsi yksi (`azure-static-web-apps.yml`). Katso tarkemmat ohjeet `WORKFLOW_CLEANUP.md`-tiedostosta.

### 2. App location -virhe
Jos saat virheilmoituksen "App Directory Location: '/vuosikello' is invalid", varmista että:
- App location -arvo on `/vuosikello` (Azuressa) tai `vuosikello` (workflow-tiedostossa)
- Workflow-tiedostossa on oikea app_location-arvo (`"vuosikello"`)

### 3. Build-ongelmat
Jos build-prosessi epäonnistuu, varmista että workflow-tiedostossa on määritetty:
```yaml
app_location: "vuosikello"      # React-sovellus on vuosikello-kansiossa
output_location: "build"        # Build-kansion sijainti suhteessa app_location-arvoon
skip_app_build: false           # Buildaa sovellus
```

### 4. Riippuvuusongelmat (Module not found)
Jos törmäät virheilmoitukseen "Module not found: Error: Can't resolve 'd3'":
1. Varmista että d3-kirjasto on lisätty vuosikello/package.json-tiedostoon:
```json
"dependencies": {
  // ... muut riippuvuudet ...
  "d3": "^7.9.0",
  // ... muut riippuvuudet ...
}
```
2. Käytä luotettavampaa npm ci -komentoa npm install -komennon sijaan build-vaiheessa.

### 5. API-avainvirhe
Jos saat virheilmoituksen "No matching Static Web App was found or the api key was invalid":
1. Mene Azure-portaalissa Static Web App -resurssiin
2. Valitse "Manage deployment token"
3. Kopioi token
4. Päivitä GitHub-repositorion salaisuudet (Settings > Secrets > Actions)
5. Lisää/päivitä salaisuus nimeltä `AZURE_STATIC_WEB_APPS_API_TOKEN`

Nämä asetukset varmistavat, että Azure osaa buildaa ja julkaista vuosikello-sovelluksen oikein. 