# Examples

Questa cartella contiene esempi di script alternativi per diverse tipologie di presentazioni.

## 📂 File Disponibili

### `script-demo-simple.js`

Script di esempio minimalista che mostra le funzionalità base:
- Messaggi user/AI
- Branching con bottoni
- Inserimento immagini
- Note per presenter mode

**Uso**: Perfetto come template per iniziare una nuova presentazione.

## 🚀 Come Usare un Esempio

### Metodo 1: Sostituzione Completa

```bash
# Backup dello script corrente
cp script-content.js script-content.backup.js

# Copia l'esempio
cp examples/script-demo-simple.js script-content.js

# Ricarica il browser
```

### Metodo 2: Import Temporaneo

Modifica `index.html` temporaneamente:

```html
<!-- Commenta script corrente -->
<!-- <script src="script-content.js"></script> -->

<!-- Carica esempio -->
<script src="examples/script-demo-simple.js"></script>
```

### Metodo 3: Copia e Personalizza

```bash
# Crea una nuova versione basata sull'esempio
cp examples/script-demo-simple.js my-custom-script.js

# Edita my-custom-script.js
# Poi sostituisci script-content.js quando pronto
```

## 📝 Creare un Nuovo Script

### Template Base

```javascript
const SCRIPT = [
    {
        role: 'user',
        text: "Tuo messaggio qui",
        notes: "Note private per te"
    },
    {
        role: 'ai',
        text: "Risposta AI",
        notes: "Note private per te"
    }
];
```

### Aggiungere Branching

```javascript
{
    role: 'ai',
    text: "Scegli un'opzione:",
    buttons: [
        { label: "Opzione A", nextIndex: 5 },
        { label: "Opzione B", nextIndex: 10 }
    ]
}
```

### Inserire Media

```javascript
{
    role: 'ai',
    text: "Ecco un'immagine:",
    extraContent: "<img src='path/to/image.jpg' alt='Descrizione' style='max-width:400px'>"
}
```

### AutoNext (Salto Automatico)

```javascript
{
    role: 'ai',
    text: "Questo messaggio salta automaticamente al prossimo",
    autoNext: 7  // Va all'indice 7
}
```

## 💡 Best Practices

### Struttura

1. **Intro chiara** - Primo messaggio deve catturare l'attenzione
2. **Flow logico** - Sequenza naturale di domande/risposte
3. **Branching strategico** - Usa i branch per scenari diversi
4. **Conclusione forte** - Ultimo messaggio deve lasciare un'impressione

### Content

- ✅ Usa emoji per vivacità (ma senza esagerare)
- ✅ Formatta con HTML: `<b>`, `<i>`, `<br>`
- ✅ Aggiungi note per ricordarti i punti chiave
- ✅ Testa tutti i branch prima della presentazione
- ❌ Evita messaggi troppo lunghi
- ❌ Non usare troppe immagini pesanti

### Timing

```javascript
// In config.js puoi modificare i timing:
CONFIG.timing.typingSpeed = 30;         // Velocità typing
CONFIG.timing.aiThinkingDelay = 1500;   // Delay "sta scrivendo"
CONFIG.timing.punctuationPause = 300;   // Pausa su punteggiatura
```

### Presenter Mode

Aggiungi sempre note utili:

```javascript
{
    role: 'ai',
    text: "Contenuto visibile al pubblico",
    notes: "Ricordati di: parlare lentamente, guardare il pubblico, enfatizzare questo punto"
}
```

## 🎯 Esempi per Casi d'Uso

### Pitch Startup

```javascript
const SCRIPT = [
    {
        role: 'user',
        text: "Ciao! Sono [Nome]. Ho un'idea che può rivoluzionare [settore]."
    },
    {
        role: 'ai',
        text: "Interessante! Raccontami di più. Qual è il problema che stai risolvendo?"
    },
    // ... continua con problem, solution, market, team, ask
];
```

### Tutorial Tecnico

```javascript
const SCRIPT = [
    {
        role: 'user',
        text: "Oggi impariamo [tecnologia]. Iniziamo dalle basi?"
    },
    {
        role: 'ai',
        text: "Perfetto! [Tecnologia] si basa su tre concetti fondamentali...",
        buttons: [
            { label: "Sono principiante", nextIndex: 2 },
            { label: "Conosco le basi", nextIndex: 10 }
        ]
    },
    // ... branch per livelli diversi
];
```

### Demo Prodotto

```javascript
const SCRIPT = [
    {
        role: 'user',
        text: "Vi presento [Prodotto], la soluzione che stavate aspettando!"
    },
    {
        role: 'ai',
        text: "Vediamo insieme le funzionalità principali:",
        extraContent: "<img src='product-screenshot.png' alt='Screenshot prodotto'>"
    },
    // ... feature walkthrough con immagini
];
```

## 🐛 Troubleshooting

### Gli indici non corrispondono

```javascript
// ❌ SBAGLIATO
buttons: [
    { label: "A", nextIndex: 100 }  // Indice inesistente!
]

// ✅ GIUSTO
buttons: [
    { label: "A", nextIndex: 5 }  // Indice valido nell'array
]
```

### Le immagini non si vedono

```bash
# Verifica che l'immagine sia nella root o usa path assoluto
<img src='./images/mia-immagine.jpg'>  # Path relativo
<img src='https://example.com/image.jpg'>  # URL esterno
```

### Lo script non si carica

```javascript
// Verifica che la sintassi sia corretta
const SCRIPT = [  // Maiuscolo!
    // ...
];
// Nessun punto e virgola dopo ]
```

## 📚 Risorse Aggiuntive

- [README principale](../README.md) - Documentazione completa
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Guidelines contribuzione
- [Config.js](../config.js) - Tutte le opzioni di configurazione

## 🤝 Condividi i Tuoi Script!

Hai creato uno script interessante? Condividilo!

1. Testa che funzioni perfettamente
2. Aggiungi commenti esplicativi
3. Crea Pull Request con il tuo esempio
4. Sarà incluso in questa cartella per aiutare altri

---

**Buona creazione! 🎨**

