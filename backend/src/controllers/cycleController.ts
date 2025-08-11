import { Request, Response } from 'express';
import { PrismaClient, CyclePhase } from '@prisma/client';
import { subDays, addDays, differenceInDays } from 'date-fns';

const prisma = new PrismaClient();

// Get all cycles for the current user
export const getAllCycles = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const cycles = await prisma.cycle.findMany({
      where: {
        userId,
      },
      include: {
        days: {
          include: {
            symptoms: {
              include: {
                symptom: true,
              },
            },
            moods: {
              include: {
                mood: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return res.status(200).json(cycles);
  } catch (error) {
    console.error('Error fetching cycles:', error);
    return res.status(500).json({ message: 'Failed to fetch cycles' });
  }
};

// Get a single cycle by ID
export const getCycleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cycle = await prisma.cycle.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        days: {
          include: {
            symptoms: {
              include: {
                symptom: true,
              },
            },
            moods: {
              include: {
                mood: true,
              },
            },
          },
        },
      },
    });

    if (!cycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }

    return res.status(200).json(cycle);
  } catch (error) {
    console.error('Error fetching cycle:', error);
    return res.status(500).json({ message: 'Failed to fetch cycle' });
  }
};

// Create a new cycle (start of period)
export const createCycle = async (req: Request, res: Response) => {
  try {
    const { startDate } = req.body;
    const userId = req.user.id;

    if (!startDate) {
      return res.status(400).json({ message: 'Start date is required' });
    }

    // Get user's average cycle length from preferences
    const userPreferences = await prisma.userPreference.findUnique({
      where: {
        userId,
      },
    });

    const averageCycleLength = userPreferences?.averageCycleLength || 28;
    const averagePeriodLength = userPreferences?.averagePeriodLength || 5;

    // Create the new cycle
    const cycle = await prisma.cycle.create({
      data: {
        userId,
        startDate: new Date(startDate),
        // End date will be updated when period ends
      },
    });

    // Create the first day of the cycle with menstrual phase
    const cycleDay = await prisma.cycleDay.create({
      data: {
        cycleId: cycle.id,
        date: new Date(startDate),
        phase: 'MENSTRUAL',
      },
    });

    // Generate predicted days for this cycle
    await generateCycleDays(cycle.id, new Date(startDate), averageCycleLength, averagePeriodLength);

    return res.status(201).json({
      message: 'Cycle started successfully',
      cycle: {
        ...cycle,
        days: [cycleDay],
      },
    });
  } catch (error) {
    console.error('Error creating cycle:', error);
    return res.status(500).json({ message: 'Failed to create cycle' });
  }
};

// Update a cycle (e.g., end of period)
export const updateCycle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { endDate, notes } = req.body;
    const userId = req.user.id;

    // Verify the cycle exists and belongs to the user
    const existingCycle = await prisma.cycle.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingCycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }

    // Update the cycle
    const updatedCycle = await prisma.cycle.update({
      where: {
        id,
      },
      data: {
        endDate: endDate ? new Date(endDate) : undefined,
        notes,
        // Calculate period length if endDate is provided
        periodLength: endDate
          ? differenceInDays(new Date(endDate), new Date(existingCycle.startDate)) + 1
          : undefined,
      },
      include: {
        days: true,
      },
    });

    // If we now have an endDate, update user's average period length
    if (endDate && !existingCycle.endDate) {
      await updateUserAverageLengths(userId);
    }

    return res.status(200).json(updatedCycle);
  } catch (error) {
    console.error('Error updating cycle:', error);
    return res.status(500).json({ message: 'Failed to update cycle' });
  }
};

// Delete a cycle
export const deleteCycle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify the cycle exists and belongs to the user
    const existingCycle = await prisma.cycle.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingCycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }

    // Delete the cycle and all related data
    await prisma.cycle.delete({
      where: {
        id,
      },
    });

    // Update user's average cycle and period lengths
    await updateUserAverageLengths(userId);

    return res.status(200).json({ message: 'Cycle deleted successfully' });
  } catch (error) {
    console.error('Error deleting cycle:', error);
    return res.status(500).json({ message: 'Failed to delete cycle' });
  }
};

