import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { WorkOrder, Severity, WOStatus } from '@/context/WorkOrderContext';
import { useWorkOrders } from '@/context/WorkOrderContext';

// ─── Column widths (in px) ─────────────────────────────────────────
const COL = {
  wo: 74,
  woType: 54,
  woTech: 120,
  ceid: 90,
  customer: 140,
  department: 110,
  reported: 200,
  verified: 200,
  severity: 80,
  status: 108,
  woDate: 110,
  del: 44,
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
  COL.del;

// ─── Severity colour map ───────────────────────────────────────────
const SEV: Record<Severity, { bg: string; text: string }> = {
  NORMAL: { bg: '#E8F5E9', text: '#2E7D32' },
  HIGH: { bg: '#FFF3E0', text: '#E65100' },
  CRITICAL: { bg: '#FEEBEE', text: '#C62828' },
};

// ─── Status colour map ─────────────────────────────────────────────
const STA: Record<WOStatus, { dot: string; text: string }> = {
  Open: { dot: '#F9A825', text: '#F57F17' },
  Acknowledged: { dot: '#1976D2', text: '#1565C0' },
  'In Progress': { dot: '#673AB7', text: '#4527A0' },
  Closed: { dot: '#558B2F', text: '#33691E' },
};

// ─── WO Type colour map ────────────────────────────────────────────
const WOT: Record<string, { bg: string; text: string }> = {
  CM: { bg: '#FCE4EC', text: '#C2185B' },
  PV: { bg: '#E8F5E9', text: '#1B5E20' },
  PM: { bg: '#E3F2FD', text: '#0D47A1' },
  IS: { bg: '#FFF3E0', text: '#BF360C' },
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
      <Cell w={COL.wo} header>WO #</Cell>
      <Cell w={COL.woType} header>Type</Cell>
      <Cell w={COL.woTech} header>WO Tech</Cell>
      <Cell w={COL.ceid} header>CEID</Cell>
      <Cell w={COL.customer} header>Customer</Cell>
      <Cell w={COL.department} header>Department</Cell>
      <Cell w={COL.reported} header>Reported Problem</Cell>
      <Cell w={COL.verified} header>Verified Problem</Cell>
      <Cell w={COL.severity} header center>Severity</Cell>
      <Cell w={COL.status} header center>Status</Cell>
      <Cell w={COL.woDate} header>WO Date</Cell>
      <Cell w={COL.del} header center>{''}</Cell>
    </View>
  );
}

// ─── Single table row ──────────────────────────────────────────────
function TableRow({ workOrder, index }: { workOrder: WorkOrder; index: number }) {
  const router = useRouter();
  const { deleteWorkOrder } = useWorkOrders();
  const sev = SEV[workOrder.severity] ?? SEV.NORMAL;
  const sta = STA[workOrder.status] ?? STA.Open;
  const wot = WOT[workOrder.woType] ?? { bg: '#F5F5F5', text: '#424242' };
  const isEven = index % 2 === 0;

  const handleDelete = () => {
    Alert.alert(
      'Delete Work Order',
      `Remove WO #${workOrder.id} from the list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteWorkOrder(workOrder.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.dataRow, isEven ? styles.rowEven : styles.rowOdd]}>
      {/* WO # — tappable link */}
      <View style={[styles.cell, { width: COL.wo }]}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/workorder/[id]', params: { id: workOrder.id } })}
          accessibilityLabel={`Open WO ${workOrder.id}`}>
          <Text style={styles.woIdText}>{workOrder.id}</Text>
        </TouchableOpacity>
      </View>

      {/* WO Type */}
      <View style={[styles.cell, { width: COL.woType }]}>
        <View style={[styles.typeBadge, { backgroundColor: wot.bg }]}>
          <Text style={[styles.typeBadgeText, { color: wot.text }]}>{workOrder.woType}</Text>
        </View>
      </View>

      {/* WO Tech */}
      <View style={[styles.cell, { width: COL.woTech }]}>
        <Text style={styles.techText} numberOfLines={2}>{workOrder.woTech}</Text>
      </View>

      {/* CEID */}
      <View style={[styles.cell, { width: COL.ceid }]}>
        <Text style={styles.ceidText}>{workOrder.ceid}</Text>
      </View>

      {/* Customer */}
      <View style={[styles.cell, { width: COL.customer }]}>
        <Text style={styles.cellText} numberOfLines={2}>{workOrder.customer}</Text>
      </View>

      {/* Department */}
      <View style={[styles.cell, { width: COL.department }]}>
        <Text style={styles.cellText} numberOfLines={2}>{workOrder.department}</Text>
      </View>

      {/* Reported Problem */}
      <View style={[styles.cell, { width: COL.reported }]}>
        <Text style={styles.problemText} numberOfLines={3}>{workOrder.reportedProblem}</Text>
      </View>

      {/* Verified Problem */}
      <View style={[styles.cell, { width: COL.verified }]}>
        <Text style={styles.verifiedText} numberOfLines={3}>
          {workOrder.verifiedProblem || '—'}
        </Text>
      </View>

      {/* Severity */}
      <View style={[styles.cell, { width: COL.severity, alignItems: 'center' }]}>
        <View style={[styles.sevBadge, { backgroundColor: sev.bg }]}>
          <Text style={[styles.sevText, { color: sev.text }]}>{workOrder.severity}</Text>
        </View>
      </View>

      {/* Status */}
      <View style={[styles.cell, { width: COL.status, alignItems: 'center' }]}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: sta.dot }]} />
          <Text style={[styles.statusText, { color: sta.text }]}>{workOrder.status}</Text>
        </View>
      </View>

      {/* WO Date */}
      <View style={[styles.cell, { width: COL.woDate }]}>
        <Text style={styles.dateText}>{workOrder.woDate}</Text>
      </View>

      {/* Delete */}
      <View style={[styles.cell, { width: COL.del, alignItems: 'center' }]}>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} accessibilityLabel={`Delete WO ${workOrder.id}`}>
          <Ionicons name="trash-outline" size={15} color="#E53935" />
        </TouchableOpacity>
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
      {/* Title bar */}
      <View style={styles.titleBar}>
        <Ionicons name="document-text-outline" size={14} color="#90CAF9" />
        <Text style={styles.titleText}> Work Orders ▼</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.titleHint}>Scroll ↔</Text>
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
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
    marginTop: 4,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1565C0',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  titleText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  titleHint: {
    color: '#90CAF9',
    fontSize: 11,
    fontWeight: '500',
  },
  hScroll: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#1A3A6B',
    borderBottomWidth: 2,
    borderBottomColor: '#1565C0',
  },
  headerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E3F2FD',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F0FB',
  },
  rowEven: {
    backgroundColor: '#FFFFFF',
  },
  rowOdd: {
    backgroundColor: '#F5F8FF',
  },
  cell: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E8EFF9',
  },
  woIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1565C0',
    textDecorationLine: 'underline',
  },
  typeBadge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  techText: {
    fontSize: 11,
    color: '#1A2E4A',
    fontWeight: '600',
    lineHeight: 15,
  },
  ceidText: {
    fontSize: 11,
    color: '#5C7EA8',
    fontWeight: '600',
  },
  cellText: {
    fontSize: 11,
    color: '#1A2E4A',
    lineHeight: 15,
  },
  problemText: {
    fontSize: 11,
    color: '#7B3F3F',
    lineHeight: 15,
  },
  verifiedText: {
    fontSize: 11,
    color: '#2E5C33',
    lineHeight: 15,
  },
  sevBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sevText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 10,
    color: '#5C7EA8',
    fontWeight: '500',
  },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
