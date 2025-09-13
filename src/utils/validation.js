 
// src/utils/validation.js
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateArticleForm = (data) => {
  const errors = {};

  if (!validateRequired(data.headline)) {
    errors.headline = 'Headline is required';
  }

  if (!validateRequired(data.briefContent)) {
    errors.briefContent = 'Brief content is required';
  }

  if (!validateRequired(data.fullContent)) {
    errors.fullContent = 'Full content is required';
  }

  if (!validateRequired(data.category)) {
    errors.category = 'Category is required';
  }

  if (data.featuredImage && !validateURL(data.featuredImage)) {
    errors.featuredImage = 'Please enter a valid URL';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateUserForm = (data) => {
  const errors = {};

  if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validateRequired(data.fullName)) {
    errors.fullName = 'Full name is required';
  }

  if (data.password && !validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAdForm = (data) => {
  const errors = {};

  if (!validateRequired(data.title)) {
    errors.title = 'Title is required';
  }

  if (!validateURL(data.imageUrl)) {
    errors.imageUrl = 'Please enter a valid image URL';
  }

  if (!validateURL(data.targetUrl)) {
    errors.targetUrl = 'Please enter a valid target URL';
  }

  if (!validateRequired(data.startDate)) {
    errors.startDate = 'Start date is required';
  }

  if (!validateRequired(data.endDate)) {
    errors.endDate = 'End date is required';
  }

  if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
    errors.endDate = 'End date must be after start date';
  }

  if (!data.budget || data.budget <= 0) {
    errors.budget = 'Budget must be greater than 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

