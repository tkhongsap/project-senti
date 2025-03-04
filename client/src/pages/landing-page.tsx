import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { TrendingUp, BarChart3, Target, Users } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b w-full">
        <div className="container mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Campaign Manager</h1>
          </div>
          <Link href="/auth">
            <Button size="sm" variant="ghost">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full">
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
              Campaign Management
              <span className="text-primary block mt-1">Reimagined</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4">
              A sophisticated retail marketing campaign management system that leverages AI-driven strategy development and advanced data ingestion capabilities.
            </p>
            <Link href="/auth">
              <Button size="lg" className="gap-2">
                Get Started
                <TrendingUp className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-card rounded-lg p-5 sm:p-6 shadow-sm border flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Strategy Development</h3>
                <p className="text-muted-foreground">
                  Develop comprehensive strategies across the entire customer lifecycle with AI-assisted recommendations.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-5 sm:p-6 shadow-sm border flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Gain deep insights with powerful visualization tools and AI-powered analysis of campaign performance.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-5 sm:p-6 shadow-sm border flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer Lifecycle</h3>
                <p className="text-muted-foreground">
                  Track and optimize every stage of the customer journey from prospecting to retention.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 sm:py-8 w-full">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-semibold">Campaign Manager</span>
          </div>
          <div className="text-sm text-muted-foreground text-center md:text-right">
            © {new Date().getFullYear()} Campaign Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
