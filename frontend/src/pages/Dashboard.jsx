import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import DeleteQuestionButton from '../components/DeleteQuestionButton';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState({});
  const [stats, setStats] = useState({
    totalQuestions: 0,
    userPoints: 0,
    resolvedQuestions: 0,
    pendingAnswers: 0
  });

  useEffect(() => {
    console.log('📊 Dashboard useEffect:', { user: !!user, loading, filter, searchTerm });

    if (!user && !loading) {
      console.log('🚫 Dashboard: No user and not loading, redirecting to login');
      // Use React Router navigation instead of window.location.href
      window.location.href = '/login';
      return;
    }
    if (user) {
      console.log('✅ Dashboard: User found, fetching questions');
      fetchQuestions();
    }
  }, [filter, user, searchTerm, loading]);

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
      
      // Update stats based on current filter
      const resolvedCount = questionsData.filter(q => q.isResolved).length;
      const pendingCount = questionsData.filter(q => !q.answers?.length).length;
      
      setStats({
        totalQuestions: questionsData.length,
        userPoints: user?.points || 0,
        resolvedQuestions: resolvedCount,
        pendingAnswers: pendingCount
      });
      
      // Count questions by category
      const counts = {};
      questionsData.forEach(q => {
        counts[q.subject] = (counts[q.subject] || 0) + 1;
      });
      setCategories(counts);
      
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
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
    if (question.isResolved) return 'text-green-600';
    if (question.answers?.length > 0) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getStatusText = (question) => {
    if (question.isResolved) return 'Resolved';
    if (question.answers?.length > 0) return `${question.answers.length} Answers`;
    return 'No answers yet';
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 overflow-x-hidden">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 break-words">Manage your questions and track your learning progress</p>
      </div>

      {/* Stats Cards - Compact version */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white p-2 sm:p-2.5 rounded-lg shadow-sm">
          <h3 className="text-xs font-medium text-gray-600 mb-0.5 break-words">Total Questions</h3>
          <p className="text-base sm:text-lg font-bold text-pink-600">{questions.length}</p>
        </div>
        <div className="bg-white p-2 sm:p-2.5 rounded-lg shadow-sm">
          <h3 className="text-xs font-medium text-gray-600 mb-0.5 break-words">Your Points</h3>
          <p className="text-base sm:text-lg font-bold text-green-600">{user?.points || 0}</p>
        </div>
        <div className="bg-white p-2 sm:p-2.5 rounded-lg shadow-sm">
          <h3 className="text-xs font-medium text-gray-600 mb-0.5 break-words">Resolved Questions</h3>
          <p className="text-base sm:text-lg font-bold text-blue-600">
            {questions.filter(q => q.isResolved).length}
          </p>
        </div>
        <div className="bg-white p-2 sm:p-2.5 rounded-lg shadow-sm">
          <h3 className="text-xs font-medium text-gray-600 mb-0.5 break-words">Pending Answers</h3>
          <p className="text-base sm:text-lg font-bold text-orange-600">
            {questions.filter(q => !q.answers?.length).length}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-2 sm:space-x-4 md:space-x-8 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                filter === 'all'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Questions
            </button>
            <button
              onClick={() => setFilter('my')}
              className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                filter === 'my'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Questions
            </button>
            {Object.keys(categories).map((subject) => (
              <button
                key={subject}
                onClick={() => setFilter(subject)}
                className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  filter === subject
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {subject} ({categories[subject] || 0})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'my' ? 'You haven\'t asked any questions yet.' : 'No questions in this category.'}
          </p>
          <Link
            to="/ask"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
          >
            Ask Your First Question
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <Link to={`/question/${question._id}`} className="text-xl font-semibold text-gray-900 hover:text-pink-600">
                    {question.title}
                  </Link>
                  <p className="text-gray-600 mt-2 line-clamp-2">{question.content}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(question)}`}>
                    {getStatusText(question)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 space-y-2 sm:space-y-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">{question.subject}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">Grade {question.grade}</span>
                  <span className="text-xs sm:text-sm">{new Date(question.createdAt).toLocaleDateString()} at {new Date(question.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm">{question.views} views</span>
                  <span className="text-xs sm:text-sm">•</span>
                  <span className="text-xs sm:text-sm">{question.upvotes?.length || 0} upvotes</span>
                  {user && question.author && (
                    <>
                      {String(question.author._id || question.author.id || '').trim() === String(user.id || user._id || '').trim() ? (
                        <>
                          <button
                            onClick={() => handleResolveQuestion(question._id, question.isResolved)}
                            className={`px-2 sm:px-3 py-1 rounded text-xs font-medium ${
                              question.isResolved 
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                                : 'bg-green-500 text-white hover:bg-green-600'
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
                      ) : null}
                    </>
                  )}
                </div>
              </div>

              {question.aiAnswer && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">AI Answer:</h4>
                  <p className="text-sm text-blue-700 line-clamp-3">{question.aiAnswer}</p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div>
                  {question.answers?.length > 0 && (
                    <div className="mb-2">
                      <h4 className="font-medium text-gray-900 mb-1">Community Answers ({question.answers.length})</h4>
                      <div className="space-y-1">
                        {question.answers.slice(0, 2).map((answer) => (
                          <div key={answer._id} className="text-sm text-gray-600">
                            <span className="font-medium">{answer.author?.username || 'Anonymous'}</span>: {answer.content.substring(0, 80)}...
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/question/${question._id}`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
                  >
                    View Details
                  </Link>
                  {user && question.author && String(question.author._id || question.author.id || '').trim() !== String(user.id || user._id || '').trim() && (
                    <Link
                      to={`/question/${question._id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Answer Question
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
