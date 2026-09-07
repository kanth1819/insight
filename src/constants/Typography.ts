import { Platform, TextStyle } from 'react-native';

export const FONT_FAMILY = {
  regular: Platform.select({
    web: "'Mulish', 'Muli', -apple-system, BlinkMacSystemFont, sans-serif",
    default: 'Mulish_400Regular',
  }),
  semiBold: Platform.select({
    web: "'Mulish', 'Muli', -apple-system, BlinkMacSystemFont, sans-serif",
    default: 'Mulish_600SemiBold',
  }),
  bold: Platform.select({
    web: "'Mulish', 'Muli', -apple-system, BlinkMacSystemFont, sans-serif",
    default: 'Mulish_700Bold',
  }),
  extraBold: Platform.select({
    web: "'Mulish', 'Muli', -apple-system, BlinkMacSystemFont, sans-serif",
    default: 'Mulish_800ExtraBold',
  }),
};

/**
 * Standard Project Typography Styles:
 * - Heading: Muli Bold (bold), lowercase
 * - Subheading: Muli Bold (bold), CAPS
 * - Content: Muli Regular (regular), lowercase
 */
export const Typography: Record<string, TextStyle> = {
  // Heading: Muli Bold (bold) lowercase
  headingLarge: {
    fontFamily: FONT_FAMILY.bold,
    fontWeight: '800',
    textTransform: 'lowercase',
    letterSpacing: -0.3,
  },
  headingMedium: {
    fontFamily: FONT_FAMILY.bold,
    fontWeight: '700',
    textTransform: 'lowercase',
    letterSpacing: -0.2,
  },
  headingSmall: {
    fontFamily: FONT_FAMILY.bold,
    fontWeight: '700',
    textTransform: 'lowercase',
  },

  // Subheading: MULI BOLD CAPS
  subheading: {
    fontFamily: FONT_FAMILY.bold,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subheadingSmall: {
    fontFamily: FONT_FAMILY.bold,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // Content: Muli Regular lowercase
  content: {
    fontFamily: FONT_FAMILY.regular,
    fontWeight: '400',
    textTransform: 'lowercase',
  },
  contentMedium: {
    fontFamily: FONT_FAMILY.regular,
    fontWeight: '500',
    textTransform: 'lowercase',
  },
  contentLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontWeight: '500',
    textTransform: 'lowercase',
  },
};
