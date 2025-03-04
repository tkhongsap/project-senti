import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { TrendingUp, BarChart3, Target, Users, ChevronRight, Zap, LineChart, Users2 } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-200 sticky top-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <h1 className="text-xl font-bold">Campaign Manager</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features">
              <a className="text-sm font-medium text-slate-700 hover:text-slate-900">Features</a>
            </Link>
            <Link href="/how-it-works">
              <a className="text-sm font-medium text-slate-700 hover:text-slate-900">How It Works</a>
            </Link>
            <Link href="/enterprise">
              <a className="text-sm font-medium text-slate-700 hover:text-slate-900">For Enterprise</a>
            </Link>
            <Link href="/pricing">
              <a className="text-sm font-medium text-slate-700 hover:text-slate-900">Pricing</a>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button size="sm" variant="ghost" className="text-sm font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Campaign Management
              <span className="block text-indigo-600">Reimagined</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 px-4">
              Double your productivity and performance with AI-driven strategy development and advanced data ingestion capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/auth">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-800 px-8 h-12">
                  Book a Demo
                </Button>
              </Link>
            </div>
            <div className="text-center text-sm text-slate-500 space-y-2">
              <p>No credit card required.</p>
              <p>5,000+ brands and agencies already using our platform.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Unlock Your Campaign Potential</h2>
              <p className="text-xl text-slate-600">Our platform provides everything you need to create, manage, and optimize your marketing campaigns.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Strategy Development</h3>
                <p className="text-slate-600 mb-6">
                  Develop comprehensive strategies across the entire customer lifecycle with AI-assisted recommendations.
                </p>
                <Link href="/strategy">
                  <a className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </Link>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
                <p className="text-slate-600 mb-6">
                  Gain deep insights with powerful visualization tools and AI-powered analysis of campaign performance.
                </p>
                <Link href="/analytics">
                  <a className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </Link>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer Lifecycle</h3>
                <p className="text-slate-600 mb-6">
                  Track and optimize every stage of the customer journey from prospecting to retention.
                </p>
                <Link href="/lifecycle">
                  <a className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonial/Stats Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Trusted by Leading Brands</h2>
              <p className="text-xl text-slate-600">Join thousands of businesses that have transformed their marketing with our platform.</p>
            </div>
            
            <div className="bg-indigo-600 text-white rounded-2xl p-10 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-1 mb-8 md:mb-0 md:mr-10">
                  <p className="text-2xl font-medium mb-6">"This platform has been a game changer for us. It's helped us generate some of our best performing campaigns ever."</p>
                  <div>
                    <p className="font-bold">Sarah Johnson</p>
                    <p className="text-indigo-200">Marketing Director, Acme Inc.</p>
                  </div>
                </div>
                <div className="md:flex-shrink-0 text-center md:text-left">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">87%</span>
                    <p className="text-indigo-200">Increase in ROAS</p>
                  </div>
                  <div>
                    <span className="text-4xl font-bold">2x</span>
                    <p className="text-indigo-200">Faster campaign creation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your campaigns?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Join thousands of marketers who have already improved their results with our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-800 px-8 h-12">
                  Book a Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Features</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">How It Works</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Pricing</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Blog</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Documentation</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Knowledge Base</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">About Us</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Careers</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Contact</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Partners</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Security</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="font-semibold">Campaign Manager</span>
            </div>
            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} Campaign Management System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
