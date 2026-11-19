import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  Scale,
  DollarSign,
  Truck,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Radio,
} from 'lucide-react';

const AGENTS = [
  {
    id: 'fraud',
    name: 'FraudSentinel',
    role: 'Risk & Identity Guard',
    icon: ShieldAlert,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    status: 'ACTIVE',
  },
  {
    id: 'logistics',
    name: 'LogisticsAuditor',
    role: 'Carrier GPS & Telemetry',
    icon: Truck,
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.15)',
    status: 'ACTIVE',
  },
  {
    id: 'pricing',
    name: 'PricingStrategist',
    role: 'Margin & Concession Analyst',
    icon: DollarSign,
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.15)',
    status: 'ACTIVE',
  },
  {
    id: 'legal',
    name: 'LegalArbitrator',
    role: 'Statutory Defense & Precedent',
    icon: Scale,
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.15)',
    status: 'ACTIVE',
  },
];

export default function MultiAgentWarRoom() {
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [riskTolerance, setRiskTolerance] = useState(30); // 0 (Conservative) - 100 (Aggressive)
  const [maxConcession, setMaxConcession] = useState(15); // %
  const [consensusScore, setConsensusScore] = useState(98);
  const [consensusDecision, setConsensusDecision] = useState('DEFEND_AND_ENFORCE');

  const [deliberationLogs, setDeliberationLogs] = useState([
    {
      agent: 'FraudSentinel',
      color: '#ef4444',
      message: 'Scanned device fingerprint and transaction velocity. Anomaly score: 12/100 (LOW RISK). Buyer account is in good standing.',
      vote: 'DEFEND',
      time: '16:40:12',
    },
    {
      agent: 'LogisticsAuditor',
      color: '#38bdf8',
      message: 'Verified BlueDart AWB #BLR-892019482. Dropoff GPS (12.9716, 77.5946) matches delivery zone within 15m radius. Signature: M. Vance.',
      vote: 'DEFEND',
      time: '16:40:13',
    },
    {
      agent: 'PricingStrategist',
      color: '#22c55e',
      message: 'Evaluated product SKU margins. Cost of defense is less than 4% of item value. Recommending strong refute rather than concession.',
      vote: 'DEFEND',
      time: '16:40:14',
    },
    {
      agent: 'LegalArbitrator',
      color: '#a855f7',
      message: 'Precedent match confirmed with PayPal Seller Protection §11.2. Statutory proof requirements fully met. Consensus verified.',
      vote: 'DEFEND',
      time: '16:40:15',
    },
  ]);

  const handleRunDeliberation = () => {
    setIsDeliberating(true);
    setDeliberationLogs([]);

    const script = [
      {
        agent: 'FraudSentinel',
        color: '#ef4444',
        message: `Analyzing debtor behavior under ${riskTolerance < 40 ? 'CONSERVATIVE' : 'BALANCED'} policy profile. Zero fraud flags detected.`,
        vote: 'DEFEND',
      },
      {
        agent: 'LogisticsAuditor',
        color: '#38bdf8',
        message: 'Carrier GPS telemetry reconciled. Verified physical delivery signature matches billing customer record.',
        vote: 'DEFEND',
      },
      {
        agent: 'PricingStrategist',
        color: '#22c55e',
        message: `Policy ceiling check: Concession cap set at ${maxConcession}%. Automated voucher not required as seller evidence is watertight.`,
        vote: 'DEFEND',
      },
      {
        agent: 'LegalArbitrator',
        color: '#a855f7',
        message: 'Statutory affidavit compiled. 4/4 unanimous votes recorded. Sealing defense recommendation.',
        vote: 'DEFEND',
      },
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < script.length) {
        const item = script[step];
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        setDeliberationLogs((prev) => [...prev, { ...item, time: timeStr }]);
        step++;
      } else {
        clearInterval(interval);
        setIsDeliberating(false);
        setConsensusScore(100);
        setConsensusDecision('UNANIMOUS DEFENSE AUTHORIZED');
      }
    }, 600);
  };

  return (
    <div style={{
      background: '#0d1527',
      border: '1px solid #1e293b',
      borderRadius: '16px',
      padding: '24px',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '16px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)',
            color: '#000000',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Users size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>
              Multi-Agent Collaborative War Room
            </h3>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Autonomous Peer-to-Peer Consensus Engine • 4 Specialized AI Agents
            </span>
          </div>
        </div>

        <button
          onClick={handleRunDeliberation}
          disabled={isDeliberating}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: isDeliberating ? '#1e293b' : '#38bdf8',
            color: isDeliberating ? '#64748b' : '#000000',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: isDeliberating ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Play size={13} fill={isDeliberating ? 'none' : '#000000'} />
          <span>{isDeliberating ? 'Agents Deliberating...' : 'Trigger Multi-Agent Deliberation'}</span>
        </button>
      </div>

      {/* 4 Agent Status Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '20px',
      }}>
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.id}
              style={{
                background: '#101a30',
                border: '1px solid #1e293b',
                borderRadius: '10px',
                padding: '12px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{
                  background: agent.bg,
                  color: agent.color,
                  padding: '6px',
                  borderRadius: '6px',
                }}>
                  <Icon size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>{agent.name}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>{agent.role}</div>
                </div>
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '9px',
                fontWeight: 700,
                color: '#22c55e',
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#22c55e' }} />
                <span>ONLINE & MONITORED</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Policy Governance Sliders */}
      <div style={{
        background: '#070b14',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
      }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Risk Tolerance Profile</span>
            <strong style={{ color: '#38bdf8' }}>{riskTolerance < 40 ? 'Conservative' : riskTolerance < 70 ? 'Balanced' : 'Aggressive'} ({riskTolerance}%)</strong>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#38bdf8' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Autonomous Concession Ceiling</span>
            <strong style={{ color: '#22c55e' }}>{maxConcession}% Max Margin</strong>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            value={maxConcession}
            onChange={(e) => setMaxConcession(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#22c55e' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
            Active Consensus State
          </div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
            {consensusDecision} ({consensusScore}%)
          </div>
        </div>
      </div>

      {/* Live Peer-to-Peer Agent Deliberation Feed */}
      <div style={{
        background: '#070b14',
        border: '1px solid #1e293b',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '10px 14px',
          background: '#0a0f1d',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.5px' }}>
            PEER-TO-PEER AGENT CONSENSUS PROTOCOL
          </span>
          <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 600 }}>
            ✓ 4 Agents Connected & Synced
          </span>
        </div>

        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {deliberationLogs.map((log, idx) => (
            <div
              key={idx}
              style={{
                background: '#101a30',
                borderLeft: `3px solid ${log.color}`,
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '12px',
                lineHeight: 1.4,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: log.color }}>{log.agent}</span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>[{log.time}] • Vote: <strong style={{ color: '#22c55e' }}>{log.vote}</strong></span>
              </div>
              <div style={{ color: '#cbd5e1' }}>{log.message}</div>
            </div>
          ))}

          {isDeliberating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '12px', padding: '6px' }}>
              <span className="step-dot current" style={{ width: '6px', height: '6px', background: '#38bdf8', borderRadius: '50%' }} />
              <span>Agents reaching mathematical consensus on blockchain evidence...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
