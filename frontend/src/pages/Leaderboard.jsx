import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../config/api';
import Avatar from '../components/Avatar';
import { 
  Trophy, 
  Award, 
  Medal, 
  Crown, 
  TrendingUp, 
  Star,
  Sparkles,
  Users,
  Lock
} from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/api/users/leaderboard');
      setLeaderboard(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load leaderboard');
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />;
    return null;
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-br from-orange-400 to-orange-600';
    return 'bg-gradient-to-br from-pink-500 to-purple-600';
  };

  const getCardBorder = (rank) => {
    if (rank === 1) return 'border-2 border-yellow-400 shadow-yellow-200';
    if (rank === 2) return 'border-2 border-gray-400 shadow-gray-200';
    if (rank === 3) return 'border-2 border-orange-400 shadow-orange-200';
    return 'border border-gray-200';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 p-8 sm:p-12 text-white text-center">
              <div className="inline-block mb-6">
                <div className="bg-white bg-opacity-20 p-4 sm:p-6 rounded-full backdrop-blur-sm">
                  <Lock className="w-12 h-12 sm:w-16 sm:h-16" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Unlock the Leaderboard!
              </h1>
              <p className="text-lg sm:text-xl mb-4 opacity-90">
                Join the competition and see how you stack up!
              </p>
              <p className="text-base sm:text-lg mb-8 opacity-80">
                Log in or sign up to view the leaderboard and start earning points.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Users className="w-5 h-5" />
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-white hover:text-pink-600 transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5" />
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col justify-center items-center px-4">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-pink-200 rounded-full"></div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-pink-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
        <p className="mt-6 text-gray-600 font-semibold text-lg">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-red-200">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl font-bold">!</span>
          </div>
          <p className="text-red-600 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-6 sm:py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 sm:p-4 rounded-2xl shadow-lg">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Leaderboard
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Top contributors ranked by points earned
          </p>
        </div>

        {/* Top 3 Podium - Mobile & Desktop */}
        {leaderboard.length >= 3 && (
          <div className="mb-8 sm:mb-12">
            {/* Desktop Podium View */}
            <div className="hidden sm:flex items-end justify-center gap-4 lg:gap-6 mb-8">
              {/* 2nd Place */}
              {leaderboard[1] && (
                <div className="flex-1 max-w-xs">
                  <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-400 transform hover:scale-105 transition-all duration-300">
                    <div className="flex justify-center mb-4">
                      <Medal className="w-16 h-16 text-gray-400" />
                    </div>
                    <div className="flex justify-center mb-4">
                      <Avatar user={leaderboard[1]} size={80} />
                    </div>
                    <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                      {leaderboard[1].username}
                    </h3>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-600 mb-1">
                        {leaderboard[1].points}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">points</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {leaderboard[0] && (
                <div className="flex-1 max-w-xs">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-yellow-400 transform hover:scale-105 transition-all duration-300 relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-1 rounded-full shadow-lg">
                        <span className="text-white font-bold text-sm">CHAMPION</span>
                      </div>
                    </div>
                    <div className="flex justify-center mb-4 mt-2">
                      <Crown className="w-20 h-20 text-yellow-500" />
                    </div>
                    <div className="flex justify-center mb-4">
                      <Avatar user={leaderboard[0]} size={96} />
                    </div>
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                      {leaderboard[0].username}
                    </h3>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-600 mb-1">
                        {leaderboard[0].points}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">points</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {leaderboard[2] && (
                <div className="flex-1 max-w-xs">
                  <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-400 transform hover:scale-105 transition-all duration-300">
                    <div className="flex justify-center mb-4">
                      <Award className="w-16 h-16 text-orange-500" />
                    </div>
                    <div className="flex justify-center mb-4">
                      <Avatar user={leaderboard[2]} size={80} />
                    </div>
                    <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                      {leaderboard[2].username}
                    </h3>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-1">
                        {leaderboard[2].points}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">points</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Podium View */}
            <div className="sm:hidden space-y-4 mb-8">
              {leaderboard.slice(0, 3).map((userData, index) => (
                <div key={userData.id} className={`bg-white rounded-2xl shadow-lg p-4 ${getCardBorder(index + 1)}`}>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getRankIcon(index + 1)}
                    </div>
                    <Avatar user={userData} size={60} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg truncate">
                        {userData.username}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Rank #{index + 1}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-pink-600">
                        {userData.points}
                      </div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rest of Leaderboard */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">All Rankings</h2>
                <p className="text-xs sm:text-sm text-pink-100">Complete leaderboard standings</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-80" />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {leaderboard.map((userData, index) => (
              <div
                key={userData.id}
                className={`px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 ${
                  user && user.id === userData.id ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-600' : ''
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 sm:w-10 text-center">
                    {index < 3 ? (
                      getRankIcon(index + 1)
                    ) : (
                      <div className="text-lg sm:text-xl font-bold text-gray-600">
                        #{index + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <Avatar user={userData} size={window.innerWidth < 640 ? 40 : 48} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                      {userData.username}
                      {user && user.id === userData.id && (
                        <span className="ml-2 text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-semibold">
                          You
                        </span>
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Joined {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
                    <div className="text-xl sm:text-2xl font-bold text-pink-600">
                      {userData.points}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No users found</p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        {user && (
          <div className="mt-6 sm:mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-md border border-gray-100">
              <Sparkles className="w-5 h-5 text-pink-600" />
              <p className="text-sm sm:text-base text-gray-600">
                Your rank is highlighted above
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;