import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Cpu,
  Layers,
  Terminal,
  FileCheck,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';

const PIPELINE_PHASES = [
  {
    id: 1,
    name: 'Signal Ingestion',
    agent: 'RiskEvaluator',
    description: 'Ingests transaction, calculates debtor risk delta & default probability',
    latency: '45ms',
    confidence: '98.8%',
  },
  {
    id: 2,
    name: 'Evidence Mining',
    agent: 'CarrierEvidenceBot',
    description: 'Extracts carrier GPS breadcrumbs, signed delivery receipt & order invoice',
    latency: '112ms',
    confidence: '99.4%',
  },
  {
    id: 3,
    name: 'AI Legal Defense',
    agent: 'ArbitrationSynthesizer',
    description: 'Drafts legal rebuttal citing PayPal Seller Protection §11.2 & case precedent',
    latency: '184ms',
    confidence: '97.2%',
  },
  {
    id: 4,
    name: 'Cryptographic Policy Gate',
    agent: 'PolicyEnforcer',
    description: 'Validates ₹10,000 spend-cap, single-use 10-minute token TTL & HMAC signature',
    latency: '18ms',
    confidence: '100%',
  },
  {
    id: 5,
    name: 'HITL Guardrail Gate',
    agent: 'SupervisorGuard',
    description: 'Determines if human escalation is required for threshold or concessions',
    latency: '24ms',
    confidence: '99.1%',
  },
  {
    id: 6,
    name: 'Ledger Settlement',
    agent: 'CryptographicSealer',
    description: 'Issues Razorpay/PayPal recovery token and seals SHA-256 block hash',
    latency: '36ms',
    confidence: '100%',
  },
];

