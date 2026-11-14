import React, { useState } from 'react';
import { Moon, Sun, ShieldCheck, Settings, PanelLeft, Library, ShoppingBag } from 'lucide-react';

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
}) {
  const [showSettings, setShowSettings] = useState(false);
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
        {/* Live Spend Cap Progress Pill */}
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

        <button
          className={`icon-btn ${catalogOpen ? 'active' : ''}`}
          onClick={onToggleCatalog}
          title="Open Catalog Browser"
        >
          <Library size={16} />
          <span className="btn-label">Catalog</span>
        </button>

        <button
          className={`icon-btn ${auditOpen ? 'active' : ''}`}
          onClick={onToggleAudit}
          title="Open Audit Log Drawer"
        >
          <ShieldCheck size={16} />
          <span className="btn-label">Audit Trail</span>
          {blockedCount > 0 && (
            <span className="badge-count blocked">{blockedCount}</span>
          )}
        </button>

        <a
          href="/console"
          className="icon-btn"
          style={{ textDecoration: 'none', color: '#38bdf8' }}
          title="Open Vasool Operations Console"
        >
          <ShieldCheck size={16} color="#38bdf8" />
          <span className="btn-label" style={{ color: '#38bdf8', fontWeight: 600 }}>Vasool Console</span>
        </a>

        <button
          className="icon-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

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
              <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Agent Configuration</h3>
              <button className="icon-btn" onClick={() => setShowSettings(false)}>✕</button>
            </div>

            <div className="settings-row">
              <span>LLM Engine:</span>
              <strong>Groq (`openai/gpt-oss-120b`)</strong>
            </div>

            <div className="settings-row">
              <span>Payment Gateway:</span>
              <strong>Test-Mode Checkout SDK</strong>
            </div>

            <div className="settings-row">
              <span>Hard Spend Cap:</span>
              <strong>₹{spendCap.toLocaleString()}</strong>
            </div>

            <div className="settings-row">
              <span>Database Storage:</span>
              <strong>Neon Postgres DB</strong>
            </div>

            <div className="settings-row">
              <span>Backend Connection:</span>
              <span style={{ color: backendConnected ? 'var(--accent-success)' : 'var(--accent-blocked)', fontWeight: 600 }}>
                {backendConnected ? 'FastAPI Active' : 'Reconnecting'}
              </span>
            </div>

            {onClearChatHistory && (
              <div className="settings-row" style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <span>Chat History Privacy:</span>
                <button
                  type="button"
                  className="secondary-btn"
                  style={{ padding: '4px 10px', fontSize: '11.5px', color: 'var(--accent-blocked)' }}
                  onClick={() => {
                    onClearChatHistory();
                    setShowSettings(false);
                  }}
                >
                  Clear Stored History
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
