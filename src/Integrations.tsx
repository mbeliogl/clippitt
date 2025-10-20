import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const IntegrationsPage: React.FC = () => {
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Home Button */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 shadow-sm z-10"
      >
        <Home className="w-4 h-4 mr-2" />
        <span className="hidden sm:block">Home</span>
      </Link>

      <div className="pt-20 px-6">
        <h1 className="text-4xl font-bold text-gray-900 text-center">Integrations</h1>
      </div>
    </div>
  );
};
  export default IntegrationsPage;