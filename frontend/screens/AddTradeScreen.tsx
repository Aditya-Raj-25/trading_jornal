import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../store/useAuthStore';
import { useTradeStore } from '../store/useTradeStore';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

const schema = z.object({
  asset: z.string().min(1, 'Asset is required'),
  entry: z.string().transform(v => parseFloat(v)),
  sl: z.string().transform(v => parseFloat(v)),
  tp: z.string().transform(v => parseFloat(v)),
  lotSize: z.string().transform(v => parseFloat(v)),
  riskPercent: z.string().transform(v => parseFloat(v)),
  pnl: z.string().transform(v => parseFloat(v)),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const COMMON_MISTAKES = ['FOMO', 'Overleveraged', 'Revenge Trade', 'Moved SL', 'Early Exit', 'Hesitation'];

const AddTradeScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const { addTrade } = useTradeStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [loading, setLoading] = useState(false);
  const [selectedMistakes, setSelectedMistakes] = useState<string[]>([]);
  const [checklist, setChecklist] = useState({
    htfBias: false,
    confirmation: false,
    riskPlanned: false,
    emotionControlled: false,
  });

  const { control, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      asset: '',
      notes: '',
    }
  });

  const onSubmit = async (data: any) => {
    if (!user) return;
    setLoading(true);
    try {
      await addTrade({
        userId: user.id,
        ...data,
        direction,
        checklist,
        mistakes: selectedMistakes,
      });

      Alert.alert('Success', 'Trade logged successfully');
      navigation.navigate('Dashboard');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMistake = (mistake: string) => {
    setSelectedMistakes(prev => 
      prev.includes(mistake) ? prev.filter(m => m !== mistake) : [...prev, mistake]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6">
        <View className="py-6 border-b border-border mb-6">
          <Text className="text-accent text-3xl font-bold">Log Trade</Text>
          <Text className="text-muted mt-1 text-sm tracking-wide">Execute your plan with discipline.</Text>
        </View>

        <View className="flex-row bg-card border border-border rounded-xl p-1 mb-6">
          <TouchableOpacity 
            onPress={() => setDirection('BUY')}
            className={`flex-1 py-3 rounded-lg items-center ${direction === 'BUY' ? 'bg-accent' : ''}`}
          >
            <Text className={`font-bold tracking-widest ${direction === 'BUY' ? 'text-background' : 'text-muted'}`}>BUY</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setDirection('SELL')}
            className={`flex-1 py-3 rounded-lg items-center ${direction === 'SELL' ? 'bg-accent' : ''}`}
          >
            <Text className={`font-bold tracking-widest ${direction === 'SELL' ? 'text-background' : 'text-muted'}`}>SELL</Text>
          </TouchableOpacity>
        </View>

        <Controller
          control={control}
          name="asset"
          render={({ field: { onChange, value } }) => (
            <Input label="Asset" placeholder="e.g. XAUUSD, BTC" value={value} onChangeText={onChange} error={errors.asset?.message} />
          )}
        />

        <View className="flex-row justify-between">
          <Controller
            control={control}
            name="entry"
            render={({ field: { onChange, value } }) => (
              <Input label="Entry" placeholder="0.00" keyboardType="numeric" className="w-[48%]" value={value?.toString()} onChangeText={onChange} error={errors.entry?.message} />
            )}
          />
          <Controller
            control={control}
            name="pnl"
            render={({ field: { onChange, value } }) => (
              <Input label="PnL ($)" placeholder="0.00" keyboardType="numeric" className="w-[48%]" value={value?.toString()} onChangeText={onChange} error={errors.pnl?.message} />
            )}
          />
        </View>

        <View className="flex-row justify-between">
          <Controller
            control={control}
            name="sl"
            render={({ field: { onChange, value } }) => (
              <Input label="Stop Loss" placeholder="0.00" keyboardType="numeric" className="w-[48%]" value={value?.toString()} onChangeText={onChange} error={errors.sl?.message} />
            )}
          />
          <Controller
            control={control}
            name="tp"
            render={({ field: { onChange, value } }) => (
              <Input label="Take Profit" placeholder="0.00" keyboardType="numeric" className="w-[48%]" value={value?.toString()} onChangeText={onChange} error={errors.tp?.message} />
            )}
          />
        </View>

        <View className="flex-row justify-between">
          <Controller
            control={control}
            name="lotSize"
            render={({ field: { onChange, value } }) => (
              <Input label="Lot Size" placeholder="0.01" keyboardType="numeric" className="w-[48%]" value={value?.toString()} onChangeText={onChange} error={errors.lotSize?.message} />
            )}
          />
          <Controller
            control={control}
            name="riskPercent"
            render={({ field: { onChange, value } }) => (
              <Input label="Risk %" placeholder="1.0" keyboardType="numeric" className="w-[48%]" value={value?.toString()} onChangeText={onChange} error={errors.riskPercent?.message} />
            )}
          />
        </View>

        <Card className="mb-6 border border-border">
          <Text className="text-accent font-bold mb-4 uppercase tracking-widest text-xs">Discipline Checklist</Text>
          {[
            { key: 'htfBias', label: 'HTF Bias Confirmed' },
            { key: 'confirmation', label: 'Confirmation Present' },
            { key: 'riskPlanned', label: 'Risk Planned' },
            { key: 'emotionControlled', label: 'Emotion Controlled' },
          ].map((item) => (
            <View key={item.key} className="flex-row justify-between items-center mb-4">
              <Text className="text-muted font-medium text-sm">{item.label}</Text>
              <Switch 
                value={checklist[item.key as keyof typeof checklist]} 
                onValueChange={() => toggleChecklist(item.key as keyof typeof checklist)}
                trackColor={{ false: isDark ? '#1F1F1F' : '#E4E4E7', true: isDark ? '#FFFFFF' : '#09090B' }}
                thumbColor={checklist[item.key as keyof typeof checklist] ? (isDark ? '#000000' : '#FFFFFF') : (isDark ? '#7E8B9B' : '#71717A')}
              />
            </View>
          ))}
        </Card>

        <Card className="mb-6 border border-border">
          <Text className="text-accent font-bold mb-4 uppercase tracking-widest text-xs">Mistakes (Optional)</Text>
          <View className="flex-row flex-wrap">
            {COMMON_MISTAKES.map((mistake) => (
              <TouchableOpacity
                key={mistake}
                onPress={() => toggleMistake(mistake)}
                className={`px-3 py-2 border rounded-full mr-2 mb-2 ${selectedMistakes.includes(mistake) ? 'bg-accent border-accent' : 'bg-background border-border'}`}
              >
                <Text className={`text-xs ${selectedMistakes.includes(mistake) ? 'text-background font-bold' : 'text-muted'}`}>
                  {mistake}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value } }) => (
            <Input label="Notes" placeholder="Trade rationale..." multiline numberOfLines={4} className="h-32" value={value} onChangeText={onChange} />
          )}
        />

        <Button title="Save Trade" onPress={handleSubmit(onSubmit)} loading={loading} className="mb-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTradeScreen;
