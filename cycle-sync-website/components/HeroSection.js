"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 flower-pattern opacity-20"></div>
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-gradient-to-tr from-accent-200 to-primary-200 rounded-full blur-3xl opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Decorative element */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 blur-lg opacity-75"></div>
              <div className="relative bg-white rounded-full p-2">
                <span className="text-4xl">🌸</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            <span className="gradient-text">Embrace Your</span>
            <br />
            <span className="text-gray-800">Natural Rhythm</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover the power of cycle syncing. Get personalized wellness recommendations 
            that honor your body's natural phases and help you thrive every day of the month.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn btn-primary text-lg px-8 py-4">
              Start Your Journey
              <span className="ml-2">✨</span>
            </Link>
            <Link href="/login" className="btn btn-secondary text-lg px-8 py-4">
              Learn More
              <span className="ml-2">💕</span>
            </Link>
          </div>
          
          {/* Features preview */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="bg-gradient-to-br from-menstrual/20 to-menstrual/10 rounded-2xl p-4 mb-3">
                <span className="text-3xl">🌹</span>
              </div>
              <p className="text-sm font-medium text-gray-700">Track Your Cycle</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-follicular/20 to-follicular/10 rounded-2xl p-4 mb-3">
                <span className="text-3xl">🌿</span>
              </div>
              <p className="text-sm font-medium text-gray-700">Personalized Tips</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-ovulatory/20 to-ovulatory/10 rounded-2xl p-4 mb-3">
                <span className="text-3xl">☀️</span>
              </div>
              <p className="text-sm font-medium text-gray-700">Wellness Insights</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-luteal/20 to-luteal/10 rounded-2xl p-4 mb-3">
                <span className="text-3xl">🌙</span>
              </div>
              <p className="text-sm font-medium text-gray-700">Community Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}