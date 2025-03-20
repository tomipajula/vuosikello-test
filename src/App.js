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

// Määritellään kategorioiden värit globaalisti
const categoryColors = {
  "Markkinointi": "#1f77b4", // tummansininen - värisokeusystävällinen
  "Talous": "#ff7f0e", // oranssi - värisokeusystävällinen
  "Henkilöstöhallinto": "#2ca02c", // vihreä - värisokeusystävällinen
  "Yhteiset tapahtumat": "#d62728" // punainen - värisokeusystävällinen
};

// Muutetaan categoryColors objektista tilaksi, jotta sitä voidaan päivittää
const App = () => {
  // Projektin valinta - haetaan local storagesta jos saatavilla
  const [selectedProject, setSelectedProject] = useState(() => {
    const savedProject = localStorage.getItem('selectedProject');
    return savedProject ? JSON.parse(savedProject) : null;
  });
  
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

  // Tapahtumat
  const [events, setEvents] = useState([
    {
      id: "1",
      startDate: "2025-01-01",
      endDate: "2025-01-10",
      category: "Markkinointi",
      name: "Tammikuun ale",
      details: "Alennusmyynti alkaa.",
      addedDate: "2025-01-01T08:00:00.000Z"
    },
    {
      id: "2",
      startDate: "2025-07-01",
      endDate: "2025-07-15",
      category: "Markkinointi",
      name: "Kesäkampanja",
      details: "Kesäale käynnissä.",
      addedDate: "2025-01-02T08:00:00.000Z"
    },
    {
      id: "3",
      startDate: "2025-11-29",
      endDate: "2025-11-30",
      category: "Markkinointi",
      name: "Black Friday",
      details: "Vuoden suurin alepäivä.",
      addedDate: "2025-01-03T08:00:00.000Z"
    },
    {
      id: "4",
      startDate: "2025-03-15",
      endDate: "2025-03-30",
      category: "Talous",
      name: "Budjetointi",
      details: "Kvartaalin budjetointi",
      addedDate: "2025-01-04T08:00:00.000Z"
    },
    {
      id: "5",
      startDate: "2025-06-15",
      endDate: "2025-06-30",
      category: "Talous",
      name: "Puolivuotiskatsaus",
      details: "Talouden puolivuotiskatsaus",
      addedDate: "2025-01-05T08:00:00.000Z"
    },
    {
      id: "6",
      startDate: "2025-02-01",
      endDate: "2025-02-15",
      category: "Henkilöstöhallinto",
      name: "Kehityskeskustelut",
      details: "Vuosittaiset kehityskeskustelut",
      addedDate: "2025-01-06T08:00:00.000Z"
    },
    {
      id: "7",
      startDate: "2025-08-01",
      endDate: "2025-08-15",
      category: "Henkilöstöhallinto",
      name: "Tyhy-päivä",
      details: "Työhyvinvointipäivä",
      addedDate: "2025-01-07T08:00:00.000Z"
    },
    {
      id: "8",
      startDate: "2025-05-01",
      endDate: "2025-05-02",
      category: "Yhteiset tapahtumat",
      name: "Kesäjuhla",
      details: "Yrityksen kesäjuhla",
      addedDate: "2025-01-08T08:00:00.000Z"
    },
    {
      id: "9",
      startDate: "2025-12-15",
      endDate: "2025-12-16",
      category: "Yhteiset tapahtumat",
      name: "Pikkujoulut",
      details: "Yrityksen pikkujoulut",
      addedDate: "2025-01-09T08:00:00.000Z"
    }
  ]);

  // Kategoriat
  const [categories, setCategories] = useState([
    "Markkinointi",
    "Talous",
    "Henkilöstöhallinto",
    "Yhteiset tapahtumat"
  ]);

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

  // UI-tilan hallinta
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [activeTab, setActiveTab] = useState("vuosikello");
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(true);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
  const [selectedSearchEvent, setSelectedSearchEvent] = useState(null);

  // Kuukausien nimet
  const monthNames = [
    "Tammikuu", "Helmikuu", "Maaliskuu",
    "Huhtikuu", "Toukokuu", "Kesäkuu",
    "Heinäkuu", "Elokuu", "Syyskuu",
    "Lokakuu", "Marraskuu", "Joulukuu"
  ];

  // Tooltip-alustus
  useEffect(() => {
    d3.select("#tooltip").remove();
    
    d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
      .style("font-size", "14px")
      .style("z-index", "1000");
  }, []);

  // Tapahtumien käsittely
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // Näkyvien tapahtumien päivitys
  const [selectedCategories, setSelectedCategories] = useState(new Set(categories));

  const updateVisibleEvents = (newSelectedCategories) => {
    setSelectedCategories(newSelectedCategories);
  };

  // Projektin valinta
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    // Tallennetaan valittu projekti local storageen
    localStorage.setItem('selectedProject', JSON.stringify(project));
    
    // Haetaan projektin tapahtumat local storagesta tai käytetään oletusarvoja
    const projectEvents = localStorage.getItem(`events_${project.id}`);
    if (projectEvents) {
      setEvents(JSON.parse(projectEvents));
    } else if (project.events) {
      // Jos projektilla on valmiiksi tapahtumia
      // Lisätään projectId jokaiseen tapahtumaan
      const eventsWithProjectId = project.events.map(event => ({
        ...event,
        projectId: project.id
      }));
      setEvents(eventsWithProjectId);
      // Tallennetaan tapahtumat local storageen
      localStorage.setItem(`events_${project.id}`, JSON.stringify(eventsWithProjectId));
    } else {
      // Jos projektilla ei ole tapahtumia, asetetaan tyhjä lista
      setEvents([]);
      // Tallennetaan tyhjä lista local storageen
      localStorage.setItem(`events_${project.id}`, JSON.stringify([]));
    }
    
    // Haetaan projektin kategoriat local storagesta
    const projectCategories = localStorage.getItem(`categories_${project.id}`);
    
    // Jos projektin kategoriat löytyvät local storagesta, käytetään niitä
    if (projectCategories) {
      const parsedCategories = JSON.parse(projectCategories);
      setCategories(parsedCategories);
      
      // Päivitetään kategorioiden värit
      const newCategoryColors = {...categoryColors};
      let colorIndex = 0;
      
      parsedCategories.forEach(category => {
        if (!newCategoryColors[category]) {
          // Määritellään uusi väri kategorialle
          newCategoryColors[category] = colorPalette[colorIndex % colorPalette.length];
          colorIndex++;
        }
      });
      
      setCategoryColors(newCategoryColors);
      
      // Päivitetään valitut kategoriat
      setSelectedCategories(new Set(parsedCategories));
    } else if (project.categories) {
      // Jos projektin kategorioita ei löydy local storagesta, mutta projektilla on kategoriat
      setCategories(project.categories);
      
      // Päivitetään kategorioiden värit
      const newCategoryColors = {...categoryColors};
      let colorIndex = 0;
      
      project.categories.forEach(category => {
        if (!newCategoryColors[category]) {
          // Määritellään uusi väri kategorialle
          newCategoryColors[category] = colorPalette[colorIndex % colorPalette.length];
          colorIndex++;
        }
      });
      
      setCategoryColors(newCategoryColors);
      
      // Päivitetään valitut kategoriat
      setSelectedCategories(new Set(project.categories));
      
      // Tallennetaan kategoriat local storageen
      localStorage.setItem(`categories_${project.id}`, JSON.stringify(project.categories));
    } else {
      // Jos projektilla ei ole kategorioita, käytetään oletuskategorioita
      const defaultCategories = [
        "Markkinointi",
        "Talous",
        "Henkilöstöhallinto",
        "Yhteiset tapahtumat"
      ];
      setCategories(defaultCategories);
      setSelectedCategories(new Set(defaultCategories));
      
      // Tallennetaan oletuskategoriat projektin kategorioiksi
      localStorage.setItem(`categories_${project.id}`, JSON.stringify(defaultCategories));
    }
  };

  // Tallenna tapahtumat kun ne muuttuvat
  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem(`events_${selectedProject.id}`, JSON.stringify(events));
    }
  }, [events, selectedProject]);

  // Takaisin projektivalintaan
  const handleBackToProjects = () => {
    setSelectedProject(null);
    // Poistetaan valittu projekti local storagesta
    localStorage.removeItem('selectedProject');
  };

  // Projektin poistaminen
  const handleDeleteProject = () => {
    if (!selectedProject) return;
    
    // Kysytään käyttäjältä varmistus
    const isConfirmed = window.confirm(`Haluatko varmasti poistaa projektin "${selectedProject.name}"? Tätä toimintoa ei voi peruuttaa.`);
    
    if (isConfirmed) {
      // Poistetaan projektin tapahtumat local storagesta
      localStorage.removeItem(`events_${selectedProject.id}`);
      
      // Poistetaan projektin kategoriat local storagesta
      localStorage.removeItem(`categories_${selectedProject.id}`);
      
      // Haetaan kaikki projektit
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        
        // Poistetaan projekti listasta
        const updatedProjects = projects.filter(project => project.id !== selectedProject.id);
        
        // Tallennetaan päivitetty lista
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
      }
      
      // Palataan projektivalintaan
      setSelectedProject(null);
      localStorage.removeItem('selectedProject');
    }
  };

  // Lisätään useEffect hook projektin tietojen päivittämiseen
  useEffect(() => {
    const savedProject = localStorage.getItem('selectedProject');
    if (savedProject) {
      const project = JSON.parse(savedProject);
      setSelectedProject(project);
      
      // Haetaan projektin tapahtumat
      const projectEvents = localStorage.getItem(`events_${project.id}`);
      if (projectEvents) {
        setEvents(JSON.parse(projectEvents));
      }
      
      // Haetaan projektin kategoriat
      const projectCategories = localStorage.getItem(`categories_${project.id}`);
      if (projectCategories) {
        const parsedCategories = JSON.parse(projectCategories);
        setCategories(parsedCategories);
        
        // Päivitetään kategorioiden värit
        const newCategoryColors = {...categoryColors};
        let colorIndex = 0;
        
        parsedCategories.forEach(category => {
          if (!newCategoryColors[category]) {
            // Määritellään uusi väri kategorialle
            newCategoryColors[category] = colorPalette[colorIndex % colorPalette.length];
            colorIndex++;
          }
        });
        
        setCategoryColors(newCategoryColors);
        setSelectedCategories(new Set(parsedCategories));
      }
    }
  }, [selectedProject?.id]); // Lisätään riippuvuus selectedProject.id:stä

  // Käynnistä muistutusten tarkistus
  useEffect(() => {
    startReminderCheck();
  }, []);

  // Jos projektia ei ole valittu, näytetään projektin valintanäyttö
  if (!selectedProject) {
    return <ProjectSelector onSelectProject={handleProjectSelect} />;
  }

  // Muuten näytetään vuosikello
  return (
    <div style={{
      backgroundColor: "white",
      minHeight: "100%",
      position: "relative",
      paddingRight: isRightPanelVisible ? "320px" : "40px",
      paddingLeft: isFilterPanelVisible ? "320px" : "40px",
      overflowY: "visible",
      transition: "padding-left 0.3s ease, padding-right 0.3s ease"
    }}>
      {/* Vasen sivupaneeli */}
      <SidePanel 
        isVisible={isFilterPanelVisible} 
        setIsVisible={setIsFilterPanelVisible}
        position="left"
      >
        <FilterPanel 
          categories={categories} 
          events={events}
          onUpdateVisibleEvents={updateVisibleEvents}
          setSelectedEvent={setSelectedEvent}
          selectedSearchEvent={selectedSearchEvent}
          setSelectedSearchEvent={setSelectedSearchEvent}
          selectedProject={selectedProject}
          setEvents={setEvents}
        />
      </SidePanel>

      {/* Projektin nimi */}
      <div style={{
        textAlign: 'center',
        padding: '20px 0 15px 0',
        borderBottom: '1px solid #eee',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '22px',
          fontWeight: '500',
          color: '#333'
        }}>
          {selectedProject.name}
        </h2>
      </div>

      {/* Välilehdet */}
      <div style={{ 
        position: "relative", 
        zIndex: 10, 
        backgroundColor: "white",
        paddingTop: "0px",
        paddingBottom: "0px",
        borderBottom: "1px solid #eee"
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '10px 20px',
          position: 'relative' 
        }}>
          {/* Takaisin-nappi vasemmassa reunassa */}
          <div style={{
            position: 'absolute',
            left: '50px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            <button 
              onClick={handleBackToProjects} 
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                color: '#555'
              }}
              title="Vaihda projektia"
            >
              <span style={{ fontSize: '24px', marginRight: '5px' }}>&#8592;</span>
            </button>
          </div>
          
          {/* Välilehdet keskellä */}
          <AppTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* Välilehtien sisältö */}
      <div style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        paddingTop: "20px",
        paddingBottom: "40px",
        margin: "0 auto",
        maxWidth: (!isFilterPanelVisible && !isRightPanelVisible) ? "1200px" : "100%",
        width: "100%",
        overflowY: "auto"
      }}>
        {activeTab === "vuosikello" && (
          <YearClock 
            events={events} 
            categories={categories} 
            monthNames={monthNames} 
            setSelectedMonth={setSelectedMonth} 
            setSelectedEvent={setSelectedEvent} 
            setShowEventDetails={setShowEventDetails}
            selectedCategories={selectedCategories}
            categoryColors={categoryColors}
            selectedProject={selectedProject}
          />
        )}

        {activeTab === "aikajana" && (
          <Timeline events={events} categoryColors={categoryColors} selectedProject={selectedProject} />
        )}

        {activeTab === "muokkaa" && (
          <EventEditor events={events} setEvents={setEvents} selectedProject={selectedProject} categories={categories} />
        )}

        {activeTab === "lisaa" && (
          <EventForm 
            events={events} 
            setEvents={setEvents} 
            categories={categories} 
            setCategories={updateCategories} 
            categoryColors={categoryColors}
            selectedProject={selectedProject}
            handleDeleteProject={handleDeleteProject}
          />
        )}
      </div>

      {/* Oikea sivupaneeli */}
      <SidePanel 
        isVisible={isRightPanelVisible} 
        setIsVisible={setIsRightPanelVisible}
        position="right"
      >
        <MonthAgenda
          month={selectedMonth}
          events={events}
          onClose={() => {}}
          monthNames={monthNames}
          setSelectedMonth={setSelectedMonth}
          categoryColors={categoryColors}
          selectedProject={selectedProject}
        />
      </SidePanel>

      {/* Tapahtuman tiedot -modaali */}
      {showEventDetails && selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setShowEventDetails(false);
            setSelectedEvent(null);
          }}
          onSave={(updatedEvent) => {
            // Päivitä tapahtuma events-listassa
            const updatedEvents = events.map(event => 
              event.id === updatedEvent.id ? { ...updatedEvent, id: event.id } : event
            );
            setEvents(updatedEvents);
            setShowEventDetails(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
