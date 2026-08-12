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
      // Reset
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
      checkAnim.setValue(0);

      // Animate in
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
        // Pulse loop
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

          {/* Title */}
          <Text style={styles.successTitle}>Work Order Created!</Text>
          <Text style={styles.successSubtitle}>
            Your service request has been successfully registered in the system.
          </Text>

          {/* WO Number Box */}
          <View style={styles.woBox}>
            <Text style={styles.woBoxLabel}>Work Order Number</Text>
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
                })}
              </Text>
            </View>
          </View>

          {/* Info note */}
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={14} color="#1976D2" />
            <Text style={styles.infoText}>
              {' '}A technician will be assigned shortly. You will be notified on the registered contact.
            </Text>
          </View>

          {/* CTA Button */}
          <TouchableOpacity style={styles.ctaBtn} onPress={onDismiss} activeOpacity={0.85}>
            <Ionicons name="grid-outline" size={18} color="#fff" />
            <Text style={styles.ctaBtnText}> Go to Dashboard</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 20, 45, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 36,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 24,
  },
  iconRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(25, 118, 210, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A2E4A',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#6B7FA3',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 22,
  },
  woBox: {
    backgroundColor: '#F0F7FF',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#BBDEFB',
  },
  woBoxLabel: {
    fontSize: 11,
    color: '#5C7EA8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  woNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1976D2',
    letterSpacing: 2,
    marginBottom: 6,
  },
  woBoxFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  woTimestamp: {
    fontSize: 11,
    color: '#8FA8C4',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginBottom: 22,
  },
  infoText: {
    fontSize: 12,
    color: '#1565C0',
    flex: 1,
    lineHeight: 17,
  },
  ctaBtn: {
    flexDirection: 'row',
    backgroundColor: '#1976D2',
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
