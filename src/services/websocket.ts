import { useNotificationStore, type NotificationType } from '../stores/useNotificationStore';

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const isHttps = backendUrl.startsWith('https://');
    const wsProtocol = isHttps ? 'wss:' : 'ws:';
    const wsHost = backendUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const wsUrl = `${wsProtocol}//${wsHost}/ws/notifications/`;
    
    try {
      this.socket = new WebSocket(wsUrl);
    } catch (err) {
      console.warn('[WebSocket] Connection failed to initialize:', err);
      return;
    }

    this.socket.onopen = () => {
      console.log('[WebSocket] Connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type) {
          useNotificationStore.getState().addNotification({
            type: data.type as NotificationType,
            title: data.title || 'Nouvelle notification',
            message: data.message || '',
            relatedEntityId: data.relatedEntityId
          });
        }
      } catch (e) {
        console.error('[WebSocket] Error parsing message', e);
      }
    };

    this.socket.onclose = () => {
      console.log('[WebSocket] Disconnected');
      this.attemptReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('[WebSocket] Error', error);
      this.socket?.close();
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      console.log(`[WebSocket] Reconnecting in ${timeout}ms...`);
      setTimeout(() => this.connect(), timeout);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService();
