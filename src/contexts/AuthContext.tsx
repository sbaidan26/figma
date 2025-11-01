import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: string, metadata?: any) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-9846636e`;

  const fetchUserData = async (accessToken: string, retries = 3): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(`${serverUrl}/auth/session`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to fetch user data (attempt ${i + 1}/${retries}):`, errorText);

          if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            continue;
          }
          return null;
        }

        const data = await response.json();
        return data.user;
      } catch (error) {
        console.error(`Error fetching user data (attempt ${i + 1}/${retries}):`, error);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
        return null;
      }
    }
    return null;
  };

  const refreshUser = async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();

      if (error || !currentSession) {
        setUser(null);
        setSession(null);
        return;
      }

      const userData = await fetchUserData(currentSession.access_token);
      console.log('refreshUser - userData from fetchUserData:', userData);
      if (userData) {
        setUser(userData);
        setSession(currentSession);
      } else {
        console.error('refreshUser - No userData returned');
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (currentSession) {
          const userData = await fetchUserData(currentSession.access_token);
          console.log('initAuth - userData from fetchUserData:', userData);
          if (userData) {
            setUser(userData);
            setSession(currentSession);
          } else {
            console.error('initAuth - No userData returned, user will be null');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession) {
        const userData = await fetchUserData(newSession.access_token);
        if (userData) {
          setUser(userData);
          setSession(newSession);
        }
      } else {
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, role: string, metadata?: any) => {
    try {
      const response = await fetch(`${serverUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name, role, metadata })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Failed to sign up' };
      }

      console.log('Signup successful, user data:', data.user);

      // Wait a bit for KV store to be consistent
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Now sign in the user
      return await signIn(email, password);
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'An error occurred during sign up' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Only log errors that are not "Invalid login credentials" (expected when account doesn't exist)
        if (!error.message.includes('Invalid login credentials')) {
          console.error('Sign in error:', error);
        }
        return { error: error.message };
      }

      if (data.session) {
        const userData = await fetchUserData(data.session.access_token);
        if (userData) {
          setUser(userData);
          setSession(data.session);
          return {};
        }
        return { error: 'Failed to fetch user data' };
      }

      return { error: 'Failed to create session' };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error: 'An error occurred during sign in' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
