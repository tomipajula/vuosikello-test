# Vuosikello

Vuosikello on sovellus, jolla voit helposti visualisoida ja hallita projektien aikatauluja vuosikalenterin avulla.

## Ominaisuudet

- Selkeä vuosikalenterinäkymä
- Projektien ja tapahtumien lisäys, muokkaus ja poisto
- Tapahtumien kategorisointi ja värikoodaus
- Hakutoiminto tapahtumien ja projektien löytämiseen
- Responsiivinen käyttöliittymä mobiili- ja työpöytäkäyttöön

## Tekninen toteutus

### Frontend
- React
- TypeScript
- Material-UI
- React Router
- React Query
- Axios

### Backend
- Azure Web App (React-sovelluksen hosting)
- Azure Cosmos DB (NoSQL-tietokanta)
- Azure Functions (serverless API)

### Infrastruktuuri
- Infrastruktuuri: Azure Web Apps, Terraform, Azure DevOps Pipelines
- CI/CD: Azure DevOps Pipelines

## Arkkitehtuuri

Sovellus käyttää seuraavia Azure-palveluita:

1. **Frontend**:
   - Azure Web App (React-sovelluksen hosting)

2. **Backend**:
   - Azure Cosmos DB (NoSQL-tietokanta datan tallentamiseen)
   - REST API-rajapinta Cosmos DB:hen

## Käyttöönotto

Järjestelmän käyttöönotto koostuu kahdesta vaiheesta:

1. Infrastruktuurin rakentaminen Terraformilla (Azure Web App, Cosmos DB)
2. Sovelluksen rakentamisen ja julkaisun Web App -palveluun

### Vaatimukset

- Node.js (vähintään versio 14)
- Azure-tilaus

Katso ohjeet Azure Web App -käyttöönottoon ja yleisimpien ongelmien ratkaisuun [Azure-dokumentaatiosta](./AZURE_SETUP.md).

## Kehitys

### Paikallinen kehitysympäristö

1. Kloonaa repositorio
2. Asenna riippuvuudet: `npm install`
3. Käynnistä kehityspalvelin: `npm start`
4. Avaa selaimessa: `http://localhost:3000`

### Huomioitavaa

- Ympäristömuuttujat konfiguroidaan Azure Web App -palvelussa
- Azure Cosmos DB -yhteys määritetään Azure Web Appin App Settings -asetuksissa

## Kansiorakenne

- `/public` - Staattiset tiedostot
- `/src` - Lähdekoodit
  - `/components` - React-komponentit
  - `/pages` - Sovelluksen päänäkymät
  - `/services` - API-kutsut ja tiedonkäsittely
  - `/utils` - Apufunktiot
  - `/hooks` - React custom hookit
  - `/types` - TypeScript-tyyppimäärittelyt
- `/Terraform` - Infrastruktuuri koodina (Terraform)
- `/pipelines` - Azure DevOps -pipelineiden määrittelyt

## Huomioitavaa

- Sovellus käyttää Azure Cosmos DB:tä tietojen tallentamiseen
- Ympäristömuuttujat konfiguroidaan Azure Web App -palvelussa
- Salaisuudet kuten API-avaimet haetaan ympäristömuuttujista, ei kovakoodattuna

    Test
