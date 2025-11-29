# Contributing to Hackathon AI Mentor

🎉 Prima di tutto, grazie per aver considerato di contribuire a Hackathon AI Mentor!

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Come Posso Contribuire?](#come-posso-contribuire)
- [Setup Ambiente di Sviluppo](#setup-ambiente-di-sviluppo)
- [Workflow di Sviluppo](#workflow-di-sviluppo)
- [Style Guide](#style-guide)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggerire Nuove Feature](#suggerire-nuove-feature)

## Code of Conduct

Questo progetto aderisce a un Code of Conduct. Partecipando, ci si aspetta che tu lo rispetti.

### Le Nostre Promesse

- Usare linguaggio accogliente e inclusivo
- Rispettare punti di vista ed esperienze diverse
- Accettare costruttivamente le critiche
- Focalizzarsi su ciò che è meglio per la community
- Mostrare empatia verso gli altri membri

## Come Posso Contribuire?

### 🐛 Reporting Bugs

Se trovi un bug:

1. **Verifica** che non sia già stato riportato nelle Issues
2. **Usa il template** per bug report
3. **Includi dettagli**:
   - Passi per riprodurre
   - Comportamento atteso vs attuale
   - Screenshot/GIF se applicabile
   - Versione browser/OS
   - Console errors

### ✨ Suggerire Feature

Per suggerire nuove funzionalità:

1. **Verifica** che non sia già stata proposta
2. **Spiega chiaramente** il problema che risolverebbe
3. **Descrivi la soluzione** che vorresti
4. **Considera alternative** e menzionale
5. **Fornisci contesto** su perché sarebbe utile

### 📝 Migliorare Documentazione

La documentazione può sempre migliorare! Contributi benvenuti per:

- Correggere typo o errori
- Aggiungere esempi
- Chiarire sezioni confuse
- Tradurre in altre lingue
- Aggiungere screenshots/GIF

### 💻 Contribuire Codice

Vedi [Workflow di Sviluppo](#workflow-di-sviluppo) sotto.

## Setup Ambiente di Sviluppo

### Prerequisiti

- Node.js 18+
- Docker & Docker Compose (opzionale ma raccomandato)
- Git
- Un editor (VS Code raccomandato)

### Steps

```bash
# 1. Fork il repository su GitHub

# 2. Clone il tuo fork
git clone https://github.com/YOUR_USERNAME/asperastra-christman-hackathon.git
cd asperastra-christman-hackathon

# 3. Aggiungi remote upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/asperastra-christman-hackathon.git

# 4. Installa dipendenze
npm install

# 5. Avvia dev server
docker compose up
# oppure
npm run dev

# 6. Apri http://localhost:8080
```

### VS Code Extensions Raccomandate

- ESLint
- Prettier
- EditorConfig
- Docker
- Jest Runner

## Workflow di Sviluppo

### 1. Crea Branch

```bash
# Aggiorna il tuo fork
git checkout main
git pull upstream main

# Crea nuovo branch per la tua feature
git checkout -b feature/nome-feature
# oppure
git checkout -b fix/nome-bug
```

**Naming Convention**:
- `feature/descrizione` - Nuove feature
- `fix/descrizione` - Bug fixes
- `docs/descrizione` - Documentazione
- `refactor/descrizione` - Refactoring
- `test/descrizione` - Test
- `chore/descrizione` - Manutenzione

### 2. Sviluppa

```bash
# Modifica file
# Testa localmente
npm test
npm run lint

# Se necessario, fixa linting
npm run lint -- --fix
npm run format

# Testa con Docker (Mac: usa 'docker compose')
docker compose up
```

### 3. Commit

```bash
git add .
git commit -m "tipo: breve descrizione"

# Vedi sezione Commit Messages per convenzioni
```

### 4. Push e Pull Request

```bash
# Push al tuo fork
git push origin feature/nome-feature

# Vai su GitHub e apri Pull Request
```

## Style Guide

### JavaScript

Seguiamo **Airbnb JavaScript Style Guide** con alcune modifiche.

#### Regole Principali

```javascript
// ✅ BUONO
const myVariable = 'value';
const myFunction = (param1, param2) => {
    return param1 + param2;
};

class MyClass {
    constructor(config) {
        this.config = config;
    }
    
    myMethod() {
        // ...
    }
}

// ❌ CATTIVO
var myVariable = "value"
function myFunction(param1,param2){
    return param1+param2
}
```

#### Specificità

- **Indentazione**: 4 spazi (non tab)
- **Quotes**: Single quotes `'` per stringhe
- **Semicolons**: Sempre `;`
- **Line length**: Max 100 caratteri (soft limit)
- **Naming**:
  - `camelCase` per variabili e funzioni
  - `PascalCase` per classi
  - `UPPER_SNAKE_CASE` per costanti
  - Nomi descrittivi, evita abbreviazioni

#### JSDoc

Documenta tutte le funzioni pubbliche:

```javascript
/**
 * Descrizione breve della funzione
 * 
 * @param {string} param1 - Descrizione parametro
 * @param {Object} options - Opzioni
 * @param {boolean} options.flag - Flag opzionale
 * @returns {Promise<Object>} - Descrizione return
 * @throws {Error} - Quando si verifica errore
 * 
 * @example
 * const result = myFunction('test', { flag: true });
 */
function myFunction(param1, options = {}) {
    // implementazione
}
```

### CSS

```css
/* ✅ BUONO */
.my-class {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

/* Usa CSS variables */
:root {
    --color-primary: #10a37f;
}

/* ❌ CATTIVO */
.myClass{
    display:flex;
    flex-direction:column;
    gap:16px
}
```

#### Regole CSS

- **Naming**: `kebab-case` per classi
- **Specificità**: Evita selettori troppo specifici
- **Organizzazione**: Raggruppa proprietà correlate
- **Variables**: Usa CSS variables per colori, spacing, timing
- **Responsive**: Mobile-first approach

### HTML

```html
<!-- ✅ BUONO -->
<button 
    id="my-btn" 
    class="action-btn" 
    aria-label="Descrizione accessibile"
    type="button"
>
    Testo
</button>

<!-- ❌ CATTIVO -->
<button id=myBtn class=actionBtn onclick="doSomething()">Testo</button>
```

#### Regole HTML

- **Semantic tags**: Usa `<main>`, `<nav>`, `<article>`, ecc.
- **Accessibility**: Sempre attributi ARIA appropriati
- **Indentazione**: 4 spazi
- **Quotes**: Double quotes `"` per attributi
- **Closing tags**: Sempre, anche per void elements quando sensato

## Commit Messages

Seguiamo **Conventional Commits**.

### Format

```
tipo(scope): descrizione breve

Corpo opzionale più dettagliato.

Footer opzionale.
```

### Tipi

- `feat`: Nuova feature
- `fix`: Bug fix
- `docs`: Solo documentazione
- `style`: Formattazione (no cambio codice)
- `refactor`: Refactoring
- `perf`: Performance improvement
- `test`: Aggiunta/modifica test
- `chore`: Manutenzione (build, deps, ecc.)

### Esempi

```bash
# Feature
git commit -m "feat(animation): add typing speed variation"

# Bug fix
git commit -m "fix(state): resolve localStorage persistence issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(config)!: change default typing speed

BREAKING CHANGE: typingSpeed default changed from 50ms to 30ms"
```

### Best Practices

- ✅ Usa imperativo: "add" non "added" o "adds"
- ✅ Prima riga max 72 caratteri
- ✅ Riferisci issue quando applicabile: `fixes #123`
- ✅ Spiega COSA e PERCHÉ, non come
- ❌ Evita commit generici: "fix bug", "update code"

## Pull Request Process

### Before Opening PR

1. ✅ Codice lintato e formattato
2. ✅ Test passano: `npm test`
3. ✅ E2E test passano: `npm run test:e2e`
4. ✅ Documentazione aggiornata
5. ✅ Changelog aggiornato (se applicabile)
6. ✅ Branch aggiornato con main: `git rebase upstream/main`

### Opening PR

1. **Titolo chiaro** seguendo Conventional Commits
2. **Descrizione dettagliata** con template:

```markdown
## Cosa

Breve descrizione del cambiamento.

## Perché

Motivazione per il cambiamento.

## Come

Come è stato implementato.

## Testing

Come testare i cambiamenti.

## Screenshots

(Se applicabile)

## Checklist

- [ ] Codice lintato
- [ ] Test aggiunti/aggiornati
- [ ] Documentazione aggiornata
- [ ] Changelog aggiornato
```

3. **Link issue** se risolve: `Fixes #123`
4. **Request review** da maintainer

### Review Process

- I maintainer revieweranno entro 3-5 giorni
- Potrebbero richiedere modifiche
- Sii paziente e rispettoso
- Rispondi a tutti i commenti
- Una volta approvato, verrà fatto merge

### After Merge

```bash
# Aggiorna il tuo fork
git checkout main
git pull upstream main
git push origin main

# Elimina branch
git branch -d feature/nome-feature
git push origin --delete feature/nome-feature
```

## Reporting Bugs

### Template Bug Report

```markdown
**Descrizione Bug**
Descrizione chiara e concisa del bug.

**Steps to Reproduce**
1. Vai su '...'
2. Clicca su '...'
3. Scrolla fino a '...'
4. Vedi errore

**Comportamento Atteso**
Cosa ti aspettavi che succedesse.

**Comportamento Attuale**
Cosa è successo invece.

**Screenshots**
Se applicabile, aggiungi screenshots.

**Ambiente**
- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 120]
- Versione: [e.g. 2.0.0]

**Console Errors**
```
Paste console errors here
```

**Contesto Aggiuntivo**
Qualsiasi altro contesto.
```

### Severità

- 🔴 **Critical**: App non funziona, dati persi
- 🟠 **High**: Feature importante non funziona
- 🟡 **Medium**: Feature secondaria non funziona
- 🟢 **Low**: Problema minore, UI glitch

## Suggerire Nuove Feature

### Template Feature Request

```markdown
**Feature richiesta**
Descrizione chiara e concisa della feature.

**Problema da Risolvere**
Quale problema risolverebbe questa feature?

**Soluzione Proposta**
Come vorresti che fosse implementata?

**Alternative Considerate**
Quali alternative hai considerato?

**Contesto Aggiuntivo**
Screenshots, mockup, esempi.
```

## Testing

### Scrivere Test

#### Unit Test

```javascript
// __tests__/my-module.test.js
describe('MyModule', () => {
    test('should do something', () => {
        const result = myFunction(input);
        expect(result).toBe(expected);
    });
});
```

#### E2E Test

```javascript
// __tests__/e2e/my-feature.spec.js
test('should complete user flow', async ({ page }) => {
    await page.goto('/');
    await page.click('#my-btn');
    await expect(page.locator('.result')).toBeVisible();
});
```

### Coverage Requirement

- Nuovo codice deve avere >70% coverage
- Test critici devono passare al 100%
- E2E test per flussi utente principali

## Domande?

- 💬 Apri una Discussion su GitHub
- 📧 Contatta i maintainer
- 📖 Leggi il README completo

---

**Grazie per contribuire! 🎉**

Il tuo aiuto rende questo progetto migliore per tutti.

