import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_FAMILY } from '@/constants/Typography';
import { AppColors, BorderRadius, AppShadows } from '@/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function SectionCard({
  title,
  subtitle,
  collapsible = false,
  defaultExpanded = true,
  rightAction,
  children,
  style,
}: SectionCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    if (!collapsible) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <View style={[styles.card, style]}>
      {title && (
        <TouchableOpacity
          style={styles.headerRow}
          onPress={toggleExpand}
          disabled={!collapsible}
          activeOpacity={collapsible ? 0.7 : 1}
        >
          <View style={styles.titleGroup}>
            <Text style={styles.title}>{title.toLowerCase()}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle.toLowerCase()}</Text>}
          </View>

          <View style={styles.headerRight}>
            {rightAction}
            {collapsible && (
              <Ionicons
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={AppColors.textSecondary}
                style={styles.chevron}
              />
            )}
          </View>
        </TouchableOpacity>
      )}

      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    ...AppShadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  titleGroup: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 16.5,
    fontWeight: '800',
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12.5,
    color: AppColors.textSecondary,
    marginTop: 2,
    textTransform: 'lowercase',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: 8,
  },
  content: {
    marginTop: 12,
  },
});
