import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Confirm = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { createAfterConfirm } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function handleMagicLink() {
      try {
        // Check for error parameters in query string
        const searchParams = new URLSearchParams(window.location.search);
        let error = searchParams.get('error');
        let errorDescription = searchParams.get('error_description');

        // Also check for error in hash (fragment)
        if (!error) {
          const hash = window.location.hash;
          const hashParams = new URLSearchParams(hash.replace('#', '?'));
          error = hashParams.get('error');
          errorDescription = hashParams.get('error_description');
        }

        if (error) {
          console.error('Magic link error:', errorDescription);
          setError(`Link expired or invalid. Please try registering again.`);
          setLoading(false);
          return;
        }

        // Extract access_token from URL hash (fragment)
        const hash = window.location.hash; // "#access_token=...&type=magiclink"
        const hashParams = new URLSearchParams(hash.replace('#', '?'));
        const accessToken = hashParams.get('access_token');

        if (!accessToken) {
          console.error('No access token found');
          setError('Confirmation link sent to your email. Please check your inbox and click the link to complete registration.');
          setLoading(false);
          return;
        }

        // Use the auth context method to confirm and login
        await createAfterConfirm(accessToken);
        window.location.href = '/dashboard'; // force reload to dashboard
      } catch (err) {
        console.error('Magic link error:', err);
        setError('Failed to confirm account');
        setLoading(false);
      }
    }

    handleMagicLink();
  }, [createAfterConfirm, navigate]);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-green-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Verified!</h2>
        <p className="text-gray-600 mb-6">Your account has been verified from any device. You are now logged in.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Confirm;
