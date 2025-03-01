import React from "react";

/**
 * MonthAgenda - Kuukausinäkymän komponentti
 * 
 * Tämä komponentti näyttää valitun kuukauden tapahtumat listana.
 * Käyttäjä voi selata kuukausia eteen- ja taaksepäin nuolipainikkeilla.
 * Tapahtumat näytetään aikajärjestyksessä ja värikoodataan kategorian mukaan.
 */

const MonthAgenda = ({ month, events, onClose, monthNames, setSelectedMonth, categoryColors }) => {
  const monthEvents = events.filter(event => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    return eventStart.getMonth() === month || eventEnd.getMonth() === month;
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
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: categoryColors[event.category],
                    opacity: 0.7
                  }} />
                  <div>
                    <div style={{ fontWeight: "500" }}>{event.name}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {`${startDate.getDate()}.${startDate.getMonth() + 1} - ${endDate.getDate()}.${endDate.getMonth() + 1}`}
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