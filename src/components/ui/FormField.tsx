import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_FAMILY } from '@/constants/Typography';
import { AppColors, BorderRadius } from '@/constants/theme';

interface FormFieldProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  leadingIcon?: keyof typeof Ionicons.glyphMap;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  onTrailingIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export default function FormField({
  label,
  required = false,
  error,
  leadingIcon,
  trailingIcon,
  onTrailingIconPress,
  containerStyle,
  multiline,
  style,
  onFocus,
  onBlur,
  ...inputProps
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label.toLowerCase()}
          {required && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          multiline && styles.multilineContainer,
          isFocused && styles.inputFocused,
          Boolean(error) && styles.inputError,
        ]}
      >
        {leadingIcon && (
          <Ionicons
            name={leadingIcon}
            size={19}
            color={isFocused ? AppColors.primary : AppColors.textMuted}
            style={styles.leadingIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            style,
          ]}
          placeholderTextColor={AppColors.textMuted}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          multiline={multiline}
          {...inputProps}
        />

        {trailingIcon && (
          <TouchableOpacity
            onPress={onTrailingIconPress}
            disabled={!onTrailingIconPress}
            style={styles.trailingIconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name={trailingIcon} size={19} color={AppColors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {Boolean(error) && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={AppColors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13.5,
    fontWeight: '600',
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
    marginBottom: 6,
  },
  asterisk: {
    color: '#DC2626',
    fontWeight: '700',
  },
  inputContainer: {
    minHeight: 50,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  multilineContainer: {
    minHeight: 88,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputFocused: {
    borderColor: AppColors.primary,
  },
  inputError: {
    borderColor: AppColors.error,
  },
  leadingIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14.5,
    color: AppColors.textPrimary,
    paddingVertical: 0,
    outlineStyle: 'none' as any,
  },
  multilineInput: {
    textAlignVertical: 'top',
    height: 64,
  },
  trailingIconBtn: {
    padding: 4,
    marginLeft: 6,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    color: AppColors.error,
    textTransform: 'lowercase',
  },
});
