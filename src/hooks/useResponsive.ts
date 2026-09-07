import { useWindowDimensions, Platform } from 'react-native';

/**
 * Responsive breakpoints and layout values for Web and Mobile.
 * - Mobile        : < 768px  → Full-width stacked layout
 * - Tablet        : 768–1023px → Semi-expanded layout
 * - Desktop       : 1024–1439px → Enterprise multi-column layout
 * - Large Desktop : ≥ 1440px → Wide enterprise dashboard
 */
export function useResponsive() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isLargeDesktop = width >= 1440;

  // Maximum container width for desktop web layouts
  const contentMaxWidth = isLargeDesktop ? 1440 : isDesktop ? 1200 : isTablet ? 880 : undefined;

  // Horizontal screen-level padding
  const screenPadding = isLargeDesktop ? 48 : isDesktop ? 36 : isTablet ? 24 : 16;

  // Inner card / section padding
  const cardPadding = isDesktop ? 28 : isTablet ? 24 : 16;

  return {
    isWeb,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    width,
    contentMaxWidth,
    screenPadding,
    cardPadding,
  };
}
