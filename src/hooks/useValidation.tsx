import React from 'react';

export const useValidation = () => {
  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return (
      password.length > 7 &&
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password)
    );
  };

  const validate = (
    value: string,
    validationType: React.HTMLInputTypeAttribute,
    compareValue?: string,
  ) => {
    switch (validationType) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return value === compareValue;
      default:
        return true;
    }
  };

  const getErrorMessage = (validationType: React.HTMLInputTypeAttribute) => {
    switch (validationType) {
      case 'email':
        return 'Invalid email';
      case 'password':
        return 'Invalid password, please include at least 1 uppercase letter, lowercase letter, number, and special character';
      case 'confirmPassword':
        return 'Passwords do not match';
      default:
        return 'Invalid input';
    }
  };

  return { validate, getErrorMessage };
};
