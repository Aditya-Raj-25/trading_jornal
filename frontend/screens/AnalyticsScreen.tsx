import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Polyline, Line, Text as SvgText } from 'react-native-svg';
import { useTradeStore } from '../store/useTradeStore';
import Card from '../components/Card';
import { useColorScheme } from 'nativewind';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 80;
const CHART_HEIGHT = 160;

const EquityChart = ({ trades }: { trades: any[] }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (trades.length < 2) {
    return (
      <View style={{ height: CHART_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
        <Text className="text-muted text-sm">Log at least 2 trades to see the equity curve.</Text>
      </View>
    );
  }

  // Build cumulative PnL points
  const points: { x: number; y: number }[] = [];
  let cumPnL = 0;
  trades.slice().reverse().forEach((t, i) => {
    cumPnL += t.pnl;
    points.push({ x: i, y: cumPnL });
  });

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeY = maxY - minY || 1;
  const rangeX = xs.length - 1 || 1;

  const pad = 10;
  const toSvgX = (x: number) => pad + (x / rangeX) * (CHART_WIDTH - pad * 2);
  const toSvgY = (y: number) => CHART_HEIGHT - pad - ((y - minY) / rangeY) * (CHART_HEIGHT - pad * 2);

  const polylinePoints = points.map(p => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(' ');

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      {/* Zero line */}
      <Line
        x1={pad} y1={toSvgY(0)}
        x2={CHART_WIDTH - pad} y2={toSvgY(0)}
        stroke={isDark ? '#333333' : '#E4E4E7'} strokeWidth="1" strokeDasharray="4,4"
      />
      {/* Equity line */}
      <Polyline
        points={polylinePoints}
        fill="none"
        stroke={isDark ? '#FFFFFF' : '#09090B'}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Start/end labels */}
      <SvgText x={pad} y={CHART_HEIGHT - 2} fill={isDark ? '#666666' : '#71717A'} fontSize="9">
        #{1}
      </SvgText>
      <SvgText x={CHART_WIDTH - pad - 20} y={CHART_HEIGHT - 2} fill={isDark ? '#666666' : '#71717A'} fontSize="9">
        #{points.length}
      </SvgText>
    </Svg>
  );
};

const AnalyticsScreen = () => {
  const { summary, trades } = useTradeStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6">
        <View className="py-6 border-b border-border mb-6">
          <Text className="text-muted text-xs font-medium uppercase tracking-widest">Performance</Text>
          <Text className="text-accent text-3xl font-bold mt-1">Analytics</Text>
        </View>

        {/* Summary Stats */}
        <View className="flex-row justify-between mb-4">
          <Card className="w-[48%] p-4 items-center border border-border">
            <Text className="text-muted text-[10px] uppercase tracking-widest mb-1">Total PnL</Text>
            <Text className="text-accent text-xl font-bold">
              ${summary?.totalPnL?.toFixed(2) || '0.00'}
            </Text>
          </Card>
          <Card className="w-[48%] p-4 items-center border border-border">
            <Text className="text-muted text-[10px] uppercase tracking-widest mb-1">Win Rate</Text>
            <Text className="text-accent text-xl font-bold">
              {summary?.winRate?.toFixed(1) || '0'}%
            </Text>
          </Card>
        </View>

        <View className="flex-row justify-between mb-6">
          <Card className="w-[48%] p-4 items-center border border-border">
            <Text className="text-muted text-[10px] uppercase tracking-widest mb-1">Trades</Text>
            <Text className="text-accent text-xl font-bold">{trades.length}</Text>
          </Card>
          <Card className="w-[48%] p-4 items-center border border-border">
            <Text className="text-muted text-[10px] uppercase tracking-widest mb-1">Discipline</Text>
            <Text className="text-accent text-xl font-bold">
              {summary?.disciplineScore?.toFixed(0) || '0'}%
            </Text>
          </Card>
        </View>

        {/* Equity Curve */}
        <Card className="mb-6 border border-border">
          <Text className="text-accent font-bold mb-4 uppercase tracking-widest text-xs">Equity Curve</Text>
          <EquityChart trades={trades} />
        </Card>

        {/* Win / Loss Bar */}
        <Card className="mb-6 border border-border">
          <Text className="text-accent font-bold mb-2 uppercase tracking-widest text-xs">Trade Outcomes</Text>
          {trades.length > 0 ? (() => {
            const wins = trades.filter(t => t.pnl > 0).length;
            const losses = trades.filter(t => t.pnl <= 0).length;
            const total = trades.length;
            const winPct = (wins / total) * 100;
            const lossPct = (losses / total) * 100;
            return (
              <View>
                <View className="flex-row h-3 rounded-full overflow-hidden bg-border mt-2">
                  <View style={{ flex: wins }} className="bg-accent rounded-l-full" />
                  <View style={{ flex: losses }} className="bg-muted rounded-r-full" />
                </View>
                <View className="flex-row justify-between mt-3">
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-accent mr-2" />
                    <Text className="text-muted text-xs">Win {wins} ({winPct.toFixed(0)}%)</Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-muted mr-2" />
                    <Text className="text-muted text-xs">Loss {losses} ({lossPct.toFixed(0)}%)</Text>
                  </View>
                </View>
              </View>
            );
          })() : (
            <Text className="text-muted text-sm mt-2">No trades logged yet.</Text>
          )}
        </Card>

        {/* Most Common Mistakes */}
        <Card className="mb-10 border border-border">
          <Text className="text-accent font-bold mb-4 uppercase tracking-widest text-xs">Top Mistakes</Text>
          {summary?.mostCommonMistakes && summary.mostCommonMistakes.length > 0 ? (
            summary.mostCommonMistakes.slice(0, 5).map((item, index) => (
              <View key={index} className="mb-4">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-accent text-sm font-medium">{item.mistake}</Text>
                  <Text className="text-muted text-xs">{item.count}x</Text>
                </View>
                <View className="h-1 bg-border rounded-full overflow-hidden">
                  <View
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${Math.min((item.count / (summary.mostCommonMistakes[0]?.count || 1)) * 100, 100)}%` }}
                  />
                </View>
              </View>
            ))
          ) : (
            <Text className="text-muted text-sm mt-2">No mistakes recorded yet. Keep it clean!</Text>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;
