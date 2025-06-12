'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectGrid } from './ProjectGrid';
import { ProjectSearch, ProjectSearchFilters } from './ProjectSearch';
import { NewProjectModal } from './NewProjectModal';
import { useProjects } from '@/hooks/useProjects';
import { Project, ProjectCreateRequest } from '@/lib/api';
import { 
  Plus, 
  RefreshCw, 
  TrendingUp, 
  Calendar,
  FrameIcon,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';

export function ProjectDashboard() {
  const router = useRouter();
  const {
    projects: allProjects,
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
  } = useProjects();

  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [searchFilters, setSearchFilters] = useState<ProjectSearchFilters | null>(null);

  // Set initial filtered projects
  useEffect(() => {
    if (!searchFilters) {
      setFilteredProjects(allProjects);
    }
  }, [allProjects, searchFilters]);

  // Handle project creation
  const handleCreateProject = async (projectData: ProjectCreateRequest) => {
    try {
      const newProject = await createProject(projectData);
      if (newProject) {
        setShowNewProjectModal(false);
        toast.success('Project created successfully!');
        // Optionally navigate to the new project
        // router.push(`/projects/${newProject.id}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  // Handle project actions
  const handleOpenProject = (project: Project) => {
    toast.success(`Opening project: ${project.title}`);
    // Navigate to project editor
    // router.push(`/projects/${project.id}`);
  };

  const handleEditProject = (project: Project) => {
    toast.info(`Editing project: ${project.title}`);
    // Navigate to project editor in edit mode
    // router.push(`/projects/${project.id}/edit`);
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      const success = await deleteProject(project.id);
      if (success) {
        toast.success('Project deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleDuplicateProject = async (project: Project) => {
    try {
      const duplicateData: ProjectCreateRequest = {
        title: `${project.title} (Copy)`,
        frame_size: project.frame_size,
        project_data: project.project_data,
      };
      
      const newProject = await createProject(duplicateData);
      if (newProject) {
        toast.success('Project duplicated successfully!');
      }
    } catch (error) {
      console.error('Error duplicating project:', error);
      toast.error('Failed to duplicate project');
    }
  };

  // Statistics calculations
  const getProjectStats = () => {
    const stats = {
      total: allProjects.length,
      square: allProjects.filter(p => p.frame_size === '20x20').length,
      portrait: allProjects.filter(p => p.frame_size === '20x30').length,
      withAssets: allProjects.filter(p => (p.assets?.length || 0) > 0).length,
      recentlyUpdated: allProjects.filter(p => {
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return new Date(p.updated_at) > dayAgo;
      }).length,
    };
    return stats;
  };

  const stats = getProjectStats();

  // Error handling
  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Projects</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={clearError} variant="outline">
                Dismiss
              </Button>
              <Button onClick={() => fetchProjects()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your 3D scrapbook projects and frame designs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refreshProjects()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowNewProjectModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.recentlyUpdated} updated recently
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frame Types</CardTitle>
            <FrameIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{stats.square} Square</Badge>
              <Badge variant="outline">{stats.portrait} Portrait</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              20x20 and 20x30 templates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withAssets}</div>
            <p className="text-xs text-muted-foreground">
              Projects with uploaded images
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentlyUpdated}</div>
            <p className="text-xs text-muted-foreground">
              Updated in last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <ProjectSearch
        projects={allProjects}
        onFilteredProjectsChange={setFilteredProjects}
        onFiltersChange={setSearchFilters}
      />

      {/* Results Summary */}
      {searchFilters && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredProjects.length} of {allProjects.length} projects
          </span>
          {filteredProjects.length !== allProjects.length && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchFilters(null)}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Projects Grid */}
      <ProjectGrid
        projects={filteredProjects}
        loading={loading}
        onOpenProject={handleOpenProject}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        onDuplicateProject={handleDuplicateProject}
        onCreateNew={() => setShowNewProjectModal(true)}
      />

      {/* Pagination (for future implementation) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => fetchProjects(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => fetchProjects(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        open={showNewProjectModal}
        onOpenChange={setShowNewProjectModal}
        onProjectCreated={handleCreateProject}
        loading={loading}
      />
    </div>
  );
}