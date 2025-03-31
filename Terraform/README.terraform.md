# Vuosikello - Terraform-ympäristön käyttöönotto

Tämä dokumentti sisältää ohjeet Vuosikello-sovelluksen Azure-ympäristön pystyttämiseen Terraformin avulla. Infrastruktuuri käyttää olemassa olevaa RgVuosikello-resurssiryhmää.

## Vaatimukset

- [Terraform](https://www.terraform.io/downloads.html) (versio >= 1.0.0)
- [Azure CLI](https://docs.microsoft.com/fi-fi/cli/azure/install-azure-cli)
- Azure-tili ja riittävät oikeudet resurssien luomiseen
- Olemassa oleva resurssiryhmä RgVuosikello

## Azure-tilin määrittäminen

1. Kirjaudu Azure CLI:n kautta:

```bash
az login
```

2. (Valinnainen) Aseta käytettävä tilaus:

```bash
az account set --subscription "Tilauksesi nimi tai ID"
```

3. Varmista, että resurssiryhmä RgVuosikello on olemassa:

```bash
az group show --name RgVuosikello
```

## Terraform-tilan tallennus

Suosittelemme käyttämään Azuren Storage Account -palvelua Terraform-tilan tallentamiseen:

1. Luo resurssiryjmä Terraform-tilaa varten (voit käyttää myös olemassa olevaa RgVuosikello-ryhmää):

```bash
az group create --name TF-STATE-RG --location westeurope
```

2. Luo Storage Account:

```bash
az storage account create --name tfstatevuosikello --resource-group TF-STATE-RG --sku Standard_LRS --encryption-services blob
```

3. Luo container:

```bash
az storage container create --name tfstate --account-name tfstatevuosikello
```

4. Luo `backend_config.tfvars` tiedosto:

```
resource_group_name  = "TF-STATE-RG"
storage_account_name = "tfstatevuosikello"
container_name       = "tfstate"
key                  = "vuosikello.tfstate"
```

## Ympäristön pystyttäminen

1. Kopioi `terraform.tfvars.example` uudeksi tiedostoksi `terraform.tfvars` ja muokkaa arvot tarpeen mukaan.

2. Alusta Terraform:

```bash
terraform init -backend-config=backend_config.tfvars
```

3. Tarkista, mitä muutoksia Terraform aikoo tehdä:

```bash
terraform plan
```

4. Toteuta muutokset:

```bash
terraform apply
```

5. Vahvista muutokset kirjoittamalla `yes`, kun Terraform sitä pyytää.

## Ympäristön poistaminen

Kun et enää tarvitse ympäristöä, voit poistaa kaikki resurssit (huomaa, että tämä ei poista RgVuosikello-resurssiryhmää):

```bash
terraform destroy
```

## Azure DevOps -integraatio

Tässä projektissa on määritelty `azure-pipelines.yml` tiedosto, joka mahdollistaa infrastruktuurin automaattisen käyttöönoton Azure DevOps -palvelun kautta.

Pipeline-määrityksen käyttöönotto:

1. Luo uusi Pipeline Azure DevOpsissa valitsemalla "New pipeline" ja valitse GitHub-lähteeksi tämä repositorio.
2. Azure DevOps tunnistaa automaattisesti YAML-tiedoston ja tuo sen käyttöön.
3. Määritä seuraavat pipeline-muuttujat:
   - `TF_STATE_RG`: Terraform-tilan resurssiryhmän nimi (esim. "TF-STATE-RG")
   - `TF_STATE_STORAGE_ACCOUNT`: Storage Accountin nimi (esim. "tfstatevuosikello")
   - `TF_STATE_CONTAINER`: Container-nimi (esim. "tfstate")
4. Luo Service Connection Azureen:
   - Mene Project Settings > Service connections
   - Valitse "New service connection" > "Azure Resource Manager"
   - Nimeä yhteys nimellä "AzureServiceConnection"
5. Tallenna ja suorita pipeline.

## Tuotetut resurssit

Terraform-konfiguraatio luo seuraavat resurssit olemassa olevaan RgVuosikello-resurssiryhmään:

1. Azure Static Web App
2. Azure Cosmos DB Account
3. Azure Cosmos DB SQL Database
4. Azure Cosmos DB Containers (events, projects)

## Tärkeät ulostulot

Terraformin suorittamisen jälkeen saat seuraavat ulostulot:

- `static_web_app_url`: Azure Static Web App URL
- `static_web_app_api_key`: Käyttöönottoavain (tarvitaan CI/CD-putkessa)
- `cosmos_db_endpoint`: Cosmos DB:n endpoint
- `cosmos_db_primary_key`: Cosmos DB:n pääavain
- `cosmos_db_connection_string`: Cosmos DB:n yhteysmerkkijono

Voit tarkastella ulostuloja komennolla:

```bash
terraform output
```

> **Huom!** Arkaluontoisten arvojen tarkastelu:
> ```bash
> terraform output -json static_web_app_api_key
> ``` 