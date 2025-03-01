import React from 'react';

/**
 * AppTabs - Sovelluksen välilehtien hallintakomponentti
 * 
 * Tämä komponentti näyttää sovelluksen päävälilehdet (Vuosikello, Lisää tapahtuma, 
 * Aikajana, Muokkaa tapahtumia) ja hallitsee aktiivisen välilehden vaihtamista.
 * Komponentti saa activeTab ja setActiveTab -propsit, joiden avulla se kommunikoi
 * päätilan kanssa.
 */

const AppTabs = ({ activeTab, setActiveTab }) => {
  const tabStyle = (tabName) => ({
    padding: "12px 24px",
    backgroundColor: activeTab === tabName ? "white" : "#f0f0f0",
    border: "none",
    borderRadius: "8px 8px 0 0",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: activeTab === tabName ? "600" : "normal",
    color: activeTab === tabName ? "#333" : "#666"
  });

  return (
    <div style={{
      display: "flex",
      gap: "2px",
      padding: "20px 20px 0",
      justifyContent: "center"
    }}>
      <button
        onClick={() => setActiveTab("vuosikello")}
        style={tabStyle("vuosikello")}
      >
        Vuosikello
      </button>
      <button
        onClick={() => setActiveTab("lisaa")}
        style={tabStyle("lisaa")}
      >
        Lisää tapahtuma
      </button>
      <button
        onClick={() => setActiveTab("aikajana")}
        style={tabStyle("aikajana")}
      >
        Aikajana
      </button>
      <button
        onClick={() => setActiveTab("muokkaa")}
        style={tabStyle("muokkaa")}
      >
        Muokkaa tapahtumia
      </button>
    </div>
  );
};

export default AppTabs; 