import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/DatePicker.css";
import { addReminder } from "../services/reminderService";
import fi from 'date-fns/locale/fi';
import { registerLocale } from "react-datepicker";

registerLocale('fi', fi);

/**
 * EventModal - Tapahtuman tietojen näyttäminen modaali-ikkunassa
 * 
 * Tämä komponentti näyttää valitun tapahtuman tiedot modaali-ikkunassa.
 * Käyttäjä voi tarkastella tapahtuman nimeä, kategoriaa, ajankohtaa ja
 * lisätietoja. Modaali-ikkuna voidaan sulkea oikeassa yläkulmassa olevasta
 * sulkemispainikkeesta.
 */

const EventModal = ({ event, onClose, onSave }) => {
  const [email, setEmail] = useState("");
  const [reminderDays, setReminderDays] = useState(1);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [reminderAdded, setReminderAdded] = useState(false);
  const [error, setError] = useState("");
  const [priority, setPriority] = useState(event.priority || "normal");
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);

  // Laske minimi- ja maksimipäivämäärät
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventStartDate = new Date(event.startDate);
  eventStartDate.setHours(0, 0, 0, 0);

  const handleAddReminder = () => {
    // Tarkista sähköpostiosoitteen validiteetti
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Virheellinen sähköpostiosoite");
      return;
    }

    // Tarkista päivien määrä
    if (reminderDays < 1) {
      setError("Valitse vähintään 1 päivä");
      return;
    }

    // Laske muistutuspäivämäärä
    const eventDate = new Date(event.startDate);
    const reminderDateTime = new Date(eventDate);
    reminderDateTime.setDate(reminderDateTime.getDate() - reminderDays);
    reminderDateTime.setHours(parseInt(reminderTime.split(':')[0]), parseInt(reminderTime.split(':')[1]));
    
    // Tarkista, että muistutuspäivämäärä ei ole menneisyydessä
    if (reminderDateTime <= new Date()) {
      setError("Muistutusajankohta ei voi olla menneisyydessä");
      return;
    }

    // Lisää muistutus palvelun kautta
    const newReminder = {
      eventId: event.id || `${event.name}-${event.startDate}`,
      eventName: event.name,
      eventDate: event.startDate,
      email: email,
      reminderDateTime: reminderDateTime.toISOString(),
      addedDate: new Date().toISOString()
    };

    addReminder(newReminder);
    setReminderAdded(true);
    setError("");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editedEvent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEvent(event);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3 style={{ margin: 0 }}>
            {isEditing ? (
              <input
                type="text"
                value={editedEvent.name}
                onChange={(e) => handleChange("name", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "18px"
                }}
              />
            ) : (
              event.name
            )}
          </h3>
          <div style={{ display: "flex", gap: "10px" }}>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >
                Muokkaa
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#2ca02c",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: "white",
                    fontSize: "13px"
                  }}
                >
                  Tallenna
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                >
                  Peruuta
                </button>
              </>
            )}
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#666"
          }}
        >
          ×
        </button>
          </div>
        </div>
        
        <div style={{ marginBottom: "10px" }}>
          <strong>Kategoria:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              value={editedEvent.category}
              onChange={(e) => handleChange("category", e.target.value)}
              style={{
                padding: "4px 8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                width: "200px"
              }}
            />
          ) : (
            event.category
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong style={{ marginBottom: "8px", display: "inline-block", marginRight: "10px" }}>Prioriteetti:</strong>
          <div style={{ display: "inline-flex", gap: "6px" }}>
            <button
              onClick={() => isEditing ? handleChange("priority", "high") : null}
              style={{
                padding: "4px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: (isEditing ? editedEvent.priority : priority) === "high" ? "#fff0f0" : "white",
                color: (isEditing ? editedEvent.priority : priority) === "high" ? "#dc3545" : "#666",
                cursor: isEditing ? "pointer" : "default",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s ease"
              }}
            >
              {(isEditing ? editedEvent.priority : priority) === "high" && <span style={{ color: "#dc3545" }}>●</span>}
              Korkea
            </button>
            <button
              onClick={() => isEditing ? handleChange("priority", "normal") : null}
              style={{
                padding: "4px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: (isEditing ? editedEvent.priority : priority) === "normal" ? "#f0fff0" : "white",
                color: (isEditing ? editedEvent.priority : priority) === "normal" ? "#2ca02c" : "#666",
                cursor: isEditing ? "pointer" : "default",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s ease"
              }}
            >
              {(isEditing ? editedEvent.priority : priority) === "normal" && <span style={{ color: "#2ca02c" }}>●</span>}
              Normaali
            </button>
            <button
              onClick={() => isEditing ? handleChange("priority", "low") : null}
              style={{
                padding: "4px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: (isEditing ? editedEvent.priority : priority) === "low" ? "#f8f9fa" : "white",
                color: (isEditing ? editedEvent.priority : priority) === "low" ? "#6c757d" : "#666",
                cursor: isEditing ? "pointer" : "default",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s ease"
              }}
            >
              {(isEditing ? editedEvent.priority : priority) === "low" && <span style={{ color: "#6c757d" }}>●</span>}
              Matala
            </button>
          </div>
        </div>
        
        <div style={{ marginBottom: "10px" }}>
          <strong>Ajankohta:</strong><br />
          {isEditing ? (
            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <DatePicker
                selected={new Date(editedEvent.startDate)}
                onChange={(date) => handleChange("startDate", date.toISOString())}
                dateFormat="dd.MM.yyyy"
                locale="fi"
                className="form-control"
              />
              <span>-</span>
              <DatePicker
                selected={new Date(editedEvent.endDate)}
                onChange={(date) => handleChange("endDate", date.toISOString())}
                dateFormat="dd.MM.yyyy"
                locale="fi"
                className="form-control"
              />
            </div>
          ) : (
            `${new Date(event.startDate).toLocaleDateString('fi-FI')} - ${new Date(event.endDate).toLocaleDateString('fi-FI')}`
          )}
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <strong>Lisätiedot:</strong><br />
          {isEditing ? (
            <textarea
              value={editedEvent.details || ""}
              onChange={(e) => handleChange("details", e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                minHeight: "100px",
                marginTop: "5px"
              }}
            />
          ) : (
            event.details
          )}
        </div>

        {/* Sähköpostimuistutus */}
        <div style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f8f8",
          borderRadius: "8px"
        }}>
          <h4 style={{ marginBottom: "15px" }}>Lisää sähköpostimuistutus</h4>
          
          {reminderAdded ? (
            <div style={{ color: "#2ca02c", marginBottom: "10px" }}>
              Muistutus lisätty onnistuneesti!
            </div>
          ) : (
            <>
          <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Sähköpostiosoite:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    marginBottom: "10px"
                  }}
                  placeholder="esim. nimi@example.com"
                />
              </div>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "10px"
              }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Muistuta päivää ennen:
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={reminderDays}
                      onChange={(e) => setReminderDays(parseInt(e.target.value) || 1)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        backgroundColor: "white",
                        height: "36px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Muistutusaika:
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        backgroundColor: "white",
                        height: "36px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div style={{ color: "#d62728", marginBottom: "10px" }}>
                  {error}
          </div>
        )}

              <button
                onClick={handleAddReminder}
                style={{
                  backgroundColor: "#2ca02c",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                Lisää muistutus
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal; 