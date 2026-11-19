// Real-time Event Bus using BroadcastChannel with in-memory fallback
class RealtimeEventBus {
  constructor() {
    this.channel = null;
    this.listeners = new Map();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('agentic_ecommerce_bus');
        this.channel.onmessage = (event) => {
          if (event && event.data) {
            this.notifyLocal(event.data.type, event.data.payload);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not available, using local event bus:', e);
      }
    }
  }

  subscribe(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(callback);
    return () => {
      const set = this.listeners.get(type);
      if (set) {
        set.delete(callback);
      }
    };
  }

  notifyLocal(type, payload) {
    const set = this.listeners.get(type);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in event listener for ${type}:`, err);
        }
      });
    }
    const allSet = this.listeners.get('*');
    if (allSet) {
      allSet.forEach((cb) => {
        try {
          cb({ type, payload });
        } catch (err) {
          console.error('Error in wildcard event listener:', err);
        }
      });
    }
  }

  emit(type, payload) {
    this.notifyLocal(type, payload);
    if (this.channel) {
      try {
        this.channel.postMessage({ type, payload });
      } catch (err) {
        console.warn('Failed to broadcast event:', err);
      }
    }
  }
}

export const eventBus = new RealtimeEventBus();
