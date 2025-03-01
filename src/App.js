import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const EventEditor = ({ events, setEvents }) => {
  const [editableEvents, setEditableEvents] = useState([...events]);

  useEffect(() => {
    setEditableEvents([...events]);
  }, [events]);

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
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Muokkaa tapahtumia</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {editableEvents.map((event, index) => (
          <li key={index} style={{ 
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto",
            gap: "10px",
            alignItems: "center"
          }}>
            <input
              type="text"
              value={event.name}
              onChange={(e) => updateEvent(index, "name", e.target.value)}
              style={inputStyle}
              placeholder="Nimi"
            />
            <input
              type="date"
              value={event.startDate}
              onChange={(e) => updateEvent(index, "startDate", e.target.value)}
              style={inputStyle}
            />
            <input
              type="date"
              value={event.endDate}
              onChange={(e) => updateEvent(index, "endDate", e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              value={event.category}
              onChange={(e) => updateEvent(index, "category", e.target.value)}
              style={inputStyle}
              placeholder="Kategoria"
            />
            <input
              type="text"
              value={event.details}
              onChange={(e) => updateEvent(index, "details", e.target.value)}
              style={inputStyle}
              placeholder="Lisätiedot"
            />
            <button 
              onClick={() => deleteEvent(index)}
              style={deleteButtonStyle}
            >
              Poista
            </button>
          </li>
        ))}
      </ul>
      <button 
        onClick={saveChanges}
        style={saveButtonStyle}
      >
        Tallenna muutokset
      </button>
    </div>
  );
};

const Vuosikello = () => {
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
  ]);

  const [view, setView] = useState("clock");
  const [filterCategory, setFilterCategory] = useState("");
  const [newEvent, setNewEvent] = useState({
    startDate: "",
    endDate: "",
    category: "",
    name: "",
    details: ""
  });

  const monthNames = [
    "Tammikuu", "Helmikuu", "Maaliskuu",
    "Huhtikuu", "Toukokuu", "Kesäkuu",
    "Heinäkuu", "Elokuu", "Syyskuu",
    "Lokakuu", "Marraskuu", "Joulukuu"
  ];

  useEffect(() => {
    if (view === "clock") {
      drawClock();
    }
  }, [events, view, filterCategory]);

  const addEvent = () => {
    setEvents([...events, newEvent]);
    setNewEvent({ startDate: "", endDate: "", category: "", name: "", details: "" });
  };

  const drawClock = () => {
    // Tyhjennä entiset elementit
    d3.select("#chart").selectAll("*").remove();

    // Suurempi kellon koko ja responsiivisuus
    const width = Math.min(window.innerWidth - 40, 1000);
    const height = width;
    const radius = Math.min(width, height) / 2 - 160;

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("max-width", "100%")
      .style("height", "auto")
      .style("background-color", "#ffffff")
      .style("border-radius", "8px")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
      .style("padding", "10px")
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Skaala 0 -> 2π
    const scale = d3
      .scaleTime()
      .domain([new Date("2025-01-01"), new Date("2025-12-31")])
      .range([0, 2 * Math.PI]);

    const arc = d3
      .arc()
      .innerRadius(radius - 100)
      .outerRadius(radius - 20)
      .startAngle((d) => scale(new Date(d.startDate)))
      .endAngle((d) => scale(new Date(d.endDate)));

    const filteredData = events.filter(
      (e) => !filterCategory || e.category === filterCategory
    );

    // Tapahtumien kaaret
    svg.selectAll(".event")
      .data(filteredData)
      .enter()
      .append("path")
      .attr("class", "event")
      .attr("d", arc)
      .attr("fill", "steelblue")
      .on("mouseover", (evt, d) => {
        tooltip.transition().style("opacity", 1);
        tooltip.html(
          `<strong>${d.name}</strong><br/>
           Kategoria: ${d.category}<br/>
           Alku: ${d.startDate}<br/>
           Loppu: ${d.endDate}<br/>
           ${d.details}`
        );
      })
      .on("mousemove", (evt) => {
        tooltip
          .style("left", evt.pageX + 10 + "px")
          .style("top", evt.pageY + 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().style("opacity", 0);
      });

    // Muokataan viikkonumeroiden tyylejä
    for (let i = 1; i <= 52; i++) {
      const angle = (i / 52) * 2 * Math.PI - Math.PI / 2;
      const x = (radius + 50) * Math.cos(angle);
      const y = (radius + 50) * Math.sin(angle);
      svg
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "12px")
        .style("fill", "#666")
        .text(i);
    }

    // Muokataan kuukausien nimiä
    const monthBoundaries = Array.from({ length: 12 }, (_, i) => new Date(2025, i, 1));
    monthBoundaries.forEach((boundaryDate, i) => {
      const boundaryAngle = scale(boundaryDate) - Math.PI / 2;
      const x2 = radius * Math.cos(boundaryAngle);
      const y2 = radius * Math.sin(boundaryAngle);

      // Viiva
      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "#ddd")
        .attr("stroke-width", 1);

      // Kuukauden nimi
      const labelX = (radius + 110) * Math.cos(boundaryAngle);
      const labelY = (radius + 110) * Math.sin(boundaryAngle);
      
      svg
        .append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(monthNames[i]);
    });

    // Lisätään taustaympyrät
    svg
      .append("circle")
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "#eee")
      .attr("stroke-width", 100);

    svg
      .append("circle")
      .attr("r", radius - 120)
      .attr("fill", "none")
      .attr("stroke", "#f8f8f8")
      .attr("stroke-width", 80);
  };

  return (
    <div style={{
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <h1 style={{ 
          marginBottom: "30px",
          color: "#333",
          fontSize: "32px"
        }}>
          Vuosikello
        </h1>
        
        <div style={{
          display: "flex",
          gap: "15px",
          marginBottom: "30px"
        }}>
          <button 
            onClick={() => setView("clock")}
            style={viewButtonStyle(view === "clock")}
          >
            Näytä vuosikello
          </button>
          <button 
            onClick={() => setView("editor")}
            style={viewButtonStyle(view === "editor")}
          >
            Muokkaa tapahtumia
          </button>
        </div>

        {view === "clock" ? (
          <>
            <div style={{ 
              marginBottom: "30px",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              width: "100%",
              maxWidth: "600px"
            }}>
              <h3 style={{ marginBottom: "15px" }}>Suodata tapahtumia</h3>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={selectStyle}
              >
                <option value="">Kaikki kategoriat</option>
                {[...new Set(events.map((ev) => ev.category))].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ 
              marginBottom: "30px",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              width: "100%",
              maxWidth: "600px"
            }}>
              <h3 style={{ marginBottom: "15px" }}>Lisää tapahtuma</h3>
              <div style={{ 
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "15px"
              }}>
                <input
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="date"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Kategoria"
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Tapahtuman nimi"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Lisätiedot"
                  value={newEvent.details}
                  onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })}
                  style={{ ...inputStyle, gridColumn: "1 / -1" }}
                />
              </div>
              <button 
                onClick={addEvent}
                style={addButtonStyle}
              >
                Lisää tapahtuma
              </button>
            </div>

            <div id="chart" style={{ 
              margin: "40px auto",
              padding: "40px",
              maxWidth: "100%",
              overflow: "hidden",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }} />
          </>
        ) : (
          <EventEditor events={events} setEvents={setEvents} />
        )}
      </div>
    </div>
  );
};

// Lisää tyylimäärittelyt
const viewButtonStyle = (isActive) => ({
  padding: "12px 24px",
  backgroundColor: isActive ? "#2196F3" : "#fff",
  color: isActive ? "#fff" : "#333",
  border: "1px solid #2196F3",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "all 0.3s ease"
});

const selectStyle = {
  padding: "8px 12px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
  width: "100%",
  maxWidth: "300px"
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

const inputStyle = {
  padding: "8px 12px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
  width: "100%"
};

const deleteButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#ff4444",
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
  display: "block",
  margin: "30px auto 0"
};

export default Vuosikello;
