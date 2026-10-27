import { FONT_FAMILY } from '@/constants/Typography';
import { AppColors } from '@/constants/theme';
import {
  getRoleBadgeInfo,
  hasMenuAccess,
  hasSubMenuAccess,
  UserRole,
} from '@/constants/permissions';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 360);

interface SubMenuItem {
  key: string;
  label: string;
}

interface DrawerMenuItem {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  hasChevron?: boolean;
  subItems?: SubMenuItem[];
}

// ─── 1. Dashboard Sub-Items ───
const DASHBOARD_SUB_ITEMS: SubMenuItem[] = [
  { key: 'cec_dashboard', label: 'CEC Dashboard' },
  { key: 'cm_workorders', label: 'CM Workorders' },
  { key: 'mutabagani_kpi', label: 'Mutabagani KPI' },
  { key: 'njch_fm_dashboard', label: 'NJCH FM Dashboard' },
  { key: 'mnh_fm_dashboard', label: 'MNH FM Dashboard' },
  { key: 'csrwo_dashboard', label: 'CSRWO Dashboard' },
  { key: 'savings_dashboard', label: 'Savings Dashboard' },
  { key: 'manage_daily_pv_1', label: 'Manage Daily PV' },
  { key: 'manage_daily_pv_2', label: 'Complete Bulk PV' },
];

// ─── 2. Asset Management Sub-Items (AM Menu) ───
const ASSET_MANAGEMENT_SUB_ITEMS: SubMenuItem[] = [
  { key: 'am_abhaya_hospital', label: 'Abhaya Hospital' },
  { key: 'am_atherya_hospital', label: 'Atherya Hospital' },
  { key: 'am_lakshmi_hospital', label: 'Lakshmi Hospital' },
  { key: 'am_rathna_medical', label: 'Rathna Medical' },
  { key: 'am_dms_hospital', label: 'DMS Hospital' },
  { key: 'am_dinesh_hospital', label: 'Dinesh Hospital' },
  { key: 'am_add_new_asset', label: 'Add New Asset' },
  { key: 'am_test_equipments', label: 'Test Equipments' },
  { key: 'am_approve_new_assets', label: 'Approve New Assets' },
  { key: 'am_reopened_assets', label: 'Reopened Assets' },
  { key: 'am_manuals_library', label: 'Manuals Library' },
];

// ─── 3. Service Management Sub-Items (SM Menu) ───
const SERVICE_MANAGEMENT_SUB_ITEMS: SubMenuItem[] = [
  { key: 'sm_daily_rounds', label: 'Daily Rounds' },
  { key: 'sm_cm_work_orders_list', label: 'CM Work Orders List' },
  { key: 'sm_pm_work_orders_list', label: 'PM Work Orders List' },
  { key: 'sm_calibration_wo_list', label: 'Calibration WO List' },
  { key: 'sm_cm_wo_history', label: 'CM WO History' },
  { key: 'sm_pm_wo_history', label: 'PM WO History' },
  { key: 'sm_approve_cm_wo', label: 'Approve CM WO' },
  { key: 'sm_approve_pm_wo', label: 'Approve PM WO' },
  { key: 'sm_manage_wo_alerts', label: 'Manage WO Alerts' },
  { key: 'sm_manage_pm_checklist', label: 'Manage PM Checklist' },
  { key: 'sm_manage_projects', label: 'Manage Projects' },
];

// ─── Top-Level Navigation Items with Icons ───
const MENU_ITEMS: DrawerMenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'trending-up',
    hasChevron: true,
    subItems: DASHBOARD_SUB_ITEMS,
  },
  {
    key: 'asset',
    label: 'Asset Management',
    icon: 'briefcase-outline',
    hasChevron: true,
    subItems: ASSET_MANAGEMENT_SUB_ITEMS,
  },
  {
    key: 'service',
    label: 'Service Management',
    icon: 'construct-outline',
    hasChevron: true,
    subItems: SERVICE_MANAGEMENT_SUB_ITEMS,
  },
  {
    key: 'sourcing',
    label: 'Sourcing Management',
    icon: 'cart-outline',
    hasChevron: true,
  },
  {
    key: 'sales',
    label: 'Sales Management',
    icon: 'cash-outline',
    hasChevron: true,
  },
  {
    key: 'superfind',
    label: 'Super Find',
    icon: 'filter-outline',
    hasChevron: true,
  },
  {
    key: 'admin',
    label: 'Administration',
    icon: 'settings-outline',
    hasChevron: true,
  },
  {
    key: 'abgrab',
    label: 'Abgrab',
    icon: 'cube-outline',
    hasChevron: true,
  },
  {
    key: 'policy',
    label: 'Know Your Policy',
    icon: 'document-text-outline',
    hasChevron: true,
  },
  {
    key: 'reports',
    label: 'Advanced Reports',
    icon: 'bar-chart-outline',
    hasChevron: true,
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: 'person-outline',
    hasChevron: true,
  },
];

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
  activeItem?: string;
  onLogout?: () => void;
  currentUserId?: string | null;
  userRole?: UserRole | null;
}

