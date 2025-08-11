import React from 'react';
import { Box, HStack, Icon, Text, VStack } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CyclePhase } from '../store/slices/cycleSlice';

interface DailyRecommendationProps {
  title: string;
  icon: string;
  iconColor: string;
  phase: CyclePhase | 'unknown';
}

const DailyRecommendation: React.FC<DailyRecommendationProps> = ({ 
  title, 
  icon, 
  iconColor, 
  phase 
}) => {
  // Get phase-specific recommendations
  const getRecommendations = () => {
    switch (phase) {
      case 'menstrual':
        if (title === 'Nutrition') {
          return {
            summary: 'Focus on iron-rich and anti-inflammatory foods',
            items: ['Leafy greens', 'Lentils', 'Ginger tea', 'Dark chocolate']
          };
        } else if (title === 'Exercise') {
          return {
            summary: 'Gentle movement and restorative practices',
            items: ['Gentle yoga', 'Walking', 'Stretching', 'Rest days']
          };
        } else { // Self-Care
          return {
            summary: 'Prioritize rest and comfort',
            items: ['Warm baths', 'Extra sleep', 'Heat therapy', 'Meditation']
          };
        }
      case 'follicular':
        if (title === 'Nutrition') {
          return {
            summary: 'Light, fresh foods with fermented options',
            items: ['Fresh fruits', 'Fermented foods', 'Sprouted grains', 'Lean proteins']
          };
        } else if (title === 'Exercise') {
          return {
            summary: 'Try new workouts with increasing intensity',
            items: ['Dance classes', 'Strength training', 'Cardio', 'Hiking']
          };
        } else { // Self-Care
          return {
            summary: 'Embrace creativity and social connection',
            items: ['Creative hobbies', 'Social activities', 'Learning new skills', 'Planning']
          };
        }
      case 'ovulatory':
        if (title === 'Nutrition') {
          return {
            summary: 'Antioxidant-rich and liver-supporting foods',
            items: ['Raw vegetables', 'Berries', 'Cruciferous vegetables', 'Seeds']
          };
        } else if (title === 'Exercise') {
          return {
            summary: 'Peak performance and high-intensity training',
            items: ['HIIT workouts', 'Sports', 'Running', 'Circuit training']
          };
        } else { // Self-Care
          return {
            summary: 'Channel your confidence and energy',
            items: ['Public speaking', 'Networking', 'Challenging tasks', 'Leadership roles']
          };
        }
      case 'luteal':
        if (title === 'Nutrition') {
          return {
            summary: 'Complex carbs and magnesium-rich foods',
            items: ['Sweet potatoes', 'Nuts', 'Whole grains', 'Dark chocolate']
          };
        } else if (title === 'Exercise') {
          return {
            summary: 'Moderate strength training and calming exercise',
            items: ['Pilates', 'Moderate weights', 'Swimming', 'Walking']
          };
        } else { // Self-Care
          return {
            summary: 'Focus on organization and self-care',
            items: ['Journaling', 'Organizing spaces', 'Relaxation', 'Early bedtime']
          };
        }
      default:
        return {
          summary: 'Track your cycle for personalized recommendations',
          items: ['Start logging your period', 'Track symptoms daily', 'Note energy levels']
        };
    }
  };

  const recommendations = getRecommendations();

  return (
    <HStack space={3} alignItems="flex-start">
      <Box 
        p={2} 
        borderRadius="full" 
        bg={iconColor.replace('500', '100')}
      >
        <Icon as={Ionicons} name={icon} size="md" color={iconColor} />
      </Box>
      <VStack flex={1}>
        <Text fontWeight="medium" fontSize="md">{title}</Text>
        <Text fontSize="sm" color="gray.600" mt={1}>{recommendations.summary}</Text>
        <HStack space={2} mt={2} flexWrap="wrap">
          {recommendations.items.map((item, index) => (
            <Box 
              key={index} 
              bg="gray.100" 
              px={2} 
              py={1} 
              borderRadius="md" 
              mb={1}
            >
              <Text fontSize="xs">{item}</Text>
            </Box>
          ))}
        </HStack>
      </VStack>
    </HStack>
  );
};

export default DailyRecommendation;