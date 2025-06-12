'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectCreateRequest } from '@/lib/api';
import { Loader2, FrameIcon } from 'lucide-react';
import { toast } from 'sonner';

export interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (project: any) => void;
  loading?: boolean;
}

const FRAME_TEMPLATES = [
  {
    id: '20x20',
    name: '20x20 Square Frame',
    description: 'Perfect for square layouts and symmetric designs',
    dimensions: '20" x 20"',
    aspectRatio: '1:1',
  },
  {
    id: '20x30',
    name: '20x30 Portrait Frame',
    description: 'Ideal for portrait layouts and vertical compositions',
    dimensions: '20" x 30"',
    aspectRatio: '2:3',
  },
] as const;

export function NewProjectModal({
  open,
  onOpenChange,
  onProjectCreated,
  loading = false,
}: NewProjectModalProps) {
  const [formData, setFormData] = useState<ProjectCreateRequest>({
    title: '',
    frame_size: '20x20',
    project_data: null,
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>('20x20');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a project title');
      return;
    }

    if (!formData.frame_size) {
      toast.error('Please select a frame template');
      return;
    }

    try {
      setIsCreating(true);
      
      // Initialize project data with basic frame configuration
      const projectData = {
        frame: {
          size: formData.frame_size,
          dimensions: FRAME_TEMPLATES.find(t => t.id === formData.frame_size)?.dimensions,
        },
        objects: [],
        settings: {
          backgroundColor: '#ffffff',
          lighting: {
            enabled: true,
            intensity: 1.0,
          },
        },
        created_at: new Date().toISOString(),
      };

      const projectRequest: ProjectCreateRequest = {
        ...formData,
        project_data: projectData,
      };

      await onProjectCreated(projectRequest);
      
      // Reset form
      setFormData({
        title: '',
        frame_size: '20x20',
        project_data: null,
      });
      setSelectedTemplate('20x20');
      
      toast.success('Project created successfully!');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setFormData(prev => ({
      ...prev,
      frame_size: templateId as '20x20' | '20x30',
    }));
  };

  const selectedTemplateInfo = FRAME_TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Choose a frame template and give your project a name to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="Enter project title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              disabled={isCreating || loading}
              className="w-full"
            />
          </div>

          {/* Frame Template Selection */}
          <div className="space-y-4">
            <div>
              <Label>Frame Template (US-05)</Label>
              <p className="text-sm text-muted-foreground">
                Choose your frame size and aspect ratio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FRAME_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'ring-2 ring-primary border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FrameIcon className="h-4 w-4" />
                      {template.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Size: {template.dimensions}</span>
                        <span>Ratio: {template.aspectRatio}</span>
                      </div>
                      
                      {/* Visual Preview */}
                      <div className="flex justify-center pt-2">
                        <div
                          className={`border-2 border-dashed border-primary/30 ${
                            template.id === '20x20' 
                              ? 'w-12 h-12' 
                              : 'w-8 h-12'
                          } flex items-center justify-center bg-primary/5`}
                        >
                          <span className="text-xs text-primary/60">
                            {template.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Template Info */}
            {selectedTemplateInfo && (
              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <FrameIcon className="h-4 w-4 text-primary" />
                  <span className="font-medium">Selected: {selectedTemplateInfo.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedTemplateInfo.description}
                </p>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Dimensions: {selectedTemplateInfo.dimensions}</span>
                  <span>Aspect Ratio: {selectedTemplateInfo.aspectRatio}</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating || loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || loading || !formData.title.trim()}
            >
              {isCreating || loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}