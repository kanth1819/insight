import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { WorkOrder } from '@/context/WorkOrderContext';
import { FONT_FAMILY } from '@/constants/Typography';
import { AppColors, AppShadows, BorderRadius } from '@/constants/theme';
import StatusBadge from '@/components/ui/StatusBadge';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
}

export default function WorkOrderCard({ workOrder }: WorkOrderCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({ pathname: '/workorder/[id]', params: { id: workOrder.id } });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.78}
      accessibilityLabel={`open work order ${workOrder.id}`}
    >
      {/* Top Header Row: WO # and Subheading Status Pill */}
      <View style={styles.headerRow}>
        <View style={styles.idGroup}>
          <Text style={styles.woId}>#{workOrder.id}</Text>
          <StatusBadge woType={workOrder.woType} style={styles.typeBadge} />
        </View>
        <StatusBadge status={workOrder.status} showDot />
      </View>

      {/* Heading: Muli Bold lowercase */}
      <Text style={styles.problemTitle} numberOfLines={2}>
        {workOrder.reportedProblem}
      </Text>

      {/* Content: Muli Regular lowercase */}
      <View style={styles.locationRow}>
        <Ionicons name="business-outline" size={14} color={AppColors.textMuted} style={styles.locationIcon} />
        <Text style={styles.locationText} numberOfLines={1}>
          {workOrder.customer} • {workOrder.department}
        </Text>
      </View>

      {/* Subtle Divider Line */}
      <View style={styles.divider} />

      {/* Subheading Metadata (CAPS) + Content Values */}
      <View style={styles.metaRow}>
        <View style={styles.metaItemLeft}>
          <Text style={styles.metaLabel}>TECH: </Text>
          <Text style={styles.metaValue} numberOfLines={1}>
            {workOrder.woTech || 'unassigned'}
          </Text>
        </View>
        <View style={styles.metaItemRight}>
          <Text style={styles.metaLabel}>SEVERITY: </Text>
          <StatusBadge severity={workOrder.severity} />
        </View>
      </View>

      {/* Timestamp - Content: Muli Regular lowercase */}
      <Text style={styles.timestampText}>{workOrder.woDate}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    ...AppShadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  idGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  woId: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  typeBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  // Heading: Muli Bold lowercase
  problemTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 14.5,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
    marginTop: 4,
    marginBottom: 6,
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationIcon: {
    marginRight: 6,
  },
  // Content: Muli Regular lowercase
  locationText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12.5,
    fontWeight: '500',
    color: AppColors.textSecondary,
    textTransform: 'lowercase',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F4F8',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  metaItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // Subheading: MULI BOLD CAPS
  metaLabel: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 10.5,
    fontWeight: '800',
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  // Content: Muli Regular lowercase
  metaValue: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    textTransform: 'lowercase',
  },
  timestampText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 11,
    fontWeight: '400',
    color: AppColors.textMuted,
    textAlign: 'right',
    marginTop: 6,
  },
});

