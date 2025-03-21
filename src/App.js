/**
 * Vuosikello - Tapahtumien hallintasovellus
 * 
 * Tämä sovellus mahdollistaa tapahtumien visualisoinnin ja hallinnan vuosikellossa.
 * Käyttäjä voi lisätä, muokata ja poistaa tapahtumia, sekä tarkastella niitä eri
 * näkymissä: vuosikellossa, aikajanalla, kuukausinäkymässä ja listana. Sovellus
 * tukee tapahtumien kategorisointia ja suodattamista.
 * 
 * Sovellus koostuu useista komponenteista, jotka on jaettu omiin tiedostoihinsa
 * modulaarisuuden ja ylläpidettävyyden parantamiseksi.
 */

import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import FilterPanel from "./components/FilterPanel";
import EventModal from "./components/EventModal";
import MonthAgenda from "./components/MonthAgenda";
import Timeline from "./components/Timeline";
import EventEditor from "./components/EventEditor";
import EventForm from "./components/EventForm";
import YearClock from "./components/YearClock";
import AppTabs from "./components/AppTabs";
import SidePanel from "./components/SidePanel";
import ProjectSelector from "./components/ProjectSelector";
import { styles } from "./styles";
import { startReminderCheck } from "./services/reminderService";
import { 
  getProjectEvents, 
  saveProjectEvents, 
  getProjectCategories, 
  saveProjectCategories
} from "./services/cosmosDbService";

// Määritellään kategorioiden värit globaalisti
const categoryColors = {
  "Markkinointi": "#1f77b4", // tummansininen - värisokeusystävällinen
  "Talous": "#ff7f0e", // oranssi - värisokeusystävällinen
  "Henkilöstöhallinto": "#2ca02c", // vihreä - värisokeusystävällinen
  "Yhteiset tapahtumat": "#d62728" // punainen - värisokeusystävällinen
};

