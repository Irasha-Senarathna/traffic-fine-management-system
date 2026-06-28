import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../components/StatCard';
import { getStatsSummary, getStatsByDistrict, getStatsByCategory } from '../services/api';

const COLORS = ['#8B1A2D','#B02233','#166534','#C49B0E','#92400E','#1E40AF','#6B7280','#0891b2','#65a30d','#7c3aed'];

function fmt(n) {
  const num = Number(n) || 0;
  return `LKR ${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function DashboardPage() {
  const [summary,    setSummary]    = useState(null);
  const [districts,  setDistricts]  = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getStatsSummary(),
      getStatsByDistrict(),
      getStatsByCategory(),
    ])
      .then(([s, d, c]) => {
        setSummary(s.data);
        setDistricts(d.data.districts || []);
        setCategories(c.data.categories || []);
      })
      .catch((err) => setError(err?.response?.data?.message || err.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner">Loading dashboard…</div>;
  if (error)   return <div className="alert alert-error">{error}</div>;

  const districtChartData = districts.map((d) => ({
    name: d.district || 'Unknown',
    total: Number(d.total) || 0,
    count: Number(d.count) || 0,
  }));

  const categoryChartData = categories.map((c, i) => ({
    name: c.category || 'Unknown',
    value: Number(c.total) || 0,
    count: Number(c.count) || 0,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div>
      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard
          label="Total Fines Issued"
          value={summary?.totalFines ?? '—'}
          accent="accent-blue"
        />
        <StatCard
          label="Total Collected"
          value={fmt(summary?.totalCollected)}
          sub={`${summary?.paidFines ?? 0} paid fines`}
          accent="accent-green"
        />
        <StatCard
          label="Outstanding Fines"
          value={summary?.unpaidFines ?? '—'}
          sub="UNPAID"
          accent="accent-red"
        />
        <StatCard
          label="Registered Users"
          value={summary?.totalUsers ?? '—'}
          accent="accent-purple"
        />
      </div>

      {/* Charts */}
      <div className="chart-grid">
        {/* District-wise bar chart */}
        <div className="panel">
          <div className="panel-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: 16, height: 16, color: 'var(--accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
              District-wise Collections
            </span>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>
              {districtChartData.length} districts
            </span>
          </div>
          <div style={{ padding: 16 }}>
            {districtChartData.length === 0 ? (
              <div className="empty">No district data yet.<br />
                <small>Assign a district when issuing fines.</small>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={districtChartData} margin={{ top: 0, right: 10, left: 0, bottom: 60 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--muted)', fontSize: 11 }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }}
                    formatter={(v) => [fmt(v), 'Collected']}
                  />
                  <Bar dataKey="total" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category-wise pie chart */}
        <div className="panel">
          <div className="panel-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: 16, height: 16, color: 'var(--accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>
              Breakdown by Fine Category
            </span>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>
              {categoryChartData.length} categories
            </span>
          </div>
          <div style={{ padding: 16 }}>
            {categoryChartData.length === 0 ? (
              <div className="empty">No category data yet.<br />
                <small>Assign a category when issuing fines.</small>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) =>
                      `${name.length > 10 ? name.slice(0, 10) + '…' : name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {categoryChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }}
                    formatter={(v, n, p) => [fmt(v), p.payload.name]}
                  />
                  <Legend
                    formatter={(v) => <span style={{ color: 'var(--muted)', fontSize: 11 }}>{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* District breakdown table */}
      {districtChartData.length > 0 && (
        <div className="panel">
          <div className="panel-header">District-wise Summary Table</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>District</th>
                  <th>Total Fines</th>
                  <th>Total Collected</th>
                  <th>Avg per Fine</th>
                </tr>
              </thead>
              <tbody>
                {districtChartData.map((d) => (
                  <tr key={d.name}>
                    <td>{d.name}</td>
                    <td>{d.count}</td>
                    <td>{fmt(d.total)}</td>
                    <td>{d.count > 0 ? fmt(d.total / d.count) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category breakdown table */}
      {categoryChartData.length > 0 && (
        <div className="panel">
          <div className="panel-header">Category Breakdown Table</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fine Category</th>
                  <th>Count</th>
                  <th>Total Collected</th>
                </tr>
              </thead>
              <tbody>
                {categoryChartData.map((c) => (
                  <tr key={c.name}>
                    <td>{c.name}</td>
                    <td>{c.count}</td>
                    <td>{fmt(c.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
