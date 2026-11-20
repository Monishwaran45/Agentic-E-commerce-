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

const MISSION_CARDS = [
  {
    id: 'shopping',
    category: 'store',
    title: 'Shop with AI Friend',
    tag: 'EASY & FUN',
    tagColor: '#38bdf8',
    icon: ShoppingBag,
    color: '#38bdf8',
    bg: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%)',
    border: 'rgba(56, 189, 248, 0.3)',
    summary: 'Chat with smart AI! Speak in Hindi or Tamil, snap a photo of any sneaker, or ask for a special discount.',
    features: ['Speak in 5 Indian languages', 'Snap photo to search ("Snap to Shop")', 'Ask for dynamic discounts'],
    btnLabel: 'Start Shopping',
  },
  {
    id: 'disputes',
    category: 'disputes',
    title: 'Delivery Map & Dispute Solver',
    tag: 'REAL SATELLITE GPS',
    tagColor: '#a855f7',
    icon: MapPin,
    color: '#a855f7',
    bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.05) 100%)',
    border: 'rgba(168, 85, 247, 0.3)',
    summary: 'Look at a real GPS satellite map with courier breadcrumbs and customer signatures proving delivery.',
    features: ['15-meter circular delivery zone', 'Digital signature canvas', 'Print official certificate (PDF)'],
    btnLabel: 'View Delivery Map',
  },
  {
    id: 'war_room',
    category: 'robots',
    title: '4 AI Robots War Room',
    tag: 'ROBOT TEAMWORK',
    tagColor: '#22c55e',
    icon: Users,
    color: '#22c55e',
    bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.05) 100%)',
    border: 'rgba(34, 197, 94, 0.3)',
    summary: 'Watch 4 AI robots (Security Guard, Truck Driver, Pricing Helper, and Legal Expert) talk and vote together.',
    features: ['Peer-to-peer robot chat', '100% agreement consensus meter', 'Sliders to change robot rules'],
    btnLabel: 'Enter War Room',
  },
  {
    id: 'omnichannel',
    category: 'robots',
    title: 'Customer WhatsApp Phone',
    tag: 'INTERACTIVE SMARTPHONE',
    tagColor: '#10b981',
    icon: Smartphone,
    color: '#10b981',
    bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
    border: 'rgba(16, 185, 129, 0.3)',
    summary: 'Play with a simulated smartphone! Chat on WhatsApp, split payments, and hear synthetic voice calls.',
    features: ['Realistic WhatsApp & SMS simulator', 'Split installment payments', 'Live voice phone call audio'],
    btnLabel: 'Open Phone Mockup',
  },
  {
    id: 'ledger',
    category: 'vault',
    title: 'Tamper-Proof Lockbox (Vault)',
    tag: 'BLOCKCHAIN SECURITY',
    tagColor: '#f59e0b',
    icon: Lock,
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)',
    border: 'rgba(245, 158, 11, 0.3)',
    summary: 'A chain of digital lockboxes protecting money. Try to change the numbers and watch the red alarm sound!',
    features: ['SHA-256 cryptographic chain', 'Simulate fake hacker attack', 'Restore integrity with 1 click'],
    btnLabel: 'Test Digital Vault',
  },
  {
    id: 'red_team',
    category: 'vault',
    title: 'Hacker Defense Sandbox',
    tag: 'SHIELD TEST',
    tagColor: '#ef4444',
    icon: Bug,
    color: '#ef4444',
    bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)',
    border: 'rgba(239, 68, 68, 0.3)',
    summary: 'Fire pretend hacker tricks at our system and see our shields block every trick in under 15 milliseconds.',
    features: ['Test Prompt Injections & Jailbreaks', 'Test Expired Token Replay', 'Block speed race attacks'],
    btnLabel: 'Launch Pretend Attacks',
  },
];

export default function SimpleMissionHub({ onNavigate }) {
  return (
    <div style={{
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Friendly Hero Banner */}
      <div style={{
        background: 'radial-gradient(ellipse at top, #1e293b 0%, #0d1527 100%)',
        border: '1px solid #334155',
        borderRadius: '20px',
        padding: '28px 32px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
      }}>
        <div style={{ maxWidth: '620px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38bdf8',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            marginBottom: '10px',
          }}>
            <Sparkles size={13} />
            <span>KIDS & BEGINNERS FRIENDLY EXPLORER</span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', color: '#f8fafc', letterSpacing: '-0.5px' }}>
            Welcome to Agentic E-Commerce!
          </h2>
          <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
            Everything is simple and safe here! Pick any mission below to see our AI shop, resolve delivery disputes, talk on WhatsApp, or test our unbreakable digital vault.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '14px 20px',
          alignItems: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>10,000+</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Catalog Items</div>
          </div>
          <div style={{ width: '1px', height: '30px', background: '#334155' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#22c55e' }}>₹10,000</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Safety Cap</div>
          </div>
          <div style={{ width: '1px', height: '30px', background: '#334155' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#a855f7' }}>4 AI</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Robots Working</div>
          </div>
        </div>
      </div>

      {/* Grid of 6 Friendly Big Mission Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
      }}>
        {MISSION_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              style={{
                background: card.bg,
                border: `1px solid ${card.border}`,
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: card.color,
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 16px ${card.color}66`,
                  }}>
                    <Icon size={20} strokeWidth={2.5} />
                  </div>

                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: `${card.tagColor}22`,
                    color: card.tagColor,
                    border: `1px solid ${card.tagColor}44`,
                  }}>
                    {card.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc', margin: '0 0 8px 0' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                  {card.summary}
                </p>

                {/* Friendly bullet tags */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {card.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: card.color }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate(card.id)}
                style={{
                  width: '100%',
                  background: card.color,
                  color: '#000000',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: `0 4px 14px ${card.color}44`,
                  transition: 'opacity 0.15s ease',
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
