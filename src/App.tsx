import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from './LandingPage';
import AboutUsPage from './AboutUs';
import LoginPage from './Login';
import RegisterPage from './Register';
import JobMarketplace from './JobMarketplace';
import JobDetail from './JobDetail';
import CreatorDashboard from './CreatorDashboard';
import ClipperDashboard from './ClipperDashboard';
import LegalPage from './Legal';
import IntegrationsPage from './Integrations';
import JobCreation from './JobCreation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobMarketplace />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route 
            path="/creator-dashboard" 
            element={
              <ProtectedRoute requiredRole="creator">
                <CreatorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/clipper-dashboard" 
            element={
              <ProtectedRoute requiredRole="clipper">
                <ClipperDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-job" 
            element={
              <ProtectedRoute requiredRole="creator">
                <JobCreation />
              </ProtectedRoute>
            } 
          />
          <Route path="/Legal" element={<LegalPage />} />
          <Route path='/Integrations' element={<IntegrationsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;