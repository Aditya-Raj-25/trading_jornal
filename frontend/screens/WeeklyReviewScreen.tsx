import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTradeStore } from '../store/useTradeStore';
import Card from '../components/Card';
import { useColorScheme } from 'nativewind';

const WeeklyReviewScreen = () => {
  const { summary } = useTradeStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6">
        <View className="py-6 border-b border-border mb-6">
          <Text className="text-muted text-xs font-medium uppercase tracking-widest">Self Reflection</Text>
          <Text className="text-accent text-3xl font-bold mt-1">Weekly Review</Text>
        </View>

        <Card className="mb-6 border border-border">
          <Text className="text-accent font-bold mb-4 uppercase tracking-widest text-xs">Discipline Score</Text>
          <View className="items-center py-6">
            <Text className="text-accent text-5xl font-bold">
              {summary?.disciplineScore?.toFixed(0) || '0'}%
            </Text>
            <Text className="text-muted text-xs mt-2 uppercase tracking-widest">Target: 100%</Text>
          </View>
        </Card>

        <Card className="mb-6 border border-border">
          <Text className="text-accent font-bold mb-4 uppercase tracking-widest text-xs">Mistakes to Fix</Text>
          {summary?.mostCommonMistakes && summary.mostCommonMistakes.length > 0 ? (
            summary.mostCommonMistakes.map((item, index) => (
              <View key={index} className="flex-row justify-between items-center mb-3">
                <Text className="text-accent text-sm font-medium">• {item.mistake}</Text>
                <Text className="text-muted text-xs">{item.count} occurrences</Text>
              </View>
            ))
          ) : (
            <Text className="text-muted text-sm py-4 text-center">Perfect discipline. Keep it up!</Text>
          )}
        </Card>

        <Card className="mb-10 border border-border">
          <Text className="text-accent font-bold mb-4 uppercase tracking-widest text-xs">Action Plan</Text>
          <Text className="text-muted text-sm leading-6">
            Review your top mistakes above. Write down your focus for the next trading week on a sticky note and place it on your monitor. Adhere strictly to the checklist. 
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeeklyReviewScreen;
