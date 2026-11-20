import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import {
  ShoppingBag,
  Library,
  Sparkles,
  Mic,
  Scale,
  Clock,
  Database,
  ShieldCheck,
  Store,
  Users,
  Smartphone,
  Bug,
  Compass,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import Header from './components/Header';
import CatalogSidebar from './components/CatalogSidebar';
import ChatPanel from './components/ChatPanel';
import PurchaseSummaryPanel from './components/PurchaseSummaryPanel';
import ToastNotification from './components/ToastNotification';

const AuditLogPanel = lazy(() => import('./components/AuditLogPanel'));
const CatalogPanel = lazy(() => import('./components/CatalogPanel'));
const RecoveryPayPage = lazy(() => import('./components/RecoveryPayPage'));
const VasoolConsole = lazy(() => import('./components/VasoolConsole'));
const MultiAgentWarRoom = lazy(() => import('./components/MultiAgentWarRoom'));
const OmnichannelPhoneSimulator = lazy(() => import('./components/OmnichannelPhoneSimulator'));
const RedTeamSecuritySandbox = lazy(() => import('./components/RedTeamSecuritySandbox'));
const SimpleMissionHub = lazy(() => import('./components/SimpleMissionHub'));

function ViewLoader() {
  return (
    <div style={{ height: '100%', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
        <div className="animate-spin" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-uber-blue)' }} />
        <span style={{ fontSize: '13px' }}>Loading workspace...</span>
      </div>
    </div>
  );
}

import {
  sendChatMessage,
  checkBackendHealth,
  getCatalog,
  sendChatConsent,
  getChatHistory,
  deleteChatHistory,
  getChatSessions,
  getAuditLogs,
  clearAuditLogs,
  setStoredRole,
} from './services/api';
import catalogData from './data/catalog.json';

const NAVIGATION_CATEGORIES = [
  {
    id: 'hub',
    label: 'Overview',
    icon: Compass,
    roles: ['admin', 'merchant', 'dispute_analyst'],
    tabs: [
      {
        id: 'hub',
        label: 'Platform Overview',
        icon: Compass,
        description: 'Executive dashboard with operational metrics, active multi-agent systems, and module quick-links.',
      },
    ],
  },
  {
    id: 'store',
    label: 'Storefront',
    icon: Store,
    roles: ['admin', 'shopper', 'merchant'],
    tabs: [
      {
        id: 'shopping',
        label: 'AI Shopping Assistant',
        icon: ShoppingBag,
        description: 'Multi-turn conversational assistant with Gnani Indic voice, multimodal Snap to Shop, and price negotiation.',
      },
      {
        id: 'catalog',
        label: 'Product Catalog',
        icon: Library,
        description: 'Interactive verified catalog inventory across 10,000+ SKUs with dynamic stock status and filtering.',
      },
    ],
  },
  {
    id: 'disputes_nav',
    label: 'Disputes & Delivery',
    icon: Scale,
    roles: ['admin', 'dispute_analyst'],
    tabs: [
      {
        id: 'disputes',
        label: 'PayPal Dispute Center',
        icon: Scale,
        description: 'Carrier GPS satellite tracking, 15m radius geofences, and verifiable recipient delivery signatures.',
      },
      {
        id: 'approvals',
        label: 'HITL Approvals Inbox',
        icon: Clock,
        description: 'Dual-key human-in-the-loop review queue for over-budget spend elevations and sensitive concessions.',
      },
    ],
  },
  {
    id: 'ai_ops',
    label: 'Agent Operations',
    icon: Users,
    roles: ['admin', 'dispute_analyst'],
    tabs: [
      {
        id: 'war_room',
        label: 'Multi-Agent War Room',
        icon: Users,
        description: 'Collaborative peer-to-peer consensus deliberation among 4 specialized autonomous risk agents.',
      },
      {
        id: 'omnichannel',
        label: 'Omnichannel Simulator',
        icon: Smartphone,
        description: 'Interactive smartphone testing WhatsApp recovery notifications, payment links, and voice briefings.',
      },
      {
        id: 'recovery',
        label: 'Vasool Recovery Pipeline',
        icon: Sparkles,
        description: 'Autonomous 6-phase debt recovery execution telemetry, case management, and settlement tracking.',
      },
    ],
  },
  {
    id: 'security_nav',
    label: 'Security & Ledger',
    icon: ShieldCheck,
    roles: ['admin', 'merchant', 'dispute_analyst'],
    tabs: [
      {
        id: 'ledger',
        label: 'Cryptographic Ledger',
        icon: Database,
        description: 'Canonical SHA-256 chained transaction blocks with WebCrypto audit and real-time tamper-testing.',
      },
      {
        id: 'red_team',
        label: 'Security Sandbox',
        icon: Bug,
        description: 'Deterministic adversarial security suite validating prompt injection resistance and replay defense.',
      },
      {
        id: 'guardrails',
        label: 'Guardrail Matrix',
        icon: ShieldCheck,
        description: 'Deterministic non-bypassable spend ceiling (₹10,000) and privacy consent enforcement.',
      },
    ],
  },
];

function hydrateMessages(rawMessages) {
  if (!Array.isArray(rawMessages)) return [];
  return rawMessages.map((m, idx) => {
    let products = Array.isArray(m.products) ? m.products : [];
    let comparison = Array.isArray(m.comparison) ? m.comparison : [];

    if (products.length === 0 && comparison.length === 0 && (m.role === 'assistant' || m.sender === 'assistant')) {
      const prevMsg = idx > 0 ? rawMessages[idx - 1] : null;
      if (prevMsg && (prevMsg.role === 'user' || prevMsg.sender === 'user') && (prevMsg.content || prevMsg.text)) {
        const queryText = (prevMsg.content || prevMsg.text || '').toLowerCase();
        const words = queryText.match(/[a-z0-9]+/g)?.filter((t) => !['show', 'me', 'the', 'for', 'a', 'an', 'under', 'below', 'in', 'want', 'buy', 'get', 'some', 'products', 'item', 'items'].includes(t)) || [];
        if (words.length > 0) {
          const matched = catalogData.filter((item) => {
            const searchable = `${item.name} ${item.category} ${(item.tags || []).join(' ')}`.toLowerCase();
            return words.some((w) => searchable.includes(w));
          }).slice(0, 6);
          if (matched.length > 0) {
            products = matched;
          }
        }
      }
    }

    return {
      id: m.id || idx + 10,
      sender: m.role === 'user' || m.sender === 'user' ? 'user' : 'assistant',
      text: m.content || m.text || '',
      products,
      comparison,
      blocked: m.blocked || false,
      agentActivity: m.agentActivity || (products.length > 0 ? `Searched catalog: Found ${products.length} matching products` : null),
    };
  });
}

export default function App() {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  if (currentPath.startsWith('/pay/')) {
    const payToken = currentPath.split('/pay/')[1]?.split('/')[0] || '';
    return (
      <Suspense fallback={<ViewLoader />}>
        <RecoveryPayPage payToken={payToken} />
      </Suspense>
    );
  }

  // Enterprise RBAC Role Management
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('user_role_pref') || 'admin';
  });

  // Dynamic active tab in unified workspace
  const [activeTab, setActiveTab] = useState(() => {
    if (currentPath === '/console' || currentPath.startsWith('/console/')) {
      return 'recovery';
    }
    const storedRole = localStorage.getItem('user_role_pref') || 'admin';
    return storedRole === 'shopper' ? 'shopping' : 'hub';
  });

  const availableCategories = NAVIGATION_CATEGORIES.filter((cat) => cat.roles.includes(userRole));
  const currentCategory = availableCategories.find((cat) => cat.tabs.some((t) => t.id === activeTab)) || availableCategories[0];
  const allAvailableTabs = availableCategories.flatMap((cat) => cat.tabs);
  const currentTabObj = allAvailableTabs.find((t) => t.id === activeTab) || allAvailableTabs[0];

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme_pref') || 'dark';
  });

  const [backendConnected, setBackendConnected] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [voiceLang, setVoiceLang] = useState('en-IN');
  const [catalogProducts, setCatalogProducts] = useState([]);

  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('active_session_id') || `sess_${Math.random().toString(36).substring(2, 9)}`;
  });
  const [sessions, setSessions] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth < 768);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeStep, setActiveStep] = useState(1);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  const [showConsentPrompt, setShowConsentPrompt] = useState(false);
  const [consentGiven, setConsentGiven] = useState(() => {
    return localStorage.getItem('chat_consent_pref') === 'true' ? true : null;
  });

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    setStoredRole(newRole);
    const newCategories = NAVIGATION_CATEGORIES.filter((cat) => cat.roles.includes(newRole));
    const validTabs = newCategories.flatMap((cat) => cat.tabs.map((t) => t.id));
    if (!validTabs.includes(activeTab)) {
      setActiveTab(newRole === 'shopper' ? 'shopping' : (validTabs[0] || 'shopping'));
    }
  };

  const handleSelectCategory = (cat) => {
    if (cat.tabs.some((t) => t.id === activeTab)) return;
    if (cat.tabs.length > 0) {
      setActiveTab(cat.tabs[0].id);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme_pref', theme);
  }, [theme]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('active_session_id', sessionId);
    }
  }, [sessionId]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const DEFAULT_WELCOME_MESSAGE = {
    id: 1,
    sender: 'assistant',
    text: `Hello! How can I help you today? Feel free to ask about products in our catalog or start a purchase.`,
    products: [],
  };

  const [messages, setMessages] = useState([DEFAULT_WELCOME_MESSAGE]);

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 100,
      timestamp: new Date().toISOString(),
      action: 'system_init',
      sku: 'N/A',
      amount: 0,
      reasoning: 'Guardrail Engine & Neon DB initialized. Spend cap limit active at ₹10,000.',
      spend_cap_check: 'PASSED',
      result: 'SUCCESS',
    },
  ]);

  const refreshSessionsList = useCallback(async () => {
    const res = await getChatSessions();
    if (res && res.sessions) {
      setSessions(res.sessions);
    }
  }, []);

  const refreshAuditLogs = useCallback(async () => {
    const logs = await getAuditLogs(sessionId);
    if (logs && Array.isArray(logs)) {
      setAuditLogs(logs);
    }
  }, [sessionId]);

  useEffect(() => {
    let mounted = true;
    checkBackendHealth().then((res) => {
      if (mounted) setBackendConnected(res.online);
    });
    getCatalog().then((cat) => {
      if (mounted && Array.isArray(cat) && cat.length > 0) {
        setCatalogProducts(cat);
      }
    });
    refreshSessionsList();
    return () => {
      mounted = false;
    };
  }, [refreshSessionsList]);

  const handleSendMessage = async (text) => {
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);

    const res = await sendChatMessage(text, sessionId, consentGiven);
    if (res && res.data) {
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: res.data.reply || '',
        products: res.data.products || [],
        comparison: res.data.comparison || [],
        blocked: res.data.type === 'blocked' || false,
        agentActivity: res.data.products?.length > 0 ? `Found ${res.data.products.length} products` : null,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (res.data.auditEntry) {
        setAuditLogs((prev) => [res.data.auditEntry, ...prev]);
      }
    }
    refreshSessionsList();
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSelectedQty(1);
    setActiveStep(2);
  };

  const handleResetSelection = () => {
    setSelectedProduct(null);
    setSelectedQty(1);
    setActiveStep(1);
  };

  const handleStockVerified = () => setActiveStep(3);
  const handleOrderCreated = () => setActiveStep(4);
  const handleOrderSuccess = () => {
    setActiveStep(5);
    refreshAuditLogs();
  };

  const handleNewChat = () => {
    const newId = `sess_${Math.random().toString(36).substring(2, 9)}`;
    setSessionId(newId);
    setMessages([DEFAULT_WELCOME_MESSAGE]);
    setSelectedProduct(null);
    setActiveStep(1);
  };

  const handleClearLogs = async () => {
    await clearAuditLogs();
    setAuditLogs([]);
  };

  const handleClearChatHistory = async () => {
    await deleteChatHistory(sessionId);
    setMessages([DEFAULT_WELCOME_MESSAGE]);
    refreshSessionsList();
  };

  const handleAuditLogged = (entry) => {
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const handleConsentChoice = async (consented) => {
    setConsentGiven(consented);
    localStorage.setItem('chat_consent_pref', String(consented));
    setShowConsentPrompt(false);
    await sendChatConsent(sessionId, consented);
  };

  const blockedCount = auditLogs.filter((l) => l.result === 'BLOCKED').length;
  const currentSpend = selectedProduct ? (selectedProduct.price || 0) * selectedQty : 0;

  return (
    <div className="app-container" data-theme={theme} style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top Header with Role-Based Access Control Switcher */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        backendConnected={backendConnected}
        spendCap={10000}
        currentSpend={currentSpend}
        auditOpen={auditOpen}
        onToggleAudit={() => {
          if (!auditOpen) refreshAuditLogs();
          setAuditOpen(!auditOpen);
        }}
        catalogOpen={catalogOpen}
        onToggleCatalog={() => setCatalogOpen(!catalogOpen)}
        blockedCount={blockedCount}
        onClearChatHistory={handleClearChatHistory}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileSummaryOpen={mobileSummaryOpen}
        onToggleMobileSummary={() => setMobileSummaryOpen(!mobileSummaryOpen)}
        hasSelectedItem={!!selectedProduct}
        userRole={userRole}
        onChangeRole={handleRoleChange}
      />

      {/* Level 1: Primary Category Workspace Bar */}
      <nav
        style={{
          background: '#0d1322',
          borderBottom: '1px solid #1e293b',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          overflowX: 'auto',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'nowrap' }}>
          {availableCategories.map((cat) => {
            const Icon = cat.icon;
            const isCatActive = currentCategory?.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '7px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: isCatActive ? 700 : 500,
                  border: isCatActive ? '1px solid #38bdf8' : '1px solid transparent',
                  background: isCatActive ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.08) 100%)' : 'transparent',
                  color: isCatActive ? '#38bdf8' : '#94a3b8',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  boxShadow: isCatActive ? '0 0 14px rgba(56, 189, 248, 0.2)' : 'none',
                }}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Nav Utilities: Active Role & System Health Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Active Role:</span>
            <span style={{
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              padding: '3px 9px',
              borderRadius: '6px',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: '10px',
              letterSpacing: '0.04em',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}>
              {userRole}
            </span>
          </div>
        </div>
      </nav>

      {/* Level 2: Sub-Nav Bar (Clean Pill Tabs for Current Category) */}
      {currentCategory && currentCategory.tabs.length > 1 && (
        <div
          style={{
            background: '#090d16',
            borderBottom: '1px solid #1e293b',
            padding: '6px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '4px' }}>
            {currentCategory.label}:
          </span>
          {currentCategory.tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: isTabActive ? 600 : 500,
                  border: isTabActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.05)',
                  background: isTabActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  color: isTabActive ? '#38bdf8' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <TabIcon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Professional Context Guidance Strip */}
      {currentTabObj?.description && activeTab !== 'hub' && (
        <div
          style={{
            background: '#080c14',
            borderBottom: '1px solid #1e293b',
            padding: '6px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#94a3b8',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>{currentTabObj.label}</span>
            <span style={{ color: '#334155' }}>—</span>
            <span style={{ color: '#cbd5e1' }}>{currentTabObj.description}</span>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', marginLeft: '12px' }}>
            Spend Cap: <strong style={{ color: '#10b981' }}>₹10,000 Safe</strong>
          </span>
        </div>
      )}

      {/* Dynamic Unified Workspace Content (Single Application Shell) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* TAB 0: INTERACTIVE MISSION HUB (Kid-friendly visual cards) */}
        {activeTab === 'hub' && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Suspense fallback={<ViewLoader />}>
              <SimpleMissionHub
                onNavigate={(targetTabId) => {
                  setActiveTab(targetTabId);
                }}
              />
            </Suspense>
          </div>
        )}
        {/* TAB 1: SHOPPING ASSISTANT (3-Column Layout with Gnani Voice) */}
        {activeTab === 'shopping' && (
          <div className="app-main-layout" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Left Column: Interactive Product Catalog Sidebar */}
            <CatalogSidebar
              products={catalogProducts.length > 0 ? catalogProducts : catalogData}
              selectedProduct={selectedProduct}
              onSelectProduct={handleSelectProduct}
              onAskAgent={handleSendMessage}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              onOpenFullCatalog={() => setActiveTab('catalog')}
              onNewChat={handleNewChat}
            />

            {/* Center Column: Conversation & Product Discovery */}
            <div className="chat-discovery-column" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <ChatPanel
                messages={messages}
                activeStep={activeStep}
                onSendMessage={handleSendMessage}
                onSelectProduct={handleSelectProduct}
                onAuditLogged={handleAuditLogged}
                showConsentPrompt={showConsentPrompt}
                onConsentChoice={handleConsentChoice}
                activeVoiceLang={voiceLang}
                onLanguageChange={setVoiceLang}
                selectedProduct={selectedProduct}
                onOrderSuccess={handleOrderSuccess}
                sessionId={sessionId}
              />
            </div>

            {/* Right Column: Checkout Sheet Panel */}
            <div className={`purchase-summary-column ${selectedProduct ? 'has-selected-item' : ''} ${mobileSummaryOpen ? 'mobile-open' : ''}`}>
              {selectedProduct && (
                <PurchaseSummaryPanel
                  key={selectedProduct?.sku || 'empty-purchase'}
                  selectedProduct={selectedProduct}
                  quantity={selectedQty}
                  onQtyChange={setSelectedQty}
                  onResetSelection={handleResetSelection}
                  onStockVerified={handleStockVerified}
                  onOrderCreated={handleOrderCreated}
                  onOrderSuccess={handleOrderSuccess}
                  sessionId={sessionId}
                />
              )}
            </div>

            {/* Mobile Backdrop Overlays */}
            {!sidebarCollapsed && (
              <div className="mobile-overlay-backdrop sidebar-backdrop" onClick={() => setSidebarCollapsed(true)} />
            )}
            {mobileSummaryOpen && (
              <div className="mobile-overlay-backdrop summary-backdrop" onClick={() => setMobileSummaryOpen(false)} />
            )}
          </div>
        )}

        {/* TAB 2: FULL CATALOG BROWSER & INVENTORY */}
        {activeTab === 'catalog' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            <Suspense fallback={<ViewLoader />}>
              <CatalogPanel
                open={true}
                onClose={() => setActiveTab('shopping')}
                products={catalogProducts.length > 0 ? catalogProducts : catalogData}
                onSelectProduct={(item) => {
                  handleSelectProduct(item);
                  setActiveTab('shopping');
                }}
                onAskAgent={(prompt) => {
                  setActiveTab('shopping');
                  handleSendMessage(prompt);
                }}
              />
            </Suspense>
          </div>
        )}

        {/* TAB 3: VASOOL AUTONOMOUS RECOVERY (Multi-Agent Orchestrator) */}
        {activeTab === 'recovery' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <Suspense fallback={<ViewLoader />}>
              <VasoolConsole hideHeader={true} defaultTab="cases" onBackToStorefront={() => setActiveTab('shopping')} />
            </Suspense>
          </div>
        )}

        {/* TAB 4: GNANI VOICE TERMINAL & BRIEFINGS */}
        {activeTab === 'voice_ops' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <Suspense fallback={<ViewLoader />}>
              <VasoolConsole hideHeader={true} defaultTab="briefing" onBackToStorefront={() => setActiveTab('shopping')} />
            </Suspense>
          </div>
        )}

        {/* TAB 5: PAYPAL DISPUTE CENTER */}
        {activeTab === 'disputes' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <Suspense fallback={<ViewLoader />}>
              <VasoolConsole hideHeader={true} defaultTab="cases" filterDisputesOnly={true} onBackToStorefront={() => setActiveTab('shopping')} />
            </Suspense>
          </div>
        )}

        {/* TAB 6: HUMAN APPROVALS INBOX (HITL Gate with Voice Read-Back) */}
        {activeTab === 'approvals' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <Suspense fallback={<ViewLoader />}>
              <VasoolConsole hideHeader={true} defaultTab="approvals" onBackToStorefront={() => setActiveTab('shopping')} />
            </Suspense>
          </div>
        )}

        {/* TAB 7: CANONICAL CRYPTOGRAPHIC LEDGER */}
        {activeTab === 'ledger' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <Suspense fallback={<ViewLoader />}>
              <VasoolConsole hideHeader={true} defaultTab="ledger" onBackToStorefront={() => setActiveTab('shopping')} />
            </Suspense>
          </div>
        )}

        {/* TAB 8: MULTI-AGENT COLLABORATIVE WAR ROOM */}
        {activeTab === 'war_room' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <Suspense fallback={<ViewLoader />}>
              <MultiAgentWarRoom />
            </Suspense>
          </div>
        )}

        {/* TAB 9: OMNICHANNEL WHATSAPP & SMS SIMULATOR */}
        {activeTab === 'omnichannel' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <Suspense fallback={<ViewLoader />}>
              <OmnichannelPhoneSimulator />
            </Suspense>
          </div>
        )}

        {/* TAB 10: RED-TEAM PENETRATION & SECURITY SANDBOX */}
        {activeTab === 'red_team' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <Suspense fallback={<ViewLoader />}>
              <RedTeamSecuritySandbox />
            </Suspense>
          </div>
        )}

        {/* TAB 11: GUARDRAILS & SECURITY MATRIX */}
        {activeTab === 'guardrails' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <Suspense fallback={<ViewLoader />}>
              <VasoolConsole hideHeader={true} defaultTab="metrics" onBackToStorefront={() => setActiveTab('shopping')} />
            </Suspense>
          </div>
        )}
      </div>

      {/* Floating Audit Drawer if triggered from header */}
      <Suspense fallback={null}>
        {auditOpen && (
          <AuditLogPanel
            open={auditOpen}
            onClose={() => setAuditOpen(false)}
            auditLogs={auditLogs}
            onClearLogs={handleClearLogs}
            spendCap={10000}
          />
        )}
      </Suspense>
      {/* Real-time Enterprise Event Notification Toasts */}
      <ToastNotification />
    </div>
  );
}
