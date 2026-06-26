import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'nativewind';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  onPress, 
  title, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  className = ''
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary': return 'bg-card border border-border';
      case 'outline': return 'bg-transparent border border-accent';
      case 'danger': return 'bg-error';
      default: return 'bg-accent';
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary': return 'text-background';
      case 'danger': return 'text-background';
      case 'secondary': return 'text-accent';
      case 'outline': return 'text-accent';
      default: return 'text-accent';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      className={`h-14 rounded-2xl flex-row items-center justify-center px-6 ${getVariantStyles()} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? (isDark ? 'black' : 'white') : (isDark ? 'white' : 'black')} />
      ) : (
        <Text className={`text-base font-bold ${getTextStyle()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
