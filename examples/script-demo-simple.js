/**
 * ESEMPIO SCRIPT SEMPLICE
 * Template base per creare una nuova presentazione
 * 
 * Come usare:
 * 1. Copia questo file
 * 2. Personalizza i messaggi
 * 3. Sostituisci il contenuto di script-content.js con questo
 * 4. Ricarica la pagina
 */

const SCRIPT = [
    // Messaggio iniziale utente
    {
        role: 'user',
        text: "Ciao! Questa è una presentazione demo. Pronto per iniziare?",
        notes: "Saluto iniziale - essere energici!"
    },
    
    // Risposta AI semplice
    {
        role: 'ai',
        text: "Ciao! 👋 Sono pronto! Questa è una demo di come creare una presentazione interattiva.<br><br>È molto semplice: basta definire un array di oggetti come questo!",
        notes: "Spiegare la semplicità del sistema"
    },
    
    // Esempio con domanda utente
    {
        role: 'user',
        text: "Interessante! Posso anche aggiungere delle scelte interattive?"
    },
    
    // Esempio con bottoni per branching
    {
        role: 'ai',
        text: "Certamente! Guarda, ti faccio una domanda con due possibili risposte:",
        buttons: [
            { label: "👍 Mostrami un esempio", nextIndex: 4 },
            { label: "⏭️ Vai alla conclusione", nextIndex: 8 }
        ],
        notes: "Qui il pubblico può scegliere il percorso"
    },
    
    // Branch A: Esempio (indice 4)
    {
        role: 'ai',
        text: "Perfetto! Hai scelto di vedere un esempio.<br><br>I bottoni permettono di creare percorsi diversi nella presentazione. Puoi saltare a qualsiasi indice dell'array!",
        notes: "Spiegare meccanismo branching"
    },
    
    // Esempio con immagine
    {
        role: 'ai',
        text: "Puoi anche inserire immagini:",
        extraContent: "<img src='https://via.placeholder.com/300x200/10a37f/ffffff?text=Demo+Image' alt='Immagine demo' style='max-width:300px; margin-top:10px; border-radius:8px;'>",
        notes: "Mostrare supporto media"
    },
    
    // Continua flusso
    {
        role: 'user',
        text: "Fantastico! Questo è davvero versatile."
    },
    
    // Messaggio finale
    {
        role: 'ai',
        text: "Esatto! E questo è solo l'inizio. Puoi:<br>• Aggiungere tutti i messaggi che vuoi<br>• Inserire HTML per formattazione<br>• Creare branch multipli<br>• Aggiungere note per presenter mode<br><br>Ora sei pronto per creare la tua presentazione! 🚀",
        notes: "Conclusione con call-to-action"
    },
    
    // Ramo alternativo: Conclusione diretta (indice 8)
    {
        role: 'ai',
        text: "Ok, andiamo alla conclusione!<br><br>Il sistema è molto flessibile e personalizzabile. Puoi creare presentazioni professionali in pochi minuti.<br><br>Buona fortuna con la tua presentazione! 🎉",
        notes: "Conclusione alternativa per chi ha saltato"
    }
];

// Note:
// - Gli indici partono da 0
// - role può essere 'user' o 'ai'
// - text supporta HTML
// - extraContent è opzionale per HTML aggiuntivo
// - buttons crea scelte interattive
// - autoNext salta automaticamente (vedi script principale per esempi)
// - notes sono visibili solo in presenter mode

