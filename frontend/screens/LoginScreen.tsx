import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/useAuthStore';
import Input from '../components/Input';
import Button from '../components/Button';
import { AlertTriangle } from 'lucide-react-native';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  useEffect(() => {
    if (globalError) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [globalError]);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setGlobalError(null);
    try {
      await login(data);
    } catch (error: any) {
      setGlobalError(error.response?.data?.message || error.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-8 justify-center"
      >
        <View className="mb-12">
          <Text className="text-accent text-4xl font-bold">Welcome Back</Text>
          <Text className="text-muted mt-2 text-lg">Log in to your trading journal.</Text>
        </View>

        {globalError && (
          <Animated.View style={{ opacity: fadeAnim }} className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-4 mb-6 flex-row items-center">
            <AlertTriangle color="#FFFFFF" size={20} />
            <Text className="text-accent ml-3 flex-1">{globalError}</Text>
          </Animated.View>
        )}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input 
              label="Email Address" 
              placeholder="name@example.com" 
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input 
              label="Password" 
              placeholder="••••••••" 
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              secureTextEntry
            />
          )}
        />

        <TouchableOpacity className="self-end mb-8" onPress={() => navigation.navigate('ForgotPassword')}>
          <Text className="text-muted text-sm font-medium">Forgot Password?</Text>
        </TouchableOpacity>

        <Button 
          title="Sign In" 
          onPress={handleSubmit(onSubmit)} 
          loading={loading} 
          disabled={loading}
          className="mb-6"
        />

        <View className="flex-row justify-center">
          <Text className="text-muted">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')} disabled={loading}>
            <Text className="text-accent font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
