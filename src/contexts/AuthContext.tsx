import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { currentUser, organization, workspaces } from '@/mock-data';
import type { User, Workspace } from '@/types';

interface AuthSession {
  user: User;
  workspace: Workspace;
}

interface AuthContextValue extends AuthSession {
  isAuthenticated: boolean;
  login: (input: { organization: string; email: string; password: string; remember: boolean }) => Promise<void>;
  logout: () => void;
  switchWorkspace: (workspace: Workspace) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'aurora-session';
const REMEMBER_KEY = 'aurora-session-persistent';

interface StoredSession {
  userId: string;
  workspaceId: string;
}

function loadStoredSession(): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(REMEMBER_KEY) ?? window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const stored = loadStoredSession();
    if (!stored) return null;
    const ws = workspaces.find((w) => w.id === stored.workspaceId) ?? organization;
    return { user: currentUser, workspace: ws };
  });

  const persist = (workspace: Workspace, remember: boolean) => {
    const payload: StoredSession = { userId: currentUser.id, workspaceId: workspace.id };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (remember) {
      window.localStorage.setItem(REMEMBER_KEY, JSON.stringify(payload));
    } else {
      window.localStorage.removeItem(REMEMBER_KEY);
    }
  };

  const clearPersisted = () => {
    window.localStorage.removeItem(REMEMBER_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
  };

  const login = async ({ remember }: { organization: string; email: string; password: string; remember: boolean }) => {
    // Mock authentication — any non-empty org/email/password is accepted.
    await new Promise((resolve) => setTimeout(resolve, 650));
    persist(organization, remember);
    setSession({ user: currentUser, workspace: organization });
  };

  const logout = () => {
    clearPersisted();
    setSession(null);
  };

  const switchWorkspace = (workspace: Workspace) => {
    const remember = !!window.localStorage.getItem(REMEMBER_KEY);
    persist(workspace, remember);
    setSession((prev) => (prev ? { ...prev, workspace } : prev));
  };

  useEffect(() => {
    // keep session in sync if a stored workspace id is missing from the list
    if (session && !workspaces.some((w) => w.id === session.workspace.id)) {
      switchWorkspace(organization);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextValue = {
    user: session?.user ?? currentUser,
    workspace: session?.workspace ?? organization,
    isAuthenticated: !!session,
    login,
    logout,
    switchWorkspace,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
