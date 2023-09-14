import React, { useState, useEffect } from 'react';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1500); // Close the toast after 3 seconds (adjust as needed)

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className="toast">
      <div className="toast-content">{message}</div>
    </div>
  );
};

export default Toast;
