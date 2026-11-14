import React, { useState, useMemo, useRef } from 'react';
import {
  Library,
  ShoppingBag,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  RotateCcw,
  Check,
  ChevronRight,
  Filter,
  Maximize2,
} from 'lucide-react';

const PAGE_SIZE = 30;
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=800&auto=format&fit=crop&q=80';

export default function CatalogSidebar({
  products = [],
  selectedProduct,
  onSelectProduct,
  onAskAgent,
  collapsed = false,
  onToggleCollapse,
  onOpenFullCatalog,
  onNewChat,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const feedRef = useRef(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    let list = products;
    if (selectedCategory !== 'all') {
      list = list.filter((p) => (p.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const sku = (p.sku || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const tags = (p.tags || []).join(' ').toLowerCase();
        return name.includes(q) || sku.includes(q) || cat.includes(q) || tags.includes(q);
      });
    }
    return list;
  }, [products, selectedCategory, searchQuery]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      if (visibleCount < filteredProducts.length) {
        setVisibleCount((prev) => prev + PAGE_SIZE);
      }
    }
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setVisibleCount(PAGE_SIZE);
    if (feedRef.current) feedRef.current.scrollTop = 0;
  };

  return (
    <aside className={`chat-sidebar catalog-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Top Header */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-title">
            <Library size={16} color="var(--accent-uber-blue)" />
            <span>CATALOG</span>
            <span className="badge-count" style={{ background: 'var(--bg-card-hover)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)', marginLeft: '4px' }}>
              {products.length > 0 ? `${(products.length).toLocaleString()}` : '10,000+'}
            </span>
          </div>
        )}
        <div className="sidebar-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {!collapsed && onOpenFullCatalog && (
            <button
              type="button"
              className="sidebar-icon-btn"
              onClick={onOpenFullCatalog}
              title="Open Full View Catalog"
              aria-label="Open Full View Catalog"
            >
              <Maximize2 size={15} />
            </button>
          )}
          <button
            type="button"
            className="sidebar-icon-btn"
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand Catalog' : 'Collapse Catalog'}
            aria-label={collapsed ? 'Expand Catalog' : 'Collapse Catalog'}
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>
      </div>

      {!collapsed ? (
        <>
          {/* Quick Search */}
          <div className="catalog-sidebar-search-wrapper">
            <div className="catalog-sidebar-search">
              <Search size={13} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search 10,000+ products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                  if (feedRef.current) feedRef.current.scrollTop = 0;
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, fontSize: '11px' }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="catalog-category-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`cat-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat === 'all' ? 'All Items' : cat}
              </button>
            ))}
          </div>

          {/* Product Feed */}
          <div
            className="catalog-sidebar-feed"
            ref={feedRef}
            onScroll={handleScroll}
          >
            {displayedProducts.length === 0 ? (
              <div className="sidebar-empty">
                <p>No products match "{searchQuery}"</p>
                <span className="sub-text">Try searching for shoes, watches, tees, or headphones.</span>
              </div>
            ) : (
              displayedProducts.map((item) => {
                const isSelected = selectedProduct?.sku === item.sku;
                const isOutOfStock = item.stock === 0;

                return (
                  <div
                    key={item.sku}
                    className={`catalog-item-row ${isSelected ? 'active' : ''}`}
                    onClick={() => onSelectProduct && onSelectProduct(item, 1)}
                    title={`Click to checkout ${item.name}`}
                  >
                    <img
                      src={item.image || DEFAULT_FALLBACK_IMAGE}
                      alt={item.name}
                      className="catalog-item-thumb"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                      }}
                    />
                    <div className="catalog-item-info">
                      <div className="catalog-item-title">{item.name}</div>
                      <div className="catalog-item-meta">
                        <span className="catalog-item-price">₹{(item.price || 0).toLocaleString()}</span>
                        <span className={`catalog-item-stock ${isOutOfStock ? 'out-stock' : 'in-stock'}`}>
                          {isOutOfStock ? 'Out of stock' : `${item.stock} left`}
                        </span>
                      </div>
                    </div>

                    <div className="catalog-item-action" onClick={(e) => e.stopPropagation()}>
                      {onAskAgent && (
                        <button
                          type="button"
                          className="catalog-ask-btn"
                          title="Ask AI about this item"
                          onClick={() => onAskAgent(`Tell me about ${item.name} (SKU: ${item.sku}) and why I should buy it.`)}
                        >
                          <Sparkles size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {visibleCount < filteredProducts.length && (
              <div style={{ padding: '8px 0', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                  Showing {displayedProducts.length} of {filteredProducts.length.toLocaleString()} items
                </span>
              </div>
            )}
          </div>

          {/* Bottom Controls: Quick New Chat / Reset conversation */}
          {onNewChat && (
            <div className="catalog-sidebar-footer">
              <button
                type="button"
                className="catalog-reset-btn"
                onClick={onNewChat}
                title="Start a fresh conversation with the agent"
              >
                <RotateCcw size={13} />
                <span>New Chat Session</span>
              </button>
            </div>
          )}
        </>
      ) : (
        /* Collapsed View */
        <div className="sidebar-collapsed-actions">
          <button
            type="button"
            className="sidebar-icon-btn collapsed-action"
            onClick={onToggleCollapse}
            title="Browse Catalog"
          >
            <Library size={18} color="var(--accent-uber-blue)" />
          </button>
          {onNewChat && (
            <button
              type="button"
              className="sidebar-icon-btn collapsed-action"
              onClick={onNewChat}
              title="New Chat Session"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      )}
    </aside>
  );
}

