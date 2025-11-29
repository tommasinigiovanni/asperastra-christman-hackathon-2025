# 🚀 Quick Start Guide

Guida rapida per far partire l'applicazione in 5 minuti!

## ⚡ Metodo 1: Docker Compose (Raccomandato)

```bash
# 1. Avvia l'applicazione
docker compose up

# 2. Apri il browser
open http://localhost:8080

# 3. Premi INVIO per iniziare la presentazione
```

**Hot-reload attivo**: Modifica i file e ricarica la pagina (Cmd+R) per vedere i cambiamenti!

### Stop

```bash
# In un altro terminale
docker compose down
```

---

## 🐳 Metodo 2: Docker Build (Produzione)

```bash
# 1. Build immagine
docker build -t hackathon-ai-mentor .

# 2. Run container
docker run -d --name ai-presenter -p 8080:80 hackathon-ai-mentor

# 3. Apri browser
open http://localhost:8080
```

### Stop

```bash
docker stop ai-presenter
docker rm ai-presenter
```

---

## 💻 Metodo 3: Locale (Senza Docker)

```bash
# Con Python 3
python3 -m http.server 8080

# Con Node.js
npx http-server -p 8080

# Apri http://localhost:8080
```

---

## 📖 Come Usare l'App

### Controlli Base

- **INVIO** o **Spazio** → Avanza alla scena successiva
- **Click sui bottoni** → Scegli il percorso narrativo
- **Tasti 1-9** → Seleziona rapidamente l'opzione corrispondente (1=Prima, 2=Seconda)
- **←** → Torna indietro (se disponibile)
- **H** → Nascondi/Mostra interfaccia (Stealth Mode)
- **R** → Reset presentazione
- **P** → Attiva/disattiva modalità presentatore
- **E** → Esporta conversazione

### Flusso Tipico

1. **Premi INVIO** → Appare messaggio utente
2. **Indicatore "..."** → L'AI sta pensando (1.5 sec)
3. **Messaggio AI** → Appare con animazione typing
4. **Bottoni** (quando presenti) → Scegli per proseguire (Mouse o tasti 1,2)
5. **Premi INVIO** → Continua se non ci sono bottoni

### Modalità Presentatore Avanzata

- **Note Segrete**: Appaiono come placeholder nell'input box ("💡 Suggerimento...")
- **Stealth Mode (H)**: Nasconde progress bar e controlli per una proiezione pulita
- **Presenter Panel (P)**: Apre pannello laterale con note complete e timer

### Progress Bar

In alto vedi: `X/18` dove:
- `X` = Step corrente
- `18` = Totale scene nello script

---

## 🎨 Personalizzazione Rapida

### Modifica il Copione

Edita `script-content.js`:

```javascript
const SCRIPT = [
    {
        role: 'user',
        text: "Il tuo messaggio qui",
        notes: "Note private per presenter mode"
    },
    {
        role: 'ai',
        text: "Risposta AI",
        buttons: [
            { label: "Opzione A", nextIndex: 5 },
            { label: "Opzione B", nextIndex: 8 }
        ]
    }
];
```

### Cambia Velocità Typing

Edita `config.js`:

```javascript
timing: {
    typingSpeed: 30,         // ms per carattere (default 30)
    aiThinkingDelay: 1500,   // delay "sta scrivendo..." (default 1500)
}
```

### Disabilita Animazioni

```javascript
ux: {
    enableTypingAnimation: false,  // Disabilita typing
    enableAutoScroll: false,       // Disabilita auto-scroll
}
```

---

## 🐛 Troubleshooting

### Porta 8080 occupata

```bash
# Usa una porta diversa
docker run -d -p 9999:80 hackathon-ai-mentor
# Poi vai su http://localhost:9999
```

### L'app non si avvia

1. **Ricarica pagina** hard refresh: `Cmd+Shift+R` (Mac) o `Ctrl+Shift+R` (Windows)
2. **Pulisci cache** del browser
3. **Controlla Console** del browser (F12) per errori

### Animazioni bloccate

Apri Console browser e digita:

```javascript
window.presenter.isPlaying = false;
window.presenter.playScene();
```

### Reset completo

```bash
# Stop Docker
docker compose down

# Pulisci localStorage (nella Console browser)
localStorage.clear();

# Restart
docker compose up
```

---

## 📚 Documentazione Completa

- **[README.md](README.md)** - Documentazione completa
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Come contribuire
- **[examples/](examples/)** - Script di esempio

---

## 🎯 Prossimi Passi

1. ✅ **Testa** l'applicazione
2. 🎨 **Personalizza** lo script per la tua presentazione
3. 📊 **Prova** la modalità presentatore (Premi **P**)
4. 💾 **Esporta** la conversazione (Premi **E**)
5. 🚀 **Presenta** al tuo hackathon!

---

**Buona presentazione! 🎉**

