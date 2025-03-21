import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeCosmosDb } from './services/cosmosDbService';

// Alustetaan Cosmos DB -yhteys
(async () => {
  try {
    await initializeCosmosDb();
    console.log("Cosmos DB -yhteys alustettu onnistuneesti");
  } catch (error) {
    console.error("Virhe Cosmos DB:n alustuksessa:", error);
  }
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
