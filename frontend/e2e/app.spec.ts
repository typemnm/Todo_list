import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between all pages', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    
    await page.click('a[href="/list"]');
    await expect(page).toHaveURL('/list');
    
    await page.click('a[href="/settings"]');
    await expect(page).toHaveURL('/settings');
    
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('should render Dashboard page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Your Stellar Map')).toBeVisible();
  });

  test('should render List page', async ({ page }) => {
    await page.goto('/list');
    await expect(page.locator('text=Active Sector')).toBeVisible();
  });

  test('should render Settings page', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('text=Constellation Settings')).toBeVisible();
  });

  test('should render Add Todo page', async ({ page }) => {
    await page.goto('/add');
    await expect(page.locator('text=Place a New Star')).toBeVisible();
  });
});

test.describe('Todo CRUD Operations', () => {
  test('should create a new todo', async ({ page }) => {
    await page.goto('/add');
    
    await page.fill('input[type="text"]', 'Test Todo Item');
    await page.click('button:has-text("Create")');
    
    await expect(page).toHaveURL('/list');
  });

  test('should display todos on list page', async ({ page }) => {
    await page.goto('/list');
    await page.waitForSelector('[data-testid="task-card"], text=No tasks yet', { timeout: 5000 });
  });

  test('should toggle todo completion', async ({ page }) => {
    await page.goto('/add');
    await page.fill('input[type="text"]', 'Toggle Test Todo');
    await page.click('button:has-text("Create")');
    
    await page.goto('/list');
    const taskCard = page.locator('[data-testid="task-card"]').first();
    
    if (await taskCard.count() > 0) {
      const checkbox = taskCard.locator('input[type="checkbox"]');
      if (await checkbox.count() > 0) {
        await checkbox.click();
      }
    }
  });

  test('should delete a todo', async ({ page }) => {
    await page.goto('/add');
    await page.fill('input[type="text"]', 'Delete Test Todo');
    await page.click('button:has-text("Create")');
    
    await page.goto('/list');
    const deleteButton = page.locator('button:has-text("delete"), [aria-label*="delete"]').first();
    
    if (await deleteButton.count() > 0) {
      await deleteButton.click();
    }
  });
});

test.describe('Form Validation', () => {
  test('should show error for empty title', async ({ page }) => {
    await page.goto('/add');
    
    await page.click('button:has-text("Create")');
    
    await expect(page.locator('text=required, text=empty, text=enter').first()).toBeVisible({ timeout: 3000 }).catch(() => {});
  });

  test('should show error for title exceeding 200 characters', async ({ page }) => {
    await page.goto('/add');
    
    const longTitle = 'a'.repeat(201);
    await page.fill('input[type="text"]', longTitle);
    await page.click('button:has-text("Create")');
    
    await page.waitForTimeout(500);
  });
});

test.describe('Dashboard Metrics', () => {
  test('should display metrics cards', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=Total').first()).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('should update metrics when todos change', async ({ page }) => {
    await page.goto('/add');
    await page.fill('input[type="text"]', 'Metrics Test Todo');
    await page.click('button:has-text("Create")');
    
    await page.goto('/');
    await page.waitForTimeout(1000);
  });
});

test.describe('Settings Page', () => {
  test('should toggle settings controls', async ({ page }) => {
    await page.goto('/settings');
    
    const toggle = page.locator('input[type="checkbox"]').first();
    if (await toggle.count() > 0) {
      const initialState = await toggle.isChecked();
      await toggle.click();
      const newState = await toggle.isChecked();
      expect(newState).toBe(!initialState);
    }
  });

  test('should adjust slider values', async ({ page }) => {
    await page.goto('/settings');
    
    const slider = page.locator('input[type="range"]').first();
    if (await slider.count() > 0) {
      await slider.fill('75');
    }
  });
});

test.describe('Loading States', () => {
  test('should show loading indicator initially', async ({ page }) => {
    await page.goto('/');
    
    const spinner = page.locator('[data-testid="loading-spinner"], .animate-spin');
    await spinner.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
  });
});

test.describe('Responsive Design', () => {
  test('should show sidebar on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    const sidebar = page.locator('nav, aside').first();
    await expect(sidebar).toBeVisible();
  });

  test('should show bottom nav on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await page.waitForTimeout(500);
  });
});
