import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  Radio,
  CheckCircle2,
  AlertCircle,
  Headphones,
  Check,
  ShieldAlert,
  Zap,
  Languages,
} from 'lucide-react';
import { sendVoiceTurn, synthesizeSpeech } from '../services/api';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=800&auto=format&fit=crop&q=80';

const LANGUAGE_CONFIGS = {
  'en-IN': {
    code: 'en-IN',
    label: '🇬🇧 English',
    nativeVoice: 'Shivani',
    placeholder: 'Listening to you... Say "place the order" or ask anything',
    idlePrompt: 'Tap the orb or speak to start',
    chips: [
      { label: '🛒 Place the order', query: 'Place the order for running shoes' },
      { label: '👟 Running shoes under ₹3000', query: 'Show me running shoes under ₹3000' },
      { label: '🛡️ What is my spend limit?', query: 'What is my spend cap limit?' },
      { label: '🛍️ Buy 2 running shoes', query: 'Place order for 2 running shoes' },
    ],
  },
  'ta-IN': {
    code: 'ta-IN',
    label: '🇮🇳 தமிழ் (Tamil)',
    nativeVoice: 'Lakshmi',
    placeholder: 'உங்களை கவனிக்கிறது... "ஆர்டர் செய்" அல்லது கேளுங்கள்',
    idlePrompt: 'பேச தொடங்குங்கள் அல்லது வட்டத்தை தொடவும்',
    chips: [
      { label: '🛒 ஷூ 2 ஆர்டர் செய்', query: 'ஷூ 2 ஆர்டர் செய்' },
      { label: '👟 ரன்னிங் ஷூஸ் காட்டு', query: 'ரன்னிங் ஷூஸ் காட்டு' },
      { label: '🛡️ செலவு வரம்பு என்ன?', query: 'என் செலவு வரம்பு என்ன?' },
      { label: '🛍️ ஆர்டர் உறுதி செய்', query: 'இந்த பொருளை ஆர்டர் செய்' },
    ],
  },
  'hi-IN': {
    code: 'hi-IN',
    label: '🇮🇳 हिन्दी (Hindi)',
    nativeVoice: 'Devansh',
    placeholder: 'सुन रहा हूँ... "आर्डर करो" या कुछ भी पूछें',
    idlePrompt: 'शुरू करने के लिए बोलें या सर्कल पर टैप करें',
    chips: [
      { label: '🛒 रनिंग शूज़ 2 आर्डर करो', query: 'रनिंग शूज़ 2 आर्डर करो' },
      { label: '👟 शूज़ दिखाओ', query: 'रनिंग शूज़ दिखाओ' },
      { label: '🛡️ बजट लिमिट क्या है?', query: 'मेरी बजट खर्च सीमा क्या है?' },
      { label: '🛍️ आर्डर बुक करो', query: 'यह आर्डर बुक करो' },
    ],
  },
};

