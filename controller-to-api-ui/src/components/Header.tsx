import React from 'react';
import type { AuthPersona } from '../types/api';

interface HeaderProps {
  currentPersona: AuthPersona;
  personas: AuthPersona[];
  onSelectPersona: (persona: AuthPersona) => void;
  token: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentPersona,
  personas,
  onSelectPersona,
  token,
}) => {
  return (
    <header style={{ background: '#1e293b', color: 'white', padding: '1rem 0', marginBottom: '2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚡</span> Spring-NWVMC Universal Enterprise Portal
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Zero-Boilerplate Dynamic REST API &bull; Universal Domain-Agnostic Engine
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>
              Active RBAC Persona:
            </label>
            <select
              data-testid="persona-select"
              value={currentPersona.role}
              onChange={(e) => {
                const found = personas.find((p) => p.role === e.target.value);
                if (found) onSelectPersona(found);
              }}
              style={{
                background: '#334155',
                color: 'white',
                border: '1px solid #475569',
                padding: '0.4rem 0.8rem',
                borderRadius: '0.4rem',
              }}
            >
              {personas.map((p) => (
                <option key={p.role} value={p.role}>
                  {p.label} ({p.role})
                </option>
              ))}
            </select>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              data-testid="auth-status-badge"
              className={`badge ${token ? 'badge-success' : 'badge-warning'}`}
            >
              {token ? 'Authenticated JWT' : 'Anonymous'}
            </span>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              User: <strong data-testid="active-username" style={{ color: '#f8fafc' }}>{currentPersona.username}</strong>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
