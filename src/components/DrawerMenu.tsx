import { FONT_FAMILY } from '@/constants/Typography';
import { AppColors } from '@/constants/theme';
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
  hasChevron?: boolean;
  subItems?: SubMenuItem[];
}

// ─── 1. Dashboard Sub-Items ───
const DASHBOARD_SUB_ITEMS: SubMenuItem[] = [
  { key: 'cec_dashboard', label: 'cec dashboard' },
  { key: 'cm_workorders', label: 'cm workorders' },
  { key: 'mutabagani_kpi', label: 'mutabagani kpi' },
  { key: 'njch_fm_dashboard', label: 'njch fm dashboard' },
  { key: 'mnh_fm_dashboard', label: 'mnh fm dashboard' },
  { key: 'csrwo_dashboard', label: 'csrwo dashboard' },
  { key: 'savings_dashboard', label: 'savings dashboard' },
  { key: 'manage_daily_pv_1', label: 'manage daily pv' },
  { key: 'manage_daily_pv_2', label: 'complete bulk pv' },
];

// ─── 2. Asset Management Sub-Items (AM Menu) ───
const ASSET_MANAGEMENT_SUB_ITEMS: SubMenuItem[] = [
  { key: 'am_abhaya_hospital', label: 'abhaya hospital' },
  { key: 'am_atherya_hospital', label: 'atherya hospital' },
  { key: 'am_lakshmi_hospital', label: 'lakshmi hospital' },
  { key: 'am_rathna_medical', label: 'rathna medical' },
  { key: 'am_dms_hospital', label: 'dms hospital' },
  { key: 'am_dinesh_hospital', label: 'dinesh hospital' },
  { key: 'am_add_new_asset', label: 'add new asset' },
  { key: 'am_test_equipments', label: 'test equipments' },
  { key: 'am_approve_new_assets', label: 'approve new assets' },
  { key: 'am_reopened_assets', label: 'reopened assets' },
  { key: 'am_manuals_library', label: 'manuals library' },
];

// ─── 3. Service Management Sub-Items (SM Menu) ───
const SERVICE_MANAGEMENT_SUB_ITEMS: SubMenuItem[] = [
  { key: 'sm_daily_rounds', label: 'daily rounds' },
  { key: 'sm_cm_work_orders_list', label: 'cm work orders list' },
  { key: 'sm_pm_work_orders_list', label: 'pm work orders list' },
  { key: 'sm_calibration_wo_list', label: 'calibration wo list' },
  { key: 'sm_cm_wo_history', label: 'cm wo history' },
  { key: 'sm_pm_wo_history', label: 'pm wo history' },
  { key: 'sm_approve_cm_wo', label: 'approve cm wo' },
  { key: 'sm_approve_pm_wo', label: 'approve pm wo' },
  { key: 'sm_manage_wo_alerts', label: 'manage wo alerts' },
  { key: 'sm_manage_pm_checklist', label: 'manage pm checklist' },
  { key: 'sm_manage_projects', label: 'manage projects' },
];

const MENU_ITEMS: DrawerMenuItem[] = [
  {
    key: 'dashboard',
    label: 'dashboard',
    hasChevron: true,
    subItems: DASHBOARD_SUB_ITEMS,
  },
  {
    key: 'asset',
    label: 'asset management',
    hasChevron: true,
    subItems: ASSET_MANAGEMENT_SUB_ITEMS,
  },
  {
    key: 'service',
    label: 'service management',
    hasChevron: true,
    subItems: SERVICE_MANAGEMENT_SUB_ITEMS,
  },
  { key: 'sourcing', label: 'sourcing management', hasChevron: true },
  { key: 'sales', label: 'sales management', hasChevron: true },
  { key: 'admin', label: 'administration', hasChevron: true },
  { key: 'superfind', label: 'super find', hasChevron: true },
  { key: 'abgrab', label: 'abgrab', hasChevron: true },
  { key: 'policy', label: 'know your policy', hasChevron: true },
  { key: 'reports', label: 'advanced reports', hasChevron: true },
  { key: 'profile', label: 'profile', hasChevron: true },
];

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
  activeItem?: string;
  onLogout?: () => void;
  currentUserId?: string | null;
}

export default function DrawerMenu({
  visible,
  onClose,
  activeItem = 'dashboard',
  onLogout,
  currentUserId,
}: DrawerMenuProps) {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + (Platform.OS === 'web' ? 52 : 52);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Track expanded menu section (one open at a time like screenshot)
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

  const displayUserName = currentUserId
    ? currentUserId === '001'
      ? 'user one'
      : currentUserId === '002'
        ? 'user two'
        : currentUserId === '003'
          ? 'user three'
          : `user ${currentUserId}`
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

      {/* Floating Glassmorphic Drawer Panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            top: headerHeight,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* User Profile Header - Heading: Muli Bold lowercase */}
        <View style={styles.userHeader}>
          <View style={styles.avatarIconWrap}>
            <Ionicons name="person" size={38} color="#000000" />
          </View>
          <Text style={styles.userName}>{displayUserName}</Text>
        </View>

        {/* Menu Items Scroll Container */}
        <ScrollView
          style={styles.menuScroll}
          contentContainerStyle={styles.menuScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {MENU_ITEMS.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedSection === item.key;

            return (
              <View key={item.key} style={styles.menuItemGroup}>
                {/* Main Item Row */}
                <TouchableOpacity
                  style={[styles.menuItemRow, isExpanded && styles.menuItemRowActive]}
                  onPress={() => {
                    if (hasSubItems) {
                      toggleSection(item.key);
                    } else {
                      onClose();
                    }
                  }}
                  activeOpacity={0.65}
                >
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.hasChevron !== false && (
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#0F172A"
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
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(20px) saturate(180%)' as any,
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
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 16,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
    gap: 14,
  },
  avatarIconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Heading: Muli Bold lowercase
  userName: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    textTransform: 'lowercase',
    letterSpacing: -0.3,
  },
  menuScroll: {
    flex: 1,
  },
  menuScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 2,
  },
  menuItemGroup: {
    marginBottom: 2,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuItemRowActive: {
    backgroundColor: '#F8FAFC',
  },
  // Heading / Item: Muli Bold lowercase
  menuLabel: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0F172A',
    textTransform: 'lowercase',
    letterSpacing: -0.2,
  },
  // Floating sub-items card container
  subItemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E8ECF2',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  subItemRow: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  // Sub-items: Muli Bold lowercase
  subItemLabel: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    textTransform: 'lowercase',
    letterSpacing: -0.2,
  },
  logoutBtn: {
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  // Heading: Muli Bold lowercase
  logoutText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 24,
    fontWeight: '700',
    color: '#EF4444',
    textTransform: 'lowercase',
    letterSpacing: -0.3,
  },
});
