import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<JobMarketplace />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/creator-dashboard" element={<CreatorDashboard />} />
        <Route path="/clipper-dashboard" element={<ClipperDashboard />} />
        <Route path="/Legal" element={<LegalPage />} />
        <Route path='/Integrations' element={<IntegrationsPage />} />
      </Routes>
    </Router>
  );
}

export default App;