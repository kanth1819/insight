import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useWorkOrders, WorkOrder, Severity, WOType, WOStatus } from '@/context/WorkOrderContext';
import { lookupCEID, CEIDRecord } from '@/data/mockDB';
import SuccessModal from '@/components/SuccessModal';

// ─── Types ────────────────────────────────────────────────
interface FormState {
  // Primary info
  ceid: string;
  project: string;
  woType: WOType;
  customerName: string;
  department: string;
  physicalLocation: string;
  customerCountry: string;
  customerRegion: string;
  customerState: string;
  customerCity: string;
  openCount: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  description: string;
  modality: string;
  assetClass: string;
  assetStatus: string;
  assetCriticality: string;
  warrantyDetails: string;
  primaryTech: string;
  secondaryTech: string;
  pmTech: string;
  // Call info
  callName: string;
  mobileNumber: string;
  emailId: string;
  woTech: string;
  severity: Severity;
  workingStatus: string;
  woCategory: string;
  reportedProblem: string;
  verifiedProblem: string;
  notes: string;
}

const INITIAL_FORM: FormState = {
  ceid: '',
  project: '',
  woType: 'CM',
  customerName: '',
  department: '',
  physicalLocation: '',
  customerCountry: '',
  customerRegion: '',
  customerState: '',
  customerCity: '',
  openCount: '',
  serialNumber: '',
  manufacturer: '',
  model: '',
  description: '',
  modality: '',
  assetClass: '',
  assetStatus: '',
  assetCriticality: '',
  warrantyDetails: '',
  primaryTech: '',
  secondaryTech: '',
  pmTech: '',
  callName: '',
  mobileNumber: '',
  emailId: '',
  woTech: '',
  severity: 'NORMAL',
  workingStatus: '',
  woCategory: '',
  reportedProblem: '',
  verifiedProblem: '',
  notes: '',
};

// ─── Option Lists ─────────────────────────────────────────
const WO_TYPES: WOType[] = ['CM', 'PV', 'PM', 'IS'];
const SEVERITIES: Severity[] = ['NORMAL', 'HIGH', 'CRITICAL'];
const WO_CATEGORIES = ['Breakdown', 'Preventive', 'Corrective', 'Emergency', 'Installation', 'Calibration', 'Preventive Maintenance'];
const WORKING_STATUSES = ['Equipment Operational', 'Equipment Down', 'Partially Functional', 'Scheduled Downtime', 'Scheduled Maintenance', 'Equipment Offline'];

// ─── Helper components ───────────────────────────────────

function SectionCard({ title, icon, children }: { title: string; icon: keyof typeof Ionicons.glyphMap; children: React.ReactNode }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionCardHeader}>
        <View style={styles.sectionIconWrap}>
          <Ionicons name={icon} size={16} color="#1976D2" />
        </View>
        <Text style={styles.sectionCardTitle}>{title}</Text>
      </View>
      <View style={styles.sectionCardBody}>{children}</View>
    </View>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text style={styles.fieldLabel}>
      {label}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  multiline,
  editable = true,
  keyboardType,
  autoFilled,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  editable?: boolean;
  keyboardType?: 'default' | 'phone-pad' | 'email-address' | 'numeric';
  autoFilled?: boolean;
}) {
  return (
    <View style={styles.fieldWrapper}>
      <FieldLabel label={label} required={required} />
      <View style={[styles.inputContainer, !editable && styles.inputContainerDisabled, autoFilled && styles.inputContainerAutoFilled]}>
        {autoFilled && (
          <Ionicons name="flash" size={13} color="#1976D2" style={{ marginRight: 6 }} />
        )}
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline, !editable && styles.inputDisabled]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
          placeholderTextColor="#B0C4D8"
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          editable={editable}
          keyboardType={keyboardType ?? 'default'}
        />
      </View>
    </View>
  );
}

