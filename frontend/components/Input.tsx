import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { useColorScheme } from 'nativewind';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className={`mb-4 ${className}`}>
      {label && <Text className="text-muted text-xs font-medium mb-2 uppercase tracking-widest">{label}</Text>}
      <View className={`bg-card border ${error ? 'border-error' : 'border-border'} rounded-2xl px-4 h-14 justify-center`}>
        <TextInput
          placeholderTextColor={isDark ? '#666666' : '#A1A1AA'}
          className="text-accent text-base"
          {...props}
        />
      </View>
      {error && <Text className="text-error text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );
};

export default Input;
