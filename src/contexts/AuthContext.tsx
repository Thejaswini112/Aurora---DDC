import {
  createContext,
  useContext,
  useEffect,
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

interface AuthContextValue extends AuthSession {
  isAuthenticated: boolean;
  login: (input: {
    organization: string;
    email: string;
    password: string;
    remember: boolean;
  }) => Promise<void>;
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

function loadStoredSession(): StoredSession | null {
  try {
    const raw =
      window.localStorage.getItem(REMEMBER_STORAGE_KEY) ??
      window.sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (!raw) {
      return null;
    }

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

function findWorkspace(workspaceId: string): Workspace {
  return (
    workspaces.find((workspace) => workspace.id === workspaceId) ??
    organization
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

  window.sessionStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify(payload),
  );

  if (remember) {
    window.localStorage.setItem(
      REMEMBER_STORAGE_KEY,
      JSON.stringify(payload),
    );
  } else {
    window.localStorage.removeItem(REMEMBER_STORAGE_KEY);
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

      const workspace = findWorkspace(
        stored.workspaceId,
      );

      return {
        user: currentUser,
        workspace,
      };
    });

  const login = async ({
    organization: organizationInput,
    email,
    password,
    remember,
  }: {
    organization: string;
    email: string;
    password: string;
    remember: boolean;
  }) => {
    // Mock authentication:
    // any non-empty organization, email and password are accepted.
    if (
      !organizationInput.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      throw new Error(
        "Organization, email and password are required.",
      );
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 650),
    );

    const selectedWorkspace =
      workspaces.find(
        (workspace) =>
          workspace.id === organizationInput ||
          workspace.name === organizationInput,
      ) ?? organization;

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

  useEffect(() => {
    if (!session) {
      return;
    }

    const validWorkspace = workspaces.find(
      (workspace) =>
        workspace.id === session.workspace.id,
    );

    if (!validWorkspace) {
      switchWorkspace(organization);
    }
    // Workspace validation only needs to run on initial mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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