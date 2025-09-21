import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'normal' }) => {
  const spinnerClass = size === 'small' ? 'spinner-border-sm' : '';
  
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <div className={`spinner-border text-primary ${spinnerClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && (
        <p className="mt-3 text-muted mb-0">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;