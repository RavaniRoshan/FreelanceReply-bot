/**
 * @fileoverview This file defines the landing page for the application.
 * It's a complex component with a lot of animations and different sections.
 */

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Bot, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  Zap, 
  Shield, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  Mail,
  Slack,
  MessageCircle,
  Send
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * The landing page component.
 * @returns {JSX.Element} The rendered landing page.
 */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const scrollingTestimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Floating navbar morphing animation
    const navbar = navRef.current;
    if (navbar) {
      gsap.set(navbar, { y: -100 });
      gsap.to(navbar, { y: 0, duration: 1, ease: 'power3.out', delay: 0.5 });

      // Scroll-triggered navbar morphing
      ScrollTrigger.create({
        start: 100,
        end: 99999,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(navbar, {
            padding: progress > 0 ? '8px 0' : '16px 0',
            backgroundColor: progress > 0 ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.8)',
            scale: progress > 0 ? 0.95 : 1,
            borderRadius: progress > 0 ? '20px' : '0px',
            margin: progress > 0 ? '12px 20px' : '0px',
            boxShadow: progress > 0 ? '0 10px 30px rgba(0, 0, 0, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)',
            backdropFilter: 'blur(20px)',
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    }

    // Infinite scrolling testimonials
    const testimonialContainer = scrollingTestimonialsRef.current;
    if (testimonialContainer) {
      const testimonialCards = testimonialContainer.children;
      const totalWidth = testimonialContainer.scrollWidth;
      
      gsap.to(testimonialContainer, {
        x: -totalWidth / 2,
        duration: 30,
        ease: 'none',
        repeat: -1
      });
    }

    // Hero animations
    const tl = gsap.timeline();
    
    tl.fromTo('.hero-title', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
    .fromTo('.hero-subtitle', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 
      '-=0.5'
    )
    .fromTo('.hero-cta', 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, 
      '-=0.3'
    )
    .fromTo('.hero-visual', 
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, 
      '-=0.8'
    );

    // Floating animation for hero visual elements
    gsap.to('.float-element', {
      y: -20,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.3
    });

    // Features scroll animations
    gsap.fromTo('.feature-card', 
      { opacity: 0, y: 80, scale: 0.8 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Stats counter animation
    gsap.fromTo('.stat-number', 
      { innerText: 0 },
      { 
        innerText: (i: number, target: any) => target.getAttribute('data-value') || 0,
        duration: 2,
        ease: 'power2.out',
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
        }
      }
    );

    // How it works timeline
    gsap.fromTo('.work-step', 
      { opacity: 0, x: -50 },
      { 
        opacity: 1, 
        x: 0,
        duration: 0.8,
        stagger: 0.3,
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: 'top 80%',
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "Freelance Designer",
      avatar: "SJ",
      content: "AutoReply Pro saved me 15 hours per week on customer support. The AI responses are so natural, my clients can't tell the difference!",
      gradient: "from-blue-400 to-purple-500"
    },
    {
      name: "Mike Rodriguez", 
      title: "Web Developer",
      avatar: "MR",
      content: "The learning engine is incredible. It gets better every day and now handles 90% of my customer inquiries automatically.",
      gradient: "from-green-400 to-blue-500"
    },
    {
      name: "Emily Chen",
      title: "Business Consultant", 
      avatar: "EC",
      content: "Game changer for my consulting business. My clients get instant responses and I can focus on actual work instead of email.",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      name: "Alex Thompson",
      title: "Digital Marketer",
      avatar: "AT", 
      content: "The AI understands context so well. It's like having a personal assistant that never sleeps and always knows what to say.",
      gradient: "from-orange-400 to-red-500"
    },
    {
      name: "Lisa Park",
      title: "Content Creator",
      avatar: "LP",
      content: "Setup took 5 minutes and now I never worry about customer emails again. The automation is seamless and professional.",
      gradient: "from-teal-400 to-blue-500"
    },
    {
      name: "James Wilson",
      title: "E-commerce Owner", 
      avatar: "JW",
      content: "ROI was immediate. Customers get faster responses and I have more time to grow my business. Absolutely essential tool.",
      gradient: "from-indigo-400 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Floating Morphing Navigation */}
      <nav 
        ref={navRef}
        className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 transition-all duration-300"
        style={{ willChange: 'transform, padding, background-color, border-radius, margin, box-shadow' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">AutoReply Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white" data-testid="nav-dashboard">Dashboard</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="nav-get-started">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="hero-title mb-4 bg-gray-800 text-blue-400 border-blue-400" variant="secondary">
                AI-Powered Customer Service
              </Badge>
              <h1 className="hero-title text-4xl md:text-6xl font-bold text-white mb-6">
                Automate Your Customer Replies with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Smart AI
                </span>
              </h1>
              <p className="hero-subtitle text-xl text-gray-300 mb-8 leading-relaxed">
                Transform your customer service with intelligent automation that learns, adapts, and responds like you do. Save hours every day while improving customer satisfaction.
              </p>
              <div className="hero-cta flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700" data-testid="hero-get-started">
                    Start Automating Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-gray-600 text-gray-300 hover:bg-gray-800" data-testid="hero-watch-demo">
                  Watch Demo
                </Button>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="hero-visual relative">
              <div className="relative">
                {/* Main dashboard mockup */}
                <Card className="float-element bg-gray-900 border-gray-700 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <Badge className="bg-blue-600 text-white">Live Demo</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 text-blue-400 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-300">"Can I get a refund for my order?"</p>
                          <div className="mt-2 p-3 bg-blue-900/30 rounded-lg">
                            <p className="text-sm text-blue-400">AI analyzing... Category: Billing</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Bot className="h-5 w-5 text-green-400 mt-1" />
                        <div className="flex-1 p-3 bg-green-900/30 rounded-lg">
                          <p className="text-sm text-green-400">
                            "I'd be happy to help with your refund request! Please provide your order number and I'll process this immediately..."
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 float-element">
                  <Card className="bg-green-500 text-white p-4 shadow-lg border-0">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">95% Accuracy</span>
                    </div>
                  </Card>
                </div>

                <div className="absolute -bottom-6 -left-6 float-element">
                  <Card className="bg-purple-500 text-white p-4 shadow-lg border-0">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span className="text-sm font-medium">2.3s Response</span>
                    </div>
                  </Card>
                </div>

                <div className="absolute top-1/2 -right-12 float-element">
                  <Card className="bg-blue-500 text-white p-3 shadow-lg border-0">
                    <Zap className="h-6 w-6" />
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="stat-number text-3xl md:text-4xl font-bold text-blue-400" data-value="95">0</div>
              <p className="text-gray-400 mt-2">% Accuracy Rate</p>
            </div>
            <div>
              <div className="stat-number text-3xl md:text-4xl font-bold text-green-400" data-value="75">0</div>
              <p className="text-gray-400 mt-2">% Time Saved</p>
            </div>
            <div>
              <div className="stat-number text-3xl md:text-4xl font-bold text-purple-400" data-value="2.3">0</div>
              <p className="text-gray-400 mt-2">Second Response</p>
            </div>
            <div>
              <div className="stat-number text-3xl md:text-4xl font-bold text-orange-400" data-value="24">0</div>
              <p className="text-gray-400 mt-2">/ 7 Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Powerful Features for Modern Businesses
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to automate customer service and scale your support operations efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="feature-card group hover:shadow-xl transition-all duration-300 border-gray-700 bg-gray-900 hover:bg-gray-800">
              <CardContent className="p-8">
                <div className="bg-blue-900/30 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Bot className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">AI Classification</h3>
                <p className="text-gray-400">
                  Automatically categorize incoming inquiries with 95% accuracy using advanced machine learning.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card group hover:shadow-xl transition-all duration-300 border-gray-700 bg-gray-900 hover:bg-gray-800">
              <CardContent className="p-8">
                <div className="bg-green-900/30 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Smart Templates</h3>
                <p className="text-gray-400">
                  Create dynamic response templates that adapt to context and customer history.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card group hover:shadow-xl transition-all duration-300 border-gray-700 bg-gray-900 hover:bg-gray-800">
              <CardContent className="p-8">
                <div className="bg-purple-900/30 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Learning Engine</h3>
                <p className="text-gray-400">
                  Continuously improves response quality based on customer feedback and interaction patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card group hover:shadow-xl transition-all duration-300 border-gray-700 bg-gray-900 hover:bg-gray-800">
              <CardContent className="p-8">
                <div className="bg-orange-900/30 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Instant Responses</h3>
                <p className="text-gray-400">
                  Deliver professional responses in under 3 seconds, 24/7 without human intervention.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card group hover:shadow-xl transition-all duration-300 border-gray-700 bg-gray-900 hover:bg-gray-800">
              <CardContent className="p-8">
                <div className="bg-red-900/30 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Multi-Platform</h3>
                <p className="text-gray-400">
                  Integrate with Gmail, Slack, Discord, Telegram and more platforms seamlessly.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card group hover:shadow-xl transition-all duration-300 border-gray-700 bg-gray-900 hover:bg-gray-800">
              <CardContent className="p-8">
                <div className="bg-indigo-900/30 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Team Collaboration</h3>
                <p className="text-gray-400">
                  Manage team templates, track performance, and collaborate on improving responses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="py-20 bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Get started with AI automation in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="work-step text-center">
              <div className="bg-blue-900/30 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Connect Your Platforms</h3>
              <p className="text-gray-400">
                Link your email, Slack, Discord, or other communication channels in one click.
              </p>
            </div>

            <div className="work-step text-center">
              <div className="bg-green-900/30 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Create Smart Templates</h3>
              <p className="text-gray-400">
                Build response templates for common inquiries. Our AI will personalize them automatically.
              </p>
            </div>

            <div className="work-step text-center">
              <div className="bg-purple-900/30 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Let AI Take Over</h3>
              <p className="text-gray-400">
                Watch as your automation handles customer inquiries while continuously learning and improving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Scrolling Testimonials */}
      <section ref={testimonialsRef} className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Trusted by Freelancers Worldwide
            </h2>
            <p className="text-xl text-gray-400">
              See how AutoReply Pro is transforming customer service for professionals
            </p>
          </div>

          <div className="relative">
            <div 
              ref={scrollingTestimonialsRef}
              className="flex space-x-6"
              style={{ width: 'max-content' }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <Card key={index} className="testimonial-card bg-gray-900 border-gray-700 shadow-lg min-w-[400px] max-w-[400px]">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-semibold`}>
                        {testimonial.avatar}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <p className="text-gray-400">{testimonial.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Automate Your Customer Service?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of freelancers who are saving time and improving customer satisfaction with AI automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100" data-testid="cta-get-started">
                Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white hover:bg-white/10" data-testid="cta-learn-more">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">AutoReply Pro</span>
              </div>
              <p className="text-gray-400">
                AI-powered customer service automation for modern freelancers and businesses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AutoReply Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}