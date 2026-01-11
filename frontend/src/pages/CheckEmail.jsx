import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

const CheckEmail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Your account registration is pending email confirmation. Check the backend console for the confirmation URL to complete your registration.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Mail className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Development Mode:</strong> Email sending is not configured. Copy the confirmation URL from the backend console logs and paste it in your browser to activate your account.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Link
              to="/email-confirmed"
              className="w-full bg-green-600 text-white py-2.5 sm:py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-center block"
            >
              I've Confirmed My Email
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold hover:underline transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
