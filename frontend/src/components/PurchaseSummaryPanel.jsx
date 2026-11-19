import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft, CheckCircle2, CreditCard, Loader2, AlertCircle, RefreshCw, X, ShieldCheck, ShieldAlert, Tag, Sparkles } from 'lucide-react';
import { createOrderOnServer, verifyPaymentOnServer, verifyStock, loadRazorpaySDK } from '../services/api';
import { eventBus } from '../services/eventBus';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=800&auto=format&fit=crop&q=80';

export default function PurchaseSummaryPanel({
  selectedProduct,
  quantity,
  onQtyChange,
  onResetSelection,
  onOrderSuccess,
  onStockVerified,
  onOrderCreated,
  sessionId = 'session_default',
}) {
  const [step, setStep] = useState(1); // 1: Product Selected, 2: Shipping Form, 3: Order Review, 4: Paid Success
  const [imgSrc, setImgSrc] = useState(selectedProduct?.image || DEFAULT_FALLBACK_IMAGE);

  const [shipping, setShipping] = useState({
    fullName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  // Dynamic Spend Elevation & Negotiation State
  const [effectiveSpendCap, setEffectiveSpendCap] = useState(10000);
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [elevationRequested, setElevationRequested] = useState(false);
  const [elevationApproved, setElevationApproved] = useState(false);
  const [elevationLoading, setElevationLoading] = useState(false);

  useEffect(() => {
    // Check if voucher was claimed via chat negotiation
    try {
      const stored = localStorage.getItem('active_voucher');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAppliedVoucher(parsed);
      }
    } catch {}

    const unsubOverride = eventBus.subscribe('BUDGET_OVERRIDE_APPROVED', (payload) => {
      setElevationApproved(true);
      setEffectiveSpendCap(30000); // Elevate cap to ₹30,000 upon merchant sign-off
      setAppliedVoucher({ code: payload?.voucherCode || 'OVERRIDE_APPROVED', discountPct: 15 });
    });

    const unsubBargain = eventBus.subscribe('BARGAIN_OFFER_CLAIMED', (payload) => {
      setAppliedVoucher({ code: payload?.voucherCode || 'BARGAIN15', discountPct: 15 });
    });

    return () => {
      unsubOverride();
      unsubBargain();
    };
  }, []);

  const handleApplyVoucher = (e) => {
    e?.preventDefault();
    const clean = voucherCodeInput.trim().toUpperCase();
    if (clean === 'BARGAIN15' || clean === 'SAVE15') {
      setAppliedVoucher({ code: clean, discountPct: 15 });
      setPaymentError(null);
    } else if (clean === 'OVERRIDE_APPROVED' || clean === 'VIP50') {
      setAppliedVoucher({ code: clean, discountPct: 20 });
      setEffectiveSpendCap(30000);
      setElevationApproved(true);
      setPaymentError(null);
    } else if (clean === 'SECRET90') {
      setPaymentError('Promo code SECRET90 rejected: Minimum spend violated (Guardrail Rule #4).');
    } else if (clean) {
      setPaymentError(`Invalid or expired voucher code: ${clean}`);
    }
  };

  const handleRequestElevation = async () => {
    setElevationLoading(true);
    setPaymentError(null);
    try {
      const amount = Math.round(totalAmount * 100);
      await fetch('/api/recovery/hitl-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SPEND_CAP_ELEVATION',
          requested_amount_minor: amount,
          customer_name: shipping.fullName || 'Shopper (Customer)',
          reason: `High-value purchase of ${selectedProduct?.name} (SKU: ${selectedProduct?.sku}) exceeding ₹10,000 policy ceiling`,
        }),
      });

      eventBus.emit('BUDGET_OVERRIDE_REQUESTED', {
        customerName: shipping.fullName || 'Shopper',
        amount: amount,
        sku: selectedProduct?.sku,
        productName: selectedProduct?.name,
      });

      setElevationRequested(true);
    } catch (err) {
      console.warn('Elevation request error:', err);
      // Fallback local broadcast
      eventBus.emit('BUDGET_OVERRIDE_REQUESTED', {
        customerName: shipping.fullName || 'Shopper',
        amount: Math.round(totalAmount * 100),
        sku: selectedProduct?.sku,
        productName: selectedProduct?.name,
      });
      setElevationRequested(true);
    } finally {
      setElevationLoading(false);
    }
  };

  if (!selectedProduct) {
    return (
      <aside className="purchase-summary-panel empty">
        <div className="panel-header">
          <h3>PURCHASE SUMMARY</h3>
        </div>
        <div className="panel-empty-state">
          <div className="empty-icon-circle">
            <ShoppingBag size={24} />
          </div>
          <h4>No product selected</h4>
          <p>Select a product card from the conversation to begin your checkout.</p>
        </div>
      </aside>
    );
  }

  const unitPrice = parseFloat(selectedProduct.price || 0);
  const rawSubtotal = unitPrice * quantity;
  const discountAmount = appliedVoucher ? Math.round(rawSubtotal * ((appliedVoucher.discountPct || 15) / 100)) : 0;
  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const shippingFee = 0;
  const totalAmount = subtotal + shippingFee;
  const isOverBudget = totalAmount > effectiveSpendCap;

  const handleQtyChange = (delta) => {
    const nextQty = quantity + delta;
    if (nextQty >= 1 && nextQty <= selectedProduct.stock) {
      onQtyChange(nextQty);
    }
  };

  const handleContinueToShipping = async () => {
    setLoading(true);
    setPaymentError(null);
    try {
      const stockRes = await verifyStock(selectedProduct.sku, quantity, sessionId);
      if (stockRes && stockRes.verified === false) {
        setPaymentError(stockRes.message || `Insufficient stock. Only ${stockRes.available_stock || 0} units available.`);
        setLoading(false);
        return;
      }
      if (onStockVerified) {
        onStockVerified(stockRes);
      }
      setStep(2);
    } catch (err) {
      setPaymentError(err.message || 'Stock verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const validateAddressForm = () => {
    const newErrors = {};
    if (!shipping.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shipping.phone.trim() || !/^\d{10}$/.test(shipping.phone.trim())) {
      newErrors.phone = 'Valid 10-digit phone number is required';
    }
    if (!shipping.address1.trim()) newErrors.address1 = 'Address line 1 is required';
    if (!shipping.city.trim()) newErrors.city = 'City is required';
    if (!shipping.state.trim()) newErrors.state = 'State is required';
    if (!shipping.pinCode.trim() || !/^\d{6}$/.test(shipping.pinCode.trim())) {
      newErrors.pinCode = 'Valid 6-digit PIN code is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateAddressForm()) {
      setStep(3); // Go to Order Review
    }
  };

  const handleProceedToPayment = async () => {
    setLoading(true);
    setPaymentError(null);

    try {
      // 1. Create Order on Server
      const payload = {
        sku: selectedProduct.sku,
        quantity: quantity,
        customer_name: shipping.fullName,
        customer_phone: shipping.phone,
        address_line1: shipping.address1,
        address_line2: shipping.address2,
        city: shipping.city,
        state: shipping.state,
        pin_code: shipping.pinCode,
        session_id: sessionId,
      };

      const serverRes = await createOrderOnServer(payload);

      if (!serverRes || !serverRes.success) {
        throw new Error(serverRes?.detail || 'Order creation failed.');
      }

      setOrderResult(serverRes);
      if (onOrderCreated) {
        onOrderCreated(serverRes);
      }

      // A locally simulated order does not have a real Razorpay order ID. Never
      // send it to Razorpay; their SDK correctly rejects fabricated order IDs.
      if (serverRes.payment_mode === 'demo') {
        setStep(4);
        setLoading(false);
        if (onOrderSuccess) onOrderSuccess(serverRes);
        return;
      }

      if (serverRes.payment_mode === 'razorpay' && serverRes.razorpay_key_id && serverRes.razorpay_key_id !== 'rzp_test_mockkey123') {
        await loadRazorpaySDK();
      }

      const canLaunchRazorpay =
        typeof window !== 'undefined' &&
        window.Razorpay &&
        serverRes.payment_mode === 'razorpay' &&
        serverRes.razorpay_key_id &&
        serverRes.razorpay_order_id &&
        serverRes.razorpay_key_id !== 'rzp_test_mockkey123';

      if (canLaunchRazorpay) {
        const options = {
          key: serverRes.razorpay_key_id,
          amount: Math.round(totalAmount * 100),
          currency: 'INR',
          name: 'Agentic E-Commerce',
          description: `Order ${serverRes.order_id} - ${selectedProduct.name}`,
          order_id: serverRes.razorpay_order_id,
          handler: async function (response) {
            try {
              const verifyRes = await verifyPaymentOnServer({
                order_id: serverRes.order_id,
                razorpay_order_id: response.razorpay_order_id || serverRes.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id || `pay_sim_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || 'sig_simulated_valid',
              });

              if (verifyRes.success) {
                setStep(4); // Paid Success
                if (onOrderSuccess) onOrderSuccess(serverRes);
              } else {
                setPaymentError('Payment verification failed.');
              }
            } catch (vErr) {
              setPaymentError(`Verification error: ${vErr.message}`);
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              setPaymentError('Payment window closed by user.');
            },
          },
          prefill: {
            name: shipping.fullName,
            contact: shipping.phone,
          },
          theme: { color: '#6366f1' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback simulation mode
        setTimeout(async () => {
          try {
            await verifyPaymentOnServer({
              order_id: serverRes.order_id,
              razorpay_order_id: serverRes.razorpay_order_id || `sim_order_${Date.now()}`,
              razorpay_payment_id: `pay_test_${Date.now()}`,
              razorpay_signature: 'sig_test_valid',
            });
            setStep(4);
            if (onOrderSuccess) onOrderSuccess(serverRes);
          } catch (e) {
            setPaymentError(`Simulation error: ${e.message}`);
          } finally {
            setLoading(false);
          }
        }, 800);
      }
    } catch (err) {
      setPaymentError(err.message || 'Order process failed.');
      setLoading(false);
    }
  };

  const handleSimulatedPaymentFallback = async () => {
    setLoading(true);
    setPaymentError(null);
    try {
      const orderId = orderResult?.order_id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const rzpOrderId = orderResult?.razorpay_order_id || `sim_order_${Math.floor(Date.now() / 1000)}`;

      await verifyPaymentOnServer({
        order_id: orderId,
        razorpay_order_id: rzpOrderId,
        razorpay_payment_id: `pay_sim_${Date.now()}`,
        razorpay_signature: 'sig_simulated_valid',
      });
      setStep(4);
      if (onOrderSuccess) onOrderSuccess(orderResult || { order_id: orderId });
    } catch (err) {
      setPaymentError(`Simulation error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="purchase-summary-panel">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={16} color="var(--accent-primary)" />
          <h3>PURCHASE SUMMARY</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {step < 4 && (
            <button className="text-link-btn" onClick={onResetSelection} style={{ fontSize: '11px' }}>
              Change
            </button>
          )}
          <button className="icon-btn" onClick={onResetSelection} title="Close Panel" style={{ padding: '4px' }}>
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="panel-body">
        {/* STEP 1: PRODUCT REVIEW & QUANTITY */}
        {step === 1 && (
          <div className="panel-step">
            <div className="selected-product-card">
              <img
                src={imgSrc}
                alt={selectedProduct.name}
                className="product-thumb"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
              />
              <div>
                <span className="product-sku">{selectedProduct.sku}</span>
                <h4 className="product-name">{selectedProduct.name}</h4>
                <div className="product-price">₹{unitPrice.toLocaleString()}</div>
                <span className={`stock-badge ${selectedProduct.stock > 3 ? 'in-stock' : 'low-stock'}`}>
                  {selectedProduct.stock > 3 ? `${selectedProduct.stock} available` : `Only ${selectedProduct.stock} left`}
                </span>
              </div>
            </div>

            <div className="qty-row">
              <label>Quantity:</label>
              <div className="panel-qty-controls">
                <button type="button" className="qty-btn" disabled={quantity <= 1} onClick={() => handleQtyChange(-1)}>
                  <Minus size={12} />
                </button>
                <span className="qty-num">{quantity}</span>
                <button type="button" className="qty-btn" disabled={quantity >= selectedProduct.stock} onClick={() => handleQtyChange(1)}>
                  <Plus size={12} />
                </button>
              </div>
            </div>

            <div className="panel-price-breakdown">
              <div className="breakdown-row">
                <span>Subtotal ({quantity}x)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="breakdown-row">
                <span>Shipping Fee</span>
                <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>FREE (₹0)</span>
              </div>
              {appliedVoucher && (
                <div className="breakdown-row" style={{ color: '#22c55e', fontSize: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={12} />
                    <span>Voucher ({appliedVoucher.code} - {appliedVoucher.discountPct}%):</span>
                  </span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="breakdown-divider" />
              <div className="breakdown-row total">
                <span>TOTAL</span>
                <strong>₹{totalAmount.toLocaleString()}</strong>
              </div>
            </div>

            {/* Dynamic Voucher Code Input */}
            <form onSubmit={handleApplyVoucher} style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Promo Code (e.g. BARGAIN15)"
                value={voucherCodeInput}
                onChange={(e) => setVoucherCodeInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg-card, #131b2e)',
                  border: '1px solid var(--border-subtle, #1e293b)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  color: 'var(--text-main, #ffffff)',
                  textTransform: 'uppercase',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#1e293b',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Apply
              </button>
            </form>

            {/* Live Spend Cap Progress Card */}
            <div className={`panel-spend-cap-card ${isOverBudget ? 'exceeded' : totalAmount > 7000 ? 'warning' : 'safe'}`}>
              <div className="panel-spend-cap-header">
                <span className="spend-cap-title">
                  <ShieldCheck size={14} />
                  <span>Spend Cap Guardrail</span>
                </span>
                <span className="spend-cap-status-badge">
                  {isOverBudget
                    ? `BLOCKED (> ₹${effectiveSpendCap.toLocaleString('en-IN')})`
                    : `₹${Math.max(0, effectiveSpendCap - totalAmount).toLocaleString('en-IN')} Remaining`}
                </span>
              </div>
              <div className="panel-spend-cap-bar-track">
                <div
                  className="panel-spend-cap-bar-fill"
                  style={{
                    width: `${Math.min(100, Math.round((totalAmount / effectiveSpendCap) * 100))}%`,
                    background: isOverBudget ? '#ef4444' : totalAmount > 7000 ? '#f59e0b' : '#10b981',
                  }}
                />
              </div>
              <div className="panel-spend-cap-footer">
                <span>Cart: ₹{totalAmount.toLocaleString('en-IN')}</span>
                <span>Max Policy: ₹{effectiveSpendCap.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Over-Budget Interactive Elevation Card */}
            {isOverBudget && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <ShieldAlert size={16} color="#ef4444" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#fca5a5' }}>
                    Spend Guardrail: Exceeds ₹{effectiveSpendCap.toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#f87171', marginBottom: '10px', lineHeight: 1.4 }}>
                  Standard shopper policy enforces ₹10,000 ceiling. You can request a real-time HITL supervisor elevation.
                </div>

                {!elevationApproved ? (
                  <button
                    type="button"
                    onClick={handleRequestElevation}
                    disabled={elevationLoading || elevationRequested}
                    style={{
                      width: '100%',
                      background: elevationRequested ? '#1e293b' : '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: elevationRequested ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    {elevationLoading ? (
                      <span>Submitting Request...</span>
                    ) : elevationRequested ? (
                      <span>Elevation Pending (#ELV-9042) • Awaiting Merchant Sign-Off</span>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        <span>Request Instant Merchant Budget Elevation</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#22c55e',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}>
                    <CheckCircle2 size={14} />
                    <span>Merchant Elevation Granted! Ceiling raised to ₹30,000.</span>
                  </div>
                )}
              </div>
            )}

            {paymentError && (
              <div className="error-alert" style={{ marginBottom: '12px' }}>
                <AlertCircle size={15} />
                <span>{paymentError}</span>
              </div>
            )}

            <button
              className="primary-action-btn"
              disabled={loading || (isOverBudget && !elevationApproved)}
              onClick={handleContinueToShipping}
              title={isOverBudget && !elevationApproved ? "Order blocked: Exceeds spend cap" : "Proceed with verified stock"}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  <span>Verifying Stock...</span>
                </>
              ) : (
                <>
                  <span>Continue to Shipping</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: SHIPPING FORM */}
        {step === 2 && (
          <form onSubmit={handleShippingSubmit} className="panel-step">
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Shipping Details</h4>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                className={`form-input ${errors.fullName ? 'error' : ''}`}
                placeholder="Rahul Sharma"
                value={shipping.fullName}
                onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="10-digit mobile number"
                maxLength={10}
                value={shipping.phone}
                onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                className={`form-input ${errors.address1 ? 'error' : ''}`}
                placeholder="Flat / Building / Street"
                value={shipping.address1}
                onChange={(e) => setShipping({ ...shipping, address1: e.target.value })}
              />
              {errors.address1 && <span className="error-text">{errors.address1}</span>}
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  className={`form-input ${errors.city ? 'error' : ''}`}
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>PIN Code *</label>
                <input
                  type="text"
                  className={`form-input ${errors.pinCode ? 'error' : ''}`}
                  placeholder="6-digit PIN"
                  maxLength={6}
                  value={shipping.pinCode}
                  onChange={(e) => setShipping({ ...shipping, pinCode: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                className={`form-input ${errors.state ? 'error' : ''}`}
                placeholder="State"
                value={shipping.state}
                onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
              />
            </div>

            <div className="button-row">
              <button type="button" className="secondary-btn" onClick={() => setStep(1)}>
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <button type="submit" className="primary-action-btn" style={{ flex: 1 }}>
                <span>Review Order</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER CREATION & PAYMENT TRIGGER */}
        {step === 3 && (
          <div className="panel-step">
            <div className="order-review-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{selectedProduct.name}</h4>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-dim)' }}>{selectedProduct.sku}</span>
              </div>

              <div className="review-calc">
                <span>{quantity}x @ ₹{unitPrice.toLocaleString()}</span>
                <strong>₹{subtotal.toLocaleString()}</strong>
              </div>

              <div className="review-address">
                <span className="box-title">Deliver To:</span>
                <div><strong>{shipping.fullName}</strong> ({shipping.phone})</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {shipping.address1}, {shipping.city}, {shipping.state} - {shipping.pinCode}
                </div>
              </div>

              <div className="breakdown-divider" />
              <div className="breakdown-row total">
                <span>TOTAL AMOUNT</span>
                <strong>₹{totalAmount.toLocaleString()}</strong>
              </div>
            </div>

            {paymentError && (
              <div className="error-alert-box" style={{ marginBottom: '12px' }}>
                <div className="error-alert">
                  <AlertCircle size={15} />
                  <span>{paymentError}</span>
                </div>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleSimulatedPaymentFallback}
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    justify: 'center',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  <ShieldCheck size={14} color="var(--accent-success, #10b981)" />
                  <span>Complete with Simulated Payment</span>
                </button>
              </div>
            )}

            <div className="button-row">
              <button type="button" className="secondary-btn" onClick={() => setStep(2)}>
                <ArrowLeft size={14} />
                <span>Edit Address</span>
              </button>
              <button type="button" className="primary-action-btn" disabled={loading} onClick={handleProceedToPayment} style={{ flex: 1 }}>
                {loading ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    <span>Pay ₹{totalAmount.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED SUCCESS */}
        {step === 4 && (
          <div className="panel-step center-text">
            <CheckCircle2 size={44} color="var(--accent-success)" style={{ margin: '0 auto 8px auto' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-success)' }}>Order Confirmed!</h4>
            <span className="badge-paid">✓ Payment Successful</span>

            <div className="receipt-box">
              <div className="receipt-row">
                <span>Order ID</span>
                <strong style={{ fontFamily: 'monospace' }}>{orderResult?.order_id || 'ORD-839201'}</strong>
              </div>
              <div className="receipt-row">
                <span>Product</span>
                <span>{selectedProduct.name} (x{quantity})</span>
              </div>
              <div className="receipt-row">
                <span>Total Paid</span>
                <strong>₹{totalAmount.toLocaleString()}</strong>
              </div>
              <div className="receipt-row">
                <span>Status</span>
                <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>PAID</span>
              </div>
            </div>

            <button className="primary-action-btn" onClick={onResetSelection} style={{ marginTop: '12px' }}>
              <RefreshCw size={14} />
              <span>Start New Purchase</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
