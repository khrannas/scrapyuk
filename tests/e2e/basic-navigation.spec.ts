import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Check that the main title is present
  await expect(page.getByText('ScrapYuk')).toBeVisible();
  
  // Check that the subtitle is present
  await expect(page.getByText('3D Pop-up Scrapbook Creator')).toBeVisible();
  
  // Check that the main canvas area is present
  await expect(page.getByText('3D Canvas')).toBeVisible();
  
  // Check that the left panel (Assets) is present
  await expect(page.getByText('Assets')).toBeVisible();
  
  // Check that the right panel (Properties) is present
  await expect(page.getByText('Properties')).toBeVisible();
});

test('layout structure is correct', async ({ page }) => {
  await page.goto('/');
  
  // Check that header is present
  const header = page.locator('header');
  await expect(header).toBeVisible();
  
  // Check that the three-column layout exists
  await expect(page.getByText('Upload PNG Images')).toBeVisible();
  await expect(page.getByText('Click, drag, and rotate to interact')).toBeVisible();
  await expect(page.getByText('Select an object to view and edit')).toBeVisible();
});

test('buttons are interactive', async ({ page }) => {
  await page.goto('/');
  
  // Check that action buttons are present and clickable
  await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /share/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /edit/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /view/i })).toBeVisible();
});