# Käytä olemassa olevaa resurssiryhmää
data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

# App Service Plan -määritys web-sovellusta varten
resource "azurerm_service_plan" "asp" {
  name                = var.app_service_plan_name
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = var.location
  os_type             = "Linux"
  sku_name            = var.app_service_plan_sku
}

# Linux Web App -määritys (aiemmin Static Web App)
resource "azurerm_linux_web_app" "web" {
  name                = var.web_app_name
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = var.location
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    application_stack {
      node_version = "18-lts"
    }
    always_on = true
  }

  app_settings = {
    COSMOS_DB_ENDPOINT = azurerm_cosmosdb_account.db.endpoint
    COSMOS_DB_KEY      = azurerm_cosmosdb_account.db.primary_key
    COSMOS_DB_DATABASE = azurerm_cosmosdb_sql_database.database.name
    WEBSITE_NODE_DEFAULT_VERSION = "~18"
  }

  tags = {
    environment = "sandbox"
    project     = "vuosikello"
  }

  depends_on = [
    azurerm_cosmosdb_account.db,
    azurerm_cosmosdb_sql_database.database
  ]
}

# Azure Cosmos DB Account (korjattu CORS-asetukset)
resource "azurerm_cosmosdb_account" "db" {
  name                = var.cosmos_db_account_name
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  consistency_policy {
    consistency_level       = "Session"
    max_interval_in_seconds = 5
    max_staleness_prefix    = 100
  }

  geo_location {
    location          = data.azurerm_resource_group.rg.location
    failover_priority = 0
  }

  capabilities {
    name = "EnableServerless"
  }

  # CORS-asetukset Web Appia varten
  cors_rule {
    allowed_origins    = ["*"] # Voidaan päivittää myöhemmin tarkemmaksi
    exposed_headers    = ["*"]
    allowed_headers    = ["*"]
    allowed_methods    = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    max_age_in_seconds = 3600
  }

  tags = {
    environment = "production"
    project     = "vuosikello"
  }
}

# Azure Cosmos DB SQL Database
resource "azurerm_cosmosdb_sql_database" "database" {
  name                = var.cosmos_db_database_name
  resource_group_name = azurerm_cosmosdb_account.db.resource_group_name
  account_name        = azurerm_cosmosdb_account.db.name
}

# Azure Cosmos DB SQL Container for events
resource "azurerm_cosmosdb_sql_container" "events" {
  name                  = "events"
  resource_group_name   = azurerm_cosmosdb_account.db.resource_group_name
  account_name          = azurerm_cosmosdb_account.db.name
  database_name         = azurerm_cosmosdb_sql_database.database.name
  partition_key_path    = "/id"
  partition_key_version = 1
}

# Azure Cosmos DB SQL Container for projects
resource "azurerm_cosmosdb_sql_container" "projects" {
  name                  = "projects"
  resource_group_name   = azurerm_cosmosdb_account.db.resource_group_name
  account_name          = azurerm_cosmosdb_account.db.name
  database_name         = azurerm_cosmosdb_sql_database.database.name
  partition_key_path    = "/id"
  partition_key_version = 1
} 