/**
 * Configurazione centralizzata dell'applicazione
 * Contiene tutte le impostazioni per timing, temi e comportamento UX
 */

const CONFIG = {
    // Timing e animazioni
    timing: {
        typingSpeed: 30,              // ms per carattere (typing animation)
        typingSpeedVariation: 20,     // variazione casuale per simulare umano
        punctuationPause: 300,        // pausa extra su punteggiatura
        aiThinkingDelay: 1500,        // delay "sta scrivendo..." dell'AI
        messageTransitionDelay: 200,  // delay tra messaggi
        scrollDuration: 400,          // durata animazione scroll
        buttonFadeInDelay: 300,       // delay fade-in bottoni
    },

    // Temi
    themes: {
        dark: {
            name: 'Dark (ChatGPT Style)',
            colors: {
                background: '#343541',
                userMessage: '#343541',
                aiMessage: '#444654',
                text: '#ececf1',
                textSecondary: '#8e8ea0',
                inputBg: '#40414f',
                border: '#2d2d3e',
                accent: '#10a37f',
                accentHover: '#1a7f64',
                userAvatar: '#5436da',
                aiAvatar: '#10a37f',
            }
        },
        light: {
            name: 'Light',
            colors: {
                background: '#ffffff',
                userMessage: '#f7f7f8',
                aiMessage: '#ffffff',
                text: '#2d2d2d',
                textSecondary: '#6e6e80',
                inputBg: '#f4f4f4',
                border: '#e5e5e5',
                accent: '#10a37f',
                accentHover: '#1a7f64',
                userAvatar: '#5436da',
                aiAvatar: '#10a37f',
            }
        }
    },

    // Impostazioni UX
    ux: {
        enableTypingAnimation: true,   // animazione typing carattere-per-carattere
        enableSounds: false,           // suoni (da implementare)
        enableHaptic: true,            // feedback tattile su mobile
        enableAutoScroll: true,        // scroll automatico
        enableSkipTyping: true,        // click per completare typing
        showProgressBar: true,         // mostra barra progresso
        enableKeyboardShortcuts: true, // shortcuts tastiera
        saveStateAuto: true,           // salvataggio automatico stato
        animateMessages: true,         // fade-in messaggi
    },

    // Accessibilità
    accessibility: {
        reducedMotion: false,          // rispetta prefers-reduced-motion
        highContrast: false,           // tema alto contrasto
        fontSize: 'medium',            // small | medium | large
        screenReaderAnnouncements: true, // annunci per screen reader
    },

    // Shortcuts tastiera
    shortcuts: {
        next: ['Enter', 'Space', 'ArrowRight'],
        prev: ['ArrowLeft'],
        reset: ['r', 'R'],
        togglePresenterMode: ['p', 'P'],
        export: ['e', 'E'],
        toggleTheme: ['t', 'T'],
    },

    // Persistenza
    storage: {
        key: 'hackathon-ai-mentor-state',
        version: '1.0.0',
        autoSaveInterval: 5000,        // ms tra salvataggi automatici
    },

    // Modalità presentatore
    presenterMode: {
        enabled: false,
        showNotes: true,
        showTimer: true,
        showNextPrompt: true,
        estimatedDuration: 15,         // minuti stimati presentazione
    }
};

// Rileva preferenze sistema
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    CONFIG.accessibility.reducedMotion = true;
    CONFIG.ux.enableTypingAnimation = false;
}

// Esporta configurazione globalmente per il browser
// (per Node.js/testing usa module.exports)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}

