/**
 * Utility functions for handling MongoDB ObjectId comparisons
 */

/**
 * Safely compare two MongoDB ObjectIds
 * @param {string|Object} id1 - First ID to compare
 * @param {string|Object} id2 - Second ID to compare
 * @returns {boolean} - True if IDs are equal
 */
export const compareObjectIds = (id1, id2) => {
  if (!id1 || !id2) return false;
  
  // Convert both to strings for comparison
  const str1 = String(id1);
  const str2 = String(id2);
  
  return str1 === str2;
};

/**
 * Check if current user is the author of a resource
 * @param {Object} currentUser - Current user object
 * @param {Object} resource - Resource with author field
 * @returns {boolean} - True if current user is the author
 */
export const isAuthor = (currentUser, resource) => {
  if (!currentUser || !resource || !resource.author) return false;
  
  return compareObjectIds(currentUser._id, resource.author._id || resource.author);
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
