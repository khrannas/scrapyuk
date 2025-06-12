import { Asset, AssetUploadOptions, APIResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class AssetService {
  /**
   * Get all assets for a project
   */
  static async getProjectAssets(projectId: number): Promise<Asset[]> {
    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/assets`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch assets: ${response.statusText}`);
      }

      const data: APIResponse<Asset[]> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch assets');
      }

      // Transform backend asset data to include frontend-specific properties
      const assets = Array.isArray(data.data) ? data.data : [];
      return assets.map(asset => ({
        ...asset,
        url: `${API_BASE}/api/assets/${asset.file_path}`,
        thumbnail: `${API_BASE}/api/assets/${asset.file_path}`, // For now, use same URL
        isSelected: false,
      }));
    } catch (error) {
      console.error('Error fetching project assets:', error);
      throw error;
    }
  }

  /**
   * Upload an asset to a project with progress tracking
   */
  static async uploadAsset(
    projectId: number, 
    file: File, 
    options?: AssetUploadOptions
  ): Promise<Asset> {
    try {
      // Validate file type
      if (!file.type.includes('png')) {
        throw new Error('Only PNG files are allowed');
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      const formData = new FormData();
      formData.append('file', file);

      // Create XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && options?.onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            options.onProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data: APIResponse<Asset> = JSON.parse(xhr.responseText);
              if (data.success && data.data) {
                const asset = {
                  ...data.data,
                  url: `${API_BASE}/api/assets/${data.data.file_path}`,
                  thumbnail: `${API_BASE}/api/assets/${data.data.file_path}`,
                  size: file.size,
                  isSelected: false,
                };
                options?.onSuccess?.(asset);
                resolve(asset);
              } else {
                const error = data.error || 'Upload failed';
                options?.onError?.(error);
                reject(new Error(error));
              }
            } catch (error) {
              options?.onError?.('Invalid response from server');
              reject(error);
            }
          } else {
            const error = `Upload failed: ${xhr.statusText}`;
            options?.onError?.(error);
            reject(new Error(error));
          }
        });

        xhr.addEventListener('error', () => {
          const error = 'Network error during upload';
          options?.onError?.(error);
          reject(new Error(error));
        });

        xhr.open('POST', `${API_BASE}/api/projects/${projectId}/assets`);
        xhr.withCredentials = true;
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Error uploading asset:', error);
      options?.onError?.(error instanceof Error ? error.message : 'Upload failed');
      throw error;
    }
  }

  /**
   * Delete an asset
   */
  static async deleteAsset(assetId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/api/assets/${assetId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete asset: ${response.statusText}`);
      }

      const data: APIResponse<null> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete asset');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  }

  /**
   * Delete multiple assets
   */
  static async deleteAssets(assetIds: number[]): Promise<void> {
    try {
      const deletePromises = assetIds.map(id => this.deleteAsset(id));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting assets:', error);
      throw error;
    }
  }

  /**
   * Get asset dimensions from image file
   */
  static async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  /**
   * Check if image has transparency
   */
  static async hasTransparency(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      if (!file.type.includes('png')) {
        resolve(false);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Check for any pixel with alpha < 255
          for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 255) {
              URL.revokeObjectURL(url);
              resolve(true);
              return;
            }
          }
        }

        URL.revokeObjectURL(url);
        resolve(false);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };

      img.src = url;
    });
  }

  /**
   * Validate file for upload
   */
  static async validateFile(file: File): Promise<{
    isValid: boolean;
    error?: string;
    dimensions?: { width: number; height: number };
    hasTransparency?: boolean;
  }> {
    try {
      // Check file type
      if (!file.type.includes('png')) {
        return {
          isValid: false,
          error: 'Only PNG files are allowed',
        };
      }

      // Check file size
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return {
          isValid: false,
          error: 'File size must be less than 10MB',
        };
      }

      // Get dimensions and transparency info
      const [dimensions, hasTransparency] = await Promise.all([
        this.getImageDimensions(file),
        this.hasTransparency(file),
      ]);

      return {
        isValid: true,
        dimensions,
        hasTransparency,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'File validation failed',
      };
    }
  }
}