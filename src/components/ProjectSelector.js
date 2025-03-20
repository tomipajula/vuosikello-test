import React, { useState, useEffect } from 'react';
import ProjectForm from './ProjectForm';

/**
 * ProjectSelector-komponentti
 * 
 * Tämä komponentti näyttää listan projekteista ja mahdollistaa projektin valinnan.
 * Sisältää myös hakutoiminnon projektien suodattamiseen.
 */
const ProjectSelector = ({ onSelectProject }) => {
  // Haetaan projektilista local storagesta tai käytetään oletuslistaa
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [
      { id: 1, name: "Markkinointiprojekti 2025", description: "Markkinoinnin vuosisuunnitelma ja tapahtumat" },
      { id: 2, name: "Tuotekehitys Q1-Q2/2025", description: "Tuotekehityksen aikataulu ja virstanpylväät" },
      { id: 3, name: "Henkilöstöhallinto 2025", description: "HR-tapahtumat ja koulutukset" },
      { id: 4, name: "Myyntistrategia 2025", description: "Myynnin tapahtumat ja tavoitteet" },
      { id: 5, name: "IT-infrastruktuuri 2025", description: "IT-järjestelmien päivitykset ja huollot" }
    ];
  });

  // Hakutoiminto
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  
  // Projektin luominen
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Päivitä suodatetut projektit kun hakutermi muuttuu
  useEffect(() => {
    const results = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(results);
  }, [searchTerm, projects]);
  
  // Tallenna projektit local storageen kun ne muuttuvat
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);
  
  // Käsittele uuden projektin tallennus
  const handleSaveProject = (newProject) => {
    // Lisää uusi projekti listaan
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    
    // Tallenna projektit local storageen
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    // Valitse uusi projekti
    onSelectProject(newProject);
    
    // Sulje lomake
    setIsCreatingProject(false);
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
      
      <div style={styles.projectList}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
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
          ))
        ) : (
          <div style={styles.noResults}>
            Ei hakutuloksia. Kokeile toista hakutermiä.
          </div>
        )}
      </div>
      
      <div style={styles.createNewProject}>
        <button 
          style={styles.newProjectButton}
          onClick={() => setIsCreatingProject(true)}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          + Luo uusi projekti
        </button>
      </div>
    </div>
  );
};

// Tyylit
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    textAlign: 'center'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    color: '#333'
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '30px',
    color: '#666',
    fontWeight: 'normal'
  },
  searchContainer: {
    marginBottom: '30px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '30px',
    border: '1px solid #ddd',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    outline: 'none'
  },
  projectList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textAlign: 'left',
    border: '1px solid #eee'
  },
  projectCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
  },
  projectName: {
    fontSize: '1.2rem',
    marginBottom: '10px',
    color: '#333'
  },
  projectDescription: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '0'
  },
  noResults: {
    gridColumn: '1 / -1',
    padding: '30px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    color: '#666'
  },
  createNewProject: {
    marginTop: '20px'
  },
  newProjectButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '30px',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'background-color 0.2s'
  }
};

export default ProjectSelector; 