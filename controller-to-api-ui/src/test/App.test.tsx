import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from '../components/Header';
import { StoreManager } from '../components/StoreManager';
import { CatalogManager } from '../components/CatalogManager';
import { InventoryManager } from '../components/InventoryManager';
import { AbnormalTester } from '../components/AbnormalTester';
import type { AuthPersona } from '../types/api';

describe('Spring-NWVMC React Frontend Unit Test Suite', () => {
  const samplePersonas: AuthPersona[] = [
    { role: 'ROLE_SUPER_ADMIN', label: 'Platform Superadmin', username: 'admin', description: 'Root' },
    { role: 'ROLE_USER', label: 'End Consumer', username: 'customer', description: 'Customer' },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('Header component renders active persona and authentication status', () => {
    const onSelectPersona = vi.fn();
    render(
      <Header
        currentPersona={samplePersonas[0]}
        personas={samplePersonas}
        onSelectPersona={onSelectPersona}
        token="mock-jwt-token"
      />
    );

    expect(screen.getByText(/Spring-NWVMC Universal Enterprise Portal/i)).toBeInTheDocument();
    expect(screen.getByTestId('auth-status-badge')).toHaveTextContent(/Authenticated JWT/i);
    expect(screen.getByTestId('active-username')).toHaveTextContent('admin');

    const select = screen.getByTestId('persona-select');
    fireEvent.change(select, { target: { value: 'ROLE_USER' } });
    expect(onSelectPersona).toHaveBeenCalledWith(samplePersonas[1]);
  });

  it('StoreManager renders store list and controls create permissions', () => {
    const mockStores = [
      {
        id: '018e-01',
        storeCode: 'VND-TOKYO-01',
        storeName: 'Tokyo Electronics Flagship',
        slug: 'tokyo-electronics-flagship',
        businessLicense: 'BL-JP-9988',
        description: 'Tech store',
        active: true,
      },
    ];

    render(<StoreManager stores={mockStores} onRefresh={vi.fn()} canCreate={true} />);

    expect(screen.getByText('VND-TOKYO-01')).toBeInTheDocument();
    expect(screen.getByText('Tokyo Electronics Flagship')).toBeInTheDocument();
    expect(screen.getByTestId('btn-create-store')).toBeInTheDocument();
  });

  it('CatalogManager properly masks costPrice for non-admin personas under FieldSecurity', () => {
    const mockProducts = [
      {
        id: '018e-prod-01',
        skuCode: 'SKU-SONY-XM5',
        productName: 'Sony WH-1000XM5',
        slug: 'sony-wh-1000xm5',
        category: 'Audio',
        retailPrice: 399.99,
        b2bWholesalePrice: 299.99,
        costPrice: null, // Masked by backend @FieldSecurity
        active: true,
        vendorStoreCode: 'VND-TOKYO-01',
      },
    ];

    render(
      <CatalogManager
        products={mockProducts}
        stores={[]}
        onRefresh={vi.fn()}
        canCreate={false}
        isAdmin={false}
      />
    );

    expect(screen.getByText('SKU-SONY-XM5')).toBeInTheDocument();
    expect(screen.getByText('$399.99')).toBeInTheDocument();
    // Verify that the cost price element indicates masking
    expect(screen.getByTestId('masked-cost-price')).toHaveTextContent(/Masked \/ Restricted/i);
  });

  it('InventoryManager displays stock quantities and adjustment buttons', () => {
    const mockStocks = [
      {
        id: '018e-stock-01',
        stockSkuCode: 'STK-SONY-01',
        warehouseCode: 'WH-TOKYO',
        vendorStoreCode: 'VND-TOKYO-01',
        availableQuantity: 495,
        reservedQuantity: 5,
        reorderThreshold: 50,
      },
    ];

    render(<InventoryManager stocks={mockStocks} onRefresh={vi.fn()} canManage={true} />);

    expect(screen.getByText('STK-SONY-01')).toBeInTheDocument();
    expect(screen.getByTestId('stock-qty-STK-SONY-01')).toHaveTextContent('495 units');
    expect(screen.getByTestId('btn-increment-STK-SONY-01')).toBeInTheDocument();
    expect(screen.getByTestId('btn-decrement-STK-SONY-01')).toBeInTheDocument();
  });

  it('AbnormalTester renders live error test buttons', () => {
    render(<AbnormalTester />);

    expect(screen.getByTestId('btn-test-401')).toHaveTextContent('401 Unauthorized');
    expect(screen.getByTestId('btn-test-403')).toHaveTextContent('403 Forbidden');
    expect(screen.getByTestId('btn-test-404')).toHaveTextContent('404 Not Found');
    expect(screen.getByTestId('btn-test-405')).toHaveTextContent('405 Method Not Allowed');
    expect(screen.getByTestId('btn-test-415')).toHaveTextContent('415 Unsupported Media Type');
    expect(screen.getByTestId('btn-test-400-json')).toHaveTextContent('400 Malformed JSON');
  });
});
