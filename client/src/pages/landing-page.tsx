import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { TrendingUp, BarChart3, Target, Users, ChevronRight } from "lucide-react";

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
            <Link href="/features" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Features
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              How It Works
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Pricing
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
              <Link href="/auth?demo=true">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Strategy Development</h3>
                <p className="text-slate-600 mb-6">
                  Develop comprehensive strategies across the entire customer lifecycle with AI-assisted recommendations.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
                <p className="text-slate-600 mb-6">
                  Gain deep insights with powerful visualization tools and AI-powered analysis of campaign performance.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer Lifecycle</h3>
                <p className="text-slate-600 mb-6">
                  Track and optimize every stage of the customer journey from prospecting to retention.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6 sm:py-8 w-full bg-white">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span className="font-semibold">Campaign Manager</span>
          </div>
          <div className="text-sm text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} Campaign Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
