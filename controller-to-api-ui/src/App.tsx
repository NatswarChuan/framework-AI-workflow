import React, { useState, useEffect } from 'react';
import type { AuthPersona, VendorStore, ProductCatalog, InventoryStock, ECommerceOrder } from './types/api';
import { apiClient } from './services/apiClient';
import { Header } from './components/Header';
import { StoreManager } from './components/StoreManager';
import { CatalogManager } from './components/CatalogManager';
import { InventoryManager } from './components/InventoryManager';
import { OrderStateMachineManager } from './components/OrderStateMachineManager';
import { AbnormalTester } from './components/AbnormalTester';

const ENTERPRISE_PERSONAS: AuthPersona[] = [
  {
    role: 'ROLE_SUPER_ADMIN',
    label: 'Platform Superadmin',
    username: 'platform.superadmin',
    description: 'Root access: Onboard stores, govern settlements, and full deletion rights.',
  },
  {
    role: 'ROLE_ADMIN',
    label: 'Vendor Store Admin',
    username: 'tokyo.electronics.admin',
    description: 'Merchant access: Manage store catalog, update inventory, and ship orders.',
  },
  {
    role: 'ROLE_USER',
    label: 'End Consumer',
    username: 'consumer.tanaka',
    description: 'Customer access: Browse retail products, place orders, and make payments.',
  },
];

export const App: React.FC = () => {
  const [currentPersona, setCurrentPersona] = useState<AuthPersona>(ENTERPRISE_PERSONAS[0]);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'stores' | 'catalog' | 'inventory' | 'orders' | 'abnormal'>('stores');

  const [stores, setStores] = useState<VendorStore[]>([]);
  const [products, setProducts] = useState<ProductCatalog[]>([]);
  const [stocks, setStocks] = useState<InventoryStock[]>([]);
  const [orders, setOrders] = useState<ECommerceOrder[]>([]);

  // Authenticate and acquire signed JWT token whenever persona changes
  useEffect(() => {
    const authenticatePersona = async () => {
      try {
        const res = await fetch(
          `/api/v1/auth/token?username=${encodeURIComponent(currentPersona.username)}&role=${currentPersona.role}`,
          { method: 'POST' }
        );
        const body = await res.json();
        if (body.data?.token) {
          setToken(body.data.token);
          apiClient.setToken(body.data.token);
        }
      } catch (e) {
        console.warn('Backend offline or authentication failed:', e);
      }
    };
    authenticatePersona();
  }, [currentPersona]);

  // Load backend data
  const refreshAll = async () => {
    try {
      const [sRes, pRes, stRes, oRes] = await Promise.allSettled([
        apiClient.getVendorStores(),
        apiClient.getProductCatalogs(),
        apiClient.getInventoryStocks(),
        apiClient.getOrders(),
      ]);

      const extractArray = <T,>(res: PromiseSettledResult<any>): T[] => {
        if (res.status === 'fulfilled' && res.value?.data) {
          const d = res.value.data;
          if (Array.isArray(d)) return d;
          if (Array.isArray(d.content)) return d.content;
        }
        return [];
      };

      setStores(extractArray<VendorStore>(sRes));
      setProducts(extractArray<ProductCatalog>(pRes));
      setStocks(extractArray<InventoryStock>(stRes));
      setOrders(extractArray<ECommerceOrder>(oRes));
    } catch (e) {
      console.warn('Data refresh failed:', e);
    }
  };

  useEffect(() => {
    if (token) {
      refreshAll();
    }
  }, [token]);

  const isSuperAdmin = currentPersona.role === 'ROLE_SUPER_ADMIN';
  const isAdmin = isSuperAdmin || currentPersona.role === 'ROLE_ADMIN';
  const isConsumer = currentPersona.role === 'ROLE_USER';

  return (
    <div>
      <Header
        currentPersona={currentPersona}
        personas={ENTERPRISE_PERSONAS}
        onSelectPersona={(p) => setCurrentPersona(p)}
        token={token}
      />

      <main className="container">
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button
            data-testid="tab-stores"
            className={activeTab === 'stores' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('stores')}
          >
            🏬 Stores ({stores.length})
          </button>
          <button
            data-testid="tab-catalog"
            className={activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('catalog')}
          >
            📦 Products ({products.length})
          </button>
          <button
            data-testid="tab-inventory"
            className={activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('inventory')}
          >
            🏭 Inventory ({stocks.length})
          </button>
          <button
            data-testid="tab-orders"
            className={activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('orders')}
          >
            🔄 Orders &amp; State Machine ({orders.length})
          </button>
          <button
            data-testid="tab-abnormal"
            className={activeTab === 'abnormal' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('abnormal')}
          >
            🛡️ Abnormal Test Suite
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'stores' && (
          <StoreManager
            stores={stores}
            onRefresh={refreshAll}
            canCreate={isAdmin}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogManager
            products={products}
            stores={stores}
            onRefresh={refreshAll}
            canCreate={isAdmin}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryManager
            stocks={stocks}
            onRefresh={refreshAll}
            canManage={isAdmin}
          />
        )}

        {activeTab === 'orders' && (
          <OrderStateMachineManager
            orders={orders}
            onRefresh={refreshAll}
            canCreateOrder={isConsumer || isAdmin}
            canTransition={isAdmin}
            canDelete={isSuperAdmin}
          />
        )}

        {activeTab === 'abnormal' && <AbnormalTester token={token} />}
      </main>
    </div>
  );
};

export default App;
