/**
 * Unit Tests for AnimationEngine
 */

const fs = require('fs');
const path = require('path');

// Carica i file necessari
const configCode = fs.readFileSync(path.join(__dirname, '../src/config.js'), 'utf8');
const animationEngineCode = fs.readFileSync(path.join(__dirname, '../src/animation-engine.js'), 'utf8');

eval(configCode);
eval(animationEngineCode);

describe('AnimationEngine', () => {
    let animationEngine;
    let mockConfig;
    let mockElement;

    beforeEach(() => {
        mockConfig = {
            ux: {
                enableTypingAnimation: true,
                enableAutoScroll: true,
                animateMessages: true,
                enableHaptic: true,
            },
            accessibility: {
                reducedMotion: false,
            },
            timing: {
                typingSpeed: 10, // Veloce per test
                typingSpeedVariation: 5,
                punctuationPause: 50,
                messageTransitionDelay: 100,
            },
        };
        
        animationEngine = new AnimationEngine(mockConfig);
        
        // Mock DOM element
        mockElement = {
            innerHTML: '',
            style: {},
            offsetHeight: 100,
            classList: {
                add: jest.fn(),
                remove: jest.fn(),
            },
            querySelector: jest.fn(),
            animate: jest.fn(() => ({
                onfinish: null,
            })),
        };
        
        // Mock document methods
        document.createElement = jest.fn(() => mockElement);
    });

    afterEach(() => {
        animationEngine.cancelAllAnimations();
    });

    describe('Constructor', () => {
        test('should initialize with config', () => {
            expect(animationEngine.config).toBe(mockConfig);
            expect(animationEngine.activeAnimations).toBeInstanceOf(Map);
        });
    });

    describe('typeText', () => {
        test('should show text immediately if animations disabled', () => {
            mockConfig.ux.enableTypingAnimation = false;
            const callback = jest.fn();
            
            animationEngine.typeText(mockElement, 'Test text', callback);
            
            expect(mockElement.innerHTML).toBe('Test text');
            expect(callback).toHaveBeenCalled();
        });

        test('should show text immediately if reduced motion', () => {
            mockConfig.accessibility.reducedMotion = true;
            const callback = jest.fn();
            
            animationEngine.typeText(mockElement, 'Test text', callback);
            
            expect(mockElement.innerHTML).toBe('Test text');
            expect(callback).toHaveBeenCalled();
        });

        test('should return animation ID', () => {
            const id = animationEngine.typeText(mockElement, 'Test');
            expect(typeof id).toBe('number');
        });

        test('should handle HTML content', () => {
            const html = '<b>Bold</b> text';
            const callback = jest.fn();
            
            animationEngine.typeText(mockElement, html, callback);
            
            // Aspetta che l'animazione inizi
            expect(animationEngine.activeAnimations.size).toBeGreaterThan(0);
        });
    });

    describe('cancelAnimation', () => {
        test('should cancel active animation', () => {
            const id = animationEngine.typeText(mockElement, 'Test text');
            
            animationEngine.cancelAnimation(id);
            
            expect(animationEngine.activeAnimations.has(id)).toBe(false);
        });
    });

    describe('cancelAllAnimations', () => {
        test('should cancel all active animations', () => {
            animationEngine.typeText(mockElement, 'Test 1');
            animationEngine.typeText(mockElement, 'Test 2');
            
            expect(animationEngine.activeAnimations.size).toBeGreaterThan(0);
            
            animationEngine.cancelAllAnimations();
            
            expect(animationEngine.activeAnimations.size).toBe(0);
        });
    });

    describe('skipAnimation', () => {
        test('should complete animation instantly', () => {
            const id = animationEngine.typeText(mockElement, 'Test text');
            
            animationEngine.skipAnimation(id, mockElement, 'Final text');
            
            expect(mockElement.innerHTML).toBe('Final text');
            expect(animationEngine.activeAnimations.has(id)).toBe(false);
        });
    });

    describe('fadeIn', () => {
        test('should set opacity transition', () => {
            animationEngine.fadeIn(mockElement);
            
            expect(mockElement.style.opacity).toBe('1');
            expect(mockElement.style.transition).toContain('opacity');
        });

        test('should skip animation if reduced motion', () => {
            mockConfig.accessibility.reducedMotion = true;
            
            animationEngine.fadeIn(mockElement);
            
            expect(mockElement.style.opacity).toBe('1');
            expect(mockElement.style.transition).toBeUndefined();
        });
    });

    describe('fadeOut', () => {
        test('should set opacity to 0', () => {
            const callback = jest.fn();
            
            animationEngine.fadeOut(mockElement, callback);
            
            expect(mockElement.style.opacity).toBe('0');
        });

        test('should call callback after duration', (done) => {
            const callback = jest.fn();
            
            animationEngine.fadeOut(mockElement, callback, 10);
            
            setTimeout(() => {
                expect(callback).toHaveBeenCalled();
                done();
            }, 20);
        });
    });

    describe('shake', () => {
        test('should add shake class', () => {
            animationEngine.shake(mockElement);
            
            expect(mockElement.classList.add).toHaveBeenCalledWith('shake-animation');
        });

        test('should skip if reduced motion', () => {
            mockConfig.accessibility.reducedMotion = true;
            
            animationEngine.shake(mockElement);
            
            expect(mockElement.classList.add).not.toHaveBeenCalled();
        });
    });

    describe('pulse', () => {
        test('should add pulse class', () => {
            animationEngine.pulse(mockElement);
            
            expect(mockElement.classList.add).toHaveBeenCalledWith('pulse-animation');
        });
    });

    describe('hapticFeedback', () => {
        test('should call navigator.vibrate', () => {
            animationEngine.hapticFeedback('medium');
            
            expect(navigator.vibrate).toHaveBeenCalledWith(20);
        });

        test('should not vibrate if haptic disabled', () => {
            mockConfig.ux.enableHaptic = false;
            
            animationEngine.hapticFeedback();
            
            expect(navigator.vibrate).not.toHaveBeenCalled();
        });
    });

    describe('_parseHTML', () => {
        test('should parse plain text', () => {
            const result = animationEngine._parseHTML('Plain text');
            
            expect(result.textParts).toHaveLength(1);
            expect(result.textParts[0].type).toBe('text');
            expect(result.textParts[0].content).toBe('Plain text');
        });

        test('should parse HTML with tags', () => {
            const result = animationEngine._parseHTML('Text with <b>bold</b> word');
            
            expect(result.textParts.length).toBeGreaterThan(1);
            expect(result.textParts.some(p => p.type === 'tag')).toBe(true);
        });

        test('should preserve tag structure', () => {
            const html = '<div><span>Nested</span></div>';
            const result = animationEngine._parseHTML(html);
            
            expect(result.structure.length).toBeGreaterThan(0);
        });
    });
});

