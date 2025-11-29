/**
 * Animation Engine
 * Gestisce animazioni typing, transizioni e effetti visivi
 */

class AnimationEngine {
    constructor(config) {
        this.config = config;
        this.activeAnimations = new Map();
        this.animationId = 0;
    }

    /**
     * Anima typing carattere per carattere
     * @param {HTMLElement} element - Elemento DOM dove animare il testo
     * @param {string} htmlContent - Contenuto HTML da animare
     * @param {Function} onComplete - Callback al completamento
     * @param {Function} onProgress - Callback durante l'animazione (opzionale)
     * @returns {number} - ID dell'animazione (per poterla cancellare)
     */
    typeText(element, htmlContent, onComplete, onProgress) {
        const id = ++this.animationId;
        
        // Se animazioni disabilitate, mostra subito tutto
        if (!this.config.ux.enableTypingAnimation || this.config.accessibility.reducedMotion) {
            element.innerHTML = htmlContent;
            if (onComplete) onComplete();
            return id;
        }

        // Estrai testo e tag HTML preservando la struttura
        const { textParts, structure } = this._parseHTML(htmlContent);
        
        let currentPartIndex = 0;
        let currentCharIndex = 0;
        let html = '';
        
        const animate = () => {
            if (currentPartIndex >= textParts.length) {
                // Animazione completata - rimuovi cursor e chiama callback
                element.innerHTML = html;
                this.activeAnimations.delete(id);
                if (onComplete) {
                    setTimeout(() => onComplete(), 10); // Piccolo delay per assicurare DOM update
                }
                return;
            }

            const part = textParts[currentPartIndex];
            
            if (part.type === 'tag') {
                // Aggiungi tag HTML immediatamente
                html += part.content;
                currentPartIndex++;
                currentCharIndex = 0;
                // IMPORTANTE: Continua immediatamente con la prossima parte
                animate();
            } else if (part.type === 'text') {
                // Anima carattere per carattere
                if (currentCharIndex < part.content.length) {
                    const char = part.content[currentCharIndex];
                    html += char;
                    currentCharIndex++;
                    
                    // Calcola delay per prossimo carattere
                    let delay = this.config.timing.typingSpeed;
                    
                    // Aggiungi variazione casuale per sembrare più umano
                    delay += Math.random() * this.config.timing.typingSpeedVariation - 
                             this.config.timing.typingSpeedVariation / 2;
                    
                    // Pausa extra su punteggiatura
                    if (['.', '!', '?', ',', ';', ':'].includes(char)) {
                        delay += this.config.timing.punctuationPause;
                    }
                    
                    // Aggiorna DOM
                    element.innerHTML = html + '<span class="typing-cursor">|</span>';
                    
                    // Notifica progresso
                    if (onProgress) {
                        const totalChars = textParts.reduce((sum, p) => 
                            sum + (p.type === 'text' ? p.content.length : 0), 0);
                        const typedChars = textParts.slice(0, currentPartIndex).reduce((sum, p) => 
                            sum + (p.type === 'text' ? p.content.length : 0), 0) + currentCharIndex;
                        onProgress(typedChars / totalChars);
                    }
                    
                    this.activeAnimations.set(id, setTimeout(animate, delay));
                } else {
                    // Parte completata, vai alla prossima
                    currentPartIndex++;
                    currentCharIndex = 0;
                    // IMPORTANTE: Continua immediatamente con la prossima parte
                    animate();
                }
            }
        };

        // Avvia animazione
        animate();
        return id;
    }

    /**
     * Cancella un'animazione in corso
     * @param {number} id - ID dell'animazione
     */
    cancelAnimation(id) {
        if (this.activeAnimations.has(id)) {
            clearTimeout(this.activeAnimations.get(id));
            this.activeAnimations.delete(id);
        }
    }

    /**
     * Cancella tutte le animazioni attive
     */
    cancelAllAnimations() {
        this.activeAnimations.forEach(timeout => clearTimeout(timeout));
        this.activeAnimations.clear();
    }

