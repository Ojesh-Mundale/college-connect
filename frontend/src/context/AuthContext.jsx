import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import NavigationHandler from '../components/NavigationHandler';
import api from '../config/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Handle Google OAuth state change
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event);
      console.log('📧 User email:', session?.user?.email);
      console.log('🔑 Session exists:', !!session);
      console.log('🎫 Has token in localStorage:', !!localStorage.getItem('token'));

      if (event === 'SIGNED_IN' && session?.user && !localStorage.getItem('token')) {
        console.log('✅ Processing Google sign-in for:', session.user.email);
        try {
          console.log('📤 Sending user data to backend:', session.user);
          const response = await api.post('/api/auth/google', {
            user: session.user
          });

          console.log('📥 Backend response:', response.data);
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(user);
          console.log('👤 User set in state:', user);

          // Navigation will be handled by NavigationHandler based on onboarding status
          console.log('🚀 User authenticated, navigation will be handled by NavigationHandler');
        } catch (err) {
          console.error('❌ Google login failed:', err);
          console.error('❌ Error response:', err.response?.data);
          console.error('❌ Error status:', err.response?.status);
          console.error('❌ Error message:', err.message);
        } finally {
          setLoading(false);
        }
      } else if (event === 'SIGNED_IN') {
        console.log('⏭️ User already has token, skipping backend call');
      } else {
        console.log('ℹ️ Other auth event:', event);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data.user);
    } catch (err) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  // Email/password login
  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    return { success: true };
  };

  // Google login
  const googleLogin = async () => {
    console.log('🌐 Starting Google OAuth flow');
    console.log('🏠 Current hostname:', window.location.hostname);
    console.log('🔗 Current origin:', window.location.origin);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('❌ OAuth initiation error:', error);
        throw error;
      }

      console.log('✅ OAuth initiated successfully:', data);
    } catch (err) {
      console.error('❌ Google login initiation failed:', err);
      alert('Failed to start Google sign-in. Please try again.');
    }
  };

  // Register with email/password
  const register = async (username, email, password) => {
    console.log('📝 Starting registration for:', email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });

      if (error) {
        console.error('❌ Supabase registration error:', error);
        throw error;
      }

      console.log('✅ Registration initiated, confirmation email sent');
      return { success: true, data };
    } catch (err) {
      console.error('❌ Registration failed:', err);
      throw err;
    }
  };

  // Create user in backend after confirmation
  const createAfterConfirm = async (accessToken) => {
    console.log('🔄 Creating user in backend after confirmation');
    try {
      const response = await api.post('/api/auth/confirm', {
        accessToken
      });

      console.log('✅ User created in backend:', response.data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return response.data;
    } catch (err) {
      console.error('❌ Failed to create user after confirmation:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    supabase.auth.signOut();
  };

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  const updateOnboarding = async (onboardingData) => {
    const res = await api.put('/api/users/onboarding', onboardingData);
    setUser(res.data.user);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        googleLogin,
        logout,
        updateUser,
        updateOnboarding,
        createAfterConfirm,
        supabase,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
