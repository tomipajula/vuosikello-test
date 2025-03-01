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
import { styles } from "./styles";

// Määritellään kategorioiden värit globaalisti
const categoryColors = {
  "Markkinointi": "#1f77b4", // tummansininen - värisokeusystävällinen
  "Talous": "#ff7f0e", // oranssi - värisokeusystävällinen
  "Henkilöstöhallinto": "#2ca02c", // vihreä - värisokeusystävällinen
  "Yhteiset tapahtumat": "#d62728" // punainen - värisokeusystävällinen
};

// Muutetaan categoryColors objektista tilaksi, jotta sitä voidaan päivittää
const Vuosikello = () => {
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
      startDate: "2025-01-01",
      endDate: "2025-01-10",
      category: "Markkinointi",
      name: "Tammikuun ale",
      details: "Alennusmyynti alkaa."
    },
    {
      startDate: "2025-07-01",
      endDate: "2025-07-15",
      category: "Markkinointi",
      name: "Kesäkampanja",
      details: "Kesäale käynnissä."
    },
    {
      startDate: "2025-11-29",
      endDate: "2025-11-30",
      category: "Markkinointi",
      name: "Black Friday",
      details: "Vuoden suurin alepäivä."
    },
    {
      startDate: "2025-03-15",
      endDate: "2025-03-30",
      category: "Talous",
      name: "Budjetointi",
      details: "Kvartaalin budjetointi"
    },
    {
      startDate: "2025-06-15",
      endDate: "2025-06-30",
      category: "Talous",
      name: "Puolivuotiskatsaus",
      details: "Talouden puolivuotiskatsaus"
    },
    {
      startDate: "2025-02-01",
      endDate: "2025-02-15",
      category: "Henkilöstöhallinto",
      name: "Kehityskeskustelut",
      details: "Vuosittaiset kehityskeskustelut"
    },
    {
      startDate: "2025-08-01",
      endDate: "2025-08-15",
      category: "Henkilöstöhallinto",
      name: "Tyhy-päivä",
      details: "Työhyvinvointipäivä"
    },
    {
      startDate: "2025-05-01",
      endDate: "2025-05-02",
      category: "Yhteiset tapahtumat",
      name: "Kesäjuhla",
      details: "Yrityksen kesäjuhla"
    },
    {
      startDate: "2025-12-15",
      endDate: "2025-12-16",
      category: "Yhteiset tapahtumat",
      name: "Pikkujoulut",
      details: "Yrityksen pikkujoulut"
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
        />
      </SidePanel>

      {/* Välilehdet */}
      <div style={{ 
        position: "relative", 
        zIndex: 10, 
        backgroundColor: "white",
        paddingTop: "0px",
        paddingBottom: "0px",
        borderBottom: "1px solid #eee"
      }}>
        <AppTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Välilehtien sisältö */}
      <div style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        paddingTop: "0",
        paddingBottom: "40px",
        margin: "-20px auto 0",
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
          />
        )}

        {activeTab === "aikajana" && (
          <Timeline events={events} categoryColors={categoryColors} />
        )}

        {activeTab === "muokkaa" && (
          <EventEditor events={events} setEvents={setEvents} />
        )}

        {activeTab === "lisaa" && (
          <EventForm 
            events={events} 
            setEvents={setEvents} 
            categories={categories} 
            setCategories={updateCategories} 
            categoryColors={categoryColors}
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
        />
      )}
    </div>
  );
};

export default Vuosikello;
