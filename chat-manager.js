/**
 * Chat Manager
 * Gestisce rendering messaggi, DOM manipulation e interazioni UI
 */

class ChatManager {
    constructor(config, animationEngine, stateManager) {
        this.config = config;
        this.animation = animationEngine;
        this.state = stateManager;
        this.chatContainer = null;
        this.currentAnimation = null;
        this.typingIndicator = null;
        this.messageElements = [];
    }

    /**
     * Inizializza il chat manager
     * @param {HTMLElement} container - Container principale della chat
     */
    init(container) {
        this.chatContainer = container;
        this.setupAccessibility();
    }

    /**
     * Aggiunge un messaggio alla chat
     * @param {string} htmlContent - Contenuto HTML del messaggio
     * @param {string} role - 'user' | 'ai'
     * @param {boolean} animate - Se animare il typing
     * @param {Function} onComplete - Callback al completamento (opzionale)
     * @returns {HTMLElement} - Elemento messaggio creato
     */
    addMessage(htmlContent, role, animate = true, onComplete) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        messageDiv.setAttribute('role', 'article');
        messageDiv.setAttribute('aria-label', `Messaggio da ${role === 'user' ? 'utente' : 'AI'}`);
        
        // Avatar
        const avatar = this._createAvatar(role);
        
        // Content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
        
        // Aggiungi al DOM
        this.chatContainer.appendChild(messageDiv);
        this.messageElements.push(messageDiv);
        
        // Fade-in dell'elemento
        if (this.config.ux.animateMessages) {
            this.animation.fadeIn(messageDiv);
        }
        
        // Anima typing se richiesto
        if (animate && role === 'ai' && this.config.ux.enableTypingAnimation) {
            this.currentAnimation = this.animation.typeText(
                contentDiv,
                htmlContent,
                () => {
                    this.currentAnimation = null;
                    this._announceMessage(htmlContent, role);
                    if (onComplete) onComplete();
                }
            );
            
            // Permetti skip cliccando sul messaggio
            if (this.config.ux.enableSkipTyping) {
                const skipHandler = () => {
                    if (this.currentAnimation) {
                        this.animation.skipAnimation(this.currentAnimation, contentDiv, htmlContent, onComplete);
                        this.currentAnimation = null;
                    }
                };
                messageDiv.addEventListener('click', skipHandler, { once: true });
            }
        } else {
            // Nessuna animazione, mostra subito
            contentDiv.innerHTML = htmlContent;
            this._announceMessage(htmlContent, role);
            
            // Chiama callback se fornito (dopo un piccolo delay per permettere al DOM di aggiornarsi)
            if (onComplete) {
                setTimeout(() => onComplete(), 10);
            }
        }
        
        // Scroll to bottom
        this.animation.scrollToBottom(this.chatContainer);
        
