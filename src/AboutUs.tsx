import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowDown, 
  Play, 
  Users, 
  DollarSign, 
  Mail, 
  Eye,
  Zap,
  Trophy,
  BadgeDollarSign,
  ChevronRight,
  Target,
  Heart,
  Sparkles
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { id: 'what-is-clipping', label: 'What is Clipping?', icon: <Play className="w-4 h-4" /> },
  { id: 'about', label: 'About ClipIt', icon: <Heart className="w-4 h-4" /> },
  { id: 'mission', label: 'Our Mission', icon: <Target className="w-4 h-4" /> },
  { id: 'creators', label: 'For Creators', icon: <Eye className="w-4 h-4" /> },
  { id: 'clippers', label: 'For Clippers', icon: <Zap className="w-4 h-4" /> },
  { id: 'payment', label: 'Payment Structure', icon: <BadgeDollarSign className="w-4 h-4" /> },
  { id: 'case-studies', label: 'Case Studies', icon: <Trophy className="w-4 h-4" /> },
  { id: 'contact', label: 'Contact Us', icon: <Mail className="w-4 h-4" /> },
];

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className={`text-2xl font-bold transition-colors duration-300 ${
            isScrolled ? 'text-gray-900' : 'text-white'
          }`}>
            ClipIt
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/jobs"
              className={`hidden sm:block px-4 py-2 rounded-full transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              Browse Jobs
            </Link>
            <Link 
              to="/login"
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              Sign In
            </Link>
            <Link 
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Sidebar: React.FC<{ activeSection: string; onSectionClick: (id: string) => void }> = ({ 
  activeSection, 
  onSectionClick 
}) => {
  return (
    <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 z-40">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionClick(item.id)}
            className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-300 text-left group ${
              activeSection === item.id
                ? 'bg-blue-600/20 text-blue-300 border border-blue-400/30'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className={`transition-colors duration-300 ${
              activeSection === item.id ? 'text-blue-400' : 'text-white/60 group-hover:text-white'
            }`}>
              {item.icon}
            </div>
            <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            <ChevronRight className={`w-3 h-3 transition-all duration-300 ${
              activeSection === item.id ? 'opacity-100 translate-x-1' : 'opacity-0'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
};

const WorkflowStep: React.FC<{ 
  number: string; 
  title: string; 
  description: string;
  icon: React.ReactNode;
  delay: number;
  isActive: boolean;
}> = ({ number, title, description, icon, delay, isActive }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`relative transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all duration-500 ${
        isActive ? 'bg-blue-600/20 border-blue-400/50 scale-105 shadow-2xl' : 'hover:bg-white/15'
      }`}>
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
            isActive ? 'bg-blue-500 text-white' : 'bg-white/20 text-white/80'
          }`}>
            {number}
          </div>
          <div className={`transition-colors duration-300 ${
            isActive ? 'text-blue-400' : 'text-white/70'
          }`}>
            {icon}
          </div>
        </div>
        <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
          isActive ? 'text-white' : 'text-white/90'
        }`}>
          {title}
        </h3>
        <p className={`transition-colors duration-300 ${
          isActive ? 'text-white/90' : 'text-white/70'
        }`}>
          {description}
        </p>
      </div>
    </div>
  );
};

