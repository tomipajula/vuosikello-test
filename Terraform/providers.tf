terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "= 3.96.0"
    }
  }
  
  required_version = ">= 1.0.0"

  backend "azurerm" {
    # The actual backend configuration will be provided via -backend-config flags
  }
}

provider "azurerm" {
  features {}
  skip_provider_registration = true
}