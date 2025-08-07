// pages/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // In a real application, you would handle logout logic here
    // For example, clearing tokens, cookies, etc.
    
    // Then redirect to login page
    // navigate('/login');
    
    // For demo purposes, we'll just show a message
  }, [navigate]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Logout</h1>
        <p className="text-gray-600 mt-1">Sign out of your account</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Are you sure you want to logout?</h2>
          <div className="space-x-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
              Yes, Logout
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50" onClick={() => navigate('/agents')}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;