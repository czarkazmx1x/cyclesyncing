"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { calculateCycleInfo } from '../lib/cycleCalculations';

const CycleContext = createContext();

export function useCycle() {
  return useContext(CycleContext);
}

export function CycleProvider({ children }) {
  const { user, profile, supabase } = useAuth();
  
  // Cycle Data
  const [cycleData, setCycleData] = useState({
    currentDay: 1,
    currentPhase: 'menstrual',
    nextPeriodDate: null,
    fertileWindowStart: null,
    fertileWindowEnd: null,
    ovulationDate: null,
    daysUntilNextPeriod: null
  });

  // Symptoms and Mood Tracking
  const [symptoms, setSymptoms] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate cycle information using the utility function
  const updateCycleInfo = () => {
    if (!profile) return;
    
    const cycleInfo = calculateCycleInfo(profile);
    setCycleData(cycleInfo);
  };

  // Fetch symptoms from Supabase
  const fetchSymptoms = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('symptoms')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setSymptoms(data || []);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    }
  };

  // Fetch moods from Supabase
  const fetchMoods = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setMoods(data || []);
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchSymptoms(), fetchMoods()]).then(() => {
        setLoading(false);
      });
    } else {
      setSymptoms([]);
      setMoods([]);
      setLoading(false);
    }
  }, [user]);

  // Update cycle info when profile changes
  useEffect(() => {
    if (profile) {
      updateCycleInfo();
    }
  }, [profile]);

  // Log new symptom to Supabase
  const logSymptom = async (symptom) => {
    console.log('=== SYMPTOM LOGGING DEBUG ===');
    console.log('User:', user);
    console.log('Supabase client:', supabase);
    console.log('Symptom data:', symptom);
    
    if (!user) {
      console.log('❌ No user logged in, cannot save symptom');
      alert('Please log in to save symptoms');
      return;
    }
    
    if (!supabase) {
      console.log('❌ No supabase client available');
      alert('Database connection not available');
      return;
    }
    
    try {
      console.log('✅ Attempting to save symptom...');
      
      // Convert severity from 1-5 scale to 1-3 scale for database
      const severityConverted = Math.min(3, Math.ceil((symptom.severity || 3) * 3 / 5));
      console.log('Converted severity:', severityConverted);
      
      const insertData = {
        user_id: user.id,
        date: symptom.date ? new Date(symptom.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        type: symptom.type,
        intensity: severityConverted,
        notes: symptom.notes || ''
      };
      
      console.log('Insert data:', insertData);
      
      const { data, error } = await supabase
        .from('symptoms')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Symptom saved successfully:', data);
      setSymptoms([data, ...symptoms]);
      alert('Symptom saved successfully!');
    } catch (error) {
      console.error('❌ Error logging symptom:', error);
      alert(`Failed to save symptom: ${error.message}`);
    }
  };

  // Log mood to Supabase
  const logMood = async (mood) => {
    if (!user) {
      console.log('No user logged in, cannot save mood');
      return;
    }
    
    try {
      console.log('Saving mood:', mood);
      
      const { data, error } = await supabase
        .from('moods')
        .insert({
          user_id: user.id,
          date: mood.date ? new Date(mood.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          mood: mood.mood,
          intensity: mood.energy || 3,
          notes: mood.notes || ''
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Mood saved successfully:', data);
      setMoods([data, ...moods]);
    } catch (error) {
      console.error('Error logging mood:', error);
      alert('Failed to save mood. Please try again.');
    }
  };

  // Delete symptom
  const deleteSymptom = async (id) => {
    try {
      const { error } = await supabase
        .from('symptoms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSymptoms(symptoms.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting symptom:', error);
    }
  };

  // Delete mood
  const deleteMood = async (id) => {
    try {
      const { error } = await supabase
        .from('moods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMoods(moods.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting mood:', error);
    }
  };

  const value = {
    userProfile: profile,
    cycleData,
    symptoms,
    moods,
    loading,
    logSymptom,
    logMood,
    deleteSymptom,
    deleteMood,
    calculateCycleInfo: updateCycleInfo
  };

  return (
    <CycleContext.Provider value={value}>
      {children}
    </CycleContext.Provider>
  );
}