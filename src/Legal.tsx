import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Plug, BookOpen } from 'lucide-react';
import { useAuth } from './AuthContext';

const LegalPage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="text-gray-900 hover:text-blue-600 transition-colors duration-300"
                title="ClipIt Home"
              >
                <div className="text-xl font-bold">ClipIt</div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  <Link 
                    to={user.role === 'creator' ? '/creator-dashboard' : '/clipper-dashboard'}
                    className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">Legal Information</h1>
          
          {/* Legal content sections */}
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Terms of Service</h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to ClipIt. By using our platform, you agree to comply with and be bound by the following terms and conditions.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Copyright Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                ClipIt respects intellectual property rights and expects users to do the same. All content must comply with copyright laws.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-8 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start w-full">
            <div className="flex flex-col space-y-4">
              <div className="text-2xl font-bold text-gray-900">
                ClipIt
              </div>
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/Legal"
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                  <Scale className="w-4 h-4 mr-2" />
                  Legal
                </Link>
                <Link 
                  to="/Integrations"
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                  <Plug className="w-4 h-4 mr-2" />
                  Integrations
                </Link>
                <Link
                  to="/about"
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                  <BookOpen className="w-4 h-4 mr-2" />
                  About Us
                </Link>
              </div>
            </div>
            <div className="text-gray-600 mt-4 sm:mt-0">
              © 2025 ClipIt. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalPage;