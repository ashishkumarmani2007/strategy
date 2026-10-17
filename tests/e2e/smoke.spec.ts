import { test, expect } from '@playwright/test';

test.describe('Voice Secure E2E Pitch Smoke Test', () => {
  test('navigates from landing, executes clone scenario, verifies red alert state, and asserts payment lock', async ({ page }) => {
    // 1. Open Landing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/Voice Secure/i);

    // Verify Honest Simulation Badge
    await expect(page.getByText(/Simulation Prototype/i).first()).toBeVisible();

    // 2. Click "Try the Pitch Demo"
    const ctaButton = page.getByRole('link', { name: /Try the Pitch Demo/i });
    await expect(ctaButton).toBeVisible();
    await ctaButton.click();

    // 3. Confirm navigation to /demo
    await expect(page).toHaveURL(/\/demo/);

    // 4. Run the Clone Scenario
    const cloneScenarioButton = page.getByText(/Scenario 2: Cloned Voice/i).first();
    await expect(cloneScenarioButton).toBeVisible();
    await cloneScenarioButton.click();

    // 5. Wait for the scripted windows to tick and decision to resolve to POSSIBLE_AI (red state)
    // Scripted windows tick every ~1.1s, deciding by window 5 (~5.5s)
    const dangerBanner = page.getByText(/This may be an AI-cloned voice/i);
    await expect(dangerBanner).toBeVisible({ timeout: 15000 });

    // 6. Assert Phone Action Buttons exist
    const hangUpButton = page.getByRole('button', { name: /Hang up and call Rohan back/i });
    const trySendButton = page.getByRole('button', { name: /Try to send ₹50,000/i });
    await expect(hangUpButton).toBeVisible();
    await expect(trySendButton).toBeVisible();

    // 7. Click "Try to send ₹50,000 (Mock UPI)"
    await trySendButton.click();

    // 8. Assert UPI modal opens and is visibly BLOCKED by Voice Secure payment lock
    const blockedHeading = page.getByText(/TRANSACTION BLOCKED BY VOICE SECURE/i);
    await expect(blockedHeading).toBeVisible();

    const countdownText = page.getByText(/Lock Countdown:/i);
    await expect(countdownText).toBeVisible();

    // 9. Close payment modal
    const closePaymentButton = page.getByRole('button', { name: /Close & Keep Funds Safe/i });
    await closePaymentButton.click();
    await expect(blockedHeading).not.toBeVisible();

    // 10. Click "Hang up and call Rohan back" to test scam avoided resolution
    await hangUpButton.click();
    const scamAvoidedText = page.getByText(/Scam Avoided/i).first();
    await expect(scamAvoidedText).toBeVisible();
    await expect(page.getByText(/I never called you! I am completely safe/i).first()).toBeVisible();
  });
});
