import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function AIMonthlyReport({ year, month }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!year || !month) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await api.get(`/api/ai/monthly-report/${year}/${month}`);
        if (data.enabled && data.report) {
          setReport(data.report);
        } else {
          setReport(null);
        }
      } catch (err) {
        console.log('AI report not available');
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [year, month]);

  if (!loading && !report) return null;

  const monthNames = ["", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
                      "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

  return (
    <div 
      data-testid="ai-monthly-report"
      style={{
        padding: '20px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.05))',
        border: '1px solid rgba(139, 92, 246, 0.15)',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '20px' }}>📊</span>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>
          Riepilogo AI — {monthNames[month]} {year}
        </h3>
        <span style={{
          fontSize: '10px',
          padding: '2px 6px',
          borderRadius: '4px',
          background: 'rgba(139, 92, 246, 0.2)',
          color: '#8B5CF6',
          fontWeight: 600,
        }}>AI</span>
      </div>

      {loading ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: 'var(--muted-foreground)',
        }}>
          <div style={{
            display: 'inline-block',
            width: '24px',
            height: '24px',
            border: '3px solid var(--muted)',
            borderTopColor: '#8B5CF6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{ marginTop: '8px', fontSize: '13px' }}>
            Generazione report in corso...
          </div>
        </div>
      ) : report ? (
        <p style={{
          margin: 0,
          fontSize: '14px',
          lineHeight: 1.7,
          color: 'var(--foreground)',
        }}>
          {report}
        </p>
      ) : null}
    </div>
  );
}