function PickerRow({
  label,
  options,
  selected,
  onSelect,
  colorMap,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  colorMap?: Record<string, { bg: string; text: string }>;
}) {
  return (
    <View style={styles.fieldWrapper}>
      <FieldLabel label={label} required />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
        {options.map((opt) => {
          const isActive = selected === opt;
          const colors = colorMap?.[opt];
          return (
            <TouchableOpacity
              key={opt}
              style={[
                styles.pickerChip,
                isActive && styles.pickerChipActive,
                isActive && colors && { backgroundColor: colors.bg, borderColor: colors.bg },
              ]}
              onPress={() => onSelect(opt)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.pickerChipText,
                  isActive && styles.pickerChipTextActive,
                  isActive && colors && { color: colors.text },
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function TwoColumnRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.twoCol}>{children}</View>;
}

// ─── Main Screen ─────────────────────────────────────────

export default function AssignScreen() {
  const router = useRouter();
  const { addWorkOrder } = useWorkOrders();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [autoFilledCEID, setAutoFilledCEID] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [newWONumber, setNewWONumber] = useState('');

  const setField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ─── CEID Auto-fill ───────────────────────────────────
  const handleCEIDBlur = useCallback(() => {
    if (!form.ceid.trim()) return;
    const record: CEIDRecord | null = lookupCEID(form.ceid.trim());
    if (record) {
      setForm((prev) => ({
        ...prev,
        project: record.project,
        customerName: record.customer,
        department: record.department,
        physicalLocation: record.physicalLocation,
        customerCountry: record.customerCountry,
        customerRegion: record.customerRegion,
        customerState: record.customerState,
        customerCity: record.customerCity,
        openCount: String(record.openCount),
        serialNumber: record.serialNumber,
        manufacturer: record.manufacturer,
        model: record.model,
        description: record.description,
        modality: record.modality,
        assetClass: record.assetClass,
        assetStatus: record.assetStatus,
        assetCriticality: record.assetCriticality,
        warrantyDetails: record.warrantyDetails,
        primaryTech: record.primaryTech,
        secondaryTech: record.secondaryTech,
        pmTech: record.pmTech,
      }));
      setAutoFilledCEID(true);
    } else {
      setAutoFilledCEID(false);
    }
  }, [form.ceid]);

  // ─── Submit ───────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (!form.ceid.trim()) {
      Alert.alert('Required Field', 'Please enter a CEID before submitting.');
      return;
    }
    if (!form.reportedProblem.trim()) {
      Alert.alert('Required Field', 'Please describe the reported problem.');
      return;
    }
    if (!form.callName.trim()) {
      Alert.alert('Required Field', 'Please enter the caller name.');
      return;
    }

    const woNumber = String(Math.floor(300000 + Math.random() * 99999));
    const today = new Date().toISOString().split('T')[0];

    const newWO: WorkOrder = {
      id: woNumber,
      woType: form.woType,
      woTech: form.woTech || form.primaryTech || 'Unassigned',
      ceid: form.ceid,
      customer: form.customerName,
      department: form.department,
      reportedProblem: form.reportedProblem,
      verifiedProblem: form.verifiedProblem,
      severity: form.severity,
      status: 'Open' as WOStatus,
      woDate: today,
      project: form.project,
      physicalLocation: form.physicalLocation,
      manufacturer: form.manufacturer,
      model: form.model,
      modality: form.modality,
      assetClass: form.assetClass,
      assetStatus: form.assetStatus,
      assetCriticality: form.assetCriticality,
      serialNumber: form.serialNumber,
      callName: form.callName,
      mobileNumber: form.mobileNumber,
      emailId: form.emailId,
      primaryTech: form.primaryTech,
      secondaryTech: form.secondaryTech,
      woCategory: form.woCategory,
      workingStatus: form.workingStatus,
      notes: form.notes,
    };

    addWorkOrder(newWO);
    setNewWONumber(woNumber);
    setSuccessVisible(true);
  }, [form, addWorkOrder]);

  const handleSuccessDismiss = useCallback(() => {
    setSuccessVisible(false);
    setForm(INITIAL_FORM);
    setAutoFilledCEID(false);
    router.replace('/');
  }, [router]);

  // ─── Render ───────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1565C0" />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Assign Work Order</Text>
            <Text style={styles.headerSub}>Create a new service request</Text>
          </View>
          <View style={styles.backBtn} />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── CEID Section ── */}
          <View style={styles.ceidCard}>
            <View style={styles.ceidHeader}>
              <Ionicons name="qr-code-outline" size={18} color="#1976D2" />
              <Text style={styles.ceidTitle}> CEID Lookup</Text>
              {autoFilledCEID && (
                <View style={styles.autoFillBadge}>
                  <Ionicons name="flash" size={11} color="#fff" />
                  <Text style={styles.autoFillBadgeText}> Auto-filled</Text>
                </View>
              )}
            </View>
            <Text style={styles.ceidHint}>
              Enter a CEID to auto-populate asset and customer details.
            </Text>
            <View style={styles.ceidInputRow}>
              <View style={styles.ceidInputWrap}>
                <TextInput
                  style={styles.ceidInput}
                  value={form.ceid}
                  onChangeText={(t) => {
                    setField('ceid', t);
                    setAutoFilledCEID(false);
                  }}
                  onBlur={handleCEIDBlur}
                  placeholder="e.g. CE-1001"
                  placeholderTextColor="#B0C4D8"
                  autoCapitalize="characters"
                />
              </View>
              <TouchableOpacity
                style={styles.lookupBtn}
                onPress={handleCEIDBlur}
                accessibilityLabel="Lookup CEID"
              >
                <Ionicons name="search" size={18} color="#fff" />
                <Text style={styles.lookupBtnText}> Lookup</Text>
              </TouchableOpacity>
            </View>
            {autoFilledCEID && (
              <View style={styles.autoFillHint}>
                <Ionicons name="checkmark-circle" size={14} color="#2E7D32" />
                <Text style={styles.autoFillHintText}>
                  {' '}Asset details auto-populated from database. You can edit any field.
                </Text>
              </View>
            )}
          </View>

          {/* ── Section 1: Primary Information ── */}
          <SectionCard title="Primary Information" icon="document-text-outline">
            <TwoColumnRow>
              <View style={styles.col}>
                <InputField label="Project" value={form.project} onChangeText={(t) => setField('project', t)} autoFilled={autoFilledCEID} />
              </View>
              <View style={styles.col}>
                <View style={styles.fieldWrapper}>
                  <FieldLabel label="Work Order ID" />
                  <View style={[styles.inputContainer, styles.inputContainerDisabled]}>
                    <Ionicons name="document-outline" size={13} color="#8FA8C4" style={{ marginRight: 6 }} />
                    <Text style={styles.inputDisabled}>Auto-generated</Text>
                  </View>
                </View>
              </View>
            </TwoColumnRow>

            <PickerRow
              label="Work Order Type"
              options={WO_TYPES}
              selected={form.woType}
              onSelect={(v) => setField('woType', v as WOType)}
              colorMap={{
                CM: { bg: '#FCE4EC', text: '#C2185B' },
                PV: { bg: '#E8F5E9', text: '#1B5E20' },
                PM: { bg: '#E3F2FD', text: '#0D47A1' },
                IS: { bg: '#FFF3E0', text: '#BF360C' },
              }}
            />

            <InputField label="Customer Name" value={form.customerName} onChangeText={(t) => setField('customerName', t)} required autoFilled={autoFilledCEID} />

            <TwoColumnRow>
              <View style={styles.col}>
                <InputField label="Department" value={form.department} onChangeText={(t) => setField('department', t)} autoFilled={autoFilledCEID} />
              </View>
              <View style={styles.col}>
                <InputField label="Physical Location" value={form.physicalLocation} onChangeText={(t) => setField('physicalLocation', t)} autoFilled={autoFilledCEID} />
              </View>
            </TwoColumnRow>

            <TwoColumnRow>
              <View style={styles.col}>
                <InputField label="Country" value={form.customerCountry} onChangeText={(t) => setField('customerCountry', t)} autoFilled={autoFilledCEID} />
              </View>
              <View style={styles.col}>
                <InputField label="Region" value={form.customerRegion} onChangeText={(t) => setField('customerRegion', t)} autoFilled={autoFilledCEID} />
              </View>
            </TwoColumnRow>

            <TwoColumnRow>
              <View style={styles.col}>
                <InputField label="State" value={form.customerState} onChangeText={(t) => setField('customerState', t)} autoFilled={autoFilledCEID} />
              </View>
              <View style={styles.col}>
                <InputField label="City" value={form.customerCity} onChangeText={(t) => setField('customerCity', t)} autoFilled={autoFilledCEID} />
              </View>
            </TwoColumnRow>

            <TwoColumnRow>
              <View style={styles.col}>
                <InputField label="Open Count" value={form.openCount} onChangeText={(t) => setField('openCount', t)} keyboardType="numeric" autoFilled={autoFilledCEID} />
              </View>
              <View style={styles.col}>
                <InputField label="Serial Number" value={form.serialNumber} onChangeText={(t) => setField('serialNumber', t)} autoFilled={autoFilledCEID} />
              </View>
            </TwoColumnRow>

            <TwoColumnRow>
              <View style={styles.col}>
                <InputField label="Manufacturer" value={form.manufacturer} onChangeText={(t) => setField('manufacturer', t)} autoFilled={autoFilledCEID} />
              </View>
              <View style={styles.col}>
                <InputField label="Model" value={form.model} onChangeText={(t) => setField('model', t)} autoFilled={autoFilledCEID} />
              </View>
            </TwoColumnRow>

            <InputField label="Description" value={form.description} onChangeText={(t) => setField('description', t)} autoFilled={autoFilledCEID} />

            <TwoColumnRow>
              <View style={styles.col}>
                <InputField label="Modality" value={form.modality} onChangeText={(t) => setField('modality', t)} autoFilled={autoFilledCEID} />
              </View>
              <View style={styles.col}>
                <InputField label="Asset Class" value={form.assetClass} onChangeText={(t) => setField('assetClass', t)} autoFilled={autoFilledCEID} />
              </View>
            </TwoColumnRow>

            <TwoColumnRow>
              <View style={styles.col}>
                <InputField label="Asset Status" value={form.assetStatus} onChangeText={(t) => setField('assetStatus', t)} autoFilled={autoFilledCEID} />
              </View>
              <View style={styles.col}>
                <InputField label="Asset Criticality" value={form.assetCriticality} onChangeText={(t) => setField('assetCriticality', t)} autoFilled={autoFilledCEID} />
              </View>
            </TwoColumnRow>

            <InputField label="Warranty Details" value={form.warrantyDetails} onChangeText={(t) => setField('warrantyDetails', t)} autoFilled={autoFilledCEID} />

            <TwoColumnRow>
              <View style={styles.col}>
                <InputField label="Primary Tech" value={form.primaryTech} onChangeText={(t) => setField('primaryTech', t)} autoFilled={autoFilledCEID} />
              </View>
              <View style={styles.col}>
                <InputField label="Secondary Tech" value={form.secondaryTech} onChangeText={(t) => setField('secondaryTech', t)} autoFilled={autoFilledCEID} />
              </View>
            </TwoColumnRow>

            <InputField label="PM Tech" value={form.pmTech} onChangeText={(t) => setField('pmTech', t)} autoFilled={autoFilledCEID} />
          </SectionCard>

          {/* ── Section 2: Call Information ── */}
          <SectionCard title="Call Information" icon="call-outline">
            <TwoColumnRow>
              <View style={styles.col}>
                <InputField label="Call Name" value={form.callName} onChangeText={(t) => setField('callName', t)} required />
              </View>
              <View style={styles.col}>
                <InputField label="Mobile Number" value={form.mobileNumber} onChangeText={(t) => setField('mobileNumber', t)} keyboardType="phone-pad" />
              </View>
            </TwoColumnRow>

            <InputField label="Email ID" value={form.emailId} onChangeText={(t) => setField('emailId', t)} keyboardType="email-address" />

            <InputField label="Workorder Tech" value={form.woTech} onChangeText={(t) => setField('woTech', t)} required />

            <PickerRow
              label="Severity"
              options={SEVERITIES}
              selected={form.severity}
              onSelect={(v) => setField('severity', v as Severity)}
              colorMap={{
                NORMAL: { bg: '#E8F5E9', text: '#2E7D32' },
                HIGH: { bg: '#FFF3E0', text: '#E65100' },
                CRITICAL: { bg: '#FEEBEE', text: '#C62828' },
              }}
            />

            <View style={styles.fieldWrapper}>
              <FieldLabel label="Working Status" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                {WORKING_STATUSES.map((opt) => {
                  const isActive = form.workingStatus === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.pickerChip, isActive && styles.pickerChipActive]}
                      onPress={() => setField('workingStatus', opt)}
                    >
                      <Text style={[styles.pickerChipText, isActive && styles.pickerChipTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.fieldWrapper}>
              <FieldLabel label="WO Category" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                {WO_CATEGORIES.map((opt) => {
                  const isActive = form.woCategory === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.pickerChip, isActive && styles.pickerChipActive]}
                      onPress={() => setField('woCategory', opt)}
                    >
                      <Text style={[styles.pickerChipText, isActive && styles.pickerChipTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <InputField
              label="Reported Problem"
              value={form.reportedProblem}
              onChangeText={(t) => setField('reportedProblem', t)}
              required
              multiline
              placeholder="Describe the issue reported by the customer..."
            />

            <InputField
              label="Verified Problem"
              value={form.verifiedProblem}
              onChangeText={(t) => setField('verifiedProblem', t)}
              multiline
              placeholder="Tech-verified root cause (optional)..."
            />

            <InputField
              label="Notes"
              value={form.notes}
              onChangeText={(t) => setField('notes', t)}
              multiline
              placeholder="Additional notes, escalation details, parts needed..."
            />
          </SectionCard>

          {/* ── Action Buttons ── */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle-outline" size={18} color="#5C7EA8" />
              <Text style={styles.closeBtnText}> Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
              <Text style={styles.submitBtnText}> Submit Work Order</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Success Modal ── */}
      <SuccessModal
        visible={successVisible}
        woNumber={newWONumber}
        onDismiss={handleSuccessDismiss}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
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
    paddingVertical: 12,
    backgroundColor: '#1565C0',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 11,
    color: '#90CAF9',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 20,
  },

  // ── CEID Card ──
  ceidCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
    borderWidth: 2,
    borderColor: '#BBDEFB',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  ceidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ceidTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A2E4A',
    flex: 1,
  },
  autoFillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  autoFillBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  ceidHint: {
    fontSize: 12,
    color: '#8FA8C4',
    marginBottom: 12,
    lineHeight: 17,
  },
  ceidInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ceidInputWrap: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#90CAF9',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  ceidInput: {
    fontSize: 15,
    color: '#1A2E4A',
    fontWeight: '700',
    height: 46,
    letterSpacing: 1,
  },
  lookupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingHorizontal: 18,
    borderRadius: 12,
    height: 46,
  },
  lookupBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  autoFillHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 8,
  },
  autoFillHintText: {
    fontSize: 11,
    color: '#2E7D32',
    flex: 1,
    lineHeight: 16,
  },

  // ── Section Card ──
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDEEFF',
  },
  sectionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A2E4A',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  sectionCardBody: {
    padding: 16,
    gap: 4,
  },

  // ── Fields ──
  fieldWrapper: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#5C7EA8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  required: {
    color: '#E53935',
    fontWeight: '800',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFD',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D0E4F7',
    paddingHorizontal: 12,
    minHeight: 44,
  },
  inputContainerDisabled: {
    backgroundColor: '#F0F4FA',
    borderColor: '#E0EAF5',
  },
  inputContainerAutoFilled: {
    borderColor: '#90CAF9',
    backgroundColor: '#F0F7FF',
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#1A2E4A',
    paddingVertical: 10,
    fontWeight: '500',
  },
  inputMultiline: {
    minHeight: 80,
    paddingTop: 10,
  },
  inputDisabled: {
    color: '#8FA8C4',
    fontSize: 13,
    fontStyle: 'italic',
  },
  twoCol: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },

  // ── Picker ──
  pickerScroll: {
    flexGrow: 0,
  },
  pickerChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D0E4F7',
    marginRight: 8,
    backgroundColor: '#F7FAFD',
  },
  pickerChipActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  pickerChipText: {
    fontSize: 12,
    color: '#5C7EA8',
    fontWeight: '600',
  },
  pickerChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  // ── Actions ──
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    gap: 12,
  },
  closeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: '#D0E4F7',
  },
  closeBtnText: {
    fontSize: 15,
    color: '#5C7EA8',
    fontWeight: '700',
  },
  submitBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976D2',
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
