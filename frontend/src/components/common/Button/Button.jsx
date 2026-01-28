import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  loading = false, 
  loadingText, 
  type = 'button', 
  className = '', 
  icon, 
  disabled = false,
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`btn ${className} ${loading ? 'btn-loading' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="loading-spinner-small"></span>
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;

