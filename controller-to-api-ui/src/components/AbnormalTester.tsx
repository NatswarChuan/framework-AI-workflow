import React, { useState } from 'react';

interface AbnormalTesterProps {
  token?: string | null;
}

export const AbnormalTester: React.FC<AbnormalTesterProps> = ({ token = null }) => {
  const [result, setResult] = useState<{ status: number; code?: string; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const authHeaders = (contentType?: string): Record<string, string> => {
    const headers: Record<string, string> = {};
    if (contentType) headers['Content-Type'] = contentType;
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const runTest = async (execute: () => Promise<Response>) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await execute();
      const body = await res.json().catch(() => ({}));
      setResult({
        status: res.status,
        code: body.code || 'UNKNOWN',
        message: body.message || `HTTP ${res.status}`,
      });
    } catch (err: any) {
      setResult({
        status: 0,
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" data-testid="abnormal-tester-card">
      <h2>🛡️ Abnormal Scenarios &amp; Safeguard Verification Suite</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Live interactive verification of the universal framework standardizing all non-happy paths into unified <code>ApiResponse</code>.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          data-testid="btn-test-401"
          onClick={() =>
            runTest(() =>
              fetch('/api/v1/e-commerce-orders', { method: 'GET' })
            )
          }
          className="btn-secondary"
        >
          🚨 401 Unauthorized
        </button>

        <button
          data-testid="btn-test-403"
          onClick={() =>
            runTest(async () => {
              const uRes = await fetch('/api/v1/auth/token?username=consumer.tanaka&role=ROLE_USER', { method: 'POST' });
              const uBody = await uRes.json();
              const uToken = uBody.data?.token;
              return fetch('/api/v1/vendor-stores', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${uToken}`,
                },
                body: JSON.stringify({ storeName: 'Hacker Store', businessLicense: 'BL-HACK' }),
              });
            })
          }
          className="btn-secondary"
        >
          🚨 403 Forbidden
        </button>

        <button
          data-testid="btn-test-404"
          onClick={() =>
            runTest(() =>
              fetch('/api/v1/vendor-stores/018e38f4-9999-7999-8999-999999999999', {
                method: 'GET',
                headers: authHeaders(),
              })
            )
          }
          className="btn-secondary"
        >
          🚨 404 Not Found
        </button>

        <button
          data-testid="btn-test-405"
          onClick={() =>
            runTest(() =>
              fetch('/api/v1/inventory-stocks/018e38f4-0000-7000-8000-000000000000/increment', {
                method: 'POST',
                headers: authHeaders('application/json'),
                body: '{}',
              })
            )
          }
          className="btn-secondary"
        >
          🚨 405 Method Not Allowed
        </button>

        <button
          data-testid="btn-test-415"
          onClick={() =>
            runTest(() =>
              fetch('/api/v1/vendor-stores', {
                method: 'POST',
                headers: authHeaders('text/plain'),
                body: 'Plain text payload',
              })
            )
          }
          className="btn-secondary"
        >
          🚨 415 Unsupported Media Type
        </button>

        <button
          data-testid="btn-test-400-json"
          onClick={() =>
            runTest(() =>
              fetch('/api/v1/vendor-stores', {
                method: 'POST',
                headers: authHeaders('application/json'),
                body: '{"brokenJson": true',
              })
            )
          }
          className="btn-secondary"
        >
          🚨 400 Malformed JSON
        </button>
      </div>

      {loading && <p style={{ color: 'var(--primary)' }}>Executing live scenario test...</p>}

      {result && (
        <div
          data-testid="abnormal-result-box"
          style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            background: '#1e293b',
            color: 'white',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
          }}
        >
          <div>
            <strong>HTTP Status:</strong>{' '}
            <span
              data-testid="abnormal-status-code"
              style={{
                color:
                  result.status >= 400 && result.status < 500
                    ? '#f59e0b'
                    : result.status >= 500
                    ? '#ef4444'
                    : '#10b981',
              }}
            >
              {result.status}
            </span>
          </div>
          <div>
            <strong>Error Code:</strong> <span data-testid="abnormal-error-code">{result.code}</span>
          </div>
          <div>
            <strong>Server Message:</strong> {result.message}
          </div>
        </div>
      )}
    </div>
  );
};
