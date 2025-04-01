// Cosmos DB:n yhteysmääritykset
const endpoint = "https://vuosikello-db.documents.azure.com:443/";
const key = process.env.REACT_APP_COSMOS_DB_KEY || "";
const databaseId = "vuosikello-db";

// Containerien konfigurointi
const containers = [
  { id: "projects", partitionKey: "/id" },
  { id: "events", partitionKey: "/projectId" },
  { id: "categories", partitionKey: "/projectId" },
  { id: "reminders", partitionKey: "/eventId" }
];

// Tarkistetaan ollaanko selainympäristössä
const isBrowser = typeof window !== 'undefined';

// Mock-data paikalliseen käyttöön selaimessa
let localData = {
  projects: [],
  events: [],
  categories: [],
  reminders: []
};

// Haetaan mahdollisesti jo tallennettu data local storagesta
if (isBrowser) {
  try {
    const savedData = localStorage.getItem('vuosikelloData');
    if (savedData) {
      localData = JSON.parse(savedData);
    }
  } catch (error) {
    console.warn("Local storage ei ole käytettävissä:", error);
  }
}

// Jos ollaan selaimessa ja avainta ei ole määritelty, käytetään mock-toteutuksia
const isCosmosAvailable = !isBrowser || (key && key.length > 0);

let client;
if (isCosmosAvailable) {
  const { CosmosClient } = require("@azure/cosmos");
  client = new CosmosClient({ endpoint, key });
}

/**
 * Alustaa Cosmos DB:n luomalla tietokannan ja containerit jos niitä ei ole olemassa
 * @returns {Promise<void>}
 */
async function initializeCosmosDB() {
  try {
    console.log("Alustetaan Cosmos DB...");
    
    // Jos Cosmos DB ei ole käytettävissä, käytetään paikallista toteutusta
    if (!isCosmosAvailable) {
      console.log("Cosmos DB ei ole käytettävissä, käytetään paikallista tallennusta.");
      // Varmistetaan että oletusdataa on olemassa
      if (localData.projects.length === 0) {
        localData.projects = [
          { id: "1", name: "Markkinointiprojekti 2025", description: "Markkinoinnin vuosisuunnitelma ja tapahtumat" },
          { id: "2", name: "Tuotekehitys Q1-Q2/2025", description: "Tuotekehityksen aikataulu ja virstanpylväät" },
          { id: "3", name: "Henkilöstöhallinto 2025", description: "HR-tapahtumat ja koulutukset" },
          { id: "4", name: "Myyntistrategia 2025", description: "Myynnin tapahtumat ja tavoitteet" },
          { id: "5", name: "IT-infrastruktuuri 2025", description: "IT-järjestelmien päivitykset ja huollot" }
        ];
        saveToLocalStorage();
      }
      return;
    }

    // Cosmos DB -toteutus
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

// Tallentaa datan local storageen
function saveToLocalStorage() {
  if (isBrowser) {
    try {
      localStorage.setItem('vuosikelloData', JSON.stringify(localData));
    } catch (error) {
      console.warn("Virhe tallennettaessa local storageen:", error);
    }
  }
}

// Hakee projektit tietokannasta
async function getProjects() {
  try {
    // Jos Cosmos DB ei ole käytettävissä, käytetään paikallista toteutusta
    if (!isCosmosAvailable) {
      return localData.projects;
    }

    // Cosmos DB -toteutus
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
    // Jos Cosmos DB ei ole käytettävissä, käytetään paikallista toteutusta
    if (!isCosmosAvailable) {
      localData.projects = projects;
      saveToLocalStorage();
      return projects;
    }

    // Cosmos DB -toteutus
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
    // Jos Cosmos DB ei ole käytettävissä, käytetään paikallista toteutusta
    if (!isCosmosAvailable) {
      return localData.reminders;
    }

    // Cosmos DB -toteutus
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
    // Jos Cosmos DB ei ole käytettävissä, käytetään paikallista toteutusta
    if (!isCosmosAvailable) {
      localData.reminders = reminders;
      saveToLocalStorage();
      return reminders;
    }

    // Cosmos DB -toteutus
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
    // Jos Cosmos DB ei ole käytettävissä, käytetään paikallista toteutusta
    if (!isCosmosAvailable) {
      localData.reminders.push(reminder);
      saveToLocalStorage();
      return reminder;
    }

    // Cosmos DB -toteutus
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
    // Jos Cosmos DB ei ole käytettävissä, käytetään paikallista toteutusta
    if (!isCosmosAvailable) {
      localData.reminders = localData.reminders.filter(r => r.id !== id || r.eventId !== eventId);
      saveToLocalStorage();
      return;
    }

    // Cosmos DB -toteutus
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