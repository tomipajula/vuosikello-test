output "static_web_app_url" {
  value       = azurerm_static_site.web.default_host_name
  description = "Static Web App URL"
}

output "static_web_app_api_key" {
  value       = azurerm_static_site.web.api_key
  sensitive   = true
  description = "Static Web App API Key - tarvitaan CI/CD-putkessa"
}

output "cosmos_db_endpoint" {
  value       = azurerm_cosmosdb_account.db.endpoint
  description = "Cosmos DB endpoint URL"
}

output "cosmos_db_primary_key" {
  value       = azurerm_cosmosdb_account.db.primary_key
  sensitive   = true
  description = "Cosmos DB primary key"
}

output "cosmos_db_connection_string" {
  value       = azurerm_cosmosdb_account.db.connection_strings[0]
  sensitive   = true
  description = "Cosmos DB connection string"
} 