import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FONT_FAMILY } from '@/constants/Typography';
import { AppColors } from '@/constants/theme';

interface AppHeaderProps {
  title?: string;
  showLogo?: boolean;
  leftType?: 'menu' | 'back' | 'none';
  isMenuOpen?: boolean;
  onLeftPress?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export default function AppHeader({
  title,
  showLogo = false,
  leftType = 'menu',
  isMenuOpen = false,
  onLeftPress,
  rightAction,
  style,
}: AppHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={[styles.safeHeader, style]}>
      <View style={styles.headerRow}>
        {/* Left Action */}
        <View style={styles.leftCol}>
          {leftType === 'menu' && (
            <TouchableOpacity
              onPress={onLeftPress}
              style={styles.actionBtn}
              accessibilityLabel={isMenuOpen ? 'close menu' : 'open menu'}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isMenuOpen ? 'arrow-back' : 'menu'}
                size={isMenuOpen ? 26 : 28}
                color={AppColors.textPrimary}
              />
            </TouchableOpacity>
          )}

          {leftType === 'back' && (
            <TouchableOpacity
              onPress={onLeftPress}
              style={styles.actionBtn}
              accessibilityLabel="go back"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={AppColors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center: Logo or Title */}
        <View style={styles.centerCol}>
          {showLogo ? (
            <Image
              source={require('@/assets/images/medvice-logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        {/* Right Action */}
        <View style={styles.rightCol}>
          {rightAction ? rightAction : <View style={styles.actionPlaceholder} />}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 52,
  },
  leftCol: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightCol: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  actionBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  actionPlaceholder: {
    width: 40,
  },
  headerLogo: {
    width: 145,
    height: 38,
  },
  headerTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
    letterSpacing: -0.2,
  },
});
