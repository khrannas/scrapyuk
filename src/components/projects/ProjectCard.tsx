'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MoreVertical,
  Calendar,
  FrameIcon,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Project } from '@/lib/api';
import { toast } from 'sonner';

export interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  loading?: boolean;
}

export function ProjectCard({
  project,
  onOpen,
  onEdit,
  onDelete,
  onDuplicate,
  loading = false,
}: ProjectCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFrameDisplayName = (frameSize: string) => {
    return frameSize === '20x20' ? '20x20 Square' : '20x30 Portrait';
  };

  const handleDelete = () => {
    onDelete(project);
    setShowDeleteDialog(false);
    toast.success('Project deleted successfully');
  };

  const handleDuplicate = () => {
    onDuplicate(project);
    toast.success('Project duplicated successfully');
  };

  // Generate a simple thumbnail placeholder based on project data
  const getThumbnailColor = () => {
    const colors = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-orange-400 to-orange-600',
    ];
    const index = project.id % colors.length;
    return colors[index];
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
        {/* Thumbnail Section */}
        <div className="relative">
          <div className={`aspect-[4/3] ${getThumbnailColor()} flex items-center justify-center`}>
            <div className="text-white/80 text-center">
              <FrameIcon className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm font-medium">{getFrameDisplayName(project.frame_size)}</div>
            </div>
          </div>
          
          {/* Actions Menu */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 backdrop-blur-sm border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
              >
                <MoreVertical className="h-4 w-4 text-white" />
              </Button>
              
              {showActions && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-background border rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(project);
                        setShowActions(false);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate();
                        setShowActions(false);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      Duplicate
                    </button>
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                        setShowActions(false);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base line-clamp-1" title={project.title}>
              {project.title}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {project.frame_size}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Project Info */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(project.created_at)}</span>
              </div>
              {project.updated_at !== project.created_at && (
                <div className="text-xs">
                  Updated {formatDate(project.updated_at)}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                Objects: {project.objects?.length || 0}
              </span>
              <span>
                Assets: {project.assets?.length || 0}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(project);
                }}
                className="flex-1"
                disabled={loading}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
                disabled={loading}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Click overlay for opening project */}
        <div 
          className="absolute inset-0 cursor-pointer"
          onClick={() => onOpen(project)}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{project.title}"? This action cannot be undone.
              All project data, assets, and shared links will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Click outside handler for actions menu */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </>
  );
}