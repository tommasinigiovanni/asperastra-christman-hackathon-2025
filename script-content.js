/**
 * COPIONE COMPLETO PER HACKATHON AsperAstra 
 * Basato sulle slide "Hackathon Festival Tavagnacco" di Giovanni Tommasini
 * 
 * Struttura di ogni scene:
 * @typedef {Object} SceneObject
 * @property {string} role - 'user' | 'ai'
 * @property {string} text - Testo del messaggio (supporta HTML)
 * @property {string} [extraContent] - Contenuto HTML extra (opzionale)
 * @property {Array<{label: string, nextIndex: number}>} [buttons] - Bottoni per branching (opzionale)
 * @property {number} [autoNext] - Indice step successivo automatico (opzionale)
 * @property {string} [notes] - Note private per modalità presentatore (opzionale)
 */

const SCRIPT = [
    // --- SCENA 1: INTRO ---
    {
        role: 'user',
        text: "Ciao ChatGPT! 👋 Sono Giovanni. Sono qui all'Hackathon di AsperAstra a Trieste. Devo spiegare a questi startupper come trasformare un'idea in un progetto vincente in 48 ore. Mi aiuti?",
        notes: "Apertura energica, coinvolgere subito il pubblico"
    },
    {
        role: 'ai',
        text: "Ciao Giovanni! Certamente. È un piacere essere qui (virtualmente). 🤖<br><br>Benvenuti al <b>Christmas Hackathon</b>! 🎄🚀<br>Prima di iniziare, dobbiamo calibrare il livello di energia. Guardali negli occhi... come ti sembrano?",
        buttons: [
            { label: "😴 Stanno dormendo", nextIndex: 2 },
            { label: "🤩 Sono carichi a molla", nextIndex: 3 }
        ],
        notes: "Interazione con il pubblico - valutare energia sala"
    },

    // --- RAMO A: SVEGLIA (Indice 2) ---
    {
        role: 'ai',
        text: "Dormono? 😴 Non esiste. Attivo il protocollo <b>SVEGLIA_IMMEDIATA</b>. ⚡️<br><br>Digli questo:<br><b>'Mentre voi dormite, un'altra AI sta già scrivendo il codice della vostra idea!'</b>",
        extraContent: "<div style='margin-top: 20px; padding: 20px; background: rgba(239, 68, 68, 0.1); border: 2px solid #ef4444; border-radius: 8px; text-align: center; animation: pulse 1s infinite;'><h2 style='color: #ef4444; margin: 0; font-weight: 800;'>⚠️ SVEGLIA! ⚠️</h2><p style='margin: 10px 0 0 0; font-family: monospace;'>SYSTEM_OVERRIDE: ACTIVE</p></div>", 
        autoNext: 3,
        sound: 'glitch',
        notes: "Urla la frase in grassetto! Fagli paura (per finta)."
    },

    // --- SCENA 2: DEFINIZIONE (A3 Canvas) (Indice 3) ---
    {
        role: 'user',
        text: "Ok, ora ci siamo! Molti team stanno già aprendo l'editor di codice. È la mossa giusta?",
        notes: "Introduzione al tema centrale: non correre alla soluzione"
    },
    {
        role: 'ai',
        text: "ASSOLUTAMENTE NO! 🛑 Ferma tutto!<br>Prima di scrivere una riga di codice, devono compilare l'<b>A3 Definition Canvas</b>.<br><br>Serve per capire se stanno risolvendo il problema giusto.",
        extraContent: "<br><img src='img/A3.png' style='max-width: 100%; border-radius: 8px; border: 1px solid #444;' alt='A3 Definition Canvas'>",
        notes: "Mostrare A3 Canvas: Problema, Cliente, Concorrenza"
    },

    // --- SCENA 3: PRETOTYPE (Indice 5) ---
    {
        role: 'user',
        text: "Chiaro. Niente codice finché non abbiamo definito il problema. E poi? Costruiamo il prototipo?",
        notes: "Transizione verso Pretotyping vs Prototyping"
    },
    {
        role: 'ai',
        text: "Nemmeno per sogno! 🚫<br>Ricorda la regola d'oro di Alberto Savoia: <b>Pretotipare prima di Prototipare</b>.<br><br><i>'Assicurati di costruire la cosa giusta, prima di costruirla per bene.'</i><br>Se costruiscono subito 'per bene' qualcosa che nessuno vuole, sprecano tempo prezioso.",
        notes: "Citare Alberto Savoia - concetto chiave Pretotyping"
    },

    // --- SCENA 4: XYZ HYPOTHESIS (Indice 7) ---
    {
        role: 'user',
        text: "Ok, ma come dimostrano che la loro idea funziona senza averla costruita?",
        notes: "Come validare senza prodotto"
    },
    {
        role: 'ai',
        text: "Devono usare l'<b>Ipotesi XYZ</b> per trasformare opinioni in DATI. 📊<br><br>Formula:<br><i>'Almeno il <b>X%</b> di <b>Y</b> farà <b>Z</b>'</i><br><br>Esempio: <i>'Almeno il 10% dei visitatori del sito lascerà la mail.'</i>",
        notes: "XYZ Hypothesis: dati concreti, non opinioni"
    },

    // --- SCENA 5: DATA & SENTIMENT (Indice 9) ---
    {
        role: 'user',
        text: "E se hanno fatto delle interviste? Come analizziamo velocemente i dati qualitativi?",
        notes: "Introduzione analisi dati con AI"
    },
    {
        role: 'ai',
        text: "Posso farlo io in un attimo! 🧠<br>Dammi le trascrizioni e estrarrò il <b>Sentiment</b> e la <b>Propensione all'acquisto</b>.<br><br>Esempio di mio output:<br><pre style='background:#2d2d3e; padding:10px; border-radius:5px; font-size:0.8em;'>{\n  \"sentiment\": \"Positivo (scetticismo iniziale)\",\n  \"propensione\": \"Alta se integrato con WhatsApp\"\n}</pre>",
        notes: "Mostrare potenza AI per analisi qualitativa veloce"
    },

    // --- SCENA 6: TOOLS & MVP (Indice 11) ---
    {
        role: 'user',
        text: "Wow, utile! Senti, per costruire l'MVP in poche ore, quali strumenti consigli?",
        notes: "Toolkit per hackathon"
    },
    {
        role: 'ai',
        text: "Ecco il mio <b>Kit di Sopravvivenza No-Code & AI</b>: 🛠️<br><br>🔹 <b>Frontend</b>: Retool, Glide, o anche Notion<br>🔹 <b>Automazioni</b>: Make.com, Zapier, n8n<br>🔹 <b>AI App</b>: Flowise, Voiceflow<br>🔹 <b>Design</b>: MidJourney, DALL-E<br><br>Non reinventate la ruota, assemblatela!",
        notes: "Elenco tool pratici dal PDF"
    },

    // --- SCENA 7: LEAN CANVAS (Indice 13) ---
    {
        role: 'user',
        text: "E per il Business Model? Devono scrivere un Business Plan da 50 pagine?",
        notes: "Introduzione Lean Canvas"
    },
    {
        role: 'ai',
        text: "Per carità! 😱 Qui serve velocità.<br>Usate il <b>Lean Canvas</b>. È una mappa in una sola pagina per decostruire l'idea.",
        extraContent: "<br><img src='img/lean-canvas.png' style='max-width: 100%; border-radius: 8px; border: 1px solid #444;' alt='Lean Canvas'>",
        notes: "Spiegare Lean Canvas: veloce e iterativo"
    },

    // --- SCENA 8: MANTRA & MINDSET (Indice 15) ---
    {
        role: 'user',
        text: "Tutto chiarissimo. Ma c'è una filosofia, un mantra che devono tenere a mente per non bloccarsi?",
        notes: "Mindset Hackathon - Mantra"
    },
    {
        role: 'ai',
        text: "Assolutamente sì. Stampatevelo in testa: 🧠<br><br>✨ <b>Good enough for now, safe enough to try</b><br>✨ <b>Fatto è meglio che perfetto</b><br>✨ <b>Fallite il prima possibile</b> (per imparare subito)<br><br>Non cercate la perfezione oggi. Cercate l'apprendimento.",
        notes: "Mantra fondamentale: Fail Fast, Learn Faster"
    },

    // --- SCENA 9: PITCH FINALE (Indice 17) ---
    {
        role: 'user',
        text: "Fantastico. Siamo alla fine. Domenica dovranno presentare tutto alla giuria. Consigli per il Pitch?",
        notes: "Consigli finali per la presentazione"
    },
    {
        role: 'ai',
        text: "Il Pitch deve essere una storia. 📖<br><br>1️⃣ <b>Gancio</b>: Il Problema (fate sentire il dolore)<br>2️⃣ <b>Soluzione</b>: La vostra magia<br>3️⃣ <b>Demo</b>: Fate vedere che funziona<br>4️⃣ <b>Validazione</b>: I dati che avete raccolto<br>5️⃣ <b>Team</b>: Perché voi?",
        notes: "Struttura pitch efficace"
    },

    // --- SCENA 10: CONCLUSIONE (Indice 19) ---
    {
        role: 'user',
        text: "Grazie mille AI. Un ultimo saluto per i ragazzi di AsperAstra ?",
        notes: "Chiusura motivazionale"
    },
    {
        role: 'ai',
        text: "⚠️ <b>DISCLAIMER FINALE</b> ⚠️<br>L'AI amplifica, ma non crea dal nulla.<br><br><b>Sognate in grande, prototipate con l'AI, ma restate UMANI.</b><br><br>Ora andate e spaccate tutto! 🚀",
        sound: 'applause',
        effect: 'confetti',
        notes: "Messaggio finale"
    }
];

// Esporta script globalmente per il browser
// (per Node.js/testing usa module.exports)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = SCRIPT;
} else {
    window.SCRIPT = SCRIPT;
}
