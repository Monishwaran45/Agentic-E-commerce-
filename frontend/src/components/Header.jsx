import React, { useState } from 'react';
import {
  Moon,
  Sun,
  ShieldCheck,
  Settings,
  PanelLeft,
  Library,
  ShoppingBag,
  Store,
  Scale,
  ChevronDown,
  Check,
  UserCheck,
  Mic,
} from 'lucide-react';

const ROLES = [
  { id: 'shopper', label: 'Customer / Shopper', badge: 'Shopper', icon: ShoppingBag, color: '#38bdf8', desc: 'Shop, voice search & checkout' },
  { id: 'merchant', label: 'Merchant Operations', badge: 'Merchant', icon: Store, color: '#22c55e', desc: 'Inventory, guardrails & audit' },
  { id: 'dispute_analyst', label: 'Dispute Analyst', badge: 'Disputes', icon: Scale, color: '#a855f7', desc: 'PayPal defense & carrier proofs' },
  { id: 'admin', label: 'Vasool Recovery Admin', badge: 'Admin (Full)', icon: ShieldCheck, color: '#ef4444', desc: 'Autonomous recovery, voice ops & ledger' },
];

export default function Header({
  theme,
  onToggleTheme,
  backendConnected,
  spendCap = 10000,
  currentSpend = 0,
  auditOpen,
  onToggleAudit,
  catalogOpen,
  onToggleCatalog,
  blockedCount = 0,
  onClearChatHistory,
  sidebarCollapsed = false,
  onToggleSidebar,
  mobileSummaryOpen = false,
  onToggleMobileSummary,
  hasSelectedItem = false,
  userRole = 'admin',
  onChangeRole,
  onOpenVoiceAgent,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const currentRoleConfig = ROLES.find((r) => r.id === userRole) || ROLES[0];
  const RoleIcon = currentRoleConfig.icon;

  const spendPct = Math.min(100, Math.round((currentSpend / spendCap) * 100));
  const ringColor = spendPct >= 100 ? '#ef4444' : spendPct > 70 ? '#f59e0b' : '#10b981';

  return (
    <header className="app-header">
      <div className="brand-title">
        {onToggleSidebar && (
          <button
            className={`sidebar-toggle-header ${!sidebarCollapsed ? 'active' : ''}`}
            onClick={onToggleSidebar}
            title={sidebarCollapsed ? "Open Product Catalog" : "Collapse Catalog"}
          >
            <PanelLeft size={16} />
          </button>
        )}
        <div className="brand-icon">
          <img src="/agent-logo.png" alt="Agent Logo" className="brand-logo-img" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 className="brand-heading" style={{ whiteSpace: 'nowrap' }}>Agentic E-Commerce</h1>
          {backendConnected && (
            <span
              className="live-status-pill"
              title="Guardrail Engine & Catalog Online"
            >
              <span className="live-status-dot" />
              <span>LIVE</span>
            </span>
          )}
        </div>
      </div>

      <div className="header-controls">
        {/* Role-Based Access Control (RBAC) Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${currentRoleConfig.color}`,
              color: 'var(--text-main)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Switch Enterprise RBAC Role"
          >
            <RoleIcon size={14} color={currentRoleConfig.color} />
            <span style={{ color: currentRoleConfig.color }}>{currentRoleConfig.badge}</span>
            <ChevronDown size={12} color="var(--text-muted)" />
          </button>

          {showRoleMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: '#131b2e',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '8px',
                minWidth: '240px',
                zIndex: 1000,
                boxShadow: '0 12px 32px rgba(0,0,0,0.7)',
              }}
            >
              <div style={{ padding: '6px 8px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                Select Active Role (RBAC)
              </div>
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = userRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      if (onChangeRole) onChangeRole(r.id);
                      setShowRoleMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                      color: isSelected ? '#ffffff' : '#94a3b8',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '2px',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon size={15} color={r.color} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: isSelected ? '#ffffff' : '#e2e8f0' }}>
                          {r.label}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>
                          {r.desc}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check size={14} color="#38bdf8" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Spend Cap Progress Pill (Visible for Shopper, Merchant, Admin) */}
        {userRole !== 'dispute_analyst' && (
          <div
            className="header-spend-cap-pill"
            title={`Active Cart Spend: ₹${currentSpend.toLocaleString('en-IN')} of ₹${spendCap.toLocaleString('en-IN')} Guardrail Limit`}
          >
            <div className="spend-cap-ring-wrapper">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle
                  cx="10"
                  cy="10"
                  r="7"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="2.5"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="7"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="2.5"
                  strokeDasharray="44"
                  strokeDashoffset={44 - (44 * spendPct) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 10 10)"
                  style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.3s ease' }}
                />
              </svg>
            </div>
            <div className="spend-cap-text">
              <span className="spend-cap-label">Budget</span>
              <span className="spend-cap-val">
                ₹{currentSpend.toLocaleString('en-IN')}
                <span className="spend-cap-max"> / ₹{spendCap.toLocaleString('en-IN')}</span>
              </span>
            </div>
          </div>
        )}

        {/* Mobile Summary Button */}
        {onToggleMobileSummary && (
          <button
            className={`icon-btn mobile-summary-btn ${mobileSummaryOpen ? 'active' : ''}`}
            onClick={onToggleMobileSummary}
            title="Toggle Purchase Summary"
          >
            <ShoppingBag size={16} />
            <span className="btn-label">Summary</span>
            {hasSelectedItem && <span className="badge-count active-item">•</span>}
          </button>
        )}

        {/* Audit Trail Drawer (Merchant & Admin) */}
        {(userRole === 'merchant' || userRole === 'admin' || userRole === 'dispute_analyst') && (
          <button
            className={`icon-btn ${auditOpen ? 'active' : ''}`}
            onClick={onToggleAudit}
            title="Open Guardrail Audit Trail"
          >
            <ShieldCheck size={16} />
            <span className="btn-label">Audit Trail</span>
            {blockedCount > 0 && (
              <span className="badge-count blocked">{blockedCount}</span>
            )}
          </button>
        )}


        {/* Theme Toggle */}
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Settings Button */}
        <button
          className="icon-btn"
          onClick={() => setShowSettings(true)}
          title="Agent Configuration Settings"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Enterprise Platform Configuration</h3>
              <button
                className="close-modal-btn"
                onClick={() => setShowSettings(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div>
                <strong>Active Role:</strong> {currentRoleConfig.label} ({currentRoleConfig.badge})
              </div>
              <div>
                <strong>Voice Engine:</strong> Gnani.ai Vach/Prisma ASR & Timbre TTS
              </div>
              <div>
                <strong>Autonomous Recovery:</strong> Vasool Multi-Agent Engine (8 Orchestrated Nodes)
              </div>
              <div>
                <strong>Dispute Resolution:</strong> PayPal Copilot Edge with Legal Defense Generator
              </div>
              <div>
                <strong>Spend Ceiling:</strong> ₹{spendCap.toLocaleString('en-IN')} (Non-Bypassable Hard Ceiling)
              </div>
              <div>
                <strong>Audit Ledger:</strong> SHA-256 Chained Cryptographic Tamper-Evident Ledger
              </div>
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => {
                    if (onClearChatHistory) onClearChatHistory();
                    setShowSettings(false);
                  }}
                  style={{
                    background: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Clear Active Session History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
