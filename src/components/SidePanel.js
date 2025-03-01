import React from 'react';

/**
 * SidePanel - Sivupaneelin komponentti
 * 
 * Tämä komponentti luo sivupaneelin, joka voidaan sijoittaa joko vasemmalle tai oikealle.
 * Paneeli voidaan avata ja sulkea, ja se sisältää painikkeen tilan vaihtamiseen.
 * Komponentti on yleiskäyttöinen ja voi sisältää mitä tahansa sisältöä children-propsin kautta.
 */

const SidePanel = ({ 
  isVisible, 
  setIsVisible, 
  children, 
  position = 'left' 
}) => {
  const toggleButtonPosition = position === 'left' 
    ? { left: isVisible ? "340px" : "20px" } 
    : { right: isVisible ? "340px" : "20px" };

  const panelPosition = position === 'left'
    ? { 
        left: isVisible ? 0 : "-320px",
        transform: `translateX(${isVisible ? 0 : '-100%'})`,
      }
    : { 
        right: isVisible ? 0 : "-320px",
        transform: `translateX(${isVisible ? 0 : '100%'})`,
      };

  const borderStyle = position === 'left'
    ? { 
        borderLeft: isVisible ? "none" : "1px solid #ddd",
        borderRadius: isVisible ? "0 4px 4px 0" : "4px",
      }
    : { 
        borderRight: isVisible ? "none" : "1px solid #ddd",
        borderRadius: isVisible ? "4px 0 0 4px" : "4px",
      };

  return (
    <>
      <div style={{
        position: "fixed",
        top: 0,
        width: "320px",
        height: "100vh",
        backgroundColor: "white",
        boxShadow: position === 'left' ? "2px 0 5px rgba(0,0,0,0.1)" : "-2px 0 5px rgba(0,0,0,0.1)",
        padding: "20px",
        overflowY: "auto",
        transition: position === 'left' ? "left 0.3s ease" : "right 0.3s ease",
        zIndex: 1000,
        overflow: "hidden",
        ...panelPosition
      }}>
        {children}
      </div>

      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: "fixed",
          top: "50%",
          transform: "translateY(-50%)",
          width: "20px",
          height: "60px",
          backgroundColor: "white",
          border: "1px solid #ddd",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          transition: position === 'left' ? "left 0.3s ease" : "right 0.3s ease",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          ...toggleButtonPosition,
          ...borderStyle
        }}
      >
        {position === 'left' 
          ? (isVisible ? "←" : "→") 
          : (isVisible ? "→" : "←")}
      </button>
    </>
  );
};

export default SidePanel; 