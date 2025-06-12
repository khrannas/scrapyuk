import { useState, useEffect, useCallback } from 'react';
import { Asset, AssetGalleryState, AssetFilter, AssetUploadProgress } from '@/types';
import { AssetService } from '@/lib/assetService';

interface UseAssetsOptions {
  projectId: number;
  autoLoad?: boolean;
}

export function useAssets({ projectId, autoLoad = true }: UseAssetsOptions) {
  const [state, setState] = useState<AssetGalleryState>({
    assets: [],
    selectedAssets: [],
    filter: {
      sortBy: 'uploaded_at',
      sortOrder: 'desc',
    },
    isLoading: false,
    error: null,
    uploadProgress: [],
  });

  // Load assets from the server
  const loadAssets = useCallback(async () => {
    if (!projectId) return;

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const assets = await AssetService.getProjectAssets(projectId);
      setState(prev => ({
        ...prev,
        assets,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load assets',
        isLoading: false,
      }));
    }
  }, [projectId]);

  // Upload multiple files
  const uploadFiles = useCallback(async (files: File[]) => {
    const uploads: AssetUploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'pending',
    }));

    setState(prev => ({
      ...prev,
      uploadProgress: [...prev.uploadProgress, ...uploads],
    }));

    const results = await Promise.allSettled(
      files.map(async (file, index) => {
        const uploadIndex = state.uploadProgress.length + index;
        
        try {
          // Update status to uploading
          setState(prev => ({
            ...prev,
            uploadProgress: prev.uploadProgress.map((upload, i) =>
              i === uploadIndex ? { ...upload, status: 'uploading' } : upload
            ),
          }));

          const asset = await AssetService.uploadAsset(projectId, file, {
            onProgress: (progress) => {
              setState(prev => ({
                ...prev,
                uploadProgress: prev.uploadProgress.map((upload, i) =>
                  i === uploadIndex ? { ...upload, progress } : upload
                ),
              }));
            },
          });

          // Update status to completed
          setState(prev => ({
            ...prev,
            uploadProgress: prev.uploadProgress.map((upload, i) =>
              i === uploadIndex
                ? { ...upload, status: 'completed', result: asset }
                : upload
            ),
            assets: [...prev.assets, asset],
          }));

          return asset;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Upload failed';
          
          // Update status to error
          setState(prev => ({
            ...prev,
            uploadProgress: prev.uploadProgress.map((upload, i) =>
              i === uploadIndex
                ? { ...upload, status: 'error', error: errorMessage }
                : upload
            ),
          }));

          throw error;
        }
      })
    );

    // Clean up completed uploads after a delay
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        uploadProgress: prev.uploadProgress.filter(
          upload => upload.status !== 'completed'
        ),
      }));
    }, 3000);

    return results;
  }, [projectId, state.uploadProgress.length]);

  // Delete asset
  const deleteAsset = useCallback(async (assetId: number) => {
    try {
      await AssetService.deleteAsset(assetId);
      setState(prev => ({
        ...prev,
        assets: prev.assets.filter(asset => asset.id !== assetId),
        selectedAssets: prev.selectedAssets.filter(id => id !== assetId),
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete asset',
      }));
      throw error;
    }
  }, []);

  // Delete selected assets
  const deleteSelectedAssets = useCallback(async () => {
    if (state.selectedAssets.length === 0) return;

    try {
      await AssetService.deleteAssets(state.selectedAssets);
      setState(prev => ({
        ...prev,
        assets: prev.assets.filter(asset => !prev.selectedAssets.includes(asset.id)),
        selectedAssets: [],
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete assets',
      }));
      throw error;
    }
  }, [state.selectedAssets]);

  // Toggle asset selection
  const toggleAssetSelection = useCallback((assetId: number) => {
    setState(prev => ({
      ...prev,
      selectedAssets: prev.selectedAssets.includes(assetId)
        ? prev.selectedAssets.filter(id => id !== assetId)
        : [...prev.selectedAssets, assetId],
      assets: prev.assets.map(asset =>
        asset.id === assetId
          ? { ...asset, isSelected: !asset.isSelected }
          : asset
      ),
    }));
  }, []);

  // Select all assets
  const selectAllAssets = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedAssets: prev.assets.map(asset => asset.id),
      assets: prev.assets.map(asset => ({ ...asset, isSelected: true })),
    }));
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedAssets: [],
      assets: prev.assets.map(asset => ({ ...asset, isSelected: false })),
    }));
  }, []);

  // Update filter
  const updateFilter = useCallback((newFilter: Partial<AssetFilter>) => {
    setState(prev => ({
      ...prev,
      filter: { ...prev.filter, ...newFilter },
    }));
  }, []);

  // Get filtered and sorted assets
  const getFilteredAssets = useCallback(() => {
    let filtered = [...state.assets];

    // Apply search filter
    if (state.filter.search) {
      const searchLower = state.filter.search.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.filename.toLowerCase().includes(searchLower)
      );
    }

    // Apply date range filter
    if (state.filter.dateRange) {
      const { start, end } = state.filter.dateRange;
      filtered = filtered.filter(asset => {
        const uploadDate = new Date(asset.uploaded_at);
        return uploadDate >= start && uploadDate <= end;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { sortBy = 'uploaded_at', sortOrder = 'desc' } = state.filter;
      
      let comparison = 0;
      
      switch (sortBy) {
        case 'filename':
          comparison = a.filename.localeCompare(b.filename);
          break;
        case 'uploaded_at':
          comparison = new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime();
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [state.assets, state.filter]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load assets on mount if autoLoad is enabled
  useEffect(() => {
    if (autoLoad && projectId) {
      loadAssets();
    }
  }, [autoLoad, projectId, loadAssets]);

  return {
    // State
    assets: getFilteredAssets(),
    selectedAssets: state.selectedAssets,
    filter: state.filter,
    isLoading: state.isLoading,
    error: state.error,
    uploadProgress: state.uploadProgress,
    
    // Actions
    loadAssets,
    uploadFiles,
    deleteAsset,
    deleteSelectedAssets,
    toggleAssetSelection,
    selectAllAssets,
    clearSelection,
    updateFilter,
    clearError,
    
    // Computed
    hasAssets: state.assets.length > 0,
    hasSelection: state.selectedAssets.length > 0,
    isUploading: state.uploadProgress.some(upload => upload.status === 'uploading'),
  };
}