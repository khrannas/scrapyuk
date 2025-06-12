import React, { useState } from 'react';
import { MoreVertical, Eye, Trash2, Download, Copy, CheckSquare, Square } from 'lucide-react';
import { Asset } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AssetCardProps {
  asset: Asset;
  isSelected?: boolean;
  onSelect?: (assetId: number) => void;
  onPreview?: (asset: Asset) => void;
  onDelete?: (assetId: number) => void;
  onUse?: (asset: Asset) => void;
  className?: string;
  selectionMode?: boolean;
}

export function AssetCard({
  asset,
  isSelected = false,
  onSelect,
  onPreview,
  onDelete,
  onUse,
  className,
  selectionMode = false,
}: AssetCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview?.(asset);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(asset.id);
  };

  const handleUse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUse?.(asset);
  };

  const handleCardClick = () => {
    if (selectionMode) {
      onSelect?.(asset.id);
    } else {
      onPreview?.(asset);
    }
  };

  const handleSelectionToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(asset.id);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      className={cn(
        'group relative cursor-pointer transition-all duration-200 hover:shadow-md',
        {
          'ring-2 ring-blue-500 ring-offset-2': isSelected,
          'hover:shadow-lg': !isSelected,
        },
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-3">
        {/* Selection indicator */}
        {selectionMode && (
          <div className="absolute top-2 left-2 z-10">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 bg-background/80 hover:bg-background"
              onClick={handleSelectionToggle}
            >
              {isSelected ? (
                <CheckSquare className="h-4 w-4 text-blue-600" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {/* Actions menu */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-background/80 hover:bg-background"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleUse}>
                <Copy className="h-4 w-4 mr-2" />
                Use in 3D Scene
              </DropdownMenuItem>
              {asset.url && (
                <DropdownMenuItem asChild>
                  <a
                    href={asset.url}
                    download={asset.filename}
                    className="flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Image thumbnail */}
        <div className="aspect-square rounded-md bg-muted overflow-hidden mb-3 relative">
          {!imageError && asset.url ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                </div>
              )}
              <img
                src={asset.thumbnail || asset.url}
                alt={asset.filename}
                className={cn(
                  'w-full h-full object-cover transition-opacity duration-200',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                  <Eye className="h-6 w-6" />
                </div>
                <p className="text-xs">No preview</p>
              </div>
            </div>
          )}

          {/* Transparency indicator */}
          {asset.hasTransparency && (
            <Badge
              variant="secondary"
              className="absolute bottom-1 left-1 text-xs px-1.5 py-0.5"
            >
              PNG
            </Badge>
          )}
        </div>

        {/* Asset info */}
        <div className="space-y-2">
          <div>
            <h3
              className="font-medium text-sm truncate"
              title={asset.filename}
            >
              {asset.filename}
            </h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatFileSize(asset.size)}</span>
              <span>{formatDate(asset.uploaded_at)}</span>
            </div>
          </div>

          {/* Dimensions */}
          {asset.dimensions && (
            <div className="text-xs text-muted-foreground">
              {asset.dimensions.width} × {asset.dimensions.height}px
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-xs"
            onClick={handlePreview}
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-xs"
            onClick={handleUse}
          >
            <Copy className="h-3 w-3 mr-1" />
            Use
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}