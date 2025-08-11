import React from 'react';
import { Box, Circle, Icon, Text } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CyclePhase } from '../store/slices/cycleSlice';

interface CyclePhaseIndicatorProps {
  phase: CyclePhase | 'unknown';
  size?: number;
}

const CyclePhaseIndicator: React.FC<CyclePhaseIndicatorProps> = ({ phase, size = 40 }) => {
  // Phase-specific icons and colors
  const phaseDetails = {
    menstrual: {
      icon: 'water-outline',
      color: 'red.500',
      bgColor: 'red.100'
    },
    follicular: {
      icon: 'leaf-outline',
      color: 'blue.500',
      bgColor: 'blue.100'
    },
    ovulatory: {
      icon: 'sunny-outline',
      color: 'orange.500',
      bgColor: 'orange.100'
    },
    luteal: {
      icon: 'moon-outline',
      color: 'purple.500',
      bgColor: 'purple.100'
    },
    unknown: {
      icon: 'help-outline',
      color: 'gray.500',
      bgColor: 'gray.100'
    }
  };

  const details = phaseDetails[phase] || phaseDetails.unknown;

  return (
    <Circle size={size} bg={details.bgColor}>
      <Icon as={Ionicons} name={details.icon} size={size * 0.5} color={details.color} />
    </Circle>
  );
};

export default CyclePhaseIndicator;