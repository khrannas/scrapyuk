'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectDashboard } from '@/components/projects/ProjectDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { EditorState } from '@/types';
import { Eye, Edit, Plus, FolderOpen, Settings, TestTube, ArrowLeft } from 'lucide-react';
import { ProjectManagementDemo } from '@/components/projects/ProjectManagementDemo';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'overview' | 'projects' | 'demo'>('overview');
  const [editorState, setEditorState] = useState<EditorState>({
    mode: 'edit',
    selectedObjectId: null,
    showProperties: false,
    camera: {
      position: { x: 0, y: 5, z: 10 },
      target: { x: 0, y: 0, z: 0 }
    }
  });

  const toggleMode = () => {
    setEditorState(prev => ({
      ...prev,
      mode: prev.mode === 'edit' ? 'view' : 'edit',
      showProperties: prev.mode === 'view' ? false : prev.showProperties
    }));
  };

  // If we're in projects view, show the project dashboard
  if (currentView === 'projects') {
    return (
      <ProtectedRoute>
        <AppLayout editorState={editorState} onEditorStateChange={setEditorState}>
          <div className="p-6">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('overview')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
            <ProjectDashboard />
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  // If we're in demo view, show the project management demo
  if (currentView === 'demo') {
    return (
      <ProtectedRoute>
        <AppLayout editorState={editorState} onEditorStateChange={setEditorState}>
          <div className="p-6">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('overview')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
            <ProjectManagementDemo />
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout editorState={editorState} onEditorStateChange={setEditorState}>
        <div className="p-6 space-y-6">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.name}
              </h1>
              <p className="text-muted-foreground">
                Create and manage your 3D scrapbook projects
              </p>
            </div>
            
            {/* Edit/View Mode Toggle (US-04) */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Mode:
              </span>
              <Button
                variant={editorState.mode === 'edit' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleMode}
                className="flex items-center gap-2"
              >
                {editorState.mode === 'edit' ? (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit Mode
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    View Mode
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Mode Description */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {editorState.mode === 'edit' ? (
                  <Edit className="h-5 w-5 text-blue-600" />
                ) : (
                  <Eye className="h-5 w-5 text-indigo-600" />
                )}
                <div>
                  <p className="font-medium">
                    {editorState.mode === 'edit' ? 'Edit Mode Active' : 'View Mode Active'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {editorState.mode === 'edit' 
                      ? 'Full access to all editing tools, panels, and object manipulation controls'
                      : 'Clean preview mode with minimal UI - perfect for presentations and final review'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setCurrentView('projects')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  New Project
                </CardTitle>
                <CardDescription>
                  Start a new 3D scrapbook project with frame templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Create Project
                </Button>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setCurrentView('projects')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Manage Projects
                </CardTitle>
                <CardDescription>
                  Browse, edit, and organize your saved projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Browse Projects
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Workspace Settings
                </CardTitle>
                <CardDescription>
                  Customize your 3D workspace preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Open Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Project Management Demo
                </CardTitle>
                <CardDescription>
                  Experience the Phase 4 project management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setCurrentView('demo')}
                >
                  Launch Demo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest project updates and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activity yet.</p>
                <p className="text-sm">Create your first project to get started!</p>
              </div>
            </CardContent>
          </Card>

          {/* Feature Showcase for Edit/View Modes */}
          <Card>
            <CardHeader>
              <CardTitle>Edit vs View Mode Features</CardTitle>
              <CardDescription>
                Understanding the difference between editing and viewing modes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium">Edit Mode</h4>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Full toolbar and panels visible</li>
                    <li>• Object selection and manipulation</li>
                    <li>• Properties panel with layer controls</li>
                    <li>• Add, delete, and modify objects</li>
                    <li>• Lighting and camera adjustments</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-indigo-600" />
                    <h4 className="font-medium">View Mode</h4>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Clean, minimal interface</li>
                    <li>• Focus on 3D canvas presentation</li>
                    <li>• Basic camera controls only</li>
                    <li>• Perfect for client previews</li>
                    <li>• Ideal for final project review</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}