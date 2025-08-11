import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Heading, 
  ScrollView, 
  Pressable, 
  Icon, 
  useColorModeValue,
  Progress,
  Divider
} from 'native-base';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { format, isToday, isThisMonth } from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import components
import CyclePhaseIndicator from '../components/CyclePhaseIndicator';
import SymptomsTracker from '../components/SymptomsTracker';
import DailyRecommendation from '../components/DailyRecommendation';

const HomeScreen = () => {
  // Get current phase and cycle data from Redux store
  const { cycles, currentCycle, predictedCycles } = useSelector((state: RootState) => state.cycle);
  
  // Determine current phase and cycle day
  const currentDate = new Date();
  let currentPhase = 'unknown';
  let cycleDay = 0;
  let daysUntilPeriod = 0;
  let cycleProgress = 0;
  
  if (currentCycle >= 0 && cycles.length > 0) {
    const activeCycle = cycles[currentCycle];
    const cycleStartDate = new Date(activeCycle.startDate);
    
    // Calculate current day of cycle
    cycleDay = Math.floor((currentDate.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Find the day entry for today
    const todayEntry = activeCycle.days.find(day => isToday(new Date(day.date)));
    if (todayEntry) {
      currentPhase = todayEntry.phase;
    } else {
      // Calculate phase based on cycle day
      if (cycleDay <= 5) {
        currentPhase = 'menstrual';
      } else if (cycleDay < 14) {
        currentPhase = 'follicular';
      } else if (cycleDay >= 14 && cycleDay <= 16) {
        currentPhase = 'ovulatory';
      } else {
        currentPhase = 'luteal';
      }
    }
    
    // Calculate cycle progress
    cycleProgress = Math.min((cycleDay / 28) * 100, 100);
  } else if (predictedCycles.length > 0) {
    // If we don't have an active cycle, use predictions
    const nextPeriodStart = new Date(predictedCycles[0].startDate);
    daysUntilPeriod = Math.ceil((nextPeriodStart.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilPeriod <= 0) {
      currentPhase = 'menstrual';
      cycleDay = Math.abs(daysUntilPeriod) + 1;
    } else if (daysUntilPeriod > 14) {
      currentPhase = 'follicular';
      cycleDay = 28 - daysUntilPeriod;
    } else if (daysUntilPeriod > 10 && daysUntilPeriod <= 14) {
      currentPhase = 'ovulatory';
      cycleDay = 28 - daysUntilPeriod;
    } else {
      currentPhase = 'luteal';
      cycleDay = 28 - daysUntilPeriod;
    }
    
    // Calculate cycle progress
    cycleProgress = Math.min(((28 - daysUntilPeriod) / 28) * 100, 100);
  }
  
  // Get phase-specific colors
  const phaseColors = {
    menstrual: useColorModeValue('#FF5A5A', '#FF8080'),
    follicular: useColorModeValue('#5E9BE6', '#7EB1F2'),
    ovulatory: useColorModeValue('#FFB443', '#FFC670'),
    luteal: useColorModeValue('#B96CBD', '#D285DE'),
    unknown: useColorModeValue('#AAAAAA', '#CCCCCC'),
  };
  
  const phaseDescriptions = {
    menstrual: 'During your period, focus on rest and gentle activity.',
    follicular: 'Rising estrogen gives you extra energy and creativity.',
    ovulatory: 'Peak energy and confidence - great for challenging workouts.',
    luteal: 'Winding down phase, focus on self-care and preparation.',
    unknown: 'Track your cycle to get personalized insights.',
  };
  
  // Format today's date
  const formattedDate = format(currentDate, 'EEEE, MMMM d');

  return (
    <ScrollView>
      <Box p={4}>
        <VStack space={6}>
          {/* Date and greeting */}
          <VStack>
            <Text fontSize="md" color="gray.500">{formattedDate}</Text>
            <Heading size="xl">Good morning</Heading>
          </VStack>
          
          {/* Cycle phase card */}
          <Box 
            bg={phaseColors[currentPhase as keyof typeof phaseColors] + '20'} 
            borderRadius="lg" 
            p={4}
            borderLeftWidth={4}
            borderLeftColor={phaseColors[currentPhase as keyof typeof phaseColors]}
          >
            <VStack space={3}>
              <HStack justifyContent="space-between" alignItems="center">
                <VStack>
                  <Text color="gray.500">Current Phase</Text>
                  <Heading size="md" textTransform="capitalize">{currentPhase} Phase</Heading>
                </VStack>
                <CyclePhaseIndicator phase={currentPhase as any} size={50} />
              </HStack>
              
              <Text>{phaseDescriptions[currentPhase as keyof typeof phaseDescriptions]}</Text>
              
              <VStack space={1}>
                <HStack justifyContent="space-between">
                  <Text fontSize="xs" color="gray.500">Cycle Day {cycleDay}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {daysUntilPeriod > 0 ? `${daysUntilPeriod} days until period` : 'Period active'}
                  </Text>
                </HStack>
                <Progress value={cycleProgress} colorScheme={currentPhase === 'menstrual' ? 'red' : 
                  currentPhase === 'follicular' ? 'blue' : 
                  currentPhase === 'ovulatory' ? 'orange' : 
                  currentPhase === 'luteal' ? 'purple' : 'gray'} 
                />
              </VStack>
            </VStack>
          </Box>
          
          {/* Log today's data */}
          <Box bg="white" borderRadius="lg" p={4} shadow={1}>
            <VStack space={3}>
              <Heading size="sm">Track Today</Heading>
              <HStack space={2} flexWrap="wrap">
                <Pressable 
                  bg="gray.100" 
                  p={3} 
                  borderRadius="md" 
                  flexDirection="row" 
                  alignItems="center"
                  _pressed={{ bg: 'gray.200' }}
                >
                  <Icon as={Ionicons} name="water" color="red.500" size="sm" mr={2} />
                  <Text>Period Flow</Text>
                </Pressable>
                
                <Pressable 
                  bg="gray.100" 
                  p={3} 
                  borderRadius="md" 
                  flexDirection="row" 
                  alignItems="center"
                  _pressed={{ bg: 'gray.200' }}
                >
                  <Icon as={Ionicons} name="medical" color="purple.500" size="sm" mr={2} />
                  <Text>Symptoms</Text>
                </Pressable>
                
                <Pressable 
                  bg="gray.100" 
                  p={3} 
                  borderRadius="md" 
                  flexDirection="row" 
                  alignItems="center"
                  _pressed={{ bg: 'gray.200' }}
                >
                  <Icon as={Ionicons} name="happy" color="yellow.500" size="sm" mr={2} />
                  <Text>Mood</Text>
                </Pressable>
                
                <Pressable 
                  bg="gray.100" 
                  p={3} 
                  borderRadius="md" 
                  flexDirection="row" 
                  alignItems="center"
                  _pressed={{ bg: 'gray.200' }}
                >
                  <Icon as={Ionicons} name="create" color="blue.500" size="sm" mr={2} />
                  <Text>Notes</Text>
                </Pressable>
              </HStack>
            </VStack>
          </Box>
          
          {/* Daily recommendations */}
          <Box bg="white" borderRadius="lg" p={4} shadow={1}>
            <VStack space={4}>
              <Heading size="sm">Today's Recommendations</Heading>
              
              <DailyRecommendation 
                title="Nutrition"
                icon="nutrition"
                iconColor="green.500"
                phase={currentPhase as any}
              />
              
              <Divider />
              
              <DailyRecommendation 
                title="Exercise"
                icon="fitness"
                iconColor="blue.500"
                phase={currentPhase as any}
              />
              
              <Divider />
              
              <DailyRecommendation 
                title="Self-Care"
                icon="heart"
                iconColor="red.500"
                phase={currentPhase as any}
              />
              
              <Pressable 
                mt={2}
                _pressed={{ opacity: 0.8 }}
              >
                <Text color="primary.500" fontWeight="medium" textAlign="center">
                  View all recommendations
                </Text>
              </Pressable>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default HomeScreen;