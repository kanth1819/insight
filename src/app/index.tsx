import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useWorkOrders } from '@/context/WorkOrderContext';
import { useAuth } from '@/context/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { FONT_FAMILY } from '@/constants/Typography';
import { AppColors, AppShadows, BorderRadius } from '@/constants/theme';
import { AppHeader, EmptyState } from '@/components/ui';
import DrawerMenu from '@/components/DrawerMenu';
import WorkOrderCard from '@/components/WorkOrderCard';
import WorkOrderTable from '@/components/WorkOrderTable';

type FilterTab = 'ALL' | 'OPEN' | 'ACKNOWLEDGED' | 'COMPLETED';

export default function DashboardScreen() {
  const router = useRouter();
  const { workOrders } = useWorkOrders();
  const { isLoggedIn, currentUserId, logout } = useAuth();
  const { isDesktop, contentMaxWidth } = useResponsive();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  if (!isLoggedIn) return null;

  const filteredOrders = workOrders.filter((wo) => {
    // Status Filter
    if (activeTab === 'COMPLETED') {
      if (wo.status !== 'Completed' && wo.status !== 'Closed') return false;
    } else if (activeTab === 'OPEN') {
      if (wo.status !== 'Open') return false;
    } else if (activeTab === 'ACKNOWLEDGED') {
      if (wo.status !== 'Acknowledged') return false;
    }

    // Search Filter
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      wo.id.toLowerCase().includes(q) ||
      wo.customer.toLowerCase().includes(q) ||
      wo.department.toLowerCase().includes(q) ||
      wo.reportedProblem.toLowerCase().includes(q) ||
      wo.woTech.toLowerCase().includes(q) ||
      wo.woType.toLowerCase().includes(q) ||
      wo.severity.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header with Reusable AppHeader */}
      <AppHeader
        showLogo
        leftType="menu"
        isMenuOpen={drawerOpen}
        onLeftPress={() => setDrawerOpen((prev) => !prev)}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/assign')}
            style={styles.plusBtn}
            accessibilityLabel="create work order"
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      {/* Main Content Area */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          contentMaxWidth ? { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' } : {},
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={styles.searchBarWrap}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search-outline"
              size={19}
              color={AppColors.textMuted}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="search work orders..."
              placeholderTextColor={AppColors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={18} color={AppColors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Chips Bar */}
        <View style={styles.filterPillsWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsScroll}
          >
            {(['ALL', 'OPEN', 'ACKNOWLEDGED', 'COMPLETED'] as FilterTab[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      isActive && styles.filterPillTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Work Orders List */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            title="no work orders found"
            subtitle={
              searchQuery
                ? `no results matching "${searchQuery}".`
                : `there are currently no "${activeTab.toLowerCase()}" work orders.`
            }
            actionText={
              searchQuery !== '' || activeTab !== 'ALL'
                ? 'SHOW ALL WORK ORDERS'
                : undefined
            }
            onAction={() => {
              setSearchQuery('');
              setActiveTab('ALL');
            }}
          />
        ) : isDesktop ? (
          <WorkOrderTable workOrders={filteredOrders} />
        ) : (
          <View style={styles.cardList}>
            {filteredOrders.map((order) => (
              <WorkOrderCard key={order.id} workOrder={order} />
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Side Navigation Drawer Menu */}
      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeItem="dashboard"
        onLogout={() => {
          logout();
          router.replace('/login' as any);
        }}
        currentUserId={currentUserId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  plusBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...AppShadows.primaryGlow,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  searchBarWrap: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xxl,
    borderWidth: 1.2,
    borderColor: AppColors.border,
    height: 48,
    paddingHorizontal: 16,
    ...AppShadows.subtle,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14.5,
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
    outlineStyle: 'none' as any,
  },
  clearSearchBtn: {
    padding: 4,
  },
  filterPillsWrap: {
    marginBottom: 14,
  },
  filterPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: BorderRadius.xxl,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...AppShadows.subtle,
  },
  filterPillActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
    ...AppShadows.primaryGlow,
  },
  // Subheading: MULI BOLD CAPS
  filterPillText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  cardList: {
    flex: 1,
  },
});