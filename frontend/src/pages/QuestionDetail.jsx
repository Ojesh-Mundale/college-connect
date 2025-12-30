import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import DeleteQuestionButton from '../components/DeleteQuestionButton';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/questions/${id}`);
      setQuestion(response.data);
      setAnswers(response.data.answers || []);
    } catch (error) {
      console.error('Error fetching question:', error);
      if (error.response?.status === 404) {
        alert('Question not found');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setSubmittingAnswer(true);
    try {
      const response = await api.post('/api/answers', {
        content: newAnswer,
        questionId: id
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Add the new answer to the list
      setAnswers([response.data, ...answers]);
      setNewAnswer('');
      
      // Show success message
      alert('Answer posted successfully!');
      
      // Refresh question data to update counts
      fetchQuestion();
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert(error.response?.data?.message || 'Failed to submit answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleDeleteQuestion = () => {
    navigate('/dashboard');
  };

  const canDeleteQuestion = () => {
    if (!user || !question || !question.author) return false;
    
    const currentUserId = String(user._id).trim();
    const questionAuthorId = String(question.author._id).trim();
    
    return currentUserId === questionAuthorId;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Question Not Found</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold flex-1">{question.title}</h1>
          {canDeleteQuestion() && (
            <DeleteQuestionButton 
              questionId={id} 
              authorId={question.author._id} 
              onDelete={handleDeleteQuestion}
            />
          )}
        </div>
        
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{question.content}</p>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="bg-gray-100 px-2 py-1 rounded">Subject: {question.subject}</span>
          <span className="bg-gray-100 px-2 py-1 rounded">Branch: {question.branch}</span>
          <span className="bg-gray-100 px-2 py-1 rounded">Year: {question.year}</span>
          <span className="bg-yellow-100 px-2 py-1 rounded text-yellow-800 font-semibold">
            {question.points} points
          </span>
          {question.tags && question.tags.length > 0 && (
            <div className="flex gap-2">
              {question.tags.map((tag, index) => (
                <span key={index} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
          <div className="flex items-center space-x-2">
            <Avatar
              user={question.author}
              size={32}
            />
            <span>By: {question.author?.username || 'Anonymous'}</span>
          </div>
          <div>
            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
            <span className="ml-2">•</span>
            <span className="ml-2">{question.views} views</span>
          </div>
        </div>

        {question.aiAnswer && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              AI Answer
            </h3>
            <p className="text-blue-800 whitespace-pre-wrap">{question.aiAnswer}</p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Community Answers ({answers.length})</h2>
        
        {user && (
          <form onSubmit={handleAnswerSubmit} className="mb-6">
            <div className="mb-4">
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                rows="4"
                placeholder="Share your knowledge and help others..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Be respectful and provide helpful, detailed answers. You can answer any question, not just your own.
              </p>
            </div>
            <button
              type="submit"
              disabled={!newAnswer.trim() || submittingAnswer}
              className={`bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                submittingAnswer ? 'cursor-wait' : ''
              }`}
            >
              {submittingAnswer ? 'Posting...' : 'Post Answer'}
            </button>
          </form>
        )}

        {!user && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-2">Want to help? Sign in to post your answer!</p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
            >
              Login to Answer
            </button>
          </div>
        )}

        <div className="space-y-4">
          {answers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No answers yet. Be the first to help!</p>
            </div>
          ) : (
            answers.map((answer) => (
              <div key={answer._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">{answer.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Avatar
                      user={answer.author}
                      size={24}
                    />
                    <span>{answer.author?.username || 'Anonymous'}</span>
                    {answer.author?.points && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {answer.author.points} points
                      </span>
                    )}
                  </div>
                  <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
