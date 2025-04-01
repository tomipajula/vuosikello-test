import React, { useState, useEffect } from 'react';
import ProjectForm from './ProjectForm';
import jp from '../services/cosmosDbService';

/**
 * ProjectSelector-komponentti
 * 
 * Tämä komponentti näyttää listan projekteista ja mahdollistaa projektin valinnan.
 * Sisältää myös hakutoiminnon projektien suodattamiseen.
 */
const ProjectSelector = ({ onSelectProject }) => {
  // Haetaan projektilista tietokannasta
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hakutoiminto
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  
  // Projektin luominen
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Haetaan projektit tietokannasta
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let projects = await jp.getProjects();
        
        // Jos projekteja ei löydy, luodaan oletusprojektit
        if (projects.length === 0) {
          const defaultProjects = [
            { id: "1", name: "Markkinointiprojekti 2025", description: "Markkinoinnin vuosisuunnitelma ja tapahtumat" },
            { id: "2", name: "Tuotekehitys Q1-Q2/2025", description: "Tuotekehityksen aikataulu ja virstanpylväät" },
            { id: "3", name: "Henkilöstöhallinto 2025", description: "HR-tapahtumat ja koulutukset" },
            { id: "4", name: "Myyntistrategia 2025", description: "Myynnin tapahtumat ja tavoitteet" },
            { id: "5", name: "IT-infrastruktuuri 2025", description: "IT-järjestelmien päivitykset ja huollot" }
          ];
          
          // Tallennetaan oletusprojektit tietokantaan
          projects = await jp.saveProjects(defaultProjects);
        }
        
        setProjects(projects);
        setFilteredProjects(projects);
      } catch (error) {
        console.error("Virhe projektien haussa:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  // Päivitä suodatetut projektit kun hakutermi muuttuu
  useEffect(() => {
    const results = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(results);
  }, [searchTerm, projects]);
  
  // Käsittele uuden projektin tallennus
  const handleSaveProject = async (newProject) => {
    try {
      // Tallenna uusi projekti
      const savedProjects = await jp.saveProjects([...projects, newProject]);
      
      // Päivitä projektilistaus
      setProjects(savedProjects);
      
      // Valitse uusi projekti
      const savedProject = savedProjects.find(p => p.id === newProject.id || p.name === newProject.name);
      onSelectProject(savedProject || newProject);
      
      // Sulje lomake
      setIsCreatingProject(false);
    } catch (error) {
      console.error("Virhe projektin tallennuksessa:", error);
    }
  };

  // Jos käyttäjä on luomassa uutta projektia, näytä projektin luomislomake
  if (isCreatingProject) {
    return (
      <ProjectForm 
        onSave={handleSaveProject} 
        onCancel={() => setIsCreatingProject(false)} 
      />
    );
  }

  // Jos projekteja ladataan, näytä latausilmoitus
  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Vuosikello</h1>
        <p style={styles.loading}>Ladataan projekteja...</p>
      </div>
    );
  }

  // Muuten näytä projektilista
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Vuosikello</h1>
      <h2 style={styles.subtitle}>Valitse projekti</h2>
      
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Hae projekteja..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      
      <div style={styles.projectsContainer}>
        {filteredProjects.map(project => (
          <div
            key={project.id}
            style={{
              ...styles.projectCard,
              ...(hoveredProjectId === project.id ? styles.projectCardHover : {})
            }}
            onClick={() => onSelectProject(project)}
            onMouseEnter={() => setHoveredProjectId(project.id)}
            onMouseLeave={() => setHoveredProjectId(null)}
          >
            <h3 style={styles.projectName}>{project.name}</h3>
            <p style={styles.projectDescription}>{project.description}</p>
          </div>
        ))}
        
        <div
          style={{
            ...styles.projectCard,
            ...styles.newProjectCard,
            ...(hoveredProjectId === "new" ? styles.projectCardHover : {})
          }}
          onClick={() => setIsCreatingProject(true)}
          onMouseEnter={() => setHoveredProjectId("new")}
          onMouseLeave={() => setHoveredProjectId(null)}
        >
          <h3 style={styles.projectName}>+ Uusi projekti</h3>
          <p style={styles.projectDescription}>Luo uusi vuosikellokokonaisuus</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif"
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "10px"
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    fontWeight: "normal",
    marginBottom: "30px"
  },
  searchContainer: {
    marginBottom: "30px"
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box"
  },
  projectsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px"
  },
  projectCard: {
    padding: "20px",
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer"
  },
  projectCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
  },
  newProjectCard: {
    backgroundColor: "#f9f9f9",
    border: "2px dashed #ddd"
  },
  projectName: {
    margin: "0 0 10px 0",
    color: "#333"
  },
  projectDescription: {
    margin: "0",
    color: "#666",
    fontSize: "14px"
  },
  loading: {
    textAlign: "center",
    color: "#666",
    fontSize: "16px"
  }
};

export default ProjectSelector; 