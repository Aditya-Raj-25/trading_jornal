import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { AlertTriangle, CheckCircle } from 'lucide-react-native';

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const successFadeAnim = useRef(new Animated.Value(0)).current;

  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '', newPassword: '', confirmPassword: '' }
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

  useEffect(() => {
    if (successMsg) {
      Animated.timing(successFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(successFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [successMsg]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    setGlobalError(null);
    setSuccessMsg(null);
    try {
      const res = await authService.resetPassword({ email: data.email, newPassword: data.newPassword });
      setSuccessMsg(res.data.message || 'Password updated successfully. Please login with your new password.');
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
          <Text className="text-accent text-4xl font-bold">Reset Password</Text>
          <Text className="text-muted mt-2 text-lg">Create a new password for your account.</Text>
        </View>

        {globalError && (
          <Animated.View style={{ opacity: fadeAnim }} className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-4 mb-6 flex-row items-center">
            <AlertTriangle color="#FFFFFF" size={20} />
            <Text className="text-accent ml-3 flex-1">{globalError}</Text>
          </Animated.View>
        )}

        {successMsg && (
          <Animated.View style={{ opacity: successFadeAnim }} className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-4 mb-6 flex-row items-center">
            <CheckCircle color="#FFFFFF" size={20} />
            <Text className="text-accent ml-3 flex-1">{successMsg}</Text>
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
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input 
              label="New Password" 
              placeholder="••••••••" 
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.newPassword?.message}
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
          title="Update Password" 
          onPress={handleSubmit(onSubmit)} 
          loading={loading} 
          disabled={loading || !!successMsg}
          className="mt-4 mb-6"
        />

        {successMsg && (
          <Button 
            title="Go to Login" 
            onPress={() => navigation.navigate('Login')} 
            variant="outline"
            className="mb-6"
          />
        )}

        {!successMsg && (
          <View className="flex-row justify-center mt-4">
            <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
              <Text className="text-muted font-bold">Back to Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
