// Cosmos DB:n yhteysmääritykset
const endpoint = "https://vuosikello-db.documents.azure.com:443/";
const key = process.env.COSMOS_DB_KEY || "placeholder-key";
const databaseId = "vuosikello-db";

// Containerien konfigurointi
const containers = [
  { id: "projects", partitionKey: "/id" },
  { id: "events", partitionKey: "/projectId" },
  { id: "categories", partitionKey: "/projectId" },
  { id: "reminders", partitionKey: "/eventId" }
];

const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient({ endpoint, key });

/**
 * Alustaa Cosmos DB:n luomalla tietokannan ja containerit jos niitä ei ole olemassa
 * @returns {Promise<void>}
 */
async function initializeCosmosDB() {
  try {
    console.log("Alustetaan Cosmos DB...");
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    console.log(`Tietokanta '${databaseId}' varmistettu`);

    for (const containerConfig of containers) {
      const { id, partitionKey } = containerConfig;
      const { container } = await database.containers.createIfNotExists({
        id,
        partitionKeyPath: partitionKey
      });
      console.log(`Container '${id}' varmistettu`);
    }

    console.log("Cosmos DB alustettu onnistuneesti");
  } catch (error) {
    console.error("Virhe Cosmos DB:n alustuksessa:", error);
    throw error;
  }
}

// Muut funktiot tässä... 