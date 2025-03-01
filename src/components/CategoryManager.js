/**
 * CategoryManager - Kategorioiden hallintakomponentti
 * 
 * Tämä komponentti mahdollistaa kategorioiden lisäämisen ja poistamisen.
 * Käyttäjä voi lisätä uusia kategorioita, joita käytetään tapahtumien luokitteluun.
 * Komponentti sisältää validoinnin, joka estää duplikaattikategorioiden lisäämisen
 * ja rajoittaa kategorioiden määrää.
 */

import React, { useState } from 'react';

const CategoryManager = ({ categories, setCategories, events, setEvents }) => {
  const [newCategory, setNewCategory] = useState("");
  const MAX_CATEGORIES = 5;

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
    fontSize: "14px"
  };

  const addCategory = () => {
    if (categories.length >= MAX_CATEGORIES) {
      alert("Maksimimäärä kategorioita (5) on jo käytössä.");
      return;
    }
    if (!newCategory.trim()) {
      alert("Kategorian nimi ei voi olla tyhjä.");
      return;
    }
    if (categories.includes(newCategory.trim())) {
      alert("Tämä kategoria on jo olemassa.");
      return;
    }
    setCategories([...categories, newCategory.trim()]);
    setNewCategory("");
  };

  const removeCategory = (categoryToRemove) => {
    const eventsInCategory = events.filter(e => e.category === categoryToRemove);
    if (eventsInCategory.length > 0) {
      if (!window.confirm(`Kategoriassa "${categoryToRemove}" on ${eventsInCategory.length} tapahtumaa. Haluatko varmasti poistaa kategorian ja kaikki sen tapahtumat?`)) {
        return;
      }
      // Poistetaan kategorian tapahtumat
      setEvents(events.filter(e => e.category !== categoryToRemove));
    }
    setCategories(categories.filter(c => c !== categoryToRemove));
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ 
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        alignItems: "center"
      }}>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Uusi kategoria"
          style={{ 
            ...inputStyle,
            flex: 1,
            height: "36px"
          }}
        />
        <button
          onClick={addCategory}
          disabled={categories.length >= MAX_CATEGORIES}
          style={{
            ...addButtonStyle,
            height: "36px",
            opacity: categories.length >= MAX_CATEGORIES ? 0.5 : 1
          }}
        >
          Lisää kategoria
        </button>
      </div>

      {/* Kategoriat listana */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map((category, index) => {
          return (
            <li key={index} style={{ 
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px"
            }}>
              <button
                onClick={() => removeCategory(category)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {category}
              </button>
            </li>
          );
        })}
      </ul>

      <div style={{ 
        marginTop: "10px",
        fontSize: "12px",
        color: "#666",
        textAlign: "right"
      }}>
        {MAX_CATEGORIES - categories.length} kategoriaa jäljellä
      </div>
    </div>
  );
};

export default CategoryManager; 