export default function VoiceAgentModal({
  open,
  onClose,
  onSelectProduct,
  onSendMessage,
  onOrderSuccess,
  selectedProduct = null,
  sessionId = 'default_session',
  initialLanguage = 'en-IN',
  onLanguageChange = null,
}) {
  const [language, setLanguage] = useState(initialLanguage || 'en-IN');
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'speaking'
  const [transcript, setTranscript] = useState('');
  const [agentReply, setAgentReply] = useState('');
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [voiceEngine, setVoiceEngine] = useState('vyora_natural'); // 'vyora_natural' | 'gnani_v3'
  const [selectedVoice, setSelectedVoice] = useState('Shivani');
  const [continuousMode, setContinuousMode] = useState(true);
  const [audioError, setAudioError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const activeAudioRef = useRef(null);
  const lastMatchedProductRef = useRef(selectedProduct);


  const activeLangConfig = LANGUAGE_CONFIGS[language] || LANGUAGE_CONFIGS['en-IN'];

  // Sync initial language if passed
  useEffect(() => {
    if (initialLanguage && LANGUAGE_CONFIGS[initialLanguage]) {
      setLanguage(initialLanguage);
      setSelectedVoice(LANGUAGE_CONFIGS[initialLanguage].nativeVoice);
    }
  }, [initialLanguage]);

  const handleLanguageSwitch = (langCode) => {
    setLanguage(langCode);
    const cfg = LANGUAGE_CONFIGS[langCode] || LANGUAGE_CONFIGS['en-IN'];
    setSelectedVoice(cfg.nativeVoice);
    if (onLanguageChange) onLanguageChange(langCode);
    if (status === 'listening') {
      stopListening();
    }
  };


  if (selectedProduct && selectedProduct !== lastMatchedProductRef.current) {
    lastMatchedProductRef.current = selectedProduct;
  }

  // Stop any active audio
  const stopAudio = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Natural high-fidelity Vyora Speech Synthesis
  const playVyoraVoice = useCallback(
    (text, onEnded) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) {
        if (onEnded) onEnded();
        return;
      }

      window.speechSynthesis.cancel();

      // Clean spoken text: format currency and symbols naturally for speech
      const cleanText = text
        .replace(/₹\s*([0-9,]+)/g, '$1 rupees')
        .replace(/Rs\.?\s*([0-9,]+)/gi, '$1 rupees')
        .replace(/[*_#`]/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = language;

      // Select the most natural voice available for the active language
      const voices = window.speechSynthesis.getVoices();
      let preferredVoice = null;
      if (language.startsWith('ta')) {
        preferredVoice =
          voices.find((v) => v.lang.startsWith('ta') || v.name.toLowerCase().includes('tamil')) ||
          voices.find((v) => v.lang.includes('ta'));
      } else if (language.startsWith('hi')) {
        preferredVoice =
          voices.find((v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')) ||
          voices.find((v) => v.lang.includes('hi'));
      } else {
        preferredVoice =
          voices.find((v) => v.name.includes('Google UK English Female')) ||
          voices.find((v) => v.name.includes('Google US English')) ||
          voices.find((v) => v.name.includes('Natural') && v.lang.startsWith('en')) ||
          voices.find((v) => v.name.includes('Jenny') || v.name.includes('Aria')) ||
          voices.find((v) => v.lang.startsWith('en-IN') || v.lang.startsWith('en-GB') || v.lang.startsWith('en-US')) ||
          voices[0];
      }

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setStatus('idle');
        if (onEnded) onEnded();
      };
      utterance.onerror = () => {
        setStatus('idle');
        if (onEnded) onEnded();
      };

      setStatus('speaking');
      window.speechSynthesis.speak(utterance);
    },
    [language]
  );

  // Play audio base64 from Gnani Timbre
  const playGnaniAudio = useCallback(
    (audioBase64, textToSpeak, onEnded) => {
      stopAudio();
      if (isMuted) {
        setStatus('idle');
        return;
      }

      if (audioBase64) {
        try {
          const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
          activeAudioRef.current = audio;
          setStatus('speaking');

          audio.onended = () => {
            setStatus('idle');
            activeAudioRef.current = null;
            if (onEnded) onEnded();
          };
          audio.onerror = () => {
            playVyoraVoice(textToSpeak, onEnded);
          };
          audio.play().catch(() => {
            playVyoraVoice(textToSpeak, onEnded);
          });
          return;
        } catch (err) {
          console.warn('[Gnani Audio] Error:', err);
        }
      }

      playVyoraVoice(textToSpeak, onEnded);
    },
    [isMuted, stopAudio, playVyoraVoice]
  );

  // Speech output dispatcher based on chosen engine
  const speakAgentReply = useCallback(
    (replyText, audioBase64) => {
      if (isMuted) {
        setStatus('idle');
        return;
      }

      const onFinishedSpeaking = () => {
        if (continuousMode) {
          // In hands-free live mode, automatically resume listening after brief pause
          setTimeout(() => {
            if (open) {
              startListening();
            }
          }, 450);
        }
      };

      if (voiceEngine === 'gnani_v3' && audioBase64) {
        playGnaniAudio(audioBase64, replyText, onFinishedSpeaking);
      } else {
        playVyoraVoice(replyText, onFinishedSpeaking);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [voiceEngine, isMuted, continuousMode, open, playGnaniAudio, playVyoraVoice]
  );

  // Process user speech via backend Gnani Voice Turn
  const handleVoiceInput = useCallback(
    async (spokenText, audioBase64 = null) => {
      if (!spokenText && !audioBase64) return;
      setStatus('processing');
      setAudioError(null);

      try {
        const activeItem = lastMatchedProductRef.current;
        const res = await sendVoiceTurn({
          message: spokenText || undefined,
          audioBase64: audioBase64 || undefined,
          language: language,
          sessionId,
          activeSku: activeItem?.sku,
          activeProduct: activeItem,
          voice: selectedVoice,
          model: 'timbre-v3.0',
        });

        const replyText = res.text || 'I processed your request.';
        setAgentReply(replyText);

        // If an order was placed by the agent
        if (res.order) {
          setActiveOrder(res.order);
          if (onOrderSuccess) {
            onOrderSuccess(res.order);
          }
          if (onSelectProduct && res.products?.[0]) {
            onSelectProduct(res.products[0], res.order.quantity || 1);
          }
        }

        if (Array.isArray(res.products) && res.products.length > 0) {
          setMatchedProducts(res.products);
          lastMatchedProductRef.current = res.products[0];
        }

        // Speak the reply aloud (Gemini Live or Gnani Timbre HD)
        speakAgentReply(replyText, res.audio?.audio_base64);
      } catch (err) {
        console.error('[Voice Turn] Error:', err);
        setAudioError('Voice request could not be processed. Please try again.');
        setStatus('idle');
      }
    },
    [sessionId, selectedVoice, onOrderSuccess, onSelectProduct, speakAgentReply]
  );

  // Initialize Speech Recognition & Audio Recorder
  const startListening = useCallback(async () => {
    stopAudio();
    setTranscript('');
    setAudioError(null);
    setStatus('listening');

    const SpeechRecognition = typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

    let hasSpeechRecognition = false;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onresult = (event) => {
          const current = event.results[0][0].transcript;
          setTranscript(current);
        };

        recognition.onend = () => {
          // Recognition finished
        };

        recognition.onerror = (e) => {
          if (e.error !== 'no-speech') {
            console.warn('[SpeechRecognition] Notice:', e.error);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
        hasSpeechRecognition = true;
      } catch (e) {
        console.warn('[SpeechRecognition] Start error:', e);
      }
    }

    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start();
      } catch (err) {
        console.warn('[MediaRecorder] Mic access notice:', err);
        if (!hasSpeechRecognition) {
          setAudioError('Microphone access denied. Please allow microphone permissions.');
          setStatus('idle');
        }
      }
    }
  }, [stopAudio]);

  const stopListening = useCallback(() => {
    if (status !== 'listening') return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = async () => {
        const tracks = mediaRecorderRef.current?.stream?.getTracks();
        tracks?.forEach((t) => t.stop());

        const capturedBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result ? reader.result.toString().split(',')[1] : null;
          handleVoiceInput(transcript, base64Data);
        };
        reader.readAsDataURL(capturedBlob);
      };

      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        handleVoiceInput(transcript);
      }
    } else {
      handleVoiceInput(transcript);
    }
  }, [status, transcript, handleVoiceInput]);

  // Initial greeting when modal opens
  useEffect(() => {
    if (open) {
      const greeting =
        language === 'ta-IN'
          ? 'வணக்கம்! நான் வ்யோரா (Vyora). பொருட்களை தேட அல்லது "ஆர்டர் செய்" என்று கூறி ₹10,000 வரம்பிற்குள் வாங்கலாம்!'
          : language === 'hi-IN'
          ? 'नमस्ते! मैं व्योरा (Vyora) हूँ। उत्पाद खोजने या "आर्डर करो" कहकर ₹10,000 की सीमा में खरीद सकते हैं!'
          : 'Hi! I am Vyora, your voice agent. Ask me to find products, or say "place the order" to buy anything under our ₹10,000 spend cap!';
      setAgentReply(greeting);
      setMatchedProducts([]);
      setActiveOrder(null);
      setTranscript('');
      setStatus('idle');

      // Pre-warm browser speech voices
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.getVoices();
      }
    } else {
      stopAudio();
    }
    return () => stopAudio();
  }, [open, language, stopAudio]);

  if (!open) return null;

  return (
    <div className="modal-overlay voice-agent-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content gemini-voice-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Vyora Ambient Aura Background */}
        <div className={`gemini-live-aura ${status}`} />

        {/* Header Controls */}
        <div className="voice-modal-header gemini-header">
          <div className="voice-brand-pill">
            <div className="gemini-sparkle-icon">
              <Sparkles size={16} color="#38bdf8" />
            </div>
            <div>
              <span className="voice-brand-title">Vyora Voice Agent</span>
              <span className="gemini-live-tag">
                <span className="live-dot-pulse" />
                {voiceEngine === 'vyora_natural' ? 'Live Neural AI' : 'Gnani Timbre v3.0 HD'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Voice Engine Toggle */}
            <div className="gemini-voice-switcher">
              <button
                type="button"
                className={`voice-engine-tab ${voiceEngine === 'vyora_natural' ? 'active' : ''}`}
                onClick={() => setVoiceEngine('vyora_natural')}
                title="Vyora Expressive Voice (Ultra-natural 0ms latency)"
              >
                Vyora Voice
              </button>
              <button
                type="button"
                className={`voice-engine-tab ${voiceEngine === 'gnani_v3' ? 'active' : ''}`}
                onClick={() => setVoiceEngine('gnani_v3')}
                title="Gnani Timbre v3.0 Studio Neural 48kHz"
              >
                Gnani Timbre HD
              </button>
            </div>

            <button
              type="button"
              className={`icon-btn ${isMuted ? 'active' : ''}`}
              onClick={() => {
                if (!isMuted) stopAudio();
                setIsMuted(!isMuted);
              }}
              title={isMuted ? 'Unmute Voice Reply' : 'Mute Voice Reply'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button type="button" className="icon-btn close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Multilingual Voice Switcher: English | தமிழ் (Tamil) | हिन्दी (Hindi) */}
        <div className="voice-modal-lang-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Languages size={14} color="#38bdf8" />
            <span className="lang-bar-title">Speaking Language:</span>
          </div>
          <div className="lang-pill-group">
            {Object.entries(LANGUAGE_CONFIGS).map(([code, cfg]) => (
              <button
                key={code}
                type="button"
                className={`lang-pill-btn ${language === code ? 'active' : ''}`}
                onClick={() => handleLanguageSwitch(code)}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Central Gemini Fluid Visualizer Orb */}
        <div className="voice-agent-body gemini-body">
          <div className={`gemini-orb-wrapper ${status}`}>
            <div className="gemini-wave-glow glow-1" />
            <div className="gemini-wave-glow glow-2" />
            <div className="gemini-wave-glow glow-3" />

            <button
              type="button"
              className={`gemini-core-orb-btn ${status === 'listening' ? 'listening' : ''}`}
              onClick={() => {
                if (status === 'listening') {
                  stopListening();
                } else {
                  startListening();
                }
              }}
              title={status === 'listening' ? 'Click when done speaking' : 'Click to talk with Vyora'}
            >
              {status === 'listening' ? (
                <div className="gemini-listening-wave">
                  <span className="gw-bar" />
                  <span className="gw-bar" />
                  <span className="gw-bar" />
                  <span className="gw-bar" />
                  <span className="gw-bar" />
                </div>
              ) : status === 'processing' ? (
                <RefreshCw size={38} className="spin-icon" color="#ffffff" />
              ) : status === 'speaking' ? (
                <div className="gemini-speaking-ripple">
                  <span className="ripple-circle" />
                  <Volume2 size={36} color="#ffffff" />
                </div>
              ) : (
                <Mic size={38} color="#ffffff" />
              )}
            </button>
          </div>

          {/* Status Label & Real-Time Live Transcript */}
          <div className="voice-status-wrapper">
            <span className="gemini-status-text">
              {status === 'listening' && activeLangConfig.placeholder}
              {status === 'processing' && 'Autonomous agent reasoning & executing...'}
              {status === 'speaking' && 'Speaking response...'}
              {status === 'idle' && activeLangConfig.idlePrompt}
            </span>

            {status === 'listening' && transcript && (
              <div className="gemini-speech-bubble">
                "{transcript}"
              </div>
            )}

            {audioError && (
              <div className="voice-error-pill">
                <AlertCircle size={14} />
                <span>{audioError}</span>
              </div>
            )}
          </div>

          {/* ORDER PLACED CONFIRMATION RECEIPT CARD */}
          {activeOrder && (
            <div className="gemini-order-confirmed-card animate-fade-in">
              <div className="order-confirmed-header">
                <div className="order-check-icon">
                  <Check size={20} color="#ffffff" />
                </div>
                <div>
                  <h4 className="order-confirmed-title">Order Placed Successfully!</h4>
                  <span className="order-id-badge">{activeOrder.order_id}</span>
                </div>
                <span className="guardrail-verified-tag">
                  <CheckCircle2 size={13} color="#10b981" />
                  <span>₹10,000 Spend Cap Verified</span>
                </span>
              </div>

              <div className="order-confirmed-details">
                <img
                  src={activeOrder.image || DEFAULT_FALLBACK_IMAGE}
                  alt={activeOrder.product_name}
                  className="order-item-thumb"
                  onError={(e) => { e.target.src = DEFAULT_FALLBACK_IMAGE; }}
                />
                <div className="order-item-meta">
                  <strong className="order-item-name">{activeOrder.product_name}</strong>
                  <div className="order-price-row">
                    <span>{activeOrder.quantity}x unit(s) • Total:</span>
                    <strong className="order-total-price">₹{(activeOrder.total_amount || 0).toLocaleString('en-IN')}</strong>
                  </div>
                  <span className="order-shipping-note">✓ {activeOrder.shipping_address || 'Priority express shipping dispatched'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Agent Reply Box */}
          {agentReply && (
            <div className="gemini-reply-card">
              <div className="voice-reply-header">
                <Sparkles size={14} color="#38bdf8" />
                <span>Agent Response</span>
                {status === 'speaking' && (
                  <span className="speaking-wave-tag">
                    <span className="swave" />
                    <span className="swave" />
                    <span className="swave" />
                    Speaking
                  </span>
                )}
              </div>
              <p className="voice-reply-text">{agentReply}</p>
            </div>
          )}

          {/* Discovered Products Carousel */}
          {matchedProducts.length > 0 && !activeOrder && (
            <div className="voice-products-section">
              <div className="voice-products-title">
                <ShoppingBag size={14} color="var(--accent-success)" />
                <span>Available Products ({matchedProducts.length})</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                  Say "Place order" to buy immediately
                </span>
              </div>
              <div className="voice-products-scroll">
                {matchedProducts.map((item) => (
                  <div key={item.sku} className="voice-product-mini-card">
                    <img
                      src={item.image || DEFAULT_FALLBACK_IMAGE}
                      alt={item.name}
                      className="voice-product-thumb"
                      onError={(e) => { e.target.src = DEFAULT_FALLBACK_IMAGE; }}
                    />
                    <div className="voice-product-info">
                      <span className="voice-product-name">{item.name}</span>
                      <span className="voice-product-price">₹{(item.price || 0).toLocaleString('en-IN')}</span>
                      <span className="voice-product-stock">✓ {item.stock || 5} in stock</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="voice-product-buy-btn"
                        onClick={() => {
                          handleVoiceInput(`Place order for ${item.name}`);
                        }}
                        title="Say 'Place Order' or click to buy"
                      >
                        <Zap size={13} />
                        <span>Order Now</span>
                      </button>
                      <button
                        type="button"
                        className="voice-product-select-btn"
                        onClick={() => {
                          if (onSelectProduct) {
                            onSelectProduct(item, 1);
                            onClose();
                          }
                        }}
                        title="Open checkout details"
                      >
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Quick Speech Commands (Language-Aware) */}
          <div className="voice-suggestions-row">
            <span className="voice-suggestions-label">Try commanding:</span>
            {activeLangConfig.chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                className="voice-quick-chip gemini-chip"
                onClick={() => handleVoiceInput(chip.query)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="voice-modal-footer gemini-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="voice-footer-meta">
              Autonomous Voice Checkout • {voiceEngine === 'vyora_natural' ? 'Vyora Live AI Voice' : 'Gnani Timbre v3.0 (48kHz)'}
            </span>
          </div>
          <span className="voice-footer-cap">₹10,000 Autonomous Spend Cap Protected</span>
        </div>
      </div>
    </div>
  );
}
