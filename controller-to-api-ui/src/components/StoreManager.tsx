import React, { useState } from 'react';
import type { VendorStore } from '../types/api';
import { apiClient } from '../services/apiClient';

interface StoreManagerProps {
  stores: VendorStore[];
  onRefresh: () => void;
  canCreate: boolean;
}

export const StoreManager: React.FC<StoreManagerProps> = ({ stores, onRefresh, canCreate }) => {
  const [storeName, setStoreName] = useState('');
  const [license, setLicense] = useState('');
  const [description, setDescription] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await apiClient.createVendorStore({
        storeName,
        businessLicense: license,
        description,
        active: true,
      });
      setStatusMsg({ text: `Created store: ${res.data.storeCode} (${res.data.slug})` });
      setStoreName('');
      setLicense('');
      setDescription('');
      onRefresh();
    } catch (err: any) {
      setStatusMsg({ text: `Error (${err.status || 400}): ${err.message}`, error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" data-testid="store-manager-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🏬 Vendor Store Multi-Tenancy</h2>
        <button onClick={onRefresh} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
          Refresh
        </button>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Demonstrates AutoCode (<code>VND-</code>), AutoSlug, and UniqueField constraints.
      </p>

      {statusMsg && (
        <div
          data-testid="store-status-msg"
          style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            borderRadius: '0.5rem',
            background: statusMsg.error ? '#fee2e2' : '#dcfce7',
            color: statusMsg.error ? '#991b1b' : '#166534',
            fontSize: '0.9rem',
          }}
        >
          {statusMsg.text}
        </div>
      )}

      {canCreate && (
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Store Name</label>
            <input
              data-testid="input-store-name"
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. Kyoto Craft Tech"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Business License</label>
            <input
              data-testid="input-business-license"
              type="text"
              required
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              placeholder="BL-JP-112233"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Description</label>
            <input
              data-testid="input-store-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Store profile summary"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <button data-testid="btn-create-store" type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : '+ Add Store'}
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Store Code</th>
            <th>Store Name</th>
            <th>Slug</th>
            <th>License</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody data-testid="store-list-body">
          {stores.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                No vendor stores registered yet.
              </td>
            </tr>
          ) : (
            stores.map((s, idx) => (
              <tr key={s.id || idx}>
                <td><strong>{s.storeCode}</strong></td>
                <td>{s.storeName}</td>
                <td><code>{s.slug}</code></td>
                <td>{s.businessLicense}</td>
                <td>
                  <span className={`badge ${s.active ? 'badge-success' : 'badge-warning'}`}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
