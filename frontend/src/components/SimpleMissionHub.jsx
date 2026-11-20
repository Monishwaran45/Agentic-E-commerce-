import React from 'react';
import {
  ShoppingBag,
  Scale,
  Users,
  Smartphone,
  Database,
  Bug,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Camera,
  MapPin,
  Lock,
  Phone,
  Zap,
} from 'lucide-react';

const WORKSPACE_CARDS = [
  {
    id: 'shopping',
    category: 'store',
    title: 'AI Shopping Assistant',
    tag: 'CONVERSATIONAL COMMERCE',
    tagColor: '#38bdf8',
    icon: ShoppingBag,
    color: '#38bdf8',
    bg: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(14, 165, 233, 0.03) 100%)',
    border: 'rgba(56, 189, 248, 0.25)',
    summary: 'Voice-driven conversational commerce powered by Gnani Indic speech, Snap to Shop visual search, and autonomous price negotiation.',
    features: [
      'Indic speech recognition in 5 languages',
      'Multimodal image search (Snap to Shop)',
      'Autonomous price negotiation & vouchers',
    ],
    btnLabel: 'Launch Assistant',
  },
  {
    id: 'disputes',
    category: 'disputes',
    title: 'PayPal Dispute Center & GPS',
    tag: 'CARRIER TELEMETRY',
    tagColor: '#a855f7',
    icon: MapPin,
    color: '#a855f7',
    bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(147, 51, 234, 0.03) 100%)',
    border: 'rgba(168, 85, 247, 0.25)',
    summary: 'Carrier GPS drop-off verification featuring 15-meter geofence circles, courier breadcrumbs, and digital recipient signatures.',
    features: [
      '15-meter circular delivery geofences',
      'Cryptographic recipient signatures',
      'One-click arbitration certificate export',
    ],
    btnLabel: 'Open Dispute Center',
  },
  {
    id: 'war_room',
    category: 'robots',
    title: 'Multi-Agent Consensus War Room',
    tag: 'MULTI-AGENT DELIBERATION',
    tagColor: '#22c55e',
    icon: Users,
    color: '#22c55e',
    bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(22, 163, 74, 0.03) 100%)',
    border: 'rgba(34, 197, 94, 0.25)',
    summary: 'Four specialized autonomous agents (FraudSentinel, LogisticsAuditor, PricingStrategist, LegalArbitrator) debate and vote on chargebacks.',
    features: [
      'Real-time peer-to-peer agent messaging',
      '100% unanimous consensus scoring',
      'Tunable risk & policy sensitivity controls',
    ],
    btnLabel: 'Enter War Room',
  },
  {
    id: 'omnichannel',
    category: 'robots',
    title: 'Omnichannel Customer Simulator',
    tag: 'MESSAGING & VOICE OPS',
    tagColor: '#10b981',
    icon: Smartphone,
    color: '#10b981',
    bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.03) 100%)',
    border: 'rgba(16, 185, 129, 0.25)',
    summary: 'Interactive smartphone mockup simulating WhatsApp recovery messages, flexible installment payment links, and outbound voice briefings.',
    features: [
      'Realistic WhatsApp & SMS chat simulation',
      'Interactive installment payment actions',
      'Gnani-powered synthetic voice read-backs',
    ],
    btnLabel: 'Launch Simulator',
  },
  {
    id: 'ledger',
    category: 'vault',
    title: 'Cryptographic Ledger & Audit',
    tag: 'SHA-256 IMMUTABILITY',
    tagColor: '#f59e0b',
    icon: Lock,
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.03) 100%)',
    border: 'rgba(245, 158, 11, 0.25)',
    summary: 'Canonical immutable transaction chain with block-by-block SHA-256 hash chaining, WebCrypto auditability, and tamper simulation.',
    features: [
      'Deterministic SHA-256 hash chaining',
      'Interactive tamper attack simulation',
      'Sub-millisecond chain integrity audit',
    ],
    btnLabel: 'Inspect Ledger',
  },
  {
    id: 'red_team',
    category: 'vault',
    title: 'Security & Red-Team Sandbox',
    tag: 'FAIL-CLOSED GOVERNANCE',
    tagColor: '#ef4444',
    icon: Bug,
    color: '#ef4444',
    bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(220, 38, 38, 0.03) 100%)',
    border: 'rgba(239, 68, 68, 0.25)',
    summary: 'Adversarial security testbed validating prompt injection resistance, expired token replay defenses, and spend cap enforcement.',
    features: [
      'Prompt injection & jailbreak testing',
      'Token TTL & replay attack defense',
      'Deterministic sub-15ms failure mitigation',
    ],
    btnLabel: 'Open Security Sandbox',
  },
];

export default function SimpleMissionHub({ onNavigate }) {
  return (
    <div style={{
      padding: '28px',
      maxWidth: '1280px',
      margin: '0 auto',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Platform Executive Header */}
      <div style={{
        background: 'radial-gradient(ellipse at top, #1e293b 0%, #0d1527 100%)',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '28px 32px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#38bdf8',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            marginBottom: '10px',
            letterSpacing: '0.04em',
          }}>
            <ShieldCheck size={13} />
            <span>ENTERPRISE MULTI-AGENT PLATFORM</span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', color: '#f8fafc', letterSpacing: '-0.5px' }}>
            Unified Operations & Commerce Workspace
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Autonomous conversational commerce, multi-agent dispute resolution, and verifiable cryptographic ledgers. Select any module below to inspect or operate.
          </p>
        </div>

        {/* High-Level Operational Metrics */}
        <div style={{
          display: 'flex',
          gap: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '14px 22px',
          alignItems: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>10,000+</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Catalog SKUs</div>
          </div>
          <div style={{ width: '1px', height: '32px', background: '#334155' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#22c55e' }}>₹10,000</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Spend Limit</div>
          </div>
          <div style={{ width: '1px', height: '32px', background: '#334155' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#a855f7' }}>4 Agents</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Consensus Net</div>
          </div>
          <div style={{ width: '1px', height: '32px', background: '#334155' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>&lt;15ms</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Defense Gate</div>
          </div>
        </div>
      </div>

      {/* Grid of 6 Clean Workspace Module Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px',
      }}>
        {WORKSPACE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              style={{
                background: card.bg,
                border: `1px solid ${card.border}`,
                borderRadius: '14px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '18px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: `${card.color}20`,
                    border: `1px solid ${card.color}40`,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={20} strokeWidth={2.2} />
                  </div>

                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: '6px',
                    background: `${card.tagColor}15`,
                    color: card.tagColor,
                    border: `1px solid ${card.tagColor}35`,
                    letterSpacing: '0.04em',
                  }}>
                    {card.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc', margin: '0 0 8px 0' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  {card.summary}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {card.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: card.color, flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate && onNavigate(card.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '11px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${card.border}`,
                  color: '#f8fafc',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = card.color;
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.boxShadow = `0 0 16px ${card.color}66`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#f8fafc';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span>{card.btnLabel}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
