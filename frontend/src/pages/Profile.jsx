import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import Avatar from '../components/Avatar';
import {
  User,
  Mail,
  Award,
  MessageSquare,
  Eye,
  CheckCircle,
  Clock,
  Save,
  LogOut,
  Trash2,
  RefreshCw,
  Calendar,
  TrendingUp,
  Sparkles,
  Pencil,
  Building,
  GraduationCap,
  Phone
} from 'lucide-react';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAvatarSeed, setCurrentAvatarSeed] = useState(user?.customAvatarSeed || null);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    fullName: user?.fullName || '',
    contactNumber: user?.contactNumber || '',
    branch: user?.branch || '',
    year: user?.year || '',
    collegeName: user?.collegeName || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

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
      setQuestions([]);
      
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center max-w-md border border-gray-100">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-pink-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please login to view your profile</p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
          >
            Go to Login
          </Link>
        </div>
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

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditedProfile({
      fullName: user?.fullName || '',
      contactNumber: user?.contactNumber || '',
      branch: user?.branch || '',
      year: user?.year || '',
      collegeName: user?.collegeName || ''
    });
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const response = await api.put('/api/users/profile', editedProfile);
      updateUser(editedProfile);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile({
      fullName: user?.fullName || '',
      contactNumber: user?.contactNumber || '',
      branch: user?.branch || '',
      year: user?.year || '',
      collegeName: user?.collegeName || ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col justify-center items-center px-4">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-pink-200 rounded-full"></div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-pink-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
        <p className="mt-6 text-gray-600 font-semibold text-lg">Loading profile...</p>
      </div>
    );
  }

  const resolvedCount = questions.filter(q => q.isResolved).length;
  const totalAnswers = questions.reduce((sum, q) => sum + (q.answersCount || 0), 0);
  const totalViews = questions.reduce((sum, q) => sum + (q.views || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-6 sm:py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 h-24 sm:h-32"></div>
          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16">
              <div className="flex-shrink-0">
                <div className="bg-white p-2 rounded-2xl shadow-lg">
                  <Avatar
                    user={user}
                    size={window.innerWidth < 640 ? 80 : 120}
                    showRefresh={true}
                    onRefresh={(newSeed) => setCurrentAvatarSeed(newSeed)}
                  />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 mt-1">
                  <Mail className="w-4 h-4" />
                  <p className="text-sm sm:text-base">{user.email}</p>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-bold text-pink-600">{user.points || 0} points</span>
                </div>
              </div>
            </div>

            {currentAvatarSeed !== (user?.customAvatarSeed || null) && (
              <div className="mt-6 flex justify-center sm:justify-start">
                <button
                  onClick={handleSaveAvatar}
                  disabled={savingAvatar}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
                >
                  {savingAvatar ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Avatar
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Profile Information</h2>
            <button
              onClick={handleEditProfile}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editedProfile.fullName}
                      onChange={(e) => setEditedProfile({...editedProfile, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Building className="w-4 h-4" />
                      College Name
                    </label>
                    <input
                      type="text"
                      value={editedProfile.collegeName}
                      onChange={(e) => setEditedProfile({...editedProfile, collegeName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Enter your college name"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <GraduationCap className="w-4 h-4" />
                      Branch
                    </label>
                    <input
                      type="text"
                      value={editedProfile.branch}
                      onChange={(e) => setEditedProfile({...editedProfile, branch: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Enter your branch"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4" />
                      Year
                    </label>
                    <select
                      value={editedProfile.year || ''}
                      onChange={(e) => setEditedProfile({...editedProfile, year: e.target.value ? parseInt(e.target.value) : ''})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Select year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4" />
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={editedProfile.contactNumber}
                      onChange={(e) => setEditedProfile({...editedProfile, contactNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Enter your contact number"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
                >
                  {savingProfile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-base font-semibold text-gray-900">{user.fullName || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-base font-semibold text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">College Name</p>
                    <p className="text-base font-semibold text-gray-900">{user.collegeName || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <p className="text-base font-semibold text-gray-900">{user.branch || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="text-base font-semibold text-gray-900">{user.year ? `${user.year}st Year` : 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Contact Number</p>
                    <p className="text-base font-semibold text-gray-900">{user.contactNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-pink-100 p-2 rounded-lg">
                <MessageSquare className="w-5 h-5 text-pink-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{questions.length}</p>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Questions</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{resolvedCount}</p>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Resolved</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{totalAnswers}</p>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Answers</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{totalViews}</p>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Views</p>
          </div>
        </div>

        {/* My Questions */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">My Questions</h2>
                <p className="text-xs sm:text-sm text-pink-100">{questions.length} total questions</p>
              </div>
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-80" />
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {questions.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600" />
                </div>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">You haven't asked any questions yet.</p>
                <Link
                  to="/ask"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <Sparkles className="w-5 h-5" />
                  Ask Your First Question
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <Link
                    key={question._id || question.id}
                    to={`/question/${question._id}`}
                    className="block p-4 sm:p-5 border border-gray-200 rounded-xl hover:shadow-lg hover:border-pink-300 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors duration-200 flex-1 line-clamp-2">
                        {question.title}
                      </h3>
                      <span className={`ml-3 flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${
                        question.isResolved 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
                        {question.isResolved ? 'Resolved' : 'Open'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {question.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                      <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-3 py-1 rounded-lg font-semibold">
                        {question.subject}
                      </span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{question.answersCount} answers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{question.views || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Account Settings</h2>
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;