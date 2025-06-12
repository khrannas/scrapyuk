// Asset types (updated to match backend model)
export interface Asset {
  id: number;
  project_id: number;
  filename: string;
  file_path: string;
  uploaded_at: string;
  // Frontend-specific properties
  url?: string;
  thumbnail?: string;
  size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  hasTransparency?: boolean;
  isSelected?: boolean;
}

// Asset upload types
export interface AssetUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  result?: Asset;
}

export interface AssetUploadOptions {
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
  onSuccess?: (asset: Asset) => void;
}

// Asset management types
export interface AssetFilter {
  search?: string;
  sortBy?: 'filename' | 'uploaded_at' | 'size';
  sortOrder?: 'asc' | 'desc';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface AssetGalleryState {
  assets: Asset[];
  selectedAssets: number[];
  filter: AssetFilter;
  isLoading: boolean;
  error: string | null;
  uploadProgress: AssetUploadProgress[];
}

// Frame template types
export interface FrameTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  depth: number;
}

// 3D Object types
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface ScrapbookObject {
  id: string;
  assetId: string;
  position: Vector3;
  scale: number;
  layers: number;
  layerSpacing: number;
  rotation?: Vector3;
}

// Project types
export interface Project {
  id: string;
  name: string;
  frameTemplate: FrameTemplate;
  objects: ScrapbookObject[];
  lighting?: {
    enabled: boolean;
    positions: Vector3[];
  };
  createdAt: string;
  updatedAt: string;
}

// Share link types
export interface ShareLink {
  id: string;
  projectId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

// UI State types
export interface EditorState {
  mode: 'edit' | 'view';
  selectedObjectId: string | null;
  showProperties: boolean;
  camera: {
    position: Vector3;
    target: Vector3;
  };
}

// API Response types
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// Session types
export interface Session {
  user: User;
  token: string;
  expiresAt: string;
  isValid: boolean;
}