import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image, Folder, AlertCircle } from "lucide-react";
import { EditorState, Asset } from "@/types";
import { AssetUploader, AssetGallery } from "@/components/assets";
import { useAssets } from "@/hooks/useAssets";
import { toast } from "sonner";

interface LeftPanelProps {
  editorState?: EditorState;
  projectId?: number;
  onAssetUse?: (asset: Asset) => void;
}

export function LeftPanel({ editorState, projectId, onAssetUse }: LeftPanelProps) {
  const [showUploader, setShowUploader] = useState(false);
  const [showGallery, setShowGallery] = useState(true);

  // Hide panel in view mode
  if (editorState?.mode === 'view') {
    return null;
  }

  // Asset management hook
  const {
    assets,
    selectedAssets,
    filter,
    isLoading,
    error,
    uploadProgress,
    uploadFiles,
    deleteAsset,
    deleteSelectedAssets,
    toggleAssetSelection,
    selectAllAssets,
    clearSelection,
    updateFilter,
    clearError,
    hasAssets,
    hasSelection,
    isUploading,
  } = useAssets({
    projectId: projectId || 0,
    autoLoad: !!projectId
  });

  // Handle file upload
  const handleFilesSelected = async (files: File[]) => {
    if (!projectId) {
      toast.error('No project selected');
      return;
    }

    try {
      await uploadFiles(files);
      toast.success(`Successfully uploaded ${files.length} file${files.length !== 1 ? 's' : ''}`);
    } catch (error) {
      toast.error('Some files failed to upload');
    }
  };

  // Handle asset deletion with confirmation
  const handleAssetDelete = async (assetId: number) => {
    try {
      await deleteAsset(assetId);
      toast.success('Asset deleted successfully');
    } catch (error) {
      toast.error('Failed to delete asset');
    }
  };

  // Handle bulk deletion with confirmation
  const handleBulkDelete = async () => {
    if (!hasSelection) return;

    try {
      await deleteSelectedAssets();
      toast.success(`Deleted ${selectedAssets.length} asset${selectedAssets.length !== 1 ? 's' : ''}`);
    } catch (error) {
      toast.error('Failed to delete assets');
    }
  };

  // Handle asset use in 3D scene
  const handleAssetUse = (asset: Asset) => {
    onAssetUse?.(asset);
    toast.success(`Added ${asset.filename} to the scene`);
  };

  // Clear errors when they change
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <div className="w-80 bg-panel-surface border-r border-border p-4 space-y-4 overflow-y-auto">
      {/* Project Required Warning */}
      {!projectId && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  No Project Selected
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Please select or create a project to manage assets.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset Upload Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center justify-between">
            <div className="flex items-center">
              <Image className="w-5 h-5 mr-2" />
              Asset Upload
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowUploader(!showUploader)}
              disabled={!projectId}
            >
              <Upload className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        {showUploader && (
          <CardContent>
            <AssetUploader
              onFilesSelected={handleFilesSelected}
              uploadProgress={uploadProgress}
              isUploading={isUploading}
              disabled={!projectId}
            />
          </CardContent>
        )}
        {!showUploader && (
          <CardContent>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setShowUploader(true)}
              disabled={!projectId}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload PNG Images
            </Button>
            <div className="text-sm text-muted-foreground mt-2">
              Upload PNG images with transparency to create 3D objects
            </div>
          </CardContent>
        )}
      </Card>

      {/* Asset Gallery Section */}
      {projectId && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-heading flex items-center justify-between">
              <div className="flex items-center">
                <Folder className="w-5 h-5 mr-2" />
                Asset Gallery
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowGallery(!showGallery)}
              >
                {showGallery ? 'Hide' : 'Show'}
              </Button>
            </CardTitle>
          </CardHeader>
          {showGallery && (
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                <AssetGallery
                  assets={assets}
                  selectedAssets={selectedAssets}
                  filter={filter}
                  isLoading={isLoading}
                  error={error}
                  onAssetSelect={toggleAssetSelection}
                  onAssetUse={handleAssetUse}
                  onAssetDelete={handleAssetDelete}
                  onBulkDelete={handleBulkDelete}
                  onFilterChange={updateFilter}
                  onSelectAll={selectAllAssets}
                  onClearSelection={clearSelection}
                  className="p-4"
                />
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Frame Templates Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading">Frame Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            20x20 cm Frame
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            20x30 cm Frame
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}