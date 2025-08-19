import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg lg:hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-pink-600">
            collegeconnect
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-pink-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {isOpen && (
          <div className="pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-pink-600 py-2" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              {user && (
                <Link to="/dashboard" className="text-gray-700 hover:text-pink-600 py-2" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              )}
              <Link to="/ask" className="text-gray-700 hover:text-pink-600 py-2" onClick={() => setIsOpen(false)}>
                Ask Question
              </Link>
              <Link to="/leaderboard" className="text-gray-700 hover:text-pink-600 py-2" onClick={() => setIsOpen(false)}>
                Leaderboard
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="text-gray-700 hover:text-pink-600 py-2" onClick={() => setIsOpen(false)}>
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-pink-600 py-2" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-center" onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MobileNavbar;
