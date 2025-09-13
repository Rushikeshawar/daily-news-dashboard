 
// src/utils/dateUtils.js
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const formatDateTime = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(date).toLocaleString('en-US', { ...defaultOptions, ...options });
};

export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
};

export const getDaysFromNow = (date) => {
  if (!date) return 0;
  
  const now = new Date();
  const target = new Date(date);
  const diffInTime = target.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
  
  return diffInDays;
};

export const isDateInRange = (date, startDate, endDate) => {
  if (!date || !startDate || !endDate) return false;
  
  const targetDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return targetDate >= start && targetDate <= end;
};

export const getDateRangeString = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A';
  
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  return `${start} - ${end}`;
};

