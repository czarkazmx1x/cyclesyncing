"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useCycle } from '../../../contexts/CycleContext';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  FiUser,
  FiCalendar,
  FiBell,
  FiLock,
  FiSave,
  FiCheck
} from 'react-icons/fi';

export default function Profile() {
  const { userProfile } = useCycle();
  const { updateProfile: updateAuthProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    cycle_length: 28,
    period_length: 5,
    last_period_start: '',
    notifications_enabled: true,
    reminder_time: '09:00'
  });

  // Update form data when userProfile loads
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        age: userProfile.age || '',
        cycle_length: userProfile.cycle_length || 28,
        period_length: userProfile.period_length || 5,
        last_period_start: userProfile.last_period_start || '',
        notifications_enabled: userProfile.notifications_enabled ?? true,
        reminder_time: userProfile.reminder_time || '09:00'
      });
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { error } = await updateAuthProfile(formData);
    
    if (!error) {
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        age: userProfile.age || '',
        cycle_length: userProfile.cycle_length || 28,
        period_length: userProfile.period_length || 5,
        last_period_start: userProfile.last_period_start || '',
        notifications_enabled: userProfile.notifications_enabled ?? true,
        reminder_time: userProfile.reminder_time || '09:00'
      });
    }
    setIsEditing(false);
  };

  if (!userProfile) {
    return (
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-gray-500">Loading profile...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Profile & Settings</h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>

          {saved && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
              <FiCheck className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">Your profile has been updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="bg-white shadow-sm rounded-lg mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiUser className="h-5 w-5 text-gray-400 mr-2" />
                    <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                  </div>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      min="13"
                      max="100"
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cycle Information */}
            <div className="bg-white shadow-sm rounded-lg mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <FiCalendar className="h-5 w-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Cycle Information</h2>
                </div>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Average Cycle Length (days)
                    </label>
                    <input
                      type="number"
                      name="cycle_length"
                      value={formData.cycle_length}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      min="21"
                      max="35"
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">Typical range: 21-35 days</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Average Period Length (days)
                    </label>
                    <input
                      type="number"
                      name="period_length"
                      value={formData.period_length}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      min="3"
                      max="7"
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">Typical range: 3-7 days</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Period Start Date
                    </label>
                    <input
                      type="date"
                      name="last_period_start"
                      value={formData.last_period_start}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white shadow-sm rounded-lg mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <FiBell className="h-5 w-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
                </div>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Daily Reminders</p>
                    <p className="text-sm text-gray-500">Get reminded to log your symptoms and mood</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifications_enabled"
                      checked={formData.notifications_enabled}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 ${!isEditing ? 'opacity-50' : ''}`}></div>
                  </label>
                </div>
                
                {formData.notifications_enabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reminder Time
                    </label>
                    <input
                      type="time"
                      name="reminder_time"
                      value={formData.reminder_time}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full md:w-auto px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                >
                  <FiSave className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </form>

          {/* Privacy Notice */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <div className="flex items-start">
              <FiLock className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-1">Your Privacy Matters</p>
                <p>Your data is securely stored with Supabase. We never share your health information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}