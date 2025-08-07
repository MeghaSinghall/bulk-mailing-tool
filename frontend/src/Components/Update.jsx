import React from 'react';
import { RefreshCw } from 'lucide-react';

const Update = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Update</h1>
        <p className="text-gray-600 mt-1">Check for system updates</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <RefreshCw className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">Your system is up to date</h2>
          <p className="text-gray-500 mb-6">Last checked: March 13, 2025 at 10:30 AM</p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
            Check for Updates
          </button>
        </div>
      </div>
    </div>
  );
};

export default Update;