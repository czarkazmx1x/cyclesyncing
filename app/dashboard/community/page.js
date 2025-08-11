"use client";

import { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  FiMessageCircle, 
  FiHeart,
  FiShare2,
  FiBookmark,
  FiSearch,
  FiFilter,
  FiPlus
} from 'react-icons/fi';

export default function Community() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', name: 'All Posts' },
    { id: 'questions', name: 'Questions' },
    { id: 'experiences', name: 'Experiences' },
    { id: 'tips', name: 'Tips & Advice' },
    { id: 'support', name: 'Support' }
  ];

  // Mock community posts
  const posts = [
    {
      id: 1,
      author: 'Sarah M.',
      avatar: 'SM',
      timeAgo: '2 hours ago',
      category: 'questions',
      title: 'Anyone else experience extreme fatigue during luteal phase?',
      content: 'I\'ve been tracking my cycle for 6 months now and noticed I get extremely tired about a week before my period. Is this normal? What helps you manage the fatigue?',
      likes: 24,
      comments: 15,
      saved: false
    },
    {
      id: 2,
      author: 'Emma K.',
      avatar: 'EK',
      timeAgo: '5 hours ago',
      category: 'tips',
      title: 'My top 5 foods for reducing PMS symptoms',
      content: 'After years of trial and error, I\'ve found these foods really help: 1) Dark leafy greens 2) Salmon 3) Dark chocolate (70%+) 4) Bananas 5) Whole grains. What works for you?',
      likes: 56,
      comments: 28,
      saved: true
    },
    {
      id: 3,
      author: 'Lisa T.',
      avatar: 'LT',
      timeAgo: '1 day ago',
      category: 'experiences',
      title: 'Cycle syncing changed my workout routine',
      content: 'I used to push myself hard every day at the gym, but learning about cycle syncing has been a game-changer. Now I do HIIT during follicular, strength training during ovulation, yoga during luteal, and rest during menstruation.',
      likes: 89,
      comments: 34,
      saved: false
    },
    {
      id: 4,
      author: 'Maya P.',
      avatar: 'MP',
      timeAgo: '2 days ago',
      category: 'support',
      title: 'Feeling anxious about irregular cycles',
      content: 'My cycles have been really irregular lately (ranging from 25-40 days). Has anyone experienced this? Should I be concerned? I\'m planning to see my doctor but would love to hear others\' experiences.',
      likes: 31,
      comments: 42,
      saved: false
    },
    {
      id: 5,
      author: 'Alex R.',
      avatar: 'AR',
      timeAgo: '3 days ago',
      category: 'tips',
      title: 'Best apps for cycle tracking - my honest review',
      content: 'I\'ve tried 5 different cycle tracking apps over the past year. Here\'s my breakdown of pros and cons for each one, including accuracy, features, and privacy considerations...',
      likes: 102,
      comments: 67,
      saved: true
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesTab = activeTab === 'all' || post.category === activeTab;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Community</h1>
                <p className="text-gray-600">Connect with others on their cycle journey</p>
              </div>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center">
                <FiPlus className="h-5 w-5 mr-2" />
                New Post
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <FiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 border-b border-gray-200">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-primary-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center">
                      <span className="text-primary-700 font-medium text-sm">{post.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{post.author}</p>
                      <p className="text-sm text-gray-500">{post.timeAgo}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {tabs.find(t => t.id === post.category)?.name}
                  </span>
                </div>

                {/* Post Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-4">{post.content}</p>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-primary-600">
                      <FiHeart className="h-5 w-5" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-primary-600">
                      <FiMessageCircle className="h-5 w-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-primary-600">
                      <FiShare2 className="h-5 w-5" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  <button className={`text-gray-500 hover:text-primary-600 ${post.saved ? 'text-primary-600' : ''}`}>
                    <FiBookmark className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}