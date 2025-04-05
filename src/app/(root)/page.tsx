import Link from "next/link";
import { Play, Mic, Users, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 md:px-12">
        <div className="flex items-center space-x-2">
          <Mic className="w-6 h-6 text-purple-500" />
          <span className="font-bold text-xl">InterviewGPT</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link href="/features" className="hover:text-purple-400 transition">Features</Link>
          <Link href="/pricing" className="hover:text-purple-400 transition">Pricing</Link>
          <Link href="/about" className="hover:text-purple-400 transition">About</Link>
          <Link href="/sign-in" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition">Sign In</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Master Your <span className="text-purple-500">Interviews</span> with AI
          </h1>
          <p className="text-lg text-gray-300">
            Practice with our intelligent voice assistant that generates personalized interview questions, 
            provides real-time feedback, and helps you improve your performance.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/sign-in" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-medium flex items-center gap-2 transition">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/demo" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-md font-medium flex items-center gap-2 transition">
              Watch Demo <Play className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="absolute -top-2 -right-2 bg-purple-600 text-xs px-2 py-1 rounded-md">
              AI Powered
            </div>
            <div className="flex items-center gap-3 border-b border-gray-700 pb-3">
              <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-gray-400">InterviewGPT Assistant</p>
                <p>What topic would you like to practice for your interview?</p>
              </div>
            </div>
            <div className="py-3 text-gray-300">
              <p className="italic">User: I'd like to practice for a full-stack developer interview.</p>
            </div>
            <div className="flex items-center gap-3 border-t border-gray-700 pt-3">
              <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-gray-400">InterviewGPT Assistant</p>
                <p>Great choice! Let's start with: Can you explain the concept of RESTful APIs and how you've implemented them in your projects?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose InterviewGPT?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="bg-purple-600/20 w-12 h-12 rounded-md flex items-center justify-center mb-4">
              <Mic className="text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Voice Assistant</h3>
            <p className="text-gray-300">
              Natural conversations with our AI that adapts to your responses and simulates real interview conditions.
            </p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="bg-purple-600/20 w-12 h-12 rounded-md flex items-center justify-center mb-4">
              <Users className="text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Personalized Questions</h3>
            <p className="text-gray-300">
              Interview questions tailored to your industry, experience level, and specific job requirements.
            </p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="bg-purple-600/20 w-12 h-12 rounded-md flex items-center justify-center mb-4">
              <CheckCircle className="text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Comprehensive Feedback</h3>
            <p className="text-gray-300">
              Detailed assessment of your performance, highlighting strengths and areas for improvement.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-4">
              "After practicing with InterviewGPT for just two weeks, I felt so much more confident going into my software engineering interview. The feedback was spot-on and helped me refine my answers."
            </p>
            <p className="font-medium">— Alex Chen, Software Engineer</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-4">
              "What I love about InterviewGPT is how it adapts to my answers and gives me personalized feedback. It's like having a professional interview coach available 24/7."
            </p>
            <p className="font-medium">— Sarah Johnson, Product Manager</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gray-800 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Start practicing with our AI interview platform today and gain the confidence you need to succeed.
        </p>
        <Link href="/sign-in" className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-md font-medium inline-flex items-center gap-2 transition">
          Get Started For Free <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Mic className="w-5 h-5 text-purple-500" />
            <span className="font-bold">InterviewGPT</span>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-300 transition">Privacy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-300 transition">Terms</Link>
            <Link href="/contact" className="text-gray-400 hover:text-gray-300 transition">Contact</Link>
          </div>
        </div>
        <div className="text-center mt-6 text-gray-500 text-sm">
          © {new Date().getFullYear()} InterviewGPT. All rights reserved.
        </div>
      </footer>
    </div>
  );
}