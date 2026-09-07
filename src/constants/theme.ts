/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const AppColors = {
  primary: '#186BFE',
  primaryLight: '#EFF6FF',
  primaryDark: '#1D4ED8',
  background: '#F4F6F9',
  surface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#5B6B82',
  textMuted: '#8C9DAE',
  border: '#E2E8F0',
  borderLight: '#EBF0F5',
  error: '#DC2626',
  errorLight: '#FEF2F2',
  errorBorder: '#FECACA',
  success: '#059669',
  successLight: '#E6F9F0',
  warning: '#D97706',
  warningLight: '#FEF3E2',
  info: '#2563EB',
  infoLight: '#EFF6FF',
  purple: '#7C3AED',
  purpleLight: '#F5F3FF',
} as const;

export const StatusColors: Record<string, { bg: string; text: string; border: string }> = {
  Open: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  Acknowledged: { bg: '#FEF3E2', text: '#D97706', border: '#FDE68A' },
  'In Progress': { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  Completed: { bg: '#E6F9F0', text: '#059669', border: '#A7F3D0' },
  Closed: { bg: '#E6F9F0', text: '#059669', border: '#A7F3D0' },
};

export const PriorityColors: Record<string, { bg: string; text: string; border: string }> = {
  NORMAL: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  HIGH: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
  CRITICAL: { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
};

export const WOTypeColors: Record<string, { bg: string; text: string }> = {
  CM: { bg: '#FFF1F2', text: '#BE123C' },
  PV: { bg: '#F0FDF4', text: '#15803D' },
  PM: { bg: '#EFF6FF', text: '#1D4ED8' },
  IS: { bg: '#FFFBEB', text: '#B45309' },
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const AppShadows = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  primaryGlow: {
    shadowColor: '#186BFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

