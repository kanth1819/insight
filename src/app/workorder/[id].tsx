import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useWorkOrders, WorkOrder, Severity, WOStatus, WOType } from '@/context/WorkOrderContext';

// ─── Colour maps ───────────────────────────────────────────────────
const SEV_COLOR: Record<Severity, { bg: string; text: string }> = {
  NORMAL: { bg: '#E8F5E9', text: '#2E7D32' },
  HIGH:   { bg: '#FFF3E0', text: '#E65100' },
  CRITICAL: { bg: '#FEEBEE', text: '#C62828' },
};
const STA_COLOR: Record<WOStatus, { bg: string; text: string; dot: string }> = {
  Open:         { bg: '#FFF8E1', text: '#F57F17', dot: '#F9A825' },
  Acknowledged: { bg: '#E3F2FD', text: '#1565C0', dot: '#1976D2' },
  'In Progress':{ bg: '#EDE7F6', text: '#4527A0', dot: '#673AB7' },
  Closed:       { bg: '#F1F8E9', text: '#33691E', dot: '#558B2F' },
};
const WOT_COLOR: Record<string, { bg: string; text: string }> = {
  CM: { bg: '#FCE4EC', text: '#C2185B' },
  PV: { bg: '#E8F5E9', text: '#1B5E20' },
  PM: { bg: '#E3F2FD', text: '#0D47A1' },
  IS: { bg: '#FFF3E0', text: '#BF360C' },
};

const WO_TYPES: WOType[]   = ['CM', 'PV', 'PM', 'IS'];
const SEVERITIES: Severity[] = ['NORMAL', 'HIGH', 'CRITICAL'];
const STATUSES: WOStatus[]  = ['Open', 'Acknowledged', 'In Progress', 'Closed'];

// ─── Read-only detail row ──────────────────────────────────────────
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || '—'}</Text>
    </View>
  );
}

// ─── Section card ──────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: keyof typeof Ionicons.glyphMap; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={15} color="#1565C0" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