// Get the current active cycle
export const getCurrentCycle = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const today = new Date();

    // Find the most recent cycle
    const latestCycle = await prisma.cycle.findFirst({
      where: {
        userId,
      },
      orderBy: {
        startDate: 'desc',
      },
      include: {
        days: {
          orderBy: {
            date: 'asc',
          },
          include: {
            symptoms: {
              include: {
                symptom: true,
              },
            },
            moods: {
              include: {
                mood: true,
              },
            },
          },
        },
      },
    });

    if (!latestCycle) {
      return res.status(404).json({ message: 'No cycles found' });
    }

    // Get user's average cycle length
    const userPreferences = await prisma.userPreference.findUnique({
      where: {
        userId,
      },
    });
    const averageCycleLength = userPreferences?.averageCycleLength || 28;

    // Check if the latest cycle is still active
    const cycleEndDate = latestCycle.endDate || addDays(latestCycle.startDate, averageCycleLength - 1);
    
    if (today <= cycleEndDate) {
      // Current cycle is active
      return res.status(200).json({
        ...latestCycle,
        isActive: true,
        dayOfCycle: differenceInDays(today, latestCycle.startDate) + 1,
      });
    } else {
      // Latest cycle has ended, return it but mark as inactive
      return res.status(200).json({
        ...latestCycle,
        isActive: false,
        dayOfCycle: null,
      });
    }
  } catch (error) {
    console.error('Error fetching current cycle:', error);
    return res.status(500).json({ message: 'Failed to fetch current cycle' });
  }
};

// Helper function to generate predicted cycle days
const generateCycleDays = async (
  cycleId: string,
  startDate: Date,
  cycleLengthDays: number,
  periodLengthDays: number
) => {
  try {
    // Create days for the entire cycle with appropriate phases
    const daysToCreate = [];
    
    // First 1-5 days (period length) are menstrual phase
    for (let i = 0; i < periodLengthDays; i++) {
      const date = addDays(startDate, i);
      daysToCreate.push({
        cycleId,
        date,
        phase: 'MENSTRUAL' as CyclePhase,
      });
    }
    
    // Days after period until around day 13 are follicular phase
    const follicularEndDay = Math.floor(cycleLengthDays / 2) - 2;
    for (let i = periodLengthDays; i < follicularEndDay; i++) {
      const date = addDays(startDate, i);
      daysToCreate.push({
        cycleId,
        date,
        phase: 'FOLLICULAR' as CyclePhase,
      });
    }
    
    // ~3-4 days around the middle of the cycle are ovulatory phase
    const ovulatoryEndDay = Math.floor(cycleLengthDays / 2) + 2;
    for (let i = follicularEndDay; i < ovulatoryEndDay; i++) {
      const date = addDays(startDate, i);
      daysToCreate.push({
        cycleId,
        date,
        phase: 'OVULATORY' as CyclePhase,
      });
    }
    
    // Remaining days until end of cycle are luteal phase
    for (let i = ovulatoryEndDay; i < cycleLengthDays; i++) {
      const date = addDays(startDate, i);
      daysToCreate.push({
        cycleId,
        date,
        phase: 'LUTEAL' as CyclePhase,
      });
    }
    
    // Create all cycle days in the database
    await prisma.cycleDay.createMany({
      data: daysToCreate,
    });
    
    return daysToCreate.length;
  } catch (error) {
    console.error('Error generating cycle days:', error);
    throw error;
  }
};

// Helper function to update user's average cycle and period lengths
const updateUserAverageLengths = async (userId: string) => {
  try {
    // Get all completed cycles (with both start and end dates)
    const completedCycles = await prisma.cycle.findMany({
      where: {
        userId,
        endDate: {
          not: null,
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
    
    if (completedCycles.length < 1) {
      return; // Not enough data to calculate averages
    }
    
    // Calculate average period length
    const totalPeriodDays = completedCycles.reduce((sum, cycle) => {
      return sum + (cycle.periodLength || 0);
    }, 0);
    const averagePeriodLength = Math.round(totalPeriodDays / completedCycles.length);
    
    // Calculate average cycle length
    let totalCycleDays = 0;
    let cycleCount = 0;
    
    // We need at least 2 cycles to calculate cycle length
    if (completedCycles.length >= 2) {
      for (let i = 0; i < completedCycles.length - 1; i++) {
        const currentCycle = completedCycles[i];
        const nextCycle = completedCycles[i + 1];
        
        const cycleLengthDays = differenceInDays(
          currentCycle.startDate,
          nextCycle.startDate
        );
        
        if (cycleLengthDays > 0 && cycleLengthDays < 60) { // Filter out potentially erroneous data
          totalCycleDays += cycleLengthDays;
          cycleCount++;
        }
      }
    }
    
    const averageCycleLength = cycleCount > 0
      ? Math.round(totalCycleDays / cycleCount)
      : 28; // Default to 28 if we can't calculate
    
    // Update user preferences with new averages
    await prisma.userPreference.update({
      where: {
        userId,
      },
      data: {
        averagePeriodLength,
        averageCycleLength,
      },
    });
    
    return { averagePeriodLength, averageCycleLength };
  } catch (error) {
    console.error('Error updating user average lengths:', error);
    throw error;
  }
};

export default {
  getAllCycles,
  getCycleById,
  createCycle,
  updateCycle,
  deleteCycle,
  getCurrentCycle,
};