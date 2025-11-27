import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

export interface Project {
  id: number;
  nombreProyecto: string;
  administrador: {
    id: number;
    nombreUsuario?: string;
  };
}

interface ProjectContextType {
  projects: Project[];
  getProjectById: (id: number) => Project | undefined;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get("/proyecto/all");
      const projectsBackend = response.data as Project[];
      
      setProjects(projectsBackend);
      console.log("Proyectos cargados:", projectsBackend);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getProjectById = useCallback((id: number): Project | undefined => {
    const project = projects.find(project => project.id === id);
    if (project) {
      console.log("Proyecto encontrado:", project);
    }
    return project;
  }, [projects]);

  const refreshProjects = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  return (
    <ProjectContext.Provider value={{ projects, getProjectById, refreshProjects }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
