import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import api from '../config/api';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Confirm = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function handleMagicLink() {
      try {
        // Parse token from URL hash or query
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
          console.error('No token found');
          setError('Confirmation link sent to your email. Please check your inbox and click the link to complete registration.');
          setLoading(false);
          return;
        }

        // Use Supabase to get session from magic link
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });

        if (error) {
          console.error('Supabase session error:', error.message);
          setError('Failed to verify confirmation link');
          setLoading(false);
          return;
        }

        const user = data.session?.user;

        if (!user) {
          console.error('No user found');
          setError('User not found in session');
          setLoading(false);
          return;
        }

        // Call backend to auto-create or login user
        const res = await api.post('/api/auth/magic-login', {
          email: user.email,
          username: user.user_metadata.full_name || user.email.split('@')[0],
        });

        const result = res.data;

        if (result.token) {
          localStorage.setItem('token', result.token); // save your JWT
          navigate('/dashboard'); // redirect to dashboard
        } else {
          setError('Failed to create account');
          setLoading(false);
        }
      } catch (err) {
        console.error('Magic link error:', err);
        setError('Failed to confirm account');
        setLoading(false);
      }
    }

    handleMagicLink();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirmation Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
          >
            Back to Register
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Confirm;
