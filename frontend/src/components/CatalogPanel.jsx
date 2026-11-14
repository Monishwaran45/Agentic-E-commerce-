import React, { useState, useMemo } from 'react';
import {
  Library,
  ShoppingBag,
  X,
  Search,
  Filter,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  RotateCcw,
  Check,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

const PAGE_SIZE = 40;
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=800&auto=format&fit=crop&q=80';

function FullCatalogCard({ item, onSelectProduct, onAskAgent }) {
  const [imageSrc, setImageSrc] = useState(item.image || DEFAULT_FALLBACK_IMAGE);
  const isOutOfStock = item.stock === 0;
  const isLowStock = item.stock > 0 && item.stock <= 3;

  return (
    <article className="full-catalog-card">
      <div className="full-catalog-image-wrapper">
        <img
          className="full-catalog-image"
          src={imageSrc}
          alt={item.name}
          loading="lazy"
          decoding="async"
          onError={() => setImageSrc(DEFAULT_FALLBACK_IMAGE)}
        />
        {item.category && (
          <span className="full-catalog-category-tag">{item.category}</span>
        )}
        <span className={`full-catalog-stock-tag ${isOutOfStock ? 'out-stock' : isLowStock ? 'low-stock' : 'in-stock'}`}>
          {isOutOfStock ? 'Out of stock' : `${item.stock} in stock`}
        </span>
      </div>

      <div className="full-catalog-card-body">
        <div className="full-catalog-sku-row">
          <span className="full-catalog-sku">SKU: {item.sku}</span>
        </div>

        <h3 className="full-catalog-title" title={item.name}>
          {item.name}
        </h3>

        {item.tags && item.tags.length > 0 && (
          <div className="full-catalog-tags">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="full-catalog-tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="full-catalog-price-row">
          <span className="full-catalog-price">₹{Number(item.price || 0).toLocaleString('en-IN')}</span>
        </div>

        <div className="full-catalog-action-row">
          <button
            type="button"
            className="full-catalog-buy-btn"
            disabled={isOutOfStock}
            onClick={() => onSelectProduct && onSelectProduct(item, 1)}
          >
            <ShoppingBag size={14} />
            <span>{isOutOfStock ? 'Out of Stock' : 'Buy Now'}</span>
          </button>

          {onAskAgent && (
            <button
              type="button"
              className="full-catalog-ask-btn"
              title="Ask AI Agent about this product"
              onClick={() => onAskAgent(`Tell me about ${item.name} (SKU: ${item.sku}) and why I should buy it.`)}
            >
              <Sparkles size={14} />
              <span>Ask AI</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CatalogPanel({ open, onClose, products = [], onSelectProduct, onAskAgent }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceBracket, setSelectedPriceBracket] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [products]);

  // Filter & Sort Products
  const processedProducts = useMemo(() => {
    let list = [...products];

    // Category Filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => (p.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    // In Stock Filter
    if (inStockOnly) {
      list = list.filter((p) => (p.stock || 0) > 0);
    }

    // Price Bracket Filter
    if (selectedPriceBracket === 'under_1000') {
      list = list.filter((p) => (p.price || 0) <= 1000);
    } else if (selectedPriceBracket === 'under_3000') {
      list = list.filter((p) => (p.price || 0) <= 3000);
    } else if (selectedPriceBracket === 'under_5000') {
      list = list.filter((p) => (p.price || 0) <= 5000);
    } else if (selectedPriceBracket === 'under_10000') {
      list = list.filter((p) => (p.price || 0) <= 10000);
    }

    // Search Query Filter
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

    // Sorting
    if (sortBy === 'price_asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'stock_desc') {
      list.sort((a, b) => (b.stock || 0) - (a.stock || 0));
    } else if (sortBy === 'name_asc') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  }, [products, selectedCategory, selectedPriceBracket, inStockOnly, searchQuery, sortBy]);

  const displayedProducts = useMemo(() => {
    return processedProducts.slice(0, visibleCount);
  }, [processedProducts, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriceBracket('all');
    setInStockOnly(false);
    setSortBy('featured');
    setVisibleCount(PAGE_SIZE);
  };

  const isFilteringActive =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedPriceBracket !== 'all' ||
    inStockOnly ||
    sortBy !== 'featured';

  if (!open) {
    return null;
  }

  return (
    <div className="full-catalog-modal open" role="dialog" aria-modal="true" aria-label="Product Catalog">
      {/* 1. Header Bar */}
      <header className="full-catalog-header">
        <div className="full-catalog-header-left">
          <div className="brand-icon" style={{ background: 'var(--accent-uber-blue)' }}>
            <Library size={18} color="#ffffff" />
          </div>
          <div>
            <h1 className="full-catalog-heading">Full View Product Catalog</h1>
            <span className="full-catalog-subheading">
              Browse <strong>{products.length.toLocaleString()}</strong> catalog items with live stock & ₹10,000 spend cap verification
            </span>
          </div>
        </div>

        {/* Global Catalog Search Box */}
        <div className="full-catalog-search-wrapper">
          <Search size={16} className="full-catalog-search-icon" />
          <input
            type="text"
            className="full-catalog-search-input"
            placeholder="Search products by title, category, tags, or SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
          />
          {searchQuery && (
            <button
              type="button"
              className="full-catalog-clear-btn"
              onClick={() => {
                setSearchQuery('');
                setVisibleCount(PAGE_SIZE);
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="full-catalog-header-right">
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            title="Return to Assistant"
          >
            <ArrowLeft size={16} />
            <span>Back to Assistant</span>
          </button>

          <button
            type="button"
            className="icon-btn close-btn"
            onClick={onClose}
            title="Close Catalog"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* 2. Filter & Sort Toolbar */}
      <div className="full-catalog-toolbar">
        {/* Category Pills Row */}
        <div className="full-catalog-categories-row">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Filter Controls Row */}
        <div className="full-catalog-controls-row">
          <div className="full-catalog-controls-left">
            <span className="full-catalog-count-pill">
              Showing <strong>{Math.min(visibleCount, processedProducts.length).toLocaleString()}</strong> of{' '}
              <strong>{processedProducts.length.toLocaleString()}</strong> items
            </span>

            {/* Price Filter Pills */}
            <div className="price-bracket-group">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under_1000', label: '< ₹1,000' },
                { id: 'under_3000', label: '< ₹3,000' },
                { id: 'under_5000', label: '< ₹5,000' },
                { id: 'under_10000', label: '₹10,000 Cap' },
              ].map((bracket) => (
                <button
                  key={bracket.id}
                  type="button"
                  className={`bracket-btn ${selectedPriceBracket === bracket.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPriceBracket(bracket.id);
                    setVisibleCount(PAGE_SIZE);
                  }}
                >
                  {bracket.label}
                </button>
              ))}
            </div>

            {/* In-Stock Toggle */}
            <label className="instock-checkbox-label">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setVisibleCount(PAGE_SIZE);
                }}
              />
              <span>In Stock Only</span>
            </label>
          </div>

          <div className="full-catalog-controls-right">
            {/* Sorting Dropdown */}
            <div className="sort-dropdown-wrapper">
              <label htmlFor="catalog-sort">Sort:</label>
              <select
                id="catalog-sort"
                className="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="stock_desc">Available Stock First</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>

            {isFilteringActive && (
              <button
                type="button"
                className="reset-filters-btn"
                onClick={resetFilters}
                title="Reset all filters"
              >
                <RotateCcw size={12} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Product Grid Feed */}
      <main className="full-catalog-scroll-area">
        {displayedProducts.length === 0 ? (
          <div className="full-catalog-empty">
            <div className="empty-icon-circle">
              <Search size={28} color="var(--text-muted)" />
            </div>
            <h3>No products match your criteria</h3>
            <p>Try adjusting your search query, price brackets, or category filter.</p>
            <button type="button" className="buy-now-btn" onClick={resetFilters} style={{ width: 'auto', padding: '8px 24px' }}>
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <>
            <div className="full-catalog-grid">
              {displayedProducts.map((item) => (
                <FullCatalogCard
                  key={item.sku}
                  item={item}
                  onSelectProduct={(product, qty) => {
                    onSelectProduct && onSelectProduct(product, qty);
                    onClose();
                  }}
                  onAskAgent={(prompt) => {
                    onAskAgent && onAskAgent(prompt);
                    onClose();
                  }}
                />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < processedProducts.length && (
              <div className="full-catalog-load-more-row">
                <button
                  type="button"
                  className="full-catalog-load-more-btn"
                  onClick={handleLoadMore}
                >
                  Load More Products ({processedProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
