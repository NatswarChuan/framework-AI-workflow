import React, { useState } from 'react';
import type { ProductCatalog, VendorStore } from '../types/api';
import { apiClient } from '../services/apiClient';

interface CatalogManagerProps {
  products: ProductCatalog[];
  stores: VendorStore[];
  onRefresh: () => void;
  canCreate: boolean;
  isAdmin?: boolean;
}

export const CatalogManager: React.FC<CatalogManagerProps> = ({
  products,
  stores,
  onRefresh,
  canCreate,
}) => {
  const [skuCode, setSkuCode] = useState('');
  const [productName, setProductName] = useState('');
  const category = 'Electronics';
  const [retailPrice, setRetailPrice] = useState('299.99');
  const b2bPrice = '220.00';
  const [costPrice, setCostPrice] = useState('150.00');
  const [vendorCode, setVendorCode] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      const storeCodeVal = vendorCode || (stores[0]?.storeCode || 'VND-DEFAULT');
      await apiClient.createProductCatalog({
        skuCode,
        productName,
        category,
        retailPrice: parseFloat(retailPrice),
        b2bWholesalePrice: parseFloat(b2bPrice),
        costPrice: parseFloat(costPrice),
        vendorStoreCode: storeCodeVal,
        active: true,
      });
      setStatusMsg({ text: `Product catalog entry ${skuCode} created successfully!` });
      setSkuCode('');
      setProductName('');
      onRefresh();
    } catch (err: any) {
      setStatusMsg({ text: `Failed: ${err.message}`, error: true });
    }
  };

  return (
    <div className="card" data-testid="catalog-manager-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📦 Product Catalog &amp; FieldSecurity Masking</h2>
        <button onClick={onRefresh} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
          Refresh
        </button>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Demonstrates AutoSlug, UniqueField, and <code>@FieldSecurity</code>: Internal cost price is nullified unless caller possesses <code>ROLE_ADMIN</code> or <code>ROLE_SUPER_ADMIN</code>.
      </p>

      {statusMsg && (
        <div
          data-testid="catalog-status-msg"
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
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>SKU Code</label>
            <input
              data-testid="input-catalog-sku"
              type="text"
              required
              value={skuCode}
              onChange={(e) => setSkuCode(e.target.value)}
              placeholder="SKU-PROD-01"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Product Name</label>
            <input
              data-testid="input-catalog-name"
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Retail Price ($)</label>
            <input
              data-testid="input-catalog-retail-price"
              type="number"
              step="0.01"
              required
              value={retailPrice}
              onChange={(e) => setRetailPrice(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Cost Price ($) [Protected]</label>
            <input
              data-testid="input-catalog-cost-price"
              type="number"
              step="0.01"
              required
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Vendor Store</label>
            <select
              value={vendorCode}
              onChange={(e) => setVendorCode(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            >
              <option value="">Default Store</option>
              {stores.map((s) => (
                <option key={s.storeCode} value={s.storeCode}>
                  {s.storeName} ({s.storeCode})
                </option>
              ))}
            </select>
          </div>
          <button data-testid="btn-create-catalog" type="submit" className="btn-primary">
            + Add Product
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Product Name</th>
            <th>Slug</th>
            <th>Retail Price</th>
            <th>B2B Wholesale</th>
            <th>Internal Cost (@FieldSecurity)</th>
          </tr>
        </thead>
        <tbody data-testid="catalog-list-body">
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                No catalog items found.
              </td>
            </tr>
          ) : (
            products.map((p, idx) => (
              <tr key={p.id || idx}>
                <td><strong>{p.skuCode}</strong></td>
                <td>{p.productName}</td>
                <td><code>{p.slug}</code></td>
                <td><strong style={{ color: '#15803d' }}>${p.retailPrice?.toFixed(2)}</strong></td>
                <td>${p.b2bWholesalePrice?.toFixed(2)}</td>
                <td>
                  {p.costPrice !== null && p.costPrice !== undefined ? (
                    <span className="badge badge-success">
                      ${p.costPrice.toFixed(2)} (Visible)
                    </span>
                  ) : (
                    <span
                      data-testid="masked-cost-price"
                      className="badge badge-warning"
                      title="Nullified by @FieldSecurity on backend"
                    >
                      🔒 Masked / Restricted
                    </span>
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
