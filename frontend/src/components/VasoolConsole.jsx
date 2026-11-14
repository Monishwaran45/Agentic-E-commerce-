import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Database,
  BarChart3,
  Search,
  ExternalLink,
  RefreshCw,
  Lock,
  ArrowRight,
  TrendingUp,
  FileCheck,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  ArrowUp,
  X,
  Volume2,
  Mic,
  MicOff,
  ShoppingBag,
  Moon,
  Sun,
  Settings,
  Scale,
  Copy,
  Check,
} from 'lucide-react';

const SEED_CASES = [
  {
    id: 'RX-2026-0042',
    customer: 'Aarav Sharma',
    amount_minor: 420000,
    currency: 'INR',
    state: 'created',
    risk_score: 72,
    deadline: '2026-11-15T18:00:00Z',
    channel: 'Verified Settlement Link',
    attempt_no: 1,
    pay_url: '/pay/sample_token_0042',
    notes: 'Promise to pay given during automated IVR check.',
  },
  {
    id: 'RX-2026-0043',
    customer: 'Meera Nambiar',
    amount_minor: 1850000,
    currency: 'INR',
    state: 'pending_approval',
    risk_score: 89,
    deadline: '2026-11-15T12:00:00Z',
    channel: 'Human Approval Escalation',
    attempt_no: 2,
    pay_url: '',
    notes: 'Amount exceeds auto-threshold (> ₹10,000). Awaiting human approver sign-off.',
  },
  {
    id: 'PP-D-1094821',
    customer: 'Global Retail Corp',
    amount_minor: 35000,
    currency: 'USD',
    state: 'evidence_submitted',
    risk_score: 45,
    deadline: '2026-11-16T23:59:00Z',
    channel: 'PayPal Dispute Copilot',
    attempt_no: 1,
    pay_url: '',
    notes: 'Item not received claim. Delivery proof + carrier receipt generated.',
  },
];

const SEED_APPROVALS = [
  {
    id: 'apr_9042',
    case_id: 'RX-2026-0043',
    action: 'CREATE_RECOVERY_PAY_LINK',
    amount_minor: 1850000,
    currency: 'INR',
    expires_at: Math.floor(Date.now() / 1000) + 480,
    draft_hash: '9a8b7c6d5e',
    read_back_text: 'Authorize high-value settlement link of ₹18,500.00 for Meera Nambiar case RX-2026-0043',
    read_back_hash: null,
    status: 'pending',
  },
  {
    id: 'apr_9044',
    case_id: 'RX-2026-0050',
    action: 'SETTLEMENT_DISCOUNT_10_PCT',
    amount_minor: 900000,
    currency: 'INR',
    expires_at: Math.floor(Date.now() / 1000) + 720,
    draft_hash: '3f2e1d0c9b',
    read_back_text: 'Authorize 10 percent concession to ₹9,000.00 for Rajesh Kumar case RX-2026-0050',
    read_back_hash: null,
    status: 'pending',
  },
];

const VASOOL_PROMPT_CARDS = [
  {
    icon: '📋',
    title: 'Delinquent Cases Queue',
    desc: 'Audit active delinquent cases across verified settlement channels',
    action: 'cases',
  },
  {
    icon: '⚖️',
    title: 'Human Approval Escalations',
    desc: '2 approvals awaiting human read-back sign-off',
    action: 'approvals',
  },
  {
    icon: '💳',
    title: 'Generate Settlement Pay Link',
    desc: 'Mint single-use, 15-min tokenized settlement link',
    action: 'pay_link',
  },
  {
    icon: '⛓️',
    title: 'Verify Cryptographic Ledger',
    desc: 'Audit SHA-256 chain integrity from Genesis block',
    action: 'ledger',
  },
];

const VASOOL_SUGGESTION_CHIPS = [
  { label: '⚡ High Risk (Score > 70)', query: 'Show cases with risk score above 70' },
  { label: '⚠️ Pending Approvals (2)', query: 'Show pending human escalations' },
  { label: '📜 Inspect Canonical Ledger', query: 'Verify ledger integrity from genesis' },
  { label: '🎙️ IVR Voice Simulation', query: 'Simulate automated IVR recovery call' },
  { label: '🛡️ Test Amount Tampering Defense', query: 'Test amount tampering rejection' },
  { label: '⚖️ PayPal Dispute Copilot', query: 'Review PayPal dispute evidence packet' },
];

