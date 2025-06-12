'use client';

import { useState, useCallback } from 'react';
import { Project, ProjectCreateRequest, ProjectUpdateRequest } from '@/lib/api';
import { useProjects } from './useProjects';
import { toast } from 'sonner';

export interface UseProjectOperationsReturn {
  // State
  loading: boolean;
  error: string | null;
  
  // Operations
  createProject: (data: ProjectCreateRequest) => Promise<Project | null>;
  updateProject: (id: number, data: ProjectUpdateRequest) => Promise<Project | null>;
  deleteProject: (id: number) => Promise<boolean>;
  duplicateProject: (project: Project) => Promise<Project | null>;
  
  // Utilities
  clearError: () => void;
}

export function useProjectOperations(): UseProjectOperationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const projectsHook = useProjects({ autoFetch: false });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createProject = useCallback(async (data: ProjectCreateRequest): Promise<Project | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const project = await projectsHook.createProject(data);
      if (project) {
        toast.success('Project created successfully');
        return project;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [projectsHook]);

  const updateProject = useCallback(async (id: number, data: ProjectUpdateRequest): Promise<Project | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const project = await projectsHook.updateProject(id, data);
      if (project) {
        toast.success('Project updated successfully');
        return project;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [projectsHook]);

  const deleteProject = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const success = await projectsHook.deleteProject(id);
      if (success) {
        toast.success('Project deleted successfully');
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [projectsHook]);

  const duplicateProject = useCallback(async (project: Project): Promise<Project | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const duplicateData: ProjectCreateRequest = {
        title: `${project.title} (Copy)`,
        frame_size: project.frame_size,
        project_data: project.project_data,
      };
      
      const newProject = await projectsHook.createProject(duplicateData);
      if (newProject) {
        toast.success('Project duplicated successfully');
        return newProject;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate project';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [projectsHook]);

  return {
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    clearError,
  };
}