/**
 * Jest Configuration
 * Unit testing configuration for the Hackathon AI Mentor project
 */

module.exports = {
    // Test environment
    testEnvironment: 'jsdom',
    
    // Test match patterns
    testMatch: [
        '**/__tests__/**/*.test.js',
        '**/?(*.)+(spec|test).js'
    ],
    
    // Coverage configuration
    collectCoverage: true,
    collectCoverageFrom: [
        '*.js',
        '!node_modules/**',
        '!coverage/**',
        '!dist/**',
        '!*.config.js',
        '!main.js' // Main è più per integrazione
    ],
    
    coverageDirectory: 'coverage',
    
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },
    
    // Setup files
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
    
    // Module paths
    moduleDirectories: ['node_modules', '<rootDir>'],
    
    // Transform (if needed for ES6+)
    transform: {},
    
    // Verbose output
    verbose: true,
    
    // Test timeout
    testTimeout: 10000
};

