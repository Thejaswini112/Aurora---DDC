import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  currentUser,
  organization,
  workspaces,
} from "@/mock-data";

import type { User, Workspace } from "@/types";

interface AuthSession {
  user: User;
  workspace: Workspace;
}

interface LoginInput {
  email: string;
  password?: string;
  remember: boolean;
  workspaceId?: string;
  provider?: "email" | "google" | "microsoft" | "sso";
}

interface AuthContextValue extends AuthSession {
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
  switchWorkspace: (workspace: Workspace) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

const SESSION_STORAGE_KEY = "aurora-session";
const REMEMBER_STORAGE_KEY = "aurora-session-persistent";

interface StoredSession {
  userId: string;
  workspaceId: string;
}

function parseStoredSession(
  raw: string | null,
): StoredSession | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed.userId !== "string" ||
      typeof parsed.workspaceId !== "string"
    ) {
      return null;
    }

    return parsed as StoredSession;
  } catch {
    return null;
  }
}

function loadStoredSession(): StoredSession | null {
  const persistentSession = parseStoredSession(
    window.localStorage.getItem(REMEMBER_STORAGE_KEY),
  );

  if (persistentSession) {
    return persistentSession;
  }

  return parseStoredSession(
    window.sessionStorage.getItem(SESSION_STORAGE_KEY),
  );
}

function findWorkspace(workspaceId?: string): Workspace {
  if (!workspaceId) {
    return organization;
  }

  return (
    workspaces.find(
      (workspace) => workspace.id === workspaceId,
    ) ?? organization
  );
}

function persistSession(
  workspace: Workspace,
  remember: boolean,
) {
  const payload: StoredSession = {
    userId: currentUser.id,
    workspaceId: workspace.id,
  };

  window.localStorage.removeItem(REMEMBER_STORAGE_KEY);
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);

  if (remember) {
    window.localStorage.setItem(
      REMEMBER_STORAGE_KEY,
      JSON.stringify(payload),
    );
  } else {
    window.sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(payload),
    );
  }
}

function clearPersistedSession() {
  window.localStorage.removeItem(REMEMBER_STORAGE_KEY);
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] =
    useState<AuthSession | null>(() => {
      const stored = loadStoredSession();

      if (!stored) {
        return null;
      }

      return {
        user: currentUser,
        workspace: findWorkspace(stored.workspaceId),
      };
    });

  const login = async ({
    email,
    password,
    remember,
    workspaceId,
    provider = "email",
  }: LoginInput) => {
    if (!email.trim()) {
      throw new Error("Work email is required.");
    }

    if (
      provider === "email" &&
      (!password || !password.trim())
    ) {
      throw new Error("Password is required.");
    }

    // Aurora currently uses mock authentication.
    // No real identity provider or credential validation
    // is performed in this frontend prototype.
    await new Promise((resolve) =>
      setTimeout(resolve, 650),
    );

    const selectedWorkspace =
      findWorkspace(workspaceId);

    persistSession(
      selectedWorkspace,
      remember,
    );

    setSession({
      user: currentUser,
      workspace: selectedWorkspace,
    });
  };

  const logout = () => {
    clearPersistedSession();
    setSession(null);
  };

  const switchWorkspace = (
    selectedWorkspace: Workspace,
  ) => {
    if (
      !workspaces.some(
        (workspace) =>
          workspace.id === selectedWorkspace.id,
      )
    ) {
      return;
    }

    const remember =
      !!window.localStorage.getItem(
        REMEMBER_STORAGE_KEY,
      );

    persistSession(
      selectedWorkspace,
      remember,
    );

    setSession((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        workspace: selectedWorkspace,
      };
    });
  };

  const value: AuthContextValue = {
    user: session?.user ?? currentUser,
    workspace:
      session?.workspace ?? organization,
    isAuthenticated: !!session,
    login,
    logout,
    switchWorkspace,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider",
    );
  }

  return context;
}