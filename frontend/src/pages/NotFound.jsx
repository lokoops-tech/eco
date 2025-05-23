import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Optional: Add styling for the 404 page

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="home-link">
        Go back to the homepage
      </Link>
    </div>
  );
};

export default NotFound;