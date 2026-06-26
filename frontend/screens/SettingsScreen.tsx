import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import Card from '../components/Card';
import { LogOut, User, Bell, Shield, CircleHelp, Moon, Sun } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

const SettingsScreen = () => {
  const { user, logout } = useAuthStore();
  const { colorScheme } = useColorScheme();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() }
      ]
    );
  };

  const SettingItem = ({ icon: Icon, title, onPress, isDestructive = false }: any) => {
    const iconColor = isDestructive ? '#F87171' : (colorScheme === 'dark' ? '#FFFFFF' : '#09090B');
    return (
      <TouchableOpacity 
        onPress={onPress}
        className="flex-row items-center justify-between py-4 border-b border-border last:border-0"
      >
        <View className="flex-row items-center">
          <Icon color={iconColor} size={20} />
          <Text className={`text-base font-medium ml-4 ${isDestructive ? 'text-error' : 'text-accent'}`}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6">
        <View className="py-6">
          <Text className="text-accent text-3xl font-bold">Settings</Text>
        </View>

        <Card className="mb-8 flex-row items-center">
          <View className="w-16 h-16 rounded-full bg-accent/10 items-center justify-center">
            <User color={colorScheme === 'dark' ? '#FFFFFF' : '#09090B'} size={32} />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-accent text-xl font-bold">{user?.displayName || 'Trader'}</Text>
            <Text className="text-muted">{user?.email}</Text>
          </View>
        </Card>



        <View className="mb-10">
          <Text className="text-muted text-xs font-medium mb-4 uppercase tracking-widest">Account</Text>
          <Card className="p-0 px-4">
            <SettingItem icon={User} title="Edit Profile" />
            <SettingItem icon={Bell} title="Notifications" />
            <SettingItem icon={Shield} title="Privacy & Security" />
            <SettingItem icon={CircleHelp} title="Support" />
          </Card>
        </View>

        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-card border border-border h-14 rounded-2xl flex-row items-center justify-center mb-10"
        >
          <LogOut color="#F87171" size={20} />
          <Text className="text-error font-bold ml-2">Log Out</Text>
        </TouchableOpacity>

        <View className="items-center pb-10">
          <Text className="text-muted text-xs">Trading Journal v1.0.0</Text>
          <Text className="text-muted text-xs mt-1">Built for Disciplined Traders</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
