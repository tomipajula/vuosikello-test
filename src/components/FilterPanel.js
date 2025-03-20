import React, { useEffect, useState } from "react";
import EventModal from "./EventModal";

/**
 * FilterPanel - Tapahtumien suodatus- ja hakukomponentti
 * 
 * Tämä komponentti mahdollistaa tapahtumien suodattamisen kategorioiden mukaan
 * ja tapahtumien hakemisen nimellä. Käyttäjä voi valita näytettävät kategoriat
 * ja etsiä tapahtumia hakusanalla. Komponentti näyttää myös viimeisimmät tapahtumat
 * historia-osiossa.
 * Näytetään vain valitun projektin tapahtumat.
 */

const FilterPanel = ({ categories, events, onUpdateVisibleEvents, setSelectedEvent, selectedSearchEvent, setSelectedSearchEvent, selectedProject, setEvents }) => {
  const [recentEvents, setRecentEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set(categories));

  // Suodatetaan projektin tapahtumat
  const projectEvents = events.filter(event => !event.projectId || event.projectId === selectedProject?.id);

  useEffect(() => {
    // Järjestetään tapahtumat lisäyspäivämäärän mukaan, jos se on saatavilla
    // Jos addedDate-kenttää ei ole, käytetään startDate-kenttää
    const latest = projectEvents
      .sort((a, b) => {
        // Jos molemmilla on addedDate, käytetään sitä
        if (a.addedDate && b.addedDate) {
          return new Date(b.addedDate) - new Date(a.addedDate);
        }
        // Jos vain toisella on addedDate, se on uudempi
        if (a.addedDate) return -1;
        if (b.addedDate) return 1;
        // Jos kummallakaan ei ole addedDate, käytetään startDate-kenttää
        return new Date(b.startDate) - new Date(a.startDate);
      })
      .slice(0, 5);
    setRecentEvents(latest);
  }, [events, selectedProject]);

  const toggleCategory = (category) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
    onUpdateVisibleEvents(newSelected);
  };

  const selectAll = () => {
    setSelectedCategories(new Set(categories));
    onUpdateVisibleEvents(new Set(categories));
  };

  const selectNone = () => {
    setSelectedCategories(new Set());
    onUpdateVisibleEvents(new Set());
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = projectEvents.filter(event => 
      event.name.toLowerCase().includes(term.toLowerCase()) ||
      event.category.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 5);

    setSearchResults(results);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }}>
      <div>
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: "20px",
          fontSize: "1.2rem",
          color: "#333"
        }}>
          Suodatus
        </h2>
      </div>

      <div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Etsi..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: "90%",
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "20px",
              fontSize: "14px",
              outline: "none",
              backgroundColor: "#f8f8f8"
            }}
          />
        </div>

        {searchResults.length > 0 && (
          <div style={{
            marginTop: "10px",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            {searchResults.map((event, index) => (
              <div 
                key={index}
                onClick={() => setSelectedSearchEvent(event)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  ':hover': {
                    backgroundColor: "#e0e0e0"
                  }
                }}
              >
                <div style={{ fontWeight: "500" }}>{event.name}</div>
                <div style={{ 
                  fontSize: "0.8rem", 
                  color: "#666",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "4px"
                }}>
                  <span>{new Date(event.startDate).toLocaleDateString('fi-FI')}</span>
                  <span>{event.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px"
        }}>
          <h3 style={{ 
            fontSize: "1rem", 
            color: "#333",
            margin: 0
          }}>
            Kategoriat
          </h3>
          <div style={{ fontSize: "0.8rem" }}>
            <button
              onClick={selectAll}
              style={{
                border: "none",
                background: "none",
                color: "#2196F3",
                cursor: "pointer",
                padding: "4px 8px"
              }}
            >
              Kaikki
            </button>
            |
            <button
              onClick={selectNone}
              style={{
                border: "none",
                background: "none",
                color: "#666",
                cursor: "pointer",
                padding: "4px 8px"
              }}
            >
              Tyhjennä
            </button>
          </div>
        </div>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          maxWidth: "100%"
        }}>
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => toggleCategory(category)}
              style={{
                padding: "6px 12px",
                backgroundColor: selectedCategories.has(category) ? "#2196F3" : "#f0f0f0",
                color: selectedCategories.has(category) ? "white" : "#333",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "0.85rem",
                transition: "all 0.2s",
                minWidth: "fit-content",
                maxWidth: "calc(50% - 4px)", // Kaksi laatikkoa vierekkäin
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3 style={{ 
          fontSize: "1rem", 
          color: "#333",
          marginBottom: "15px" 
        }}>
          Historia
        </h3>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          {recentEvents.map((event, index) => (
            <div 
              key={index}
              style={{
                padding: "10px",
                backgroundColor: "#f8f8f8",
                borderRadius: "8px",
                fontSize: "0.9rem"
              }}
            >
              <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                {event.name}
              </div>
              <div style={{ 
                fontSize: "0.8rem", 
                color: "#666",
                display: "flex",
                justifyContent: "space-between" 
              }}>
                <span>{new Date(event.startDate).toLocaleDateString('fi-FI')}</span>
                <span>{event.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modaali hakutuloksille */}
      {selectedSearchEvent && (
        <EventModal
          event={selectedSearchEvent}
          onClose={() => setSelectedSearchEvent(null)}
          onSave={(updatedEvent) => {
            // Päivitä tapahtuma events-listassa
            const updatedEvents = events.map(event => 
              event.id === updatedEvent.id ? updatedEvent : event
            );
            setEvents(updatedEvents);
            setSelectedSearchEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default FilterPanel; 