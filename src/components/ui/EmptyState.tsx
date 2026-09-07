import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_FAMILY } from '@/constants/Typography';
import { AppColors, BorderRadius } from '@/constants/theme';
import SecondaryButton from './SecondaryButton';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({
  icon = 'document-text-outline',
  title,
  subtitle,
  actionText,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={36} color={AppColors.primary} />
      </View>

      <Text style={styles.title}>{title.toLowerCase()}</Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle.toLowerCase()}</Text>}

      {actionText && onAction && (
        <SecondaryButton
          title={actionText}
          onPress={onAction}
          style={styles.actionBtn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
    marginHorizontal: 16,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: AppColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13,
    color: AppColors.textSecondary,
    textTransform: 'lowercase',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
    maxWidth: 280,
  },
  actionBtn: {
    marginTop: 4,
  },
});
