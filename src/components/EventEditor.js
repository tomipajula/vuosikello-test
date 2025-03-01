import React, { useState, useEffect } from 'react';

/**
 * EventEditor - Tapahtumien muokkauskomponentti
 * 
 * Tämä komponentti mahdollistaa olemassa olevien tapahtumien muokkaamisen ja poistamisen.
 * Käyttäjä voi suodattaa tapahtumia kategorian ja päivämäärän mukaan, muokata tapahtumien
 * tietoja ja tallentaa muutokset. Komponentti näyttää tapahtumat listana ja tarjoaa
 * käyttöliittymän niiden muokkaamiseen.
 */

const EventEditor = ({ events, setEvents }) => {
  const [editableEvents, setEditableEvents] = useState(events);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Tyylit
  const inputStyle = {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    width: "100%"
  };

  const deleteButtonStyle = {
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  };

  const saveButtonStyle = {
    padding: "12px 24px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    display: "block",
    margin: "0 auto"
  };

  // Suodatetaan tapahtumat
  useEffect(() => {
    let filtered = [...events];

    if (filterCategory) {
      filtered = filtered.filter(event => event.category === filterCategory);
    }

    if (filterStartDate) {
      filtered = filtered.filter(event => event.startDate >= filterStartDate);
    }

    if (filterEndDate) {
      filtered = filtered.filter(event => event.endDate <= filterEndDate);
    }

    setEditableEvents(filtered);
  }, [events, filterCategory, filterStartDate, filterEndDate]);

  const updateEvent = (index, key, value) => {
    const updatedEvents = editableEvents.map((event, i) =>
      i === index ? { ...event, [key]: value } : event
    );
    setEditableEvents(updatedEvents);
  };

  const saveChanges = () => {
    setEvents(editableEvents);
  };

  const deleteEvent = (index) => {
    const updatedEvents = editableEvents.filter((_, i) => i !== index);
    setEditableEvents(updatedEvents);
    setEvents(updatedEvents);
  };

  return (
    <div style={{ 
      maxWidth: "800px", 
      margin: "0 auto", 
      padding: "40px",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ 
        textAlign: "center", 
        marginBottom: "40px",
        color: "#333",
        fontSize: "24px"
      }}>
        Muokkaa tapahtumia
      </h2>

      {/* Suodatusvalinnat */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "15px",
        marginBottom: "30px",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "12px", color: "#666" }}>Suodata kategorian mukaan</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              ...inputStyle,
              width: "100%",
              height: "36px",
              boxSizing: "border-box"
            }}
          >
            <option value="">Kaikki kategoriat</option>
            {[...new Set(events.map(e => e.category))].sort().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
      </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "12px", color: "#666" }}>Alkupäivämäärä</label>
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            style={{
              ...inputStyle,
              width: "100%",
              height: "36px",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "12px", color: "#666" }}>Loppupäivämäärä</label>
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            style={{
              ...inputStyle,
              width: "100%",
              height: "36px",
              boxSizing: "border-box"
            }}
          />
        </div>
      </div>

      {/* Tapahtumien lista */}
      <ul style={{ 
        listStyle: "none", 
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: "15px"
      }}>
        {editableEvents.map((event, index) => (
          <li key={index} style={{ 
            padding: "25px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "30px",
            alignItems: "start"
          }}>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "8px",
              gridColumn: "span 1"
            }}>
              <label style={{ 
                fontSize: "12px", 
                color: "#666",
                marginBottom: "4px"
              }}>
                Nimi
              </label>
            <input
              type="text"
              value={event.name}
              onChange={(e) => updateEvent(index, "name", e.target.value)}
                style={inputStyle}
                placeholder="Nimi"
              />
            </div>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "8px",
              gridColumn: "span 1"
            }}>
              <label style={{ 
                fontSize: "12px", 
                color: "#666",
                marginBottom: "4px"
              }}>
                Alkaa
              </label>
            <input
              type="date"
              value={event.startDate}
              onChange={(e) => updateEvent(index, "startDate", e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "8px",
              gridColumn: "span 1"
            }}>
              <label style={{ 
                fontSize: "12px", 
                color: "#666",
                marginBottom: "4px"
              }}>
                Päättyy
              </label>
            <input
              type="date"
              value={event.endDate}
              onChange={(e) => updateEvent(index, "endDate", e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "8px",
              gridColumn: "span 1"
            }}>
              <label style={{ 
                fontSize: "12px", 
                color: "#666",
                marginBottom: "4px"
              }}>
                Kategoria
              </label>
            <input
              type="text"
              value={event.category}
              onChange={(e) => updateEvent(index, "category", e.target.value)}
                style={inputStyle}
                placeholder="Kategoria"
              />
            </div>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "8px",
              gridColumn: "span 1"
            }}>
              <label style={{ 
                fontSize: "12px", 
                color: "#666",
                marginBottom: "4px"
              }}>
                Lisätiedot
              </label>
            <input
              type="text"
              value={event.details}
              onChange={(e) => updateEvent(index, "details", e.target.value)}
                style={inputStyle}
                placeholder="Lisätiedot"
              />
            </div>
            <button 
              onClick={() => deleteEvent(index)}
              style={{
                ...deleteButtonStyle,
                alignSelf: "flex-end",
                marginBottom: "4px",
                gridColumn: "6 / 7"
              }}
            >
              Poista
            </button>
          </li>
        ))}
      </ul>
      <button 
        onClick={saveChanges}
        style={{
          ...saveButtonStyle,
          marginTop: "40px"
        }}
      >
        Tallenna muutokset
      </button>
    </div>
  );
};

export default EventEditor; 