import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { FONT_FAMILY } from '@/constants/Typography';
import { StatusColors, PriorityColors, WOTypeColors } from '@/constants/theme';

interface StatusBadgeProps {
  status?: string;
  severity?: string;
  woType?: string;
  showDot?: boolean;
  style?: ViewStyle;
}

export default function StatusBadge({
  status,
  severity,
  woType,
  showDot = false,
  style,
}: StatusBadgeProps) {
  if (severity) {
    const sevStyle = PriorityColors[severity] ?? PriorityColors.NORMAL;
    return (
      <View style={[styles.badge, { backgroundColor: sevStyle.bg, borderColor: sevStyle.border }, style]}>
        <Text style={[styles.badgeText, { color: sevStyle.text }]}>{severity.toUpperCase()}</Text>
      </View>
    );
  }

  if (woType) {
    const typeStyle = WOTypeColors[woType] ?? { bg: '#F1F5F9', text: '#334155' };
    return (
      <View style={[styles.badge, { backgroundColor: typeStyle.bg }, style]}>
        <Text style={[styles.badgeText, { color: typeStyle.text }]}>{woType.toUpperCase()}</Text>
      </View>
    );
  }

  const s = status ?? 'Open';
  const statusStyle = StatusColors[s] ?? StatusColors.Open;

  return (
    <View style={[styles.badge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }, style]}>
      {showDot && <View style={[styles.dot, { backgroundColor: statusStyle.text }]} />}
      <Text style={[styles.badgeText, { color: statusStyle.text }]}>{s.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
