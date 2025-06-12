"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Asset, EditorState } from '@/types';
import { toast } from 'sonner';

export default function AssetDemoPage() {
  const [editorState, setEditorState] = useState<EditorState>({
    mode: 'edit',
    selectedObjectId: null,
    showProperties: false,
    camera: {
      position: { x: 0, y: 0, z: 5 },
      target: { x: 0, y: 0, z: 0 },
    },
  });

  // Mock project ID for demo
  const projectId = 1;

  const handleAssetUse = (asset: Asset) => {
    toast.success(`Asset "${asset.filename}" added to 3D scene!`, {
      description: 'The asset is now available for creating 3D objects with layering effects.',
    });
  };

  const handleEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };

  return (
    <AppLayout
      editorState={editorState}
      onEditorStateChange={handleEditorStateChange}
      projectId={projectId}
      onAssetUse={handleAssetUse}
    >
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Asset Management Demo</h1>
            <p className="text-muted-foreground mt-2">
              Phase 5: Complete Asset Upload & Management System
            </p>
          </div>
          <Badge variant="default" className="text-sm">
            Phase 5 Complete
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asset Management Features */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Asset Management Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">Drag & Drop PNG Upload</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">File Validation (PNG only, 10MB max)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">Upload Progress Tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">Asset Gallery with Thumbnails</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">Asset Preview Modal</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">Search & Filter Assets</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">Bulk Selection & Deletion</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">Asset Usage in 3D Scene</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">Transparency Detection</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Use */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">1. Upload Assets</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the left panel to drag & drop PNG images or click to browse files. 
                    Files with transparency work best for 3D objects.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">2. Manage Assets</h4>
                  <p className="text-sm text-muted-foreground">
                    Search, filter, and organize your assets in the gallery. 
                    Click on assets to preview them in detail.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">3. Use in 3D Scene</h4>
                  <p className="text-sm text-muted-foreground">
                    Click "Use" on any asset to add it to the 3D scene where it can be 
                    turned into layered 3D objects.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">4. Bulk Operations</h4>
                  <p className="text-sm text-muted-foreground">
                    Select multiple assets for bulk operations like deletion. 
                    Use the dropdown menu in the gallery header.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Technical Implementation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">Frontend Components</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• AssetUploader - Drag & drop interface</li>
                    <li>• AssetGallery - Grid display with filtering</li>
                    <li>• AssetCard - Individual asset display</li>
                    <li>• AssetPreview - Modal preview dialog</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Backend Integration</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• MinIO storage for file management</li>
                    <li>• SQLite database for asset metadata</li>
                    <li>• Go API endpoints for CRUD operations</li>
                    <li>• File validation and security</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">State Management</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• useAssets hook for asset operations</li>
                    <li>• Upload progress tracking</li>
                    <li>• Selection state management</li>
                    <li>• Error handling and notifications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Phase 5 Completion Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Core Upload System</span>
                  <Badge variant="default" className="text-xs">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Asset Gallery & Display</span>
                  <Badge variant="default" className="text-xs">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Asset Management Operations</span>
                  <Badge variant="default" className="text-xs">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Search & Filtering</span>
                  <Badge variant="default" className="text-xs">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">UI/UX Enhancements</span>
                  <Badge variant="default" className="text-xs">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backend Integration</span>
                  <Badge variant="default" className="text-xs">Complete</Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium text-sm mb-2">Ready for Phase 6</h4>
                <p className="text-xs text-muted-foreground">
                  Asset management system is complete and ready for 3D Canvas integration. 
                  Assets can now be used to create layered 3D objects in the scene.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Instructions */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">ℹ</span>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Asset Management Demo Instructions
                </h3>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                  <p>
                    <strong>Left Panel:</strong> The asset management interface is located in the left panel. 
                    You can upload PNG files, view the asset gallery, and manage your assets from there.
                  </p>
                  <p>
                    <strong>Backend Required:</strong> Make sure the Go backend is running on port 8080 
                    for full upload functionality. The system will gracefully handle backend unavailability.
                  </p>
                  <p>
                    <strong>File Requirements:</strong> Upload PNG files with transparency for best results. 
                    The system validates file type and size automatically.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}