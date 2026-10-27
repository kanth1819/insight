import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useWorkOrders, WorkOrder, Severity, WOType, WOStatus } from '@/context/WorkOrderContext';
import { useAuth } from '@/context/AuthContext';
import { lookupCEID, CEIDRecord } from '@/data/mockDB';
import { useResponsive } from '@/hooks/useResponsive';
import { AppColors } from '@/constants/theme';
import {
  AppHeader,
  PrimaryButton,
  FormField,
  SelectDropdown,
  SectionCard,
  EmptyState,
} from '@/components/ui';
import SuccessModal from '@/components/SuccessModal';

interface FormState {
  ceid: string;
  project: string;
  workOrderNumber: string;
  customerName: string;
  department: string;
  priority: Severity;
  status: WOStatus;

  assetTag: string;
  assetDescription: string;
  serialNumber: string;
  location: string;
  building: string;
  floor: string;
  room: string;

  callerName: string;
  callerPhone: string;
  callerEmail: string;
  dateReported: string;
  assignedTo: string;

  reportedProblem: string;
  workType: WOType;
  notes: string;
}

const INITIAL_FORM: FormState = {
  ceid: '',
  project: '',
  workOrderNumber: `WO-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
  customerName: '',
  department: '',
  priority: 'NORMAL',
  status: 'Open',

  assetTag: '',
  assetDescription: '',
  serialNumber: '',
  location: '',
  building: '',
  floor: '',
  room: '',

  callerName: '',
  callerPhone: '',
  callerEmail: '',
  dateReported: new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
  assignedTo: '',

  reportedProblem: '',
  workType: 'CM',
  notes: '',
};

const PROJECT_OPTIONS = [
  { label: 'Apollo Imaging Suite', value: 'Apollo Imaging Suite' },
  { label: 'Fortis Cardiac Care', value: 'Fortis Cardiac Care' },
  { label: 'Max Critical Care', value: 'Max Critical Care' },
  { label: 'Manipal Imaging Center', value: 'Manipal Imaging Center' },
  { label: 'Madina HVAC Suite', value: 'Madina HVAC Suite' },
  { label: 'Jeddah Clinical Utilities', value: 'Jeddah Clinical Utilities' },
  { label: 'Lab Cold Chain', value: 'Lab Cold Chain' },
  { label: 'Isolation Ward Ventilation', value: 'Isolation Ward Ventilation' },
];

const DEPARTMENT_OPTIONS = [
  { label: 'Medical Ward', value: 'Medical Ward' },
  { label: 'Hazard Room', value: 'Hazard Room' },
  { label: 'Laboratory', value: 'Laboratory' },
  { label: 'Patient Room 324', value: 'Patient Room 324' },
  { label: 'Patient Room 325', value: 'Patient Room 325' },
  { label: 'Radiology', value: 'Radiology' },
  { label: 'Cardiology', value: 'Cardiology' },
  { label: 'ICU', value: 'ICU' },
  { label: 'Emergency', value: 'Emergency' },
  { label: 'Surgery', value: 'Surgery' },
  { label: 'Oncology', value: 'Oncology' },
  { label: 'Pathology', value: 'Pathology' },
];

const PRIORITY_OPTIONS: { label: string; value: Severity }[] = [
  { label: 'Normal', value: 'NORMAL' },
  { label: 'High', value: 'HIGH' },
  { label: 'Critical', value: 'CRITICAL' },
];

const STATUS_OPTIONS: { label: string; value: WOStatus }[] = [
  { label: 'Open', value: 'Open' },
  { label: 'Acknowledged', value: 'Acknowledged' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Closed', value: 'Closed' },
];

const LOCATION_OPTIONS = [
  { label: 'Floor 1, Main Wing', value: 'Floor 1, Main Wing' },
  { label: 'Floor 2, Medical Ward', value: 'Floor 2, Medical Ward' },
  { label: 'Ground Floor, Hazard Room', value: 'Ground Floor, Hazard Room' },
  { label: 'Main Laboratory Room 102', value: 'Main Laboratory Room 102' },
  { label: 'Patient Room 324', value: 'Patient Room 324' },
  { label: 'Patient Room 325', value: 'Patient Room 325' },
  { label: 'Floor 3, Radiology Wing', value: 'Floor 3, Radiology Wing' },
  { label: 'Floor 2, Cardiology ICU', value: 'Floor 2, Cardiology ICU' },
  { label: 'Floor 5, Medical ICU', value: 'Floor 5, Medical ICU' },
];

const TECHNICIAN_OPTIONS = [
  { label: 'Rajab Jumadin Tuan Aris', value: 'Rajab Jumadin Tuan Aris' },
  { label: 'Mohammad Ali', value: 'Mohammad Ali' },
  { label: 'Glestone Fernandes', value: 'Glestone Fernandes' },
  { label: 'Rajesh Kumar', value: 'Rajesh Kumar' },
  { label: 'Sunita Rao', value: 'Sunita Rao' },
  { label: 'Vikram Singh', value: 'Vikram Singh' },
  { label: 'Deepa Menon', value: 'Deepa Menon' },
  { label: 'Arjun Pillai', value: 'Arjun Pillai' },
  { label: 'Kavitha Reddy', value: 'Kavitha Reddy' },
];

const WORK_TYPE_OPTIONS: { label: string; value: WOType }[] = [
  { label: 'Corrective Maintenance (CM)', value: 'CM' },
  { label: 'Performance Verification (PV)', value: 'PV' },
  { label: 'Preventive Maintenance (PM)', value: 'PM' },
  { label: 'Installation (IS)', value: 'IS' },
];

export default function AssignScreen() {
  const router = useRouter();
  const { addWorkOrder } = useWorkOrders();
  const { canCreateWorkOrder } = useAuth();
  const { contentMaxWidth } = useResponsive();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [successVisible, setSuccessVisible] = useState(false);
  const [createdWONumber, setCreatedWONumber] = useState('');

  if (!canCreateWorkOrder) {
    return (
      <View style={{ flex: 1, backgroundColor: AppColors.background }}>
        <AppHeader title="assign work order" leftType="back" onLeftPress={() => router.back()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <EmptyState
            icon="lock-closed-outline"
            title="access restricted"
            subtitle="your role does not have permission to create or assign new work orders."
            actionText="RETURN TO DASHBOARD"
            onAction={() => router.replace('/')}
          />
        </View>
      </View>
    );
  }

  const setField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCEIDBlur = useCallback(() => {
    if (!form.ceid.trim()) return;
    const record: CEIDRecord | null = lookupCEID(form.ceid.trim());
    if (record) {
      setForm((prev) => ({
        ...prev,
        project: record.project || prev.project,
        customerName: record.customer || prev.customerName,
        department: record.department || prev.department,
        location: record.physicalLocation || prev.location,
        serialNumber: record.serialNumber || prev.serialNumber,
        assetDescription: `${record.manufacturer} ${record.model} - ${record.description}`,
        assignedTo: record.primaryTech || prev.assignedTo,
      }));
    }
  }, [form.ceid]);

  const handleSubmit = () => {
    if (!form.ceid.trim()) {
      Alert.alert('required field', 'please enter a ceid.');
      return;
    }
    if (!form.customerName.trim()) {
      Alert.alert('required field', 'please enter a customer name.');
      return;
    }
    if (!form.reportedProblem.trim()) {
      Alert.alert('required field', 'please enter the reported problem.');
      return;
    }

    const generatedId =
      form.workOrderNumber.replace(/[^0-9]/g, '').slice(-6) ||
      String(Math.floor(380000 + Math.random() * 9000));

    const newWO: WorkOrder = {
      id: generatedId,
      woType: form.workType,
      woTech: form.assignedTo || 'unassigned',
      ceid: form.ceid,
      customer: form.customerName,
      department: form.department || 'general',
      reportedProblem: form.reportedProblem,
      verifiedProblem: '',
      severity: form.priority,
      status: form.status,
      woDate: `${form.dateReported}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`,
      project: form.project || 'general project',
      physicalLocation:
        form.location || `${form.building || ''} ${form.floor || ''} ${form.room || ''}`.trim() || 'main facility',
      manufacturer: '',
      model: form.assetDescription || '',
      modality: '',
      assetClass: 'medical equipment',
      assetStatus: 'active',
      assetCriticality: form.priority,
      serialNumber: form.serialNumber,
      callName: form.callerName,
      mobileNumber: form.callerPhone,
      emailId: form.callerEmail,
      primaryTech: form.assignedTo,
      secondaryTech: '',
      woCategory: form.workType,
      workingStatus: 'under service',
      notes: form.notes,
    };

    addWorkOrder(newWO);
    setCreatedWONumber(generatedId);
    setSuccessVisible(true);
  };

  const handleSuccessDismiss = () => {
    setSuccessVisible(false);
    router.replace('/');
  };

  return (
    <View style={styles.root}>
      {/* Top Header */}
      <AppHeader
        title="new work order"
        leftType="back"
        onLeftPress={() => router.back()}
        rightAction={
          <PrimaryButton
            title="SUBMIT"
            onPress={handleSubmit}
            style={styles.headerSubmitBtn}
          />
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.scrollContent,
            contentMaxWidth ? { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' } : {},
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card 1: Primary Information */}
          <SectionCard title="primary information">
            <FormField
              label="ceid"
              required
              placeholder="enter ceid (e.g. CE-1001)"
              value={form.ceid}
              onChangeText={(t) => setField('ceid', t)}
              onBlur={handleCEIDBlur}
              autoCapitalize="characters"
            />

            <SelectDropdown
              label="project"
              required
              value={form.project}
              options={PROJECT_OPTIONS}
              onSelect={(val) => setField('project', val)}
            />

            <FormField
              label="work order"
              required
              value={form.workOrderNumber}
              onChangeText={(t) => setField('workOrderNumber', t)}
              placeholder="wo-2026-0892"
            />

            <FormField
              label="customer name"
              required
              placeholder="enter customer name"
              value={form.customerName}
              onChangeText={(t) => setField('customerName', t)}
            />

            <SelectDropdown
              label="department"
              required
              value={form.department}
              options={DEPARTMENT_OPTIONS}
              onSelect={(val) => setField('department', val)}
            />

            <SelectDropdown
              label="priority"
              value={form.priority}
              options={PRIORITY_OPTIONS}
              onSelect={(val) => setField('priority', val as Severity)}
            />

            <SelectDropdown
              label="status"
              value={form.status}
              options={STATUS_OPTIONS}
              onSelect={(val) => setField('status', val as WOStatus)}
            />
          </SectionCard>

          {/* Card 2: Asset Details */}
          <SectionCard title="asset details">
            <FormField
              label="asset tag"
              placeholder="scan or enter asset tag"
              value={form.assetTag}
              onChangeText={(t) => setField('assetTag', t)}
            />

            <FormField
              label="asset description"
              placeholder="enter description"
              value={form.assetDescription}
              onChangeText={(t) => setField('assetDescription', t)}
            />

            <FormField
              label="serial number"
              placeholder="enter serial number"
              value={form.serialNumber}
              onChangeText={(t) => setField('serialNumber', t)}
            />

            <SelectDropdown
              label="location"
              required
              value={form.location}
              options={LOCATION_OPTIONS}
              onSelect={(val) => setField('location', val)}
            />

            <FormField
              label="building"
              placeholder="enter building"
              value={form.building}
              onChangeText={(t) => setField('building', t)}
            />

            <View style={styles.twoColRow}>
              <View style={styles.twoColField}>
                <FormField
                  label="floor"
                  placeholder="floor"
                  value={form.floor}
                  onChangeText={(t) => setField('floor', t)}
                />
              </View>
              <View style={styles.twoColField}>
                <FormField
                  label="room"
                  placeholder="room"
                  value={form.room}
                  onChangeText={(t) => setField('room', t)}
                />
              </View>
            </View>
          </SectionCard>

          {/* Card 3: Call Information */}
          <SectionCard title="call information">
            <FormField
              label="caller name"
              required
              placeholder="enter caller name"
              value={form.callerName}
              onChangeText={(t) => setField('callerName', t)}
            />

            <FormField
              label="caller phone"
              placeholder="(555) 000-0000"
              value={form.callerPhone}
              onChangeText={(t) => setField('callerPhone', t)}
              keyboardType="phone-pad"
            />

            <FormField
              label="caller email"
              placeholder="email@example.com"
              value={form.callerEmail}
              onChangeText={(t) => setField('callerEmail', t)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormField
              label="date reported"
              value={form.dateReported}
              onChangeText={(t) => setField('dateReported', t)}
              trailingIcon="calendar-outline"
            />

            <SelectDropdown
              label="assigned to"
              value={form.assignedTo}
              options={TECHNICIAN_OPTIONS}
              onSelect={(val) => setField('assignedTo', val)}
            />
          </SectionCard>

          {/* Card 4: Problem Description */}
          <SectionCard title="problem description">
            <FormField
              label="reported problem"
              required
              placeholder="describe the reported problem..."
              value={form.reportedProblem}
              onChangeText={(t) => setField('reportedProblem', t)}
              multiline
              numberOfLines={4}
            />

            <SelectDropdown
              label="work type"
              value={form.workType}
              options={WORK_TYPE_OPTIONS}
              onSelect={(val) => setField('workType', val as WOType)}
            />

            <FormField
              label="notes"
              placeholder="additional clinical / service notes..."
              value={form.notes}
              onChangeText={(t) => setField('notes', t)}
              multiline
              numberOfLines={3}
            />
          </SectionCard>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <SuccessModal
        visible={successVisible}
        woNumber={createdWONumber}
        onDismiss={handleSuccessDismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  headerSubmitBtn: {
    height: 36,
    paddingHorizontal: 14,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
  },
  twoColField: {
    flex: 1,
  },
});
