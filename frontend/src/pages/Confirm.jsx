import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import { Loader, XCircle, CheckCircle, Mail } from 'lucide-react';

const Confirm = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setError('No confirmation token provided');
        setLoading(false);
        return;
      }

      try {
        const res = await api.post('/api/auth/confirm', { token });
        setSuccess(true);
        setLoading(false);

        // Show success message for 3 seconds, then redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        console.error('Confirmation error:', err);
        setError(err.response?.data?.message || 'Failed to confirm email');
        setLoading(false);
      }
    };

    confirmEmail();
  }, [searchParams, setUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Confirming your email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirmation Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-pink-600 text-white py-2.5 sm:py-3 rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 font-semibold"
          >
            Back to Register
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your email is verified. Please login.</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Mail className="h-4 w-4" />
            <span>Check your email for future notifications</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Confirm;
