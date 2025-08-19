import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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
      const response = await axios.get('/api/users/leaderboard');
      setLeaderboard(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load leaderboard');
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank === 2) return 'text-gray-600';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">
          🏆 Leaderboard
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-pink-600 text-white">
            <h2 className="text-xl font-semibold">Top Contributors</h2>
            <p className="text-pink-200">Ranked by points earned</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {leaderboard.map((userData) => (
              <div
                key={userData.id}
                className={`px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  user && user.id === userData.id ? 'bg-pink-50 border-l-4 border-pink-600' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`text-2xl font-bold w-8 text-center ${getRankColor(userData.rank)}`}>
                    {getRankBadge(userData.rank)}
                  </div>
                  
                  <img
                    src={userData.avatar}
                    alt={userData.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">{userData.username}</h3>
                    <p className="text-sm text-gray-500">
                      Joined {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-pink-600">
                    {userData.points}
                  </div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
          
          {leaderboard.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No users found
            </div>
          )}
        </div>
        
        {user && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Your current rank will be highlighted when you appear in the leaderboard
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
