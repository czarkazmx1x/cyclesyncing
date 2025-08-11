import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addDays, startOfDay } from 'date-fns';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

interface CycleDay {
  date: string; // ISO string format
  phase: CyclePhase;
  flowIntensity?: 'none' | 'light' | 'medium' | 'heavy' | 'spotting';
  symptoms?: string[];
  notes?: string;
}

interface CycleState {
  cycles: {
    startDate: string;
    endDate: string;
    length: number;
    periodLength: number;
    days: CycleDay[];
  }[];
  currentCycle: number; // Index of current cycle
  averageCycleLength: number;
  averagePeriodLength: number;
  predictedCycles: {
    startDate: string;
    endDate: string;
    length: number;
    periodLength: number;
    days: CycleDay[];
  }[];
  loading: boolean;
  error: string | null;
}

const initialState: CycleState = {
  cycles: [],
  currentCycle: -1,
  averageCycleLength: 28,
  averagePeriodLength: 5,
  predictedCycles: [],
  loading: false,
  error: null,
};

export const cycleSlice = createSlice({
  name: 'cycle',
  initialState,
  reducers: {
    // Log the start of a period
    logPeriodStart: (state, action: PayloadAction<{ date: string }>) => {
      const { date } = action.payload;
      const startDate = startOfDay(new Date(date)).toISOString();
      
      // Create a new cycle with default values
      const newCycle = {
        startDate,
        endDate: '', // Will be set when period ends
        length: 0, // Will be calculated later
        periodLength: 0, // Will be calculated when period ends
        days: [
          {
            date: startDate,
            phase: 'menstrual' as CyclePhase,
            flowIntensity: 'medium',
            symptoms: [],
            notes: '',
          },
        ],
      };
      
      // Add new cycle
      state.cycles.push(newCycle);
      state.currentCycle = state.cycles.length - 1;
      
      // Update predictions based on the new data
      updatePredictions(state);
    },
    
    // Log the end of a period
    logPeriodEnd: (state, action: PayloadAction<{ date: string }>) => {
      if (state.currentCycle === -1) return;
      
      const { date } = action.payload;
      const endDate = startOfDay(new Date(date)).toISOString();
      const currentCycle = state.cycles[state.currentCycle];
      
      // Update current cycle
      currentCycle.endDate = endDate;
      
      // Calculate period length
      const startDate = new Date(currentCycle.startDate);
      const periodEndDate = new Date(endDate);
      const periodLength = Math.round((periodEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      currentCycle.periodLength = periodLength;
      
      // Update average period length
      if (state.cycles.length > 0) {
        const totalPeriodLength = state.cycles.reduce((sum, cycle) => sum + (cycle.periodLength || 0), 0);
        state.averagePeriodLength = Math.round(totalPeriodLength / state.cycles.length);
      }
      
      // Update predictions based on the new data
      updatePredictions(state);
    },
    
    // Log daily symptoms and flow
    logDailyData: (state, action: PayloadAction<CycleDay>) => {
      if (state.currentCycle === -1) return;
      
      const { date, flowIntensity, symptoms, notes } = action.payload;
      const currentCycle = state.cycles[state.currentCycle];
      
      // Find if we already have an entry for this date
      const dayIndex = currentCycle.days.findIndex(
        day => startOfDay(new Date(day.date)).toISOString() === startOfDay(new Date(date)).toISOString()
      );
      
      if (dayIndex >= 0) {
        // Update existing day
        currentCycle.days[dayIndex] = {
          ...currentCycle.days[dayIndex],
          flowIntensity: flowIntensity || currentCycle.days[dayIndex].flowIntensity,
          symptoms: symptoms || currentCycle.days[dayIndex].symptoms,
          notes: notes || currentCycle.days[dayIndex].notes,
        };
      } else {
        // Add new day
        currentCycle.days.push({
          date,
          phase: calculatePhase(state, date),
          flowIntensity,
          symptoms,
          notes,
        });
        
        // Sort days by date
        currentCycle.days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Helper function to calculate cycle phase based on day of cycle
function calculatePhase(state: CycleState, date: string): CyclePhase {
  if (state.currentCycle === -1) return 'follicular';
  
  const currentCycle = state.cycles[state.currentCycle];
  const cycleStartDate = new Date(currentCycle.startDate);
  const currentDate = new Date(date);
  const dayOfCycle = Math.round((currentDate.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Calculate phase based on average cycle length
  const avgCycleLength = state.averageCycleLength;
  const avgPeriodLength = state.averagePeriodLength;
  
  if (dayOfCycle <= avgPeriodLength) {
    return 'menstrual';
  } else if (dayOfCycle < avgCycleLength / 2 - 2) {
    return 'follicular';
  } else if (dayOfCycle >= avgCycleLength / 2 - 2 && dayOfCycle <= avgCycleLength / 2 + 2) {
    return 'ovulatory';
  } else {
    return 'luteal';
  }
}

// Helper function to update cycle predictions
function updatePredictions(state: CycleState) {
  if (state.cycles.length === 0) return;
  
  // Clear previous predictions
  state.predictedCycles = [];
  
  // Calculate average cycle length
  if (state.cycles.length > 1) {
    let totalLength = 0;
    let count = 0;
    
    for (let i = 1; i < state.cycles.length; i++) {
      const prevCycleStart = new Date(state.cycles[i-1].startDate);
      const currentCycleStart = new Date(state.cycles[i].startDate);
      const cycleLength = Math.round((currentCycleStart.getTime() - prevCycleStart.getTime()) / (1000 * 60 * 60 * 24));
      
      if (cycleLength > 0 && cycleLength < 60) { // Filter out potentially erroneous data
        totalLength += cycleLength;
        count++;
      }
    }
    
    if (count > 0) {
      state.averageCycleLength = Math.round(totalLength / count);
    }
  }
  
  // Generate future predictions (next 3 cycles)
  const lastCycle = state.cycles[state.cycles.length - 1];
  let nextStartDate = new Date(lastCycle.startDate);
  
  for (let i = 0; i < 3; i++) {
    // Add average cycle length to get next cycle start
    nextStartDate = addDays(nextStartDate, state.averageCycleLength);
    const nextStartDateIso = nextStartDate.toISOString();
    
    // Create predicted cycle
    const predictedCycle = {
      startDate: nextStartDateIso,
      endDate: addDays(nextStartDate, state.averagePeriodLength - 1).toISOString(),
      length: state.averageCycleLength,
      periodLength: state.averagePeriodLength,
      days: [],
    };
    
    // Generate days for the predicted cycle
    for (let day = 0; day < state.averageCycleLength; day++) {
      const currentDate = addDays(nextStartDate, day);
      let phase: CyclePhase;
      
      if (day < state.averagePeriodLength) {
        phase = 'menstrual';
      } else if (day < Math.floor(state.averageCycleLength / 2) - 2) {
        phase = 'follicular';
      } else if (day >= Math.floor(state.averageCycleLength / 2) - 2 && 
                day <= Math.floor(state.averageCycleLength / 2) + 2) {
        phase = 'ovulatory';
      } else {
        phase = 'luteal';
      }
      
      predictedCycle.days.push({
        date: currentDate.toISOString(),
        phase,
        flowIntensity: phase === 'menstrual' ? 'medium' : 'none',
      });
    }
    
    state.predictedCycles.push(predictedCycle);
  }
}

export const { logPeriodStart, logPeriodEnd, logDailyData, setLoading, setError } = cycleSlice.actions;

export default cycleSlice.reducer;