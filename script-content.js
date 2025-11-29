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
        text: "Ciao ChatGPT! 👋 Sono Giovanni. Sono qui all'Hackathon di Asper Astra a Trieste. Devo spiegare a questi startupper come trasformare un'idea in un progetto vincente in 48 ore. Mi aiuti?",
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

    // --- SCENA 2: IL PROBLEMA (Indice 3) ---
    {
        role: 'user',
        text: "Ok, ora ci siamo! Senti, vedo molti team che stanno già aprendo l'editor di codice per iniziare a sviluppare l'app finale. È la mossa giusta?",
        notes: "Introduzione al tema centrale: validation"
    },
    {
        role: 'ai',
        text: "ASSOLUTAMENTE NO! 🛑 Ferma tutto!<br>Stanno commettendo l'errore classico: innamorarsi della soluzione prima di aver capito il problema.<br><br>Ricorda la regola d'oro di Alberto Savoia: <b>Pretotipare prima di Prototipare</b>.",
        notes: "Citare Alberto Savoia - concetto chiave"
    },
    {
        role: 'ai',
        text: "Se costruiscono subito 'per bene' qualcosa che nessuno vuole, finiranno così:<br><img src='https://media.istockphoto.com/id/1136422297/photo/bored-baby-boy-on-sofa.jpg?s=612x612&w=0&k=20&c=6y9Yl35Hlq6kL7O7jQzX0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0=' style='max-width: 300px; border-radius: 8px;' alt='Bambino annoiato sul divano'><br><i>'Assicurati di costruire la cosa giusta, prima di costruirla per bene.'</i>",
        notes: "Enfatizzare il rischio di costruire prodotti non voluti"
    },

    // --- SCENA 3: LA SOLUZIONE (XYZ Hypothesis) ---
    {
        role: 'user',
        text: "Ricevuto. Niente codice per ora. Ma come fanno a dimostrare ai giudici che la loro idea funziona senza averla costruita?",
        notes: "Transizione verso la metodologia pratica"
    },
    {
        role: 'ai',
        text: "Devono trasformare le opinioni in DATI. 📊<br>Serve l'<b>Ipotesi XYZ</b>.<br><br>La formula è:<br><i>'Almeno il <b>X%</b> di <b>Y</b> farà <b>Z</b>'</i>",
        notes: "Introduzione XYZ Hypothesis - scrivere formula alla lavagna se possibile"
    },
    {
        role: 'ai',
        text: "Ecco un esempio concreto:<br>✅ <i>'Almeno il <b>10%</b> (X) dei <b>WISP italiani</b> (Y) mi darà il suo <b>indirizzo email</b> (Z) per saperne di più.'</i><br><br>Devono essere numeri precisi, non 'tanti' o 'forse'.",
        notes: "Esempio pratico - verificare comprensione pubblico"
    },

    // --- SCENA 4: SKIN IN THE GAME (Fake Door) ---
    {
        role: 'user',
        text: "Ok, chiaro. Ma come raccogliamo questi dati qui, oggi, in poche ore?",
        notes: "Problema pratico del timing hackathon"
    },
    {
        role: 'ai',
        text: "Usiamo la tecnica della <b>Porta Finta (Fake Door)</b>. 🚪<br><br>1. Create una Landing Page o un volantino veloce.<br>2. Promettete il servizio come se esistesse già.<br>3. Quando cliccano su 'Compra', chiedete la mail.<br><br>Ottenere una mail o un numero di telefono è <b>Skin in the Game</b>. I 'Mi piace' su Facebook sono solo vanità.",
        notes: "Fake Door: enfatizzare differenza tra interesse vero e vanity metrics"
    },

    // --- SCENA 5: AI TOOLS & PROMPT DESIGN ---
    {
        role: 'user',
        text: "Il tempo è poco. Possono usare l'AI (cioè te!) per accelerare il lavoro? Hai consigli sui Prompt?",
        notes: "Transizione verso parte AI/Tech"
    },
    {
        role: 'ai',
        text: "Certo che possono! Ma devono saper chiedere. 🧠<br>Un prompt generico dà risultati generici.<br><br>La struttura per un <b>Prompt Perfetto</b> deve avere 4 elementi:<br>1️⃣ <b>Contesto</b>: Chi sono io? (Es. 'Agisci come un esperto di Marketing')<br>2️⃣ <b>Compito</b>: Cosa devo fare?<br>3️⃣ <b>Istruzioni</b>: Come lo vuoi fatto?<br>4️⃣ <b>Formato</b>: Tabella, codice, lista?",
        notes: "Framework 4C - dare esempio live se possibile"
    },
    {
        role: 'user',
        text: "Ottimo. E per il Business Plan? I giudici vorranno vedere i numeri...",
        notes: "Business aspect - parte finale"
    },

    // --- SCENA 6: BUSINESS (Lean Canvas) ---
    {
        role: 'ai',
        text: "Per carità, niente Business Plan da 50 pagine! 📄<br>Qui serve velocità. Usate il <b>Lean Canvas</b>.<br><br>Dite loro di concentrarsi solo su:<br>🔸 <b>Problem</b> (Che dolore risolvi?)<br>🔸 <b>Unique Value Proposition</b> (Perché sei diverso?)<br>🔸 <b>Unfair Advantage</b> (Cosa hai che non possono copiare?)",
        notes: "Lean Canvas vs Business Plan tradizionale - velocità"
    },
    {
        role: 'ai',
        text: "Per i costi e i ricavi, posso fare io i calcoli. 🧮<br>Posso generare grafici di break-even in secondi se mi danno i dati grezzi. Sfruttate la mia capacità di Data Analysis!",
        notes: "Enfatizzare potenza AI per analisi dati"
    },

    // --- SCENA 7: CONCLUSIONE ---
    {
        role: 'user',
        text: "Grazie mille AI. Un ultimo consiglio per i ragazzi di Asper Astra prima di lasciarli lavorare?",
        notes: "Chiusura - preparare call to action"
    },
    {
        role: 'ai',
        text: "⚠️ <b>DISCLAIMER FINALE</b> ⚠️<br>Ricordatevi sempre: io ho letto tutto internet, ma non sono il Vangelo.<br><br>Usate l'AI per l'<b>EFFICIENZA</b>, ma metteteci la vostra <b>AUTENTICITÀ</b> umana.<br>L'AI non sostituisce il vostro ingegno, lo amplifica.<br><br>Ora andate e spaccate tutto! 🚀",
        notes: "Messaggio finale motivazionale - energia alta!"
    }
];

// Esporta script globalmente per il browser
// (per Node.js/testing usa module.exports)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = SCRIPT;
} else {
    window.SCRIPT = SCRIPT;
}

