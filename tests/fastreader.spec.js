const { test, expect } = require('@playwright/test');
const path = require('path');

const fileUrl = `file://${path.resolve(__dirname, '../index.html')}`;

test.describe('FastReader Basis-Tests', () => {
  
  test('Sollte die Anwendung korrekt laden', async ({ page }) => {
    await page.goto(fileUrl);
    await expect(page).toHaveTitle(/FastReader v0.8.0/);
    const textArea = page.locator('#inputText');
    await expect(textArea).toBeVisible();
  });

  test('Sollte den Lesevorgang starten', async ({ page }) => {
    await page.goto(fileUrl);
    // Klick auf Start
    await page.click('#playBtn');
    
    // Prüfen, ob die Leseanzeige erscheint
    const displayArea = page.locator('#displayArea');
    await expect(displayArea).not.toHaveClass(/hidden/);
    
    // Prüfen, ob ein Wort angezeigt wird
    const readerDisplay = page.locator('#readerDisplay');
    await expect(readerDisplay).not.toBeEmpty();
  });

  test('Sollte Text aus URL-Parameter laden', async ({ page }) => {
    const testText = "Hallo Welt";
    await page.goto(`${fileUrl}?text=${encodeURIComponent(testText)}`);
    
    const textArea = page.locator('#inputText');
    await expect(textArea).toHaveValue(testText);
  });
});
