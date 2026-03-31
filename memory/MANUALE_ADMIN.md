# PowerLeave — Manuale Amministratore

Guida completa per gli amministratori di PowerLeave.

---

## 1. Panoramica Ruoli

### Ruoli disponibili

| Ruolo | Permessi |
|-------|----------|
| **Admin** | Accesso completo: gestione team, approvazioni, configurazioni, statistiche |
| **User** | Solo richieste proprie, visualizzazione saldi personali |

---

## 2. Gestione Team

### Invitare un nuovo dipendente

1. Vai alla sezione **Team** dal menu laterale
2. Clicca il pulsante **"+ Invita"**
3. Compila il modulo:

| Campo | Descrizione |
|-------|-------------|
| **Nome completo** | Nome e cognome del dipendente |
| **Email** | Email aziendale (deve essere unica) |
| **Ruolo** | "user" per dipendente, "admin" per amministratore |

4. Clicca **"Invita"**

### Dopo l'invito

- Viene generata una **password temporanea**
- Un modale mostra la password — **copiala subito!**
- Comunica la password al dipendente (di persona, telefono, chat sicura)
- Al primo login, il dipendente dovrà impostare una nuova password

⚠️ **Importante**: La password temporanea viene mostrata UNA SOLA VOLTA. Non è recuperabile.

### Visualizzare il team

La pagina Team mostra tutti i dipendenti con:
- Nome ed email
- Ruolo (admin/user)
- Saldi ferie correnti

### Rimuovere un dipendente

1. Trova il dipendente nella lista
2. Clicca l'icona 🗑️ (cestino)
3. Conferma l'eliminazione

⚠️ L'eliminazione è permanente. Le richieste storiche restano nel sistema.

---

## 3. Approvare/Rifiutare Richieste

### Dove trovare le richieste pendenti

- **Dashboard** — Sezione "Richieste in Attesa"
- **Richieste** — Filtro "In attesa"

### Procedura di approvazione

1. Trova la richiesta da gestire
2. Esamina: dipendente, tipo assenza, periodo, note
3. Clicca:
   - ✅ **Approva** — La richiesta viene approvata, il saldo decrementato
   - ❌ **Rifiuta** — La richiesta viene rifiutata, nessun impatto sui saldi

### Best practice

- Controlla il calendario prima di approvare (sovrapposizioni?)
- Verifica che il dipendente abbia saldo sufficiente
- In caso di dubbio, contatta il dipendente prima di rifiutare

---

## 4. Chiusure Aziendali

### Tipi di chiusure

| Tipo | Descrizione |
|------|-------------|
| **holiday** | Festività nazionale (es. Natale, Pasqua) |
| **closure** | Chiusura aziendale (es. Agosto, ponti) |

### Creare una chiusura

1. Vai alla sezione **Chiusure** dal menu
2. Clicca **"+ Nuova Chiusura"**
3. Compila:

| Campo | Descrizione |
|-------|-------------|
| **Data inizio** | Primo giorno di chiusura |
| **Data fine** | Ultimo giorno di chiusura |
| **Motivo** | Es. "Chiusura estiva", "Ponte 25 aprile" |
| **Tipo** | holiday o closure |

4. Clicca **"Salva"**

### Gestire le eccezioni (Deroghe)

Se un dipendente deve lavorare durante una chiusura:

1. Vai ai dettagli della chiusura
2. Nella sezione "Eccezioni", clicca **"+ Aggiungi eccezione"**
3. Seleziona il dipendente
4. Aggiungi una nota (opzionale)
5. Salva

Il dipendente escluso potrà richiedere ferie in quei giorni.

### Festività precaricate

Al setup, vengono create automaticamente le festività italiane 2026:
- Capodanno, Epifania, Pasqua, Pasquetta
- 25 Aprile, 1 Maggio, 2 Giugno
- Ferragosto, Ognissanti
- Immacolata, Natale, Santo Stefano

---

## 5. Tipi di Assenza

### Tipi predefiniti

| ID | Nome | Colore | Giorni/anno |
|----|------|--------|-------------|
| ferie | Ferie | 🟢 Verde | 26 |
| permesso | Permesso | 🔵 Blu | 32 |
| malattia | Malattia | 🔴 Rosso | 180 |
| maternita | Maternità/Paternità | 🟣 Viola | 150 |

### Personalizzazione

Attualmente i tipi sono configurabili solo via database. Contatta il supporto tecnico per:
- Aggiungere nuovi tipi
- Modificare i giorni annuali
- Cambiare i colori

