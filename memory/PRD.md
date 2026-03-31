# PowerLeave - Product Requirements Document

## Original Problem Statement
Sistema di gestione ferie per aziende italiane con design moderno, configurabile dalle aziende. Trasformare il progetto GitHub PowerLeave in un'applicazione SaaS production-ready.

## Architecture
- **Frontend**: React 18 + CSS Custom + Sonner + React.lazy (code splitting)
- **Backend**: FastAPI modulare (14 file) + MongoDB (Motor async) + slowapi
- **Auth**: JWT + Google OAuth (predisposto via Emergent)
- **Theme**: Light/Dark mode con persistenza localStorage (default: dark)

## Demo Users
| Email | Password | Ruolo |
|-------|----------|-------|
| admin@demo.it | demo123 | Admin |
| mario@demo.it | demo123 | User |
| anna@demo.it | demo123 | User |
| luigi@demo.it | demo123 | User |

## What's Been Implemented

### Session 10 - 31 Mar 2026 (Production Ready + Commercial + AI)
- **Grafici Recharts** - BarChart (12 mesi), PieChart (distribuzione tipo), AreaChart (trend cumulativo)
- **Export CSV** - Pulsante in StatsPage e RequestsPage con export frontend-only
- **Email SendGrid** - Modulo email_service.py con send_invite_email e send_leave_status_email
- **Multi-worker Docker** - Gunicorn con 4 workers UvicornWorker
- **Landing Page Commerciale** - Hero, Use Cases, Features, FAQ, Footer professionale
- **Documentazione Commerciale** - PITCH_POWERLEAVE.md, MANUALE_UTENTE.md, MANUALE_ADMIN.md
- **AI Layer con GPT-4o-mini**:
  - POST /api/ai/suggest-leave-type: suggerimento tipo assenza basato su note
  - GET /api/ai/team-insights: analisi locale conflitti, capacità, rischi
  - GET /api/ai/monthly-report: report narrativo mensile generato da AI
- **Audit Tecnico aggiornato** - Appendice M (Production Ready)
- **Test**: 36/36 backend passed + UI verificata con screenshot

### Session 9 - 27 Feb / 2 Mar 2026 (Bug Fix + S04/S02 Verification)
- **FIX CRITICO: Dashboard crash risolto** - Variabile `currentPage` non definita sostituita con `section`
- **Verifica S04 completa** - Flusso invito utenti già implementato e funzionante
- **Verifica S02 completa** - JWT rimosso da localStorage, autenticazione solo via HttpOnly cookie
- **Test aggiunti**: `test_change_password_wrong_current`, `test_change_password_weak_new`
- **Audit Tecnico aggiornato** - Appendice G, H, I
- **Test**: 36/36 backend passed + UI verificata con screenshot

### Session 8 - 20 Feb 2026 (UI/UX Fix + Date Validation + Task Completati)
- **Dark mode ripristinato come default** - ThemeToggle ora usa dark mode quando non c'è preferenza salvata
- **Logo originale ripristinato** - Immagine razzo al posto dell'icona SVG "P"
- **Logo Anthera integrato** - Nuovo branding PowerLeave by Anthera
- **ThemeToggle aggiunto a tutte le pagine** - Landing, Login, Register ora hanno il toggle tema
- **Branding corretto** - Rimosso "PMI Italiane", ora dice "Workforce Intelligence"
- **Link home su Login/Register** - Logo cliccabile per tornare alla landing
- **FIX CRITICO: Validazione date richieste ferie** - Aggiunta validazione doppia (frontend + backend)
- **P0-1: response_model su tutti gli endpoint FastAPI** - 30+ endpoint con documentazione OpenAPI completa
- **P1: Dockerizzazione completa** - Dockerfile backend, frontend, docker-compose.yml, .env.example
- **P2: README.md professionale** - Documentazione completa con istruzioni setup
- **Test suite**: 33/33 passed
- **Audit v2 aggiornato** - Aggiunte Appendice B, C, D, E

### Session 7 - 19 Feb 2026 (Structural Refactoring)
- Audit v2 tabelle sincronizzate con fix applicati
- Backend: server.py (1489→77 righe) refactored in 14 moduli (config, models, auth, database, seed, 8 route files)
- Frontend: App.js (3533→57 righe) refactored in 20+ file (pages/*, components/*, context/*, lib/*)
- React.lazy code splitting su 5 pagine (StatsPage, CalendarPage, SettingsPage, AnnouncementsPage, ClosuresPage)
- Test: 30/30 backend + 100% frontend (testing agent iteration 5)

### Session 6 - 18 Feb 2026 (P0 Security & Fixes)
- SECRET_KEY fail-fast, rate limiting 10/min, temp_password rimossa dalla API
- Schema company_closures unificato (date→start_date/end_date)
- Indici MongoDB aggiunti, paginazione, validazione password, datetime UTC, CORS ristretto
- Test suite riscritta: 23 test idempotenti

### Sessions 1-5 (Previous)
- Auth JWT, Dashboard, Calendario, Richieste, Bacheca, Chiusure
- Analytics Dashboard, Notifiche push, Impostazioni (4 tab)
- Dark mode, Sidebar moderna, Fix contrasti
- Audit tecnici v1 e v2

## Current Code Structure
```
backend/ (14 file)
├── server.py (77 righe - wiring)
├── config.py, models.py, auth.py, database.py, seed.py
└── routes/ (auth, leave, stats, calendar, team, organization, announcements, closures)

frontend/src/ (20+ file)
├── App.js (57 righe - wiring)
├── lib/api.js, context/AuthContext.js, context/NotificationContext.js
├── components/ (Icons, ThemeToggle)
└── pages/ (13 page files with React.lazy for 5)
```

## Next Tasks (P0)
- [x] ~~Dashboard crash fix (currentPage → section)~~ ✅
- [x] ~~Grafici Recharts~~ ✅
- [x] ~~Export CSV~~ ✅
- [x] ~~Email SendGrid (opzionale)~~ ✅
- [x] ~~Multi-worker Gunicorn~~ ✅
- [x] ~~Landing Page Commerciale~~ ✅
- [x] ~~Documentazione Commerciale~~ ✅
- [x] ~~AI Layer (GPT-4o-mini)~~ ✅

## AI Features
- `POST /api/ai/suggest-leave-type` - Suggerisce tipo assenza dalle note
- `GET /api/ai/team-insights` - Analisi locale team (conflitti, capacità, rischi)
- `GET /api/ai/monthly-report/{year}/{month}` - Report narrativo AI

## Upcoming Tasks (P1)
- [ ] Test Docker setup (docker-compose up)
- [ ] Verificare ZIP progetto con utente

## Future (P2-P3)
- [ ] Google Calendar integration
- [ ] Outlook Calendar integration
- [ ] App mobile (iOS/Android)
- [ ] Notifiche push browser
- [ ] Multi-livello approvazioni
- [ ] API pubblica
- [ ] White-label

## Commercial Documentation
- `/app/memory/PITCH_POWERLEAVE.md` - Mini pitch deck
- `/app/memory/MANUALE_UTENTE.md` - Manuale dipendenti
- `/app/memory/MANUALE_ADMIN.md` - Manuale amministratori
