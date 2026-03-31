import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RocketLogo, ANTHERA_LOGO_URL } from '../components/Icons';
import ThemeToggle from '../components/ThemeToggle';

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState(null);

  const features = [
    { 
      icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
      title: 'Dashboard in tempo reale',
      desc: 'Chi è presente, chi è assente, saldi aggiornati. Tutto a colpo d\'occhio.'
    },
    { 
      icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
      title: 'Gestione multi-ruolo',
      desc: 'Admin, manager e dipendenti con permessi separati e personalizzabili.'
    },
    { 
      icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      title: 'Calendario condiviso',
      desc: 'Visualizza le assenze del team su calendario mensile. Mai più sovrapposizioni.'
    },
    { 
      icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>,
      title: 'Tipi assenza personalizzabili',
      desc: 'Ferie, permessi, malattia, maternità e molto altro. Configura come vuoi.'
    },
    { 
      icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
      title: 'Statistiche e report',
      desc: 'Export CSV, grafici di utilizzo, trend annuali. Dati sempre a portata di mano.'
    },
    { 
      icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      title: 'Sicurezza enterprise',
      desc: 'JWT HttpOnly, bcrypt, rate limiting, GDPR compliant. I tuoi dati sono al sicuro.'
    },
  ];

  const useCases = [
    {
      title: 'Piccole imprese, grandi risparmi',
      audience: 'PMI 10-50 dipendenti',
      desc: 'Dì addio ai fogli Excel. Tieni traccia di ferie, permessi e malattie di tutto il team da un\'unica dashboard.',
      icon: '🏢'
    },
    {
      title: 'Tutto sotto controllo, sempre',
      audience: 'HR Manager',
      desc: 'Approva o rifiuta richieste in un click. Visualizza chi è assente oggi e pianifica il lavoro senza sorprese.',
      icon: '👔'
    },
    {
      title: 'Richiedi ferie in 30 secondi',
      audience: 'Dipendenti',
      desc: 'Nessun modulo cartaceo, nessuna email. Richiedi, monitora lo stato e consulta i tuoi saldi direttamente dall\'app.',
      icon: '🙋'
    },
  ];

  const steps = [
    { num: '1', title: 'Registra la tua azienda', desc: 'Crea l\'account admin in 60 secondi, aggiungi i tuoi dipendenti' },
    { num: '2', title: 'Configura le regole', desc: 'Imposta i giorni di ferie, le chiusure aziendali, i tipi di assenza' },
    { num: '3', title: 'Inizia a gestire', desc: 'I dipendenti fanno richiesta, tu approvi con un click' },
  ];

  const faqs = [
    { q: 'È gratuito?', a: 'PowerLeave è attualmente in fase beta aperta. Registrati ora e accedi a tutte le funzionalità gratuitamente.' },
    { q: 'Quanti dipendenti posso gestire?', a: 'Fino a 500 dipendenti per organizzazione. Per esigenze enterprise contattaci.' },
    { q: 'I miei dati sono al sicuro?', a: 'Sì. I dati sono isolati per organizzazione (multi-tenancy), protetti con crittografia bcrypt e conformi al GDPR.' },
    { q: 'Posso esportare i dati?', a: 'Sì, puoi esportare tutte le richieste in formato CSV in qualsiasi momento.' },
    { q: 'Funziona su mobile?', a: 'PowerLeave è responsive e funziona su qualsiasi dispositivo — desktop, tablet e smartphone.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: '1px solid var(--border)',
        background: 'var(--card)', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <RocketLogo size={36} />
          <span style={{ fontWeight: 700, fontSize: '20px' }}>PowerLeave</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ThemeToggle />
          <Link to="/login" data-testid="nav-login" style={{
            padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
            color: 'var(--foreground)', border: '1px solid var(--border)',
            fontSize: '14px', fontWeight: 500,
          }}>Accedi</Link>
          <Link to="/register" data-testid="nav-register" style={{
            padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
            color: 'white', background: 'var(--primary)',
            fontSize: '14px', fontWeight: 500,
          }}>Inizia Gratis</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '80px 24px 60px', textAlign: 'center', maxWidth: '900px', margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: '20px',
          background: 'rgba(59, 130, 246, 0.1)', fontSize: '13px', fontWeight: 600,
          marginBottom: '24px', color: 'var(--primary)', border: '1px solid rgba(59, 130, 246, 0.2)',
        }}>
          ✨ Gestione ferie semplificata per le PMI italiane
        </div>
        
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
          Gestisci le ferie del tuo team{' '}
          <span style={{ 
            background: 'linear-gradient(135deg, var(--primary), #8B5CF6)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>in 2 minuti</span>
        </h1>
        
        <p style={{
          fontSize: '18px', color: 'var(--muted-foreground)',
          maxWidth: '650px', margin: '0 auto 40px', lineHeight: 1.7,
        }}>
          PowerLeave è il sistema di gestione assenze pensato per le PMI italiane. 
          <strong style={{ color: 'var(--foreground)' }}> Semplice, veloce, conforme.</strong>
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
          <Link to="/register" data-testid="hero-cta-primary" style={{
            padding: '16px 32px', borderRadius: '12px', textDecoration: 'none',
            color: 'white', background: 'var(--primary)',
            fontSize: '16px', fontWeight: 600, boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}>Inizia Gratis</Link>
          <Link to="/login" data-testid="hero-cta-secondary" style={{
            padding: '16px 32px', borderRadius: '12px', textDecoration: 'none',
            color: 'var(--foreground)', border: '2px solid var(--border)',
            fontSize: '16px', fontWeight: 500, background: 'var(--card)',
          }}>
            Guarda la Demo
            <span style={{ marginLeft: '8px', fontSize: '12px', opacity: 0.7 }}>admin@demo.it / demo123</span>
          </Link>
        </div>

        {/* Dashboard Mockup */}
        <div style={{
          background: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)',
          padding: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', maxWidth: '800px', margin: '0 auto',
        }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22C55E' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px' }}>
            {/* Sidebar */}
            <div style={{ background: 'var(--muted)', borderRadius: '8px', padding: '12px' }}>
              {['Dashboard', 'Calendario', 'Richieste', 'Team', 'Statistiche'].map((item, i) => (
                <div key={i} style={{ 
                  padding: '8px 12px', borderRadius: '6px', marginBottom: '4px', fontSize: '13px',
                  background: i === 0 ? 'var(--primary)' : 'transparent',
                  color: i === 0 ? 'white' : 'var(--muted-foreground)',
                }}>{item}</div>
              ))}
            </div>
            {/* Content */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'Approvate', value: '12', color: '#22C55E' },
                  { label: 'In Attesa', value: '3', color: '#F59E0B' },
                  { label: 'Staff', value: '8/8', color: '#3B82F6' },
                  { label: 'Utilizzo', value: '45%', color: '#8B5CF6' },
                ].map((stat, i) => (
                  <div key={i} style={{ background: 'var(--muted)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{stat.label}</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--muted)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Richieste in Attesa</div>
                {['Mario Bianchi — Ferie', 'Anna Verdi — Permesso'].map((req, i) => (
                  <div key={i} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '12px',
                  }}>
                    <span>{req}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#22C55E', color: 'white', fontSize: '10px' }}>Approva</span>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#EF4444', color: 'white', fontSize: '10px' }}>Rifiuta</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ padding: '40px 24px', background: 'var(--muted)' }}>
        <div style={{ 
          maxWidth: '900px', margin: '0 auto', 
          display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap',
          textAlign: 'center',
        }}>
          {[
            { value: '500+', label: 'Dipendenti gestibili' },
            { value: '1 click', label: 'Per approvare' },
            { value: '100%', label: 'GDPR Compliant' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>
            Per chi è PowerLeave?
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
            Che tu sia un imprenditore, un HR manager o un dipendente, PowerLeave semplifica la gestione delle assenze.
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {useCases.map((uc, i) => (
              <div key={i} style={{
                padding: '32px 24px', borderRadius: '16px', background: 'var(--card)',
                border: '1px solid var(--border)', textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{uc.icon}</div>
                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{uc.audience}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{uc.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', background: 'var(--muted)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 700, marginBottom: '48px' }}>
            Funzionalità Principali
          </h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                padding: '24px', borderRadius: '12px', background: 'var(--card)',
                border: '1px solid var(--border)',
              }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '12px', 
                  background: 'rgba(59, 130, 246, 0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)', marginBottom: '16px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 700, marginBottom: '48px' }}>
            Come Funziona
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                  background: 'var(--primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', fontWeight: 700,
                }}>
                  {step.num}
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>{step.title}</h3>
                  <p style={{ fontSize: '15px', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', background: 'var(--muted)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 700, marginBottom: '48px' }}>
            Domande Frequenti
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{
                    width: '100%', padding: '20px 24px', border: 'none', background: 'transparent',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>{faq.q}</span>
                  <span style={{ 
                    fontSize: '20px', color: 'var(--muted-foreground)',
                    transform: faqOpen === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}>+</span>
                </button>
                {faqOpen === i && (
                  <div style={{ padding: '0 24px 20px', color: 'var(--muted-foreground)', fontSize: '15px', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
          Pronto a semplificare la gestione ferie?
        </h2>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: '32px', fontSize: '18px' }}>
          Unisciti alle aziende che hanno già scelto PowerLeave
        </p>
        <Link to="/register" data-testid="cta-final" style={{
          display: 'inline-block', padding: '18px 48px', borderRadius: '12px', textDecoration: 'none',
          color: 'white', background: 'var(--primary)',
          fontSize: '18px', fontWeight: 600, boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
        }}>
          Registrati Gratis
        </Link>
        <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--muted-foreground)' }}>
          Nessuna carta di credito richiesta
        </p>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '48px 24px 32px', borderTop: '1px solid var(--border)',
        background: 'var(--card)',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <RocketLogo size={32} />
                <span style={{ fontWeight: 700, fontSize: '18px' }}>PowerLeave</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', maxWidth: '300px' }}>
                Gestione ferie e assenze semplificata per le PMI italiane.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '12px', fontSize: '14px' }}>Prodotto</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link to="/login" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '14px' }}>Dashboard</Link>
                  <Link to="/login" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '14px' }}>Login</Link>
                  <Link to="/register" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '14px' }}>Registrati</Link>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '12px', fontSize: '14px' }}>Azienda</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="https://antherasystems.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '14px' }}>Anthera Systems</a>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>Privacy Policy</span>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>Termini di Servizio</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
              © {new Date().getFullYear()} PowerLeave by Anthera. Tutti i diritti riservati.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Powered by</span>
              <img 
                src={ANTHERA_LOGO_URL} 
                alt="Anthera" 
                style={{ height: '20px', objectFit: 'contain' }} 
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
