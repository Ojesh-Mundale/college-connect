import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Users, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/feed');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-8 sm:py-12 lg:py-16">
        <div className="inline-block mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 sm:p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
          Welcome to <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">College Connect</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          Peer-to-peer learning with AI-powered answers
        </p>
        
        <Link
          to="/ask"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 group"
        >
          Ask Your First Question
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12 pb-8 sm:pb-12">
        {/* Ask Questions Card */}
        <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
          <div className="bg-gradient-to-br from-pink-100 to-pink-50 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-pink-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-800">Ask Questions</h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Get instant answers to your educational questions with AI-powered insights
          </p>
        </div>

        {/* Community Card */}
        <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-800">Community</h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Join a vibrant community of learners and educators
          </p>
        </div>

        {/* Track Progress Card */}
        <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 sm:col-span-2 lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-800">Track Progress</h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Monitor your learning journey along with leaderboard features
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;