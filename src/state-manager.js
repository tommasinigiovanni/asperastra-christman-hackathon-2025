/**
 * State Manager
 * Gestisce lo stato dell'applicazione, persistenza e history
 */

class StateManager {
    constructor(config) {
        this.config = config;
        this.currentStep = 0;
        this.history = [];
        this.bookmarks = [];
        this.startTime = null;
        this.pausedTime = 0;
        this.isPresenterMode = false;
        this.listeners = {};
        
        // Carica stato salvato se disponibile
        if (this.config.storage && this.config.ux.saveStateAuto) {
            this.loadState();
        }
    }

    /**
     * Imposta lo step corrente
     * @param {number} step - Indice dello step
     * @param {boolean} addToHistory - Se aggiungere alla history
     */
    setStep(step, addToHistory = true) {
        if (addToHistory && this.currentStep !== step) {
            this.history.push(this.currentStep);
        }
        this.currentStep = step;
        this.emit('stepChanged', step);
        
        if (this.config.ux.saveStateAuto) {
            this.saveState();
        }
    }

    /**
     * Ottiene lo step corrente
     * @returns {number}
     */
    getStep() {
        return this.currentStep;
    }

    /**
     * Va allo step precedente nella history
     * @returns {boolean} - true se è stato possibile tornare indietro
     */
    goBack() {
        if (this.history.length > 0) {
            const previousStep = this.history.pop();
            this.currentStep = previousStep;
            this.emit('stepChanged', this.currentStep);
            this.saveState();
            return true;
        }
        return false;
    }

    /**
     * Va allo step successivo
     * @param {number} totalSteps - Numero totale di step nello script
     * @returns {boolean} - true se è stato possibile andare avanti
     */
    goForward(totalSteps) {
        if (this.currentStep < totalSteps - 1) {
            this.setStep(this.currentStep + 1);
            return true;
        }
        return false;
    }

    /**
     * Resetta lo stato
     */
    reset() {
        this.currentStep = 0;
        this.history = [];
        this.startTime = null;
        this.pausedTime = 0;
        this.emit('reset');
        this.saveState();
    }

    /**
     * Inizia il timer
     */
    startTimer() {
        if (!this.startTime) {
            this.startTime = Date.now() - this.pausedTime;
            this.emit('timerStarted');
        }
    }

    /**
     * Ottiene il tempo trascorso in millisecondi
     * @returns {number}
     */
    getElapsedTime() {
        if (!this.startTime) return 0;
        return Date.now() - this.startTime;
    }

    /**
     * Ottiene il tempo rimanente stimato in millisecondi
     * @param {number} totalSteps - Numero totale di step
     * @returns {number}
     */
    getEstimatedTimeRemaining(totalSteps) {
        if (!this.config.presenterMode.estimatedDuration) return 0;
        
        const totalMs = this.config.presenterMode.estimatedDuration * 60 * 1000;
        const elapsed = this.getElapsedTime();
        const remaining = totalMs - elapsed;
        
        return Math.max(0, remaining);
    }

    /**
     * Aggiunge un bookmark
     * @param {number} step - Indice dello step
     * @param {string} label - Etichetta del bookmark
     */
    addBookmark(step, label) {
        const bookmark = { step, label, timestamp: Date.now() };
        this.bookmarks.push(bookmark);
        this.emit('bookmarkAdded', bookmark);
        this.saveState();
    }

    /**
     * Rimuove un bookmark
     * @param {number} index - Indice del bookmark da rimuovere
     */
    removeBookmark(index) {
        if (index >= 0 && index < this.bookmarks.length) {
            const removed = this.bookmarks.splice(index, 1)[0];
            this.emit('bookmarkRemoved', removed);
            this.saveState();
        }
    }

    /**
     * Va a un bookmark
     * @param {number} index - Indice del bookmark
     */
    goToBookmark(index) {
        if (index >= 0 && index < this.bookmarks.length) {
            this.setStep(this.bookmarks[index].step);
        }
    }

    /**
     * Toggle modalità presentatore
     */
    togglePresenterMode() {
        this.isPresenterMode = !this.isPresenterMode;
        this.emit('presenterModeChanged', this.isPresenterMode);
    }

    /**
     * Salva stato su localStorage
     */
    saveState() {
        if (!this.config.storage) return;
        
        try {
            const state = {
                version: this.config.storage.version,
                currentStep: this.currentStep,
                history: this.history,
                bookmarks: this.bookmarks,
                startTime: this.startTime,
                pausedTime: this.pausedTime,
                timestamp: Date.now()
            };
            
            localStorage.setItem(this.config.storage.key, JSON.stringify(state));
        } catch (e) {
            console.error('Errore salvataggio stato:', e);
        }
    }

    /**
     * Carica stato da localStorage
     */
    loadState() {
        if (!this.config.storage) return;
        
        try {
            const saved = localStorage.getItem(this.config.storage.key);
            if (!saved) return;
            
            const state = JSON.parse(saved);
            
            // Verifica versione
            if (state.version !== this.config.storage.version) {
                console.warn('Versione stato non compatibile, reset');
                this.clearState();
                return;
            }
            
            this.currentStep = state.currentStep || 0;
            this.history = state.history || [];
            this.bookmarks = state.bookmarks || [];
            this.startTime = state.startTime || null;
            this.pausedTime = state.pausedTime || 0;
            
            this.emit('stateLoaded', state);
        } catch (e) {
            console.error('Errore caricamento stato:', e);
            this.clearState();
        }
    }

    /**
     * Cancella stato salvato
     */
    clearState() {
        if (!this.config.storage) return;
        
        try {
            localStorage.removeItem(this.config.storage.key);
            this.reset();
        } catch (e) {
            console.error('Errore cancellazione stato:', e);
        }
    }

    /**
     * Esporta stato come JSON
     * @returns {string}
     */
    exportState() {
        return JSON.stringify({
            version: this.config.storage.version,
            currentStep: this.currentStep,
            history: this.history,
            bookmarks: this.bookmarks,
            exportDate: new Date().toISOString()
        }, null, 2);
    }

    /**
     * Importa stato da JSON
     * @param {string} jsonString - Stato serializzato
     */
    importState(jsonString) {
        try {
            const state = JSON.parse(jsonString);
            this.currentStep = state.currentStep || 0;
            this.history = state.history || [];
            this.bookmarks = state.bookmarks || [];
            this.emit('stateImported', state);
            this.saveState();
        } catch (e) {
            console.error('Errore importazione stato:', e);
            throw new Error('Stato non valido');
        }
    }

    /**
     * Registra un listener per eventi
     * @param {string} event - Nome evento
     * @param {Function} callback - Funzione callback
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    /**
     * Rimuove un listener
     * @param {string} event - Nome evento
     * @param {Function} callback - Funzione callback da rimuovere
     */
    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    /**
     * Emette un evento
     * @param {string} event - Nome evento
     * @param {*} data - Dati da passare ai listener
     */
    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
    }
}

// Esporta classe globalmente per il browser
// (per Node.js/testing usa module.exports)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = StateManager;
} else {
    window.StateManager = StateManager;
}

