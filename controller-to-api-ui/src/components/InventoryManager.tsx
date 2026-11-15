import React, { useState } from 'react';
import type { InventoryStock } from '../types/api';
import { apiClient } from '../services/apiClient';

interface InventoryManagerProps {
  stocks: InventoryStock[];
  onRefresh: () => void;
  canManage: boolean;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  stocks,
  onRefresh,
  canManage,
}) => {
  const [skuCode, setSkuCode] = useState('');
  const [warehouseCode, setWarehouseCode] = useState('WH-CENTRAL-01');
  const [quantity, setQuantity] = useState('500');
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      await apiClient.createInventoryStock({
        stockSkuCode: skuCode,
        warehouseCode,
        vendorStoreCode: 'VND-DEFAULT',
        availableQuantity: parseInt(quantity, 10),
        reservedQuantity: 0,
        reorderThreshold: 50,
      });
      setStatusMsg({ text: `Inventory node ${skuCode} initialized successfully.` });
      setSkuCode('');
      onRefresh();
    } catch (err: any) {
      setStatusMsg({ text: `Init Failed: ${err.message}`, error: true });
    }
  };

  const handleAdjust = async (id: string, delta: number) => {
    setStatusMsg(null);
    try {
      const res = await apiClient.adjustInventoryStock(id, 'availableQuantity', delta);
      setStatusMsg({
        text: `Atomic adjusted quantity for ${res.data.stockSkuCode}: now ${res.data.availableQuantity} units.`,
      });
      onRefresh();
    } catch (err: any) {
      setStatusMsg({
        text: `Adjustment Failed (${err.status}): ${err.message}`,
        error: true,
      });
    }
  };

  return (
    <div className="card" data-testid="inventory-manager-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🏭 Inventory Stock Control &amp; Atomic Increment</h2>
        <button onClick={onRefresh} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
          Refresh
        </button>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Demonstrates atomic arithmetic mutation via <code>PATCH /api/v1/inventory-stocks/&#123;id&#125;/increment</code> with non-negative constraints.
      </p>

      {statusMsg && (
        <div
          data-testid="inventory-status-msg"
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

      {canManage && (
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Stock SKU</label>
            <input
              data-testid="input-stock-sku"
              type="text"
              required
              value={skuCode}
              onChange={(e) => setSkuCode(e.target.value)}
              placeholder="STK-SONY-01"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Warehouse</label>
            <input
              data-testid="input-stock-wh"
              type="text"
              required
              value={warehouseCode}
              onChange={(e) => setWarehouseCode(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Initial Units</label>
            <input
              data-testid="input-stock-qty"
              type="number"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <button data-testid="btn-create-stock" type="submit" className="btn-primary">
            + Initialize Node
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Stock SKU</th>
            <th>Warehouse</th>
            <th>Available Units</th>
            <th>Reserved</th>
            <th>Atomic Adjustment (PATCH)</th>
          </tr>
        </thead>
        <tbody data-testid="inventory-list-body">
          {stocks.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                No inventory nodes tracked.
              </td>
            </tr>
          ) : (
            stocks.map((st, idx) => (
              <tr key={st.id || idx}>
                <td><strong>{st.stockSkuCode}</strong></td>
                <td>{st.warehouseCode}</td>
                <td>
                  <span
                    data-testid={`stock-qty-${st.stockSkuCode}`}
                    className="badge badge-info"
                    style={{ fontSize: '0.85rem' }}
                  >
                    {st.availableQuantity} units
                  </span>
                </td>
                <td>{st.reservedQuantity} units</td>
                <td>
                  {canManage ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        data-testid={`btn-increment-${st.stockSkuCode}`}
                        onClick={() => st.id && handleAdjust(st.id, 10)}
                        className="btn-secondary"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                      >
                        +10
                      </button>
                      <button
                        data-testid={`btn-decrement-${st.stockSkuCode}`}
                        onClick={() => st.id && handleAdjust(st.id, -5)}
                        className="btn-secondary"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                      >
                        -5
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Read-only</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
