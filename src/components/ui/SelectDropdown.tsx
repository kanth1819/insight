import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_FAMILY } from '@/constants/Typography';
import { AppColors, BorderRadius, AppShadows } from '@/constants/theme';

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

interface SelectDropdownProps {
  label?: string;
  required?: boolean;
  title?: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  containerStyle?: ViewStyle;
}

export default function SelectDropdown({
  label,
  required = false,
  title,
  placeholder = 'select an option',
  value,
  options,
  onSelect,
  containerStyle,
}: SelectDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || value || placeholder;
  const isPlaceholder = !selectedOption && !value;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label.toLowerCase()}
          {required && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.75}
      >
        <Text
          style={[styles.triggerText, isPlaceholder && styles.placeholderText]}
          numberOfLines={1}
        >
          {displayText.toLowerCase()}
        </Text>
        <Ionicons name="chevron-down" size={18} color={AppColors.textMuted} />
      </TouchableOpacity>

      {/* Options Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {(title || label || 'select option').toLowerCase()}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color={AppColors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.optionsScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {options.map((opt, idx) => {
                const isSelected = opt.value === value;
                return (
                  <TouchableOpacity
                    key={`${opt.value}_${idx}`}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                    onPress={() => {
                      onSelect(opt.value);
                      setModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {opt.label.toLowerCase()}
                      </Text>
                      {opt.description && (
                        <Text style={styles.optionDesc}>
                          {opt.description.toLowerCase()}
                        </Text>
                      )}
                    </View>
                    {isSelected ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={AppColors.primary}
                      />
                    ) : (
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#CBD5E1"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13.5,
    fontWeight: '600',
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
    marginBottom: 6,
  },
  asterisk: {
    color: '#DC2626',
    fontWeight: '700',
  },
  trigger: {
    height: 50,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  triggerText: {
    flex: 1,
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14.5,
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
  },
  placeholderText: {
    color: AppColors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    maxHeight: '75%',
    ...AppShadows.elevated,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    marginBottom: 8,
  },
  modalTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
  },
  optionsScroll: {
    maxHeight: 320,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    marginVertical: 2,
  },
  optionItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  optionContent: {
    flex: 1,
    paddingRight: 10,
  },
  optionText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14.5,
    fontWeight: '500',
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
  },
  optionTextSelected: {
    color: AppColors.primary,
    fontWeight: '700',
  },
  optionDesc: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 2,
    textTransform: 'lowercase',
  },
});
