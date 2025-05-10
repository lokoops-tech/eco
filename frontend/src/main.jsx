import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ShopConextProvider from './context/ShopContext.jsx';
import { HelmetProvider } from 'react-helmet-async';

// Network Detection Component
const NetworkDetection = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    // Event listeners for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Create click event interceptor for offline state
    const handleClick = (event) => {
      if (!navigator.onLine) {
        // Prevent all link clicks and form submissions when offline
        if (
          event.target.tagName === 'A' || 
          event.target.closest('a') || 
          event.target.tagName === 'BUTTON' ||
          event.target.closest('button') ||
          event.target.tagName === 'INPUT' && event.target.type === 'submit'
        ) {
          event.preventDefault();
          event.stopPropagation();
          
          // Show the offline modal
          document.getElementById('offline-modal').style.display = 'flex';
        }
      }
    };
    
    // Add click interceptor to the entire document
    document.addEventListener('click', handleClick, true);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('click', handleClick, true);
    };
  }, []);
  
  // Close the offline modal
  const closeOfflineModal = () => {
    document.getElementById('offline-modal').style.display = 'none';
  };
  
  return (
    <>
      {/* Hidden offline modal that appears when links are clicked */}
      <div id="offline-modal" className="offline-modal">
        <div className="offline-modal-content">
          <h2>You're Offline</h2>
          <p>Please check your internet connection to continue browsing.</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
          <button onClick={closeOfflineModal} className="close-button">
            Close
          </button>
        </div>
      </div>
      
      {/* Small indicator that always shows when offline */}
      {!isOnline && (
        <div className="offline-indicator">
          You are currently offline. Some features may be limited.
        </div>
      )}
      
      {/* Normal app rendering */}
      <HelmetProvider>
        <ShopConextProvider>
          <App />
        </ShopConextProvider>
      </HelmetProvider>
    </>
  );
};

// Render the app with network detection
const root = createRoot(document.getElementById('root'));
root.render(<NetworkDetection />);