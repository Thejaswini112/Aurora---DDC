import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { notifications as initialNotifications } from '@/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import type { Notification } from '@/types';

export type NotificationCategory = Notification['category'];

export interface NotificationPreferences {
  detection: boolean;
  scan: boolean;
  policy: boolean;
  system: boolean;
}

interface WorkspaceNotificationState {
  preferences: NotificationPreferences;
  readIds: string[];
}

type StoredNotificationState = Record<string, WorkspaceNotificationState>;

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  markRead: (id: string) => void;
  markAllRead: () => void;
  updatePreference: (
    category: NotificationCategory,
    enabled: boolean,
  ) => void;
}

const NotificationsContext =
  createContext<NotificationsContextValue | undefined>(undefined);

const STORAGE_KEY = 'aurora-notification-state';

const defaultPreferences: NotificationPreferences = {
  detection: true,
  scan: true,
  policy: true,
  system: true,
};

const defaultWorkspaceState: WorkspaceNotificationState = {
  preferences: defaultPreferences,
  readIds: [],
};

function loadStoredState(): StoredNotificationState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return parsed as StoredNotificationState;
  } catch {
    return {};
  }
}

function normalizeWorkspaceState(
  state?: Partial<WorkspaceNotificationState>,
): WorkspaceNotificationState {
  return {
    preferences: {
      ...defaultPreferences,
      ...(state?.preferences ?? {}),
    },
    readIds: Array.isArray(state?.readIds) ? state.readIds : [],
  };
}

export function NotificationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { workspace } = useAuth();

  const [workspaceStates, setWorkspaceStates] =
    useState<StoredNotificationState>(loadStoredState);

  const currentWorkspaceState = useMemo(
    () =>
      normalizeWorkspaceState(workspaceStates[workspace.id]) ??
      defaultWorkspaceState,
    [workspace.id, workspaceStates],
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(workspaceStates),
      );
    } catch {
      // Persistence failure should not break notification behavior.
    }
  }, [workspaceStates]);

  const notifications = useMemo(
    () =>
      initialNotifications
        .filter(
          (notification) =>
            currentWorkspaceState.preferences[notification.category],
        )
        .map((notification) => ({
          ...notification,
          read: currentWorkspaceState.readIds.includes(notification.id),
        })),
    [currentWorkspaceState],
  );

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const markRead = (id: string) => {
    setWorkspaceStates((previous) => {
      const current = normalizeWorkspaceState(previous[workspace.id]);

      if (current.readIds.includes(id)) {
        return previous;
      }

      return {
        ...previous,
        [workspace.id]: {
          ...current,
          readIds: [...current.readIds, id],
        },
      };
    });
  };

  const markAllRead = () => {
    setWorkspaceStates((previous) => {
      const current = normalizeWorkspaceState(previous[workspace.id]);

      const visibleNotificationIds = initialNotifications
        .filter(
          (notification) =>
            current.preferences[notification.category],
        )
        .map((notification) => notification.id);

      const readIds = Array.from(
        new Set([...current.readIds, ...visibleNotificationIds]),
      );

      return {
        ...previous,
        [workspace.id]: {
          ...current,
          readIds,
        },
      };
    });
  };

  const updatePreference = (
    category: NotificationCategory,
    enabled: boolean,
  ) => {
    setWorkspaceStates((previous) => {
      const current = normalizeWorkspaceState(previous[workspace.id]);

      return {
        ...previous,
        [workspace.id]: {
          ...current,
          preferences: {
            ...current.preferences,
            [category]: enabled,
          },
        },
      };
    });
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        preferences: currentWorkspaceState.preferences,
        markRead,
        markAllRead,
        updatePreference,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);

  if (!ctx) {
    throw new Error(
      'useNotifications must be used within NotificationsProvider',
    );
  }

  return ctx;
}