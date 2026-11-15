import React, { useState } from 'react';
import type { ECommerceOrder, OrderState } from '../types/api';
import { apiClient } from '../services/apiClient';

interface OrderManagerProps {
  orders: ECommerceOrder[];
  onRefresh: () => void;
  canCreateOrder: boolean;
  canTransition: boolean;
  canDelete: boolean;
}

export const OrderStateMachineManager: React.FC<OrderManagerProps> = ({
  orders,
  onRefresh,
  canCreateOrder,
  canTransition,
  canDelete,
}) => {
  const [customerEmail, setCustomerEmail] = useState('consumer.tanaka@example.jp');
  const [customerName, setCustomerName] = useState('Kenji Tanaka');
  const [shippingAddress, setShippingAddress] = useState('1-1 Chiyoda, Tokyo, Japan');
  const [grossAmount, setGrossAmount] = useState('399.99');
  const discountAmount = '50.00';
  const shippingFee = '15.00';
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      const res = await apiClient.createOrder({
        customerEmail,
        customerName,
        shippingAddress,
        currency: 'USD',
        grossAmount: parseFloat(grossAmount),
        discountAmount: parseFloat(discountAmount),
        shippingFee: parseFloat(shippingFee),
        orderStatus: 'CREATED',
      });
      setStatusMsg({
        text: `Order ${res.data.orderCode} placed in state: ${res.data.orderStatus}`,
      });
      onRefresh();
    } catch (err: any) {
      setStatusMsg({ text: `Order creation failed: ${err.message}`, error: true });
    }
  };

  const handleTransition = async (orderId: string, nextState: OrderState) => {
    setStatusMsg(null);
    try {
      const res = await apiClient.transitionOrderState(orderId, nextState);
      setStatusMsg({
        text: `State Machine transitioned ${res.data.orderCode} to: ${res.data.orderStatus}`,
      });
      onRefresh();
    } catch (err: any) {
      setStatusMsg({
        text: `State Transition Failed (${err.status}): ${err.message}`,
        error: true,
      });
    }
  };

  const handleDelete = async (orderId: string) => {
    setStatusMsg(null);
    try {
      await apiClient.deleteOrder(orderId);
      setStatusMsg({ text: `Order deleted successfully.` });
      onRefresh();
    } catch (err: any) {
      setStatusMsg({
        text: `Deletion Rejected (${err.status || 422}): ${err.message}`,
        error: true,
      });
    }
  };

  const handlePayment = async (orderCode: string) => {
    setStatusMsg(null);
    try {
      const idempotencyKey = `idem-${orderCode}-uuidv7`;
      const res = await apiClient.createPaymentTransaction(
        {
          orderCode,
          paymentMethod: 'CREDIT_CARD',
          amount: 364.99,
          currency: 'USD',
          status: 'SUCCESS',
          gatewayProvider: 'STRIPE_GLOBAL',
          gatewayResponseCode: 'AUTH_200',
        },
        idempotencyKey
      );
      setStatusMsg({
        text: `Idempotent payment recorded: ${res.data.transactionReference} for ${orderCode}`,
      });
      onRefresh();
    } catch (err: any) {
      setStatusMsg({ text: `Payment error: ${err.message}`, error: true });
    }
  };

  const getStatusBadge = (status: OrderState) => {
    switch (status) {
      case 'CREATED':
        return <span className="badge badge-warning">CREATED</span>;
      case 'PENDING_PAYMENT':
        return <span className="badge badge-warning">PENDING PAYMENT</span>;
      case 'CONFIRMED':
        return <span className="badge badge-info">CONFIRMED</span>;
      case 'ALLOCATED':
        return <span className="badge badge-info">ALLOCATED</span>;
      case 'SHIPPED':
        return <span className="badge badge-success">SHIPPED</span>;
      case 'DELIVERED':
        return <span className="badge badge-success">DELIVERED</span>;
      default:
        return <span className="badge badge-danger">{status}</span>;
    }
  };

  return (
    <div className="card" data-testid="order-manager-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🔄 Order Finite State Machine &amp; Idempotency</h2>
        <button onClick={onRefresh} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
          Refresh
        </button>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Demonstrates <code>@StateMachine</code> transitions, deletion safeguards on non-deletable states, and <code>@Idempotent</code> payment ledger.
      </p>

      {statusMsg && (
        <div
          data-testid="order-status-msg"
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

      {canCreateOrder && (
        <form onSubmit={handleCreateOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Customer Email</label>
            <input
              data-testid="input-order-email"
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Customer Name</label>
            <input
              data-testid="input-order-name"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Shipping Address</label>
            <input
              data-testid="input-order-address"
              type="text"
              required
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Gross ($)</label>
            <input
              data-testid="input-order-gross"
              type="number"
              step="0.01"
              required
              value={grossAmount}
              onChange={(e) => setGrossAmount(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }}
            />
          </div>
          <button data-testid="btn-create-order" type="submit" className="btn-primary">
            + Place Order
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Order Code</th>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Lifecycle State</th>
            <th>State Machine Transition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody data-testid="order-list-body">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                No orders registered.
              </td>
            </tr>
          ) : (
            orders.map((o, idx) => (
              <tr key={o.id || idx}>
                <td><strong>{o.orderCode}</strong></td>
                <td>{o.customerName} ({o.customerEmail})</td>
                <td><strong style={{ color: '#15803d' }}>${o.totalAmount || 364.99}</strong></td>
                <td data-testid={`order-status-${o.orderCode}`}>{getStatusBadge(o.orderStatus)}</td>
                <td>
                  {canTransition && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {o.orderStatus === 'CREATED' && (
                        <button
                          data-testid={`btn-trans-pending-${o.orderCode}`}
                          onClick={() => o.id && handleTransition(o.id, 'PENDING_PAYMENT')}
                          className="btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          &rarr; PENDING_PAYMENT
                        </button>
                      )}
                      {o.orderStatus === 'PENDING_PAYMENT' && (
                        <button
                          data-testid={`btn-trans-confirmed-${o.orderCode}`}
                          onClick={() => o.id && handleTransition(o.id, 'CONFIRMED')}
                          className="btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          &rarr; CONFIRM
                        </button>
                      )}
                      {o.orderStatus === 'CONFIRMED' && (
                        <button
                          data-testid={`btn-trans-allocated-${o.orderCode}`}
                          onClick={() => o.id && handleTransition(o.id, 'ALLOCATED')}
                          className="btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          &rarr; ALLOCATE
                        </button>
                      )}
                      {o.orderStatus === 'ALLOCATED' && (
                        <button
                          data-testid={`btn-trans-shipped-${o.orderCode}`}
                          onClick={() => o.id && handleTransition(o.id, 'SHIPPED')}
                          className="btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          &rarr; SHIP
                        </button>
                      )}
                      {o.orderStatus === 'SHIPPED' && (
                        <button
                          data-testid={`btn-trans-delivered-${o.orderCode}`}
                          onClick={() => o.id && handleTransition(o.id, 'DELIVERED')}
                          className="btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          &rarr; DELIVER
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      data-testid={`btn-pay-${o.orderCode}`}
                      onClick={() => o.orderCode && handlePayment(o.orderCode)}
                      className="btn-secondary"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      💳 Pay
                    </button>
                    {canDelete && (
                      <button
                        data-testid={`btn-delete-${o.orderCode}`}
                        onClick={() => o.id && handleDelete(o.id)}
                        className="btn-danger"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
