import { test, expect } from '@playwright/test';

/**
 * Test Suite: Homepage & Navigation
 *
 * Covers:
 * - Operation count verification
 * - Sidebar display
 * - Grouping modes
 * - Navigation functionality
 */
test.describe('Homepage & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays 8 operations total (4 REST + 4 AsyncAPI)', async ({ page }) => {
    // Verify header shows correct count
    await expect(page.getByText(/8 operations/i)).toBeVisible();

    // Verify both communication pattern groups exist
    await expect(page.getByRole('heading', { name: /request response/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /publish subscribe/i })).toBeVisible();

    // Count operation cards in each group
    const requestResponseGroup = page.locator('text=request response').locator('..').locator('..');
    const operationCards1 = requestResponseGroup.getByRole('generic').filter({ hasText: /GET|POST/ });
    await expect(operationCards1).toHaveCount(4);

    const publishSubscribeGroup = page.locator('text=publish subscribe').locator('..').locator('..');
    const operationCards2 = publishSubscribeGroup.getByRole('generic').filter({ hasText: /PUBLISH|SUBSCRIBE/ });
    await expect(operationCards2).toHaveCount(4);
  });

  test('sidebar displays 2 contracts with correct info', async ({ page }) => {
    // Verify "Contracts" heading
    await expect(page.getByRole('heading', { name: 'Contracts', exact: true })).toBeVisible();
    await expect(page.getByText('2 contracts')).toBeVisible();

    // Verify E-commerce API contract
    await expect(page.getByText('E-commerce API')).toBeVisible();
    await expect(page.getByText('🔷 REST')).toBeVisible();
    await expect(page.getByText('v1.0.0')).toBeVisible();

    // Verify Simple Event Stream contract
    await expect(page.getByText('Simple Event Stream')).toBeVisible();
    await expect(page.getByText('🟣 Event')).toBeVisible();
  });

  test('grouping mode: By Contract shows operations under each contract', async ({ page }) => {
    // Should be default mode - verify contract-based grouping
    const ecommerceSection = page.locator('text=E-commerce API').locator('..').locator('..');

    // Verify 4 REST operations under E-commerce API
    await expect(ecommerceSection.getByText('List all products')).toBeVisible();
    await expect(ecommerceSection.getByText('Get product details')).toBeVisible();
    await expect(ecommerceSection.getByText('Create new order')).toBeVisible();
    await expect(ecommerceSection.getByText("Get user's orders")).toBeVisible();

    const eventSection = page.locator('text=Simple Event Stream').locator('..').locator('..');

    // Verify 4 AsyncAPI operations under Simple Event Stream
    await expect(eventSection.getByText('Publish order created event')).toBeVisible();
    await expect(eventSection.getByText('Subscribe to order created events')).toBeVisible();
    await expect(eventSection.getByText('Publish order updated event')).toBeVisible();
    await expect(eventSection.getByText('Subscribe to order updated events')).toBeVisible();
  });

  test('grouping mode: By Category groups operations by tags', async ({ page }) => {
    // Click "By Category" button
    await page.getByRole('button', { name: 'By Category' }).click();

    // Verify category groups appear
    await expect(page.getByText(/Products/i)).toBeVisible();
    await expect(page.getByText(/Orders/i)).toBeVisible();
    await expect(page.getByText(/Users/i)).toBeVisible();
  });

  test('grouping mode: By Pattern groups by communication pattern', async ({ page }) => {
    // Click "Communication Pattern" button (should be default, but click to ensure)
    await page.getByRole('button', { name: 'Communication Pattern' }).click();

    // Verify pattern groups
    await expect(page.getByRole('heading', { name: /request response/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /publish subscribe/i })).toBeVisible();

    // Verify count badges
    await expect(page.getByText('(4)')).toHaveCount(2); // Both groups have 4 operations
  });

  test('sidebar navigation: clicking operation navigates to detail page', async ({ page }) => {
    // Click on a REST operation in sidebar
    await page.getByRole('button', { name: /List all products.*GET/i }).click();

    // Verify navigation to operation detail page
    await expect(page).toHaveURL(/\/operations\/listProducts/);
    await expect(page.getByRole('heading', { name: 'List all products' })).toBeVisible();
  });

  test('sidebar navigation: clicking AsyncAPI operation navigates to detail page', async ({ page }) => {
    // Click on an AsyncAPI operation in sidebar
    await page.getByRole('button', { name: /Subscribe to order created events.*SUBSCRIBE/i }).click();

    // Verify navigation
    await expect(page).toHaveURL(/\/operations\/subscribeOrderCreated/);
    await expect(page.getByRole('heading', { name: 'Subscribe to order created events' })).toBeVisible();
  });

  test('operation card click navigates to detail page', async ({ page }) => {
    // Click on an operation card in main content
    await page.getByRole('heading', { name: 'Create new order' }).click();

    // Verify navigation
    await expect(page).toHaveURL(/\/operations\/createOrder/);
    await expect(page.getByRole('heading', { name: 'Create new order', level: 3 })).toBeVisible();
  });

  test('displays protocol badges correctly', async ({ page }) => {
    // Verify REST protocol badge (blue diamond)
    const restBadges = page.getByText('🔷 REST');
    await expect(restBadges.first()).toBeVisible();

    // Verify Event protocol badge (purple circle)
    const eventBadges = page.getByText('🟣 Event');
    await expect(eventBadges.first()).toBeVisible();
  });

  test('displays communication pattern icons correctly', async ({ page }) => {
    // Verify Request/Response icon (⇄)
    await expect(page.getByText('⇄')).toHaveCount(4); // 4 REST operations

    // Verify Publish/Subscribe icon (⇉)
    await expect(page.getByText('⇉')).toHaveCount(4); // 4 AsyncAPI operations
  });

  test('displays action type badges with correct text', async ({ page }) => {
    // Verify GET badges (blue)
    const getBadges = page.getByText('GET', { exact: true });
    await expect(getBadges).toHaveCount(3); // 3 GET operations

    // Verify POST badge (green)
    await expect(page.getByText('POST', { exact: true })).toBeVisible();

    // Verify PUBLISH badges (purple)
    const publishBadges = page.getByText('PUBLISH', { exact: true });
    await expect(publishBadges).toHaveCount(2);

    // Verify SUBSCRIBE badges (orange)
    const subscribeBadges = page.getByText('SUBSCRIBE', { exact: true });
    await expect(subscribeBadges).toHaveCount(2);
  });
});
