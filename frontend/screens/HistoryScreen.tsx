import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { useTradeStore } from '../store/useTradeStore';
import { ChevronRight, Calendar } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

const HistoryScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const { trades, loading, fetchTrades } = useTradeStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const onRefresh = () => {
    if (user) fetchTrades(user.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-6 border-b border-border">
        <Text className="text-accent text-3xl font-bold">Trade History</Text>
        <Text className="text-muted mt-1 text-sm tracking-wide">{trades.length} trades total</Text>
      </View>

      <ScrollView 
        className="flex-1 px-6 pt-6"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={isDark ? '#ffffff' : '#09090b'} />
        }
      >
        {trades.map((trade) => (
          <View 
            key={trade.id}
            className="bg-card border border-border rounded-xl p-4 flex-row justify-between items-center mb-4"
          >
            <View>
              <View className="flex-row items-center mb-1">
                <Text className="text-accent text-lg font-bold">{trade.asset}</Text>
                <View className="ml-3 px-2 py-0.5 rounded-sm bg-border">
                  <Text className="text-[10px] font-bold text-accent tracking-widest">
                    {trade.direction}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center mt-1">
                <Calendar color={isDark ? '#666666' : '#71717A'} size={12} />
                <Text className="text-muted text-xs ml-1 tracking-wider">
                  {new Date(trade.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="items-end mr-3">
                <Text className="text-lg font-bold text-accent">
                  {trade.pnl >= 0 ? '+' : '-'}${Math.abs(trade.pnl)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {trades.length === 0 && !loading && (
          <View className="items-center py-20 border border-border rounded-xl mt-4">
            <Text className="text-muted text-center text-sm">Your trade history is empty.</Text>
          </View>
        )}
        
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
