/**
 * Main Application Controller
 * Coordina tutti i moduli e gestisce il flusso dell'applicazione
 */

class HackathonPresenter {
    constructor() {
        // Inizializza moduli
        this.config = CONFIG;
        this.script = SCRIPT;
        this.state = new StateManager(this.config);
        this.animation = new AnimationEngine(this.config);
        this.chat = new ChatManager(this.config, this.animation, this.state);
        
        // DOM references
        this.chatContainer = null;
        this.inputField = null;
        this.sendButton = null;
        this.progressBar = null;
        this.controlsContainer = null;
        
        // Flags
        this.isPlaying = false;
        this.isInitialized = false;
        this.hasStarted = false; // Nuovo flag per lo splash screen
    }

    /**
     * Inizializza l'applicazione
     */
    init() {
        if (this.isInitialized) {
            console.warn('App già inizializzata!');
            return;
        }
        
        // Get DOM elements
        this.chatContainer = document.getElementById('chat-container');
        this.inputField = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-btn');
        this.micButton = document.getElementById('mic-btn');
        this.voiceWaveform = document.getElementById('voice-waveform');
        this.isRecording = false;
        
        if (!this.chatContainer || !this.inputField) {
            console.error('Elementi DOM richiesti non trovati');
            return;
        }
        
        // Inizializza chat manager
        this.chat.init(this.chatContainer);
        
        // Setup UI
        this.setupControls();
        this.setupProgressBar();
        this.setupKeyboardShortcuts();
        this.setupEventListeners();
        
        // Start Christmas Snow IMMEDIATELY ❄️
        this.animation.letItSnow();
        
        // Ripristina stato salvato se presente (ma non inizia ancora)
        if (this.state.getStep() > 0) {
            // Se c'è uno stato precedente, forse vogliamo saltare lo splash?
            // Per ora manteniamo il flusso: Splash -> Mic -> Ripristino/Inizio
        }

        this.isInitialized = true;
        console.log('Hackathon Presenter ready - Script:', this.script.length, 'scenes');
    }

    /**
     * Setup controlli navigazione
     */
    setupControls() {
        // Crea container controlli se non esiste
        let controls = document.getElementById('controls-container');
        if (!controls) {
            controls = document.createElement('div');
            controls.id = 'controls-container';
            controls.className = 'controls-container';
            // Stealth Mode Default: Start hidden
            controls.style.opacity = '0';
            controls.style.pointerEvents = 'none';
            controls.innerHTML = `
                <button id="btn-prev" class="control-btn" title="Indietro (←)" aria-label="Vai al messaggio precedente">
                    ◄
                </button>
                <button id="btn-reset" class="control-btn" title="Reset (R)" aria-label="Resetta presentazione">
                    ↻
                </button>
                <button id="btn-presenter" class="control-btn" title="Modalità Presentatore (P)" aria-label="Attiva modalità presentatore">
                    📊
                </button>
                <button id="btn-export" class="control-btn" title="Esporta (E)" aria-label="Esporta conversazione">
                    💾
                </button>
                <div id="timer-display" class="timer-display" style="display:none;"></div>
            `;
            
            // Inserisci prima dell'input area
            const inputArea = document.querySelector('.input-area');
            if (inputArea) {
                inputArea.parentNode.insertBefore(controls, inputArea);
            } else {
                document.body.appendChild(controls);
            }
        }
        
        this.controlsContainer = controls;
        
        // Event listeners bottoni
        document.getElementById('btn-prev')?.addEventListener('click', () => this.goBack());
        document.getElementById('btn-reset')?.addEventListener('click', () => this.reset());
        document.getElementById('btn-presenter')?.addEventListener('click', () => this.togglePresenterMode());
        document.getElementById('btn-export')?.addEventListener('click', () => this.showExportDialog());
    }

