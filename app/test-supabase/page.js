"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function TestSupabase() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing connection...');

    try {
      // Test basic connection
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setResult(`Connection Error: ${error.message}`);
      } else {
        setResult(`✅ Connection successful! Session: ${data.session ? 'Active' : 'None'}`);
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <pre className="text-sm">{result}</pre>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnjeuivflseyixyypirku.supabase.co'}</p>
          <p><strong>Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing'}</p>
        </div>
      </div>
    </div>
  );
}