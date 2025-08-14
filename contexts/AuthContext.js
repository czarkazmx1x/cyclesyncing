"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [supabase, setSupabase] = useState(null);
  const router = useRouter();

  // Initialize Supabase client safely
  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        // Check if environment variables are set
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!url || !key || url === 'your_supabase_project_url_here') {
          console.log('Supabase not configured - auth disabled');
          setLoading(false);
          return;
        }

        const { createClient } = await import('../lib/supabase');
        const client = createClient();
        setSupabase(client);
        
        // Check active sessions and sets the user
        const { data: { session } } = await client.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id, client);
        }
        setLoading(false);

        // Listen for changes on auth state (login, logout, etc.)
        const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
          if (session?.user) {
            fetchProfile(session.user.id, client);
          } else {
            setProfile(null);
          }
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.log('Supabase initialization failed:', error.message);
        setLoading(false);
      }
    };

    initializeSupabase();
  }, []);

  // Fetch user profile
  const fetchProfile = async (userId, client = supabase) => {
    if (!client) return;
    
    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { data: newProfile, error: createError } = await client
          .from('profiles')
          .insert({
            user_id: userId,
            email: user?.email,
            name: user?.email?.split('@')[0] || 'User'
          })
          .select()
          .single();

        if (!createError) {
          setProfile(newProfile);
        }
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Sign up
  const signUp = async (email, password, firstName, lastName) => {
    if (!supabase) return { data: null, error: { message: 'Authentication not available' } };
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            first_name: firstName,
            last_name: lastName 
          }
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Sign in
  const signIn = async (email, password) => {
    if (!supabase) return { data: null, error: { message: 'Authentication not available' } };
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Update profile
  const updateProfile = async (updates) => {
    if (!supabase) return { data: null, error: { message: 'Authentication not available' } };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    supabase
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}