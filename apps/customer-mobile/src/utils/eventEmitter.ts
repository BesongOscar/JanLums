type EventCallback = () => void;

class EventEmitterPrivate {
  private listeners: Record<string, EventCallback[]> = {};

  on(event: string, callback: EventCallback): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    return () => {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    };
  }

  emit(event: string): void {
    const callbacks = this.listeners[event] || [];
    callbacks.forEach((callback) => callback());
  }

  off(event: string, callback?: EventCallback): void {
    if (!callback) {
      delete this.listeners[event];
    } else {
      this.listeners[event] = (this.listeners[event] || []).filter((cb) => cb !== callback);
    }
  }
}

export const EventEmitter = new EventEmitterPrivate();
