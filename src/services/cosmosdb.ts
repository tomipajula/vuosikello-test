import { CosmosClient } from "@azure/cosmos";

// Haetaan ympäristömuuttujat
const config = {
    endpoint: process.env.COSMOS_DB_ENDPOINT || '',
    key: process.env.COSMOS_DB_KEY || '',
    databaseName: process.env.COSMOS_DB_NAME || 'vuosikellodb',
    containers: {
        projects: process.env.COSMOS_DB_PROJECTS_CONTAINER || 'projects',
        events: process.env.COSMOS_DB_EVENTS_CONTAINER || 'events'
    }
};

// Luodaan Cosmos DB client
const client = new CosmosClient({
    endpoint: config.endpoint,
    key: config.key
});

// Haetaan tietokanta ja containerit
const database = client.database(config.databaseName);
const projectsContainer = database.container(config.containers.projects);
const eventsContainer = database.container(config.containers.events);

// Projektien CRUD-operaatiot
export const projectsService = {
    getAll: async () => {
        const { resources } = await projectsContainer.items.readAll().fetchAll();
        return resources;
    },
    
    getById: async (id: string) => {
        const { resource } = await projectsContainer.item(id, id).read();
        return resource;
    },
    
    create: async (project: any) => {
        const { resource } = await projectsContainer.items.create(project);
        return resource;
    },
    
    update: async (id: string, project: any) => {
        const { resource } = await projectsContainer.item(id, id).replace(project);
        return resource;
    },
    
    delete: async (id: string) => {
        await projectsContainer.item(id, id).delete();
    }
};

// Tapahtumien CRUD-operaatiot
export const eventsService = {
    getAll: async () => {
        const { resources } = await eventsContainer.items.readAll().fetchAll();
        return resources;
    },
    
    getByProjectId: async (projectId: string) => {
        const querySpec = {
            query: "SELECT * FROM c WHERE c.projectId = @projectId",
            parameters: [{ name: "@projectId", value: projectId }]
        };
        const { resources } = await eventsContainer.items.query(querySpec).fetchAll();
        return resources;
    },
    
    create: async (event: any) => {
        const { resource } = await eventsContainer.items.create(event);
        return resource;
    },
    
    update: async (id: string, event: any) => {
        const { resource } = await eventsContainer.item(id, id).replace(event);
        return resource;
    },
    
    delete: async (id: string) => {
        await eventsContainer.item(id, id).delete();
    }
}; 