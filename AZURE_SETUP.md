# Azure Static Web Apps -asetukset

Kun määrität Azure Static Web Apps -sovelluksen Azure-portaalissa, käytä seuraavia asetuksia:

## Perusasetukset
- **Resurssiryhmä**: RgTomiP
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
- **App location**: `/` (juurihakemisto)
- **Api location**: _(jätä tyhjäksi)_
- **Output location**: `build`

## Yleisimmät ongelmat ja ratkaisut

### 1. Useita workflow-tiedostoja
Jos repositoriossa on useita Azure Static Web Apps workflow -tiedostoja, poista kaikki paitsi yksi (`azure-static-web-apps.yml`). Katso tarkemmat ohjeet `WORKFLOW_CLEANUP.md`-tiedostosta.

### 2. App location -virhe
Jos saat virheilmoituksen "App Directory Location: '/vuosikello' is invalid", varmista että:
- App location -arvo on `/` (yksittäinen kauttaviiva)
- Workflow-tiedostossa on oikea app_location-arvo (`"/"`)

### 3. Build-ongelmat
Jos build-prosessi epäonnistuu, varmista että workflow-tiedostossa on määritetty:
```yaml
app_build_command: "npm install && npm run build"
```

### 4. API-avainvirhe
Jos saat virheilmoituksen "No matching Static Web App was found or the api key was invalid":
1. Mene Azure-portaalissa Static Web App -resurssiin
2. Valitse "Manage deployment token"
3. Kopioi token
4. Päivitä GitHub-repositorion salaisuudet (Settings > Secrets > Actions)
5. Lisää/päivitä salaisuus nimeltä `AZURE_STATIC_WEB_APPS_API_TOKEN`

Nämä asetukset varmistavat, että Azure osaa buildaa ja julkaista vuosikello-sovelluksen oikein. 