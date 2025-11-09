# E2E Test Suite

Comprehensive end-to-end tests for the API Docs Platform using Playwright.

## Test Coverage

### 📋 Test Suites

1. **homepage.spec.ts** - Homepage & Navigation (11 tests)
   - 8 operations display verification
   - Sidebar functionality
   - Grouping modes (Contract/Category/Pattern)
   - Navigation functionality
   - Protocol badges and icons

2. **operation-rest.spec.ts** - REST Operation Pages (13 tests)
   - GET/POST operation pages
   - Parameters display
   - Input/Output schemas
   - **Example Request/Response display** ✨ NEW
   - REST metadata
   - Breadcrumb navigation

3. **operation-async.spec.ts** - AsyncAPI Operation Pages (15 tests)
   - PUBLISH/SUBSCRIBE operations
   - Message schemas
   - **Example message display** ✨ NEW
   - Event metadata
   - Channel information
   - Enum values

4. **code-examples.spec.ts** - Code Generation (22 tests)
   - Language tabs (JavaScript, Python, cURL)
   - REST code generation
   - AsyncAPI code generation (KafkaJS, kafka-python)
   - Copy-to-clipboard functionality
   - Dynamic code generation

5. **search-filter.spec.ts** - Search & Filtering (20 tests)
   - Search by name, location, channel
   - Tag/category filtering
   - Grouping modes
   - Combined filters
   - Filter UI/UX

**Total: 81+ automated tests**

---

## Running Tests

### Prerequisites

```bash
# Install dependencies (if not already done)
npm install

# Install Playwright browsers (if not already done)
npx playwright install chromium
```

### Run All Tests

```bash
# Run all tests (headless mode)
npm test

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Show test report
npm run test:report
```

### Run Specific Test Suites

```bash
# Run only homepage tests
npx playwright test tests/e2e/homepage.spec.ts

# Run only REST operation tests
npx playwright test tests/e2e/operation-rest.spec.ts

# Run only AsyncAPI tests
npx playwright test tests/e2e/operation-async.spec.ts

# Run only code examples tests
npx playwright test tests/e2e/code-examples.spec.ts

# Run only search/filter tests
npx playwright test tests/e2e/search-filter.spec.ts
```

### Run Specific Tests

```bash
# Run a single test by name
npx playwright test -g "displays 8 operations total"

# Run tests matching a pattern
npx playwright test -g "example"
```

---

## Test Configuration

Configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000`
- **Browser**: Chromium (Desktop Chrome)
- **Timeout**: 30 seconds per test
- **Auto-start dev server**: Yes (if not already running)
- **Screenshots**: On failure
- **Trace**: On first retry

---

## Writing New Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // Navigate before each test
  });

  test('test description', async ({ page }) => {
    // Arrange
    await page.goto('/operations/listProducts');

    // Act
    await page.getByText('Click Me').click();

    // Assert
    await expect(page.getByText('Result')).toBeVisible();
  });
});
```

### Best Practices

1. **Use semantic selectors**: Prefer `getByRole`, `getByText`, `getByPlaceholder`
2. **Wait for elements**: Use `await expect(...).toBeVisible()`
3. **Descriptive test names**: Clearly describe what is being tested
4. **Group related tests**: Use `test.describe()` blocks
5. **Clean state**: Use `beforeEach` to reset state

---

## CI/CD Integration

Tests can be integrated into GitHub Actions or other CI/CD pipelines:

```yaml
# Example .github/workflows/test.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Debugging Tests

### Visual Debugging

```bash
# Run tests in headed mode
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Run with debug mode
npx playwright test --debug
```

### Screenshots and Traces

```bash
# Take screenshots on all tests
npx playwright test --screenshot=on

# Record trace for debugging
npx playwright test --trace=on
```

---

## Test Maintenance

### When to Update Tests

- ✅ Adding new features
- ✅ Changing UI structure
- ✅ Modifying navigation
- ✅ Updating examples or data

### Common Issues

**Issue**: Tests fail locally but pass in CI
- **Solution**: Check for timing issues, use proper waits

**Issue**: Flaky tests
- **Solution**: Increase timeout, ensure proper state cleanup

**Issue**: Element not found
- **Solution**: Verify selector, check if element is in viewport

---

## Coverage

Current test coverage includes:

- ✅ All 8 operations (4 REST + 4 AsyncAPI)
- ✅ Homepage navigation and sidebar
- ✅ Operation detail pages (all types)
- ✅ Search and filtering
- ✅ Code example generation
- ✅ Example request/response display (NEW)
- ✅ Copy-to-clipboard functionality
- ✅ Protocol abstraction (badges, icons)
- ✅ Grouping modes
- ✅ Breadcrumb navigation

### Not Covered (Future)

- ⚠️ Mobile/responsive layouts
- ⚠️ Accessibility (ARIA, keyboard nav)
- ⚠️ Performance benchmarks
- ⚠️ Error boundaries

---

## Questions?

See [Playwright documentation](https://playwright.dev/docs/intro) for more details on writing and running tests.
