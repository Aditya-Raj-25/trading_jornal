import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { AlertTriangle } from 'lucide-react-native';

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupScreen = ({ navigation }: any) => {
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' }
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

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setGlobalError(null);
    try {
      // 1. Check if email exists
      const checkRes = await authService.checkEmail(data.email);
      if (checkRes.data.exists) {
        setGlobalError('An account with this email already exists. Please log in or reset your password.');
        setLoading(false);
        return;
      }

      // 2. Register user
      await register({ username: data.email.split('@')[0], email: data.email, password: data.password });
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
          <Text className="text-accent text-4xl font-bold">Create Account</Text>
          <Text className="text-muted mt-2 text-lg">Start tracking your discipline.</Text>
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

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input 
              label="Confirm Password" 
              placeholder="••••••••" 
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
              secureTextEntry
            />
          )}
        />

        <Button 
          title="Sign Up" 
          onPress={handleSubmit(onSubmit)} 
          loading={loading} 
          disabled={loading}
          className="mt-4 mb-6"
        />

        <View className="flex-row justify-center">
          <Text className="text-muted">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
            <Text className="text-accent font-bold">Log In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
