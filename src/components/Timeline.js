import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

/**
 * Timeline - Aikajananäkymän komponentti
 * 
 * Tämä komponentti näyttää tapahtumat aikajanalla valitun vuoden mukaan.
 * Käyttäjä voi valita näytettävän vuoden pudotusvalikosta. Tapahtumat näytetään
 * kategorioidensa mukaisesti värikoodattuina palkkeina aikajanalla. Tapahtumien
 * tiedot näytetään, kun hiiri viedään tapahtuman päälle.
 */

const Timeline = ({ events, categoryColors }) => {
  const [selectedYear, setSelectedYear] = useState("2025");

  useEffect(() => {
    drawTimeline();
  }, [events, selectedYear]);

  const drawTimeline = () => {
    d3.select("#timeline").selectAll("*").remove();

    // Suodatetaan tapahtumat valitun vuoden mukaan
    const yearEvents = events.filter(event => 
      new Date(event.startDate).getFullYear().toString() === selectedYear ||
      new Date(event.endDate).getFullYear().toString() === selectedYear
    );

    const margin = { top: 50, right: 50, bottom: 80, left: 150 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#timeline")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Aikaskaala
    const timeScale = d3.scaleTime()
      .domain([new Date(`${selectedYear}-01-01`), new Date(`${selectedYear}-12-31`)])
      .range([0, width]);

    // Kategorioiden skaala
    const categories = [...new Set(yearEvents.map(e => e.category))].sort();
    const categoryScale = d3.scaleBand()
      .domain(categories)
      .range([0, height])
      .padding(0.3);

    // Akselit
    const xAxis = d3.axisBottom(timeScale)
      .tickFormat(d3.timeFormat("%d.%m."))
      .ticks(d3.timeMonth.every(1))
      .tickSize(-height);

    const yAxis = d3.axisLeft(categoryScale)
      .tickSize(-width);

    // Piirretään apuviivat ja akselit
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("line")
      .style("stroke", "#e0e0e0");

    svg.append("g")
      .attr("class", "grid")
      .call(yAxis)
      .selectAll("line")
      .style("stroke", "#e0e0e0");

    // Tyylit akseleille
    svg.selectAll(".domain")
      .style("stroke", "#ccc");
    
    svg.selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#666");

    // Lisätään nykyisen päivän viiva
    const today = new Date();
    if (today.getFullYear().toString() === selectedYear) {
      svg.append("line")
        .attr("x1", timeScale(today))
        .attr("x2", timeScale(today))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "rgba(255, 0, 0, 0.2)")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4");

      svg.append("text")
        .attr("x", timeScale(today))
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "rgba(255, 0, 0, 0.5)")
        .text(today.toLocaleDateString('fi-FI'));
    }

    // Piirretään tapahtumat
    yearEvents.forEach(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const y = categoryScale(event.category);
      const x = timeScale(startDate);
      const width = Math.max(timeScale(endDate) - timeScale(startDate), 10);

      const eventGroup = svg.append("g")
        .attr("class", "event-group")
        .style("cursor", "pointer");

      eventGroup.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", categoryScale.bandwidth())
        .attr("fill", categoryColors[event.category])
        .attr("opacity", 0.7)
        .attr("rx", 6)
        .attr("stroke", d3.color(categoryColors[event.category]).darker(0.5))
        .attr("stroke-width", 1)
        .on("mouseover", function(e) {
          d3.select(this)
            .attr("opacity", 1)
            .attr("stroke-width", 2);
          
          d3.select("#tooltip")
            .style("opacity", 1)
            .style("left", (e.pageX + 10) + "px")
            .style("top", (e.pageY - 10) + "px")
            .html(`
              <div style="font-weight: bold; margin-bottom: 5px;">${event.name}</div>
              <div style="color: #666;">Kategoria: ${event.category}</div>
              <div style="color: #666;">${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}</div>
              <div style="color: #666; font-style: italic;">${event.details}</div>
            `);
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("opacity", 0.7)
            .attr("stroke-width", 1);
          d3.select("#tooltip").style("opacity", 0);
        });

      // Lisätään tapahtuman nimi
      eventGroup.append("text")
        .attr("x", x + 8)
        .attr("y", y + categoryScale.bandwidth() / 2)
        .attr("dy", ".35em")
        .text(event.name)
        .style("fill", "#333")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("pointer-events", "none");

      // Lisätään päivämäärät tapahtuman alle
      eventGroup.append("text")
        .attr("x", x + 8)
        .attr("y", y + categoryScale.bandwidth() - 6)
        .text(`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`)
        .style("fill", "#666")
        .style("font-size", "10px")
        .style("pointer-events", "none");
    });
  };

  // Haetaan kaikki vuodet tapahtumista
  const availableYears = [...new Set(events.flatMap(event => [
    new Date(event.startDate).getFullYear(),
    new Date(event.endDate).getFullYear()
  ]))].sort();

  return (
    <div style={{ 
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      maxWidth: "1100px",
      margin: "0 auto"
    }}>
      <div style={{
        marginBottom: "20px",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        alignItems: "center"
      }}>
        <label style={{ 
          fontSize: "14px",
          color: "#666"
        }}>
          Valitse vuosi:
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontSize: "14px",
            cursor: "pointer"
          }}
        >
          {availableYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div id="timeline"></div>
    </div>
  );
};

export default Timeline; 