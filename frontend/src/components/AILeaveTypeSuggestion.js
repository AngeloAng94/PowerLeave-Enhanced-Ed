import React, { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

export default function AILeaveTypeSuggestion({ notes, leaveTypes, onSelect }) {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const fetchSuggestion = useCallback(async () => {
    if (!notes || notes.trim().length < 5 || dismissed) {
      setSuggestion(null);
      return;
    }

    setLoading(true);
    try {
      const data = await api.post('/api/ai/suggest-leave-type', { notes });
      if (data.enabled && data.suggestion) {
        setSuggestion(data.suggestion);
      } else {
        setSuggestion(null);
      }
    } catch (err) {
      console.log('AI suggestion not available');
      setSuggestion(null);
    } finally {
      setLoading(false);
    }
  }, [notes, dismissed]);

  // Debounce: wait 800ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestion();
    }, 800);

    return () => clearTimeout(timer);
  }, [fetchSuggestion]);

  // Reset dismissed when notes change significantly
  useEffect(() => {
    setDismissed(false);
  }, [notes?.slice(0, 10)]);

  if (!suggestion && !loading) return null;

  const confidenceColor = suggestion?.confidence >= 0.8 ? '#22C55E' : 
                          suggestion?.confidence >= 0.6 ? '#F59E0B' : '#3B82F6';

  return (
    <div 
      data-testid="ai-leave-suggestion"
      style={{
        marginTop: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.05))',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        animation: loading ? 'pulse 1.5s infinite' : 'none',
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🤖</span>
          <span style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
            Analisi in corso...
          </span>
        </div>
      ) : suggestion ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🤖</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>
                Suggerimento AI
              </span>
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: confidenceColor,
                color: 'white',
                fontWeight: 600,
              }}>
                {Math.round(suggestion.confidence * 100)}%
              </span>
            </div>
            <button
              onClick={() => setDismissed(true)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted-foreground)',
                fontSize: '16px',
                padding: '2px',
              }}
            >
              ×
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <div>
              <span style={{ fontSize: '14px', color: 'var(--foreground)' }}>
                Tipo suggerito: <strong style={{ color: '#8B5CF6' }}>{suggestion.suggested_type_name}</strong>
              </span>
              {suggestion.reason && (
                <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                  {suggestion.reason}
                </div>
              )}
            </div>
            <button
              data-testid="use-ai-suggestion"
              onClick={() => {
                onSelect(suggestion.suggested_type_id);
                setDismissed(true);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: '#8B5CF6',
                color: 'white',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Usa questo
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
