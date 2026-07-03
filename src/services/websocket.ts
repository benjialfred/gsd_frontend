import { useNotificationStore, type NotificationType } from '../stores/useNotificationStore';

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    // In production, we'd use wss:// and the real token/session
    const wsUrl = `ws://${window.location.host}/ws/notifications/`;
    
    this.socket = new WebSocket(wsUrl);

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
