import { useState, useEffect, useCallback } from 'react';
import { api, Project, ProjectCreateRequest, ProjectUpdateRequest, APIError } from '@/lib/api';

export interface UseProjectsOptions {
  autoFetch?: boolean;
  page?: number;
  limit?: number;
}

export interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  total: number;
  
  // Actions
  fetchProjects: (page?: number) => Promise<void>;
  createProject: (project: ProjectCreateRequest) => Promise<Project | null>;
  updateProject: (id: number, updates: ProjectUpdateRequest) => Promise<Project | null>;
  deleteProject: (id: number) => Promise<boolean>;
  refreshProjects: () => Promise<void>;
  clearError: () => void;
}

export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
  const { autoFetch = true, page = 1, limit = 10 } = options;
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProjects = useCallback(async (pageNumber = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getProjects(pageNumber, limit);
      
      if (response.success) {
        setProjects(response.data);
        setCurrentPage(response.meta.page);
        setTotalPages(response.meta.total_pages);
        setTotal(response.meta.total);
      } else {
        throw new Error(response.error || 'Failed to fetch projects');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  const createProject = useCallback(async (projectData: ProjectCreateRequest): Promise<Project | null> => {
    try {
      setError(null);
      
      const response = await api.createProject(projectData);
      
      if (response.success && response.data) {
        // Add the new project to the beginning of the list
        setProjects(prev => [response.data!, ...prev]);
        setTotal(prev => prev + 1);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create project');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      console.error('Error creating project:', err);
      return null;
    }
  }, []);

  const updateProject = useCallback(async (id: number, updates: ProjectUpdateRequest): Promise<Project | null> => {
    try {
      setError(null);
      
      const response = await api.updateProject(id, updates);
      
      if (response.success && response.data) {
        // Update the project in the list
        setProjects(prev => 
          prev.map(project => 
            project.id === id ? response.data! : project
          )
        );
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update project');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      console.error('Error updating project:', err);
      return null;
    }
  }, []);

  const deleteProject = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await api.deleteProject(id);
      
      if (response.success) {
        // Remove the project from the list
        setProjects(prev => prev.filter(project => project.id !== id));
        setTotal(prev => prev - 1);
        return true;
      } else {
        throw new Error(response.error || 'Failed to delete project');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      console.error('Error deleting project:', err);
      return false;
    }
  }, []);

  const refreshProjects = useCallback(async () => {
    await fetchProjects(currentPage);
  }, [fetchProjects, currentPage]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchProjects(page);
    }
  }, [autoFetch, page, fetchProjects]);

  return {
    projects,
    loading,
    error,
    totalPages,
    currentPage,
    total,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
    clearError,
  };
}

// Hook for managing a single project
export interface UseProjectOptions {
  projectId: number;
  autoFetch?: boolean;
}

export interface UseProjectReturn {
  project: Project | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProject: () => Promise<void>;
  updateProject: (updates: ProjectUpdateRequest) => Promise<Project | null>;
  deleteProject: () => Promise<boolean>;
  refreshProject: () => Promise<void>;
  clearError: () => void;
}

export function useProject({ projectId, autoFetch = true }: UseProjectOptions): UseProjectReturn {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getProject(projectId);
      
      if (response.success && response.data) {
        setProject(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch project');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch project';
      setError(errorMessage);
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const updateProject = useCallback(async (updates: ProjectUpdateRequest): Promise<Project | null> => {
    try {
      setError(null);
      
      const response = await api.updateProject(projectId, updates);
      
      if (response.success && response.data) {
        setProject(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update project');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      console.error('Error updating project:', err);
      return null;
    }
  }, [projectId]);

  const deleteProject = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await api.deleteProject(projectId);
      
      if (response.success) {
        setProject(null);
        return true;
      } else {
        throw new Error(response.error || 'Failed to delete project');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      console.error('Error deleting project:', err);
      return false;
    }
  }, [projectId]);

  const refreshProject = useCallback(async () => {
    await fetchProject();
  }, [fetchProject]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && projectId) {
      fetchProject();
    }
  }, [autoFetch, projectId, fetchProject]);

  return {
    project,
    loading,
    error,
    fetchProject,
    updateProject,
    deleteProject,
    refreshProject,
    clearError,
  };
}