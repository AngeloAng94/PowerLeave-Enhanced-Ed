import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { NotificationService } from '../context/NotificationContext';
import { Icons } from '../components/Icons';

export default function TeamPage({ user, onRefresh }) {
  const [team, setTeam] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', name: '', role: 'user' });
  const [inviteResult, setInviteResult] = useState(null); // { name, email, temp_password }
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const data = await api.get('/api/team');
      setTeam(data);
    } catch (err) { console.error(err); }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const result = await api.post('/api/team/invite', inviteForm);
      // Show temp password modal
      setInviteResult({
        name: inviteForm.name,
        email: inviteForm.email,
        temp_password: result.temp_password
      });
      setInviteForm({ email: '', name: '', role: 'user' });
      setShowInvite(false);
      loadTeam();
      if (onRefresh) onRefresh();
    } catch (err) {
      NotificationService.error('Errore', err.message);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(inviteResult.temp_password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeInviteResult = () => {
    setInviteResult(null);
    setCopied(false);
  };

  const handleRemove = async (userId, name) => {
    if (!window.confirm(`Sei sicuro di voler rimuovere ${name}?`)) return;
    try {
      await api.delete(`/api/team/${userId}`);
      NotificationService.success('Membro rimosso', `${name} è stato rimosso dal team.`);
      loadTeam();
      if (onRefresh) onRefresh();
    } catch (err) {
      NotificationService.error('Errore', err.message);
    }
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--input-bg)',
    color: 'var(--foreground)', fontSize: '14px', boxSizing: 'border-box',
  };

  return (
    <div data-testid="team-page">
      {/* Temp Password Result Modal */}
      {inviteResult && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 100, padding: '20px',
        }} onClick={closeInviteResult}>
          <div data-testid="invite-result-modal" style={{
            background: 'var(--card)', borderRadius: '16px', padding: '28px',
            width: '100%', maxWidth: '420px', border: '1px solid var(--border)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
              }}>
                {Icons.checkCircle}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)' }}>
                Utente Invitato!
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                {inviteResult.name} ({inviteResult.email})
              </p>
            </div>

            <div style={{
              padding: '16px', borderRadius: '10px',
              background: 'var(--muted)', marginBottom: '16px',
            }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: 600,
                color: 'var(--muted-foreground)', marginBottom: '8px',
              }}>
                PASSWORD TEMPORANEA
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  data-testid="temp-password-display"
                  type="text"
                  readOnly
                  value={inviteResult.temp_password}
                  style={{
                    flex: 1, padding: '10px 12px', borderRadius: '8px',
                    border: '1px solid var(--border)', background: 'var(--background)',
                    color: 'var(--foreground)', fontSize: '16px', fontFamily: 'monospace',
                    fontWeight: 600,
                  }}
                />
                <button
                  data-testid="copy-password-btn"
                  onClick={handleCopyPassword}
                  style={{
                    padding: '10px 14px', borderRadius: '8px', border: 'none',
                    background: copied ? '#22C55E' : 'var(--primary)',
                    color: 'white', cursor: 'pointer', fontSize: '13px',
                    fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'background 0.2s',
                  }}
                >
                  {copied ? 'Copiata!' : 'Copia'}
                </button>
              </div>
            </div>

            <div style={{
              padding: '12px', borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              fontSize: '12px', color: 'var(--foreground)', lineHeight: 1.5,
            }}>
              <strong>Comunica questa password</strong> all'utente. Al primo accesso dovrà impostare una nuova password sicura.
            </div>

            <button
              data-testid="close-invite-result"
              onClick={closeInviteResult}
              style={{
                width: '100%', marginTop: '16px', padding: '12px',
                borderRadius: '8px', border: '1px solid var(--border)',
                background: 'transparent', color: 'var(--foreground)',
                cursor: 'pointer', fontSize: '14px', fontWeight: 500,
              }}
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

      {user?.role === 'admin' && (
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button data-testid="invite-btn" onClick={() => setShowInvite(!showInvite)} style={{
            padding: '8px 16px', borderRadius: '8px', border: 'none',
            background: 'var(--primary)', color: 'white', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600,
          }}>
            {showInvite ? 'Annulla' : 'Invita Membro'}
          </button>
        </div>
      )}

      {showInvite && (
        <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--foreground)' }}>Invita Nuovo Membro</h3>
          <form onSubmit={handleInvite}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px', color: 'var(--foreground)' }}>Nome</label>
                <input data-testid="invite-name" value={inviteForm.name} onChange={e => setInviteForm({...inviteForm, name: e.target.value})} required placeholder="Mario Rossi" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px', color: 'var(--foreground)' }}>Email</label>
                <input data-testid="invite-email" type="email" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} required placeholder="email@azienda.it" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px', color: 'var(--foreground)' }}>Ruolo</label>
                <select data-testid="invite-role" value={inviteForm.role} onChange={e => setInviteForm({...inviteForm, role: e.target.value})} style={inputStyle}>
                  <option value="user">Dipendente</option>
                  <option value="admin">Amministratore</option>
                </select>
              </div>
            </div>
            <button data-testid="invite-submit" type="submit" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Invita</button>
          </form>
        </div>
      )}

      <div style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {team.map(member => (
          <div key={member.user_id} data-testid={`team-member-${member.user_id}`} style={{
            padding: '16px 20px', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--primary)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 600,
              }}>{member.name?.charAt(0) || '?'}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>{member.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{member.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                background: member.role === 'admin' ? '#DBEAFE' : '#F3F4F6',
                color: member.role === 'admin' ? '#2563EB' : '#6B7280',
              }}>{member.role === 'admin' ? 'Admin' : 'Dipendente'}</span>
              {user?.role === 'admin' && member.user_id !== user.user_id && (
                <button onClick={() => handleRemove(member.user_id, member.name)} style={{
                  padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)',
                  background: 'transparent', color: '#EF4444', cursor: 'pointer', fontSize: '12px',
                }}>Rimuovi</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