export default function DrawerMenu({
  visible,
  onClose,
  activeItem = 'dashboard',
  onLogout,
  currentUserId: propUserId,
  userRole: propUserRole,
}: DrawerMenuProps) {
  const insets = useSafeAreaInsets();
  const auth = useAuth();
  const effectiveUserId = propUserId ?? auth?.currentUserId;
  const effectiveUserRole: UserRole =
    propUserRole ?? auth?.userRole ?? (effectiveUserId === '001' ? 'manager' : 'employee');
  const roleBadge = getRoleBadgeInfo(effectiveUserRole);

  // Filter items based on user role using centralized permissions
  const visibleMenuItems = MENU_ITEMS.filter((item) => {
    return hasMenuAccess(effectiveUserRole, item.key);
  }).map((item) => {
    if (!item.subItems) return item;
    return {
      ...item,
      subItems: item.subItems.filter((sub) =>
        hasSubMenuAccess(effectiveUserRole, item.key, sub.key)
      ),
    };
  });

  const headerHeight = insets.top + (Platform.OS === 'web' ? 52 : 52);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Track expanded menu section (one open at a time like reference)
  const [expandedSection, setExpandedSection] = useState<string | null>('dashboard');

  const toggleSection = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const displayUserName = effectiveUserId
    ? effectiveUserId === '001'
      ? 'user one'
      : effectiveUserId === '002'
        ? 'user two'
        : effectiveUserId === '003'
          ? 'user three'
          : `user ${effectiveUserId}`
    : 'user one';

  return (
    <>
      {/* Frosted / Translucent Blurred Backdrop */}
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[
          styles.backdrop,
          {
            opacity: backdropAnim,
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Floating Drawer Panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            top: headerHeight,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* User Profile Header with Role Badge */}
        <View style={styles.userHeader}>
          <View style={styles.avatarIconWrap}>
            <Ionicons name="person" size={28} color="#1E293B" />
          </View>
          <View style={styles.userInfoCol}>
            <Text style={styles.userName}>{displayUserName}</Text>
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor: roleBadge.bgColor,
                  borderColor: roleBadge.borderColor,
                },
              ]}
            >
              <Text style={[styles.roleBadgeText, { color: roleBadge.textColor }]}>
                {roleBadge.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items Scroll Container */}
        <ScrollView
          style={styles.menuScroll}
          contentContainerStyle={styles.menuScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {visibleMenuItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedSection === item.key;
            const isCurrentlyActive = activeItem === item.key;

            return (
              <View key={item.key} style={styles.menuItemGroup}>
                {/* Main Item Row */}
                <TouchableOpacity
                  style={[
                    styles.menuItemRow,
                    isCurrentlyActive && styles.menuItemRowActive,
                  ]}
                  onPress={() => {
                    if (hasSubItems) {
                      toggleSection(item.key);
                    } else {
                      onClose();
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={isCurrentlyActive ? '#FFFFFF' : '#1E293B'}
                      style={styles.menuItemIcon}
                    />
                    <Text
                      style={[
                        styles.menuLabel,
                        isCurrentlyActive && styles.menuLabelActive,
                      ]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </View>

                  {item.hasChevron !== false && (
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={isCurrentlyActive ? '#FFFFFF' : '#64748B'}
                    />
                  )}
                </TouchableOpacity>

                {/* Floating Glassy Sub-menu Card */}
                {hasSubItems && isExpanded && (
                  <View style={styles.subItemsCard}>
                    {item.subItems!.map((sub, sIdx) => (
                      <TouchableOpacity
                        key={`${sub.key}_${sIdx}`}
                        style={styles.subItemRow}
                        onPress={() => {
                          onClose();
                        }}
                        activeOpacity={0.65}
                      >
                        <Text style={styles.subItemLabel}>{sub.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })}

          {/* Logout Action Button */}
          {onLogout && (
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                onClose();
                onLogout();
              }}
              activeOpacity={0.7}
              accessibilityLabel="logout"
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 10 }} />
              <Text style={styles.logoutText}>logout</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    backdropFilter: 'blur(16px) saturate(180%)' as any,
    zIndex: 100,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: Platform.select({
      web: 'rgba(255, 255, 255, 0.98)',
      default: '#FFFFFF',
    }),
    zIndex: 200,
    shadowColor: '#0F172A',
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  avatarIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textTransform: 'lowercase',
    letterSpacing: -0.2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 4,
  },
  roleBadgeText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  menuScroll: {
    flex: 1,
  },
  menuScrollContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  menuItemGroup: {
    marginBottom: 2,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 1,
  },
  menuItemRowActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  menuLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // Floating sub-items card container
  subItemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginVertical: 4,
    marginLeft: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  subItemRow: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  subItemLabel: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#334155',
    letterSpacing: -0.2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  logoutText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    textTransform: 'lowercase',
    letterSpacing: -0.2,
  },
});
