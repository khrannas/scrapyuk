'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api, HealthStatus } from '@/lib/api';
import { useProjects } from '@/hooks/useProjects';

export function BackendTest() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    fetchProjects,
    createProject,
  } = useProjects({ autoFetch: true });

  const checkHealth = async () => {
    try {
      setHealthLoading(true);
      setHealthError(null);
      
      const response = await api.detailedHealthCheck();
      
      if (response.success && response.data) {
        setHealthStatus(response.data);
      } else {
        throw new Error(response.error || 'Health check failed');
      }
    } catch (error) {
      setHealthError(error instanceof Error ? error.message : 'Health check failed');
    } finally {
      setHealthLoading(false);
    }
  };

  const createTestProject = async () => {
    const testProject = {
      title: `Test Project ${Date.now()}`,
      frame_size: '20x20' as const,
      project_data: {
        version: '1.0',
        settings: {
          backgroundColor: '#ffffff',
          lighting: { enabled: true, intensity: 1.0 }
        },
        objects: []
      }
    };

    await createProject(testProject);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Backend API Health Check</CardTitle>
          <CardDescription>
            Test the connection to the Go backend server
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={checkHealth} disabled={healthLoading}>
              {healthLoading ? 'Checking...' : 'Check Health'}
            </Button>
          </div>

          {healthError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
              <strong>Error:</strong> {healthError}
            </div>
          )}

          {healthStatus && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span>Overall Status:</span>
                <Badge className={`${getStatusColor(healthStatus.status)} text-white`}>
                  {healthStatus.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Service:</strong> {healthStatus.service}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Database:</strong>
                  <Badge 
                    variant={healthStatus.database === 'ok' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {healthStatus.database}
                  </Badge>
                  {healthStatus.database_error && (
                    <span className="text-red-600 text-xs">
                      ({healthStatus.database_error})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Storage:</strong>
                  <Badge 
                    variant={healthStatus.storage === 'ok' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {healthStatus.storage}
                  </Badge>
                  {healthStatus.storage_error && (
                    <span className="text-yellow-600 text-xs">
                      ({healthStatus.storage_error})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects API Test</CardTitle>
          <CardDescription>
            Test project CRUD operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => fetchProjects()} disabled={projectsLoading}>
              {projectsLoading ? 'Loading...' : 'Fetch Projects'}
            </Button>
            <Button onClick={createTestProject} variant="outline">
              Create Test Project
            </Button>
          </div>

          {projectsError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
              <strong>Error:</strong> {projectsError}
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Projects ({projects.length}):</h4>
            {projects.length === 0 ? (
              <p className="text-gray-500 text-sm">No projects found</p>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{project.title}</h5>
                        <p className="text-sm text-gray-600">
                          Frame: {project.frame_size} | Created: {' '}
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        ID: {project.id}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>
            Available backend endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            <div><strong>Health:</strong> GET /health, GET /health/detailed</div>
            <div><strong>Projects:</strong> GET/POST /api/projects, GET/PUT/DELETE /api/projects/:id</div>
            <div><strong>Assets:</strong> GET/POST /api/projects/:id/assets, DELETE /api/assets/:id</div>
            <div><strong>Shared Links:</strong> POST /api/shared-links, GET /api/shared/:token</div>
            <div><strong>Documentation:</strong> GET /api</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}