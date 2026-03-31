import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function RequestsPage({ user }) {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/api/leave-requests');
        setRequests(data);
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  // Export CSV
  const exportCSV = () => {
    const headers = ['Dipendente', 'Tipo Assenza', 'Data Inizio', 'Data Fine', 'Giorni', 'Note', 'Status', 'Approvato Da'];
    const dataToExport = filter === 'all' ? requests : filtered;
    const rows = dataToExport.map(r => [
      r.user_name,
      r.leave_type_name,
      r.start_date,
      r.end_date,
      r.days,
      r.notes || '',
      r.status === 'approved' ? 'Approvata' : r.status === 'rejected' ? 'Rifiutata' : 'In attesa',
      r.reviewed_by || '-'
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `richieste_assenze_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const statusStyle = (s) => ({
    padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
    background: s === 'approved' ? '#DCFCE7' : s === 'rejected' ? '#FEE2E2' : '#FEF3C7',
    color: s === 'approved' ? '#16A34A' : s === 'rejected' ? '#DC2626' : '#D97706',
  });

  const statusLabels = { approved: 'Approvata', rejected: 'Rifiutata', pending: 'In attesa' };

  return (
    <div data-testid="requests-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px', borderRadius: '20px', border: 'none', fontSize: '13px',
              background: filter === f ? 'var(--primary)' : 'var(--muted)',
              color: filter === f ? 'white' : 'var(--muted-foreground)',
              cursor: 'pointer', fontWeight: filter === f ? 600 : 400,
            }}>
              {f === 'all' ? 'Tutte' : statusLabels[f]} ({f === 'all' ? requests.length : requests.filter(r => r.status === f).length})
            </button>
          ))}
        </div>
        
        <button
          data-testid="export-csv-requests"
          onClick={exportCSV}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '8px', border: 'none',
            background: 'var(--primary)', color: 'white',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Esporta CSV
        </button>
      </div>

      <div style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {filtered.map(req => (
          <div key={req.id} data-testid={`request-row-${req.id}`} style={{
            padding: '16px 20px', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>{req.user_name}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
                {req.leave_type_name} — {req.start_date} → {req.end_date} ({req.days}gg, {req.hours === 8 ? 'intera' : req.hours === 4 ? 'mezza' : `${req.hours}h`})
              </div>
              {req.notes && <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '2px' }}>{req.notes}</div>}
            </div>
            <span style={statusStyle(req.status)}>{statusLabels[req.status] || req.status}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ padding: '40px', textAlign: 'center', color: 'var(--muted-foreground)' }}>Nessuna richiesta trovata</p>
        )}
      </div>
    </div>
  );
}
