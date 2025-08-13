"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DebugTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing connection...');
    
    try {
      // Test 1: Check if Supabase client is initialized
      console.log('Supabase client:', supabase);
      setResult(prev => prev + '\n✅ Supabase client initialized');
      
      // Test 2: Test basic API call
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('API Error:', error);
        setResult(prev => prev + '\n❌ API Error: ' + error.message);
      } else {
        console.log('API Success:', data);
        setResult(prev => prev + '\n✅ API call successful');
      }
      
      // Test 3: Test auth
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Auth Error:', authError);
        setResult(prev => prev + '\n❌ Auth Error: ' + authError.message);
      } else {
        console.log('Auth Success:', authData);
        setResult(prev => prev + '\n✅ Auth system accessible');
      }
      
    } catch (err) {
      console.error('Connection Error:', err);
      setResult(prev => prev + '\n❌ Connection Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing login...');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123',
      });

      if (error) {
        setResult(prev => prev + '\n❌ Login Error: ' + error.message);
      } else {
        setResult(prev => prev + '\n✅ Login attempt completed (might fail auth but connection works)');
      }
    } catch (err) {
      setResult(prev => prev + '\n❌ Network Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">🔧 Supabase Debug Test</h1>
        
        <div className="space-y-4">
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
            {result || 'Click "Test Connection" to start debugging...'}
          </pre>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Environment Info:</strong></p>
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not loaded'}</p>
          <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing'}</p>
        </div>
      </div>
    </div>
  );
}
