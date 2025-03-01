/**
 * Styles - Sovelluksen tyylimäärittelyt
 * 
 * Tämä tiedosto sisältää sovelluksen keskitetyt tyylimäärittelyt.
 * Tyylimäärittelyt on jaettu loogisiin ryhmiin (painikkeet, lomake-elementit, paneelit)
 * ja ne ovat käytettävissä kaikissa sovelluksen komponenteissa. Tämä mahdollistaa
 * yhtenäisen ulkoasun koko sovelluksessa ja helpottaa tyylien päivittämistä.
 */

// Tyylimäärittelyt

export const styles = {
  // Painikkeet
  viewButton: (isActive) => ({
    padding: "12px 24px",
    backgroundColor: isActive ? "#2196F3" : "#fff",
    color: isActive ? "#fff" : "#333",
    border: "1px solid #2196F3",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease"
  }),

  categoryButton: (isSelected) => ({
    padding: "8px 16px",
    backgroundColor: isSelected ? "#2196F3" : "#fff",
    color: isSelected ? "#fff" : "#333",
    border: "1px solid #2196F3",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease"
  }),

  addButton: {
    padding: "10px 20px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    display: "block",
    margin: "0 auto"
  },

  deleteButton: {
    padding: "8px 16px",
    backgroundColor: "#ff4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  },

  saveButton: {
    padding: "12px 24px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    display: "block",
    margin: "30px auto 0"
  },

  // Lomake-elementit
  input: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    width: "100%"
  },

  select: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    width: "100%",
    maxWidth: "300px"
  },

  // Paneelien tyylit
  panel: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    flex: 1,
    margin: "0 20px"
  },

  // Kategorioiden värit
  categoryColors: {
    "Markkinointi": "#7FB3D5",
    "Talous": "#F9E79F",
    "Henkilöstöhallinto": "#A3E4D7",
    "Yhteiset tapahtumat": "#D7BDE2"
  }
}; 