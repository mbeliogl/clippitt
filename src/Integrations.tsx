import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Plug, BookOpen, Youtube, Twitch, Instagram, Zap } from 'lucide-react';
import { useAuth } from './AuthContext';

const IntegrationsPage: React.FC = () => {
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">Integrations</h1>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Connect ClipIt with your favorite platforms to streamline your content workflow and maximize your reach.
          </p>
          
          {/* Integration cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* YouTube Integration */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Youtube className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">YouTube</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Import videos directly from YouTube channels and automatically extract metadata for seamless job creation.
              </p>
              <div className="flex items-center text-sm text-green-600">
                <Zap className="w-4 h-4 mr-2" />
                Available Now
              </div>
            </div>

            {/* Twitch Integration */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Twitch className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">Twitch</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Connect with Twitch streams and VODs to create highlight clips from your favorite gaming content.
              </p>
              <div className="flex items-center text-sm text-green-600">
                <Zap className="w-4 h-4 mr-2" />
                Available Now
              </div>
            </div>

            {/* Instagram Integration */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Instagram className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">Instagram</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Automatically distribute your best clips to Instagram Stories and Reels to maximize engagement.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                Coming Soon
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-16 text-center">
            <div className="bg-blue-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-gray-600 mb-6">
                Join ClipIt today and start connecting with top clippers to grow your content reach.
              </p>
              {isAuthenticated && user ? (
                <Link 
                  to={user.role === 'creator' ? '/creator-dashboard' : '/clipper-dashboard'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 inline-block"
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 inline-block"
                >
                  Get Started
                </Link>
              )}
            </div>
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

export default IntegrationsPage;