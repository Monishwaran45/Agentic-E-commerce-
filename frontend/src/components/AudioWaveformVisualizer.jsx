import React, { useEffect, useState } from 'react';
import { Mic, Volume2 } from 'lucide-react';

export default function AudioWaveformVisualizer({
  isRecording = false,
  isPlaying = false,
  language = 'en-IN',
  interimTranscript = '',
}) {
  const [bars, setBars] = useState([15, 25, 40, 60, 85, 50, 70, 95, 60, 45, 80, 55, 35, 65, 30, 20]);

  useEffect(() => {
    if (!isRecording && !isPlaying) return;

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => {
          const base = isRecording ? 25 : 20;
          const variance = isRecording ? 75 : 60;
          return Math.floor(base + Math.random() * variance);
        })
      );
    }, 90);

    return () => clearInterval(interval);
  }, [isRecording, isPlaying]);

  if (!isRecording && !isPlaying) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(13, 21, 39, 0.95) 0%, rgba(7, 13, 26, 0.95) 100%)',
      border: `1px solid ${isRecording ? '#ef4444' : '#38bdf8'}`,
      borderRadius: '10px',
      padding: '8px 14px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      boxShadow: `0 4px 20px ${isRecording ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.25)'}`,
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: isRecording ? '#ef4444' : '#38bdf8',
          color: isRecording ? '#ffffff' : '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 10px ${isRecording ? '#ef4444' : '#38bdf8'}`,
        }}>
          {isRecording ? <Mic size={15} /> : <Volume2 size={15} />}
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc' }}>
            {isRecording ? 'GNANI ASR LISTENING...' : 'GNANI TIMBRE TTS PLAYBACK...'}
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>
            Dialect: <strong style={{ color: '#38bdf8' }}>{language}</strong> • {interimTranscript ? `"${interimTranscript}"` : 'Listening for products or negotiation...'}
          </div>
        </div>
      </div>

      {/* 16 Animated Frequency Equalizer Bars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '24px' }}>
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width: '3px',
              height: `${Math.max(6, (h / 100) * 24)}px`,
              background: isRecording
                ? 'linear-gradient(to top, #ef4444, #f59e0b)'
                : 'linear-gradient(to top, #0284c7, #38bdf8)',
              borderRadius: '2px',
              transition: 'height 0.08s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
