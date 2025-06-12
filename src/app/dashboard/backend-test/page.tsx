import { BackendTest } from '@/components/test/BackendTest';

export default function BackendTestPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Backend API Test</h1>
        <p className="text-gray-600 mt-2">
          Test the integration between the Next.js frontend and Go backend API.
        </p>
      </div>
      
      <BackendTest />
    </div>
  );
}