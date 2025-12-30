import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import Avatar from '../components/Avatar';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAvatarSeed, setCurrentAvatarSeed] = useState(user?.customAvatarSeed || null);
  const [savingAvatar, setSavingAvatar] = useState(false);

  // Function to get initials from name or email
  const getInitials = (name, email) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + (parts[parts.length - 1]?.charAt(0) || '')).toUpperCase();
    }
    if (email && email.trim()) {
      return email.charAt(0).toUpperCase();
    }
    return '?';
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete('/api/users/delete-account', {
          headers: { Authorization: `Bearer ${token}` }
        });
        logout();
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  useEffect(() => {
    setCurrentAvatarSeed(user?.customAvatarSeed || null);
  }, [user?.customAvatarSeed]);

  useEffect(() => {
    const fetchUserQuestions = async () => {
      if (!user) {
        console.log('No user found, skipping fetch');
        return;
      }
      
      console.log('Fetching questions for user:', user.email);
      setLoading(true);
      setQuestions([]); // Reset questions to prevent stale data
      
      try {
        const token = localStorage.getItem('token');
        console.log('Using token:', token ? 'Token exists' : 'No token');
        
        const response = await api.get(
          `/api/questions/user/${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        console.log('API Response:', response.data.length, 'questions found');
        
        // Ensure answers count is calculated correctly
        const questionsWithCounts = response.data.map(question => ({
          ...question,
          answersCount: question.answers ? question.answers.length : 0
        }));
        
        setQuestions(questionsWithCounts);
        console.log('Questions state updated:', questionsWithCounts.length);
      } catch (error) {
        console.error('Error fetching user questions:', error);
        console.error('Error details:', error.response?.data || error.message);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuestions();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
      </div>
    );
  }

  const handleSaveAvatar = async () => {
    if (!currentAvatarSeed) return;

    setSavingAvatar(true);
    try {
      const response = await api.put('/api/users/avatar-seed', {
        customAvatarSeed: currentAvatarSeed
      });

      updateUser({ customAvatarSeed: currentAvatarSeed });
      alert('Avatar saved successfully!');
    } catch (error) {
      console.error('Error saving avatar:', error);
      alert('Failed to save avatar. Please try again.');
    } finally {
      setSavingAvatar(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center space-x-4">
          <Avatar
            user={user}
            size={80}
            showRefresh={true}
            onRefresh={(newSeed) => setCurrentAvatarSeed(newSeed)}
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        {currentAvatarSeed !== (user?.customAvatarSeed || null) && (
          <div className="mt-4">
            <button
              onClick={handleSaveAvatar}
              disabled={savingAvatar}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingAvatar ? 'Saving...' : 'Save Avatar'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">My Questions ({questions.length})</h2>
        
        {questions.length === 0 ? (
          <p className="text-gray-600">You haven't asked any questions yet.</p>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question._id || question.id} className="border-b pb-4 hover:bg-gray-50 transition duration-200">
                <Link 
                  to={`/question/${question._id}`}
                  className="block group"
                >
                  <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-800 transition duration-200">
                    {question.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {question.content}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                    <span className="text-gray-600">
                      <span className="font-medium">Category:</span> {question.subject}
                    </span>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      question.isResolved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {question.isResolved ? 'Resolved' : 'Open'}
                    </span>
                    
                    <span className="text-gray-600">
                      <span className="font-medium">Answers:</span> {question.answersCount}
                    </span>
                    
                    <span className="text-gray-600">
                      <span className="font-medium">Views:</span> {question.views || 0}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Asked on {new Date(question.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-bold mb-4">Account Settings</h2>
        <div className="space-y-3">
          <button
            onClick={logout}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Logout
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
