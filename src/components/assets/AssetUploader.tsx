import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AssetUploadProgress } from '@/types';
import { cn } from '@/lib/utils';

interface AssetUploaderProps {
  onFilesSelected: (files: File[]) => void;
  uploadProgress: AssetUploadProgress[];
  isUploading: boolean;
  disabled?: boolean;
  className?: string;
}

export function AssetUploader({
  onFilesSelected,
  uploadProgress,
  isUploading,
  disabled = false,
  className,
}: AssetUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled) return;
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected, disabled]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled,
    multiple: true,
  });

  const hasRejectedFiles = fileRejections.length > 0;
  const showProgress = uploadProgress.length > 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Zone */}
      <Card
        {...getRootProps()}
        className={cn(
          'relative cursor-pointer border-2 border-dashed transition-all duration-200',
          {
            'cursor-not-allowed opacity-50': disabled,
            'border-blue-500 bg-blue-50 dark:bg-blue-950/10': isDragActive && !isDragReject,
            'border-red-500 bg-red-50 dark:bg-red-950/10': isDragReject || hasRejectedFiles,
            'border-border hover:border-blue-400 hover:bg-muted/50': !isDragActive && !isDragReject && !hasRejectedFiles,
          }
        )}
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <input {...getInputProps()} />
          
          {/* Icon */}
          <div className={cn(
            'mb-4 rounded-full p-3',
            {
              'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400': isDragActive && !isDragReject,
              'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400': isDragReject || hasRejectedFiles,
              'bg-muted text-muted-foreground': !isDragActive && !isDragReject && !hasRejectedFiles,
            }
          )}>
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : isDragReject || hasRejectedFiles ? (
              <AlertCircle className="h-8 w-8" />
            ) : (
              <Upload className="h-8 w-8" />
            )}
          </div>

          {/* Text */}
          <div className="space-y-2">
            {isDragActive ? (
              <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                {isDragReject ? 'Invalid file type' : 'Drop files here'}
              </p>
            ) : (
              <div>
                <p className="text-lg font-medium">
                  Drag & drop PNG images here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Only PNG files with transparency are supported</p>
              <p>Maximum file size: 10MB per file</p>
            </div>
          </div>

          {/* Browse Button */}
          {!isDragActive && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              disabled={disabled || isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Browse Files
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Rejected Files */}
      {hasRejectedFiles && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  Some files were rejected:
                </p>
                <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                  {fileRejections.map((fileRejection, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="font-mono">{fileRejection.file.name}</span>
                      <span>•</span>
                      <span>
                        {fileRejection.errors.map((error, errorIndex) => {
                          let errorMessage = '';
                          switch (error.code) {
                            case 'file-invalid-type':
                              errorMessage = 'Invalid file type (PNG only)';
                              break;
                            case 'file-too-large':
                              errorMessage = 'File too large (max 10MB)';
                              break;
                            default:
                              errorMessage = error.message;
                          }
                          return errorIndex > 0 ? `, ${errorMessage}` : errorMessage;
                        }).join('')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {showProgress && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Upload Progress</h3>
                <span className="text-xs text-muted-foreground">
                  {uploadProgress.filter(p => p.status === 'completed').length} of{' '}
                  {uploadProgress.length} completed
                </span>
              </div>
              
              <div className="space-y-2">
                {uploadProgress.map((progress, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono truncate max-w-[200px]">
                        {progress.file.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        {progress.status === 'completed' && (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                        {progress.status === 'error' && (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                        {progress.status === 'uploading' && (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        )}
                        <span className={cn(
                          'text-xs',
                          {
                            'text-green-600': progress.status === 'completed',
                            'text-red-600': progress.status === 'error',
                          }
                        )}>
                          {progress.status === 'error' 
                            ? 'Failed' 
                            : progress.status === 'completed'
                            ? 'Complete'
                            : `${progress.progress}%`
                          }
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full transition-all duration-300 ease-out',
                          {
                            'bg-blue-500': progress.status === 'uploading',
                            'bg-green-500': progress.status === 'completed',
                            'bg-red-500': progress.status === 'error',
                          }
                        )}
                        style={{
                          width: progress.status === 'error' 
                            ? '100%' 
                            : `${progress.progress}%`
                        }}
                      />
                    </div>
                    
                    {/* Error Message */}
                    {progress.status === 'error' && progress.error && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {progress.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}