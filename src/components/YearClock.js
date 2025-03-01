/**
 * YearClock - Vuosikellonäkymän komponentti
 * 
 * Tämä komponentti piirtää vuosikellon, joka näyttää tapahtumat ympyränmuotoisella
 * aikajanalla. Tapahtumat on järjestetty kuukausittain ja värikoodattu kategorioiden
 * mukaan. Käyttäjä voi valita kuukauden klikkaamalla sitä, ja tapahtuman tiedot
 * näytetään, kun hiiri viedään tapahtuman päälle.
 */

import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

const YearClock = ({ events, categories, monthNames, setSelectedMonth, setSelectedEvent, setShowEventDetails, selectedCategories, categoryColors }) => {
  const clockContainerRef = useRef(null);

  useEffect(() => {
    drawClock();
    
    // Lisätään ikkunan koon muutoksen kuuntelija
    window.addEventListener('resize', handleResize);
    
    // Poistetaan kuuntelija kun komponentti unmountataan
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [events, selectedCategories]);

  useEffect(() => {
    d3.select("#tooltip").remove();
    
    d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
      .style("font-size", "14px")
      .style("z-index", "1000");
  }, []);

  const handleResize = () => {
    drawClock();
  };

  const findOverlappingEvents = (events) => {
    const overlaps = new Map();
    events.forEach((event, i) => {
      const key = event.category;
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      
      if (!overlaps.has(key)) {
        overlaps.set(key, []);
      }

      const categoryEvents = events.filter((e, index) => 
        index < i && e.category === event.category &&
        new Date(e.startDate) <= end && new Date(e.endDate) >= start
      );

      overlaps.get(key).push({
        event,
        level: categoryEvents.length
      });
    });

    return overlaps;
  };

  const drawClock = () => {
    // Tyhjennä aiempi sisältö
    d3.select("#vuosikello").selectAll("*").remove();

    // Suodata tapahtumat valittujen kategorioiden mukaan
    const filteredEvents = events.filter(event => 
      selectedCategories ? selectedCategories.has(event.category) : true
    );

    const container = clockContainerRef.current;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    // Käytetään kiinteää kokoa
    const size = 1000;
    
    const margin = 140;
    const radius = (size - 2 * margin) / 2;
    
    // Luodaan SVG-elementti ja keskitetty g-elementti erikseen
    const svg = d3.select("#vuosikello")
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .attr("viewBox", `0 0 ${size} ${size}`)
      .style("display", "block")
      .style("margin", "auto");
    
    // Luodaan keskitetty ryhmä
    const g = svg.append("g")
      .attr("transform", `translate(${size/2}, ${size/2})`);

    // Piirretään keskiympyrä
    g.append("circle")
      .attr("r", radius * 0.65)
      .attr("fill", "white")
      .attr("stroke", "#f5f5f5")
      .attr("stroke-width", "2");

    const tooltip = d3.select("#tooltip");

    const scale = d3
      .scaleTime()
      .domain([new Date("2025-01-01"), new Date("2025-12-31")])
      .range([0, 2 * Math.PI]);

    const categoryRadii = {};

    const ringWidth = 45;
    const ringSpacing = 15;
    const innerOffset = 20;

    const sortedCategories = [...categories].sort();
    
    sortedCategories.forEach((category, index) => {
      const maxRadius = radius - innerOffset;
      const totalWidth = (categories.length - 1) * (ringWidth + ringSpacing);
      
      const outerRadius = maxRadius - (index * (ringWidth + ringSpacing));
      categoryRadii[category] = {
        inner: outerRadius - ringWidth,
        outer: outerRadius
      };
    });

    // Käytetään App.js:stä tulevaa categoryColors-objektia
    // Jos categoryColors-propsia ei ole annettu, käytetään varavärejä
    const baseColors = [
      "#7FB3D5",
      "#F9E79F",
      "#A3E4D7",
      "#D7BDE2",
      "#F5B7B1"
    ];

    // Varmistetaan, että jokaisella kategorialla on väri
    if (!categoryColors) {
      const tempCategoryColors = {};
      sortedCategories.forEach((category, index) => {
        tempCategoryColors[category] = baseColors[index % baseColors.length];
      });
      categoryColors = tempCategoryColors;
    }

    const arc = d3
      .arc()
      .startAngle((d) => scale(new Date(d.startDate)))
      .endAngle((d) => scale(new Date(d.endDate)));

    sortedCategories.forEach(category => {
      const { inner, outer } = categoryRadii[category];
      
      g.append("path")
        .attr("d", d3.arc()
          .innerRadius(inner)
          .outerRadius(outer)
          .startAngle(0)
          .endAngle(2 * Math.PI)
        )
        .attr("fill", categoryColors[category])
        .attr("opacity", 0.1)
        .attr("stroke", categoryColors[category])
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.3);

      const radius_text = (inner + outer) / 2;
      const textArc = d3.arc()
        .innerRadius(radius_text)
        .outerRadius(radius_text)
        .startAngle(-Math.PI/2)
        .endAngle(Math.PI/2);

      g.append("defs")
      .append("path")
        .attr("id", `textPath-${category}`)
        .attr("d", textArc());

      g.append("text")
        .append("textPath")
        .attr("href", `#textPath-${category}`)
        .attr("startOffset", "25%")
        .style("font-size", "14px")
        .style("fill", "#333")
        .style("text-anchor", "middle")
        .text(category);
    });

    const overlappingEvents = findOverlappingEvents(filteredEvents);

    filteredEvents.forEach(d => {
      if (!categoryRadii[d.category]) return;

      const eventGroup = g.append("g")
        .attr("class", "event-group");

      const eventData = overlappingEvents.get(d.category).find(e => e.event === d);
      const level = eventData ? eventData.level : 0;

      const ringHeight = categoryRadii[d.category].outer - categoryRadii[d.category].inner;
      const segmentHeight = ringHeight / 3;

      const baseInnerRadius = categoryRadii[d.category].inner;
      let innerRadius, outerRadius;

      switch(level % 3) {
        case 0:
          innerRadius = baseInnerRadius;
          outerRadius = baseInnerRadius + segmentHeight;
          break;
        case 1:
          innerRadius = baseInnerRadius + segmentHeight;
          outerRadius = baseInnerRadius + (2 * segmentHeight);
          break;
        case 2:
          innerRadius = baseInnerRadius + (2 * segmentHeight);
          outerRadius = baseInnerRadius + (3 * segmentHeight);
          break;
      }

      eventGroup.append("path")
        .attr("d", () => {
          arc.innerRadius(innerRadius);
          arc.outerRadius(outerRadius);
          return arc(d);
        })
        .attr("fill", categoryColors[d.category])
        .attr("opacity", 1)
        .style("cursor", "pointer")
        .on("mouseenter", function(event) {
          d3.select(this)
            .attr("opacity", 0.7)
            .attr("stroke-width", 2);
          
          d3.select("#tooltip")
            .style("opacity", 1)
            .style("left", event.pageX + "px")
            .style("top", (event.pageY - 40) + "px")
            .html(`
              <div style="font-weight: bold; margin-bottom: 5px;">${d.name}</div>
              <div style="color: #666;">Kategoria: ${d.category}</div>
              <div style="color: #666; font-size: 12px; margin-top: 5px;">Klikkaa nähdäksesi lisätiedot</div>
            `);
        })
        .on("mouseleave", function() {
          d3.select(this)
            .attr("opacity", 1)
            .attr("stroke-width", 1);
          d3.select("#tooltip").style("opacity", 0);
        })
        .on("click", function(event) {
          event.stopPropagation();
          setSelectedEvent(d);
          setShowEventDetails(true);
        });
    });

    const monthBoundaries = Array.from({ length: 12 }, (_, i) => new Date(2025, i, 1));
    monthBoundaries.forEach((boundaryDate, i) => {
      const boundaryAngle = scale(boundaryDate) - Math.PI / 2;
      const x2 = radius * Math.cos(boundaryAngle);
      const y2 = radius * Math.sin(boundaryAngle);

      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "#ddd")
        .attr("stroke-width", 1);

      const monthGroup = g
        .append("g")
        .attr("class", "month-group")
        .style("cursor", "pointer");

      const labelX = (radius + 85) * Math.cos(boundaryAngle);
      const labelY = (radius + 85) * Math.sin(boundaryAngle);
      
      const textAngle = (boundaryAngle + Math.PI / 2) * (180 / Math.PI);
      const adjustedAngle = textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle;

      monthGroup
        .append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("transform", `rotate(${adjustedAngle}, ${labelX}, ${labelY})`)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(monthNames[i]);

      const buttonX = (radius + 115) * Math.cos(boundaryAngle);
      const buttonY = (radius + 115) * Math.sin(boundaryAngle);

      const agendaButton = monthGroup
        .append("g")
        .attr("class", "agenda-button")
        .attr("transform", `translate(${buttonX}, ${buttonY})`)
        .style("opacity", 0)
        .style("pointer-events", "none");

      agendaButton
        .append("rect")
        .attr("x", -60)
        .attr("y", -15)
        .attr("width", 120)
        .attr("height", 30)
        .attr("rx", 15)
        .attr("fill", "#2196F3")
        .attr("opacity", 0.9)
        .attr("transform", `rotate(${adjustedAngle}, 0, 0)`);

      agendaButton
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")
        .style("font-size", "12px")
        .attr("transform", `rotate(${adjustedAngle}, 0, 0)`)
        .text("Näytä agenda");

      monthGroup
        .on("mouseenter", function() {
          agendaButton
            .style("opacity", 1)
            .style("pointer-events", "all")
            .transition()
            .duration(200);
        })
        .on("mouseleave", function() {
          agendaButton
            .style("opacity", 0)
            .style("pointer-events", "none")
            .transition()
            .duration(200);
        });

      monthGroup
        .on("click", function() {
          setSelectedMonth(i);
        });

      agendaButton
        .on("click", function(event) {
          event.stopPropagation();
          setSelectedMonth(i);
        });
    });

    for (let i = 1; i <= 52; i++) {
      const angle = (i / 52) * 2 * Math.PI - Math.PI / 2;
      const x = (radius + 45) * Math.cos(angle);
      const y = (radius + 45) * Math.sin(angle);
      g.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "13px")
        .style("fill", "#666")
        .text(i);
    }

    const today = new Date();
    const todayAngle = scale(today) - Math.PI / 2;
    const lineLength = radius + 50;

    g.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", lineLength * Math.cos(todayAngle))
      .attr("y2", lineLength * Math.sin(todayAngle))
      .attr("stroke", "rgba(231, 76, 60, 0.3)")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", "4,4")
      .style("filter", "drop-shadow(0 0 1px rgba(231, 76, 60, 0.2))");

    g.append("circle")
      .attr("cx", (radius - 10) * Math.cos(todayAngle))
      .attr("cy", (radius - 10) * Math.sin(todayAngle))
      .attr("r", 3)
      .attr("fill", "rgba(231, 76, 60, 0.3)")
      .style("filter", "drop-shadow(0 0 1px rgba(231, 76, 60, 0.2))");

    setInterval(() => {
      const now = new Date();
      const currentAngle = scale(now) - Math.PI / 2;
      
      g.select("line")
        .attr("x2", lineLength * Math.cos(currentAngle))
        .attr("y2", lineLength * Math.sin(currentAngle));

      g.select("circle")
        .attr("cx", (radius - 10) * Math.cos(currentAngle))
        .attr("cy", (radius - 10) * Math.sin(currentAngle));
    }, 60000);
  };

  const updateVisibleEvents = (selectedCategories) => {
    const filteredEvents = events.filter(event => selectedCategories.has(event.category));
    drawClock(filteredEvents);
  };

  return (
    <div style={{ 
      backgroundColor: "white",
      padding: "0px",
      paddingBottom: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
      flex: 1,
      margin: "0 auto",
      height: "100%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      width: "100%",
      marginTop: "-50px"
    }}>
      {/* Vuosikello */}
      <div 
        ref={clockContainerRef}
        style={{
          width: "100%",
          maxWidth: "1200px",
          aspectRatio: "1",
          position: "relative",
          margin: "-30px auto 0"
        }}
      >
        <div id="vuosikello" style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}></div>
      </div>
    </div>
  );
};

export default YearClock; 