// ─── Edit field ────────────────────────────────────────────────────
function EditField({ label, value, onChangeText, multiline = false }: {
  label: string; value: string; onChangeText: (v: string) => void; multiline?: boolean;
}) {
  return (
    <View style={styles.editField}>
      <Text style={styles.editLabel}>{label}</Text>
      <TextInput
        style={[styles.editInput, multiline && styles.editInputMulti]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        placeholderTextColor="#A8BDD4"
      />
    </View>
  );
}

// ─── Chip selector ─────────────────────────────────────────────────
function ChipSelector<T extends string>({
  label, options, value, onChange, colorMap,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  colorMap: Record<string, { bg: string; text: string }>;
}) {
  return (
    <View style={styles.editField}>
      <Text style={styles.editLabel}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((opt) => {
          const col = colorMap[opt] ?? { bg: '#E3F2FD', text: '#1565C0' };
          const active = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, active && { backgroundColor: col.bg, borderColor: col.text }]}
              onPress={() => onChange(opt)}
            >
              <Text style={[styles.chipText, active && { color: col.text, fontWeight: '800' }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Main page ─────────────────────────────────────────────────────
export default function WorkOrderDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workOrders, updateWorkOrder } = useWorkOrders();

  const wo = workOrders.find((w) => w.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<WorkOrder | null>(wo ?? null);

  if (!wo || !draft) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="document-text-outline" size={60} color="#BBDEFB" />
        <Text style={styles.notFoundText}>Work Order #{id} not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sev = SEV_COLOR[wo.severity] ?? SEV_COLOR.NORMAL;
  const sta = STA_COLOR[wo.status]   ?? STA_COLOR.Open;
  const wot = WOT_COLOR[wo.woType]   ?? { bg: '#F5F5F5', text: '#424242' };

  const field = (key: keyof WorkOrder) => (v: string) =>
    setDraft((prev) => prev ? { ...prev, [key]: v } : prev);

  const handleSave = () => {
    if (!draft) return;
    updateWorkOrder(draft.id, draft);
    setIsEditing(false);
    Alert.alert('Saved', `Work Order #${draft.id} has been updated.`);
  };

  const handleCancelEdit = () => {
    setDraft(wo);
    setIsEditing(false);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1565C0" />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>WO #{wo.id}</Text>
            <View style={[styles.headerBadge, { backgroundColor: wot.bg }]}>
              <Text style={[styles.headerBadgeText, { color: wot.text }]}>{wo.woType}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            style={[styles.headerBtn, styles.editBtn]}
          >
            <Ionicons name={isEditing ? 'checkmark' : 'create-outline'} size={20} color="#fff" />
            <Text style={styles.editBtnText}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Status band */}
        <View style={styles.statusBand}>
          <View style={[styles.sevPill, { backgroundColor: sev.bg }]}>
            <Text style={[styles.sevPillText, { color: sev.text }]}>{wo.severity}</Text>
          </View>
          <View style={[styles.staPill, { backgroundColor: sta.bg }]}>
            <View style={[styles.staDot, { backgroundColor: sta.dot }]} />
            <Text style={[styles.staPillText, { color: sta.text }]}>{wo.status}</Text>
          </View>
          <View style={{ flex: 1 }} />
          <Text style={styles.dateLabel}>{wo.woDate}</Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          {isEditing ? (
            /* ─── EDIT MODE ─────────────────────────────────── */
            <>
              <View style={styles.editBanner}>
                <Ionicons name="pencil" size={14} color="#1565C0" />
                <Text style={styles.editBannerText}> Editing WO #{draft.id} — tap Save when done</Text>
                <TouchableOpacity onPress={handleCancelEdit}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>

              <Section title="Classification" icon="grid-outline">
                <ChipSelector label="WO Type"   options={WO_TYPES}   value={draft.woType}   onChange={field('woType') as any}   colorMap={WOT_COLOR} />
                <ChipSelector label="Severity"  options={SEVERITIES} value={draft.severity} onChange={field('severity') as any} colorMap={SEV_COLOR} />
                <ChipSelector label="Status"    options={STATUSES}   value={draft.status}   onChange={field('status') as any}   colorMap={STA_COLOR} />
              </Section>

              <Section title="Asset / Customer" icon="business-outline">
                <EditField label="CEID"              value={draft.ceid}             onChangeText={field('ceid')} />
                <EditField label="Customer"          value={draft.customer}         onChangeText={field('customer')} />
                <EditField label="Department"        value={draft.department}       onChangeText={field('department')} />
                <EditField label="Physical Location" value={draft.physicalLocation} onChangeText={field('physicalLocation')} />
                <EditField label="Manufacturer"      value={draft.manufacturer}     onChangeText={field('manufacturer')} />
                <EditField label="Model"             value={draft.model}            onChangeText={field('model')} />
                <EditField label="Modality"          value={draft.modality}         onChangeText={field('modality')} />
                <EditField label="Serial Number"     value={draft.serialNumber}     onChangeText={field('serialNumber')} />
              </Section>

              <Section title="Problem Description" icon="alert-circle-outline">
                <EditField label="Reported Problem" value={draft.reportedProblem} onChangeText={field('reportedProblem')} multiline />
                <EditField label="Verified Problem" value={draft.verifiedProblem} onChangeText={field('verifiedProblem')} multiline />
                <EditField label="Notes"            value={draft.notes}           onChangeText={field('notes')}           multiline />
              </Section>

              <Section title="Technician" icon="person-outline">
                <EditField label="WO Tech"        value={draft.woTech}        onChangeText={field('woTech')} />
                <EditField label="Primary Tech"   value={draft.primaryTech}   onChangeText={field('primaryTech')} />
                <EditField label="Secondary Tech" value={draft.secondaryTech} onChangeText={field('secondaryTech')} />
              </Section>

              <Section title="Call Details" icon="call-outline">
                <EditField label="Contact Name"  value={draft.callName}     onChangeText={field('callName')} />
                <EditField label="Mobile"        value={draft.mobileNumber} onChangeText={field('mobileNumber')} />
                <EditField label="Email"         value={draft.emailId}      onChangeText={field('emailId')} />
              </Section>

              <Section title="Additional" icon="document-text-outline">
                <EditField label="WO Category"    value={draft.woCategory}    onChangeText={field('woCategory')} />
                <EditField label="Working Status" value={draft.workingStatus} onChangeText={field('workingStatus')} />
                <EditField label="Asset Status"   value={draft.assetStatus}   onChangeText={field('assetStatus')} />
                <EditField label="Asset Class"    value={draft.assetClass}    onChangeText={field('assetClass')} />
                <EditField label="Criticality"    value={draft.assetCriticality} onChangeText={field('assetCriticality')} />
              </Section>

              {/* Save / Cancel buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelEdit}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* ─── VIEW MODE ─────────────────────────────────── */
            <>
              <Section title="Classification" icon="grid-outline">
                <DetailRow label="WO Type"      value={wo.woType} />
                <DetailRow label="WO Category"  value={wo.woCategory} />
                <DetailRow label="Working Status" value={wo.workingStatus} />
                <DetailRow label="WO Date"      value={wo.woDate} />
              </Section>

              <Section title="Asset / Customer" icon="business-outline">
                <DetailRow label="CEID"              value={wo.ceid} />
                <DetailRow label="Customer"          value={wo.customer} />
                <DetailRow label="Department"        value={wo.department} />
                <DetailRow label="Project"           value={wo.project} />
                <DetailRow label="Physical Location" value={wo.physicalLocation} />
                <DetailRow label="Manufacturer"      value={wo.manufacturer} />
                <DetailRow label="Model"             value={wo.model} />
                <DetailRow label="Modality"          value={wo.modality} />
                <DetailRow label="Asset Class"       value={wo.assetClass} />
                <DetailRow label="Asset Status"      value={wo.assetStatus} />
                <DetailRow label="Asset Criticality" value={wo.assetCriticality} />
                <DetailRow label="Serial Number"     value={wo.serialNumber} />
              </Section>

              <Section title="Problem Description" icon="alert-circle-outline">
                <DetailRow label="Reported Problem" value={wo.reportedProblem} />
                <DetailRow label="Verified Problem" value={wo.verifiedProblem} />
                <DetailRow label="Notes"            value={wo.notes} />
              </Section>

              <Section title="Technician" icon="person-outline">
                <DetailRow label="WO Tech"        value={wo.woTech} />
                <DetailRow label="Primary Tech"   value={wo.primaryTech} />
                <DetailRow label="Secondary Tech" value={wo.secondaryTech} />
              </Section>

              <Section title="Call Details" icon="call-outline">
                <DetailRow label="Contact Name" value={wo.callName} />
                <DetailRow label="Mobile"       value={wo.mobileNumber} />
                <DetailRow label="Email"        value={wo.emailId} />
              </Section>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0F4FF' },

  // Header
  safeHeader: { backgroundColor: '#1565C0' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1565C0',
    gap: 8,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    gap: 4,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },

  // Status band
  statusBand: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 10,
    backgroundColor: '#1565C0',
    gap: 8,
  },
  sevPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sevPillText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  staPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  staDot: { width: 7, height: 7, borderRadius: 4 },
  staPillText: { fontSize: 11, fontWeight: '700' },
  dateLabel: { fontSize: 11, color: '#90CAF9', fontWeight: '500' },

  // Body
  body: { flex: 1 },

  // Sections
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 14,
    marginTop: 14,
    paddingBottom: 4,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#D6E8FA',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1565C0',
    letterSpacing: 0.3,
  },

  // Detail view rows
  detailRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5FF',
    gap: 10,
  },
  detailLabel: {
    width: 140,
    fontSize: 12,
    color: '#8FA8C4',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    color: '#1A2E4A',
    fontWeight: '500',
    lineHeight: 18,
  },

  // Edit fields
  editBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  editBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#1565C0',
    fontWeight: '600',
  },
  cancelText: {
    fontSize: 12,
    color: '#E53935',
    fontWeight: '700',
  },
  editField: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5FF',
  },
  editLabel: {
    fontSize: 10,
    color: '#8FA8C4',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 5,
  },
  editInput: {
    backgroundColor: '#F5F8FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0E4F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#1A2E4A',
  },
  editInputMulti: {
    minHeight: 72,
    textAlignVertical: 'top',
  },

  // Chip selector
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#F5F8FF',
    borderWidth: 1.5,
    borderColor: '#D0E4F7',
  },
  chipText: {
    fontSize: 11,
    color: '#5C7EA8',
    fontWeight: '600',
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 14,
    marginTop: 20,
    marginBottom: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D0E4F7',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    color: '#5C7EA8',
    fontWeight: '700',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#1565C0',
    gap: 6,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  saveBtnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '800',
  },

  // Not found
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundText: { fontSize: 16, color: '#5C7EA8', fontWeight: '600' },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1976D2',
    borderRadius: 12,
  },
  backBtnText: { color: '#fff', fontWeight: '700' },
});
