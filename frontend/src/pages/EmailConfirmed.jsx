import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import { Loader, CheckCircle, Mail } from 'lucide-react';

const EmailConfirmed = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleConfirmAccount = async () => {
    setLoading(true);
    setError('');

    try {
      // For development mode, we'll use a simple confirmation without token
      // In production, this would require the actual confirmation token
      const res = await api.post('/api/auth/confirm-dev', {});

      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);

      // Redirect to login after successful confirmation
      navigate('/login');
    } catch (err) {
      console.error('Confirmation error:', err);
      setError(err.response?.data?.message || 'Failed to confirm account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Email is Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your email address has been verified. Click the button below to create your account and continue to login.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleConfirmAccount}
          disabled={loading}
          className="w-full bg-pink-600 text-white py-2.5 sm:py-3 rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 font-semibold"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="animate-spin h-4 w-4" />
              Creating Account...
            </div>
          ) : (
            'Create My Account'
          )}
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Mail className="h-4 w-4" />
          <span>Ready to start your journey!</span>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmed;
