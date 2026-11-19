import React, { useState } from 'react';
import { MapPin, ShieldCheck, Navigation, Crosshair, CheckCircle2, User, Clock, Truck, ZoomIn, ZoomOut } from 'lucide-react';

export default function GpsGeoFenceMap({
  disputeId,
  buyerName = 'Marcus Vance',
  address = 'Indiranagar, Bengaluru, KA 560038',
  trackingNumber = 'BLR993821',
  carrier = 'BlueDart Express',
  gps = { latitude: 12.9716, longitude: 77.5946, radiusMeters: 15 },
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayer, setActiveLayer] = useState('radar'); // 'radar' | 'satellite' | 'route'

  return (
    <div style={{
      background: '#0a0f1d',
      border: '1px solid #1e293b',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      {/* Top Header Controls */}
      <div style={{
        padding: '10px 14px',
        background: '#0d1527',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
          }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.5px' }}>
            CARRIER GPS GEO-FENCE VERIFICATION
          </span>
          <span style={{
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(34, 197, 94, 0.15)',
            color: '#22c55e',
            fontWeight: 600,
            border: '1px solid rgba(34, 197, 94, 0.3)',
          }}>
            VERIFIED INSIDE ZONE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ display: 'inline-flex', background: '#131e36', borderRadius: '6px', padding: '2px', border: '1px solid #1e293b' }}>
            <button
              onClick={() => setActiveLayer('radar')}
              style={{
                background: activeLayer === 'radar' ? '#38bdf8' : 'transparent',
                color: activeLayer === 'radar' ? '#000000' : '#94a3b8',
                border: 'none',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Radar Grid
            </button>
            <button
              onClick={() => setActiveLayer('satellite')}
              style={{
                background: activeLayer === 'satellite' ? '#38bdf8' : 'transparent',
                color: activeLayer === 'satellite' ? '#000000' : '#94a3b8',
                border: 'none',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Dark Sat
            </button>
          </div>

          <button
            onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.2))}
            style={{ background: '#1e293b', border: 'none', color: '#cbd5e1', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
            style={{ background: '#1e293b', border: 'none', color: '#cbd5e1', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
        </div>
      </div>

      {/* Interactive Vector Geo-Map Display */}
      <div style={{
        height: '240px',
        position: 'relative',
        background: activeLayer === 'radar'
          ? 'radial-gradient(circle at center, #101e38 0%, #070d1a 100%)'
          : 'linear-gradient(135deg, #09111e 0%, #030710 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Grid lines */}
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.25 }}>
          <defs>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
        </svg>

        {/* Concentric Radar Rings */}
        <div style={{
          position: 'absolute',
          width: `${160 * zoomLevel}px`,
          height: `${160 * zoomLevel}px`,
          borderRadius: '50%',
          border: '1px dashed rgba(56, 189, 248, 0.4)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          width: `${240 * zoomLevel}px`,
          height: `${240 * zoomLevel}px`,
          borderRadius: '50%',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          pointerEvents: 'none',
        }} />

        {/* Carrier Breadcrumb Route Path */}
        <svg
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            transform: `scale(${zoomLevel})`,
          }}
        >
          <path
            d="M 60 190 Q 140 170 200 130 T 320 120"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            opacity="0.8"
          />
          {/* Waypoint 1: Local Hub */}
          <circle cx="60" cy="190" r="4" fill="#64748b" />
          {/* Waypoint 2: In-Transit */}
          <circle cx="200" cy="130" r="4" fill="#f59e0b" />
        </svg>

        {/* Geo-fence circular zone */}
        <div style={{
          position: 'absolute',
          width: `${110 * zoomLevel}px`,
          height: `${110 * zoomLevel}px`,
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.15)',
          border: '2px solid #22c55e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
          transform: `scale(${zoomLevel})`,
        }}>
          <span style={{
            position: 'absolute',
            top: '-20px',
            fontSize: '9px',
            fontWeight: 700,
            color: '#22c55e',
            background: 'rgba(6, 78, 59, 0.8)',
            padding: '1px 6px',
            borderRadius: '4px',
            border: '1px solid #059669',
            whiteSpace: 'nowrap',
          }}>
            15m Registered Geo-Fence
          </span>
        </div>

        {/* Delivery Drop-off Pin */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
        }}>
          <div style={{
            background: '#22c55e',
            color: '#000000',
            padding: '6px',
            borderRadius: '50%',
            boxShadow: '0 0 16px #22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MapPin size={18} strokeWidth={2.5} />
          </div>
          <div style={{
            marginTop: '6px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #334155',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#f8fafc',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
          }}>
            <div>Drop-off Location: {gps.latitude.toFixed(4)}, {gps.longitude.toFixed(4)}</div>
            <div style={{ color: '#94a3b8', fontSize: '9px' }}>Delivered to Front Door & Signed</div>
          </div>
        </div>

        {/* Telemetry HUD Overlays in corners */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '10px',
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '6px 10px',
          borderRadius: '6px',
          border: '1px solid #1e293b',
          fontSize: '10px',
          color: '#94a3b8',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          <div><strong style={{ color: '#f1f5f9' }}>Lat/Lng:</strong> {gps.latitude.toFixed(6)}° N, {gps.longitude.toFixed(6)}° E</div>
          <div><strong style={{ color: '#f1f5f9' }}>Carrier:</strong> {carrier} (AWB: {trackingNumber})</div>
          <div><strong style={{ color: '#22c55e' }}>Status:</strong> Proof Uploaded & Signed</div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '10px',
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '6px 10px',
          borderRadius: '6px',
          border: '1px solid #1e293b',
          fontSize: '10px',
          color: '#94a3b8',
          textAlign: 'right',
        }}>
          <div><strong style={{ color: '#38bdf8' }}>Accuracy:</strong> ±2.1 meters</div>
          <div><strong style={{ color: '#f1f5f9' }}>Timestamp:</strong> 2026-11-18 16:45 IST</div>
        </div>
      </div>

      {/* Bottom Proof Strip with Recipient Digital Signature */}
      <div style={{
        padding: '10px 14px',
        background: '#0d1527',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={15} color="#38bdf8" />
          <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
            Recipient: <strong style={{ color: '#ffffff' }}>{buyerName}</strong>
          </span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>•</span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{address}</span>
        </div>

        {/* Digital Signature Canvas Preview */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#131b2e',
          padding: '4px 10px',
          borderRadius: '6px',
          border: '1px solid #1e293b',
        }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>CARRIER SIGNATURE:</span>
          <span style={{
            fontFamily: 'Caveat, "Brush Script MT", cursive, sans-serif',
            fontSize: '15px',
            color: '#38bdf8',
            fontWeight: 700,
            transform: 'rotate(-3deg)',
            display: 'inline-block',
          }}>
            {buyerName}
          </span>
          <CheckCircle2 size={13} color="#22c55e" />
        </div>
      </div>
    </div>
  );
}