// Muutetaan categoryColors objektista tilaksi, jotta sitä voidaan päivittää
const App = () => {
  // Käytetäänkö projektivalitsijaa
  const [showProjectSelector, setShowProjectSelector] = useState(true);
  
  // Valittu projekti
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Valittu kuukausi kuukausinäkymää varten
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  // Valittu tapahtuma
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSearchEvent, setSelectedSearchEvent] = useState(null);
  
  // Nykyinen näkymä
  const [currentView, setCurrentView] = useState("vuosikello");
  
  // Näytetäänkö tapahtuman tiedot
  const [showEventDetails, setShowEventDetails] = useState(false);
  
  // Näytetäänkö tapahtuman lisäyslomake
  const [showEventForm, setShowEventForm] = useState(false);
  
  // Tapahtumat ja kategoriat
  const [events, setEvents] = useState([]);
  
  // Kuukausien nimet suomeksi
  const monthNames = ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];
  
  // Näytetään vain valittujen kategorioiden tapahtumat
  const [selectedCategories, setSelectedCategories] = useState(null);
  
  // Tapahtumien suodatus
  const [visibleEvents, setVisibleEvents] = useState([]);

  // Määritellään väripaletti uusille kategorioille - värisokeusystävällinen
  const colorPalette = [
    "#1f77b4", // tummansininen
    "#ff7f0e", // oranssi
    "#2ca02c", // vihreä
    "#d62728", // punainen
    "#9467bd", // violetti
    "#8c564b", // ruskea
    "#e377c2", // pinkki
    "#7f7f7f", // harmaa
    "#bcbd22", // oliivinvihreä
    "#17becf", // syaani
    "#aec7e8", // vaaleansininen
    "#ffbb78", // vaaleanoranssi
    "#98df8a", // vaaleanvihreä
    "#ff9896", // vaaleanpunainen
    "#c5b0d5"  // vaaleanvioletti
  ];

  // Kategorioiden värit tilana - käytetään värisokeusystävällisiä värejä
  const [categoryColors, setCategoryColors] = useState({
    "Markkinointi": "#1f77b4", // tummansininen - värisokeusystävällinen
    "Talous": "#ff7f0e", // oranssi - värisokeusystävällinen
    "Henkilöstöhallinto": "#2ca02c", // vihreä - värisokeusystävällinen
    "Yhteiset tapahtumat": "#d62728" // punainen - värisokeusystävällinen
  });

  // Päivitetään kategorioiden hallintaa
  const updateCategories = (newCategories) => {
    // Tarkistetaan, onko uusia kategorioita
    const newCategoryColors = {...categoryColors};
    let colorIndex = Object.keys(categoryColors).length;
    
    newCategories.forEach(category => {
      if (!newCategoryColors[category]) {
        // Määritellään uusi väri kategorialle
        newCategoryColors[category] = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;
      }
    });
    
    // Päivitetään tilat
    setCategories(newCategories);
    setCategoryColors(newCategoryColors);
    
    // Tallennetaan kategoriat projektikohtaisesti local storageen
    if (selectedProject) {
      // Päivitetään projektin kategoriat
      const updatedProject = {
        ...selectedProject,
        categories: newCategories
      };
      
      // Päivitetään valittu projekti
      setSelectedProject(updatedProject);
      
      // Tallennetaan päivitetty projekti local storageen
      localStorage.setItem('selectedProject', JSON.stringify(updatedProject));
      
      // Tallennetaan projektin kategoriat erikseen
      localStorage.setItem(`categories_${selectedProject.id}`, JSON.stringify(newCategories));
    }
  };

  useEffect(() => {
    // Käynnistä muistutusten tarkistus
    startReminderCheck();
  }, []);

  // Lataa tallennettu projekti
  useEffect(() => {
    const loadSelectedProject = async () => {
      try {
        // Jos projekti on jo valittu, ei tehdä mitään
        if (selectedProject) return;
        
        // Tarkistetaan, onko projektia tallennettu sessionStorageen (väliaikainen tallennuspaikka)
        const savedProjectJson = sessionStorage.getItem('selectedProject');
        
        if (savedProjectJson) {
          const project = JSON.parse(savedProjectJson);
          await useSelectedProject(project);
        }
      } catch (error) {
        console.error('Virhe projektin latauksessa:', error);
      }
    };
    
    loadSelectedProject();
  }, []);

  // Valitsee projektin ja lataa sen tapahtumat ja kategoriat
  const useSelectedProject = async (project) => {
    try {
      setSelectedProject(project);
      
      // Tallenna valittu projekti sessionStorageen (väliaikainen tallennuspaikka)
      sessionStorage.setItem('selectedProject', JSON.stringify(project));
      
      // Haetaan projektin tapahtumat
      const projectEvents = await getProjectEvents(project.id);
      
      // Jos tapahtumia löytyy, asetetaan ne käyttöön
      if (projectEvents && projectEvents.length > 0) {
        setEvents(projectEvents);
      } else {
        // Jos tapahtumia ei löydy, alustetaan tyhjä taulukko
        setEvents([]);
      }
      
      // Haetaan projektin kategoriat
      const projectCategories = await getProjectCategories(project.id);
      
      // Jos kategorioita löytyy, asetetaan ne käyttöön
      if (projectCategories && projectCategories.length > 0) {
        setSelectedCategories(new Set(projectCategories));
      } else {
        // Jos kategorioita ei löydy, alustetaan oletuskategoriat
        const defaultCategories = ["Markkinointi", "Talous", "Henkilöstöhallinto", "Yhteiset tapahtumat"];
        await updateProjectCategories(project, defaultCategories);
        setSelectedCategories(new Set(defaultCategories));
      }
      
      // Vaihda näkymä vuosikelloon
      setCurrentView("vuosikello");
      setShowProjectSelector(false);
    } catch (error) {
      console.error('Virhe projektin käyttöönotossa:', error);
    }
  };

  // Päivittää projektin kategoriat
  const updateProjectCategories = async (project, categories) => {
    try {
      // Päivitetään valitut kategoriat sovelluksessa
      setSelectedCategories(new Set(categories));
      
      // Jos projekti on valittu, päivitetään myös projektin kategoriat
      if (project) {
        // Tallennetaan kategoriat tietokantaan
        await saveProjectCategories(project.id, categories);
      }
    } catch (error) {
      console.error('Virhe kategorioiden päivityksessä:', error);
    }
  };

  // Päivittää tapahtuman
  const handleUpdateEvent = async (updatedEvent) => {
    try {
      // Päivitetään tapahtuma tapahtumalistaan
      const updatedEvents = events.map(event => {
        return event.id === updatedEvent.id ? updatedEvent : event;
      });
      
      // Päivitetään tapahtumalista sovelluksessa
      setEvents(updatedEvents);
      
      // Tallennetaan päivitetyt tapahtumat tietokantaan
      await saveProjectEvents(selectedProject.id, updatedEvents);
      
      // Suljetaan tapahtuman tiedot
      setShowEventDetails(false);
    } catch (error) {
      console.error('Virhe tapahtuman päivityksessä:', error);
    }
  };

  // Poistaa tapahtuman
  const handleDeleteEvent = async (eventId) => {
    try {
      // Poistetaan tapahtuma tapahtumalistasta
      const updatedEvents = events.filter(event => event.id !== eventId);
      
      // Päivitetään tapahtumalista sovelluksessa
      setEvents(updatedEvents);
      
      // Tallennetaan päivitetyt tapahtumat tietokantaan
      await saveProjectEvents(selectedProject.id, updatedEvents);
      
      // Suljetaan tapahtuman tiedot
      setShowEventDetails(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Virhe tapahtuman poistossa:', error);
    }
  };

  // Lisää uuden tapahtuman
  const handleAddEvent = async (newEvent) => {
    try {
      // Lisätään tapahtumalle id, jos sitä ei ole
      if (!newEvent.id) {
        newEvent.id = Date.now().toString();
      }
      
      // Lisätään lisäyspäivämäärä tapahtumalle
      newEvent.addedDate = new Date().toISOString();
      
      // Lisätään projektitunniste tapahtumalle
      newEvent.projectId = selectedProject.id;
      
      // Lisätään tapahtuma tapahtumalistaan
      const updatedEvents = [...events, newEvent];
      
      // Päivitetään tapahtumalista sovelluksessa
      setEvents(updatedEvents);
      
      // Tallennetaan päivitetyt tapahtumat tietokantaan
      await saveProjectEvents(selectedProject.id, updatedEvents);
      
      // Suljetaan lomake
      setShowEventForm(false);
    } catch (error) {
      console.error('Virhe tapahtuman lisäyksessä:', error);
    }
  };

  // Kirjautuu ulos projektista
  const handleLogout = () => {
    // Poistetaan valittu projekti sessionStoragesta
    sessionStorage.removeItem('selectedProject');
    
    // Nollataan sovelluksen tila
    setSelectedProject(null);
    setEvents([]);
    setSelectedCategories(null);
    setShowProjectSelector(true);
  };

  // Poistaa projektin
  const handleDeleteProject = async () => {
    if (!window.confirm(`Haluatko varmasti poistaa projektin "${selectedProject.name}"? Tätä toimintoa ei voi peruuttaa.`)) {
      return;
    }
    
    try {
      // Logoutin kautta nollataan sovelluksen tila
      handleLogout();
      
      // HUOM: Projektin ja siihen liittyvien tietojen poisto tehdään cosmosDbService.js-tiedostossa
      // deleteProject-metodissa. Tässä ei tarvitse erikseen poistaa projektin tapahtumia tai kategorioita.
    } catch (error) {
      console.error('Virhe projektin poistossa:', error);
    }
  };

  // Välitettävät propsit
  const commonProps = {
    events: visibleEvents.length > 0 ? visibleEvents : events,
    setEvents,
    selectedProject,
    categories: selectedCategories ? Array.from(selectedCategories) : [],
    categoryColors,
    monthNames
  };

  // Jos näytetään projektivalitsija, piilotetaan varsinainen sovellus
  if (showProjectSelector) {
    return <ProjectSelector onSelectProject={useSelectedProject} />;
  }

  return (
    <div style={styles.appContainer}>
      {/* Yläpalkki */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Vuosikello</h1>
          <div style={styles.headerButtons}>
            <button 
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Vaihda projektia
            </button>
            <button 
              onClick={handleDeleteProject}
              style={styles.deleteButton}
            >
              Poista projekti
            </button>
          </div>
        </div>
        {selectedProject && (
          <div style={styles.projectInfo}>
            <span style={styles.projectName}>{selectedProject.name}</span>
            {selectedProject.description && (
              <span style={styles.projectDescription}> - {selectedProject.description}</span>
            )}
          </div>
        )}
        <AppTabs 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
        />
      </header>

      {/* Päänäkymä */}
      <div style={styles.mainContent}>
        <div style={styles.mainPanel}>
          {currentView === "vuosikello" && (
            <YearClock 
              {...commonProps}
              selectedCategories={selectedCategories}
              setSelectedMonth={setSelectedMonth}
              setSelectedEvent={setSelectedEvent}
              setShowEventDetails={setShowEventDetails}
            />
          )}
          
          {currentView === "aikajana" && (
            <Timeline 
              {...commonProps}
              selectedCategories={selectedCategories}
            />
          )}
          
          {currentView === "kuukausi" && (
            <MonthAgenda 
              {...commonProps}
              month={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          )}
          
          {currentView === "tapahtumat" && (
            <EventEditor 
              {...commonProps}
              setSelectedEvent={setSelectedEvent}
              setShowEventDetails={setShowEventDetails}
            />
          )}
        </div>
        
        <SidePanel
          {...commonProps}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          updateProjectCategories={(categories) => updateProjectCategories(selectedProject, categories)}
          setShowEventForm={setShowEventForm}
        />
      </div>

      {/* Modaalit */}
      {showEventDetails && selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => setShowEventDetails(false)}
          onUpdate={handleUpdateEvent}
          onDelete={handleDeleteEvent}
          categories={Array.from(selectedCategories || [])}
        />
      )}
      
      {showEventForm && (
        <EventForm 
          onSubmit={handleAddEvent}
          onCancel={() => setShowEventForm(false)}
          categories={Array.from(selectedCategories || [])}
        />
      )}

      {/* Sivupaneeli */}
      <FilterPanel 
        categories={Array.from(selectedCategories || [])}
        events={events} 
        onUpdateVisibleEvents={setVisibleEvents}
        setSelectedEvent={setSelectedEvent}
        selectedSearchEvent={selectedSearchEvent}
        setSelectedSearchEvent={setSelectedSearchEvent}
        selectedProject={selectedProject}
        setEvents={setEvents}
      />
    </div>
  );
};

export default App;
