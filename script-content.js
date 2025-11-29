/**
 * COPIONE COMPLETO PER HACKATHON ASPER ASTRA
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
        text: "Ciao Giovanni! Certamente. È un piacere essere qui (virtualmente). 🤖<br><br>Prima di iniziare, dobbiamo calibrare il livello di energia. Guardali negli occhi... come ti sembrano?",
        buttons: [
            { label: "😴 Stanno dormendo", nextIndex: 2 },
            { label: "🤩 Sono carichi a molla", nextIndex: 3 }
        ],
        notes: "Interazione con il pubblico - valutare energia sala"
    },

    // --- RAMO A: SVEGLIA (Indice 2) ---
    {
        role: 'ai',
        text: "Ahi, male! 📉 Se dormono non innovano. Dì loro che il tempo scorre!<br>Mostra subito questo per svegliarli:",
        extraContent: "<br><img src='https://i.makeagif.com/media/7-05-2017/SMkjhe.gif' style='max-width: 300px; border-radius: 8px;' alt='Carlo Verdone meme - N che senso'>", 
        autoNext: 3,
        notes: "Momento comico - pausa per reazione pubblico"
    },

    // --- SCENA 2: DEFINIZIONE (A3 Canvas) (Indice 3) ---
    {
        role: 'user',
        text: "Ok, ora ci siamo! Molti team stanno già aprendo l'editor di codice. È la mossa giusta?",
        notes: "Introduzione al tema centrale: non correre alla soluzione"
    },
    {
        role: 'ai',
        text: "ASSOLUTAMENTE NO! 🛑 Ferma tutto!<br>Prima di scrivere una riga di codice, devono compilare l'<b>A3 Definition Canvas</b>.<br><br>Chiedi loro:<br>1️⃣ <b>Qual è il Problema?</b> (Funzionale, Emozionale, Latente)<br>2️⃣ <b>Chi è il Cliente?</b> (Audience ristretta, MVA)<br>3️⃣ <b>Chi è la Concorrenza?</b> (Anche le alternative non tecnologiche)",
        notes: "Focus su A3 Canvas: Problema, Cliente, Concorrenza"
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
        text: "Posso farlo io in un attimo! 🧠<br>Dammi le trascrizioni e estrarrò il <b>Sentiment</b> e la <b>Propensione all'acquisto</b>.<br><br>Esempio di mio output:<br><pre style='background:#2d2d3e; padding:10px; border-radius:5px; font-size:0.8em;'>{\n  \"sentiment\": \"Positivo (scetticismo iniziale sul prezzo)\",\n  \"propensione\": \"Alta se integrato con WhatsApp\"\n}</pre>",
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

    // --- SCENA 7: PITCH FINALE (Indice 13) ---
    {
        role: 'user',
        text: "Fantastico. Siamo alla fine. Domenica dovranno presentare tutto alla giuria. Consigli per il Pitch?",
        notes: "Consigli finali per la presentazione"
    },
    {
        role: 'ai',
        text: "Il Pitch deve essere una storia, non una lista della spesa. 📖<br><br>Struttura vincente:<br>1️⃣ <b>Gancio</b>: Il Problema (fai sentire il dolore)<br>2️⃣ <b>La Soluzione</b>: La vostra magia<br>3️⃣ <b>Demo</b>: Fate vedere che funziona (anche se è un video)<br>4️⃣ <b>Validazione</b>: I dati XYZ che avete raccolto<br>5️⃣ <b>Team</b>: Perché voi?",
        notes: "Struttura pitch efficace"
    },

    // --- SCENA 8: CONCLUSIONE (Indice 15) ---
    {
        role: 'user',
        text: "Grazie mille AI. Un ultimo consiglio per i ragazzi di AsperAstra prima di lasciarli lavorare?",
        notes: "Chiusura motivazionale"
    },
    {
        role: 'ai',
        text: "⚠️ <b>DISCLAIMER FINALE</b> ⚠️<br>L'AI è potente, ma non sostituisce il vostro ingegno.<br><br><b>Sognate in grande, prototipate con l'AI, ma restate UMANI.</b><br><br>Ora andate e spaccate tutto! 🚀",
        notes: "Messaggio finale: AI amplifica, non sostituisce"
    }
];

// Esporta script globalmente per il browser
// (per Node.js/testing usa module.exports)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = SCRIPT;
} else {
    window.SCRIPT = SCRIPT;
}
