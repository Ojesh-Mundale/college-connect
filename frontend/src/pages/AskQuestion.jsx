import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import { 
  HelpCircle, 
  BookOpen, 
  Tag, 
  Calendar,
  Award,
  Send,
  Lock,
  Sparkles,
  Users,
  MessageSquarePlus
} from 'lucide-react';

const AskQuestion = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    branch: '',
    year: '1st Year',
    tags: '',
    points: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/questions', formData);
      navigate(`/question/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-8 sm:p-12 text-white text-center">
              <div className="inline-block mb-6">
                <div className="bg-white bg-opacity-20 p-4 sm:p-6 rounded-full backdrop-blur-sm">
                  <Lock className="w-12 h-12 sm:w-16 sm:h-16" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Ask Your Engineering Questions!
              </h1>
              <p className="text-lg sm:text-xl mb-4 opacity-90">
                Get expert answers from fellow engineering students!
              </p>
              <p className="text-base sm:text-lg mb-8 opacity-80">
                Join our community to ask questions, share knowledge, and earn points.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Users className="w-5 h-5" />
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-6 sm:py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block mb-3 sm:mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 sm:p-4 rounded-2xl shadow-lg">
              <MessageSquarePlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Ask a Question
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Get help from our community of learners
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Question Title */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2">
                  <HelpCircle className="w-4 h-4 text-pink-600" />
                  Question Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="What's your question?"
                  required
                />
              </div>

              {/* Grid: Subject, Branch, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g. Computer Networks"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    Branch
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g. CS"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white"
                    required
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              {/* Question Details */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2">
                  <MessageSquarePlus className="w-4 h-4 text-indigo-600" />
                  Question Details
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows="6"
                  placeholder="Describe your question in detail... Be as specific as possible to get better answers!"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Include any context, what you've tried, and what specifically you need help with.
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2">
                  <Tag className="w-4 h-4 text-orange-600" />
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g. mechanics, thermodynamics, calculus"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separate tags with commas to help others find your question
                </p>
              </div>

              {/* Points */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2">
                  <Award className="w-4 h-4 text-yellow-600" />
                  Points to Offer
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="points"
                    value={formData.points}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Offer points to incentivize quality answers (minimum 1 point)
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 sm:py-4 rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 font-bold text-base sm:text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Question
                  </>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm mb-1">Pro Tips</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Be clear and specific in your question title</li>
                    <li>• Include relevant details and context</li>
                    <li>• Add appropriate tags for better visibility</li>
                    <li>• Offer more points for complex questions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;