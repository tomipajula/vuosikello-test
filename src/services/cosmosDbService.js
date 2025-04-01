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

// Hakee projektit tietokannasta
async function getProjects() {
  try {
    const database = client.database(databaseId);
    const container = database.container("projects");
    const { resources } = await container.items.readAll().fetchAll();
    return resources;
  } catch (error) {
    console.error("Virhe projektien haussa:", error);
    throw error;
  }
}

// Tallentaa projektit tietokantaan
async function saveProjects(projects) {
  try {
    const database = client.database(databaseId);
    const container = database.container("projects");
    
    // Tallennetaan jokainen projekti
    const savedProjects = [];
    for (const project of projects) {
      const { resource } = await container.items.upsert(project);
      savedProjects.push(resource);
    }
    
    return savedProjects;
  } catch (error) {
    console.error("Virhe projektien tallennuksessa:", error);
    throw error;
  }
}

// Hakee muistutukset tietokannasta
async function getReminders() {
  try {
    const database = client.database(databaseId);
    const container = database.container("reminders");
    const { resources } = await container.items.readAll().fetchAll();
    return resources;
  } catch (error) {
    console.error("Virhe muistutusten haussa:", error);
    throw error;
  }
}

// Tallentaa muistutukset tietokantaan
async function saveReminders(reminders) {
  try {
    const database = client.database(databaseId);
    const container = database.container("reminders");
    
    // Tallennetaan jokainen muistutus
    const savedReminders = [];
    for (const reminder of reminders) {
      const { resource } = await container.items.upsert(reminder);
      savedReminders.push(resource);
    }
    
    return savedReminders;
  } catch (error) {
    console.error("Virhe muistutusten tallennuksessa:", error);
    throw error;
  }
}

// Lisää uuden muistutuksen
async function addReminder(reminder) {
  try {
    const database = client.database(databaseId);
    const container = database.container("reminders");
    const { resource } = await container.items.create(reminder);
    return resource;
  } catch (error) {
    console.error("Virhe muistutuksen lisäyksessä:", error);
    throw error;
  }
}

// Poistaa muistutuksen
async function deleteReminder(id, eventId) {
  try {
    const database = client.database(databaseId);
    const container = database.container("reminders");
    await container.item(id, eventId).delete();
  } catch (error) {
    console.error("Virhe muistutuksen poistossa:", error);
    throw error;
  }
}

// Vientimäärittelyt
module.exports = {
  initializeCosmosDb: initializeCosmosDB,
  getProjects,
  saveProjects,
  getReminders,
  saveReminders,
  addReminder,
  deleteReminder
}; 