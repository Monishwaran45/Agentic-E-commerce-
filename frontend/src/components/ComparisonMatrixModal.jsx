import React from 'react';
import { Scale, X, ShoppingBag, CheckCircle2, AlertCircle, Sparkles, Trophy } from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=800&auto=format&fit=crop&q=80';

export default function ComparisonMatrixModal({ items = [], onClose, onSelectProduct, onAskAgent }) {
  if (!items || items.length < 2) return null;

  // Determine Best Value pick (lowest price with available stock)
  const inStockItems = items.filter((i) => (i.stock || 0) > 0);
  const bestValueItem = inStockItems.length > 0
    ? [...inStockItems].sort((a, b) => (a.price || 0) - (b.price || 0))[0]
    : items[0];

  const minPrice = Math.min(...items.map((i) => i.price || 0));

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content comparison-matrix-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '860px', width: '92%' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(2, 132, 199, 0.15)',
                color: 'var(--accent-uber-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Scale size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Side-by-Side Product Comparison
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Comparing {items.length} products with live stock & price analysis
              </span>
            </div>
          </div>
          <button type="button" className="icon-btn close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Matrix Table */}
        <div className="comparison-table-wrapper" style={{ overflowX: 'auto', padding: '20px' }}>
          <table className="comparison-matrix-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ width: '180px', textAlign: 'left', padding: '12px 14px', color: 'var(--text-muted)', fontSize: '12px' }}>
                  Attribute
                </th>
                {items.map((item) => {
                  const isWinner = item.sku === bestValueItem?.sku;
                  return (
                    <th
                      key={item.sku}
                      style={{
                        textAlign: 'center',
                        padding: '12px 14px',
                        background: isWinner ? 'rgba(2, 132, 199, 0.05)' : 'transparent',
                        borderRadius: '12px 12px 0 0',
                        position: 'relative',
                      }}
                    >
                      {isWinner && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: 'var(--accent-uber-blue)',
                            color: '#ffffff',
                            fontSize: '10px',
                            fontWeight: 800,
                            letterSpacing: '0.4px',
                            marginBottom: '8px',
                          }}
                        >
                          <Trophy size={11} />
                          <span>AI VALUE PICK</span>
                        </div>
                      )}
                      <div style={{ width: '90px', height: '90px', margin: '0 auto 8px auto', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg-subtle)' }}>
                        <img
                          src={item.image || DEFAULT_FALLBACK_IMAGE}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
                        {item.name}
                      </div>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                        SKU: {item.sku}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Price */}
              <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Price (INR)
                </td>
                {items.map((item) => {
                  const isLowest = (item.price || 0) === minPrice;
                  return (
                    <td
                      key={item.sku}
                      style={{
                        textAlign: 'center',
                        padding: '12px 14px',
                        background: item.sku === bestValueItem?.sku ? 'rgba(2, 132, 199, 0.05)' : 'transparent',
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                        ₹{Number(item.price || 0).toLocaleString('en-IN')}
                      </div>
                      {isLowest && items.length > 1 && (
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-success)' }}>
                          ✓ Lowest Price
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row 2: Stock Availability */}
              <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Stock Status
                </td>
                {items.map((item) => (
                  <td
                    key={item.sku}
                    style={{
                      textAlign: 'center',
                      padding: '12px 14px',
                      background: item.sku === bestValueItem?.sku ? 'rgba(2, 132, 199, 0.05)' : 'transparent',
                    }}
                  >
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: (item.stock || 0) > 0 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: (item.stock || 0) > 0 ? 'var(--accent-success)' : 'var(--accent-blocked)',
                      }}
                    >
                      {(item.stock || 0) > 0 ? `✓ ${item.stock} Available` : 'Out of Stock'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 3: Category */}
              <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Category
                </td>
                {items.map((item) => (
                  <td
                    key={item.sku}
                    style={{
                      textAlign: 'center',
                      padding: '12px 14px',
                      fontSize: '12px',
                      color: 'var(--text-main)',
                      textTransform: 'capitalize',
                      background: item.sku === bestValueItem?.sku ? 'rgba(2, 132, 199, 0.05)' : 'transparent',
                    }}
                  >
                    {item.category || 'General'}
                  </td>
                ))}
              </tr>

              {/* Row 4: Tags & Features */}
              <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Tags / Features
                </td>
                {items.map((item) => (
                  <td
                    key={item.sku}
                    style={{
                      textAlign: 'center',
                      padding: '12px 14px',
                      background: item.sku === bestValueItem?.sku ? 'rgba(2, 132, 199, 0.05)' : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      {(item.tags || []).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'var(--bg-subtle)',
                            color: 'var(--text-dim)',
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 5: Guardrail Spend Cap */}
              <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  ₹10,000 Cap Check
                </td>
                {items.map((item) => {
                  const underCap = (item.price || 0) <= 10000;
                  return (
                    <td
                      key={item.sku}
                      style={{
                        textAlign: 'center',
                        padding: '12px 14px',
                        background: item.sku === bestValueItem?.sku ? 'rgba(2, 132, 199, 0.05)' : 'transparent',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: underCap ? 'var(--accent-success)' : 'var(--accent-blocked)',
                        }}
                      >
                        {underCap ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                        <span>{underCap ? 'PASSED (Under Cap)' : 'BLOCKED (Exceeds Cap)'}</span>
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 6: Instant Action */}
              <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px', fontWeight: 700, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Action
                </td>
                {items.map((item) => {
                  const isOutOfStock = (item.stock || 0) === 0;
                  return (
                    <td
                      key={item.sku}
                      style={{
                        textAlign: 'center',
                        padding: '14px',
                        background: item.sku === bestValueItem?.sku ? 'rgba(2, 132, 199, 0.05)' : 'transparent',
                        borderRadius: '0 0 12px 12px',
                      }}
                    >
                      <button
                        type="button"
                        className="buy-now-btn"
                        disabled={isOutOfStock}
                        style={{ width: '100%', padding: '8px 12px', fontSize: '12px' }}
                        onClick={() => {
                          onSelectProduct(item, 1);
                          onClose();
                        }}
                      >
                        <ShoppingBag size={13} />
                        <span>{isOutOfStock ? 'Out of Stock' : `Select & Checkout`}</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

