import { validateCredentials, authenticate, isSessionValid } from '@/lib/auth';
import { LoginCredentials } from '@/types';

// Mock localStorage for testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Authentication System', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('validateCredentials', () => {
    it('should return true for valid predefined credentials', () => {
      const validCredentials: LoginCredentials = {
        email: 'admin@scrapyuk.com',
        password: 'scrapyuk2024'
      };

      expect(validateCredentials(validCredentials)).toBe(true);
    });

    it('should return false for invalid email', () => {
      const invalidCredentials: LoginCredentials = {
        email: 'wrong@email.com',
        password: 'scrapyuk2024'
      };

      expect(validateCredentials(invalidCredentials)).toBe(false);
    });

    it('should return false for invalid password', () => {
      const invalidCredentials: LoginCredentials = {
        email: 'admin@scrapyuk.com',
        password: 'wrongpassword'
      };

      expect(validateCredentials(invalidCredentials)).toBe(false);
    });

    it('should return false for both invalid email and password', () => {
      const invalidCredentials: LoginCredentials = {
        email: 'wrong@email.com',
        password: 'wrongpassword'
      };

      expect(validateCredentials(invalidCredentials)).toBe(false);
    });
  });

  describe('authenticate', () => {
    it('should return AuthResponse for valid credentials', () => {
      const validCredentials: LoginCredentials = {
        email: 'admin@scrapyuk.com',
        password: 'scrapyuk2024'
      };

      const result = authenticate(validCredentials);

      expect(result).not.toBeNull();
      expect(result?.user.email).toBe('admin@scrapyuk.com');
      expect(result?.user.name).toBe('ScrapYuk Admin');
      expect(result?.token).toMatch(/^sy_\d+_/);
      expect(result?.expiresAt).toBeDefined();

      // Verify localStorage was called
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(3);
    });

    it('should return null for invalid credentials', () => {
      const invalidCredentials: LoginCredentials = {
        email: 'wrong@email.com',
        password: 'wrongpassword'
      };

      const result = authenticate(invalidCredentials);

      expect(result).toBeNull();
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('isSessionValid', () => {
    it('should return true for future expiration date', () => {
      const futureDate = new Date(Date.now() + 60000); // 1 minute from now
      expect(isSessionValid(futureDate.toISOString())).toBe(true);
    });

    it('should return false for past expiration date', () => {
      const pastDate = new Date(Date.now() - 60000); // 1 minute ago
      expect(isSessionValid(pastDate.toISOString())).toBe(false);
    });
  });
});