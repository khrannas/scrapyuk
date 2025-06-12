import { LoginCredentials, User, AuthResponse, Session } from '@/types';

// Hardcoded credentials for MVP (US-01 requirement)
const PREDEFINED_CREDENTIALS = {
  email: "admin@scrapyuk.com",
  password: "scrapyuk2024"
} as const;

// Mock user data
const MOCK_USER: User = {
  id: "user-1",
  email: "admin@scrapyuk.com",
  name: "ScrapYuk Admin",
  createdAt: new Date().toISOString()
};

// Session storage keys
const SESSION_KEYS = {
  TOKEN: 'scrapyuk_token',
  USER: 'scrapyuk_user',
  EXPIRES_AT: 'scrapyuk_expires_at'
} as const;

// Session duration: 24 hours
const SESSION_DURATION = 24 * 60 * 60 * 1000;

/**
 * Validates login credentials against hardcoded values
 */
export function validateCredentials(credentials: LoginCredentials): boolean {
  return (
    credentials.email === PREDEFINED_CREDENTIALS.email &&
    credentials.password === PREDEFINED_CREDENTIALS.password
  );
}

/**
 * Authenticates user with credentials and creates session
 */
export function authenticate(credentials: LoginCredentials): AuthResponse | null {
  if (!validateCredentials(credentials)) {
    return null;
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION);
  const token = generateSessionToken();

  const authResponse: AuthResponse = {
    user: MOCK_USER,
    token,
    expiresAt: expiresAt.toISOString()
  };

  // Store session in localStorage
  setSession(authResponse);

  return authResponse;
}

/**
 * Generates a simple session token
 */
function generateSessionToken(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  return `sy_${timestamp}_${random}`;
}

/**
 * Stores session data in localStorage
 */
export function setSession(authResponse: AuthResponse): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(SESSION_KEYS.TOKEN, authResponse.token);
    localStorage.setItem(SESSION_KEYS.USER, JSON.stringify(authResponse.user));
    localStorage.setItem(SESSION_KEYS.EXPIRES_AT, authResponse.expiresAt);
  } catch (error) {
    console.error('Failed to store session:', error);
  }
}

/**
 * Retrieves current session from localStorage
 */
export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;

  try {
    const token = localStorage.getItem(SESSION_KEYS.TOKEN);
    const userStr = localStorage.getItem(SESSION_KEYS.USER);
    const expiresAtStr = localStorage.getItem(SESSION_KEYS.EXPIRES_AT);

    if (!token || !userStr || !expiresAtStr) {
      return null;
    }

    const user = JSON.parse(userStr) as User;
    const expiresAt = expiresAtStr;
    const isValid = isSessionValid(expiresAt);

    return {
      user,
      token,
      expiresAt,
      isValid
    };
  } catch (error) {
    console.error('Failed to retrieve session:', error);
    return null;
  }
}

/**
 * Checks if session is still valid
 */
export function isSessionValid(expiresAt: string): boolean {
  const now = new Date();
  const expiry = new Date(expiresAt);
  return now < expiry;
}

/**
 * Clears session data from localStorage
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(SESSION_KEYS.TOKEN);
    localStorage.removeItem(SESSION_KEYS.USER);
    localStorage.removeItem(SESSION_KEYS.EXPIRES_AT);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

/**
 * Checks if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  const session = getSession();
  return session !== null && session.isValid;
}

/**
 * Gets current authenticated user
 */
export function getCurrentUser(): User | null {
  const session = getSession();
  return session && session.isValid ? session.user : null;
}

/**
 * Logs out user by clearing session
 */
export function logout(): void {
  clearSession();
}

/**
 * Refreshes session if it's still valid
 */
export function refreshSession(): AuthResponse | null {
  const session = getSession();
  
  if (!session || !session.isValid) {
    return null;
  }

  // Extend session by another 24 hours
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION);
  const newToken = generateSessionToken();

  const authResponse: AuthResponse = {
    user: session.user,
    token: newToken,
    expiresAt: expiresAt.toISOString()
  };

  setSession(authResponse);
  return authResponse;
}