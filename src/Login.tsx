import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Scale, Plug, BookOpen } from 'lucide-react';
import { useAuth } from './AuthContext';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the redirect path from location state or default based on role
  const from = location.state?.from?.pathname;

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = from || (user.role === 'clipper' ? '/clipper-dashboard' : '/creator-dashboard');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Use the auth context to set authentication state
        login(data.token, data.user);
        
        // Redirect to the page they were trying to access, or default dashboard
        const redirectPath = from || (data.user.role === 'clipper' ? '/clipper-dashboard' : '/creator-dashboard');
        navigate(redirectPath, { replace: true });
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
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
              <Link 
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sign In Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to ClipIt
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up here
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
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

export default LoginPage;