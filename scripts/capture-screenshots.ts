import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\AKSHAT TIWARI\\.gemini\\antigravity\\brain\\e3d2fc5c-cb6e-4c7b-b2f2-17a0ef445c77';
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser for automated screenshot generation...');
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Context
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('Capturing Landing Page...');
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'landing.png'), fullPage: true });

  console.log('Capturing Demo - Clone Threat Outcome (POSSIBLE_AI)...');
  await page.goto('http://localhost:3000/demo');
  await page.waitForLoadState('networkidle');
  // Click scenario 2
  await page.getByText(/Scenario 2: Cloned Voice/i).first().click();
  // Wait for decision banner
  await page.waitForSelector('text=This may be an AI-cloned voice', { timeout: 15000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'demo-clone-danger.png'), fullPage: false });

  // Also trigger payment modal to capture the blocked transaction
  await page.getByRole('button', { name: /Try to send ₹50,000/i }).click();
  await page.waitForSelector('text=TRANSACTION BLOCKED BY VOICE SECURE', { timeout: 5000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'demo-payment-blocked.png'), fullPage: false });
  // Close payment modal
  await page.getByRole('button', { name: /Close & Keep Funds Safe/i }).click();

  console.log('Capturing Demo - Real Mom Outcome (LIKELY_REAL)...');
  // Click scenario 1
  await page.getByText(/Scenario 1: Real Call — Mom/i).first().click();
  await page.waitForSelector('text=Safe to talk', { timeout: 15000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'demo-real-safe.png'), fullPage: false });

  console.log('Capturing Demo - Unclear Call Outcome (UNCERTAIN)...');
  // Click scenario 3
  await page.getByText(/Scenario 3: Unclear Call/i).first().click();
  await page.waitForSelector('text=Verify before you trust', { timeout: 15000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'demo-unclear-amber.png'), fullPage: false });

  console.log('Capturing Family Consent Flow...');
  // Navigate inside phone tab to Family
  await page.getByRole('button', { name: /Family/i }).first().click();
  await page.getByRole('button', { name: /Enrol New Family Member/i }).click();
  // Fill step 1
  await page.getByPlaceholder(/e.g. Papa, Rohan, Priya/i).fill('Dada ji (Grandpa)');
  await page.getByPlaceholder(/\+91 98765 43210/i).fill('+91 99887 76655');
  await page.getByRole('button', { name: /Next \(Consent\)/i }).click();
  // Consent step is open
  await page.waitForSelector('text=Consent Notice for Biometric Voice Enrollment');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'family-consent.png'), fullPage: false });

  await context.close();

  // 2. Mobile Context (360px viewport)
  console.log('Capturing Mobile View (360px)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 360, height: 740 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/demo');
  await mobilePage.waitForLoadState('networkidle');
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-view.png'), fullPage: false });
  await mobileContext.close();

  await browser.close();
  console.log('All screenshots successfully saved to: ' + SCREENSHOT_DIR);
}

capture().catch((err) => {
  console.error('Screenshot capture error:', err);
  process.exit(1);
});
