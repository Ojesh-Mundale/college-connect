import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const { sendConfirmation, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendConfirmation = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await sendConfirmation(formData.username, formData.email, formData.password);
      setConfirmationSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send confirmation link');
    } finally {
      setLoading(false);
    }
  };



  const handleGoogleSignIn = async () => {
  setError('');
  try {
    await googleLogin();
    // Google will redirect → AuthContext handles JWT
  } catch (err) {
    setError('Google sign in failed');
  }
};


  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!confirmationSent ? (
          <form onSubmit={handleSendConfirmation}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50"
            >
              {loading ? 'Sending Confirmation...' : 'Send Confirmation Link'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Confirmation link sent to your email. Please check your inbox and click the link to complete registration.
            </p>
            <button
              onClick={() => setConfirmationSent(false)}
              className="text-pink-600 hover:underline"
            >
              Send again
            </button>
          </div>
        )}
{/* Divider */}
<div className="flex items-center my-6">
  <div className="flex-grow border-t"></div>
  <span className="mx-4 text-gray-500 text-sm">OR</span>
  <div className="flex-grow border-t"></div>
</div>

{/* Google Sign In */}
<button
  type="button"
  onClick={handleGoogleSignIn}
  className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
>
  <img
    src="https://developers.google.com/identity/images/g-logo.png"
    alt="Google"
    className="w-5 h-5 mr-2"
  />
  Continue with Google
</button>


        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
