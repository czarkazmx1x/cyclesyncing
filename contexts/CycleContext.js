"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const CycleContext = createContext();

export function useCycle() {
  return useContext(CycleContext);
}

export function CycleProvider({ children }) {
  const { user, profile } = useAuth();
  
  // Cycle Data
  const [cycleData, setCycleData] = useState({
    currentDay: 1,
    currentPhase: 'menstrual',
    nextPeriodDate: null,
    fertileWindowStart: null,
    fertileWindowEnd: null,
    ovulationDate: null
  });

  // Symptoms and Mood Tracking
  const [symptoms, setSymptoms] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate cycle information
  const calculateCycleInfo = () => {
    if (!profile?.last_period_start) return;
    
    const lastPeriod = new Date(profile.last_period_start);
    const today = new Date();
    const daysSinceLastPeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
    
    let currentDay = (daysSinceLastPeriod % profile.cycle_length) + 1;
    let phase = 'menstrual';
    
    if (currentDay <= profile.period_length) {
      phase = 'menstrual';
    } else if (currentDay <= profile.cycle_length * 0.5) {
      phase = 'follicular';
    } else if (currentDay <= profile.cycle_length * 0.6) {
      phase = 'ovulatory';
    } else {
      phase = 'luteal';
    }

    // Calculate next period
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + profile.cycle_length);

    // Calculate fertile window
    const fertileStart = new Date(lastPeriod);
    fertileStart.setDate(fertileStart.getDate() + 10);
    
    const fertileEnd = new Date(lastPeriod);
    fertileEnd.setDate(fertileEnd.getDate() + 17);

    // Calculate ovulation
    const ovulation = new Date(lastPeriod);
    ovulation.setDate(ovulation.getDate() + 14);

    setCycleData({
      currentDay,
      currentPhase: phase,
      nextPeriodDate: nextPeriod,
      fertileWindowStart: fertileStart,
      fertileWindowEnd: fertileEnd,
      ovulationDate: ovulation
    });
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
      calculateCycleInfo();
    }
  }, [profile]);

  // Log new symptom to Supabase
  const logSymptom = async (symptom) => {
    if (!user) {
      console.log('No user logged in, cannot save symptom');
      return;
    }
    
    try {
      console.log('Saving symptom:', symptom);
      
      // Convert severity from 1-5 scale to 1-3 scale for database
      const severityConverted = Math.min(3, Math.ceil((symptom.severity || 3) * 3 / 5));
      
      const { data, error } = await supabase
        .from('symptoms')
        .insert({
          user_id: user.id,
          date: symptom.date ? new Date(symptom.date).toISOString() : new Date().toISOString(),
          type: symptom.type,
          severity: severityConverted,
          notes: symptom.notes || '',
          cycle_day: cycleData.currentDay || 1
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Symptom saved successfully:', data);
      setSymptoms([data, ...symptoms]);
    } catch (error) {
      console.error('Error logging symptom:', error);
      alert('Failed to save symptom. Please try again.');
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
          date: mood.date ? new Date(mood.date).toISOString() : new Date().toISOString(),
          mood: mood.mood,
          energy: mood.energy || 3,
          notes: mood.notes || '',
          cycle_day: cycleData.currentDay || 1
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
      setMoods([data, ...moods]);
    } catch (error) {
      console.error('Error logging mood:', error);
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
    calculateCycleInfo
  };

  return (
    <CycleContext.Provider value={value}>
      {children}
    </CycleContext.Provider>
  );
}