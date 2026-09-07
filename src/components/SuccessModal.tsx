import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_FAMILY } from '@/constants/Typography';

interface SuccessModalProps {
  visible: boolean;
  woNumber: string;
  onDismiss: () => void;
}

export default function SuccessModal({ visible, woNumber, onDismiss }: SuccessModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
      checkAnim.setValue(0);

      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(checkAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.08,
              duration: 700,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 700,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Success Icon */}
          <Animated.View style={[styles.iconRing, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.iconCircle}>
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: checkAnim,
                    },
                  ],
                }}
              >
                <Ionicons name="checkmark-sharp" size={44} color="#fff" />
              </Animated.View>
            </View>
          </Animated.View>

          {/* Heading: Muli Bold lowercase */}
          <Text style={styles.successTitle}>work order created!</Text>
          {/* Content: Muli Regular lowercase */}
          <Text style={styles.successSubtitle}>
            your service request has been successfully registered in the system.
          </Text>

          {/* WO Number Box */}
          <View style={styles.woBox}>
            {/* Subheading: MULI BOLD CAPS */}
            <Text style={styles.woBoxLabel}>WORK ORDER NUMBER</Text>
            <Text style={styles.woNumber}>#{woNumber}</Text>
            <View style={styles.woBoxFooter}>
              <Ionicons name="time-outline" size={12} color="#5C7EA8" />
              <Text style={styles.woTimestamp}>
                {' '}
                {new Date().toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).toLowerCase()}
              </Text>
            </View>
          </View>

          {/* Info note - Content: Muli Regular lowercase */}
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={14} color="#1976D2" />
            <Text style={styles.infoText}>
              {' '}a technician will be assigned shortly. you will be notified on the registered contact.
            </Text>
          </View>

          {/* CTA Button - Subheading: MULI BOLD CAPS */}
          <TouchableOpacity style={styles.ctaBtn} onPress={onDismiss} activeOpacity={0.85}>
            <Ionicons name="grid-outline" size={18} color="#fff" />
            <Text style={styles.ctaBtnText}> GO TO DASHBOARD</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 36,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(30, 58, 95, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  // Heading: Muli Bold lowercase
  successTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textTransform: 'lowercase',
    marginBottom: 6,
    textAlign: 'center',
  },
  // Content: Muli Regular lowercase
  successSubtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13,
    color: '#9CA3AF',
    textTransform: 'lowercase',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  woBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  // Subheading: MULI BOLD CAPS
  woBoxLabel: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 10.5,
    color: '#9CA3AF',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  woNumber: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 28,
    fontWeight: '800',
    color: '#1E3A5F',
    letterSpacing: 2,
    marginBottom: 6,
  },
  woBoxFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  woTimestamp: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'lowercase',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  // Content: Muli Regular lowercase
  infoText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    color: '#065F46',
    textTransform: 'lowercase',
    flex: 1,
    lineHeight: 17,
  },
  ctaBtn: {
    flexDirection: 'row',
    backgroundColor: '#1E3A5F',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    gap: 8,
  },
  // Subheading: MULI BOLD CAPS
  ctaBtnText: {
    fontFamily: FONT_FAMILY.bold,
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
