import { createContext, ReactNode, useContext, useState } from 'react';

// ─── TEMPORARY HARDCODED CREDENTIALS ─────────────────────────────────────────
// TODO: Replace this with real backend/database authentication when ready.
// Each key is the User ID and the value is the corresponding password.
// ─────────────────────────────────────────────────────────────────────────────
const TEMP_USERS: Record<string, string> = {
  '001': 'medvice001',
  '002': 'medvice002',
  '003': 'medvice003',
  '004': 'medvice004',
  '005': 'medvice005',
};
// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextType {
  isLoggedIn: boolean;
  currentUserId: string | null;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  /**
   * Validates credentials against TEMP_USERS.
   * Returns true on success, false on failure.
   * TODO: Replace this function body with an API call when backend is ready.
   */
  const login = (userId: string, password: string): boolean => {
    const trimmedId = userId.trim();
    const trimmedPw = password.trim();
    if (TEMP_USERS[trimmedId] === trimmedPw) {
      setIsLoggedIn(true);
      setCurrentUserId(trimmedId);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUserId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