    /**
     * Completa istantaneamente un'animazione
     * @param {number} id - ID dell'animazione
     * @param {HTMLElement} element - Elemento DOM
     * @param {string} finalContent - Contenuto finale
     * @param {Function} onComplete - Callback da chiamare
     */
    skipAnimation(id, element, finalContent, onComplete) {
        this.cancelAnimation(id);
        element.innerHTML = finalContent;
        
        // Rimuovi cursor se presente
        const cursor = element.querySelector('.typing-cursor');
        if (cursor) cursor.remove();
        
        // Chiama callback
        if (onComplete) {
            setTimeout(() => onComplete(), 10);
        }
    }

    /**
     * Anima fade-in di un elemento
     * @param {HTMLElement} element - Elemento da animare
     * @param {number} duration - Durata in ms (opzionale)
     */
    fadeIn(element, duration) {
        if (this.config.accessibility.reducedMotion) {
            element.style.opacity = '1';
            return;
        }

        const ms = duration || this.config.timing.messageTransitionDelay;
        element.style.opacity = '0';
        element.style.transition = `opacity ${ms}ms ease-in`;
        
        // Force reflow
        element.offsetHeight;
        
        element.style.opacity = '1';
    }

    /**
     * Anima fade-out di un elemento
     * @param {HTMLElement} element - Elemento da animare
     * @param {Function} onComplete - Callback al completamento
     * @param {number} duration - Durata in ms (opzionale)
     */
    fadeOut(element, onComplete, duration) {
        if (this.config.accessibility.reducedMotion) {
            element.style.opacity = '0';
            if (onComplete) onComplete();
            return;
        }

        const ms = duration || this.config.timing.messageTransitionDelay;
        element.style.transition = `opacity ${ms}ms ease-out`;
        element.style.opacity = '0';
        
        if (onComplete) {
            setTimeout(onComplete, ms);
        }
    }

    /**
     * Anima shake (per errori)
     * @param {HTMLElement} element - Elemento da animare
     */
    shake(element) {
        if (this.config.accessibility.reducedMotion) return;

        element.classList.add('shake-animation');
        setTimeout(() => {
            element.classList.remove('shake-animation');
        }, 500);
    }

    /**
     * Anima pulse (per attirare attenzione)
     * @param {HTMLElement} element - Elemento da animare
     */
    pulse(element) {
        if (this.config.accessibility.reducedMotion) return;

        element.classList.add('pulse-animation');
        setTimeout(() => {
            element.classList.remove('pulse-animation');
        }, 1000);
    }

    /**
     * Scroll smooth verso un elemento
     * @param {HTMLElement} element - Elemento target
     * @param {HTMLElement} container - Container da scrollare
     */
    scrollTo(element, container) {
        if (!this.config.ux.enableAutoScroll) return;

        const behavior = this.config.accessibility.reducedMotion ? 'auto' : 'smooth';
        
        if (container) {
            container.scrollTo({
                top: element.offsetTop,
                behavior: behavior
            });
        } else {
            element.scrollIntoView({
                behavior: behavior,
                block: 'end'
            });
        }
    }

    /**
     * Scroll al bottom di un container
     * @param {HTMLElement} container - Container da scrollare
     */
    scrollToBottom(container) {
        if (!this.config.ux.enableAutoScroll) return;

        const behavior = this.config.accessibility.reducedMotion ? 'auto' : 'smooth';
        
        container.scrollTo({
            top: container.scrollHeight,
            behavior: behavior
        });
    }

    /**
     * Parse HTML preservando struttura tag
     * @private
     * @param {string} html - HTML da parsare
     * @returns {Object} - { textParts: Array, structure: Array }
     */
    _parseHTML(html) {
        const textParts = [];
        const structure = [];
        const tagRegex = /<[^>]+>/g;
        let lastIndex = 0;
        let match;

        while ((match = tagRegex.exec(html)) !== null) {
            // Testo prima del tag
            if (match.index > lastIndex) {
                const text = html.substring(lastIndex, match.index);
                textParts.push({ type: 'text', content: text });
            }
            
            // Tag HTML
            textParts.push({ type: 'tag', content: match[0] });
            structure.push(match[0]);
            
            lastIndex = tagRegex.lastIndex;
        }

        // Testo rimanente dopo l'ultimo tag
        if (lastIndex < html.length) {
            const text = html.substring(lastIndex);
            textParts.push({ type: 'text', content: text });
        }

        return { textParts, structure };
    }

