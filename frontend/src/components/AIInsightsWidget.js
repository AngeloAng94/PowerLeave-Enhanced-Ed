import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function AIInsightsWidget() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/api/ai/team-insights');
        setInsights(data);
      } catch (err) {
        console.log('AI insights not available');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return null;
  if (!insights || !insights.enabled) return null;

  const hasContent = insights.conflicts?.length > 0 || 
                     insights.risk_employees?.length > 0 || 
                     insights.recommendations?.length > 0;

  if (!hasContent && insights.week_capacity?.percentage >= 80) return null;

  return (
    <div data-testid="ai-insights-widget" style={{
      padding: '20px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '20px' }}>🤖</span>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>
          AI Insights
        </h3>
        <span style={{
          fontSize: '10px',
          padding: '2px 6px',
          borderRadius: '4px',
          background: 'rgba(139, 92, 246, 0.2)',
          color: '#8B5CF6',
          fontWeight: 600,
        }}>BETA</span>
      </div>

      {/* Week Capacity */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Capacità Team Settimana</span>
          <span style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            color: insights.week_capacity.percentage >= 70 ? '#22C55E' : 
                   insights.week_capacity.percentage >= 50 ? '#F59E0B' : '#EF4444' 
          }}>
            {insights.week_capacity.available}/{insights.week_capacity.total} ({insights.week_capacity.percentage}%)
          </span>
        </div>
        <div style={{ height: '6px', borderRadius: '3px', background: 'var(--muted)', overflow: 'hidden' }}>
          <div style={{
            width: `${insights.week_capacity.percentage}%`,
            height: '100%',
            borderRadius: '3px',
            background: insights.week_capacity.percentage >= 70 ? '#22C55E' : 
                        insights.week_capacity.percentage >= 50 ? '#F59E0B' : '#EF4444',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Conflicts */}
      {insights.conflicts?.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#EF4444', marginBottom: '6px' }}>
            ⚠️ Date con alta assenza
          </div>
          {insights.conflicts.slice(0, 3).map((c, i) => (
            <div key={i} style={{
              fontSize: '12px',
              color: 'var(--muted-foreground)',
              padding: '4px 0',
            }}>
              <strong>{c.date}</strong>: {c.count} assenti ({c.users.join(', ')})
            </div>
          ))}
        </div>
      )}

      {/* Risk Employees */}
      {insights.risk_employees?.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#F59E0B', marginBottom: '6px' }}>
            📊 Ferie in esaurimento
          </div>
          {insights.risk_employees.slice(0, 3).map((e, i) => (
            <div key={i} style={{
              fontSize: '12px',
              color: 'var(--muted-foreground)',
              padding: '4px 0',
            }}>
              <strong>{e.user_name}</strong>: {e.remaining_days} giorni rimasti
              {e.pending_days > 0 && ` (${e.pending_days} in attesa)`}
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {insights.recommendations?.length > 0 && (
        <div style={{
          marginTop: '12px',
          padding: '10px',
          borderRadius: '8px',
          background: 'rgba(59, 130, 246, 0.1)',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#3B82F6', marginBottom: '6px' }}>
            💡 Suggerimenti
          </div>
          {insights.recommendations.map((r, i) => (
            <div key={i} style={{
              fontSize: '12px',
              color: 'var(--foreground)',
              padding: '4px 0',
            }}>
              {r.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
