import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api';

export default function AuthCallback() {
  const [status, setStatus] = useState('Elaborazione login...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processCallback = async () => {
      const params = new URLSearchParams(location.search || window.location.hash.split('?')[1] || '');
      const sessionId = params.get('session_id');

      if (!sessionId) {
        setStatus('Errore: sessione non trovata');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
        return;
      }

      try {
        const data = await api.post('/api/auth/session', { session_id: sessionId });
        // Check if user must change password
        if (data.must_change_password) {
          navigate('/first-login', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
        window.location.reload();
      } catch (err) {
        setStatus('Errore di autenticazione: ' + (err.message || 'Riprova'));
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };
    processCallback();
  }, [navigate, location]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--background)',
    }}>
      <div style={{
        textAlign: 'center', padding: '40px',
        background: 'var(--card)', borderRadius: '16px',
        border: '1px solid var(--border)',
      }}>
        <div style={{
          width: '40px', height: '40px', border: '3px solid var(--primary)',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 1s linear infinite', margin: '0 auto 16px',
        }} />
        <p style={{ color: 'var(--foreground)', fontSize: '16px' }}>{status}</p>
      </div>
    </div>
  );
}
