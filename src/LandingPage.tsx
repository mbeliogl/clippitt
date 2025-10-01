import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Trophy, BadgeDollarSign, Eye, Zap, ChevronDown, } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          <div className={`text-2xl font-bold transition-colors duration-300 ${
            isScrolled ? 'text-gray-900' : 'text-white'
          }`}>
            ClipIt
          </div>
          
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

const AnimatedText: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {children}
    </div>
  );
};

const FeatureCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`feature-${title.replace(/\s/g, '-').toLowerCase()}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [delay, title]);

  return (
    <div 
      id={`feature-${title.replace(/\s/g, '-').toLowerCase()}`}
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-700 hover:bg-white/10 hover:scale-105 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="text-blue-400 mb-6 transform transition-transform duration-300 hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-white/70 leading-relaxed">{description}</p>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Bryan",
      role: "@Whatever Host",
      content: "ClipIt transformed my workflow. I can focus on creating while talented clippers handle the editing.",
      avatar: "👩‍💻"
    },
    {
      name: "Mike", 
      role: "Professional Clipper",
      content: "I used to drive uber. Now I can follow my passion for Social Media and get paid 5x",
      avatar: "🎬"
    },
    {
      name: "Alex",
      role: "YouTuber",
      content: "Someone clipped my content and now my engagement has increased 10x!",
      avatar: "📺"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <AnimatedText>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm mb-8">
              <Trophy className="w-4 h-4 mr-2" />
              POST IT. CLIP IT. GET PAID. 
            </div>
          </AnimatedText>

          <AnimatedText delay={200}>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              The Future of
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Social Media Advertising
              </span>
            </h1>
          </AnimatedText>

          <AnimatedText delay={400}>
            <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with talented video editors, gain exposure, 
              and scale your digital presence like never before.
            </p>
          </AnimatedText>

          <AnimatedText delay={600}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link 
                to="/register"
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center"
              >
                Join
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/jobs"
                className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Link>
            </div>
          </AnimatedText>

          <AnimatedText delay={800}>
            <div className="animate-bounce">
              <ChevronDown className="w-8 h-8 text-white/60 mx-auto" />
            </div>
          </AnimatedText>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 sm:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Why Choose ClipIt?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              ClipIt connects <span className="text-blue-400 font-semibold">creators</span> with <span className="text-purple-400 font-semibold">clippers</span> to generate viral content as a <span className="text-green-400 font-semibold">cost-effective alternative</span> to traditional social media advertising.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Eye className="w-12 h-12" />}
              title="Gain Exposure"
              description="Creators: Let talented clippers boost your online presense at a fraction of the SM advertising rates."
              delay={0}
            />
            <FeatureCard
              icon={<Zap className="w-12 h-12" />}
              title="Go Viral"
              description="Clippers: Let your creativity speak. Sign up for campaigns and test your viral content & editing skills."
              delay={200}
            />
            <FeatureCard
              icon={<BadgeDollarSign className="w-12 h-12" />}
              
              title="Get Paid"
              description="Content creators enjoy additional traffic & attention while Clippers sharpen their skills and get generously rewarded."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-6 sm:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-16">
            Loved by Creators Worldwide
          </h2>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12 transition-all duration-500">
              <div className="text-6xl mb-6">
                {testimonials[currentTestimonial].avatar}
              </div>
              <p className="text-2xl text-white/90 mb-8 italic">
                "{testimonials[currentTestimonial].content}"
              </p>
              <div>
                <p className="text-white font-semibold text-lg">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-white/70">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-400 scale-125' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Join thousands of creators and clippers who are already transforming their content workflow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Join ClipIt Today
            </Link>
            <Link 
              to="/about"
              className="text-white/80 hover:text-white text-lg underline underline-offset-4 transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-white mb-4 sm:mb-0">
              ClipIt
            </div>
            <div className="text-white/60">
              © 2025 ClipIt. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;