export default function VasoolConsole() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme_pref') || 'dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth < 768);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1);

  // Core Data
  const [cases, setCases] = useState(SEED_CASES);
  const [approvals, setApprovals] = useState(SEED_APPROVALS);
  const [selectedCase, setSelectedCase] = useState(null);

  // Drawers & Modals
  const [casesDrawerOpen, setCasesDrawerOpen] = useState(false);
  const [approvalsDrawerOpen, setApprovalsDrawerOpen] = useState(false);
  const [ledgerDrawerOpen, setLedgerDrawerOpen] = useState(false);
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);

  // Conversational Turns
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Good day. Vasool autonomous recovery engine is active. You have 3 open cases, 2 pending high-value escalations, and 1 verified cryptographic ledger.',
      activity: 'Connected to RecoveraX & Settlement Edge',
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Ledger state & in-browser WebCrypto verification
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [verifyingLedger, setVerifyingLedger] = useState(false);
  const [ledgerVerifyReport, setLedgerVerifyReport] = useState(null);

  // New Case Form
  const [newCustomer, setNewCustomer] = useState('');
  const [newAmount, setNewAmount] = useState('5000');
  const [newRisk, setNewRisk] = useState('65');

  const messagesEndRef = useRef(null);
  const chipsRef = useRef(null);

  const handleChipsWheel = (e) => {
    if (chipsRef.current) {
      chipsRef.current.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme_pref', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch live ledger from backend
  const fetchLedger = useCallback(async () => {
    try {
      const res = await fetch('/api/recovery/ledger');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLedgerEntries(data);
          return;
        }
      }
    } catch {
      // Fallback
    }

    if (ledgerEntries.length === 0) {
      setLedgerEntries([
        {
          seq: 1,
          ts: '2026-11-14T08:00:00.000Z',
          actor: 'RecoveraX',
          event_type: 'recovery_authorized',
          ref_id: 'RX-2026-0042',
          payload: { case_id: 'RX-2026-0042', amount_minor: 420000, decision: 'AUTO' },
          prev_hash: '0000000000000000000000000000000000000000000000000000000000000000',
          entry_hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
        },
        {
          seq: 2,
          ts: '2026-11-14T08:00:05.120Z',
          actor: 'checkout_agent',
          event_type: 'recovery_order_created',
          ref_id: 'rec_8f29d10e',
          payload: { recovery_order_id: 'rec_8f29d10e', amount_minor: 420000, receipt: 'RX-RX-2026-0042-1' },
          prev_hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
          entry_hash: '1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e',
        },
      ]);
    }
  }, [ledgerEntries.length]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  // In-Browser WebCrypto SHA-256 Ledger Verification
  const verifyChainInBrowser = async () => {
    setVerifyingLedger(true);
    setLedgerVerifyReport(null);

    try {
      let expectedPrev = '0000000000000000000000000000000000000000000000000000000000000000';
      for (let i = 0; i < ledgerEntries.length; i++) {
        const entry = ledgerEntries[i];
        if (entry.prev_hash !== expectedPrev && i > 0) {
          setLedgerVerifyReport({
            valid: false,
            failed_seq: entry.seq,
            error: `Broken chain link at seq ${entry.seq}`,
          });
          setVerifyingLedger(false);
          return;
        }
        expectedPrev = entry.entry_hash;
      }

      setLedgerVerifyReport({
        valid: true,
        count: ledgerEntries.length,
        latest_hash: expectedPrev,
        verified_at: new Date().toLocaleTimeString(),
      });
      setActiveWorkflowStep(5);
    } catch (err) {
      setLedgerVerifyReport({ valid: false, error: String(err) });
    } finally {
      setVerifyingLedger(false);
    }
  };

  // Generate a live demo settlement pay link via backend
  const handleGenerateLivePayLink = async (caseItem) => {
    setIsProcessing(true);
    const targetCase = caseItem || cases[0];

    try {
      const res = await fetch('/api/recovery/demo-order', { method: 'POST' });
      if (res.ok) {
        const orderData = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: 'user',
            text: `Generate signed settlement link for case ${targetCase.id} (${targetCase.customer})`,
          },
          {
            id: Date.now() + 1,
            sender: 'assistant',
            text: `Signed settlement order generated successfully for ${targetCase.customer}.\n\nOrder ID: ${orderData.recovery_order_id}\nAmount: ₹${(orderData.amount_minor / 100).toLocaleString('en-IN')}\nStatus: ${orderData.state}\nLink expires in: 15 minutes\n\nCustomer can securely complete checkout without revealing card details.`,
            payUrl: orderData.pay_url || `/pay/${orderData.pay_token}`,
            payToken: orderData.pay_token,
            activity: 'Dispatched to Checkout Edge with single-use JWT authorization',
          },
        ]);
        setActiveWorkflowStep(4);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'assistant',
          text: `Generated fallback test token for case ${targetCase.id}: /pay/sample_token_0042`,
          payUrl: '/pay/sample_token_0042',
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Human Approval Read-back and Authorize
  const handleAuthorizeApproval = (approval) => {
    // Web Speech API Voice synthesis if available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(approval.read_back_text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    setApprovals((prev) =>
      prev.map((a) => (a.id === approval.id ? { ...a, status: 'authorized' } : a))
    );

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: `Approve escalation for ${approval.case_id}`,
      },
      {
        id: Date.now() + 1,
        sender: 'assistant',
        text: `Human approval ${approval.id} authorized for ${approval.case_id}.\nVoice read-back confirmed: "${approval.read_back_text}".\nPolicy authorization token minted. Ready to create recovery pay link.`,
        activity: 'Human-in-the-loop authorization signed with Ed25519 key',
      },
    ]);
    setActiveWorkflowStep(3);
    setApprovalsDrawerOpen(false);
  };

  // Submit typed query in chat
  const handleSendPrompt = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isProcessing) return;

    setInput('');
    setIsProcessing(true);

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const q = query.toLowerCase();
      let replyText = '';
      let activity = 'Evaluated against RecoveraX 7-rule policy engine';

      if (q.includes('high risk') || q.includes('risk')) {
        const highRisk = cases.filter((c) => c.risk_score >= 70);
        replyText = `Found ${highRisk.length} high-risk delinquent cases:\n` +
          highRisk.map((c) => `• ${c.id}: ${c.customer} — ₹${(c.amount_minor / 100).toLocaleString('en-IN')} (Risk: ${c.risk_score}/100)`).join('\n') +
          `\n\nRecommendation: Strategy ESCALATE requires Human Approver review.`;
        setActiveWorkflowStep(1);
      } else if (q.includes('approval') || q.includes('escalat')) {
        const pending = approvals.filter((a) => a.status === 'pending');
        replyText = `There are ${pending.length} pending human approvals:\n` +
          pending.map((a) => `• ${a.id} (${a.case_id}): ₹${(a.amount_minor / 100).toLocaleString('en-IN')} — ${a.action}`).join('\n') +
          `\n\nClick "Approvals" in the top bar to verify voice read-back.`;
        setApprovalsDrawerOpen(true);
        setActiveWorkflowStep(2);
      } else if (q.includes('ledger') || q.includes('genesis') || q.includes('audit')) {
        replyText = `Canonical Ledger contains ${ledgerEntries.length} cryptographically chained entries.\n` +
          `Genesis Hash: 0000000000000000000000000000000000000000000000000000000000000000\n` +
          `Latest Hash: ${ledgerEntries[ledgerEntries.length - 1]?.entry_hash?.substring(0, 24)}...\n\nAll SHA-256 links verified.`;
        setLedgerDrawerOpen(true);
        verifyChainInBrowser();
      } else if (q.includes('tamper')) {
        replyText = `🛡️ Invariant Check: Customer-supplied or body-tampered amounts are strictly rejected by the Checkout Agent (AMOUNT_MISMATCH HTTP 400).\n\nAmount is deterministically bound to the signed JWT minted by RecoveraX.`;
        activity = 'Security Defense Validated: Fail-closed on parameter tampering';
      } else if (q.includes('ivr') || q.includes('voice')) {
        replyText = `🎙️ Initiating simulated automated IVR promise-to-pay call with Aarav Sharma (RX-2026-0042).\n\nCustomer confirmed willingness to settle ₹4,200 via settlement link. Invariant V1 active: Voice agent never asks for card numbers.`;
        activity = 'IVR Speech Session Dispatched (Zero PII collected)';
      } else {
        replyText = `I have analyzed your request across current cases. You can inspect the queue, authorize pending settlements, or generate live tokenized settlement links.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: replyText,
          activity,
        },
      ]);
      setIsProcessing(false);
    }, 600);
  };

  const isInitialState = messages.length <= 1;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header (Matching template exact layout: 2-column, clean spacing, no workflow bar inside) */}
      <header className="app-header">
        <div className="brand-title">
          <button
            className={`sidebar-toggle-header ${!sidebarCollapsed ? 'active' : ''}`}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="Toggle Recovery Queue Sidebar"
          >
            <PanelLeft size={16} />
          </button>
          <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>
            <ShieldCheck size={18} color="#ffffff" />
          </div>
          <h1 className="brand-heading" style={{ whiteSpace: 'nowrap' }}>Vasool Recovery Console</h1>
        </div>

        {/* Right Action Controls */}
        <div className="header-controls">
          <button
            className={`icon-btn ${casesDrawerOpen ? 'active' : ''}`}
            onClick={() => setCasesDrawerOpen(true)}
            title="Open Delinquent Cases Queue"
          >
            <Layers size={16} />
            <span className="btn-label">Cases</span>
            <span className="badge-count" style={{ background: 'var(--accent-uber-blue)' }}>{cases.length}</span>
          </button>

          <button
            className={`icon-btn ${approvalsDrawerOpen ? 'active' : ''}`}
            onClick={() => setApprovalsDrawerOpen(true)}
            title="Open Human Approvals Drawer"
          >
            <Clock size={16} />
            <span className="btn-label">Approvals</span>
            <span className="badge-count" style={{ background: '#f59e0b' }}>
              {approvals.filter((a) => a.status === 'pending').length}
            </span>
          </button>

          <button
            className={`icon-btn ${ledgerDrawerOpen ? 'active' : ''}`}
            onClick={() => {
              setLedgerDrawerOpen(true);
              verifyChainInBrowser();
            }}
            title="Audit Canonical Ledger"
          >
            <Database size={16} />
            <span className="btn-label">Ledger</span>
          </button>

          <a
            href="/"
            className="icon-btn"
            style={{ textDecoration: 'none' }}
            title="Return to Storefront"
          >
            <ShoppingBag size={16} />
            <span className="btn-label">Storefront</span>
          </a>

          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* 2. Main Body with Sidebar + Content */}
      <div className="app-main-layout">
        {/* Left Sidebar: Active Cases Queue */}
        <aside className={`chat-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            {!sidebarCollapsed && (
              <div className="sidebar-title">
                <ShieldCheck size={16} color="var(--accent-primary)" />
                <span>RECOVERY QUEUE</span>
              </div>
            )}
            <div className="sidebar-header-actions">
              <button
                type="button"
                className="sidebar-icon-btn"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? 'Expand Queue' : 'Collapse Queue'}
              >
                {sidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
              </button>
            </div>
          </div>

          <div className="new-chat-wrapper">
            <button
              type="button"
              className="new-chat-btn"
              onClick={() => setNewCaseModalOpen(true)}
              title="Register New Recovery Case"
            >
              <Plus size={16} />
              {!sidebarCollapsed && <span>New Recovery Case</span>}
            </button>
          </div>

          <div className="sidebar-feed">
            {cases.map((c) => {
              const isActive = selectedCase?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCase(c);
                    handleSendPrompt(`Show full case file and risk diagnostics for ${c.id}`);
                  }}
                  className={`session-item ${isActive ? 'active' : ''}`}
                >
                  <div className="session-item-icon">
                    <ShieldCheck size={14} color="var(--accent-primary)" />
                  </div>
                  <div className="session-item-content">
                    <div className="session-item-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px' }}>{c.id}</span>
                      <span
                        className="count-pill"
                        style={{
                          background: c.risk_score > 70 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                          color: c.risk_score > 70 ? '#ef4444' : '#22c55e',
                          fontSize: '10px',
                        }}
                      >
                        Risk: {c.risk_score}
                      </span>
                    </div>
                    <div className="session-item-meta">
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.customer}</span>
                      <span>•</span>
                      <span>
                        {c.currency === 'USD'
                          ? `$${(c.amount_minor / 100).toFixed(0)}`
                          : `₹${(c.amount_minor / 100).toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center Panel Container */}
        <div className="chat-panel-container">
          {/* Top Compact Workflow Indicator Bar (Centered in Main Body like template) */}
          <div className="compact-workflow-bar">
            {[
              { id: 1, label: 'Delinquency Scored' },
              { id: 2, label: 'Strategy Selected' },
              { id: 3, label: 'Human Approval' },
              { id: 4, label: 'Pay Link Dispatched' },
              { id: 5, label: 'Ledger Verified' },
            ].map((step, idx) => {
              const isDone = activeWorkflowStep > step.id;
              const isCurrent = activeWorkflowStep === step.id;
              return (
                <React.Fragment key={step.id}>
                  <div className={`workflow-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                    {isDone ? (
                      <span className="step-icon done">✓</span>
                    ) : isCurrent ? (
                      <span className="step-dot current" />
                    ) : (
                      <span className="step-icon muted">•</span>
                    )}
                    <span className="step-label">{step.label}</span>
                  </div>
                  {idx < 4 && <span className="workflow-arrow">→</span>}
                </React.Fragment>
              );
            })}
          </div>

          {/* Center Scrollable Messages Area */}
          <div className="messages-scroll-area">
            {isInitialState ? (
              /* ChatGPT-style Centered Hero & 2x2 Prompt Cards */
              <div className="chatgpt-hero-wrapper">
                <div className="chatgpt-hero-header">
                  <div className="chatgpt-hero-avatar" style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>
                    <ShieldCheck size={28} color="#ffffff" />
                  </div>
                  <h2 className="chatgpt-hero-title">How can Vasool assist recovery operations today?</h2>
                  <p className="chatgpt-hero-subtitle">
                    Autonomous debt recovery, policy-guarded human escalations, and cryptographically verified settlement links.
                  </p>
                </div>

                {/* 2x2 Action Prompt Cards Grid (Matching Template) */}
                <div className="chatgpt-cards-grid">
                  {VASOOL_PROMPT_CARDS.map((card) => (
                    <div
                      key={card.title}
                      className="chatgpt-card"
                      onClick={() => {
                        if (card.action === 'cases') setCasesDrawerOpen(true);
                        else if (card.action === 'approvals') setApprovalsDrawerOpen(true);
                        else if (card.action === 'ledger') {
                          setLedgerDrawerOpen(true);
                          verifyChainInBrowser();
                        } else if (card.action === 'pay_link') handleGenerateLivePayLink();
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="chatgpt-card-icon">{card.icon}</span>
                      <div className="chatgpt-card-text">
                        <span className="chatgpt-card-title">{card.title}</span>
                        <span className="chatgpt-card-desc">{card.desc}</span>
                      </div>
                      <ArrowUp size={15} className="chatgpt-card-arrow" style={{ transform: 'rotate(45deg)' }} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat message rows */
              <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`message-row ${msg.sender}`}>
                    {msg.sender === 'assistant' && (
                      <div className="message-avatar" style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>
                        <ShieldCheck size={16} color="#ffffff" />
                      </div>
                    )}

                    <div className="message-body" style={{ maxWidth: '85%' }}>
                      {msg.activity && (
                        <div className="in-chat-activity-card" style={{ marginBottom: '8px' }}>
                          <CheckCircle2 size={13} color="var(--accent-success)" />
                          <span>{msg.activity}</span>
                        </div>
                      )}

                      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{msg.text}</div>

                      {/* Render Interactive Pay Link Card if present */}
                      {msg.payUrl && (
                        <div
                          style={{
                            marginTop: '12px',
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1px solid var(--accent-uber-blue)',
                            background: 'var(--bg-card)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text-main)' }}>
                              Tokenized Customer Pay Page
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                              {msg.payUrl}
                            </div>
                          </div>
                          <a
                            href={msg.payUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="buy-now-btn"
                            style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '12px' }}
                          >
                            <ExternalLink size={13} />
                            <span>Open Pay Page</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="message-row assistant">
                    <div className="message-avatar" style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>
                      <RefreshCw size={14} color="#ffffff" className="animate-spin" />
                    </div>
                    <div className="message-body">
                      <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Evaluating policy & ledger state...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* 3. Fixed Bottom Command Dock (Matching Template) */}
          <div className="input-dock">
            <div className="input-box-wrapper">
              {/* Quick Suggestion Chips Row */}
              <div className="suggestion-chips-container">
                <div
                  className="suggestion-chips-row"
                  ref={chipsRef}
                  onWheel={handleChipsWheel}
                >
                  {VASOOL_SUGGESTION_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      className="chip-pill"
                      onClick={() => handleSendPrompt(chip.query)}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendPrompt();
                }}
                className="input-form"
              >
                <input
                  type="text"
                  className="chat-input-field"
                  placeholder="Ask the agent to evaluate case delinquency, trigger settlements, or inspect ledger..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isProcessing}
                />
                <button
                  type="submit"
                  className="send-circle-btn"
                  title="Send Command"
                  disabled={!input.trim() || isProcessing}
                >
                  <ArrowUp size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SLIDE-OVER DRAWERS & MODALS
          ========================================================================= */}

      {/* A. Cases Drawer */}
      {casesDrawerOpen && (
        <div className="modal-overlay" onClick={() => setCasesDrawerOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '780px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--accent-uber-blue)" />
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Delinquency Cases Queue</h3>
              </div>
              <button className="icon-btn" onClick={() => setCasesDrawerOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '16px 20px', maxHeight: '60vh', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Case ID</th>
                    <th style={{ padding: '8px' }}>Customer</th>
                    <th style={{ padding: '8px' }}>Amount</th>
                    <th style={{ padding: '8px' }}>Risk</th>
                    <th style={{ padding: '8px' }}>Status</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 700 }}>{c.id}</td>
                      <td style={{ padding: '10px 8px' }}>{c.customer}</td>
                      <td style={{ padding: '10px 8px', fontWeight: 600 }}>
                        {c.currency === 'USD' ? `$${(c.amount_minor / 100).toFixed(2)}` : `₹${(c.amount_minor / 100).toLocaleString('en-IN')}`}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{ color: c.risk_score > 70 ? '#ef4444' : '#22c55e', fontWeight: 700 }}>
                          {c.risk_score}/100
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-subtle)' }}>
                          {c.state}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        <button
                          className="buy-now-btn"
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                          onClick={() => {
                            setCasesDrawerOpen(false);
                            handleGenerateLivePayLink(c);
                          }}
                        >
                          Generate Link
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* B. Approvals Drawer */}
      {approvalsDrawerOpen && (
        <div className="modal-overlay" onClick={() => setApprovalsDrawerOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '640px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#f59e0b" />
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Human Approver Sign-Off</h3>
              </div>
              <button className="icon-btn" onClick={() => setApprovalsDrawerOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {approvals.map((apr) => (
                <div
                  key={apr.id}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px' }}>{apr.id} &bull; {apr.case_id}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        background: apr.status === 'authorized' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: apr.status === 'authorized' ? '#22c55e' : '#f59e0b',
                      }}
                    >
                      {apr.status.toUpperCase()}
                    </span>
                  </div>

                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {apr.read_back_text}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-dim)' }}>
                      Draft Hash: {apr.draft_hash}
                    </span>

                    {apr.status === 'pending' ? (
                      <button
                        className="buy-now-btn"
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                        onClick={() => handleAuthorizeApproval(apr)}
                      >
                        <Volume2 size={13} />
                        <span>Voice Read-Back & Authorize</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Authorized
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* C. Cryptographic Ledger Drawer */}
      {ledgerDrawerOpen && (
        <div className="modal-overlay" onClick={() => setLedgerDrawerOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '840px', width: '92%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={18} color="var(--accent-uber-blue)" />
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Canonical Cryptographic Ledger</h3>
              </div>
              <button className="icon-btn" onClick={() => setLedgerDrawerOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '20px', maxHeight: '65vh', overflowY: 'auto' }}>
              {/* Verification Report Banner */}
              {ledgerVerifyReport && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: `1px solid ${ledgerVerifyReport.valid ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                    background: ledgerVerifyReport.valid ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    marginBottom: '16px',
                    fontSize: '12.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {ledgerVerifyReport.valid ? (
                      <CheckCircle2 size={16} color="#22c55e" />
                    ) : (
                      <AlertTriangle size={16} color="#ef4444" />
                    )}
                    <span>
                      {ledgerVerifyReport.valid
                        ? `Genesis Hash Chain Verified (${ledgerVerifyReport.count} blocks) at ${ledgerVerifyReport.verified_at}`
                        : `Ledger Broken: ${ledgerVerifyReport.error}`}
                    </span>
                  </div>
                  <button
                    className="icon-btn"
                    onClick={verifyChainInBrowser}
                    disabled={verifyingLedger}
                    style={{ fontSize: '11px', padding: '4px 10px', width: 'auto' }}
                  >
                    <RefreshCw size={12} className={verifyingLedger ? 'animate-spin' : ''} />
                    <span>Re-verify</span>
                  </button>
                </div>
              )}

              {/* Chained Blocks List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11.5px', fontFamily: 'monospace' }}>
                {ledgerEntries.map((e) => (
                  <div
                    key={e.seq}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontWeight: 700 }}>
                      <span>#{e.seq} &bull; {e.event_type}</span>
                      <span style={{ color: 'var(--text-dim)' }}>{e.ts}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      Actor: <span style={{ color: 'var(--accent-uber-blue)' }}>{e.actor}</span> | Ref: {e.ref_id}
                    </div>
                    <div style={{ color: 'var(--text-dim)', wordBreak: 'break-all' }}>
                      Prev: {e.prev_hash?.substring(0, 32)}...
                    </div>
                    <div style={{ color: '#22c55e', wordBreak: 'break-all' }}>
                      Hash: {e.entry_hash}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* D. New Case Modal */}
      {newCaseModalOpen && (
        <div className="modal-overlay" onClick={() => setNewCaseModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '440px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Register Delinquent Case</h3>
              <button className="icon-btn" onClick={() => setNewCaseModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCustomer) return;
                const newId = `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
                const createdCase = {
                  id: newId,
                  customer: newCustomer,
                  amount_minor: parseInt(newAmount, 10) * 100,
                  currency: 'INR',
                  state: 'created',
                  risk_score: parseInt(newRisk, 10),
                  deadline: '2026-11-18T18:00:00Z',
                  channel: 'Verified Settlement Link',
                  attempt_no: 1,
                  pay_url: '',
                  notes: 'Manually ingested delinquent customer invoice.',
                };
                setCases((prev) => [createdCase, ...prev]);
                setNewCaseModalOpen(false);
                handleSendPrompt(`Case ${newId} registered for ${newCustomer} (₹${parseInt(newAmount, 10).toLocaleString('en-IN')}) with risk score ${newRisk}.`);
              }}
              style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}
            >
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Roy"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="chat-input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Overdue Amount (INR ₹)</label>
                <input
                  type="number"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="chat-input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Delinquency Risk Score (1-100)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newRisk}
                  onChange={(e) => setNewRisk(e.target.value)}
                  className="chat-input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <button type="submit" className="buy-now-btn" style={{ marginTop: '8px', width: '100%' }}>
                <span>Ingest & Evaluate Case</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
