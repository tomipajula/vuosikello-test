import React, { useEffect, useState } from 'react';
import { projectsService } from '../services/cosmosdb';

interface Project {
    id: string;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await projectsService.getAll();
                setProjects(data);
                setLoading(false);
            } catch (err) {
                setError('Projektien lataaminen epäonnistui');
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    if (loading) return <div>Ladataan projekteja...</div>;
    if (error) return <div>Virhe: {error}</div>;

    return (
        <div>
            <h2>Projektit</h2>
            {projects.map(project => (
                <div key={project.id}>
                    <h3>{project.name}</h3>
                    {project.description && <p>{project.description}</p>}
                    {project.startDate && (
                        <p>Alkaa: {new Date(project.startDate).toLocaleDateString('fi-FI')}</p>
                    )}
                    {project.endDate && (
                        <p>Päättyy: {new Date(project.endDate).toLocaleDateString('fi-FI')}</p>
                    )}
                </div>
            ))}
        </div>
    );
}; 