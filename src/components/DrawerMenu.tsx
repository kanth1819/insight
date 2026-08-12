import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

interface DrawerMenuItem {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const MENU_ITEMS: DrawerMenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { key: 'asset', label: 'Asset Management', icon: 'server-outline' },
  { key: 'service', label: 'Service Management', icon: 'construct-outline' },
  { key: 'sourcing', label: 'Sourcing Management', icon: 'cube-outline' },
  { key: 'sales', label: 'Sales Management', icon: 'trending-up-outline' },
  { key: 'admin', label: 'Administration', icon: 'shield-checkmark-outline' },
  { key: 'superfind', label: 'Super Find', icon: 'search-outline' },
  { key: 'abgrab', label: 'AbGrab', icon: 'layers-outline' },
  { key: 'policy', label: 'Know Our Policy', icon: 'document-text-outline' },
  { key: 'reports', label: 'Advanced Reports', icon: 'bar-chart-outline' },
];

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
  activeItem?: string;
}

export default function DrawerMenu({ visible, onClose, activeItem = 'dashboard' }: DrawerMenuProps) {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 60,
          friction: 10,
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

  if (!visible && Platform.OS !== 'web') {
    // Still render but invisible so animation can play
  }

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[styles.backdrop, { opacity: backdropAnim }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Drawer Panel */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.drawerHeader}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="pulse" size={22} color="#fff" />
            </View>
            <View>
              <Text style={styles.logoTitle}>MEDVICE</Text>
              <Text style={styles.logoSubtitle}>SOLUTIONS</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close menu">
            <Ionicons name="close" size={22} color="#1976D2" />
          </TouchableOpacity>
        </View>

        {/* User info strip */}
        <View style={styles.userStrip}>
          <View style={styles.avatarMini}>
            <Ionicons name="person" size={18} color="#1976D2" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.userName}>Field Engineer</Text>
            <Text style={styles.userRole}>Biomedical Services</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Menu Items */}
        <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
          {MENU_ITEMS.map((item, index) => {
            const isActive = item.key === activeItem;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.menuItem, isActive && styles.menuItemActive]}
                onPress={() => {
                  // In a real app, navigate to the respective screen
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconWrap, isActive && styles.menuIconWrapActive]}>
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={isActive ? '#fff' : '#5C7EA8'}
                  />
                </View>
                <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                  {item.label}
                </Text>
                {isActive && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 30 }} />
        </ScrollView>

        {/* Footer */}
        <View style={styles.drawerFooter}>
          <Ionicons name="information-circle-outline" size={14} color="#999" />
          <Text style={styles.footerText}> v2.4.1 • Medvice Solutions Ltd.</Text>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 25, 50, 0.5)',
    zIndex: 100,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    zIndex: 200,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: '#F0F7FF',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1976D2',
    letterSpacing: 2,
  },
  logoSubtitle: {
    fontSize: 9,
    color: '#5C7EA8',
    letterSpacing: 3,
    fontWeight: '600',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#F0F7FF',
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#90CAF9',
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A2E4A',
  },
  userRole: {
    fontSize: 11,
    color: '#5C7EA8',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8F0F8',
    marginHorizontal: 0,
  },
  menuScroll: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 12,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: '#EBF4FF',
  },
  menuIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconWrapActive: {
    backgroundColor: '#1976D2',
  },
  menuLabel: {
    fontSize: 14,
    color: '#3A4A5C',
    fontWeight: '500',
    flex: 1,
  },
  menuLabelActive: {
    color: '#1976D2',
    fontWeight: '700',
  },
  activeIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#1976D2',
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -10,
  },
  drawerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8F0F8',
  },
  footerText: {
    fontSize: 11,
    color: '#aaa',
  },
});
