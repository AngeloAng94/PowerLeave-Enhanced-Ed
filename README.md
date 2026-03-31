# PowerLeave

**Gestione ferie e permessi per team moderni**

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)
![CI](https://img.shields.io/badge/CI-passing-brightgreen?logo=github-actions)

---

## Descrizione

PowerLeave è un sistema completo per la gestione delle ferie, permessi e assenze aziendali. Offre una dashboard intuitiva, approvazioni rapide, analytics avanzate con grafici interattivi, AI-powered suggestions e supporto multi-tenant per organizzazioni di qualsiasi dimensione.

---

## Stack Tecnologico

| Layer | Tecnologia | Versione |
|-------|------------|----------|
| Backend | FastAPI (Python) | 3.11 |
| Database | MongoDB | 6.0 |
| Frontend | React | 18.x |
| Grafici | Recharts | 2.x |
| AI | litellm + GPT-4o-mini | - |
| Autenticazione | JWT (HttpOnly Cookie) | - |
| Styling | Tailwind CSS | 3.x |
| CI/CD | GitHub Actions | ✅ |

---

## Funzionalità Principali

- **Richieste Ferie**: Creazione e gestione richieste con validazione date
- **Approvazioni**: Workflow di approvazione/rifiuto per manager
- **Saldi Ferie**: Tracking automatico dei giorni disponibili/usati
- **Calendario**: Visualizzazione mensile delle assenze del team
- **Chiusure Aziendali**: Gestione festività e chiusure con sistema deroghe
- **Bacheca Annunci**: Comunicazioni interne per il team
- **Analytics**: Dashboard con grafici Recharts interattivi
- **Export CSV**: Esportazione report richieste e statistiche
- **AI Suggestions**: Suggerimento automatico tipo assenza basato sulle note (GPT-4o-mini)
- **AI Insights**: Analisi team, conflitti, capacità settimanale
- **AI Monthly Report**: Riepilogo narrativo mensile generato da AI
- **Multi-tenant**: Supporto per più organizzazioni
- **Dark/Light Mode**: Tema personalizzabile

---

## CI/CD Status

✅ **GitHub Actions: Backend + Frontend PASSING**

La pipeline CI verifica:
- Lint Python (ruff)
- Test suite backend (pytest, 36+ test)
- Build frontend (React)
- Lockfile integrity (yarn.lock)

---

## Struttura del Progetto

```
powerleave/
├── backend/
│   ├── server.py          # Entry point FastAPI
│   ├── models.py          # Modelli Pydantic
│   ├── auth.py            # Autenticazione JWT
│   ├── database.py        # Connessione MongoDB
│   ├── ai_service.py      # AI features (litellm)
│   ├── email_service.py   # Email SendGrid (opzionale)
│   ├── seed.py            # Dati demo
│   ├── routes/            # API endpoints
│   │   ├── auth.py
│   │   ├── leave.py
│   │   ├── team.py
│   │   ├── ai.py          # AI endpoints
│   │   └── ...
│   ├── tests/             # Test suite (36+ test)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── pages/         # Componenti pagina
│   │   ├── components/    # Componenti riutilizzabili
│   │   │   ├── AIInsightsWidget.js
│   │   │   ├── AILeaveTypeSuggestion.js
│   │   │   ├── AIMonthlyReport.js
│   │   │   └── ...
│   │   └── context/       # React Context
│   ├── package.json
│   ├── yarn.lock          # ✅ Committato
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── .github/workflows/ci.yml
└── README.md
```

---

## Come Avviare in Locale

### Con Docker (Consigliato)

**Prerequisiti**: Docker e Docker Compose installati

```bash
# Clona il repository
git clone https://github.com/your-repo/powerleave.git
cd powerleave

# Copia e configura le variabili d'ambiente
cp .env.example .env
# Modifica .env con le tue configurazioni (soprattutto SECRET_KEY)

# Avvia tutti i servizi
docker-compose up --build

# L'applicazione sarà disponibile su:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8001
# API Docs: http://localhost:8001/docs
```

### Senza Docker

**Prerequisiti**: Python 3.11+, Node.js 18+, MongoDB 6.0+

#### Backend

```bash
cd backend

# Crea ambiente virtuale
python -m venv venv
source venv/bin/activate  # Linux/Mac
# oppure: venv\Scripts\activate  # Windows

# Installa dipendenze
pip install -r requirements.txt

# Configura variabili d'ambiente
export MONGO_URL="mongodb://localhost:27017"
export DB_NAME="powerleave"
export SECRET_KEY="your-secret-key-min-32-chars"

# (Opzionale) Per AI features
export OPENAI_API_KEY="sk-..."

# Avvia il server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

#### Frontend

```bash
cd frontend

# Installa dipendenze
yarn install

# Configura variabili d'ambiente
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env

# Avvia in development
yarn start
```

---

## Configurazione AI (Opzionale)

PowerLeave include funzionalità AI opzionali powered by GPT-4o-mini:

| Feature | Descrizione |
|---------|-------------|
| **Suggest Leave Type** | Suggerisce il tipo di assenza basato sulle note |
| **Team Insights** | Analisi conflitti, capacità, dipendenti a rischio |
| **Monthly Report** | Riepilogo narrativo mensile generato da AI |

### Configurazione

**Su piattaforma Emergent:**
```bash
# Automatico - usa EMERGENT_LLM_KEY
```

**Su ambienti esterni (AWS, Azure, Railway, Render, ecc.):**
```bash
# backend/.env
OPENAI_API_KEY=sk-your-openai-api-key
```

**Senza chiave AI:**
Le funzionalità AI vengono disabilitate silenziosamente. Il resto dell'applicazione funziona normalmente.

---

## Credenziali Demo

Al primo avvio vengono creati automaticamente degli utenti demo:

| Email | Password | Ruolo |
|-------|----------|-------|
| admin@demo.it | demo123 | Admin |
| mario@demo.it | demo123 | User |
| anna@demo.it | demo123 | User |
| luigi@demo.it | demo123 | User |

---

## Testing

```bash
cd backend

# Esegui tutti i test
pytest tests/test_powerleave_api.py -v

# Risultato atteso: 36 passed ✅
```

---

## Deploy

PowerLeave è deployabile su qualsiasi ambiente cloud standard:

| Provider | Supportato |
|----------|------------|
| AWS (ECS, EKS) | ✅ |
| Azure (Container Apps) | ✅ |
| Google Cloud Run | ✅ |
| Railway | ✅ |
| Render | ✅ |
| DigitalOcean App Platform | ✅ |
| Self-hosted (Docker) | ✅ |

### Produzione con Gunicorn

Il Dockerfile backend usa Gunicorn con 4 workers per produzione:

```dockerfile
CMD ["gunicorn", "server:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8001"]
```

---

## Documentazione API

La documentazione OpenAPI è disponibile su:
- **Swagger UI**: `http://localhost:8001/docs`
- **ReDoc**: `http://localhost:8001/redoc`

### Endpoint AI

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/api/ai/status` | GET | Verifica se AI è abilitato |
| `/api/ai/suggest-leave-type` | POST | Suggerisce tipo assenza |
| `/api/ai/team-insights` | GET | Insights team (admin) |
| `/api/ai/monthly-report/{year}/{month}` | GET | Report mensile AI (admin) |

---

## Documentazione Tecnica

Per dettagli sull'architettura, debito tecnico e roadmap di sviluppo, consulta:
- [`AUDIT_TECNICO_POWERLEAVE_v2.md`](./AUDIT_TECNICO_POWERLEAVE_v2.md)

Per documentazione commerciale:
- [`memory/PITCH_POWERLEAVE.md`](./memory/PITCH_POWERLEAVE.md)
- [`memory/MANUALE_UTENTE.md`](./memory/MANUALE_UTENTE.md)
- [`memory/MANUALE_ADMIN.md`](./memory/MANUALE_ADMIN.md)

---

## License

MIT License - vedi [LICENSE](./LICENSE) per dettagli.

---

**Powered by [Anthera](https://antherasystems.com) — Empowering Intelligent Systems**
