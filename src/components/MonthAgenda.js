import React from "react";

/**
 * MonthAgenda - Kuukausinäkymän komponentti
 * 
 * Tämä komponentti näyttää valitun kuukauden tapahtumat listana.
 * Käyttäjä voi selata kuukausia eteen- ja taaksepäin nuolipainikkeilla.
 * Tapahtumat näytetään aikajärjestyksessä ja värikoodataan kategorian mukaan.
 * Näytetään vain valitun projektin tapahtumat.
 */

const MonthAgenda = ({ month, events, onClose, monthNames, setSelectedMonth, categoryColors, selectedProject }) => {
  // Suodatetaan tapahtumat kuukauden ja projektin mukaan
  const monthEvents = events.filter(event => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    // Tarkistetaan, että tapahtuma kuuluu valittuun kuukauteen
    const isInSelectedMonth = eventStart.getMonth() === month || eventEnd.getMonth() === month;
    
    // Tarkistetaan, että tapahtuma kuuluu valittuun projektiin
    // Jos tapahtumalla on projectId, tarkistetaan että se vastaa valitun projektin id:tä
    const isInSelectedProject = !event.projectId || event.projectId === selectedProject?.id;
    
    return isInSelectedMonth && isInSelectedProject;
  });

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button 
            onClick={() => setSelectedMonth((month - 1 + 12) % 12)}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            ←
          </button>
          <h2 style={{ margin: 0 }}>{monthNames[month]} 2025</h2>
          <button 
            onClick={() => setSelectedMonth((month + 1) % 12)}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            →
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ 
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#666",
          fontSize: "14px"
        }}>
          <input type="checkbox" /> ZOOMAA KUUKAUTEEN
        </label>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, overflowY: "auto" }}>
        {monthEvents.map((event, index) => {
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate);
          
          return (
            <div key={index} style={{
              display: "flex",
              gap: "15px",
              padding: "10px",
              borderBottom: "1px solid #eee"
            }}>
              <div style={{ width: "30px", textAlign: "right", color: "#666" }}>
                {startDate.getDate()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <div style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    backgroundColor: categoryColors ? categoryColors[event.category] : "#ccc",
                    opacity: 1,
                    border: "1px solid rgba(0,0,0,0.1)",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }} />
                  <div>
                    <div style={{ fontWeight: "500" }}>{event.name}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {`${startDate.getDate()}.${startDate.getMonth() + 1} - ${endDate.getDate()}.${endDate.getMonth() + 1}`}
                    </div>
                    <div style={{ 
                      fontSize: "11px", 
                      color: "#666", 
                      marginTop: "3px",
                      backgroundColor: categoryColors ? `${categoryColors[event.category]}20` : "#f0f0f0",
                      display: "inline-block",
                      padding: "2px 6px",
                      borderRadius: "4px"
                    }}>
                      {event.category}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthAgenda; 