---

## 6. Statistiche e Report

### Dashboard Statistiche

La sezione **Statistiche** mostra:

#### KPI principali
- Totale richieste
- Richieste approvate/pendenti/rifiutate
- Tasso di utilizzo ferie (%)

#### Grafici interattivi
- **Grafico a barre**: Ferie per mese (ultimi 12 mesi)
- **Grafico a torta**: Distribuzione per tipo assenza
- **Grafico lineare**: Trend utilizzo cumulativo

#### Tabella saldi team
Vista completa dei saldi di tutti i dipendenti, suddivisi per tipo assenza.

### Export CSV

Per esportare i dati:

1. Vai a **Statistiche** o **Richieste**
2. Clicca **"Esporta CSV"**
3. Il file contiene:
   - Nome dipendente
   - Tipo assenza
   - Date inizio/fine
   - Giorni
   - Status
   - Approvato da

### Utilizzo report

I CSV sono compatibili con:
- Microsoft Excel
- Google Sheets
- Software paghe (import CSV)
- Consulente del lavoro

---

## 7. Bacheca Annunci

### Creare un annuncio

1. Vai alla sezione **Bacheca**
2. Clicca **"+ Nuovo Annuncio"**
3. Compila:

| Campo | Descrizione |
|-------|-------------|
| **Titolo** | Titolo breve e chiaro |
| **Contenuto** | Testo dell'annuncio |
| **Priorità** | normal / high (high = evidenziato in rosso) |

4. Clicca **"Pubblica"**

### Gestire gli annunci

- Gli annunci sono visibili a tutti i dipendenti
- Puoi modificare o eliminare annunci esistenti
- Usa priorità "high" solo per comunicazioni urgenti

---

## 8. Impostazioni Organizzazione

### Accesso

Vai alla sezione **Impostazioni** dal menu laterale.

### Configurazioni disponibili

| Impostazione | Descrizione |
|--------------|-------------|
| **Nome organizzazione** | Nome visualizzato nell'app |
| **Regole ferie** | Configurazioni future (roadmap) |

### Regole future (roadmap)

- Preavviso minimo per richieste
- Massimo giorni consecutivi
- Blackout periods
- Approvazione multi-livello

---

## 9. Sicurezza

### Best practice

1. **Password sicure** — Imponi password complesse (min 8 char + numero)
2. **Non condividere credenziali** — Ogni utente ha il suo account
3. **Revoca accessi** — Rimuovi subito ex-dipendenti
4. **HTTPS** — Assicurati che l'URL usi HTTPS

### Cosa monitora il sistema

- Rate limiting: Max 10 tentativi login/minuto per IP
- Password hashing: bcrypt (non reversibile)
- Sessioni: JWT con scadenza 7 giorni
- Cookie: HttpOnly, Secure, SameSite

---

## 10. Troubleshooting

### Problemi comuni

| Problema | Soluzione |
|----------|-----------|
| Utente non riesce a loggarsi | Verifica email corretta, resetta password |
| Saldi non corretti | Controlla richieste approvate, ricalcola |
| Richiesta non visibile | Verifica filtri, controlla org_id |
| Export CSV vuoto | Verifica che ci siano dati nel range |

### Log e debug

Per problemi tecnici, contatta il supporto con:
- Screenshot dell'errore
- Passi per riprodurre
- Browser e versione
- Timestamp approssimativo

---

## 11. Checklist Setup Iniziale

Quando configuri PowerLeave per la prima volta:

- [ ] Accedi con credenziali admin iniziali
- [ ] Cambia la password admin
- [ ] Verifica le festività precaricate
- [ ] Aggiungi chiusure aziendali (es. agosto)
- [ ] Invita i dipendenti
- [ ] Comunica le credenziali in modo sicuro
- [ ] Pubblica un annuncio di benvenuto
- [ ] Forma i dipendenti sull'uso base

---

## 12. Supporto Tecnico

### Contatti

- 📧 **Email**: supporto@antherasystems.com
- 📚 **Documentazione**: Questo manuale + README tecnico
- 🐛 **Bug report**: GitHub Issues (se open source)

### Informazioni da fornire

Quando contatti il supporto, includi:
1. Nome organizzazione
2. Descrizione problema
3. Passi per riprodurre
4. Screenshot (se applicabile)
5. Browser/dispositivo

---

*Manuale Amministratore PowerLeave v1.0 — Marzo 2026*
