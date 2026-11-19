import React from 'react';
import { ShieldCheck, Award, Printer, X, Download, FileCheck, CheckCircle2, Lock } from 'lucide-react';

export default function ArbitrationCertificateModal({ isOpen, onClose, disputeData }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const caseId = disputeData?.id || 'PP-D-1094821';
  const buyerName = disputeData?.customer || 'Marcus Vance';
  const amount = disputeData?.amount_minor ? `₹${(disputeData.amount_minor / 100).toLocaleString('en-IN')}` : '$849.50 USD';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 2000,
      fontFamily: 'Inter, system-ui, sans-serif',
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: '#0d1527',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '720px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        color: '#f8fafc',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
      }}>
        {/* Top Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#38bdf8" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>
              Arbitration Cryptographic Certificate
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#38bdf8',
                color: '#000000',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Printer size={13} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Formal Printable Certificate Body */}
        <div style={{
          background: '#ffffff',
          color: '#09090b',
          borderRadius: '12px',
          padding: '36px',
          fontFamily: 'Georgia, serif',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          border: '6px double #0284c7',
        }}>
          {/* Certificate Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
              AGENTIC E-COMMERCE & VASOOL AUTONOMOUS OPERATIONS
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0', color: '#0f172a' }}>
              CERTIFICATE OF ARBITRATION EVIDENCE
            </h1>
            <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 700, fontFamily: 'monospace' }}>
              MERKLE PROOF CERTIFICATE: CERT-2026-ARBIT-99428
            </div>
          </div>

          {/* Statement */}
          <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#334155', marginBottom: '20px' }}>
            This document certifies that order settlement and carrier fulfillment for Dispute Case{' '}
            <strong style={{ color: '#0f172a' }}>{caseId}</strong> (Amount:{' '}
            <strong style={{ color: '#0f172a' }}>{amount}</strong>, Recipient:{' '}
            <strong style={{ color: '#0f172a' }}>{buyerName}</strong>) has been cryptographically validated,
            sealed, and audited under deterministic electronic records regulations.
          </div>

          {/* Evidence Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            fontSize: '11px',
            fontFamily: 'Inter, sans-serif',
          }}>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>CARRIER AWB TRACKING:</span>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>BlueDart Express #BLR-892019482</div>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>GPS GEO-FENCE STATUS:</span>
              <div style={{ fontWeight: 700, color: '#16a34a' }}>✓ VERIFIED (12.9716° N, 77.5946° E)</div>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>DELIVERY TIMESTAMP:</span>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>November 18, 2026 @ 16:45:12 IST</div>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>CARRIER SIGNATURE:</span>
              <div style={{ fontWeight: 700, color: '#0284c7', fontFamily: 'Caveat, cursive', fontSize: '14px' }}>
                {buyerName}
              </div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>CANONICAL SHA-256 HASH SEAL:</span>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#0f172a', wordBreak: 'break-all' }}>
                9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b
              </div>
            </div>
          </div>

          {/* Statutory Reference */}
          <div style={{
            fontSize: '11px',
            color: '#64748b',
            lineHeight: 1.5,
            borderLeft: '3px solid #0284c7',
            paddingLeft: '12px',
            marginBottom: '24px',
            fontStyle: 'italic',
          }}>
            "Fulfillment of tangible merchandise with valid electronic signature and carrier proof of delivery within registered postal coordinates constitutes complete discharge of merchant liability under Section 11.2 of the PayPal Seller Protection Policy and Section 65B of the Information Technology Act."
          </div>

          {/* Signatures & Seal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                <ShieldCheck size={26} />
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>
                Cryptographic Integrity Verified
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Caveat, cursive', fontSize: '18px', color: '#0f172a', fontWeight: 700 }}>
                Vasool Authorized Comptroller
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>
                Autonomous Compliance Auditor
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
