import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RocketLogo } from '../components/Icons';
import api from '../lib/api';

export default function FirstLoginPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('La nuova password deve avere almeno 8 caratteri');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      
      // Update user state to remove must_change_password flag
      updateUser({ must_change_password: false });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Errore durante il cambio password');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1px solid var(--border)', background: 'var(--input-bg)',
    color: 'var(--foreground)', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--background)', padding: '20px',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', padding: '40px',
        background: 'var(--card)', borderRadius: '16px',
        border: '1px solid var(--border)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <RocketLogo size={56} />
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginTop: '12px', color: 'var(--foreground)' }}>
            Benvenuto in PowerLeave!
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginTop: '8px' }}>
            Ciao <strong>{user?.name}</strong>! Per iniziare, imposta una nuova password sicura.
          </p>
        </div>

        {error && (
          <div data-testid="first-login-error" style={{
            padding: '12px 14px', borderRadius: '10px', marginBottom: '16px',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444', fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--foreground)' }}>
              Password temporanea (ricevuta dall'admin)
            </label>
            <input
              data-testid="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Inserisci la password temporanea"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--foreground)' }}>
              Nuova Password
            </label>
            <input
              data-testid="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimo 8 caratteri"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--foreground)' }}>
              Conferma Nuova Password
            </label>
            <input
              data-testid="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ripeti la nuova password"
              required
              style={inputStyle}
            />
          </div>

          <button
            data-testid="change-password-submit"
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: '10px',
              border: 'none', background: 'var(--primary)', color: 'white',
              fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Cambio in corso...' : 'Imposta Nuova Password'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--muted-foreground)' }}>
          La password temporanea è stata fornita dal tuo amministratore.
        </p>
      </div>
    </div>
  );
}
