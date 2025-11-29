/**
 * Playwright E2E Testing Configuration
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './__tests__/e2e',
    
    // Timeout per test
    timeout: 30000,
    
    // Parallel execution
    fullyParallel: true,
    
    // Fail fast
    forbidOnly: !!process.env.CI,
    
    // Retries
    retries: process.env.CI ? 2 : 0,
    
    // Workers
    workers: process.env.CI ? 1 : undefined,
    
    // Reporter
    reporter: [
        ['html'],
        ['list']
    ],
    
    // Shared settings
    use: {
        // Base URL
        baseURL: 'http://localhost:8080',
        
        // Trace on first retry
        trace: 'on-first-retry',
        
        // Screenshot on failure
        screenshot: 'only-on-failure',
        
        // Video on failure
        video: 'retain-on-failure',
    },
    
    // Projects (browsers)
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        // Mobile
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],
    
    // Web server
    webServer: {
        command: 'python3 -m http.server 8080',
        port: 8080,
        timeout: 120000,
        reuseExistingServer: !process.env.CI,
    },
});

