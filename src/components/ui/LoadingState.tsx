import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { FONT_FAMILY } from '@/constants/Typography';
import { AppColors } from '@/constants/theme';

interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export default function LoadingState({
  message = 'loading...',
  style,
}: LoadingStateProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={AppColors.primary} />
      <Text style={styles.message}>{message.toLowerCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  message: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13.5,
    color: AppColors.textSecondary,
    textTransform: 'lowercase',
  },
});
