import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { FONT_FAMILY } from '@/constants/Typography';
import { AppColors, AppShadows, BorderRadius } from '@/constants/theme';
import { FormField, PrimaryButton, SecondaryButton } from '@/components/ui';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { isDesktop, isTablet } = useResponsive();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = (customId?: string, customPw?: string) => {
    const idToUse = customId ?? userId;
    const pwToUse = customPw ?? password;

    setErrorMsg('');
    if (!idToUse.trim() || !pwToUse.trim()) {
      setErrorMsg('please enter both username and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const success = login(idToUse, pwToUse);
      setLoading(false);
      if (success) {
        router.replace('/');
      } else {
        setErrorMsg('invalid username or password. (demo: 001 / medvice001)');
      }
    }, 300);
  };

  const handleQuickFill = (id: string, pass: string) => {
    setUserId(id);
    setPassword(pass);
    setErrorMsg('');
    setShowForgotModal(false);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F9" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            (isDesktop || isTablet) && styles.scrollContainerDesktop,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.contentWrapper, isDesktop && styles.contentWrapperDesktop]}>
            {/* Top Logo Card */}
            <View style={styles.logoCard}>
              <Image
                source={require('@/assets/images/medvice-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            {/* Login Card */}
            <View style={styles.loginCard}>
              {/* Heading: Muli Bold lowercase */}
              <Text style={styles.title}>login</Text>

              {/* Content: Muli Regular lowercase */}
              <Text style={styles.subtitle}>
                please sign in to your medical workspace
              </Text>

              {/* Error Message */}
              {errorMsg !== '' && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={18} color={AppColors.error} />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              {/* Username Input */}
              <FormField
                label="username"
                placeholder="username"
                value={userId}
                onChangeText={(t) => {
                  setUserId(t);
                  setErrorMsg('');
                }}
                leadingIcon="person-outline"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />

              {/* Password Input */}
              <FormField
                label="password"
                placeholder="password"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setErrorMsg('');
                }}
                leadingIcon="lock-closed-outline"
                trailingIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onTrailingIconPress={() => setShowPassword((v) => !v)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={() => handleLogin()}
              />

              {/* Primary Submit Button */}
              <PrimaryButton
                title="SUBMIT"
                onPress={() => handleLogin()}
                loading={loading}
                style={styles.submitBtn}
              />

              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPasswordBtn}
                onPress={() => setShowForgotModal(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Demo Fill Section */}
            <View style={styles.demoSection}>
              <Text style={styles.demoLabel}>SELECT DEMO ACCOUNT (ROLE ACCESS):</Text>
              <View style={styles.demoChipsRow}>
                <TouchableOpacity
                  style={[styles.demoChip, styles.demoChipManager]}
                  onPress={() => handleQuickFill('001', 'medvice001')}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.demoChipRole, { color: '#1D4ED8' }]}>MANAGER</Text>
                  <Text style={styles.demoChipSub}>001 • All Access</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoChip, styles.demoChipSupervisor]}
                  onPress={() => handleQuickFill('002', 'medvice002')}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.demoChipRole, { color: '#6D28D9' }]}>SUPERVISOR</Text>
                  <Text style={styles.demoChipSub}>002 • Operations</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoChip, styles.demoChipTechnician]}
                  onPress={() => handleQuickFill('003', 'medvice003')}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.demoChipRole, { color: '#047857' }]}>TECHNICIAN</Text>
                  <Text style={styles.demoChipSub}>003 • Field Tech</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowForgotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <Ionicons name="key-outline" size={22} color={AppColors.primary} />
              </View>
              <Text style={styles.modalTitle}>demo role credentials</Text>
            </View>

            <Text style={styles.modalBody}>
              switch between these 3 pre-configured demo tiers to test access control:
            </Text>

            <View style={styles.modalCredentialsBox}>
              <View style={styles.credTierItem}>
                <Text style={styles.modalCredRow}>
                  <Text style={styles.boldText}>001 (Manager): </Text>pw: medvice001
                </Text>
                <Text style={styles.credDescText}>all menus + full work order capabilities</Text>
              </View>
              <View style={[styles.credTierItem, { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 6, marginTop: 4 }]}>
                <Text style={styles.modalCredRow}>
                  <Text style={styles.boldText}>002 (Supervisor): </Text>pw: medvice002
                </Text>
                <Text style={styles.credDescText}>scoped dashboard, AM, SM, superfind + create/edit/reassign</Text>
              </View>
              <View style={[styles.credTierItem, { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 6, marginTop: 4 }]}>
                <Text style={styles.modalCredRow}>
                  <Text style={styles.boldText}>003 (Technician): </Text>pw: medvice003
                </Text>
                <Text style={styles.credDescText}>view-only CM/PM workorders & superfind</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <SecondaryButton
                title="CLOSE"
                variant="ghost"
                onPress={() => setShowForgotModal(false)}
                style={{ minWidth: 80 }}
              />
              <PrimaryButton
                title="FILL 001"
                onPress={() => handleQuickFill('001', 'medvice001')}
                style={{ height: 40, paddingHorizontal: 12 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  scrollContainerDesktop: {
    paddingVertical: 40,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 390,
  },
  contentWrapperDesktop: {
    maxWidth: 420,
  },
  logoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xxl,
    paddingVertical: 22,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    ...AppShadows.card,
  },
  logoImage: {
    width: 240,
    height: 72,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    ...AppShadows.elevated,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 26,
    fontWeight: '800',
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14,
    fontWeight: '400',
    color: AppColors.textSecondary,
    textTransform: 'lowercase',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.errorLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: AppColors.errorBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12.5,
    color: AppColors.error,
    textTransform: 'lowercase',
    flex: 1,
    lineHeight: 16,
  },
  submitBtn: {
    marginTop: 6,
    marginBottom: 18,
  },
  forgotPasswordBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontFamily: FONT_FAMILY.regular,
    color: AppColors.primary,
    fontSize: 13.5,
    fontWeight: '600',
    textTransform: 'lowercase',
  },
  demoSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  demoLabel: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 11.5,
    color: AppColors.textMuted,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  demoChipsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  demoChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...AppShadows.subtle,
  },
  demoChipManager: {
    borderColor: '#BFDBFE',
    backgroundColor: '#F8FAFF',
  },
  demoChipSupervisor: {
    borderColor: '#DDD6FE',
    backgroundColor: '#FAF8FF',
  },
  demoChipTechnician: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F4FDF9',
  },
  demoChipRole: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  demoChipSub: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 9.5,
    color: AppColors.textSecondary,
    textTransform: 'lowercase',
    marginTop: 2,
  },
  credTierItem: {
    gap: 2,
  },
  credDescText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 11.5,
    color: AppColors.textSecondary,
    textTransform: 'lowercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    ...AppShadows.elevated,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  modalIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: AppColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
  },
  modalBody: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13.5,
    color: AppColors.textSecondary,
    lineHeight: 19,
    textTransform: 'lowercase',
    marginBottom: 14,
  },
  modalCredentialsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 18,
    gap: 4,
  },
  modalCredRow: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13,
    color: '#334155',
    textTransform: 'lowercase',
  },
  boldText: {
    fontFamily: FONT_FAMILY.bold,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
});
