// ScrapYuk API Client Library
// This file provides typed API client functions for communicating with the Go backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Project Types
export interface Project {
  id: number;
  title: string;
  frame_size: '20x20' | '20x30';
  project_data: any;
  created_at: string;
  updated_at: string;
  assets?: Asset[];
  objects?: ProjectObject[];
  shared_links?: SharedLink[];
}

export interface ProjectCreateRequest {
  title: string;
  frame_size: '20x20' | '20x30';
  project_data?: any;
}

export interface ProjectUpdateRequest {
  title?: string;
  frame_size?: '20x20' | '20x30';
  project_data?: any;
}

// Asset Types
export interface Asset {
  id: number;
  project_id: number;
  filename: string;
  file_path: string;
  uploaded_at: string;
}

// Object Types
export interface ProjectObject {
  id: number;
  project_id: number;
  asset_id?: number;
  position: any;
  layers: number;
  properties?: any;
  created_at: string;
}

// Shared Link Types
export interface SharedLink {
  id: number;
  project_id: number;
  token: string;
  expires_at?: string;
  created_at: string;
}

export interface SharedLinkCreateRequest {
  expires_at?: string;
}

// Health Check Types
export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  database?: string;
  storage?: string;
  database_error?: string;
  storage_error?: string;
}

// API Client Class
class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Health Check Methods
  async healthCheck(): Promise<APIResponse<HealthStatus>> {
    return this.request('/health');
  }

  async detailedHealthCheck(): Promise<APIResponse<HealthStatus>> {
    return this.request('/health/detailed');
  }

  // Project Methods
  async getProjects(page = 1, limit = 10): Promise<PaginatedResponse<Project[]>> {
    return this.request(`/projects?page=${page}&limit=${limit}`);
  }

  async getProject(id: number): Promise<APIResponse<Project>> {
    return this.request(`/projects/${id}`);
  }

  async createProject(project: ProjectCreateRequest): Promise<APIResponse<Project>> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: number, updates: ProjectUpdateRequest): Promise<APIResponse<Project>> {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: number): Promise<APIResponse<void>> {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Asset Methods
  async getProjectAssets(projectId: number): Promise<APIResponse<Asset[]>> {
    return this.request(`/projects/${projectId}/assets`);
  }

  async uploadAsset(projectId: number, file: File): Promise<APIResponse<Asset>> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/projects/${projectId}/assets`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Upload failed');
      }
      
      return data;
    } catch (error) {
      console.error('Asset upload error:', error);
      throw error;
    }
  }

  async deleteAsset(assetId: number): Promise<APIResponse<void>> {
    return this.request(`/assets/${assetId}`, {
      method: 'DELETE',
    });
  }

  getAssetURL(filePath: string): string {
    return `${this.baseURL}/assets/${filePath}`;
  }

  // Shared Link Methods
  async createSharedLink(
    projectId: number,
    request: SharedLinkCreateRequest = {}
  ): Promise<APIResponse<SharedLink>> {
    return this.request(`/shared-links?project_id=${projectId}`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getProjectSharedLinks(projectId: number): Promise<APIResponse<SharedLink[]>> {
    return this.request(`/projects/${projectId}/shared-links`);
  }

  async deleteSharedLink(token: string): Promise<APIResponse<void>> {
    return this.request(`/shared-links/${token}`, {
      method: 'DELETE',
    });
  }

  async getSharedProject(token: string): Promise<APIResponse<{
    project: Project;
    shared_link: SharedLink;
    is_shared: boolean;
  }>> {
    return this.request(`/shared/${token}`);
  }
}

// Create default API client instance
export const api = new APIClient();

// Export APIClient class for custom instances
export { APIClient };

// Utility Functions
export function isValidFrameSize(size: string): size is '20x20' | '20x30' {
  return size === '20x20' || size === '20x30';
}

export function formatProjectData(data: any): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return 'Invalid JSON data';
  }
}

export function parseProjectData(data: string): any {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isValidPNGFile(file: File): boolean {
  const validTypes = ['image/png'];
  const validExtensions = ['png'];
  const extension = getFileExtension(file.name);
  
  return validTypes.includes(file.type) && validExtensions.includes(extension);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isExpiredLink(expiresAt?: string): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

// Error handling utilities
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: any): string {
  if (error instanceof APIError) {
    return error.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
}