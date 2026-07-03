import { create } from 'zustand';

export type NotificationType = 
  | 'NEW_MATCH'
  | 'NEW_MESSAGE'
  | 'KYC_APPROVED'
  | 'KYC_REJECTED'
  | 'SYSTEM'
  | 'ACADEMY'
  | 'COACHING'
  | 'EVENT';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  relatedEntityId?: number;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => set((state) => {
    const newNotif: AppNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      read: false,
    };
    return {
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    };
  }),

  markAsRead: (id) => set((state) => {
    let decreased = false;
    const newNotifications = state.notifications.map((n) => {
      if (n.id === id && !n.read) {
        decreased = true;
        return { ...n, read: true };
      }
      return n;
    });
    return {
      notifications: newNotifications,
      unreadCount: decreased ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
    };
  }),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0,
  })),

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