const AnimatedArrow: React.FC<{ direction: 'right' | 'down'; delay: number }> = ({ 
  direction, 
  delay 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const ArrowComponent = direction === 'right' ? ArrowRight : ArrowDown;

  return (
    <div className={`flex justify-center items-center transition-all duration-700 ${
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
    }`}>
      <ArrowComponent className="w-8 h-8 text-blue-400 animate-pulse" />
    </div>
  );
};

const AboutUsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('what-is-clipping');
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  useEffect(() => {
    const workflowInterval = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(workflowInterval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.6,
      rootMargin: '-100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sidebarItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navigation />
      <Sidebar activeSection={activeSection} onSectionClick={scrollToSection} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            REVOLUTIONIZING VIRAL CONTENT CREATION
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ClipIt</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover how we're transforming the way content creators and clippers collaborate 
            to create viral moments and build engaged audiences.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 lg:ml-80 space-y-16">
        
        {/* What is Clipping Section */}
        <section id="what-is-clipping" className="py-8">
          <h2 className="text-4xl font-bold text-white mb-8">What is Clipping?</h2>
          <p className="text-xl text-white/80 mb-16 max-w-3xl">
            Clipping transforms long-form content into viral, bite-sized moments that capture attention 
            and drive engagement across social media platforms.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-8">
              <WorkflowStep
                number="1"
                title="Creator Posts Job"
                description="Content creators upload their long-form content and set reward amounts for viral clips."
                icon={<Users className="w-6 h-6" />}
                delay={0}
                isActive={activeWorkflowStep === 0}
              />
              
              <div className="flex justify-center lg:hidden">
                <AnimatedArrow direction="down" delay={600} />
              </div>

              <WorkflowStep
                number="2"
                title="Clippers Apply & Create"
                description="Talented video editors browse jobs, apply, and create engaging short-form clips."
                icon={<Zap className="w-6 h-6" />}
                delay={800}
                isActive={activeWorkflowStep === 1}
              />
            </div>

            <div className="hidden lg:flex flex-col items-center justify-center space-y-8">
              <AnimatedArrow direction="right" delay={400} />
              <div className="text-6xl opacity-20">⚡</div>
              <AnimatedArrow direction="right" delay={1200} />
            </div>

            <div className="lg:hidden flex justify-center">
              <AnimatedArrow direction="down" delay={1400} />
            </div>

            <div className="space-y-8 lg:col-span-1">
              <WorkflowStep
                number="3"
                title="Clips Go Viral"
                description="Clippers post content on their channels, driving viral engagement and audience growth."
                icon={<Eye className="w-6 h-6" />}
                delay={1600}
                isActive={activeWorkflowStep === 2}
              />

              <div className="flex justify-center lg:hidden">
                <AnimatedArrow direction="down" delay={2200} />
              </div>

              <WorkflowStep
                number="4"
                title="Everyone Wins"
                description="Creators gain exposure, clippers earn rewards, and audiences discover amazing content."
                icon={<Trophy className="w-6 h-6" />}
                delay={2400}
                isActive={activeWorkflowStep === 3}
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-8">
          <h2 className="text-4xl font-bold text-white mb-8">About ClipIt</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-white/80 mb-6">
                ClipIt was born from a simple observation: traditional social media advertising 
                is expensive and often ineffective, while viral content drives the most authentic 
                engagement.
              </p>
              <p className="text-lg text-white/80 mb-6">
                We realized that talented video editors - clippers - hold the key to virality. 
                By connecting them with content creators, we've created a revolutionary platform 
                where everyone benefits from viral success.
              </p>
              <p className="text-lg text-white/80">
                Today, ClipIt is transforming how content reaches audiences, making viral marketing 
                accessible to creators of all sizes while providing clippers with unprecedented 
                earning opportunities.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Why ClipIt Exists</h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Make viral marketing affordable for all creators</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Empower clippers to monetize their creativity</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Create authentic, engaging content connections</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Revolutionize content discovery and distribution</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="py-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Our Mission</h2>
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12 max-w-4xl mx-auto">
            <div className="text-6xl mb-6">🎯</div>
            <p className="text-2xl text-white/90 leading-relaxed mb-8">
              "To democratize viral content creation by connecting talented clippers with content 
              creators, making high-quality marketing accessible to everyone while fostering a 
              thriving creative economy."
            </p>
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">Accessible</div>
                <p className="text-white/70">Marketing for all budgets</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">Creative</div>
                <p className="text-white/70">Empowering artistic talent</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">Viral</div>
                <p className="text-white/70">Authentic engagement</p>
              </div>
            </div>
          </div>
        </section>

        {/* Creators Section */}
        <section id="creators" className="py-8">
          <h2 className="text-4xl font-bold text-white mb-8">For Content Creators</h2>
          <p className="text-xl text-white/80 mb-12">
            Transform your content strategy with risk-free viral marketing that actually works.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Massive Exposure</h3>
              <p className="text-white/70">
                Reach thousands of new viewers through viral clips created by talented editors.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Cost Effective</h3>
              <p className="text-white/70">
                Pay only for successful viral clips - much cheaper than traditional advertising.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Quality Clippers</h3>
              <p className="text-white/70">
                Work with experienced editors who understand viral content and your audience.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">How Creators Benefit:</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Post your long-form content with reward amounts</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Review applications from talented clippers</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Approve clips that meet your standards</span>
                </li>
              </ul>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Pay only for viral performance</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Gain massive exposure and new followers</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Focus on creating while others handle marketing</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Clippers Section */}
        <section id="clippers" className="py-8">
          <h2 className="text-4xl font-bold text-white mb-8">For Video Clippers</h2>
          <p className="text-xl text-white/80 mb-12">
            Turn your editing skills into serious income by creating viral content that matters.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">High Rewards</h3>
              <p className="text-white/70">
                Earn significant income when your clips go viral and drive real engagement.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Build Reputation</h3>
              <p className="text-white/70">
                Showcase your skills and build a portfolio of successful viral campaigns.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Creative Freedom</h3>
              <p className="text-white/70">
                Choose projects that match your style and creative vision.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600/10 to-red-600/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">The Clipper Journey:</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Browse available jobs and creator content</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Apply to projects that match your expertise</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Create engaging, viral-worthy clips</span>
                </li>
              </ul>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Post clips and drive viral engagement</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Earn rewards based on performance</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Build your reputation and earn more</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Payment Structure Section */}
        <section id="payment" className="py-8">
          <h2 className="text-4xl font-bold text-white mb-8">Payment Structure</h2>
          <p className="text-xl text-white/80 mb-12">
            Our fair and transparent payment system rewards viral success while protecting all parties.
          </p>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="bg-blue-600/10 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">For Creators</h3>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start space-x-3">
                  <BadgeDollarSign className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <span>Set your own reward amounts for viral clips</span>
                </li>
                <li className="flex items-start space-x-3">
                  <BadgeDollarSign className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <span>Pay only when clips meet viral performance thresholds</span>
                </li>
                <li className="flex items-start space-x-3">
                  <BadgeDollarSign className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <span>Small platform fee on successful transactions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <BadgeDollarSign className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <span>No upfront costs or hidden charges</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-600/10 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">For Clippers</h3>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start space-x-3">
                  <Trophy className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <span>Earn substantial rewards for viral clips</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Trophy className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <span>Performance-based compensation system</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Trophy className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <span>Build reputation for higher-paying jobs</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Trophy className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <span>Quick and secure payment processing</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-6">Payment Philosophy</h3>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              We believe success should be shared. Our payment structure ensures creators get 
              cost-effective marketing while clippers earn substantial rewards for their viral content.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-white/80 italic">
                "The exact payment structure and platform fees are currently being finalized 
                based on user feedback and market analysis. Our goal is to create the most 
                fair and sustainable system for all participants."
              </p>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section id="case-studies" className="py-8">
          <h2 className="text-4xl font-bold text-white mb-8">Success Stories</h2>
          <p className="text-xl text-white/80 mb-12">
            Real results from creators and clippers using ClipIt to achieve viral success.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">TC</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Tech Creator</h3>
                  <p className="text-white/60">Education Channel</p>
                </div>
              </div>
              <p className="text-white/80 mb-4">
                "My 3-hour programming tutorial was turned into 15 viral clips. 
                I gained 50K new subscribers in just 2 weeks!"
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">50K</div>
                  <div className="text-xs text-white/60">New Subscribers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">15</div>
                  <div className="text-xs text-white/60">Viral Clips</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">2M</div>
                  <div className="text-xs text-white/60">Total Views</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">SC</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Sarah C.</h3>
                  <p className="text-white/60">Professional Clipper</p>
                </div>
              </div>
              <p className="text-white/80 mb-4">
                "I've earned over $25K in my first 6 months clipping content. 
                My viral clips average 500K views each!"
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">$25K</div>
                  <div className="text-xs text-white/60">Earnings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">500K</div>
                  <div className="text-xs text-white/60">Avg. Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">89%</div>
                  <div className="text-xs text-white/60">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Platform Impact</h3>
            <div className="grid sm:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">5M+</div>
                <div className="text-white/70">Total Views Generated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">1K+</div>
                <div className="text-white/70">Successful Clips</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400 mb-2">500+</div>
                <div className="text-white/70">Active Clippers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400 mb-2">200+</div>
                <div className="text-white/70">Content Creators</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-8">
          <h2 className="text-4xl font-bold text-white mb-8">Get in Touch</h2>
          <p className="text-xl text-white/80 mb-12">
            Have questions about ClipIt? Want to partner with us? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
                  <p className="text-white/70 mb-2">For general inquiries and support</p>
                  <a href="mailto:hello@clipit.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    hello@clipit.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Partnerships</h3>
                  <p className="text-white/70 mb-2">Interested in collaborating?</p>
                  <a href="mailto:partnerships@clipit.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                    partnerships@clipit.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Media Inquiries</h3>
                  <p className="text-white/70 mb-2">Press and media requests</p>
                  <a href="mailto:media@clipit.com" className="text-green-400 hover:text-green-300 transition-colors">
                    media@clipit.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Quick Contact</h3>
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        <div className="pb-16"></div>
      </div>
    </div>
  );
}; 

export default AboutUsPage; 