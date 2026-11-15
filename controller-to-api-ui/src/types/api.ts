/**
 * Standard API response envelope aligned 100% with io.github.natswarchuan backend framework.
 *
 * @author NatswarChuan
 */
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
  timestamp?: string;
  traceId?: string;
}

export type EnterpriseRole = 'ROLE_SUPER_ADMIN' | 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_OPERATOR';

export interface AuthPersona {
  role: EnterpriseRole;
  label: string;
  username: string;
  description: string;
}

export interface VendorStore {
  id?: string;
  storeCode?: string;
  storeName: string;
  slug?: string;
  businessLicense: string;
  description: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCatalog {
  id?: string;
  skuCode: string;
  productName: string;
  slug?: string;
  category: string;
  brand?: string;
  vendorStoreCode: string;
  retailPrice: number;
  b2bWholesalePrice: number;
  costPrice?: number | null; // Sensitive: nullified by @FieldSecurity for non-admin roles
  active: boolean;
  createdAt?: string;
}

export interface InventoryStock {
  id?: string;
  stockSkuCode: string;
  warehouseCode: string;
  vendorStoreCode: string;
  availableQuantity: number;
  reservedQuantity: number;
  reorderThreshold: number;
  updatedAt?: string;
}

export interface CartItem {
  id?: string;
  skuCode: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal?: number; // Computed via @ComputedField
}

export interface ShoppingCart {
  id?: string;
  customerEmail: string;
  totalAmount?: number; // Computed via @ComputedField
  items: CartItem[];
}

export interface ECommerceOrderItem {
  id?: string;
  skuCode: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal?: number;
}

export type OrderState =
  | 'CREATED'
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'ALLOCATED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface ECommerceOrder {
  id?: string;
  orderCode?: string;
  orderStatus: OrderState;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  currency: string;
  grossAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount?: number;
  items?: ECommerceOrderItem[];
  createdAt?: string;
}

export interface PaymentTransaction {
  id?: string;
  transactionReference?: string;
  orderCode: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: string;
  gatewayProvider: string;
  gatewayResponseCode: string;
}

export interface ElectronicInvoice {
  id?: string;
  invoiceNumber?: string;
  orderCode: string;
  taxRegistrationNumber: string;
  subtotalAmount: number;
  vatAmount: number;
  grandTotal: number;
  digitalSignatureHash?: string;
}

