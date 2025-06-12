'use client';

import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';
import { EditorState } from '@/types';

interface ModeToggleProps {
  editorState: EditorState;
  onModeChange: (mode: 'edit' | 'view') => void;
  size?: 'sm' | 'lg' | 'default' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
}

export function ModeToggle({
  editorState,
  onModeChange,
  size = 'sm',
  variant = 'ghost'
}: ModeToggleProps) {
  const handleModeToggle = (mode: 'edit' | 'view') => {
    onModeChange(mode);
  };

  return (
    <div className="flex items-center bg-muted rounded-md p-1">
      <Button 
        variant={editorState.mode === 'edit' ? 'default' : variant}
        size={size}
        onClick={() => handleModeToggle('edit')}
        className={editorState.mode === 'edit' ? 'bg-primary text-primary-foreground' : ''}
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit
      </Button>
      <Button 
        variant={editorState.mode === 'view' ? 'default' : variant}
        size={size}
        onClick={() => handleModeToggle('view')}
        className={editorState.mode === 'view' ? 'bg-primary text-primary-foreground' : ''}
      >
        <Eye className="w-4 h-4 mr-2" />
        View
      </Button>
    </div>
  );
}