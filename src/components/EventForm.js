/**
 * EventForm - Tapahtumien lisäyskomponentti
 * 
 * Tämä komponentti mahdollistaa uusien tapahtumien lisäämisen sovellukseen.
 * Käyttäjä voi syöttää tapahtuman nimen, kategorian, alkamis- ja päättymispäivän
 * sekä lisätietoja. Komponentti sisältää validoinnin, joka varmistaa että kaikki
 * pakolliset kentät on täytetty ennen tapahtuman lisäämistä.
 */

import React, { useState } from 'react';

const EventForm = ({ events, setEvents, categories, setCategories }) => {
  const [newEvent, setNewEvent] = useState({
    startDate: "",
    endDate: "",
    category: "",
    name: "",
    details: ""
  });

  const [newCategory, setNewCategory] = useState('');

  // Tyylit
  const inputStyle = {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    width: "100%"
  };

  const addButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    display: "block",
    margin: "0 auto"
  };

  const addEvent = () => {
    // Tarkistetaan, että pakolliset kentät on täytetty
    if (!newEvent.name || !newEvent.category || !newEvent.startDate || !newEvent.endDate) {
      alert("Täytä kaikki pakolliset kentät (nimi, kategoria, alkupäivä ja loppupäivä)");
      return;
    }
    
    setEvents([...events, newEvent]);
    setNewEvent({ startDate: "", endDate: "", category: "", name: "", details: "" });
  };

  return (
    <div style={{ 
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
      flex: 1,
      margin: "0 20px"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "30px" }}>Lisää uusi tapahtuma</h2>

        {/* Kategorioiden hallinta */}
        <div style={{
          marginBottom: "40px",
          padding: "20px",
          backgroundColor: "#f8f8f8",
          borderRadius: "8px"
        }}>
          <h3 style={{ marginBottom: "20px" }}>Kategoriat</h3>
          
          {/* Kategorioiden listaus */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px"
          }}>
            {categories.map((category, index) => (
              <div 
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 12px",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  border: "1px solid #ddd"
                }}
              >
                <span style={{ marginRight: "8px" }}>{category}</span>
                <button
                  onClick={() => {
                    const newCategories = categories.filter(c => c !== category);
                    setCategories(newCategories);
                  }}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#666",
                    cursor: "pointer",
                    padding: "2px 6px",
                    fontSize: "1.2rem",
                    lineHeight: "1"
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Uuden kategorian lisäys */}
          <div style={{
            display: "flex",
            gap: "10px"
          }}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Uusi kategoria..."
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            />
            <button
              onClick={() => {
                if (newCategory.trim() && !categories.includes(newCategory.trim())) {
                  setCategories([...categories, newCategory.trim()]);
                  setNewCategory('');
                }
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Lisää kategoria
            </button>
          </div>
        </div>

        {/* Tapahtuman lisäyslomake */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "12px", color: "#666" }}>Nimi</label>
            <input
              type="text"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              style={{
                ...inputStyle,
                width: "100%",
                height: "36px",
                boxSizing: "border-box"
              }}
              placeholder="Tapahtuman nimi"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "12px", color: "#666" }}>Kategoria</label>
            <select
              value={newEvent.category}
              onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
              style={{
                ...inputStyle,
                width: "100%",
                height: "36px",
                boxSizing: "border-box"
              }}
            >
              <option value="">Valitse kategoria</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "20px", gridColumn: "span 2" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "12px", color: "#666" }}>Alkaa</label>
              <input
                type="date"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                style={{
                  ...inputStyle,
                  width: "100%",
                  height: "36px",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "12px", color: "#666" }}>Päättyy</label>
              <input
                type="date"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                style={{
                  ...inputStyle,
                  width: "100%",
                  height: "36px",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: "12px", color: "#666" }}>Lisätiedot</label>
            <input
              type="text"
              value={newEvent.details}
              onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })}
              style={{
                ...inputStyle,
                width: "100%",
                height: "36px",
                boxSizing: "border-box"
              }}
              placeholder="Lisätiedot"
            />
          </div>

          <button
            onClick={addEvent}
            style={{
              ...addButtonStyle,
              gridColumn: "span 2",
              width: "100%",
              height: "36px",
              marginTop: "10px"
            }}
          >
            Lisää tapahtuma
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventForm; 