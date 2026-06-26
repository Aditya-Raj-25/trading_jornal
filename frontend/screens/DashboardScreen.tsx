import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { useTradeStore } from '../store/useTradeStore';
import Card from '../components/Card';
import { TrendingUp, Target, ShieldCheck, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const { trades, summary, loading, fetchTrades } = useTradeStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (user) {
      fetchTrades(user.id);
    }
  }, [user]);

  const onRefresh = () => {
    if (user) fetchTrades(user.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={isDark ? '#ffffff' : '#09090b'} />
        }
      >
        <View className="py-6 border-b border-border mb-6">
          <Text className="text-muted text-xs font-medium uppercase tracking-[3px]">Overview</Text>
          <Text className="text-accent text-3xl font-bold mt-1">Trading Journal</Text>
        </View>

        <View className="flex-row flex-wrap justify-between mb-8">
          {(() => {
            const iconColor = isDark ? '#FFFFFF' : '#09090B';
            return (
              <>
                <View className="w-[48%] mb-4">
                  <Card className="p-4 items-center border border-border">
                    <TrendingUp color={iconColor} size={20} />
                    <Text className="text-muted text-[10px] mt-2 uppercase tracking-widest">Total PnL</Text>
                    <Text className="text-accent text-xl font-bold mt-1">
                      ${summary?.totalPnL?.toLocaleString() || '0'}
                    </Text>
                  </Card>
                </View>
                <View className="w-[48%] mb-4">
                  <Card className="p-4 items-center border border-border">
                    <Target color={iconColor} size={20} />
                    <Text className="text-muted text-[10px] mt-2 uppercase tracking-widest">Win Rate</Text>
                    <Text className="text-accent text-xl font-bold mt-1">
                      {summary?.winRate?.toFixed(1) || '0'}%
                    </Text>
                  </Card>
                </View>
                <View className="w-[48%] mb-4">
                  <Card className="p-4 items-center border border-border">
                    <ShieldCheck color={iconColor} size={20} />
                    <Text className="text-muted text-[10px] mt-2 uppercase tracking-widest">Discipline</Text>
                    <Text className="text-accent text-xl font-bold mt-1">
                      {summary?.disciplineScore?.toFixed(0) || '0'}/100
                    </Text>
                  </Card>
                </View>
                <View className="w-[48%] mb-4">
                  <Card className="p-4 items-center border border-border">
                    <ShieldCheck color={iconColor} size={20} />
                    <Text className="text-muted text-[10px] mt-2 uppercase tracking-widest">Total Trades</Text>
                    <Text className="text-accent text-xl font-bold mt-1">
                      {summary?.totalTrades || '0'}
                    </Text>
                  </Card>
                </View>
              </>
            );
          })()}
        </View>

        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-accent text-lg font-bold">Recent Trades</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text className="text-muted text-xs uppercase tracking-widest">See All</Text>
            </TouchableOpacity>
          </View>

          {trades.slice(0, 5).map((trade) => (
            <View 
              key={trade.id}
              className="bg-card border border-border rounded-xl p-4 flex-row justify-between items-center mb-3"
            >
              <View>
                <Text className="text-accent font-bold">{trade.asset}</Text>
                <Text className="text-muted text-[10px] uppercase mt-1 tracking-widest">{trade.direction}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-accent font-bold">
                  {trade.pnl >= 0 ? '+' : '-'}${Math.abs(trade.pnl)}
                </Text>
              </View>
            </View>
          ))}
          
          {trades.length === 0 && !loading && (
            <View className="items-center py-10 border border-border rounded-xl">
              <Text className="text-muted text-sm">No trades recorded yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
