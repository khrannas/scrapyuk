import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Re-export the hook from context for easier imports
export const useAuth = useAuthContext;

// Export additional hooks for specific auth needs
export { useRequireAuth } from '@/contexts/AuthContext';