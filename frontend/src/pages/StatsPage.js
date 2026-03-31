import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, Area, AreaChart
} from 'recharts';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [balances, setBalances] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, r, b, t] = await Promise.all([
          api.get('/api/stats'),
          api.get('/api/leave-requests'),
          api.get('/api/leave-balances'),
          api.get('/api/leave-types'),
        ]);
        setStats(s);
        setRequests(r);
        setBalances(b);
        setLeaveTypes(t);
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  // Export CSV
  const exportCSV = () => {
    const headers = ['Dipendente', 'Tipo Assenza', 'Data Inizio', 'Data Fine', 'Giorni', 'Status', 'Approvato Da'];
    const rows = requests.map(r => [
      r.user_name,
      r.leave_type_name,
      r.start_date,
      r.end_date,
      r.days,
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
    link.download = `report_assenze_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!stats) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted-foreground)' }}>Caricamento...</div>;

  const approved = requests.filter(r => r.status === 'approved');
  const pending = requests.filter(r => r.status === 'pending');
  const rejected = requests.filter(r => r.status === 'rejected');

  // Monthly data (12 months)
  const monthlyData = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const count = approved.filter(r => r.start_date?.startsWith(key)).length;
    const totalDays = approved.filter(r => r.start_date?.startsWith(key)).reduce((sum, r) => sum + (r.days || 0), 0);
    monthlyData.push({ 
      month: d.toLocaleDateString('it-IT', { month: 'short' }),
      richieste: count,
      giorni: totalDays
    });
  }

  // Type distribution for Pie Chart
  const typeData = leaveTypes.map(t => {
    const count = approved.filter(r => r.leave_type_id === t.id).length;
    return { name: t.name, value: count, color: t.color };
  }).filter(t => t.value > 0);

  // Trend utilizzo (cumulative)
  let cumulative = 0;
  const trendData = monthlyData.map(m => {
    cumulative += m.giorni;
    return { month: m.month, utilizzo: cumulative };
  });

  // Per-user summary
  const userBalances = {};
  balances.forEach(b => {
    if (!userBalances[b.user_id]) userBalances[b.user_id] = { name: b.user_name || b.user_id, types: [] };
    userBalances[b.user_id].types.push(b);
  });

  const COLORS = ['#22C55E', '#3B82F6', '#EF4444', '#A855F7', '#F59E0B', '#EC4899'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--card)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--foreground)' }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ margin: '4px 0 0', fontSize: '13px', color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div data-testid="stats-page">
      {/* Header with Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Statistiche</h2>
        <button
          data-testid="export-csv-stats"
          onClick={exportCSV}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '8px', border: 'none',
            background: 'var(--primary)', color: 'white',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Esporta CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Totale Richieste', value: requests.length, color: '#3B82F6' },
          { label: 'Approvate', value: approved.length, color: '#22C55E' },
          { label: 'In Attesa', value: pending.length, color: '#F59E0B' },
          { label: 'Rifiutate', value: rejected.length, color: '#EF4444' },
          { label: 'Utilizzo', value: `${stats.utilization_rate}%`, color: '#8B5CF6' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '16px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{s.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        
        {/* Bar Chart - Monthly Requests */}
        <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--foreground)' }}>
            Ferie per Mese (12 mesi)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="richieste" name="Richieste" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="giorni" name="Giorni" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Type Distribution */}
        <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--foreground)' }}>
            Distribuzione per Tipo Assenza
          </h3>
          {typeData.length === 0 ? (
            <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>
              Nessun dato disponibile
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Line/Area Chart - Trend Usage */}
        <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)', gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--foreground)' }}>
            Trend Utilizzo Ferie (cumulativo)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUtilizzo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="utilizzo" name="Giorni Totali" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorUtilizzo)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Balances Table */}
      <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--foreground)' }}>Saldi per Dipendente</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid var(--border)', color: 'var(--muted-foreground)', fontWeight: 600 }}>Dipendente</th>
                {leaveTypes.map(t => (
                  <th key={t.id} style={{ textAlign: 'center', padding: '8px 12px', borderBottom: '2px solid var(--border)', color: t.color, fontWeight: 600 }}>{t.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.values(userBalances).map((ub, i) => (
                <tr key={i}>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', fontWeight: 500, color: 'var(--foreground)' }}>{ub.name}</td>
                  {leaveTypes.map(t => {
                    const bal = ub.types.find(b => b.leave_type_id === t.id);
                    if (!bal) return <td key={t.id} style={{ textAlign: 'center', padding: '8px 12px', borderBottom: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>—</td>;
                    return (
                      <td key={t.id} style={{ textAlign: 'center', padding: '8px 12px', borderBottom: '1px solid var(--border)', color: 'var(--foreground)' }}>
                        {bal.total_days - bal.used_days}/{bal.total_days}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
