import React from 'react';

export default function StatCard({ label, value, sub, accent = '' }) {
  return (
    <div className={`stat-card ${accent}`}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}