export default function AutonomousPipelineTelemetry({
  activeCaseId = 'RX-2026-0042',
  amountFormatted = '₹4,200.00',
  customerName = 'Aarav Sharma',
  onComplete,
}) {
  const [activeStep, setActiveStep] = useState(6);
  const [isRunning, setIsRunning] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState([
    { time: '16:45:01', level: 'INFO', agent: 'RiskEvaluator', text: `Case ${activeCaseId} initialized for ${customerName}. Risk score computed: 72/100.` },
    { time: '16:45:02', level: 'INFO', agent: 'CarrierEvidenceBot', text: 'Queried logistics API: GPS delivery confirmed at 12.9716, 77.5946 with signature.' },
    { time: '16:45:02', level: 'INFO', agent: 'ArbitrationSynthesizer', text: 'Generated legal affidavit citing Seller Protection §11.2. Precedent match: 99.2%.' },
    { time: '16:45:03', level: 'INFO', agent: 'PolicyEnforcer', text: `Spend check: Amount ${amountFormatted} is below ₹10,000 hard ceiling. Policy PASSED.` },
    { time: '16:45:03', level: 'INFO', agent: 'SupervisorGuard', text: 'Autonomous recovery authorized without manual human intervention.' },
    { time: '16:45:04', level: 'SUCCESS', agent: 'CryptographicSealer', text: 'Settlement link sealed into Canonical SHA-256 Chained Ledger (Hash: 9a8b7c6d5e).' },
  ]);

  const handleSimulateRun = (withAnomaly = false) => {
    setIsRunning(true);
    setActiveStep(1);
    setTelemetryLogs([]);

    const stepsToRun = [
      { step: 1, text: `Case ${activeCaseId} ingested. Evaluated debt age: 14 days. Delinquency risk: ${withAnomaly ? '94 (CRITICAL)' : '68 (MODERATE)'}.` },
      { step: 2, text: 'Carrier telemetry verified: GPS geo-fence match confirmed within 15 meters. Digital signature matched.' },
      { step: 3, text: 'Autonomous legal defense affidavit constructed. Digital proof package compiled.' },
      {
        step: 4,
        text: withAnomaly
          ? 'SPEND CEILING ALERT: Order amount exceeds ₹10,000 cap! Autonomous bypass blocked. Routing to HITL.'
          : 'Cryptographic guardrails satisfied: Single-use authorization token generated (TTL: 600s).',
      },
      {
        step: 5,
        text: withAnomaly
          ? 'SupervisorGuard: Escalated to Human-In-The-Loop inbox for dual-key manager authorization.'
          : 'SupervisorGuard: Automated recovery cleared. Low risk profile confirmed.',
      },
      {
        step: 6,
        text: withAnomaly
          ? 'HOLD: Settlement pending human authorization signature. Locked.'
          : 'Canonical Ledger updated: Block sealed with SHA-256 hash. Recovery link published.',
      },
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < stepsToRun.length) {
        const item = stepsToRun[current];
        setActiveStep(item.step);
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const phase = PIPELINE_PHASES[item.step - 1];
        setTelemetryLogs((prev) => [
          ...prev,
          {
            time: timeStr,
            level: withAnomaly && item.step === 4 ? 'WARN' : item.step === 6 ? 'SUCCESS' : 'INFO',
            agent: phase.agent,
            text: item.text,
          },
        ]);
        current++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        if (onComplete) onComplete();
      }
    }, 700);
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
      {/* Top Header & Simulation Controls */}
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
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            color: '#000000',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Cpu size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>
              Autonomous Recovery Pipeline Telemetry
            </h3>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Target: <strong style={{ color: '#38bdf8' }}>{activeCaseId}</strong> • Amount: <strong>{amountFormatted}</strong> • Debtor: {customerName}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => handleSimulateRun(false)}
            disabled={isRunning}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isRunning ? '#1e293b' : '#38bdf8',
              color: isRunning ? '#64748b' : '#000000',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: isRunning ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Play size={13} fill={isRunning ? 'none' : '#000000'} />
            <span>{isRunning ? 'Running Simulation...' : 'Simulate Pipeline Run'}</span>
          </button>

          <button
            onClick={() => handleSimulateRun(true)}
            disabled={isRunning}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1e293b',
              color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isRunning ? 'not-allowed' : 'pointer',
            }}
            title="Inject over-budget condition (> ₹10,000) to test HITL escalation"
          >
            <AlertTriangle size={13} />
            <span>Inject Spend Anomaly</span>
          </button>
        </div>
      </div>

      {/* 6-Phase Pipeline Progress Stepper */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '8px',
        marginBottom: '16px',
      }}>
        {PIPELINE_PHASES.map((phase) => {
          const isDone = activeStep > phase.id;
          const isCurrent = activeStep === phase.id;
          return (
            <div
              key={phase.id}
              style={{
                background: isCurrent
                  ? 'rgba(56, 189, 248, 0.12)'
                  : isDone
                  ? 'rgba(34, 197, 94, 0.08)'
                  : '#101a30',
                border: isCurrent
                  ? '1px solid #38bdf8'
                  : isDone
                  ? '1px solid rgba(34, 197, 94, 0.4)'
                  : '1px solid #1e293b',
                borderRadius: '8px',
                padding: '10px',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: isCurrent ? '#38bdf8' : isDone ? '#22c55e' : '#64748b',
                }}>
                  PHASE 0{phase.id}
                </span>
                {isDone ? (
                  <CheckCircle2 size={13} color="#22c55e" />
                ) : isCurrent ? (
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#38bdf8',
                    boxShadow: '0 0 8px #38bdf8',
                  }} />
                ) : (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#334155' }} />
                )}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {phase.name}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                Agent: <span style={{ color: '#cbd5e1' }}>{phase.agent}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', color: '#64748b' }}>
                <span>{phase.latency}</span>
                <span style={{ color: '#22c55e' }}>{phase.confidence}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Streaming Reasoning Console */}
      <div style={{
        background: '#070b14',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '8px 12px',
          background: '#0a0f1d',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#cbd5e1' }}>
            <Terminal size={14} color="#38bdf8" />
            <strong style={{ letterSpacing: '0.5px' }}>AGENT REASONING & TELEMETRY STREAM</strong>
          </div>
          <span style={{ fontSize: '10px', color: '#64748b' }}>
            Engine: Vasool Multi-Agent Kernel • Latency: ~140ms
          </span>
        </div>

        <div style={{
          padding: '12px',
          maxHeight: '160px',
          overflowY: 'auto',
          fontSize: '11px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {telemetryLogs.map((log, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.4 }}>
              <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>[{log.time}]</span>
              <span style={{
                color: log.level === 'SUCCESS' ? '#22c55e' : log.level === 'WARN' ? '#f59e0b' : '#38bdf8',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}>
                [{log.agent}]
              </span>
              <span style={{ color: log.level === 'WARN' ? '#fde68a' : '#e2e8f0' }}>{log.text}</span>
            </div>
          ))}
          {isRunning && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
              <span className="step-dot current" style={{ width: '6px', height: '6px', background: '#38bdf8', borderRadius: '50%' }} />
              <span>Agent processing node...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
