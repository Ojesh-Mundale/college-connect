import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DeleteQuestionButton = ({ questionId, authorId, onDelete }) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/api/questions/${questionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Show success message
      alert('Question deleted successfully!');
      
      // Call the onDelete callback
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      alert(error.response?.data?.message || 'Failed to delete question');
    } finally {
      setIsDeleting(false);
    }
  };

  // Only show delete button if the current user is the author
  // Handle both string and ObjectId comparisons
  if (!user || !authorId) {
    console.log('Delete button hidden: missing user or authorId', { user, authorId });
    return null;
  }

  const currentUserId = String(user.id || user._id).trim();
  const questionAuthorId = String(authorId).trim();

  console.log('Delete button check:', { 
    currentUserId, 
    questionAuthorId, 
    match: currentUserId === questionAuthorId 
  });

  if (currentUserId !== questionAuthorId) {
    return null;
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-1 ${
        isDeleting ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title="Delete this question"
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
        />
      </svg>
      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
    </button>
  );
};

export default DeleteQuestionButton;
