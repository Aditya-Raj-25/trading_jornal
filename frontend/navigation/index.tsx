import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, BarChart2, PlusCircle, Settings, History, CalendarDays } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Platform } from 'react-native';

const customFonts = Platform.select({
  ios: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '600' },
    heavy: { fontFamily: 'System', fontWeight: '700' },
  },
  default: {
    regular: { fontFamily: 'sans-serif', fontWeight: 'normal' },
    medium: { fontFamily: 'sans-serif-medium', fontWeight: 'normal' },
    bold: { fontFamily: 'sans-serif', fontWeight: '600' },
    heavy: { fontFamily: 'sans-serif', fontWeight: '700' },
  },
});

const MyDarkTheme = {
  dark: true,
  colors: {
    primary: '#FFFFFF',
    background: '#000000',
    card: '#000000',
    text: '#FFFFFF',
    border: '#1F1F1F',
    notification: '#F87171',
  },
  fonts: customFonts,
};

const MyDefaultTheme = {
  dark: false,
  colors: {
    primary: '#09090B',
    background: '#FAFAFA',
    card: '#FFFFFF',
    text: '#09090B',
    border: '#E4E4E7',
    notification: '#F87171',
  },
  fonts: customFonts,
};

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import AddTradeScreen from '../screens/AddTradeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import WeeklyReviewScreen from '../screens/WeeklyReviewScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

const Stack = createStackNavigator<any, any>();
const Tab = createBottomTabNavigator<any, any>();

const TabNavigator = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#1F1F1F',
          height: 85,
          paddingBottom: 25,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#7E8B9B',
      }}
    >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreen} 
      options={{
        tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />
      }}
    />
    <Tab.Screen 
      name="Analytics" 
      component={AnalyticsScreen} 
      options={{
        tabBarIcon: ({ color }) => <BarChart2 color={color} size={24} />
      }}
    />
    <Tab.Screen 
      name="Add" 
      component={AddTradeScreen} 
      options={{
        tabBarIcon: ({ color }) => <PlusCircle color={color} size={32} strokeWidth={2.5} />,
        tabBarLabel: () => null
      }}
    />
    <Tab.Screen 
      name="History" 
      component={HistoryScreen} 
      options={{
        tabBarIcon: ({ color }) => <History color={color} size={24} />
      }}
    />
    <Tab.Screen 
      name="Review" 
      component={WeeklyReviewScreen} 
      options={{
        tabBarIcon: ({ color }) => <CalendarDays color={color} size={24} />
      }}
    />
    <Tab.Screen 
      name="Settings" 
      component={SettingsScreen} 
      options={{
        tabBarIcon: ({ color }) => <Settings color={color} size={24} />
      }}
    />
  </Tab.Navigator>
  );
};

const Navigation = () => {
  const { user, initialized, init } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    init();
  }, []);

  if (!initialized) return null;

  return (
    <NavigationContainer theme={MyDarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#000000' } }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
