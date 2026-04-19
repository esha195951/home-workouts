import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ProfileSetupData, UserProfile, RegisterData } from '../types';
import { apiGetMe, apiLogin, apiLogout, apiRegister, apiUpdateMe } from '../Api/Api';

const GUEST_PROFILE_KEY = 'hw_guest_profile';

export type GuestSetupData = ProfileSetupData;

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  continueAsGuest: (data: GuestSetupData) => void;
  updateProfile: (data: ProfileSetupData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetMe()
      .then(setUser)
      .catch(() => {
        const stored = localStorage.getItem(GUEST_PROFILE_KEY);
        if (stored) {
          try { setUser(JSON.parse(stored) as UserProfile); } catch { setUser(null); }
        } else {
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const userData = await apiLogin(username, password);
    localStorage.removeItem(GUEST_PROFILE_KEY);
    setUser(userData);
  };

  const register = async (data: RegisterData) => {
    const userData = await apiRegister(data);
    localStorage.removeItem(GUEST_PROFILE_KEY);
    setUser(userData);
  };

  const logout = async () => {
    if (user?.isGuest) {
      localStorage.removeItem(GUEST_PROFILE_KEY);
      setUser(null);
    } else {
      await apiLogout();
      setUser(null);
    }
  };

  const continueAsGuest = (data: GuestSetupData) => {
    const guestProfile: UserProfile = {
      _id: 'guest',
      username: 'Guest',
      isGuest: true,
      ...data,
    };
    localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(guestProfile));
    setUser(guestProfile);
  };

  const updateProfile = async (data: ProfileSetupData) => {
    if (user?.isGuest) {
      const updated: UserProfile = { ...user, ...data };
      localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(updated));
      setUser(updated);
    } else {
      const updated = await apiUpdateMe(data);
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, continueAsGuest, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export { AuthProvider, useAuth };
