// Cycle calculation utilities

export function calculateCycleInfo(profile) {
  if (!profile?.last_period_start) {
    return {
      currentDay: 1,
      currentPhase: 'menstrual',
      nextPeriodDate: null,
      fertileWindowStart: null,
      fertileWindowEnd: null,
      ovulationDate: null,
      daysUntilNextPeriod: null
    };
  }

  const lastPeriod = new Date(profile.last_period_start);
  const today = new Date();
  const cycleLength = profile.cycle_length || 28;
  const periodLength = profile.period_length || 5;

  // Calculate days since last period
  const daysSinceLastPeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));

  // Calculate current cycle day (1-based)
  let currentDay = (daysSinceLastPeriod % cycleLength) + 1;
  
  // Handle negative case (if last period was set in future by mistake)
  if (daysSinceLastPeriod < 0) {
    currentDay = 1;
  }

  // Determine current phase
  let phase = 'menstrual';
  if (currentDay <= periodLength) {
    phase = 'menstrual';
  } else if (currentDay <= Math.floor(cycleLength * 0.5)) {
    phase = 'follicular';
  } else if (currentDay <= Math.floor(cycleLength * 0.6)) {
    phase = 'ovulatory';
  } else {
    phase = 'luteal';
  }

  // Calculate next period date
  const cyclesSinceLastPeriod = Math.floor(daysSinceLastPeriod / cycleLength);
  const nextPeriod = new Date(lastPeriod);
  nextPeriod.setDate(nextPeriod.getDate() + ((cyclesSinceLastPeriod + 1) * cycleLength));

  // Calculate days until next period
  const daysUntilNextPeriod = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));

  // Calculate ovulation date (typically 14 days before next period)
  const ovulation = new Date(nextPeriod);
  ovulation.setDate(ovulation.getDate() - 14);

  // Calculate fertile window (5 days before ovulation + ovulation day)
  const fertileStart = new Date(ovulation);
  fertileStart.setDate(fertileStart.getDate() - 5);
  
  const fertileEnd = new Date(ovulation);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  return {
    currentDay,
    currentPhase: phase,
    nextPeriodDate: nextPeriod,
    fertileWindowStart: fertileStart,
    fertileWindowEnd: fertileEnd,
    ovulationDate: ovulation,
    daysUntilNextPeriod
  };
}

export function getPhaseForDay(date, profile) {
  if (!profile?.last_period_start) return 'follicular';
  
  const lastPeriod = new Date(profile.last_period_start);
  const cycleLength = profile.cycle_length || 28;
  const periodLength = profile.period_length || 5;
  
  const daysDiff = Math.floor((date - lastPeriod) / (1000 * 60 * 60 * 24));
  const cycleDay = ((daysDiff % cycleLength) + cycleLength) % cycleLength + 1;

  if (cycleDay <= periodLength) return 'menstrual';
  if (cycleDay <= Math.floor(cycleLength * 0.5)) return 'follicular';
  if (cycleDay <= Math.floor(cycleLength * 0.6)) return 'ovulatory';
  return 'luteal';
}

export function isPeriodDay(date, profile) {
  if (!profile?.last_period_start) return false;
  
  const phase = getPhaseForDay(date, profile);
  return phase === 'menstrual';
}

export function isOvulationDay(date, profile) {
  if (!profile?.last_period_start) return false;
  
  const cycleInfo = calculateCycleInfo(profile);
  if (!cycleInfo.ovulationDate) return false;
  
  const ovulationDate = new Date(cycleInfo.ovulationDate);
  return date.toDateString() === ovulationDate.toDateString();
}

export function isFertileDay(date, profile) {
  if (!profile?.last_period_start) return false;
  
  const cycleInfo = calculateCycleInfo(profile);
  if (!cycleInfo.fertileWindowStart || !cycleInfo.fertileWindowEnd) return false;
  
  return date >= cycleInfo.fertileWindowStart && date <= cycleInfo.fertileWindowEnd;
}
