import React, { useState } from 'react';
import { Search, Filter, Grid, List, MoreHorizontal, Trash2, Download } from 'lucide-react';
import { Asset, AssetFilter } from '@/types';
import { AssetCard } from './AssetCard';
import { AssetPreview } from './AssetPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AssetGalleryProps {
  assets: Asset[];
  selectedAssets: number[];
  filter: AssetFilter;
  isLoading: boolean;
  error: string | null;
  onAssetSelect: (assetId: number) => void;
  onAssetUse: (asset: Asset) => void;
  onAssetDelete: (assetId: number) => void;
  onBulkDelete: () => void;
  onFilterChange: (filter: Partial<AssetFilter>) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  className?: string;
}

type ViewMode = 'grid' | 'list';

export function AssetGallery({
  assets,
  selectedAssets,
  filter,
  isLoading,
  error,
  onAssetSelect,
  onAssetUse,
  onAssetDelete,
  onBulkDelete,
  onFilterChange,
  onSelectAll,
  onClearSelection,
  className,
}: AssetGalleryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);

  const hasSelection = selectedAssets.length > 0;
  const hasAssets = assets.length > 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split(':') as [AssetFilter['sortBy'], AssetFilter['sortOrder']];
    onFilterChange({ sortBy, sortOrder });
  };

  const toggleSelectionMode = () => {
    if (selectionMode) {
      onClearSelection();
    }
    setSelectionMode(!selectionMode);
  };

  const handlePreview = (asset: Asset) => {
    setPreviewAsset(asset);
  };

  const closePreview = () => {
    setPreviewAsset(null);
  };

  if (error) {
    return (
      <Card className={cn('border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10', className)}>
        <CardContent className="p-6 text-center">
          <div className="text-red-600 dark:text-red-400">
            <p className="font-medium">Failed to load assets</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-heading">
              Asset Gallery
              {hasAssets && (
                <Badge variant="secondary" className="ml-2">
                  {assets.length}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex rounded-md border">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  className="rounded-r-none border-r"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  className="rounded-l-none"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Bulk Actions */}
              {hasAssets && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={toggleSelectionMode}>
                      {selectionMode ? 'Exit Selection' : 'Select Multiple'}
                    </DropdownMenuItem>
                    {hasSelection && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onSelectAll}>
                          Select All ({assets.length})
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onClearSelection}>
                          Clear Selection
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onBulkDelete} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Selected ({selectedAssets.length})
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={filter.search || ''}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
            <Select
              value={`${filter.sortBy || 'uploaded_at'}:${filter.sortOrder || 'desc'}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uploaded_at:desc">Latest First</SelectItem>
                <SelectItem value="uploaded_at:asc">Oldest First</SelectItem>
                <SelectItem value="filename:asc">Name A-Z</SelectItem>
                <SelectItem value="filename:desc">Name Z-A</SelectItem>
                <SelectItem value="size:desc">Largest First</SelectItem>
                <SelectItem value="size:asc">Smallest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selection Info */}
          {hasSelection && (
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {selectedAssets.length} asset{selectedAssets.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={onClearSelection}>
                  Clear
                </Button>
                <Button size="sm" variant="destructive" onClick={onBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset Grid/List */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                <p className="text-sm text-muted-foreground">Loading assets...</p>
              </div>
            </div>
          ) : !hasAssets ? (
            <div className="text-center py-12">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Grid className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No assets yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Upload PNG images with transparency to start building your 3D scrapbook objects.
              </p>
            </div>
          ) : (
            <div
              className={cn(
                'gap-4',
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                  : 'space-y-2'
              )}
            >
              {assets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  isSelected={selectedAssets.includes(asset.id)}
                  selectionMode={selectionMode}
                  onSelect={onAssetSelect}
                  onPreview={handlePreview}
                  onDelete={onAssetDelete}
                  onUse={onAssetUse}
                  className={viewMode === 'list' ? 'flex-row' : undefined}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset Preview Modal */}
      {previewAsset && (
        <AssetPreview
          asset={previewAsset}
          isOpen={!!previewAsset}
          onClose={closePreview}
          onUse={onAssetUse}
          onDelete={onAssetDelete}
        />
      )}
    </div>
  );
}