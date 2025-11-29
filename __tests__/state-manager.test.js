/**
 * Unit Tests for StateManager
 */

// Carica il file da testare
const fs = require('fs');
const path = require('path');

// Carica i file necessari
const configCode = fs.readFileSync(path.join(__dirname, '../config.js'), 'utf8');
const stateManagerCode = fs.readFileSync(path.join(__dirname, '../state-manager.js'), 'utf8');

// Valuta il codice nel contesto globale
eval(configCode);
eval(stateManagerCode);

describe('StateManager', () => {
    let stateManager;
    let mockConfig;

    beforeEach(() => {
        mockConfig = {
            storage: {
                key: 'test-key',
                version: '1.0.0',
            },
            ux: {
                saveStateAuto: false, // Disabilitato per test
            },
            presenterMode: {
                estimatedDuration: 15,
            },
        };
        
        stateManager = new StateManager(mockConfig);
    });

    describe('Constructor', () => {
        test('should initialize with default values', () => {
            expect(stateManager.currentStep).toBe(0);
            expect(stateManager.history).toEqual([]);
            expect(stateManager.bookmarks).toEqual([]);
            expect(stateManager.isPresenterMode).toBe(false);
        });
    });

    describe('setStep', () => {
        test('should set current step', () => {
            stateManager.setStep(5);
            expect(stateManager.getStep()).toBe(5);
        });

        test('should add to history by default', () => {
            stateManager.setStep(1);
            stateManager.setStep(2);
            expect(stateManager.history).toEqual([0, 1]);
        });

        test('should not add to history when specified', () => {
            stateManager.setStep(1, false);
            stateManager.setStep(2, false);
            expect(stateManager.history).toEqual([]);
        });

        test('should emit stepChanged event', () => {
            const listener = jest.fn();
            stateManager.on('stepChanged', listener);
            stateManager.setStep(3);
            expect(listener).toHaveBeenCalledWith(3);
        });
    });

    describe('goBack', () => {
        test('should go back to previous step', () => {
            stateManager.setStep(1);
            stateManager.setStep(2);
            stateManager.setStep(3);
            
            const result = stateManager.goBack();
            expect(result).toBe(true);
            expect(stateManager.getStep()).toBe(2);
        });

        test('should return false if no history', () => {
            const result = stateManager.goBack();
            expect(result).toBe(false);
        });
    });

    describe('goForward', () => {
        test('should go forward if not at end', () => {
            stateManager.setStep(5);
            const result = stateManager.goForward(10);
            expect(result).toBe(true);
            expect(stateManager.getStep()).toBe(6);
        });

        test('should not go forward if at end', () => {
            stateManager.setStep(9);
            const result = stateManager.goForward(10);
            expect(result).toBe(false);
        });
    });

    describe('reset', () => {
        test('should reset state to initial', () => {
            stateManager.setStep(5);
            stateManager.startTimer();
            stateManager.reset();
            
            expect(stateManager.getStep()).toBe(0);
            expect(stateManager.history).toEqual([]);
            expect(stateManager.startTime).toBeNull();
        });

        test('should emit reset event', () => {
            const listener = jest.fn();
            stateManager.on('reset', listener);
            stateManager.reset();
            expect(listener).toHaveBeenCalled();
        });
    });

    describe('Timer', () => {
        test('should start timer', () => {
            stateManager.startTimer();
            expect(stateManager.startTime).not.toBeNull();
        });

        test('should get elapsed time', () => {
            stateManager.startTimer();
            const elapsed = stateManager.getElapsedTime();
            expect(elapsed).toBeGreaterThanOrEqual(0);
        });

        test('should return 0 if timer not started', () => {
            const elapsed = stateManager.getElapsedTime();
            expect(elapsed).toBe(0);
        });
    });

    describe('Bookmarks', () => {
        test('should add bookmark', () => {
            stateManager.addBookmark(5, 'Test Bookmark');
            expect(stateManager.bookmarks).toHaveLength(1);
            expect(stateManager.bookmarks[0].step).toBe(5);
            expect(stateManager.bookmarks[0].label).toBe('Test Bookmark');
        });

        test('should remove bookmark', () => {
            stateManager.addBookmark(5, 'Test');
            stateManager.removeBookmark(0);
            expect(stateManager.bookmarks).toHaveLength(0);
        });

        test('should go to bookmark', () => {
            stateManager.addBookmark(7, 'Test');
            stateManager.goToBookmark(0);
            expect(stateManager.getStep()).toBe(7);
        });
    });

    describe('Presenter Mode', () => {
        test('should toggle presenter mode', () => {
            expect(stateManager.isPresenterMode).toBe(false);
            stateManager.togglePresenterMode();
            expect(stateManager.isPresenterMode).toBe(true);
            stateManager.togglePresenterMode();
            expect(stateManager.isPresenterMode).toBe(false);
        });

        test('should emit presenterModeChanged event', () => {
            const listener = jest.fn();
            stateManager.on('presenterModeChanged', listener);
            stateManager.togglePresenterMode();
            expect(listener).toHaveBeenCalledWith(true);
        });
    });

    describe('State Persistence', () => {
        test('should export state as JSON', () => {
            stateManager.setStep(5);
            stateManager.addBookmark(3, 'Test');
            
            const exported = stateManager.exportState();
            const parsed = JSON.parse(exported);
            
            expect(parsed.currentStep).toBe(5);
            expect(parsed.bookmarks).toHaveLength(1);
        });

        test('should import state from JSON', () => {
            const state = JSON.stringify({
                version: '1.0.0',
                currentStep: 8,
                history: [0, 5, 7],
                bookmarks: [{ step: 3, label: 'Test' }],
            });
            
            stateManager.importState(state);
            
            expect(stateManager.getStep()).toBe(8);
            expect(stateManager.history).toEqual([0, 5, 7]);
            expect(stateManager.bookmarks).toHaveLength(1);
        });

        test('should throw on invalid JSON import', () => {
            expect(() => {
                stateManager.importState('invalid json');
            }).toThrow();
        });
    });

    describe('Event System', () => {
        test('should register and call listeners', () => {
            const listener = jest.fn();
            stateManager.on('testEvent', listener);
            stateManager.emit('testEvent', { data: 'test' });
            expect(listener).toHaveBeenCalledWith({ data: 'test' });
        });

        test('should remove listeners', () => {
            const listener = jest.fn();
            stateManager.on('testEvent', listener);
            stateManager.off('testEvent', listener);
            stateManager.emit('testEvent');
            expect(listener).not.toHaveBeenCalled();
        });
    });
});

