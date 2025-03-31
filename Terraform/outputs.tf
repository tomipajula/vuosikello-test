output "web_app_url" {
  value       = "https://${azurerm_linux_web_app.web.default_hostname}"
  description = "Web App URL"
}

output "web_app_name" {
  value       = azurerm_linux_web_app.web.name
  description = "Web App -palvelun nimi"
}

output "app_service_plan_id" {
  value       = azurerm_service_plan.asp.id
  description = "App Service Plan ID"
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