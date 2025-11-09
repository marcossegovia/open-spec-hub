import { test, expect } from '@playwright/test';

/**
 * Test Suite: AsyncAPI Operation Detail Pages
 *
 * Covers:
 * - PUBLISH operation pages
 * - SUBSCRIBE operation pages
 * - Message schemas
 * - Example messages display (NEW)
 * - Event metadata
 * - Channel information
 */
test.describe('AsyncAPI Operation Detail Pages', () => {
  test('SUBSCRIBE operation displays correctly', async ({ page }) => {
    await page.goto('/operations/subscribeOrderCreated');

    // Verify operation header
    await expect(page.getByRole('heading', { name: 'Subscribe to order created events' })).toBeVisible();
    await expect(page.getByText('SUBSCRIBE', { exact: true })).toBeVisible();
    await expect(page.getByText('⇉')).toBeVisible(); // Publish/Subscribe icon

    // Verify channel address
    await expect(page.getByText('orders.created')).toBeVisible();

    // Verify contract information
    await expect(page.getByText('Contract:')).toBeVisible();
    await expect(page.getByText('Simple Event Stream')).toBeVisible();
    await expect(page.getByText('v1.0.0')).toBeVisible();
  });

  test('PUBLISH operation displays correctly', async ({ page }) => {
    await page.goto('/operations/publishOrderCreated');

    // Verify operation header
    await expect(page.getByRole('heading', { name: 'Publish order created event' })).toBeVisible();
    await expect(page.getByText('PUBLISH', { exact: true })).toBeVisible();

    // Verify description
    await expect(page.getByText('Emit this event when a new order is created')).toBeVisible();
  });

  test('SUBSCRIBE operation shows output (received message) schema', async ({ page }) => {
    await page.goto('/operations/subscribeOrderCreated');

    // Verify Output heading
    await expect(page.getByRole('heading', { name: 'Output' })).toBeVisible();

    // Verify message name
    await expect(page.getByRole('heading', { name: 'OrderCreated' })).toBeVisible();
    await expect(page.getByText('application/json')).toBeVisible();

    // Verify schema properties
    await expect(page.getByText('orderId')).toBeVisible();
    await expect(page.getByText('userId')).toBeVisible();
    await expect(page.getByText('total')).toBeVisible();
    await expect(page.getByText('items')).toBeVisible();

    // Verify required fields are marked
    await expect(page.getByText('required')).toHaveCount(3); // orderId, userId, total
  });

  test('PUBLISH operation shows input (sent message) schema', async ({ page }) => {
    await page.goto('/operations/publishOrderCreated');

    // Should show Input section for PUBLISH
    const inputHeadings = page.getByRole('heading', { name: /Input|Output/ });
    await expect(inputHeadings.first()).toBeVisible();

    // Verify message schema properties
    await expect(page.getByText('orderId')).toBeVisible();
    await expect(page.getByText('userId')).toBeVisible();
    await expect(page.getByText('total')).toBeVisible();
  });

  test('SUBSCRIBE operation displays example message (NEW FEATURE)', async ({ page }) => {
    await page.goto('/operations/subscribeOrderCreated');

    // Verify Example Response section exists
    await expect(page.getByRole('heading', { name: 'Example Response', level: 4 })).toBeVisible();

    // Verify example message data
    await expect(page.getByText(/"orderId":/)).toBeVisible();
    await expect(page.getByText(/"order-abc-123"/)).toBeVisible();
    await expect(page.getByText(/"userId":/)).toBeVisible();
    await expect(page.getByText(/"user-456"/)).toBeVisible();
    await expect(page.getByText(/"total":/)).toBeVisible();
    await expect(page.getByText(/172\.97/)).toBeVisible();

    // Verify items array in example
    await expect(page.getByText(/"items":/)).toBeVisible();
    await expect(page.getByText(/"prod-123"/)).toBeVisible();
    await expect(page.getByText(/"prod-456"/)).toBeVisible();

    // Verify copy button
    const copyButtons = page.getByRole('button', { name: 'Copy' });
    await expect(copyButtons).toHaveCount(2); // Example + Code examples
  });

  test('PUBLISH operation displays example message (NEW FEATURE)', async ({ page }) => {
    await page.goto('/operations/publishOrderCreated');

    // For PUBLISH, example should be in Input section
    await expect(page.getByRole('heading', { name: /Example/i })).toBeVisible();

    // Verify example data exists
    await expect(page.getByText(/"orderId":/)).toBeVisible();
    await expect(page.getByText(/"order-abc-123"/)).toBeVisible();
  });

  test('Event metadata section displays correctly', async ({ page }) => {
    await page.goto('/operations/subscribeOrderCreated');

    // Verify Event Metadata heading
    await expect(page.getByRole('heading', { name: 'Event Metadata' })).toBeVisible();

    // Verify metadata fields
    await expect(page.getByText('Channel:')).toBeVisible();
    await expect(page.getByText('orders.created')).toBeVisible();
    await expect(page.getByText('Action:')).toBeVisible();
    await expect(page.getByText('receive')).toBeVisible();
  });

  test('PUBLISH shows "send" action in metadata', async ({ page }) => {
    await page.goto('/operations/publishOrderCreated');

    // Verify Event Metadata
    await expect(page.getByRole('heading', { name: 'Event Metadata' })).toBeVisible();
    await expect(page.getByText('Action:')).toBeVisible();
    await expect(page.getByText('send')).toBeVisible(); // PUBLISH = send
  });

  test('OrderUpdated operation displays with multiple examples', async ({ page }) => {
    await page.goto('/operations/subscribeOrderUpdated');

    // Verify operation displays
    await expect(page.getByRole('heading', { name: 'Subscribe to order updated events' })).toBeVisible();

    // Verify channel
    await expect(page.getByText('orders.updated')).toBeVisible();

    // Verify example exists (should use first example)
    await expect(page.getByRole('heading', { name: 'Example Response', level: 4 })).toBeVisible();

    // Verify example data (should be OrderShippedExample - the first one)
    await expect(page.getByText(/"status":/)).toBeVisible();
    await expect(page.getByText(/"shipped"/)).toBeVisible();
    await expect(page.getByText(/"trackingNumber":/)).toBeVisible();
  });

  test('protocol badge shows Event for AsyncAPI', async ({ page }) => {
    await page.goto('/operations/subscribeOrderCreated');

    // Verify Event badge
    await expect(page.getByText('🟣 Event')).toBeVisible();

    // Should NOT show REST badge
    await expect(page.getByText('🔷 REST')).not.toBeVisible();
  });

  test('array items in message schema render correctly', async ({ page }) => {
    await page.goto('/operations/subscribeOrderCreated');

    // Verify items property
    await expect(page.getByText('items')).toBeVisible();
    await expect(page.getByText('array')).toBeVisible();

    // Verify "Array items:" label
    await expect(page.getByText('Array items:')).toBeVisible();

    // Verify item object properties
    await expect(page.getByText('productId')).toBeVisible();
    await expect(page.getByText('quantity')).toBeVisible();
  });

  test('back to operations button works from AsyncAPI page', async ({ page }) => {
    await page.goto('/operations/publishOrderUpdated');

    // Click back button
    await page.getByRole('button', { name: 'Back to Operations' }).click();

    // Verify navigation back to homepage
    await expect(page).toHaveURL('/');
  });

  test('breadcrumb shows correct path for AsyncAPI operation', async ({ page }) => {
    await page.goto('/operations/publishOrderCreated');

    // Verify breadcrumb
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'All Operations' })).toBeVisible();
    await expect(page.getByText('Publish order created event')).toBeVisible();
  });

  test('message contentType displays correctly', async ({ page }) => {
    await page.goto('/operations/subscribeOrderCreated');

    // Verify content type
    await expect(page.getByText('application/json')).toBeVisible();
  });

  test('enum values display in OrderUpdated schema', async ({ page }) => {
    await page.goto('/operations/subscribeOrderUpdated');

    // Verify status field (has enum)
    await expect(page.getByText('status')).toBeVisible();

    // Verify enum values are documented (may be in schema description)
    await expect(page.getByText(/pending|confirmed|shipped|delivered/i)).toBeVisible();
  });
});
