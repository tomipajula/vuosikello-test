import React, { useState, useEffect } from 'react';

/**
 * EventEditor - Tapahtumien muokkauskomponentti
 * 
 * Tämä komponentti mahdollistaa olemassa olevien tapahtumien muokkaamisen ja poistamisen.
 * Käyttäjä voi suodattaa tapahtumia kategorian ja päivämäärän mukaan, muokata tapahtumien
 * tietoja ja tallentaa muutokset. Komponentti näyttää tapahtumat listana ja tarjoaa
 * käyttöliittymän niiden muokkaamiseen.
 * Näytetään vain valitun projektin tapahtumat.
 */

const EventEditor = ({ events, setEvents, selectedProject, categories }) => {
  const [editableEvents, setEditableEvents] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
    backgroundColor: "#d62728", // punainen - värisokeusystävällinen
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  };

  const updateButtonStyle = {
    padding: "8px 16px",
    backgroundColor: "#1f77b4", // tummansininen - värisokeusystävällinen
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    marginRight: "10px"
  };

  const saveButtonStyle = {
    padding: "12px 24px",
    backgroundColor: "#2ca02c", // vihreä - värisokeusystävällinen
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    display: "block",
    margin: "0 auto"
  };

  const searchInputStyle = {
    padding: "10px 15px",
    border: "1px solid #ddd",
    borderRadius: "30px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#f8f8f8",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1) inset",
    marginBottom: "20px"
  };

  // Suodatetaan tapahtumat
  useEffect(() => {
    // Suodatetaan ensin projektin mukaan
    let filtered = events.filter(event => !event.projectId || event.projectId === selectedProject?.id);

    // Hakutoiminto
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchLower) || 
        event.details.toLowerCase().includes(searchLower) ||
        event.category.toLowerCase().includes(searchLower)
      );
    }

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
  }, [events, filterCategory, filterStartDate, filterEndDate, searchTerm, selectedProject]);

  const updateEvent = (index, key, value) => {
    const updatedEvents = editableEvents.map((event, i) =>
      i === index ? { ...event, [key]: value } : event
    );
    setEditableEvents(updatedEvents);
  };

  const saveChanges = () => {
    // Yhdistä muokatut tapahtumat ja ne tapahtumat, joita ei ole suodatettu näkyviin
    const updatedEvents = [...events];
    
    // Käy läpi muokattavat tapahtumat
    editableEvents.forEach(editedEvent => {
      // Lisää addedDate-kenttä, jos sitä ei ole
      const eventWithDate = {
        ...editedEvent,
        addedDate: editedEvent.addedDate || new Date().toISOString()
      };
      
      // Etsi vastaava tapahtuma kaikista tapahtumista
      const originalIndex = updatedEvents.findIndex(event => 
        event.name === eventWithDate.name && 
        event.startDate === eventWithDate.startDate &&
        event.category === eventWithDate.category
      );
      
      if (originalIndex !== -1) {
        // Päivitä olemassa oleva tapahtuma
        updatedEvents[originalIndex] = eventWithDate;
      } else {
        // Lisää uusi tapahtuma
        updatedEvents.push(eventWithDate);
      }
    });
    
    setEvents(updatedEvents);
    alert("Kaikki muutokset tallennettu!");
  };

  const deleteEvent = (index) => {
    const eventToDelete = editableEvents[index];
    
    // Poista tapahtuma muokattavista tapahtumista
    const updatedEditableEvents = editableEvents.filter((_, i) => i !== index);
    setEditableEvents(updatedEditableEvents);
    
    // Poista tapahtuma myös alkuperäisestä events-tilasta
    const updatedAllEvents = events.filter(event => 
      !(event.name === eventToDelete.name && 
        event.startDate === eventToDelete.startDate &&
        event.category === eventToDelete.category)
    );
    
    setEvents(updatedAllEvents);
    alert("Tapahtuma poistettu!");
  };

  // Päivitä yksittäinen tapahtuma
  const updateSingleEvent = (index) => {
    const updatedEvent = {
      ...editableEvents[index],
      addedDate: new Date().toISOString(), // Päivitetään lisäyspäivämäärä
      projectId: selectedProject?.id // Varmistetaan, että tapahtumalla on projektin ID
    };
    const allEvents = [...events];
    
    // Etsi tapahtuma kaikista tapahtumista - käytä indeksiä jos mahdollista
    const originalEventIndex = events.findIndex(event => 
      (event.name === updatedEvent.name && 
      event.startDate === updatedEvent.startDate &&
      event.category === updatedEvent.category) ||
      // Vertaa myös muita kenttiä varmuuden vuoksi
      (event.name === updatedEvent.name && 
       event.details === updatedEvent.details)
    );
    
    if (originalEventIndex !== -1) {
      // Päivitä olemassa oleva tapahtuma
      allEvents[originalEventIndex] = updatedEvent;
      setEvents(allEvents);
      alert("Tapahtuma päivitetty!");
    } else {
      // Jos tapahtumaa ei löydy, lisää se uutena
      setEvents([...allEvents, updatedEvent]);
      alert("Tapahtuma lisätty!");
    }
  };

  return (
    <div style={{ 
      maxWidth: "1000px", 
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

      {/* Hakutoiminto */}
      <div style={{
        marginBottom: "30px"
      }}>
        <div style={{
          position: "relative",
          width: "100%"
        }}>
          <input
            type="text"
            placeholder="Hae tapahtumia nimen, kategorian tai lisätietojen perusteella..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                color: "#999"
              }}
            >
              ✕
            </button>
          )}
        </div>
        {searchTerm && (
          <div style={{
            fontSize: "14px",
            color: "#666",
            marginTop: "10px"
          }}>
            Hakutulokset: {editableEvents.length} tapahtumaa
          </div>
        )}
      </div>

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
            {categories.map(category => (
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
        gap: "30px"
      }}>
        {editableEvents.length > 0 ? (
          editableEvents.map((event, index) => (
            <li key={index} style={{ 
              padding: "35px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "30px"
            }}>
              {/* Ylärivin kentät */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "30px",
                alignItems: "start"
              }}>
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "8px"
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
                  gap: "8px"
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
                  gap: "8px"
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
                  gap: "8px"
                }}>
                  <label style={{ 
                    fontSize: "12px", 
                    color: "#666",
                    marginBottom: "4px"
                  }}>
                    Kategoria
                  </label>
                  <select
                    value={event.category}
                    onChange={(e) => updateEvent(index, "category", e.target.value)}
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
              </div>
              
              {/* Lisätiedot omalla rivillään */}
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: "8px",
                width: "100%"
              }}>
                <label style={{ 
                  fontSize: "12px", 
                  color: "#666",
                  marginBottom: "4px"
                }}>
                  Lisätiedot
                </label>
                <textarea
                  value={event.details}
                  onChange={(e) => updateEvent(index, "details", e.target.value)}
                  style={{
                    ...inputStyle,
                    minHeight: "100px",
                    resize: "vertical"
                  }}
                  placeholder="Lisätiedot"
                />
              </div>
              
              {/* Toimintonapit */}
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "15px",
                marginTop: "10px"
              }}>
                <button 
                  onClick={() => updateSingleEvent(index)}
                  style={updateButtonStyle}
                >
                  Päivitä
                </button>
                <button 
                  onClick={() => deleteEvent(index)}
                  style={deleteButtonStyle}
                >
                  Poista
                </button>
              </div>
            </li>
          ))
        ) : (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            color: "#666"
          }}>
            {searchTerm ? 
              "Ei hakutuloksia. Kokeile eri hakusanoja." : 
              "Ei tapahtumia näytettäväksi. Muuta suodattimia nähdäksesi tapahtumia."}
          </div>
        )}
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