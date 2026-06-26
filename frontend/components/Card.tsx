import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, className = '', ...props }) => {
  return (
    <View className={`bg-card border border-border rounded-3xl p-6 ${className}`} {...props}>
      {(title || subtitle) && (
        <View className="mb-4">
          {title && <Text className="text-accent text-lg font-bold">{title}</Text>}
          {subtitle && <Text className="text-muted text-sm">{subtitle}</Text>}
        </View>
      )}
      {children}
    </View>
  );
};

export default Card;
