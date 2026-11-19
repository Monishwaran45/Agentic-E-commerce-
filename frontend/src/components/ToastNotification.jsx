import React, { useState, useEffect } from 'react';
import { eventBus } from '../services/eventBus';
import { ShieldAlert, ShieldCheck, Zap, Bell, CheckCircle2, X } from 'lucide-react';

export default function ToastNotification() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe('*', ({ type, payload }) => {
      let toastItem = null;

      if (type === 'BUDGET_OVERRIDE_REQUESTED') {
        toastItem = {
          id: Date.now(),
          title: 'High-Value Spend Elevation Requested',
          message: `Customer ${payload.customerName || 'Shopper'} requested ₹${((payload.amount || 0) / 100).toLocaleString('en-IN')} elevation.`,
          type: 'warning',
          icon: ShieldAlert,
        };
      } else if (type === 'BUDGET_OVERRIDE_APPROVED') {
        toastItem = {
          id: Date.now(),
          title: 'Spend Elevation Approved by Merchant!',
          message: `Voucher ${payload.voucherCode || 'OVERRIDE_APPROVED'} applied. Spend ceiling elevated!`,
          type: 'success',
          icon: ShieldCheck,
        };
      } else if (type === 'DISPUTE_SIMULATED') {
        toastItem = {
          id: Date.now(),
          title: 'PayPal Dispute Ingested',
          message: `Dispute ${payload.disputeId} generated. Autonomous evidence engine engaged.`,
          type: 'info',
          icon: Zap,
        };
      } else if (type === 'BARGAIN_OFFER_CLAIMED') {
        toastItem = {
          id: Date.now(),
          title: 'Dynamic Concession Applied!',
          message: `Merchant discount ${payload.discount || '15%'} added to your cart checkout.`,
          type: 'success',
          icon: CheckCircle2,
        };
      }

      if (toastItem) {
        setToasts((prev) => [...prev, toastItem]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toastItem.id));
        }, 5000);
      }
    });

    return () => unsubscribe();
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none',
    }}>
      {toasts.map((toast) => {
        const Icon = toast.icon || Bell;
        const isSuccess = toast.type === 'success';
        const isWarn = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: '#0d1527',
              border: `1px solid ${isSuccess ? '#22c55e' : isWarn ? '#f59e0b' : '#38bdf8'}`,
              borderRadius: '10px',
              padding: '12px 16px',
              minWidth: '300px',
              maxWidth: '380px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'slideInRight 0.25s ease',
            }}
          >
            <div style={{
              background: isSuccess ? 'rgba(34, 197, 94, 0.2)' : isWarn ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)',
              color: isSuccess ? '#22c55e' : isWarn ? '#f59e0b' : '#38bdf8',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>{toast.title}</div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px', lineHeight: 1.4 }}>{toast.message}</div>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
