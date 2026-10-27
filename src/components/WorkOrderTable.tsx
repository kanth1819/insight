import { Severity, useWorkOrders, WorkOrder, WOStatus } from '@/context/WorkOrderContext';
import { useAuth } from '@/context/AuthContext';
import { FONT_FAMILY } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Column widths (in px) ─────────────────────────────────────────
const COL = {
  wo: 95,
  woType: 70,
  woTech: 135,
  ceid: 100,
  customer: 160,
  department: 125,
  reported: 240,
  verified: 220,
  severity: 100,
  status: 125,
  woDate: 110,
  actions: 90,
};

const TOTAL_W =
  COL.wo +
  COL.woType +
  COL.woTech +
  COL.ceid +
  COL.customer +
  COL.department +
  COL.reported +
  COL.verified +
  COL.severity +
  COL.status +
  COL.woDate +
  COL.actions;

// ─── Severity colour map ───────────────────────────────────────────
const SEV: Record<Severity, { bg: string; text: string; border: string }> = {
  NORMAL: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
  HIGH:   { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  CRITICAL: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
};

// ─── Status colour map ─────────────────────────────────────────────
const STA: Record<WOStatus, { bg: string; dot: string; text: string; border: string }> = {
  Open:         { bg: '#FFFBEB', dot: '#D97706', text: '#92400E', border: '#FDE68A' },
  Acknowledged: { bg: '#EFF6FF', dot: '#2563EB', text: '#1E40AF', border: '#BFDBFE' },
  'In Progress':{ bg: '#F5F3FF', dot: '#7C3AED', text: '#5B21B6', border: '#DDD6FE' },
  Closed:       { bg: '#ECFDF5', dot: '#10B981', text: '#065F46', border: '#A7F3D0' },
  Completed:    { bg: '#ECFDF5', dot: '#10B981', text: '#065F46', border: '#A7F3D0' },
};

// ─── WO Type colour map ────────────────────────────────────────────
const WOT: Record<string, { bg: string; text: string }> = {
  CM: { bg: '#FFF1F2', text: '#BE123C' },
  PV: { bg: '#F0FDF4', text: '#15803D' },
  PM: { bg: '#EFF6FF', text: '#1D4ED8' },
  IS: { bg: '#FFFBEB', text: '#B45309' },
};

// ─── Generic Cell ──────────────────────────────────────────────────
function Cell({
  children,
  w,
  header = false,
  center = false,
}: {
  children: React.ReactNode;
  w: number;
  header?: boolean;
  center?: boolean;
}) {
  return (
    <View style={[styles.cell, { width: w }, center && { alignItems: 'center' }]}>
      {header ? <Text style={styles.headerText}>{children as string}</Text> : children}
    </View>
  );
}

// ─── Table Header ──────────────────────────────────────────────────
function TableHeader() {
  return (
    <View style={styles.headerRow}>
      <Cell w={COL.wo} header>WO NUMBER</Cell>
      <Cell w={COL.woType} header>TYPE</Cell>
      <Cell w={COL.status} header center>STATUS</Cell>
      <Cell w={COL.severity} header center>SEVERITY</Cell>
      <Cell w={COL.woTech} header>ASSIGNED TECH</Cell>
      <Cell w={COL.ceid} header>CEID</Cell>
      <Cell w={COL.customer} header>CUSTOMER / SITE</Cell>
      <Cell w={COL.department} header>DEPARTMENT</Cell>
      <Cell w={COL.reported} header>REPORTED ISSUE</Cell>
      <Cell w={COL.verified} header>VERIFIED DIAGNOSTICS</Cell>
      <Cell w={COL.woDate} header>CREATED DATE</Cell>
      <Cell w={COL.actions} header center>ACTIONS</Cell>
    </View>
  );
}

// ─── Single table row ──────────────────────────────────────────────
function TableRow({ workOrder, index }: { workOrder: WorkOrder; index: number }) {
  const router = useRouter();
  const { deleteWorkOrder } = useWorkOrders();
  const { canDeleteWorkOrder } = useAuth();
  const sev = SEV[workOrder.severity] ?? SEV.NORMAL;
  const sta = STA[workOrder.status] ?? STA.Open;
  const wot = WOT[workOrder.woType] ?? { bg: '#F1F5F9', text: '#334155' };
  const isEven = index % 2 === 0;

  const handleDelete = () => {
    Alert.alert(
      'delete work order',
      `are you sure you want to permanently remove wo #${workOrder.id}?`,
      [
        { text: 'cancel', style: 'cancel' },
        {
          text: 'delete',
          style: 'destructive',
          onPress: () => deleteWorkOrder(workOrder.id),
        },
      ]
    );
  };

  const handleOpenDetail = () => {
    router.push({ pathname: '/workorder/[id]', params: { id: workOrder.id } });
  };

  return (
    <View style={[styles.dataRow, isEven ? styles.rowEven : styles.rowOdd]}>
      {/* WO # — tappable pill badge */}
      <View style={[styles.cell, { width: COL.wo }]}>
        <TouchableOpacity
          onPress={handleOpenDetail}
          style={styles.woIdBtn}
          accessibilityLabel={`open wo ${workOrder.id}`}
        >
          <Text style={styles.woIdText}>#{workOrder.id}</Text>
        </TouchableOpacity>
      </View>

      {/* WO Type */}
      <View style={[styles.cell, { width: COL.woType }]}>
        <View style={[styles.typeBadge, { backgroundColor: wot.bg }]}>
          <Text style={[styles.typeBadgeText, { color: wot.text }]}>{workOrder.woType}</Text>
        </View>
      </View>

      {/* Status */}
      <View style={[styles.cell, { width: COL.status, alignItems: 'center' }]}>
        <View style={[styles.statusPill, { backgroundColor: sta.bg, borderColor: sta.border }]}>
          <View style={[styles.statusDot, { backgroundColor: sta.dot }]} />
          <Text style={[styles.statusText, { color: sta.text }]}>{workOrder.status.toUpperCase()}</Text>
        </View>
      </View>

      {/* Severity */}
      <View style={[styles.cell, { width: COL.severity, alignItems: 'center' }]}>
        <View style={[styles.sevBadge, { backgroundColor: sev.bg, borderColor: sev.border }]}>
          <Text style={[styles.sevText, { color: sev.text }]}>{workOrder.severity}</Text>
        </View>
      </View>

      {/* WO Tech */}
      <View style={[styles.cell, { width: COL.woTech }]}>
        <View style={styles.techRow}>
          <View style={styles.techAvatar}>
            <Text style={styles.techAvatarText}>
              {workOrder.woTech ? workOrder.woTech.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.techText} numberOfLines={1}>{workOrder.woTech?.toLowerCase() || 'unassigned'}</Text>
        </View>
      </View>

      {/* CEID */}
      <View style={[styles.cell, { width: COL.ceid }]}>
        <View style={styles.ceidBadge}>
          <Text style={styles.ceidText}>{workOrder.ceid}</Text>
        </View>
      </View>

      {/* Customer */}
      <View style={[styles.cell, { width: COL.customer }]}>
        <Text style={styles.customerText} numberOfLines={2}>{workOrder.customer.toLowerCase()}</Text>
      </View>

      {/* Department */}
      <View style={[styles.cell, { width: COL.department }]}>
        <Text style={styles.deptText} numberOfLines={1}>{workOrder.department.toLowerCase()}</Text>
      </View>

      {/* Reported Problem */}
      <View style={[styles.cell, { width: COL.reported }]}>
        <Text style={styles.problemText} numberOfLines={2}>{workOrder.reportedProblem.toLowerCase()}</Text>
      </View>

      {/* Verified Problem */}
      <View style={[styles.cell, { width: COL.verified }]}>
        <Text style={styles.verifiedText} numberOfLines={2}>
          {workOrder.verifiedProblem?.toLowerCase() || '—'}
        </Text>
      </View>

      {/* WO Date */}
      <View style={[styles.cell, { width: COL.woDate }]}>
        <Text style={styles.dateText}>{workOrder.woDate}</Text>
      </View>

      {/* Actions (View + Delete) */}
      <View style={[styles.cell, { width: COL.actions, alignItems: 'center' }]}>
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            onPress={handleOpenDetail}
            style={styles.viewBtn}
            accessibilityLabel={`view wo ${workOrder.id}`}
          >
            <Ionicons name="open-outline" size={15} color="#1E3A5F" />
          </TouchableOpacity>
          {canDeleteWorkOrder && (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deleteBtn}
              accessibilityLabel={`delete wo ${workOrder.id}`}
            >
              <Ionicons name="trash-outline" size={14} color="#DC2626" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

// ─── Main exported component ───────────────────────────────────────
interface WorkOrderTableProps {
  workOrders: WorkOrder[];
  emptyComponent?: React.ReactElement;
}

export default function WorkOrderTable({ workOrders, emptyComponent }: WorkOrderTableProps) {
  if (workOrders.length === 0 && emptyComponent) {
    return emptyComponent;
  }

  return (
    <View style={styles.wrapper}>
      {/* Table Top Bar */}
      <View style={styles.tableTopBar}>
        <View style={styles.tableTitleGroup}>
          <Ionicons name="layers-outline" size={15} color="#1E3A5F" />
          {/* Heading: Muli Bold lowercase */}
          <Text style={styles.tableTopTitle}>work orders master table</Text>
          <View style={styles.activePill}>
            <Text style={styles.activePillText}>{workOrders.length} active</Text>
          </View>
        </View>
        <View style={styles.scrollHintWrap}>
          <Ionicons name="swap-horizontal" size={12} color="#64748B" />
          <Text style={styles.scrollHintText}>horizontal scroll available</Text>
        </View>
      </View>

      {/* Horizontally scrollable table */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        nestedScrollEnabled
        style={styles.hScroll}
        contentContainerStyle={{ width: TOTAL_W }}
      >
        <View style={{ width: TOTAL_W }}>
          <TableHeader />
          {workOrders.map((item, index) => (
            <TableRow key={item.id} workOrder={item} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  tableTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // Heading: Muli Bold lowercase
  tableTopTitle: {
    fontFamily: FONT_FAMILY.bold,
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'lowercase',
    letterSpacing: 0.2,
  },
  activePill: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activePillText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    textTransform: 'lowercase',
  },
  scrollHintWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scrollHintText: {
    fontFamily: FONT_FAMILY.regular,
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'lowercase',
  },
  hScroll: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1.5,
    borderBottomColor: '#CBD5E1',
  },
  // Subheading: MULI BOLD CAPS
  headerText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowEven: {
    backgroundColor: '#FFFFFF',
  },
  rowOdd: {
    backgroundColor: '#FAFCFE',
  },
  cell: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  woIdBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignSelf: 'flex-start',
  },
  woIdText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  typeBadge: {
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  typeBadgeText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 10.5,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  sevBadge: {
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
  },
  sevText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  techAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  techAvatarText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 10,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  // Content: Muli Regular lowercase
  techText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '500',
    textTransform: 'lowercase',
    flex: 1,
  },
  ceidBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  ceidText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '700',
  },
  customerText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '600',
    textTransform: 'lowercase',
    lineHeight: 16,
  },
  deptText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
    textTransform: 'lowercase',
  },
  problemText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
    textTransform: 'lowercase',
  },
  verifiedText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
    textTransform: 'lowercase',
  },
  dateText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
});
