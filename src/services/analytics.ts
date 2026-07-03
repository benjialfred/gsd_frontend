import api from './api';

export const trackEvent = async (eventType: string, step?: number, metadata?: Record<string, any>) => {
  try {
    await api.post('/api/analytics/events/', {
      event_type: eventType,
      step: step,
      metadata: metadata || {}
    });
  } catch (error) {
    // Analytics should not crash the app
    console.error("Failed to track event:", error);
  }
};
