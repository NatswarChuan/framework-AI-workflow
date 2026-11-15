import { test, expect } from '@playwright/test';

test.describe('Spring-NWVMC Universal E-Commerce & Abnormal E2E Suite', () => {

  test('E2E Scenario 1: Complete B2C2B2C Marketplace Lifecycle & Security Masking', async ({ page }) => {
    const uid = Date.now().toString().slice(-6);
    const storeName = `Akihabara Tech Store ${uid}`;
    const storeLicense = `BL-AKB-${uid}`;
    const skuCode = `SKU-PW-${uid}`;
    const customerEmail = `tanaka.${uid}@example.com`;

    // 1. Visit Portal
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Spring-NWVMC Universal Enterprise Portal');

    // Verify initial Superadmin authenticated persona
    const badge = page.getByTestId('auth-status-badge');
    await expect(badge).toHaveText('Authenticated JWT');
    await expect(page.getByTestId('active-username')).toHaveText('platform.superadmin');

    // 2. Onboard a Vendor Store
    await page.getByTestId('input-store-name').fill(storeName);
    await page.getByTestId('input-business-license').fill(storeLicense);
    await page.getByTestId('input-store-desc').fill('Premier Japanese tech vendor');
    await page.getByTestId('btn-create-store').click();

    // Verify store registered with AutoCode and AutoSlug
    await expect(page.getByTestId('store-status-msg')).toContainText('Created store');
    await expect(page.getByTestId('store-list-body')).toContainText(storeName);
    await expect(page.getByTestId('store-list-body')).toContainText(`akihabara-tech-store-${uid}`);

    // 3. Navigate to Catalog Tab & Create Product with Protected Cost
    await page.getByTestId('tab-catalog').click();
    await page.getByTestId('input-catalog-sku').fill(skuCode);
    await page.getByTestId('input-catalog-name').fill('Playwright Noise Cancelling Headphones');
    await page.getByTestId('input-catalog-retail-price').fill('349.99');
    await page.getByTestId('input-catalog-cost-price').fill('180.00');
    await page.getByTestId('btn-create-catalog').click();

    await expect(page.getByTestId('catalog-status-msg')).toContainText('created successfully');
    await expect(page.getByTestId('catalog-list-body')).toContainText(skuCode);
    // Admin can see the internal cost price ($180.00)
    await expect(page.getByTestId('catalog-list-body')).toContainText('$180.00');

    // 4. Switch Persona to End Consumer (ROLE_USER)
    await page.getByTestId('persona-select').selectOption('ROLE_USER');
    await expect(page.getByTestId('active-username')).toHaveText('consumer.tanaka');

    // Verify @FieldSecurity masking takes effect: cost price is masked from the customer!
    await expect(page.getByTestId('catalog-list-body')).toContainText('🔒 Masked / Restricted');

    // 5. Customer places an Order
    await page.getByTestId('tab-orders').click();
    await page.getByTestId('input-order-email').fill(customerEmail);
    await page.getByTestId('input-order-name').fill('Tanaka Taro');
    await page.getByTestId('input-order-address').fill('Shinjuku 2-chome, Tokyo, Japan');
    await page.getByTestId('input-order-gross').fill('349.99');
    await page.getByTestId('btn-create-order').click();

    await expect(page.getByTestId('order-status-msg')).toContainText('Order ORD-B2C2B2C-');
    await expect(page.getByTestId('order-list-body')).toContainText('Tanaka Taro');
    await expect(page.getByTestId('order-list-body')).toContainText('CREATED');

    // Extract Order Code from the first row
    const firstOrderCodeElem = page.locator('[data-testid^="order-status-ORD-B2C2B2C-"]').first();
    const testId = await firstOrderCodeElem.getAttribute('data-testid');
    const orderCode = testId?.replace('order-status-', '') || '';
    expect(orderCode).toContain('ORD-B2C2B2C-');

    // 6. Switch Persona to Vendor Admin (ROLE_ADMIN) to fulfill Order
    await page.getByTestId('persona-select').selectOption('ROLE_ADMIN');
    await expect(page.getByTestId('active-username')).toHaveText('tokyo.electronics.admin');

    // Step State Machine: CREATED -> PENDING_PAYMENT
    const btnPending = page.getByTestId(`btn-trans-pending-${orderCode}`);
    await btnPending.click();
    await expect(page.getByTestId(`order-status-${orderCode}`)).toContainText('PENDING PAYMENT');

    // Step State Machine: PENDING_PAYMENT -> CONFIRMED
    const btnConfirm = page.getByTestId(`btn-trans-confirmed-${orderCode}`);
    await btnConfirm.click();
    await expect(page.getByTestId(`order-status-${orderCode}`)).toContainText('CONFIRMED');

    // 7. Execute Idempotent Payment
    const btnPay = page.getByTestId(`btn-pay-${orderCode}`);
    await btnPay.click();
    await expect(page.getByTestId('order-status-msg')).toContainText('Idempotent payment recorded');
  });

  test('E2E Scenario 2: Live Abnormal Scenarios & Exception Handling Verification', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-abnormal').click();

    // 1. Verify 401 Unauthorized
    await page.getByTestId('btn-test-401').click();
    await expect(page.getByTestId('abnormal-status-code')).toHaveText('401');
    await expect(page.getByTestId('abnormal-error-code')).toHaveText('error.security.unauthorized');

    // 2. Verify 403 Forbidden
    await page.getByTestId('btn-test-403').click();
    await expect(page.getByTestId('abnormal-status-code')).toHaveText('403');
    await expect(page.getByTestId('abnormal-error-code')).toHaveText('error.security.forbidden');

    // 3. Verify 404 Not Found
    await page.getByTestId('btn-test-404').click();
    await expect(page.getByTestId('abnormal-status-code')).toHaveText('404');
    await expect(page.getByTestId('abnormal-error-code')).toHaveText('error.resource.not.found');

    // 4. Verify 405 Method Not Allowed
    await page.getByTestId('btn-test-405').click();
    await expect(page.getByTestId('abnormal-status-code')).toHaveText('405');
    await expect(page.getByTestId('abnormal-error-code')).toHaveText('error.http.method.not.allowed');

    // 5. Verify 415 Unsupported Media Type
    await page.getByTestId('btn-test-415').click();
    await expect(page.getByTestId('abnormal-status-code')).toHaveText('415');
    await expect(page.getByTestId('abnormal-error-code')).toHaveText('error.http.media.type.unsupported');

    // 6. Verify 400 Malformed JSON
    await page.getByTestId('btn-test-400-json').click();
    await expect(page.getByTestId('abnormal-status-code')).toHaveText('400');
    await expect(page.getByTestId('abnormal-error-code')).toHaveText('error.http.json.malformed');
  });

});