    /**
     * Setup progress bar
     */
    setupProgressBar() {
        if (!this.config.ux.showProgressBar) return;
        
        let progressBar = document.getElementById('progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'progress-bar';
            progressBar.className = 'progress-bar';
            // Stealth Mode Default: Start hidden
            progressBar.style.opacity = '0';
            progressBar.innerHTML = `
                <div class="progress-fill"></div>
                <div class="progress-text">0/${this.script.length}</div>
            `;
            
            // Inserisci in cima alla pagina
            document.body.insertBefore(progressBar, document.body.firstChild);
        }
        
        this.progressBar = progressBar;
        this.updateProgress();
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        if (!this.config.ux.enableKeyboardShortcuts) return;
        
        document.addEventListener('keydown', (e) => {
            // Ignora se si sta digitando in un input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            const key = e.key;
            
            // Next
            if (this.config.shortcuts.next.includes(key)) {
                e.preventDefault();
                this.playScene();
            }
            
            // Previous
            if (this.config.shortcuts.prev.includes(key)) {
                e.preventDefault();
                this.goBack();
            }
            
            // Reset
            if (this.config.shortcuts.reset.includes(key)) {
                e.preventDefault();
                this.reset();
            }
            
            // Toggle Presenter Mode
            if (this.config.shortcuts.togglePresenterMode.includes(key)) {
                e.preventDefault();
                this.togglePresenterMode();
            }
            
            // Export
            if (this.config.shortcuts.export.includes(key)) {
                e.preventDefault();
                this.showExportDialog();
            }
            
            // Toggle UI (Hide controls)
            if (key === 'h' || key === 'H') {
                e.preventDefault();
                this.toggleUI();
            }

            // Numeric shortcuts for buttons (1, 2, 3...)
            if (key >= '1' && key <= '9') {
                const index = parseInt(key) - 1;
                const buttons = document.querySelectorAll('.action-btn');
                if (buttons && buttons[index]) {
                    e.preventDefault();
                    buttons[index].click();
                }
            }
            
            // Toggle Theme
            if (this.config.shortcuts.toggleTheme.includes(key)) {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    /**
     * Toggle visibility of UI controls
     */
    toggleUI() {
        const controls = document.getElementById('controls-container');
        const progressBar = document.getElementById('progress-bar');
        
        if (controls) {
            const isHidden = controls.style.opacity === '0';
            controls.style.opacity = isHidden ? '1' : '0';
            controls.style.pointerEvents = isHidden ? 'all' : 'none';
        }
        
        if (progressBar) {
            const isHidden = progressBar.style.opacity === '0';
            progressBar.style.opacity = isHidden ? '1' : '0';
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Enter su input field
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.playScene();
            }
        });
        
        // Click su send button
        this.sendButton?.addEventListener('click', () => {
            this.playScene();
        });
        
        // Click su mic button
        this.micButton?.addEventListener('click', () => {
            this.toggleVoiceInput();
        });
        
        // State change listener
        this.state.on('stepChanged', (step) => {
            this.updateProgress();
        });
        
        // Presenter mode listener
        this.state.on('presenterModeChanged', (isActive) => {
            this.updatePresenterUI(isActive);
        });
    }

    /**
     * Toggle Voice Input Mode
     */
    toggleVoiceInput() {
        this.isRecording = !this.isRecording;
        
        if (this.isRecording) {
            // START RECORDING
            this.micButton.classList.add('recording');
            this.micButton.innerHTML = '⏹'; // Stop icon
            this.voiceWaveform.style.display = 'flex';
            this.inputField.style.opacity = '0'; // Nascondi testo ma mantieni layout
            this.animation.hapticFeedback('medium');
            
            // Opzionale: mostra placeholder testo che si sta "dettando"
            const nextStep = this.script[this.state.getStep()];
            if (nextStep && nextStep.role === 'user') {
                 // Simulazione dettatura? Per ora solo onda.
            }
        } else {
            // STOP RECORDING & SEND
            this.micButton.classList.remove('recording');
            this.micButton.innerHTML = '🎤';
            this.voiceWaveform.style.display = 'none';
            this.inputField.style.opacity = '1';
            this.animation.hapticFeedback('light');
            
            // Invia automaticamente
            this.playScene();
        }
    }

    /**
     * Play scena corrente
     */
    playScene() {
        if (this.isPlaying) {
            return;
        }
        
        // --- GESTIONE SPLASH SCREEN ---
        // Se è la prima volta che avviamo una scena e lo splash screen è visibile, nascondilo
        if (!this.hasStarted) {
            const splashScreen = document.getElementById('splash-screen');
            if (splashScreen) {
                splashScreen.style.opacity = '0';
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 800); // Aspetta la transizione CSS
            }
            this.hasStarted = true;

            // Controllo ripristino stato SOLO ORA
             if (this.state.getStep() > 0) {
                this.showRestoreDialog();
                return; // Aspetta risposta dialog
            }
        }

        const step = this.state.getStep();
        
        if (step >= this.script.length) {
            this.onPresentationComplete();
            return;
        }
        
        const scene = this.script[step];
        
        // Avvia timer al primo step
        if (step === 0) {
            this.state.startTimer();
            this.startTimerDisplay();
        }
        
        this.isPlaying = true;
        
        if (scene.role === 'user') {
            this.playUserMessage(scene);
        } else if (scene.role === 'ai') {
            this.playAIMessage(scene);
        }
    }

    /**
     * Play messaggio utente
     * @param {Object} scene - Scena da eseguire
     */
    playUserMessage(scene) {
        // Aggiungi messaggio utente
        this.chat.addMessage(scene.text, 'user', false);
        
        // Pulisci input
        this.inputField.value = '';
        
        // Avanza step
        this.state.setStep(this.state.getStep() + 1);
        
        // Mostra typing indicator
        this.chat.showTypingIndicator();
        
        // Delay per risposta AI
        setTimeout(() => {
            this.chat.removeTypingIndicator();
            this.isPlaying = false;
            
            // Auto-play risposta AI
            this.playScene();
        }, this.config.timing.aiThinkingDelay);
    }

    /**
     * Play messaggio AI
     * @param {Object} scene - Scena da eseguire
     */
    playAIMessage(scene) {
        // Costruisci contenuto
        let content = scene.text;
        if (scene.extraContent) {
            content += scene.extraContent;
        }
        
        // Riproduci suono se presente (con delay per sincronizzarsi col testo)
        if (scene.sound === 'glitch') {
            setTimeout(() => {
                this.animation.playSirenSound();
            }, 7000);
        } else if (scene.sound === 'siren') {
            setTimeout(() => {
                this.animation.playSirenSound();
            }, 7000);
        } else if (scene.sound === 'applause') {
            setTimeout(() => {
                this.animation.playApplauseSound();
            }, 1000);
        }

        // Effetti visivi
        if (scene.effect === 'confetti') {
            setTimeout(() => {
                this.animation.confetti(document.body);
            }, 1000);
        }
        
        // Aggiungi messaggio AI con animazione typing
        const messageEl = this.chat.addMessage(content, 'ai', this.config.ux.enableTypingAnimation, () => {
            // Callback chiamato DOPO che typing è completato
            
            // Gestione bottoni
            if (scene.buttons) {
                // Delay per permettere al DOM di aggiornarsi
                setTimeout(() => {
                    this.chat.addButtons(messageEl, scene.buttons, (nextIndex, label) => {
                        this.state.setStep(nextIndex);
                        this.isPlaying = false;
                        
                        // Auto-play scena successiva dopo breve delay
                        setTimeout(() => this.playScene(), 500);
                    });
                }, 150);
                
                // Reset isPlaying quando ci sono bottoni
                this.isPlaying = false;
            } 
            // Gestione autoNext
            else if (scene.autoNext !== undefined) {
                this.state.setStep(scene.autoNext, false);
                this.isPlaying = false;
            } 
            // Scena normale
            else {
                this.state.setStep(this.state.getStep() + 1);
                this.isPlaying = false;
            }
        });
        
        // Mostra note in modalità presentatore
        if (this.state.isPresenterMode && scene.notes) {
            this.showPresenterNotes(scene.notes);
        }
    }

    /**
     * Torna indietro nella history
     */
    goBack() {
        if (this.state.goBack()) {
            // Per ora non rifacciamo il render, solo aggiorniamo lo step
            // In una versione più avanzata si potrebbe ricostruire la chat
            console.log('Tornato allo step:', this.state.getStep());
            this.animation.hapticFeedback('light');
        } else {
            console.log('Nessuno step precedente');
            this.animation.shake(this.controlsContainer);
        }
    }

    /**
     * Reset presentazione
     */
    reset() {
        if (confirm('Vuoi davvero resettare la presentazione?')) {
            this.state.reset();
            this.chat.clearChat();
            this.isPlaying = false;
            this.animation.hapticFeedback('heavy');
            console.log('Presentazione resettata');
            
            // Ricarica la pagina per mostrare di nuovo lo splash screen
            location.reload();
        }
    }

    /**
     * Toggle modalità presentatore
     */
    togglePresenterMode() {
        this.state.togglePresenterMode();
        this.animation.hapticFeedback('medium');
    }

    /**
     * Aggiorna UI modalità presentatore
     * @param {boolean} isActive - Se modalità attiva
     */
    updatePresenterUI(isActive) {
        const btn = document.getElementById('btn-presenter');
        if (btn) {
            btn.classList.toggle('active', isActive);
            btn.title = isActive ? 'Disattiva Modalità Presentatore' : 'Attiva Modalità Presentatore';
        }
        
        // Mostra/nascondi timer
        const timer = document.getElementById('timer-display');
        if (timer) {
            timer.style.display = isActive ? 'block' : 'none';
        }
        
        // Mostra/nascondi panel note se esiste
        let notesPanel = document.getElementById('presenter-notes-panel');
        if (isActive && !notesPanel) {
            this.createPresenterNotesPanel();
        } else if (!isActive && notesPanel) {
            notesPanel.remove();
        }
    }

    /**
     * Crea panel note presentatore
     */
    createPresenterNotesPanel() {
        const panel = document.createElement('div');
        panel.id = 'presenter-notes-panel';
        panel.className = 'presenter-notes-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>Note Presentatore</h3>
                <button class="close-btn" onclick="document.getElementById('presenter-notes-panel').remove()">✕</button>
            </div>
            <div class="panel-content" id="presenter-notes-content">
                Seleziona uno step per vedere le note...
            </div>
        `;
        document.body.appendChild(panel);
    }

    /**
     * Mostra note presentatore
     * @param {string} notes - Note da mostrare
     */
    showPresenterNotes(notes) {
        const content = document.getElementById('presenter-notes-content');
        if (content) {
            content.innerHTML = `<p>${notes}</p>`;
        }
        
        // Stealth Teleprompter: mostra note come placeholder input
        if (this.inputField) {
            // Rimuovi HTML tags per il placeholder
            const plainText = notes.replace(/<[^>]*>/g, '');
            this.inputField.setAttribute('placeholder', `💡 ${plainText}`);
        }
    }

    /**
     * Avvia display timer
     */
    startTimerDisplay() {
        const timerEl = document.getElementById('timer-display');
        if (!timerEl) return;
        
        setInterval(() => {
            const elapsed = this.state.getElapsedTime();
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    /**
     * Aggiorna progress bar
     */
    updateProgress() {
        if (!this.progressBar) return;
        
        const current = this.state.getStep();
        const total = this.script.length;
        const percentage = (current / total) * 100;
        
        const fill = this.progressBar.querySelector('.progress-fill');
        const text = this.progressBar.querySelector('.progress-text');
        
        if (fill) fill.style.width = `${percentage}%`;
        if (text) text.textContent = `${current}/${total}`;
    }

    /**
     * Mostra dialog export
     */
    showExportDialog() {
        const formats = [
            { label: 'Testo (.txt)', value: 'text' },
            { label: 'Markdown (.md)', value: 'markdown' },
            { label: 'HTML (.html)', value: 'html' },
            { label: 'JSON (stato)', value: 'json' }
        ];
        
        const dialog = document.createElement('div');
        dialog.className = 'export-dialog';
        dialog.innerHTML = `
            <div class="dialog-overlay"></div>
            <div class="dialog-content">
                <h3>Esporta Conversazione</h3>
                <p>Seleziona il formato di esportazione:</p>
                ${formats.map(f => `
                    <button class="export-option" data-format="${f.value}">${f.label}</button>
                `).join('')}
                <button class="dialog-close">Annulla</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Event listeners
        dialog.querySelectorAll('.export-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.exportConversation(btn.dataset.format);
                dialog.remove();
            });
        });
        
        dialog.querySelector('.dialog-close').addEventListener('click', () => {
            dialog.remove();
        });
        
        dialog.querySelector('.dialog-overlay').addEventListener('click', () => {
            dialog.remove();
        });
    }

    /**
     * Esporta conversazione
     * @param {string} format - Formato export: 'text' | 'markdown' | 'html' | 'json'
     */
    exportConversation(format) {
        let content, filename, mimeType;
        
        switch (format) {
            case 'text':
                content = this.chat.exportAsText();
                filename = 'conversazione.txt';
                mimeType = 'text/plain';
                break;
            case 'markdown':
                content = this.chat.exportAsMarkdown();
                filename = 'conversazione.md';
                mimeType = 'text/markdown';
                break;
            case 'html':
                content = this.chat.exportAsHTML();
                filename = 'conversazione.html';
                mimeType = 'text/html';
                break;
            case 'json':
                content = this.state.exportState();
                filename = 'stato.json';
                mimeType = 'application/json';
                break;
            default:
                console.error('Formato non supportato');
                return;
        }
        
        // Download file
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log(`Conversazione esportata come ${format}`);
        this.animation.hapticFeedback('medium');
    }

    /**
     * Mostra dialog ripristino stato
     */
    showRestoreDialog() {
        if (!confirm('Trovato stato salvato. Vuoi riprendere da dove avevi lasciato?')) {
            this.state.clearState();
            // Se pulisce lo stato, inizia da capo
            this.playScene();
        } else {
             // Se ripristina, assicurati che l'UI sia aggiornata
             // (potrebbe servire ricostruire la chat history qui in futuro)
        }
    }

    /**
     * Toggle tema
     */
    toggleTheme() {
        // TODO: Implementare cambio tema
        console.log('Toggle tema (da implementare)');
    }

    /**
     * Callback completamento presentazione
     */
    onPresentationComplete() {
        console.log('Presentazione completata!');
        this.animation.confetti(document.body);
        
        setTimeout(() => {
            // alert('🎉 Presentazione completata! Ottimo lavoro!');
        }, 1000);
    }
}

// Inizializza applicazione quando DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    // Previeni doppia inizializzazione
    if (window.presenter) {
        console.warn('App già inizializzata, skip');
        return;
    }
    
    const app = new HackathonPresenter();
    app.init();
    
    // Esponi globalmente per debug
    window.presenter = app;
});
