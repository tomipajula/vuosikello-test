# Azure Web App & Terraform -käyttöönotto

Tämä dokumentti sisältää ohjeet Vuosikello-sovelluksen käyttöönottoon Azure-ympäristössä sekä manuaalisesti että automaattisesti Terraformin ja Azure DevOps -pipelineiden avulla.

## Vaihtoehto 1: Automaattinen käyttöönotto Terraformilla ja Azure DevOps -pipelinella

Suositeltava tapa ottaa sovellus käyttöön on Azure DevOps -pipeline, joka käyttää Terraformia infrastruktuurin hallintaan.

### Vaatimukset
- Azure DevOps -projekti
- Azure-tilaus 
- Olemassa oleva resurssiryhmä: RgVuosikello
- Azure Storage Account Terraform-tilan säilyttämiseen

### Käyttöönotto
1. Luo Service Connection Azure DevOpsiin Azure-tilaukseen
2. Määritä pipeline-muuttujat:
   - Käytä variable group -ryhmää nimeltä `VuosikelloVariables`
   - Tärkeimmät muuttujat on määritetty tiedostossa `pipelines/terraform/templates/template-variables.yml`
3. Suorita pipeline `pipelines/terraform/pipeline.yml`

## Vaihtoehto 2: Manuaalinen käyttöönotto Terraformilla

Voit käyttää Terraformia suoraan paikallisesta ympäristöstä.

### Vaatimukset
- [Terraform](https://www.terraform.io/downloads.html) (versio >= 1.11.0)
- [Azure CLI](https://docs.microsoft.com/fi-fi/cli/azure/install-azure-cli)
- Kirjautuminen Azure-tiliin (`az login`)

### Käyttöönotto
1. Siirry Terraform-hakemistoon: `cd Terraform/`
2. Alusta Terraform-ympäristö:
   ```bash
   terraform init -backend-config="resource_group_name=RgVuosikello" \
     -backend-config="storage_account_name=sa01a132827b4e10sandbox" \
     -backend-config="container_name=tfstate" \
     -backend-config="key=terraform.tfstate" \
     -backend-config="use_azuread_auth=true"
   ```
3. Luo Terraform-suunnitelma: `terraform plan -out=tfplan`
4. Suorita suunnitelma: `terraform apply tfplan`

Katso tarkemmat ohjeet tiedostosta `Terraform/README.terraform.md`.

## Vaihtoehto 3: Manuaalinen käyttöönotto Azure-portaalissa

Jos haluat määrittää sovelluksen manuaalisesti Azure-portaalissa, käytä seuraavia asetuksia:

### 1. App Service Plan -luonti
- **Resurssiryhmä**: RgVuosikello
- **Nimi**: VuosikelloASP (tai haluamasi nimi)
- **Käyttöjärjestelmä**: Linux
- **Hintataso**: B1 tai korkeampi tuotantoympäristöön
- **Sijainti**: West Europe

### 2. Web App -luonti
- **Resurssiryhmä**: RgVuosikello
- **Nimi**: Vuosikello (tai haluamasi nimi)
- **App Service Plan**: Valitse aiemmin luotu plan
- **Runtime stack**: Node 18 LTS
- **Sijainti**: West Europe (sama kuin App Service Planilla)

### 3. Cosmos DB -luonti
- **Resurssiryhmä**: RgVuosikello
- **Tili**: vuosikello-cosmos (tai haluamasi nimi)
- **API**: Core (SQL)
- **Tietokantatyyppi**: serverless
- **Tietokanta**: vuosikellodb
- **Containerit**:
  - events (partition key: /id)
  - projects (partition key: /id)

### 4. App Settings Web Appiin
Lisää seuraavat sovellusasetukset Web Appiin:
- **COSMOS_DB_ENDPOINT**: Cosmos DB -tilin endpoint URL
- **COSMOS_DB_KEY**: Cosmos DB -tilin primary key
- **COSMOS_DB_DATABASE**: Cosmos DB -tietokannan nimi (esim. "vuosikellodb")

## Yleisimmät ongelmat ja ratkaisut

### 1. Web App -deployaus
Jos sovelluksen deployaus epäonnistuu, varmista että:
- Web.config-tiedosto on olemassa ja konfiguroitu oikein
- App Service on määritetty käyttämään Node.js 18 LTS -versiota
- Sovellus on buildattu ennen deployausta: `npm run build`

### 2. Terraform-tilan tallennus
Jos Azure AD -autentikointi ei toimi, voit käyttää access key -autentikointia:
```bash
terraform init -backend-config="access_key=STORAGE_ACCOUNT_ACCESS_KEY" ...
```

### 3. CORS-ongelmat
Jos kohtaat CORS-ongelmia sovelluksessa:
- Varmista että Cosmos DB:n CORS-asetukset sallivat pyynnöt Web Appista
- Tarkista että Azure Web Appin CORS-asetukset ovat kunnossa

### 4. 404-virheet sovelluksessa
Jos sovellus antaa 404-virheitä reitityksessä:
- Varmista että web.config-tiedosto on määritetty oikein ohjaamaan kaikki pyynnöt juureen (SPA-sovellus)
- Tarkista että URL Rewrite -moduuli on käytössä App Servicessä

### 5. Sykliset riippuvuudet Terraformissa
Jos Terraform valittaa syklisistä riippuvuuksista, käytä `depends_on`-määrittelyä krittisissä resursseissa.

Nämä asetukset varmistavat, että Azure osaa buildaa ja julkaista vuosikello-sovelluksen oikein. 