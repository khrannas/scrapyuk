'use client';

import { Project } from '@/lib/api';
import { ProjectCard } from './ProjectCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, Search } from 'lucide-react';

export interface ProjectGridProps {
  projects: Project[];
  loading?: boolean;
  onOpenProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  onDuplicateProject: (project: Project) => void;
  onCreateNew: () => void;
}

export function ProjectGrid({
  projects,
  loading = false,
  onOpenProject,
  onEditProject,
  onDeleteProject,
  onDuplicateProject,
  onCreateNew,
}: ProjectGridProps) {
  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-8 bg-muted rounded flex-1" />
                <div className="h-8 bg-muted rounded w-12" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No Projects Yet</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Create your first 3D scrapbook project to get started
                </p>
              </div>
              <Button onClick={onCreateNew} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Create New Project Card */}
        <Card 
          className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group"
          onClick={onCreateNew}
        >
          <CardContent className="aspect-[4/3] flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Create New Project</p>
                <p className="text-sm text-muted-foreground">Start with a frame template</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Cards */}
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={onOpenProject}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
            onDuplicate={onDuplicateProject}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}