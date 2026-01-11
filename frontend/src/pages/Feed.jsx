import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import DeleteQuestionButton from '../components/DeleteQuestionButton';
import {
  Rss,
  Eye,
  ThumbsUp,
  MessageSquare,
  Filter,
  Sparkles
} from 'lucide-react';

const Feed = () => {
  const { user, loading } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState({});

  useEffect(() => {
    console.log('📊 Feed useEffect:', { user: !!user, loading, filter });

    if (!user && !loading) {
      console.log('🚫 Feed: No user and not loading, redirecting to login');
      window.location.href = '/login';
      return;
    }
    if (user) {
      console.log('✅ Feed: User found, fetching questions');
      fetchQuestions();
    }
  }, [filter, user, loading]);

  const fetchQuestions = async () => {
    try {
      setQuestionsLoading(true);
      let url = '/api/questions';
      
      if (filter === 'my' && user) {
        url += `?author=${user._id}`;
      } else if (filter !== 'all') {
        url += `?subject=${filter}`;
      }

      const response = await api.get(url);
      const questionsData = response.data.questions || [];

      setQuestions(questionsData);

      const counts = {};
      questionsData.forEach(q => {
        counts[q.subject] = (counts[q.subject] || 0) + 1;
      });
      setCategories(counts);
      
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/api/questions/${questionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Failed to delete question');
      }
    }
  };

  const handleResolveQuestion = async (questionId, isResolved) => {
    try {
      const endpoint = isResolved ? 'unresolve' : 'resolve';
      await api.post(`/api/questions/${questionId}/${endpoint}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question status:', error);
      alert('Failed to update question status');
    }
  };

  const getStatusColor = (question) => {
    if (question.isResolved) return 'bg-green-100 text-green-700 border-green-200';
    if (question.answers?.length > 0) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getStatusText = (question) => {
    if (question.isResolved) return 'Resolved';
    if (question.answers?.length > 0) return `${question.answers.length} Answers`;
    return 'No answers yet';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 sm:p-3 rounded-xl shadow-lg">
              <Rss className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Feed
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Discover questions from the community</p>
            </div>
          </div>
        </div>



        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Filter Questions</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Questions
            </button>
            <button
              onClick={() => setFilter('my')}
              className={`px-4 py-2 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                filter === 'my'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              My Questions
            </button>
            {Object.keys(categories).map((subject) => (
              <button
                key={subject}
                onClick={() => setFilter(subject)}
                className={`px-4 py-2 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                  filter === subject
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subject} ({categories[subject]})
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        {questionsLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-pink-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-gray-100">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-pink-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              {filter === 'my' ? "You haven't asked any questions yet." : 'No questions in this category.'}
            </p>
            <Link
              to="/ask"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
            >
              <Sparkles className="w-5 h-5" />
              Ask Your First Question
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                <div className="p-4 sm:p-6">
                  {/* Question Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <Link to={`/question/${question._id}`} className="block">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 hover:text-pink-600 transition-colors duration-200 line-clamp-2">
                          {question.title}
                        </h3>
                      </Link>
                      <p className="text-sm sm:text-base text-gray-600 mt-2 line-clamp-2">{question.content}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(question)}`}>
                        {getStatusText(question)}
                      </span>
                    </div>
                  </div>

                  {/* Question Meta */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold">
                      {question.subject}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold">
                      Grade {question.grade}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{question.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{question.upvotes?.length || 0}</span>
                    </div>
                    {question.answers?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{question.answers.length} answers</span>
                      </div>
                    )}
                  </div>

                  {/* AI Answer Preview */}
                  {question.aiAnswer && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <h4 className="font-semibold text-blue-900 text-sm">AI Answer</h4>
                      </div>
                      <p className="text-sm text-blue-700 line-clamp-2">{question.aiAnswer}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Link
                      to={`/question/${question._id}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-sm"
                    >
                      View Details
                    </Link>
                    
                    {user && question.author && 
                      String(question.author._id || question.author.id || '').trim() === String(user.id || user._id || '').trim() ? (
                      <>
                        <button
                          onClick={() => handleResolveQuestion(question._id, question.isResolved)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            question.isResolved 
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                              : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-md'
                          }`}
                        >
                          {question.isResolved ? 'Unresolve' : 'Resolve'}
                        </button>
                        <DeleteQuestionButton
                          questionId={question._id}
                          authorId={question.author._id || question.author.id || ''}
                          onDelete={() => fetchQuestions()}
                        />
                      </>
                    ) : (
                      <Link
                        to={`/question/${question._id}`}
                        className="px-4 py-2 border-2 border-pink-500 text-pink-600 rounded-xl hover:bg-pink-50 transition-all duration-200 font-semibold text-sm"
                      >
                        Answer
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
