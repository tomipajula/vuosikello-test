import React from "react";

/**
 * EventModal - Tapahtuman tietojen näyttäminen modaali-ikkunassa
 * 
 * Tämä komponentti näyttää valitun tapahtuman tiedot modaali-ikkunassa.
 * Käyttäjä voi tarkastella tapahtuman nimeä, kategoriaa, ajankohtaa ja
 * lisätietoja. Modaali-ikkuna voidaan sulkea oikeassa yläkulmassa olevasta
 * sulkemispainikkeesta.
 */

const EventModal = ({ event, onClose }) => {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "500px",
        width: "90%",
        position: "relative"
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: "10px",
            top: "10px",
            border: "none",
            background: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#666"
          }}
        >
          ×
        </button>

        <h3 style={{ marginBottom: "15px" }}>{event.name}</h3>
        
        <div style={{ marginBottom: "10px" }}>
          <strong>Kategoria:</strong> {event.category}
        </div>
        
        <div style={{ marginBottom: "10px" }}>
          <strong>Ajankohta:</strong><br />
          {new Date(event.startDate).toLocaleDateString('fi-FI')} - {new Date(event.endDate).toLocaleDateString('fi-FI')}
        </div>
        
        {event.details && (
          <div style={{ marginBottom: "10px" }}>
            <strong>Lisätiedot:</strong><br />
            {event.details}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal; 