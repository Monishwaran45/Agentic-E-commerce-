import React, { useState, useEffect } from 'react';
import {
  Database,
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Hash,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

const INITIAL_BLOCKS = [
  {
    index: 0,
    type: 'GENESIS',
    ref_id: 'GENESIS-0000',
    amount_minor: 0,
    currency: 'INR',
    prev_hash: '0000000000000000000000000000000000000000000000000000000000000000',
    payload_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    block_hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    timestamp: '2026-11-15T00:00:00Z',
    status: 'VALID',
  },
  {
    index: 1,
    type: 'ORDER_AUTH',
    ref_id: 'RX-2026-0042',
    amount_minor: 420000,
    currency: 'INR',
    prev_hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    payload_hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    block_hash: '8f7e6d5c4b3a210987654321fedcba0987654321abcdef0123456789abcdef12',
    timestamp: '2026-11-15T10:14:22Z',
    status: 'VALID',
  },
  {
    index: 2,
    type: 'DISPUTE_DEFENSE',
    ref_id: 'PP-D-1094821',
    amount_minor: 84950,
    currency: 'USD',
    prev_hash: '8f7e6d5c4b3a210987654321fedcba0987654321abcdef0123456789abcdef12',
    payload_hash: '123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0',
    block_hash: '456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123',
    timestamp: '2026-11-15T12:30:00Z',
    status: 'VALID',
  },
  {
    index: 3,
    type: 'RECOVERY_SETTLEMENT',
    ref_id: 'RX-2026-0043',
    amount_minor: 1850000,
    currency: 'INR',
    prev_hash: '456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123',
    payload_hash: 'fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    block_hash: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
    timestamp: '2026-11-15T14:45:10Z',
    status: 'VALID',
  },
];

export default function CryptographicBlockExplorer() {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [tamperedIndex, setTamperedIndex] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(blocks[1]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSimulateTamper = (targetIdx = 1) => {
    setIsVerifying(true);
    setTimeout(() => {
      setTamperedIndex(targetIdx);
      setBlocks((prev) =>
        prev.map((b, idx) => {
          if (idx === targetIdx) {
            return {
              ...b,
              amount_minor: 9999900, // Altered from 420000 to 9999900!
              payload_hash: 'CORRUPTED_HASH_UNAUTHORIZED_AMOUNT_CHANGE_000',
              status: 'TAMPER_DETECTED',
            };
          }
          if (idx > targetIdx) {
            return {
              ...b,
              status: 'BROKEN_CHAIN',
            };
          }
          return b;
        })
      );
      setIsVerifying(false);
    }, 400);
  };

  const handleRestoreIntegrity = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setTamperedIndex(null);
      setBlocks(INITIAL_BLOCKS);
      setIsVerifying(false);
    }, 400);
  };

  return (
    <div style={{
      background: '#0d1527',
      border: '1px solid #1e293b',
      borderRadius: '12px',
      padding: '16px',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
    }}>
      {/* Top Header & Tamper Sandbox Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '14px',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: tamperedIndex !== null ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
            color: tamperedIndex !== null ? '#ef4444' : '#22c55e',
            padding: '8px',
            borderRadius: '8px',
            border: `1px solid ${tamperedIndex !== null ? '#ef4444' : '#22c55e'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {tamperedIndex !== null ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>
              SHA-256 Chained Cryptographic Ledger Explorer
            </h3>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Canonical Audit Chain: {blocks.length} Blocks Verified • Strict Fail-Closed Architecture
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {tamperedIndex === null ? (
            <button
              onClick={() => handleSimulateTamper(1)}
              disabled={isVerifying}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                padding: '7px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Simulate modifying a past transaction to observe instantaneous cryptographic chain rejection"
            >
              <Zap size={13} fill="#ffffff" />
              <span>Simulate Tamper Attack (Block #1)</span>
            </button>
          ) : (
            <button
              onClick={handleRestoreIntegrity}
              disabled={isVerifying}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#22c55e',
                color: '#000000',
                border: 'none',
                padding: '7px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={13} className={isVerifying ? 'spin-icon' : ''} />
              <span>Restore Cryptographic Integrity</span>
            </button>
          )}
        </div>
      </div>

      {/* Alarm Banner if Tampered */}
      {tamperedIndex !== null && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '12px 14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fca5a5' }}>
              CRITICAL CRYPTOGRAPHIC BREACH DETECTED AT BLOCK #{tamperedIndex}
            </div>
            <div style={{ fontSize: '11px', color: '#f87171', marginTop: '2px' }}>
              SHA-256 payload hash does not reconcile with downstream block previous_hash pointer. Downstream blocks broken.
              Automated recovery engine has automatically failed closed to protect merchant funds.
            </div>
          </div>
        </div>
      )}

      {/* Visual Block Chain Sequence */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '12px',
        marginBottom: '16px',
      }}>
        {blocks.map((block) => {
          const isSelected = selectedBlock?.index === block.index;
          const isAttacked = block.status === 'TAMPER_DETECTED';
          const isBroken = block.status === 'BROKEN_CHAIN';
          const isValid = block.status === 'VALID';

          return (
            <div
              key={block.index}
              onClick={() => setSelectedBlock(block)}
              style={{
                background: isAttacked
                  ? 'rgba(239, 68, 68, 0.15)'
                  : isBroken
                  ? 'rgba(245, 158, 11, 0.1)'
                  : isSelected
                  ? 'rgba(56, 189, 248, 0.15)'
                  : '#101a30',
                border: isAttacked
                  ? '2px solid #ef4444'
                  : isBroken
                  ? '1px dashed #f59e0b'
                  : isSelected
                  ? '1px solid #38bdf8'
                  : '1px solid #1e293b',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isAttacked ? '#ef4444' : isBroken ? '#f59e0b' : '#38bdf8',
                }}>
                  BLOCK #{block.index}
                </span>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: isAttacked
                    ? 'rgba(239, 68, 68, 0.25)'
                    : isBroken
                    ? 'rgba(245, 158, 11, 0.25)'
                    : 'rgba(34, 197, 94, 0.2)',
                  color: isAttacked ? '#ef4444' : isBroken ? '#f59e0b' : '#22c55e',
                }}>
                  {block.status}
                </span>
              </div>

              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>
                {block.type}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                Ref: <strong style={{ color: '#cbd5e1' }}>{block.ref_id}</strong>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#38bdf8', marginTop: '4px' }}>
                ₹{(block.amount_minor / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>

              {/* Hash snippet */}
              <div style={{
                marginTop: '8px',
                padding: '6px',
                background: '#070b14',
                borderRadius: '4px',
                fontSize: '9px',
                fontFamily: 'monospace',
                color: isAttacked ? '#f87171' : '#64748b',
                wordBreak: 'break-all',
              }}>
                SHA-256: {block.block_hash.substring(0, 16)}...
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Block Detailed Inspector */}
      {selectedBlock && (
        <div style={{
          background: '#070b14',
          border: '1px solid #1e293b',
          borderRadius: '8px',
          padding: '12px 14px',
          fontSize: '11px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            borderBottom: '1px solid #1e293b',
            paddingBottom: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 700 }}>
              <Hash size={14} />
              <span>BLOCK #{selectedBlock.index} CRYPTOGRAPHIC HEADER INSPECTOR</span>
            </div>
            <span style={{ color: '#64748b' }}>{selectedBlock.timestamp}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px', lineHeight: 1.5 }}>
            <div>
              <span style={{ color: '#64748b' }}>Previous Hash Pointer:</span>
              <div style={{ color: '#cbd5e1', wordBreak: 'break-all' }}>{selectedBlock.prev_hash}</div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Payload Canonical Hash:</span>
              <div style={{ color: selectedBlock.status === 'TAMPER_DETECTED' ? '#ef4444' : '#22c55e', wordBreak: 'break-all' }}>
                {selectedBlock.payload_hash}
              </div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Sealed Block Hash (SHA-256):</span>
              <div style={{ color: '#38bdf8', wordBreak: 'break-all' }}>{selectedBlock.block_hash}</div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>HMAC Guardrail State:</span>
              <div style={{ color: '#22c55e' }}>Single-Use Nonce Enforced (Valid 10-Min TTL)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
