import { test } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\AKSHAT TIWARI\\.gemini\\antigravity\\brain\\e3d2fc5c-cb6e-4c7b-b2f2-17a0ef445c77';
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

test.describe('Automated Screenshot Capture for Final Report', () => {
  test('captures Landing, Demo outcomes (Clone, Real, Unclear, Payment Lock), Family Consent, and Mobile', async ({ page }) => {
    test.setTimeout(90000);

    // 1. Landing Page (Desktop 1440x900)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'landing.png'), fullPage: false });

    // 2. Demo - Cloned Voice Threat Outcome (POSSIBLE_AI, Red State)
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.getByText(/Scenario 2: Cloned Voice/i).first().click();
    await page.waitForSelector('text=This may be an AI-cloned voice', { timeout: 15000 });
    // Wait for MA-3 chart line to draw
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'demo-clone-danger.png'), fullPage: false });

    // 3. Demo - Mock UPI Payment Locked Screen
    await page.getByRole('button', { name: /Try to send ₹50,000/i }).click();
    await page.waitForSelector('text=TRANSACTION BLOCKED BY VOICE SECURE', { timeout: 5000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'demo-payment-blocked.png'), fullPage: false });
    await page.getByRole('button', { name: /Close & Keep Funds Safe/i }).click();

    // 4. Demo - Real Call Mom Outcome (LIKELY_REAL, Green State)
    await page.getByText(/Scenario 1: Real Call — Mom/i).first().click();
    await page.waitForSelector('text=Safe to talk', { timeout: 15000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'demo-real-safe.png'), fullPage: false });

    // 5. Demo - Unclear Call Outcome (UNCERTAIN, Amber State & Safe Word)
    await page.getByText(/Scenario 3: Unclear Call/i).first().click();
    await page.waitForSelector('text=Verify before you trust', { timeout: 15000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'demo-unclear-amber.png'), fullPage: false });

    // 6. Family Consent & Voice Enrollment Wizard Step
    await page.getByRole('button', { name: /Family/i }).first().click();
    await page.getByRole('button', { name: /Enrol New Family Member/i }).click();
    await page.getByPlaceholder(/e.g. Papa, Rohan, Priya/i).fill('Dada ji (Grandpa)');
    await page.getByPlaceholder(/\+91 98765 43210/i).fill('+91 99887 76655');
    await page.getByRole('button', { name: /Next \(Consent\)/i }).click();
    await page.waitForSelector('text=Consent Notice for Biometric Voice Enrollment');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'family-consent.png'), fullPage: false });
    await page.keyboard.press('Escape');

    // 7. Mobile View (360px viewport)
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-view.png'), fullPage: false });
  });
});
