import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Animated,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useWorkOrders, WorkOrder } from '@/context/WorkOrderContext';
import DrawerMenu from '@/components/DrawerMenu';
import WorkOrderCard from '@/components/WorkOrderCard';

export default function DashboardScreen() {
  const router = useRouter();
  const { workOrders } = useWorkOrders();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const headerScrollY = useRef(new Animated.Value(0)).current;

  const filteredOrders = workOrders.filter((wo) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      wo.id.includes(q) ||
      wo.customer.toLowerCase().includes(q) ||
      wo.ceid.toLowerCase().includes(q) ||
      wo.woTech.toLowerCase().includes(q) ||
      wo.department.toLowerCase().includes(q) ||
      wo.reportedProblem.toLowerCase().includes(q);
    const matchesSeverity = !filterSeverity || wo.severity === filterSeverity;
    const matchesStatus = !filterStatus || wo.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const stats = {
    total: workOrders.length,
    open: workOrders.filter((w) => w.status === 'Open').length,
    high: workOrders.filter((w) => w.severity === 'HIGH' || w.severity === 'CRITICAL').length,
    acknowledged: workOrders.filter((w) => w.status === 'Acknowledged').length,
  };

  const renderItem = useCallback(
    ({ item }: { item: WorkOrder }) => <WorkOrderCard workOrder={item} />,
    []
  );

  const keyExtractor = useCallback((item: WorkOrder) => item.id, []);

  const ListHeader = (
    <View>
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatCard label="Total WOs" value={stats.total} icon="clipboard-outline" color="#1976D2" bg="#EBF4FF" />
        <StatCard label="Open" value={stats.open} icon="radio-button-on-outline" color="#F57F17" bg="#FFF8E1" />
        <StatCard label="High / Critical" value={stats.high} icon="warning-outline" color="#C62828" bg="#FEEBEE" />
        <StatCard label="Acknowledged" value={stats.acknowledged} icon="checkmark-done-outline" color="#2E7D32" bg="#E8F5E9" />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={17} color="#8FA8C4" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by WO ID, customer, CEID…"
          placeholderTextColor="#A8BDD4"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={17} color="#8FA8C4" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Severity:</Text>
        {(['NORMAL', 'HIGH', 'CRITICAL'] as const).map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, filterSeverity === s && styles.chipActive]}
            onPress={() => setFilterSeverity(filterSeverity === s ? null : s)}
          >
            <Text style={[styles.chipText, filterSeverity === s && styles.chipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.filterRow, { marginTop: 0, marginBottom: 4 }]}>
        <Text style={styles.filterLabel}>Status:   </Text>
        {(['Open', 'Acknowledged', 'In Progress', 'Closed'] as const).map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, filterStatus === s && styles.chipActive]}
            onPress={() => setFilterStatus(filterStatus === s ? null : s)}
          >
            <Text style={[styles.chipText, filterStatus === s && styles.chipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Work Orders{' '}
          <Text style={styles.sectionCount}>({filteredOrders.length})</Text>
        </Text>
        <View style={styles.sortChip}>
          <Ionicons name="swap-vertical-outline" size={13} color="#5C7EA8" />
          <Text style={styles.sortText}>Newest First</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1565C0" />

      {/* Top Header */}
      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setDrawerOpen(true)}
            style={styles.headerBtn}
            accessibilityLabel="Open menu"
          >
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerBrand}>MEDVICE</Text>
            <Text style={styles.headerSub}>SOLUTIONS</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => router.push('/assign')}
              style={[styles.headerBtn, styles.headerBtnPrimary]}
              accessibilityLabel="Create Work Order"
            >
              <Ionicons name="headset-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} accessibilityLabel="Menu grid">
              <Ionicons name="apps-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} accessibilityLabel="Profile">
              <Ionicons name="person" size={16} color="#1976D2" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Blue band subtitle */}
        <View style={styles.subBand}>
          <Ionicons name="pulse-outline" size={13} color="#90CAF9" />
          <Text style={styles.subBandText}> Work Orders Dashboard</Text>
          <View style={{ flex: 1 }} />
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Work Order List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={60} color="#BBDEFB" />
            <Text style={styles.emptyTitle}>No Work Orders Found</Text>
            <Text style={styles.emptySubtitle}>
              Adjust your filters or create a new work order.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: headerScrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />

      {/* FAB: Create WO */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/assign')}
        accessibilityLabel="Create new work order"
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Drawer */}
      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeItem="dashboard"
      />
    </View>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <View style={[styles.statIconWrap, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  safeHeader: {
    backgroundColor: '#1565C0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1565C0',
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtnPrimary: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerBrand: {
    fontSize: 17,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 3,
  },
  headerSub: {
    fontSize: 8,
    color: '#90CAF9',
    letterSpacing: 4,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    borderWidth: 2,
    borderColor: '#90CAF9',
  },
  subBand: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#1565C0',
  },
  subBandText: {
    fontSize: 12,
    color: '#90CAF9',
    fontWeight: '600',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#69F0AE',
  },
  liveText: {
    fontSize: 10,
    color: '#69F0AE',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 100,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 9,
    color: '#7A90A8',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A2E4A',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  filterLabel: {
    fontSize: 11,
    color: '#8FA8C4',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0E4F7',
  },
  chipActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  chipText: {
    fontSize: 11,
    color: '#5C7EA8',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A2E4A',
    flex: 1,
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C7EA8',
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  sortText: {
    fontSize: 11,
    color: '#5C7EA8',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2E4A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8FA8C4',
    textAlign: 'center',
    lineHeight: 19,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
});