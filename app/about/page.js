import Link from 'next/link';
import { FiHeart, FiUsers, FiTarget, FiStar } from 'react-icons/fi';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                CycleSync
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
              <Link href="/signup" className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            About CycleSync
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empowering women to understand their bodies better and optimize their well-being through cycle awareness.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 mb-12 border border-pink-100">
          <div className="flex items-center mb-6">
            <FiHeart className="h-8 w-8 text-pink-500 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            CycleSync was created to help women connect with their natural rhythms and make informed decisions about their health, nutrition, exercise, and lifestyle. We believe that understanding your menstrual cycle is key to unlocking your full potential and living in harmony with your body.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-pink-100">
            <FiUsers className="h-8 w-8 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Community Support</h3>
            <p className="text-gray-600">
              Connect with other women on similar journeys and share experiences in a safe, supportive environment.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-pink-100">
            <FiTarget className="h-8 w-8 text-pink-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Personalized Insights</h3>
            <p className="text-gray-600">
              Get AI-powered recommendations tailored to your unique cycle pattern and health goals.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 border border-pink-100">
          <div className="flex items-center mb-6">
            <FiStar className="h-8 w-8 text-purple-500 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-bold text-gray-800 mb-2">Privacy First</h4>
              <p className="text-gray-600 text-sm">Your health data is completely private and secure.</p>
            </div>
            <div className="text-center">
              <h4 className="font-bold text-gray-800 mb-2">Science-Based</h4>
              <p className="text-gray-600 text-sm">All recommendations are backed by research and medical expertise.</p>
            </div>
            <div className="text-center">
              <h4 className="font-bold text-gray-800 mb-2">Inclusive</h4>
              <p className="text-gray-600 text-sm">Designed for all women, regardless of age, background, or experience.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to start your journey?
          </h3>
          <Link 
            href="/signup"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  );
}