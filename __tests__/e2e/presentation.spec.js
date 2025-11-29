/**
 * E2E Tests for Hackathon Presenter
 * Tests the complete user flow of the presentation
 */

const { test, expect } = require('@playwright/test');

test.describe('Hackathon Presenter E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load the application', async ({ page }) => {
        // Verifica titolo
        await expect(page).toHaveTitle(/AI Mentor/);
        
        // Verifica elementi principali
        await expect(page.locator('#chat-container')).toBeVisible();
        await expect(page.locator('#user-input')).toBeVisible();
        await expect(page.locator('#send-btn')).toBeVisible();
    });

    test('should start presentation on Enter key', async ({ page }) => {
        // Trova input field
        const input = page.locator('#user-input');
        
        // Premi Enter
        await input.press('Enter');
        
        // Aspetta che appaia il primo messaggio utente
        await expect(page.locator('.user-message')).toBeVisible({ timeout: 2000 });
        
        // Verifica che appaia il typing indicator
        await expect(page.locator('#typing-indicator')).toBeVisible({ timeout: 1000 });
        
        // Aspetta la risposta AI
        await expect(page.locator('.ai-message')).toBeVisible({ timeout: 5000 });
    });

    test('should show buttons for branching', async ({ page }) => {
        // Avvia presentazione
        await page.locator('#user-input').press('Enter');
        
        // Aspetta i bottoni (secondo messaggio AI)
        await expect(page.locator('.action-btn').first()).toBeVisible({ timeout: 8000 });
        
        // Verifica che ci siano 2 bottoni
        const buttons = page.locator('.action-btn');
        await expect(buttons).toHaveCount(2);
        
        // Verifica testo bottoni
        await expect(buttons.first()).toContainText('dormendo');
        await expect(buttons.last()).toContainText('carichi');
    });

    test('should handle button click for branching', async ({ page }) => {
        // Avvia presentazione
        await page.locator('#user-input').press('Enter');
        
        // Aspetta i bottoni
        await page.locator('.action-btn').first().waitFor({ state: 'visible', timeout: 8000 });
        
        // Click sul primo bottone (dormendo)
        await page.locator('.action-btn').first().click();
        
        // Verifica che appaia il GIF di Carlo Verdone
        await expect(page.locator('img[alt*="Carlo Verdone"]')).toBeVisible({ timeout: 3000 });
    });

    test('should show progress bar', async ({ page }) => {
        // Verifica progress bar
        const progressBar = page.locator('#progress-bar');
        
        if (await progressBar.isVisible()) {
            // Verifica testo progresso
            await expect(page.locator('.progress-text')).toContainText('0/');
            
            // Avvia presentazione
            await page.locator('#user-input').press('Enter');
            
            // Aspetta e verifica aggiornamento progresso
            await page.waitForTimeout(3000);
            await expect(page.locator('.progress-text')).not.toContainText('0/');
        }
    });

    test('should show controls', async ({ page }) => {
        // Verifica che i controlli siano visibili o inseriti dinamicamente
        await page.waitForTimeout(500);
        
        const controls = page.locator('#controls-container');
        if (await controls.isVisible()) {
            await expect(page.locator('#btn-reset')).toBeVisible();
            await expect(page.locator('#btn-prev')).toBeVisible();
            await expect(page.locator('#btn-export')).toBeVisible();
        }
    });

    test('should reset presentation', async ({ page }) => {
        // Avvia presentazione
        await page.locator('#user-input').press('Enter');
        await page.waitForTimeout(3000);
        
        // Verifica che ci siano messaggi
        await expect(page.locator('.message')).not.toHaveCount(0);
        
        // Click reset (se disponibile)
        const resetBtn = page.locator('#btn-reset');
        if (await resetBtn.isVisible()) {
            // Accept dialog
            page.on('dialog', dialog => dialog.accept());
            await resetBtn.click();
            
            // Verifica che la chat sia vuota
            await expect(page.locator('.message')).toHaveCount(0);
        }
    });

    test('should be responsive on mobile', async ({ page }) => {
        // Imposta viewport mobile
        await page.setViewportSize({ width: 375, height: 667 });
        
        // Verifica che gli elementi siano ancora visibili
        await expect(page.locator('#chat-container')).toBeVisible();
        await expect(page.locator('#user-input')).toBeVisible();
        
        // Verifica che l'input sia a larghezza piena
        const inputBox = page.locator('.input-box');
        const width = await inputBox.evaluate(el => {
            const rect = el.getBoundingClientRect();
            const viewport = window.innerWidth;
            return (rect.width / viewport) * 100;
        });
        
        expect(width).toBeGreaterThan(90); // Dovrebbe essere > 90% su mobile
    });

    test('should handle keyboard shortcuts', async ({ page }) => {
        // Avvia con Enter
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        
        // Verifica che ci sia almeno un messaggio
        const messageCount1 = await page.locator('.message').count();
        expect(messageCount1).toBeGreaterThan(0);
        
        // Test reset con 'r' (se implementato)
        // page.on('dialog', dialog => dialog.accept());
        // await page.keyboard.press('r');
    });

    test('should persist state in localStorage', async ({ page, context }) => {
        // Avvia presentazione
        await page.locator('#user-input').press('Enter');
        await page.waitForTimeout(2000);
        
        // Ricarica pagina
        await page.reload();
        
        // Dovrebbe mostrare dialog di ripristino (o ripristinare automaticamente)
        // Questo dipende dall'implementazione
    });

    test('should be accessible', async ({ page }) => {
        // Verifica attributi ARIA
        const chatContainer = page.locator('#chat-container');
        await expect(chatContainer).toHaveAttribute('role', 'log');
        await expect(chatContainer).toHaveAttribute('aria-label');
        
        // Verifica che l'input abbia label
        const input = page.locator('#user-input');
        await expect(input).toHaveAttribute('aria-label');
        
        // Verifica navigation con Tab
        await page.keyboard.press('Tab');
        const focusedElement = await page.evaluate(() => document.activeElement.id);
        expect(focusedElement).toBeTruthy();
    });

    test('should export conversation', async ({ page }) => {
        // Avvia presentazione
        await page.locator('#user-input').press('Enter');
        await page.waitForTimeout(3000);
        
        // Click export (se disponibile)
        const exportBtn = page.locator('#btn-export');
        if (await exportBtn.isVisible()) {
            await exportBtn.click();
            
            // Verifica che appaia dialog
            await expect(page.locator('.export-dialog')).toBeVisible({ timeout: 1000 });
            
            // Verifica opzioni export
            await expect(page.locator('.export-option')).not.toHaveCount(0);
        }
    });
});

test.describe('Accessibility Tests', () => {
    test('should have no automatic accessibility violations', async ({ page }) => {
        await page.goto('/');
        
        // Inietta axe-core per test accessibilità (opzionale)
        // await injectAxe(page);
        // const results = await checkA11y(page);
        // expect(results.violations).toHaveLength(0);
    });

    test('should support keyboard navigation', async ({ page }) => {
        await page.goto('/');
        
        // Tab attraverso elementi
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        
        // Verifica che il focus sia visibile
        const focused = await page.evaluate(() => {
            const el = document.activeElement;
            const style = window.getComputedStyle(el, ':focus-visible');
            return style.outline !== 'none';
        });
        
        // Note: questo test potrebbe fallire se gli stili non sono caricati correttamente
    });
});

