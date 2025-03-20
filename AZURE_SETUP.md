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

Nämä asetukset varmistavat, että Azure osaa buildaa ja julkaista vuosikello-sovelluksen oikein. 