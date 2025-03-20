import React, { useState } from 'react';

/**
 * ProjectForm-komponentti
 * 
 * Tämä komponentti näyttää lomakkeen uuden projektin luomiseen.
 * Käyttäjä voi syöttää projektin nimen ja valita kategorioita.
 */
const ProjectForm = ({ onSave, onCancel }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  
  // Kategoriat - ei enää oletuskategorioita
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  
  const handleRemoveCategory = (categoryToRemove) => {
    setSelectedCategories(selectedCategories.filter(category => category !== categoryToRemove));
  };
  
  const handleAddCategory = () => {
    if (newCategory.trim() && !selectedCategories.includes(newCategory.trim())) {
      setSelectedCategories([...selectedCategories, newCategory.trim()]);
      setNewCategory('');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      alert('Projektin nimi on pakollinen!');
      return;
    }
    
    const newProject = {
      id: Date.now(), // Yksinkertainen uniikki ID
      name: projectName.trim(),
      description: projectDescription.trim(),
      categories: selectedCategories,
      createdAt: new Date().toISOString()
    };
    
    onSave(newProject);
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Luo uusi projekti</h1>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Projektin nimi *</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={styles.input}
            placeholder="Syötä projektin nimi"
            required
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Kuvaus</label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            style={styles.textarea}
            placeholder="Syötä projektin kuvaus"
            rows={3}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Lisää kategorioita</label>
          <div style={styles.newCategoryContainer}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={styles.categoryInput}
              placeholder="Kategorian nimi"
            />
            <button 
              type="button" 
              onClick={handleAddCategory}
              style={styles.addButton}
              disabled={!newCategory.trim()}
            >
              Lisää
            </button>
          </div>
        </div>
        
        {selectedCategories.length > 0 && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Lisätyt kategoriat</label>
            <div style={styles.categoriesContainer}>
              {selectedCategories.map(category => (
                <div key={category} style={styles.customCategoryItem}>
                  <span>{category}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category)}
                    style={styles.removeButton}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div style={styles.buttonContainer}>
          <button 
            type="button" 
            onClick={onCancel}
            style={styles.cancelButton}
          >
            Peruuta
          </button>
          <button 
            type="submit" 
            style={styles.saveButton}
          >
            Tallenna projekti
          </button>
        </div>
      </form>
    </div>
  );
};

// Tyylit
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    backgroundColor: 'white'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '30px',
    color: '#333',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#555'
  },
  input: {
    padding: '12px 15px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100%'
  },
  textarea: {
    padding: '12px 15px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100%',
    resize: 'vertical'
  },
  categoriesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px'
  },
  customCategoryItem: {
    padding: '8px 12px',
    backgroundColor: '#e6f7ff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px'
  },
  newCategoryContainer: {
    display: 'flex',
    gap: '10px'
  },
  categoryInput: {
    padding: '10px 15px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    flex: '1'
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  removeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ff4d4f',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '20px'
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  saveButton: {
    padding: '12px 24px',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  }
};

export default ProjectForm; 