import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkOrder, Severity, WOStatus } from '@/context/WorkOrderContext';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
}

const SEVERITY_CONFIG: Record<Severity, { bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }> = {
  NORMAL: { bg: '#E8F5E9', text: '#2E7D32', icon: 'checkmark-circle-outline' },
  HIGH: { bg: '#FFF3E0', text: '#E65100', icon: 'warning-outline' },
  CRITICAL: { bg: '#FEEBEE', text: '#C62828', icon: 'alert-circle' },
};

const STATUS_CONFIG: Record<WOStatus, { bg: string; text: string; dot: string }> = {
  Open: { bg: '#FFF8E1', text: '#F57F17', dot: '#F9A825' },
  Acknowledged: { bg: '#E3F2FD', text: '#1565C0', dot: '#1976D2' },
  'In Progress': { bg: '#EDE7F6', text: '#4527A0', dot: '#673AB7' },
  Closed: { bg: '#F1F8E9', text: '#33691E', dot: '#558B2F' },
};

const WO_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  CM: { bg: '#FCE4EC', text: '#C2185B' },
  PV: { bg: '#E8F5E9', text: '#1B5E20' },
  PM: { bg: '#E3F2FD', text: '#0D47A1' },
  IS: { bg: '#FFF3E0', text: '#BF360C' },
};

export default function WorkOrderCard({ workOrder }: WorkOrderCardProps) {
  const severity = SEVERITY_CONFIG[workOrder.severity] ?? SEVERITY_CONFIG.NORMAL;
  const status = STATUS_CONFIG[workOrder.status] ?? STATUS_CONFIG.Open;
  const woTypeColor = WO_TYPE_COLORS[workOrder.woType] ?? { bg: '#F5F5F5', text: '#424242' };

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.woTypeBadge, { backgroundColor: woTypeColor.bg }]}>
            <Text style={[styles.woTypeText, { color: woTypeColor.text }]}>{workOrder.woType}</Text>
          </View>
          <View>
            <Text style={styles.woId}>WO #{workOrder.id}</Text>
            <Text style={styles.woDate}>{workOrder.woDate}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.severityBadge, { backgroundColor: severity.bg }]}>
            <Ionicons name={severity.icon} size={12} color={severity.text} />
            <Text style={[styles.severityText, { color: severity.text }]}>{workOrder.severity}</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Customer & Department */}
      <View style={styles.row}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Customer</Text>
          <Text style={styles.value} numberOfLines={1}>{workOrder.customer}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Department</Text>
          <Text style={styles.value} numberOfLines={1}>{workOrder.department}</Text>
        </View>
      </View>

      {/* CEID & Tech */}
      <View style={styles.row}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>CEID</Text>
          <Text style={styles.value}>{workOrder.ceid}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>WO Tech</Text>
          <Text style={styles.value} numberOfLines={1}>{workOrder.woTech}</Text>
        </View>
      </View>

      {/* Reported Problem */}
      <View style={styles.problemBlock}>
        <View style={styles.problemRow}>
          <Ionicons name="alert-circle-outline" size={13} color="#E57373" />
          <Text style={styles.problemLabel}>  Reported Problem</Text>
        </View>
        <Text style={styles.problemText} numberOfLines={2}>{workOrder.reportedProblem}</Text>
      </View>

      {/* Verified Problem */}
      {workOrder.verifiedProblem ? (
        <View style={[styles.problemBlock, styles.verifiedBlock]}>
          <View style={styles.problemRow}>
            <Ionicons name="checkmark-done-circle-outline" size={13} color="#4CAF50" />
            <Text style={[styles.problemLabel, { color: '#388E3C' }]}>  Verified Problem</Text>
          </View>
          <Text style={[styles.problemText, { color: '#2E7D32' }]} numberOfLines={2}>
            {workOrder.verifiedProblem}
          </Text>
        </View>
      ) : null}

      {/* Card Footer */}
      <View style={styles.cardFooter}>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
          <Text style={[styles.statusText, { color: status.text }]}>{workOrder.status}</Text>
        </View>

        <View style={styles.modalityChip}>
          <Ionicons name="hardware-chip-outline" size={11} color="#5C7EA8" />
          <Text style={styles.modalityText}>  {workOrder.modality}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  woTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  woTypeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  woId: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A2E4A',
  },
  woDate: {
    fontSize: 11,
    color: '#8FA8C4',
    marginTop: 1,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 3,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#EEF4FC',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 12,
  },
  infoBlock: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#8FA8C4',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    color: '#1A2E4A',
    fontWeight: '600',
  },
  problemBlock: {
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  verifiedBlock: {
    backgroundColor: '#F1FBF2',
  },
  problemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  problemLabel: {
    fontSize: 10,
    color: '#E57373',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  problemText: {
    fontSize: 12,
    color: '#5A2B2B',
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  modalityText: {
    fontSize: 11,
    color: '#5C7EA8',
    fontWeight: '600',
  },
});
