import type { ApiResponse } from '../types/api';

/**
 * Service client communicating with Spring-NWVMC dynamic controllers.
 * Handles JWT bearer tokens, idempotency headers, and unified error mapping.
 *
 * @author NatswarChuan
 */
class ApiClient {
  private token: string | null = null;

  public setToken(token: string | null): void {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const body: ApiResponse<T> = await response.json();

    if (!response.ok) {
      const errorMsg = body?.message || `HTTP Error ${response.status}`;
      const err = new Error(errorMsg) as Error & { status: number; code?: string };
      err.status = response.status;
      err.code = body?.code;
      throw err;
    }

    return body;
  }

  // --- Dynamic Controller Endpoints ---

  public async getVendorStores() {
    return this.request<any[]>('/api/v1/vendor-stores');
  }

  public async createVendorStore(payload: any) {
    return this.request<any>('/api/v1/vendor-stores', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getProductCatalogs() {
    return this.request<any[]>('/api/v1/product-catalogs');
  }

  public async createProductCatalog(payload: any) {
    return this.request<any>('/api/v1/product-catalogs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getInventoryStocks() {
    return this.request<any[]>('/api/v1/inventory-stocks');
  }

  public async createInventoryStock(payload: any) {
    return this.request<any>('/api/v1/inventory-stocks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async adjustInventoryStock(id: string, field: string, delta: number) {
    return this.request<any>(
      `/api/v1/inventory-stocks/${id}/increment?field=${encodeURIComponent(field)}&delta=${delta}`,
      {
        method: 'PATCH',
      }
    );
  }

  public async getOrders() {
    return this.request<any[]>('/api/v1/e-commerce-orders');
  }

  public async createOrder(payload: any) {
    return this.request<any>('/api/v1/e-commerce-orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async transitionOrderState(id: string, targetState: string) {
    return this.request<any>(
      `/api/v1/e-commerce-orders/${id}/transition?targetState=${encodeURIComponent(targetState)}`,
      {
        method: 'POST',
      }
    );
  }

  public async deleteOrder(id: string) {
    return this.request<void>(`/api/v1/e-commerce-orders/${id}`, {
      method: 'DELETE',
    });
  }

  public async createPaymentTransaction(payload: any, idempotencyKey: string) {
    const headers = new Headers();
    headers.set('X-Idempotency-Key', idempotencyKey);
    return this.request<any>('/api/v1/payment-transactions', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  }

  public async createInvoice(payload: any) {
    return this.request<any>('/api/v1/electronic-invoices', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const apiClient = new ApiClient();