        return messageDiv;
    }

    /**
     * Aggiunge bottoni interattivi a un messaggio
     * @param {HTMLElement} messageElement - Elemento messaggio
     * @param {Array} buttons - Array di { label, nextIndex }
     * @param {Function} onButtonClick - Callback click bottone
     */
    addButtons(messageElement, buttons, onButtonClick) {
        const contentDiv = messageElement.querySelector('.content');
        const btnContainer = document.createElement('div');
        btnContainer.className = 'button-container';
        btnContainer.setAttribute('role', 'group');
        btnContainer.setAttribute('aria-label', 'Opzioni di risposta');
        
        buttons.forEach((btn, index) => {
            const button = document.createElement('button');
            button.className = 'action-btn';
            button.innerText = btn.label;
            button.setAttribute('aria-label', `Scegli: ${btn.label}`);
            button.setAttribute('tabindex', '0');
            
            button.onclick = () => {
                // Haptic feedback
                this.animation.hapticFeedback('medium');
                
                // Disabilita tutti i bottoni dopo il click
                btnContainer.querySelectorAll('button').forEach(b => {
                    b.disabled = true;
                    b.classList.add('disabled');
                });
                
                // Evidenzia bottone selezionato
                button.classList.add('selected');
                
                // Callback
                if (onButtonClick) {
                    onButtonClick(btn.nextIndex, btn.label);
                }
            };
            
            // Supporto tastiera
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
            
            btnContainer.appendChild(button);
        });
        
        // Fade-in bottoni
        setTimeout(() => {
            contentDiv.appendChild(btnContainer);
            if (this.config.ux.animateMessages) {
                this.animation.fadeIn(btnContainer, this.config.timing.buttonFadeInDelay);
            }
        }, this.config.timing.buttonFadeInDelay);
    }

    /**
     * Mostra indicatore "sta scrivendo..."
     */
    showTypingIndicator() {
        if (this.typingIndicator) return; // Già visibile
        
        const div = document.createElement('div');
        div.id = 'typing-indicator';
        div.className = 'message ai-message typing-indicator';
        div.setAttribute('role', 'status');
        div.setAttribute('aria-label', 'L\'AI sta scrivendo');
        div.setAttribute('aria-live', 'polite');
        
        const avatar = this._createAvatar('ai');
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
        
        div.appendChild(avatar);
        div.appendChild(contentDiv);
        
        this.chatContainer.appendChild(div);
        this.typingIndicator = div;
        
        // Scroll to bottom
        this.animation.scrollToBottom(this.chatContainer);
    }

    /**
     * Rimuove indicatore "sta scrivendo..."
     */
    removeTypingIndicator() {
        if (!this.typingIndicator) return;
        
        this.animation.fadeOut(this.typingIndicator, () => {
            if (this.typingIndicator && this.typingIndicator.parentNode) {
                this.typingIndicator.parentNode.removeChild(this.typingIndicator);
            }
            this.typingIndicator = null;
        });
    }

    /**
     * Pulisce tutta la chat
     */
    clearChat() {
        while (this.chatContainer.firstChild) {
            this.chatContainer.removeChild(this.chatContainer.firstChild);
        }
        this.messageElements = [];
        this.typingIndicator = null;
        
        // Annuncia reset
        this._announce('Chat resettata');
    }

    /**
     * Evidenzia un messaggio (es. per navigazione)
     * @param {number} index - Indice del messaggio
     */
    highlightMessage(index) {
        // Rimuovi highlight precedenti
        this.messageElements.forEach(el => el.classList.remove('highlighted'));
        
        // Aggiungi highlight
        if (index >= 0 && index < this.messageElements.length) {
            const element = this.messageElements[index];
            element.classList.add('highlighted');
            this.animation.scrollTo(element, this.chatContainer);
        }
    }

    /**
     * Esporta conversazione come testo
     * @returns {string}
     */
    exportAsText() {
        let text = '# Conversazione Hackathon AI Mentor\n\n';
        text += `Data: ${new Date().toLocaleString('it-IT')}\n\n`;
        text += '---\n\n';
        
        this.messageElements.forEach((el, index) => {
            const role = el.classList.contains('user-message') ? 'UTENTE' : 'AI';
            const content = el.querySelector('.content');
            if (content) {
                // Rimuovi HTML tags per export testo
                const textContent = content.innerText || content.textContent;
                text += `**${role}**: ${textContent}\n\n`;
            }
        });
        
        return text;
    }

    /**
     * Esporta conversazione come Markdown
     * @returns {string}
     */
    exportAsMarkdown() {
        let md = '# Conversazione Hackathon AI Mentor\n\n';
        md += `**Data**: ${new Date().toLocaleString('it-IT')}\n\n`;
        md += '---\n\n';
        
        this.messageElements.forEach((el, index) => {
            const role = el.classList.contains('user-message') ? '👨🏻‍💻 **Utente**' : '🤖 **AI**';
            const content = el.querySelector('.content');
            if (content) {
                const htmlContent = content.innerHTML;
                // Converti HTML base in Markdown
                let mdContent = htmlContent
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                    .replace(/<[^>]+>/g, ''); // Rimuovi altri tag
                
                md += `${role}:\n\n${mdContent}\n\n---\n\n`;
            }
        });
        
        return md;
    }

    /**
     * Esporta conversazione come HTML
     * @returns {string}
     */
    exportAsHTML() {
        let html = `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversazione Hackathon AI Mentor</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .message { margin: 20px 0; padding: 15px; border-radius: 8px; }
        .user-message { background: #e3f2fd; }
        .ai-message { background: #f1f3f4; }
        .avatar { font-size: 24px; margin-bottom: 10px; }
        .content { line-height: 1.6; }
        h1 { color: #333; }
        .metadata { color: #666; font-size: 0.9em; margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>Conversazione Hackathon AI Mentor</h1>
    <div class="metadata">Data: ${new Date().toLocaleString('it-IT')}</div>
`;
        
        this.messageElements.forEach((el) => {
            const classes = el.className;
            const avatar = el.querySelector('.avatar').innerHTML;
            const content = el.querySelector('.content').innerHTML;
            
            html += `
    <div class="${classes}">
        <div class="avatar">${avatar}</div>
        <div class="content">${content}</div>
    </div>
`;
        });
        
        html += `
</body>
</html>
`;
        
        return html;
    }

    /**
     * Crea elemento avatar
     * @private
     * @param {string} role - 'user' | 'ai'
     * @returns {HTMLElement}
     */
    _createAvatar(role) {
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.setAttribute('aria-hidden', 'true');
        
        const color = role === 'ai' ? 
            this.config.themes.dark.colors.aiAvatar : 
            this.config.themes.dark.colors.userAvatar;
        
        const icon = role === 'ai' ? '🤖' : '👨🏻‍💻';
        
        avatar.innerHTML = `<div style="background:${color}; width:100%; height:100%; display:flex; align-items:center; justify-content:center; border-radius:4px;">${icon}</div>`;
        
        return avatar;
    }

    /**
     * Annuncia messaggio per screen reader
     * @private
     * @param {string} htmlContent - Contenuto HTML
     * @param {string} role - 'user' | 'ai'
     */
    _announceMessage(htmlContent, role) {
        if (!this.config.accessibility.screenReaderAnnouncements) return;
        
        // Rimuovi HTML per screen reader
        const temp = document.createElement('div');
        temp.innerHTML = htmlContent;
        const textContent = temp.textContent || temp.innerText;
        
        const announcement = role === 'ai' ? 
            `L'AI risponde: ${textContent}` : 
            `Messaggio utente: ${textContent}`;
        
        this._announce(announcement);
    }

    /**
     * Annuncia testo per screen reader
     * @private
     * @param {string} text - Testo da annunciare
     */
    _announce(text) {
        if (!this.config.accessibility.screenReaderAnnouncements) return;
        
        // Usa live region nascosta
        let liveRegion = document.getElementById('aria-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.setAttribute('role', 'status');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.cssText = 'position:absolute; left:-10000px; width:1px; height:1px; overflow:hidden;';
            document.body.appendChild(liveRegion);
        }
        
        liveRegion.textContent = text;
    }

    /**
     * Setup attributi accessibilità container
     * @private
     */
    setupAccessibility() {
        if (!this.chatContainer) return;
        
        this.chatContainer.setAttribute('role', 'log');
        this.chatContainer.setAttribute('aria-label', 'Conversazione con AI Mentor');
        this.chatContainer.setAttribute('aria-live', 'polite');
        this.chatContainer.setAttribute('aria-relevant', 'additions');
    }
}

// Esporta classe globalmente per il browser
// (per Node.js/testing usa module.exports)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ChatManager;
} else {
    window.ChatManager = ChatManager;
}

