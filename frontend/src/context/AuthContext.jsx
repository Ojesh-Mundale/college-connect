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



  const googleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
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
        googleSignIn,
        logout,
        loading,
        supabase
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
