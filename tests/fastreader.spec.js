const { test, expect } = require('@playwright/test');
const path = require('path');

// Pfad zur aktuellen Datei (Stelle sicher, dass der Dateiname im Repo übereinstimmt)
const fileUrl = `file://${path.resolve(__dirname, '../index.html')}`;

test.describe('FastReader Funktions-Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(fileUrl);
    });

    test('Sollte die Anwendung v0.8.2 korrekt laden', async ({ page }) => {
        await expect(page).toHaveTitle(/FastReader v0.8.2/);
        const textArea = page.locator('#inputText');
        await expect(textArea).toBeVisible();
    });

    test('Sollte den Lesevorgang starten und die RSVP-Engine aktivieren', async ({ page }) => {
        await page.click('#playBtn');
        const displayArea = page.locator('#displayArea');
        await expect(displayArea).toBeVisible();
        const readerDisplay = page.locator('#readerDisplay');
        await expect(readerDisplay).not.toBeEmpty();
    });

    test('Sollte Text aus URL-Parameter laden', async ({ page }) => {
        const testText = "Dies ist ein automatisierter URL Test";
        await page.goto(`${fileUrl}?text=${encodeURIComponent(testText)}`);
        const textArea = page.locator('#inputText');
        await expect(textArea).toHaveValue(testText);
    });

    test('Sollte das Tempo über Slider und Buttons ändern', async ({ page }) => {
        const wpmDisplay = page.locator('#wpmDisplay');
        const initialWPM = await wpmDisplay.innerText();

        // Plus-Button testen (+25)
        await page.click('button:has([data-lucide="plus"])');
        let updatedWPM = parseInt(initialWPM) + 25;
        await expect(wpmDisplay).toHaveText(updatedWPM.toString());

        // Minus-Button testen (-25)
        await page.click('button:has([data-lucide="minus"])');
        await expect(wpmDisplay).toHaveText(initialWPM);

        // Slider-Interaktion simulieren
        const speedRange = page.locator('#speedRange');
        await speedRange.fill('500');
        await expect(wpmDisplay).toHaveText('500');
    });

    test('Sollte die Farbe der Hervorhebung ändern', async ({ page }) => {
        const colorPicker = page.locator('#colorPicker');
        const colorHex = page.locator('#colorHex');
        
        const newColor = '#ff0000'; // Rot
        await colorPicker.fill(newColor);
        
        // Prüfen ob die Hex-Anzeige aktualisiert wurde
        await expect(colorHex).toHaveText(newColor.toUpperCase());
    });

    test('Sollte den Text über das X-Icon löschen und Clipboard-Hinweis zeigen', async ({ page }) => {
        const textArea = page.locator('#inputText');
        const clearBtn = page.locator('#clearTextBtn');
        const pasteHint = page.locator('#pasteHint');

        // Text löschen
        await clearBtn.click();
        await expect(textArea).toHaveValue('');

        // Prüfen ob der Clipboard-Hinweis nach dem Löschen erscheint
        await expect(pasteHint).toBeVisible();
    });

    test('Sollte die Reset-Funktion der Einstellungen testen', async ({ page }) => {
        const wpmDisplay = page.locator('#wpmDisplay');
        
        // Tempo verstellen
        await page.click('button:has([data-lucide="plus"])');
        await expect(wpmDisplay).not.toHaveText('350');

        // Auf Standard zurücksetzen
        await page.click('text=Standard-Werte');
        await expect(wpmDisplay).toHaveText('350');
    });
});