import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should redirect to login page when accessing root', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect to login when accessing protected route without authentication', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.url()).toContain('from=%2Fdashboard');
  });

  test('should display login form with demo credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Check login form is displayed
    await expect(page.locator('h1')).toContainText('Welcome to ScrapYuk');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Check demo credentials are shown
    await expect(page.locator('text=Demo Credentials:')).toBeVisible();
    await expect(page.locator('text=admin@scrapyuk.com')).toBeVisible();
    await expect(page.locator('text=scrapyuk2024')).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.goto('/login');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('should successfully login with valid credentials and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in valid credentials
    await page.fill('input[type="email"]', 'admin@scrapyuk.com');
    await page.fill('input[type="password"]', 'scrapyuk2024');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Check dashboard content
    await expect(page.locator('h1')).toContainText('Welcome back, ScrapYuk Admin');
    await expect(page.locator('text=Create and manage your 3D scrapbook projects')).toBeVisible();
  });

  test('should display Edit/View mode toggle on dashboard', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@scrapyuk.com');
    await page.fill('input[type="password"]', 'scrapyuk2024');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Check Edit/View mode toggle is present
    await expect(page.locator('text=Mode:')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Edit Mode' })).toBeVisible();
  });

  test('should toggle between Edit and View modes', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@scrapyuk.com');
    await page.fill('input[type="password"]', 'scrapyuk2024');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Initially should be in Edit mode
    await expect(page.locator('button', { hasText: 'Edit Mode' })).toBeVisible();
    await expect(page.locator('text=Edit Mode Active')).toBeVisible();
    
    // Click to switch to View mode
    await page.getByRole('button', { name: 'Edit Mode' }).click();
    
    // Should now show View mode
    await expect(page.locator('button', { hasText: 'View Mode' })).toBeVisible();
    await expect(page.locator('text=View Mode Active')).toBeVisible();
  });

  test('should show logout functionality in header', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@scrapyuk.com');
    await page.fill('input[type="password"]', 'scrapyuk2024');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Check user info and logout button in header
    await expect(page.locator('text=ScrapYuk Admin')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Logout' })).toBeVisible();
  });

  test('should logout and redirect to login page', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@scrapyuk.com');
    await page.fill('input[type="password"]', 'scrapyuk2024');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Click logout
    await page.getByRole('button', { name: 'Logout' }).click();
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should persist session across page refresh', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@scrapyuk.com');
    await page.fill('input[type="password"]', 'scrapyuk2024');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Refresh the page
    await page.reload();
    
    // Should still be on dashboard (session persisted)
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Welcome back, ScrapYuk Admin');
  });
});