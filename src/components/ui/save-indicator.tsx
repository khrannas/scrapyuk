'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  Save, 
  Loader2, 
  AlertCircle, 
  Cloud,
  CloudOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error' | 'offline';

export interface SaveIndicatorProps {
  status: SaveStatus;
  onSave?: () => void;
  onRetry?: () => void;
  lastSaved?: Date;
  autoSaveEnabled?: boolean;
  className?: string;
}

export function SaveIndicator({
  status,
  onSave,
  onRetry,
  lastSaved,
  autoSaveEnabled = true,
  className,
}: SaveIndicatorProps) {
  const [showLastSaved, setShowLastSaved] = useState(false);

  useEffect(() => {
    if (status === 'saved' && lastSaved) {
      setShowLastSaved(true);
      const timer = setTimeout(() => {
        setShowLastSaved(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, lastSaved]);

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ago`;
    } else if (seconds > 10) {
      return `${seconds}s ago`;
    } else {
      return 'just now';
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'saved':
        return {
          icon: <Check className="h-3 w-3" />,
          text: 'Saved',
          variant: 'default' as const,
          className: 'bg-green-500/10 text-green-600 border-green-500/20',
        };
      case 'saving':
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          text: 'Saving...',
          variant: 'secondary' as const,
          className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        };
      case 'unsaved':
        return {
          icon: <Save className="h-3 w-3" />,
          text: 'Unsaved',
          variant: 'outline' as const,
          className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'Save failed',
          variant: 'destructive' as const,
          className: 'bg-red-500/10 text-red-600 border-red-500/20',
        };
      case 'offline':
        return {
          icon: <CloudOff className="h-3 w-3" />,
          text: 'Offline',
          variant: 'secondary' as const,
          className: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
        };
      default:
        return {
          icon: <Save className="h-3 w-3" />,
          text: 'Unknown',
          variant: 'outline' as const,
          className: '',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Status Badge */}
      <Badge 
        variant={config.variant}
        className={cn('flex items-center gap-1.5 px-2 py-1', config.className)}
      >
        {config.icon}
        <span className="text-xs font-medium">{config.text}</span>
      </Badge>

      {/* Auto-save indicator */}
      {autoSaveEnabled && status !== 'saving' && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Cloud className="h-3 w-3" />
          <span>Auto-save</span>
        </div>
      )}

      {/* Last saved timestamp */}
      {showLastSaved && lastSaved && status === 'saved' && (
        <span className="text-xs text-muted-foreground">
          {formatLastSaved(lastSaved)}
        </span>
      )}

      {/* Manual save button for unsaved changes */}
      {status === 'unsaved' && onSave && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="h-6 px-2 text-xs"
        >
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>
      )}

      {/* Retry button for errors */}
      {status === 'error' && onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="h-6 px-2 text-xs text-destructive hover:text-destructive"
        >
          Retry
        </Button>
      )}
    </div>
  );
}

// Hook for managing save status
export interface UseSaveStatusOptions {
  autoSaveInterval?: number;
  onAutoSave?: () => Promise<void>;
}

export function useSaveStatus(options: UseSaveStatusOptions = {}) {
  const { autoSaveInterval = 30000, onAutoSave } = options; // 30 seconds default
  
  const [status, setStatus] = useState<SaveStatus>('saved');
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save effect
  useEffect(() => {
    if (!onAutoSave || !hasUnsavedChanges) return;

    const interval = setInterval(async () => {
      if (hasUnsavedChanges && status !== 'saving') {
        try {
          setStatus('saving');
          await onAutoSave();
          setStatus('saved');
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
        } catch (error) {
          setStatus('error');
        }
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [hasUnsavedChanges, status, onAutoSave, autoSaveInterval]);

  const markUnsaved = () => {
    setHasUnsavedChanges(true);
    if (status !== 'saving') {
      setStatus('unsaved');
    }
  };

  const markSaved = () => {
    setHasUnsavedChanges(false);
    setStatus('saved');
    setLastSaved(new Date());
  };

  const markSaving = () => {
    setStatus('saving');
  };

  const markError = () => {
    setStatus('error');
  };

  const markOffline = () => {
    setStatus('offline');
  };

  return {
    status,
    lastSaved,
    hasUnsavedChanges,
    markUnsaved,
    markSaved,
    markSaving,
    markError,
    markOffline,
  };
}