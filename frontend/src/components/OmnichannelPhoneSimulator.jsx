import React, { useState } from 'react';
import {
  Smartphone,
  Phone,
  MessageSquare,
  Send,
  Volume2,
  CheckCheck,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react';

export default function OmnichannelPhoneSimulator() {
  const [activeChannel, setActiveChannel] = useState('whatsapp'); // 'whatsapp' | 'sms'
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      time: '10:14 AM',
      text: 'Namaste Aarav ji! Your payment of ₹4,200 for Order #ORD-99321 is pending. To avoid service disruption, please settle using this 1-click secure link.',
      payLink: '/pay/sample_token_0042',
      amount: '₹4,200.00',
    },
    {
      sender: 'user',
      time: '10:16 AM',
      text: 'Can I please split this into 2 installments? I can pay ₹2,100 right now and the rest next Friday.',
    },
    {
      sender: 'agent',
      time: '10:16 AM',
      text: 'Vasool Autonomous Policy check: Installment arrangement APPROVED! Here is your single-use link for Part 1 (₹2,100.00). Part 2 will auto-schedule for Nov 22.',
      payLink: '/pay/sample_token_0042',
      amount: '₹2,100.00',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!userInput.trim()) return;

    const newMsg = {
      sender: 'user',
      time: 'Just now',
      text: userInput.trim(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setUserInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          time: 'Just now',
          text: 'Acknowledged! Your response has been cryptographically recorded on the canonical recovery ledger. Thank you for resolving this promptly.',
        },
      ]);
    }, 800);
  };

  const handleSimulateVoiceCall = () => {
    setIsCalling(true);
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(
        'Hello Aarav, this is Vasool Automated Recovery Services on behalf of Agentic E-Commerce. We noticed a pending balance of 4,200 rupees. Your split payment request of 2,100 rupees has been approved and logged to our verified ledger. Please check your WhatsApp to complete the settlement.'
      );
      utter.lang = 'en-IN';
      utter.onend = () => setIsCalling(false);
      utter.onerror = () => setIsCalling(false);
      window.speechSynthesis.speak(utter);
    } else {
      setTimeout(() => setIsCalling(false), 4000);
    }
  };

  return (
    <div style={{
      background: '#0d1527',
      border: '1px solid #1e293b',
      borderRadius: '16px',
      padding: '24px',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Header */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Smartphone size={18} color="#22c55e" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>
            Omnichannel Autonomous Recovery Simulator
          </h3>
        </div>

        {/* Channel Switcher */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveChannel('whatsapp')}
            style={{
              background: activeChannel === 'whatsapp' ? '#22c55e' : '#1e293b',
              color: activeChannel === 'whatsapp' ? '#000000' : '#cbd5e1',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            WhatsApp (Bilingual)
          </button>
          <button
            onClick={() => setActiveChannel('sms')}
            style={{
              background: activeChannel === 'sms' ? '#38bdf8' : '#1e293b',
              color: activeChannel === 'sms' ? '#000000' : '#cbd5e1',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            SMS Gateway
          </button>
          <button
            onClick={handleSimulateVoiceCall}
            disabled={isCalling}
            style={{
              background: isCalling ? '#ef4444' : '#1e293b',
              color: isCalling ? '#ffffff' : '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: isCalling ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Phone size={12} className={isCalling ? 'spin-icon' : ''} />
            <span>{isCalling ? 'Call in Progress...' : 'Outbound Voice Call'}</span>
          </button>
        </div>
      </div>

      {/* Realistic Mobile Device Mockup Frame */}
      <div style={{
        width: '340px',
        background: '#070b14',
        border: '3px solid #334155',
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        display: 'flex',
        flexDirection: 'column',
        height: '490px',
      }}>
        {/* Phone Notch & Speaker */}
        <div style={{
          height: '24px',
          background: '#0a0f1d',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '1px solid #1e293b',
        }}>
          <div style={{ width: '48px', height: '4px', background: '#334155', borderRadius: '2px' }} />
        </div>

        {/* WhatsApp / SMS Header */}
        <div style={{
          background: activeChannel === 'whatsapp' ? '#075e54' : '#1e293b',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}>
            <User size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
              Vasool Recovery Assistant
            </div>
            <div style={{ fontSize: '10px', color: '#86efac' }}>
              {activeChannel === 'whatsapp' ? 'Official Verified Business' : 'Transactional Gateway'}
            </div>
          </div>
        </div>

        {/* Message Thread Area */}
        <div style={{
          flex: 1,
          padding: '12px',
          overflowY: 'auto',
          background: activeChannel === 'whatsapp' ? '#0b141a' : '#070b14',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {messages.map((m, idx) => {
            const isAgent = m.sender === 'agent';
            return (
              <div
                key={idx}
                style={{
                  alignSelf: isAgent ? 'flex-start' : 'flex-end',
                  maxWidth: '82%',
                  background: isAgent
                    ? activeChannel === 'whatsapp'
                      ? '#202c33'
                      : '#1e293b'
                    : activeChannel === 'whatsapp'
                    ? '#005c4b'
                    : '#0284c7',
                  color: '#ffffff',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  lineHeight: 1.4,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                <div>{m.text}</div>

                {m.payLink && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '6px',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                  }}>
                    <div style={{ fontSize: '10px', color: '#86efac', fontWeight: 700 }}>
                      Razorpay Settlement: {m.amount}
                    </div>
                    <a
                      href={m.payLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#22c55e',
                        color: '#000000',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginTop: '6px',
                        textDecoration: 'none',
                      }}
                    >
                      <CreditCard size={11} />
                      <span>Pay Now</span>
                    </a>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: '4px',
                }}>
                  <span>{m.time}</span>
                  {!isAgent && <CheckCheck size={11} color="#38bdf8" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} style={{
          padding: '8px',
          background: '#111b21',
          display: 'flex',
          gap: '6px',
          borderTop: '1px solid #1e293b',
        }}>
          <input
            type="text"
            placeholder="Type WhatsApp message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            style={{
              flex: 1,
              background: '#202c33',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '11px',
              color: '#ffffff',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: '#22c55e',
              border: 'none',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}
