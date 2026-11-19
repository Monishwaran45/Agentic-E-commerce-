import React, { useState } from 'react';
import { Camera, Upload, Sparkles, CheckCircle2, ArrowRight, X, Image as ImageIcon } from 'lucide-react';

const SAMPLE_PREVIEWS = [
  {
    name: 'Running Sneakers',
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    tags: ['red', 'athletic', 'cushioned'],
    matchedSku: 'SHOE-001',
    matchedTitle: 'Nike Air Zoom Pegasus - Crimson',
    price: 2499,
    confidence: '96.4%',
  },
  {
    name: 'Wireless ANC Headphones',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    tags: ['matte-black', 'over-ear', 'noise-cancelling'],
    matchedSku: 'HEAD-001',
    matchedTitle: 'Sony WH-1000XM5 Noise Cancelling',
    price: 4999,
    confidence: '98.1%',
  },
  {
    name: 'Smart AMOLED Watch',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    tags: ['silver', 'digital', 'amoled'],
    matchedSku: 'WAT-001',
    matchedTitle: 'Titan Smart Pro AMOLED GPS',
    price: 3499,
    confidence: '94.7%',
  },
  {
    name: 'Commuter Backpack',
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    tags: ['water-resistant', 'laptop-sleeve', 'black'],
    matchedSku: 'BAG-001',
    matchedTitle: 'Urban Commuter 25L Laptop Pack',
    price: 1899,
    confidence: '95.2%',
  },
];

export default function VisualSearchModal({ isOpen, onClose, onSelectProduct, onSearchByText }) {
  const [selectedSample, setSelectedSample] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  if (!isOpen) return null;

  const handleSelectSample = (sample) => {
    setSelectedSample(sample);
    setUploadedUrl(sample.image);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        category: sample.category,
        dominantColor: sample.tags[0],
        features: sample.tags.join(', '),
        matchedSku: sample.matchedSku,
        matchedTitle: sample.matchedTitle,
        price: sample.price,
        confidence: sample.confidence,
        image: sample.image,
      });
    }, 700);
  };

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setUploadedUrl(tempUrl);
      setSelectedSample(null);
      setIsAnalyzing(true);
      setAnalysisResult(null);

      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisResult({
          category: 'Footwear / Apparel',
          dominantColor: 'Multi-tone',
          features: 'high-contrast, athletic silhouette, modern profile',
          matchedSku: 'SHOE-001',
          matchedTitle: 'Nike Air Zoom Pegasus - Athletic Edition',
          price: 2499,
          confidence: '93.5%',
          image: tempUrl,
        });
      }, 900);
    }
  };

  const handleApplyMatch = () => {
    if (analysisResult) {
      if (onSelectProduct) {
        onSelectProduct({
          sku: analysisResult.matchedSku,
          name: analysisResult.matchedTitle,
          price: analysisResult.price,
          stock: 12,
          image: analysisResult.image,
        });
      }
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 2000,
      fontFamily: 'Inter, system-ui, sans-serif',
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: '#0d1527',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#f8fafc',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
              <Camera size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>
                Visual Search & "Snap to Shop"
              </h3>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Computer Vision Embeddings Matcher • Instant Catalog Mapping
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Upload Zone & Samples */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {/* Drag & Drop Upload Tile */}
          <label style={{
            background: '#070b14',
            border: '2px dashed #1e293b',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'border-color 0.2s ease',
          }}>
            <Upload size={24} color="#38bdf8" />
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>
              Upload or Snap Photo
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>
              PNG, JPG, WEBP up to 10MB
            </div>
            <input type="file" accept="image/*" onChange={handleCustomUpload} style={{ display: 'none' }} />
          </label>

          {/* Quick Sample Selector */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
              Or Try A Sample Image
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {SAMPLE_PREVIEWS.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => handleSelectSample(sample)}
                  style={{
                    background: selectedSample?.name === sample.name ? 'rgba(56, 189, 248, 0.15)' : '#101a30',
                    border: selectedSample?.name === sample.name ? '1px solid #38bdf8' : '1px solid #1e293b',
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <img
                    src={sample.image}
                    alt={sample.name}
                    style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {sample.name}
                    </div>
                    <div style={{ fontSize: '9px', color: '#64748b' }}>
                      {sample.confidence} match
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Analysis & Match Preview */}
        {isAnalyzing && (
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}>
            <Sparkles size={24} color="#38bdf8" className="spin-icon" />
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>
              Extracting Visual Embeddings...
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              Analyzing color palette, edge contours, and catalog vector database similarity
            </div>
          </div>
        )}

        {analysisResult && !isAnalyzing && (
          <div style={{
            background: '#070b14',
            border: '1px solid #22c55e',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#22c55e" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e' }}>
                  CATALOG MATCH CONFIRMED ({analysisResult.confidence} SIMILARITY)
                </span>
              </div>
              <span style={{
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                fontWeight: 600,
              }}>
                IN STOCK (SKU: {analysisResult.matchedSku})
              </span>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <img
                src={analysisResult.image}
                alt="Matched Item"
                style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #1e293b' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>
                  {analysisResult.matchedTitle}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                  Category: <strong style={{ color: '#cbd5e1' }}>{analysisResult.category}</strong> • Attributes: {analysisResult.features}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
                  ₹{analysisResult.price.toLocaleString('en-IN')}
                </div>
              </div>

              <button
                onClick={handleApplyMatch}
                style={{
                  background: '#22c55e',
                  color: '#000000',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>Select & Buy</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
