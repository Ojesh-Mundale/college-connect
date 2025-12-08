import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import api from '../config/api'; // <-- use axios instance

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }

    // Listen for localStorage changes to handle cross-tab login
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        if (e.newValue) {
          api.defaults.headers.common['Authorization'] = `Bearer ${e.newValue}`;
          fetchUser();
        } else {
          setUser(null);
        }
      }
    };

    // BroadcastChannel for cross-tab reload on login
    const channel = new BroadcastChannel('auth-channel');
    channel.onmessage = (event) => {
      if (event.data.type === 'login') {
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      channel.close();
    };
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/auth/me'); // <-- correct usage
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return { success: true };
  };

  const sendConfirmation = async (username, email, password) => {
    const response = await api.post('/api/auth/send-confirmation', { username, email, password });
    return response.data;
  };

  const confirmEmail = async (token, type) => {
    const response = await api.post('/api/auth/confirm-email', { token, type });
    const { token: jwtToken, user } = response.data;
    localStorage.setItem('token', jwtToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    setUser(user);
    return { success: true };
  };

  const createAfterConfirm = async (accessToken) => {
    const response = await api.post('/api/auth/create-after-confirm', { access_token: accessToken });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    // Do not broadcast login event to avoid redirect loop
    return { success: true };
  };





  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        sendConfirmation,
        confirmEmail,
        createAfterConfirm,
        logout,
        loading,
        supabase
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