    /**
     * Genera suono Sirena Allarme usando Web Audio API
     */
    playSirenSound() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const now = ctx.currentTime;
        
        // Oscillatore principale
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth'; // Suono aspro e allarmante
        
        // Gain (Volume)
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.1, now); // Volume iniziale
        gain.gain.linearRampToValueAtTime(0.1, now + 2.5); // Mantieni volume
        gain.gain.linearRampToValueAtTime(0, now + 3.0); // Fade out finale
        
        // Collegamenti
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        // Automazione Frequenza (Effetto Sirena: Weee-ooo-Weee-ooo)
        osc.frequency.setValueAtTime(600, now);
        
        // Ciclo 1
        osc.frequency.linearRampToValueAtTime(1200, now + 0.5);
        osc.frequency.linearRampToValueAtTime(600, now + 1.0);
        
        // Ciclo 2
        osc.frequency.linearRampToValueAtTime(1200, now + 1.5);
        osc.frequency.linearRampToValueAtTime(600, now + 2.0);
        
        // Ciclo 3
        osc.frequency.linearRampToValueAtTime(1200, now + 2.5);
        osc.frequency.linearRampToValueAtTime(600, now + 3.0);
        // Start/Stop
        osc.start(now);
        osc.stop(now + 8.0);
    }

    /**
     * Attiva haptic feedback (vibrazione) su dispositivi mobile
     * @param {string} type - Tipo di feedback: 'light' | 'medium' | 'heavy'
     */
    hapticFeedback(type = 'light') {
        if (!this.config.ux.enableHaptic) return;
        
        // Vibration API
        if ('vibrate' in navigator) {
            const patterns = {
                light: 10,
                medium: 20,
                heavy: 50
            };
            navigator.vibrate(patterns[type] || 10);
        }
    }

    /**
     * Genera suono Applausi usando Web Audio API
     */
    playApplauseSound() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const duration = 25.0; // Aumentato a 25 secondi
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Pink Noise generation (approssimazione)
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            data[i] *= 0.11; // Normalize
            b6 = white * 0.115926;
        }

        // Creazione multipla di clap bursts per simulare folla
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        // Filtro per togliere alte frequenze troppo aspre
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        
        const gain = ctx.createGain();
        // Fade in/out esteso
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.5);
        // Mantieni volume alto più a lungo
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + duration - 5.0); 
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        noise.start();
    }

    /**
     * Trigger confetti animation (per celebrazioni)
     * @param {HTMLElement} container - Container dove mostrare confetti
     */
    confetti(container) {
        if (this.config.accessibility.reducedMotion) return;
        
        // Funzione interna per lanciare una ondata
        const launchWave = () => {
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
            const confettiCount = 50;
            
            for (let i = 0; i < confettiCount; i++) {
                const confetto = document.createElement('div');
                confetto.className = 'confetto';
                confetto.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    opacity: 1;
                    pointer-events: none;
                    z-index: 9999;
                `;
                
                container.appendChild(confetto);
                
                // Anima caduta
                const animation = confetto.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                    { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
                ], {
                    duration: 2000 + Math.random() * 1000,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });
                
                animation.onfinish = () => confetto.remove();
            }
        };

        // Lancia 5 ondate consecutive
        launchWave(); // Subito
        setTimeout(launchWave, 1000);
        setTimeout(launchWave, 2000);
        setTimeout(launchWave, 3000);
        setTimeout(launchWave, 4000);
    }
}

// Esporta classe globalmente per il browser
// (per Node.js/testing usa module.exports)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = AnimationEngine;
} else {
    window.AnimationEngine = AnimationEngine;
}

