import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { FONT_FAMILY } from '@/constants/Typography';
import { AppColors, BorderRadius } from '@/constants/theme';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: 'outline' | 'ghost' | 'danger';
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export default function SecondaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  variant = 'outline',
  style,
  textStyle,
  accessibilityLabel,
}: SecondaryButtonProps) {
  const isDisabled = disabled || loading;

  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isDanger && styles.buttonDanger,
        isGhost && styles.buttonGhost,
        isDisabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel || title}
    >
      {loading ? (
        <ActivityIndicator
          color={isDanger ? '#DC2626' : AppColors.primary}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text
            style={[
              styles.text,
              isDanger && styles.textDanger,
              isGhost && styles.textGhost,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonDanger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textDanger: {
    color: '#DC2626',
  },
  textGhost: {
    color: AppColors.primary,
  },
});
