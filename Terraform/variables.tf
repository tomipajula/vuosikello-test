variable "resource_group_name" {
  description = "Resurssiryhmän nimi"
  type        = string
  default     = "RgVuosikello"  # Oletusarvo AZURE_SETUP.md tiedoston perusteella
}

variable "location" {
  description = "Azure-palveluiden sijainti"
  type        = string
  default     = "westeurope"
}

variable "web_app_name" {
  description = "Azure Web App -palvelun nimi"
  type        = string
  default     = "Vuosikello"
}

variable "app_service_plan_name" {
  description = "App Service Plan -palvelun nimi"
  type        = string
  default     = "VuosikelloASP"
}

variable "app_service_plan_sku" {
  description = "App Service Plan SKU"
  type        = string
  default     = "B1"
}

variable "app_location" {
  description = "Sovelluskoodin polku"
  type        = string
  default     = "vuosikello"
}

variable "output_location" {
  description = "Buildatun sovelluksen polku"
  type        = string
  default     = "build"
}

variable "api_location" {
  description = "API:n polku"
  type        = string
  default     = ""
}

variable "cosmos_db_account_name" {
  description = "Azure Cosmos DB tilin nimi"
  type        = string
  default     = "vuosikello-cosmos"
}

variable "cosmos_db_database_name" {
  description = "Azure Cosmos DB tietokannan nimi"
  type        = string
  default     = "vuosikellodb"
} 