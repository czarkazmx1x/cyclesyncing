import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import RecommendationsScreen from './src/screens/RecommendationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Import store
import { store } from './src/store';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

// Extend the theme for NativeBase
const theme = extendTheme({
  colors: {
    primary: {
      50: '#f5e6ff',
      100: '#d9b3ff',
      200: '#c080ff',
      300: '#a64dff',
      400: '#8c1aff',
      500: '#7300e6',
      600: '#5900b3',
      700: '#400080',
      800: '#26004d',
      900: '#0d001a',
    },
    secondary: {
      50: '#e6f9ff',
      100: '#b3edff',
      200: '#80e1ff',
      300: '#4dd6ff',
      400: '#1acaff',
      500: '#00a3d9',
      600: '#007da6',
      700: '#005773',
      800: '#003240',
      900: '#000e0d',
    },
  },
  config: {
    initialColorMode: 'light',
  },
});

// Define tab icons
const getTabIcon = (route: any, focused: boolean, color: string, size: number) => {
  let iconName;

  if (route.name === 'Home') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (route.name === 'Calendar') {
    iconName = focused ? 'calendar' : 'calendar-outline';
  } else if (route.name === 'Insights') {
    iconName = focused ? 'analytics' : 'analytics-outline';
  } else if (route.name === 'Recommendations') {
    iconName = focused ? 'list' : 'list-outline';
  } else if (route.name === 'Profile') {
    iconName = focused ? 'person' : 'person-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

function App(): JSX.Element {
  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <NativeBaseProvider theme={theme}>
          <StatusBar barStyle="dark-content" />
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => getTabIcon(route, focused, color, size),
                tabBarActiveTintColor: theme.colors.primary[500],
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                  paddingBottom: 5,
                  paddingTop: 5,
                },
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Calendar" component={CalendarScreen} />
              <Tab.Screen name="Insights" component={InsightsScreen} />
              <Tab.Screen name="Recommendations" component={RecommendationsScreen} />
              <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
}

export default App;