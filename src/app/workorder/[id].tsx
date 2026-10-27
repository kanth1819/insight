import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useWorkOrders, Severity, WOStatus } from '@/context/WorkOrderContext';
import { useAuth } from '@/context/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { FONT_FAMILY } from '@/constants/Typography';
import { AppColors, BorderRadius, AppShadows } from '@/constants/theme';
import {
  AppHeader,
  StatusBadge,
  SectionCard,
  PrimaryButton,
  SecondaryButton,
  FormField,
  EmptyState,
} from '@/components/ui';

type ActiveTab = 'WORK ORDER' | 'PHOTOS' | 'UPLOADS' | 'TEST EQUIP.';

const TECHNICIAN_LIST = [
  'MOHD SAIDER ALI',
  'Rajab Jumadin Tuan Aris',
  'Mohammad Ali',
  'Glestone Fernandes',
  'Rajesh Kumar',
  'Sunita Rao',
  'Vikram Singh',
  'Deepa Menon',
];

export default function WorkOrderDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workOrders, updateWorkOrder } = useWorkOrders();
  const { canEditWorkOrder, canReassignWorkOrder } = useAuth();
  const { contentMaxWidth } = useResponsive();

  const wo = workOrders.find((w) => w.id === id);

  // Screen States
  const [activeTab, setActiveTab] = useState<ActiveTab>('WORK ORDER');

  // Edit / Reassign Modals
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [reassignModalVisible, setReassignModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  // Edit Form State
  const [editCustomer, setEditCustomer] = useState(wo?.customer || '');
  const [editDepartment, setEditDepartment] = useState(wo?.department || '');
  const [editLocation, setEditLocation] = useState(wo?.physicalLocation || '');
  const [editProblem, setEditProblem] = useState(wo?.reportedProblem || '');
  const [editStatus, setEditStatus] = useState<WOStatus>(wo?.status || 'Open');
  const [editSeverity, setEditSeverity] = useState<Severity>(wo?.severity || 'NORMAL');

  if (!wo) {
    return (
      <View style={styles.notFound}>
        <EmptyState
          icon="document-text-outline"
          title={`work order #${id} not found`}
          subtitle="the requested work order does not exist or was deleted."
          actionText="RETURN TO DASHBOARD"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const handleSaveEdit = () => {
    updateWorkOrder(wo.id, {
      customer: editCustomer,
      department: editDepartment,
      physicalLocation: editLocation,
      reportedProblem: editProblem,
      status: editStatus,
      severity: editSeverity,
    });
    setEditModalVisible(false);
    Alert.alert('success', `work order #${wo.id} updated successfully.`);
  };

  const handleReassign = (tech: string) => {
    updateWorkOrder(wo.id, { woTech: tech, primaryTech: tech });
    setReassignModalVisible(false);
    Alert.alert('reassigned', `work order assigned to ${tech}.`);
  };

  return (
    <View style={styles.root}>
      {/* Top Header */}
      <AppHeader
        title={`wo #${wo.id}`}
        leftType="back"
        onLeftPress={() => router.back()}
        rightAction={<StatusBadge status={wo.status} showDot />}
      />

      {/* Top Tab Bar */}
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}
        >
          {(['WORK ORDER', 'PHOTOS', 'UPLOADS', 'TEST EQUIP.'] as ActiveTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.75}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
                {isActive && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          contentMaxWidth ? { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' } : {},
        ]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'WORK ORDER' ? (
          <>
            {/* Card 1: Primary Information */}
            <SectionCard
              title="primary information"
              collapsible
              rightAction={<StatusBadge status={wo.status} />}
            >
              {/* Work Order ID Header */}
              <View style={styles.woIdRow}>
                <View>
                  <Text style={styles.metaLabel}>WORK ORDER ID</Text>
                  <Text style={styles.woIdValue}>{wo.id}</Text>
                </View>
                <StatusBadge woType={wo.woType} />
              </View>

              {/* Primary Info Key-Value Table */}
              <View style={styles.kvList}>
                <KVRow label="alt work order" value="—" />
                <KVRow label="workorder type" value={wo.woType || 'CM'} />
                <KVRow label="project" value={wo.project || 'FM'} />
                <KVRow label="ceid" value={wo.ceid || 'CE-99214'} />
                <KVRow label="customer name" value={wo.customer || 'New Jeddah Clinic Hospital'} />
                <KVRow label="department" value={wo.department || 'Radiology'} />
                <KVRow
                  label="physical location"
                  value={wo.physicalLocation || 'Bldg A, 3rd Floor, Room 304'}
                />
                <KVRow label="assigned date" value={wo.woDate.split(',')[0] || '15-Mar-2024'} />
                <KVRow label="acknowledged date" value={wo.woDate.split(',')[0] || '15-Mar-2024'} />
                <KVRow label="work order status" value={wo.status || 'Acknowledged'} />
                <KVRow label="customer approval" value="Pending" />
              </View>

              {/* Subheading: MULI BOLD CAPS */}
              <Text style={styles.subSectionTitle}>ASSET DETAILS</Text>
              <View style={styles.kvList}>
                <KVRow label="serial number" value={wo.serialNumber || 'SN-UX8837119'} />
                <KVRow label="oem" value="GE Healthcare" />
                <KVRow label="manufacturer" value={wo.manufacturer || 'GE Medical Systems'} />
                <KVRow label="model" value={wo.model || 'Optima MR360'} />
                <KVRow
                  label="description"
                  value="Magnetic Resonance Imaging System"
                />
                <KVRow label="asset class" value={wo.assetClass || 'Class III'} />
                <KVRow label="status" value={wo.assetStatus || 'In Service'} />
                <KVRow label="criticality" value={wo.assetCriticality || 'Critical'} />
                <KVRow label="warranty" value="Under Warranty" />
                <KVRow label="contract" value="Comprehensive SLA" />
              </View>
            </SectionCard>

            {/* Card 2: Call Information */}
            <SectionCard
              title="call information"
              collapsible
              rightAction={<StatusBadge severity={wo.severity} />}
            >
              <View style={styles.kvList}>
                <KVRow label="caller name" value={wo.callName || 'Dr. Tariq Al-Mansoor'} />
                <KVRow label="caller contact" value={wo.mobileNumber || '+966 50 123 4567'} />
                <KVRow label="assigned ce" value={wo.woTech || 'MOHD SAIDER ALI'} />

                {/* Severity Row */}
                <View style={styles.kvRow}>
                  <Text style={styles.kvLabel}>severity</Text>
                  <StatusBadge severity={wo.severity} />
                </View>

                <KVRow label="reported problem" value={wo.reportedProblem || 'System Intermittent Fault'} />
                <KVRow label="verified problem" value={wo.verifiedProblem || 'Diagnostics in progress'} />
                <KVRow label="service type" value="On-Site Repair" />
              </View>

              {/* Reopen Notes */}
              <Text style={styles.reopenLabel}>REOPEN NOTES</Text>
              <View style={styles.reopenBox}>
                <Text style={styles.reopenText}>
                  {wo.notes ||
                    'previous calibration was completed on 10-jan. client reported returning drift in luminance.'}
                </Text>
              </View>
            </SectionCard>
          </>
        ) : activeTab === 'PHOTOS' ? (
          <EmptyState
            icon="camera-outline"
            title="site & equipment photos"
            subtitle="no diagnostic images attached to this work order yet."
            actionText="UPLOAD PHOTO"
            onAction={() => Alert.alert('photo upload', 'photo attachment simulated.')}
          />
        ) : activeTab === 'UPLOADS' ? (
          <EmptyState
            icon="cloud-upload-outline"
            title="service logs & manuals"
            subtitle="upload calibration pdfs, vendor invoices or signed job sheets."
            actionText="ATTACH DOCUMENT"
            onAction={() => Alert.alert('document upload', 'document attachment simulated.')}
          />
        ) : (
          <EmptyState
            icon="construct-outline"
            title="test equipment & calibration"
            subtitle="no test tools or multimeter logs registered for this service call."
            actionText="ADD TEST DEVICE"
            onAction={() => Alert.alert('test tool', 'calibration tool logging simulated.')}
          />
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBarSafe}>
        <View style={styles.bottomBar}>
          {canEditWorkOrder && (
            <PrimaryButton
              title="EDIT WO"
              onPress={() => {
                setEditCustomer(wo.customer);
                setEditDepartment(wo.department);
                setEditLocation(wo.physicalLocation);
                setEditProblem(wo.reportedProblem);
                setEditStatus(wo.status);
                setEditSeverity(wo.severity);
                setEditModalVisible(true);
              }}
              style={styles.actionBtnBlue}
            />
          )}

          {canReassignWorkOrder && (
            <SecondaryButton
              title="REASSIGN"
              onPress={() => setReassignModalVisible(true)}
              style={styles.actionBtnOutlined}
            />
          )}

          <SecondaryButton
            title="PRINT REPORT"
            variant="danger"
            onPress={() => setReportModalVisible(true)}
            style={styles.actionBtnRed}
          />
        </View>
      </SafeAreaView>

      {/* Edit WO Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>edit work order #{wo.id}</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={22} color={AppColors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              <FormField
                label="customer name"
                value={editCustomer}
                onChangeText={setEditCustomer}
              />
              <FormField
                label="department"
                value={editDepartment}
                onChangeText={setEditDepartment}
              />
              <FormField
                label="location"
                value={editLocation}
                onChangeText={setEditLocation}
              />
              <FormField
                label="reported problem"
                value={editProblem}
                onChangeText={setEditProblem}
                multiline
                numberOfLines={3}
              />
            </ScrollView>

            <View style={styles.modalActionsRow}>
              <SecondaryButton
                title="CANCEL"
                variant="ghost"
                onPress={() => setEditModalVisible(false)}
              />
              <PrimaryButton
                title="SAVE CHANGES"
                onPress={handleSaveEdit}
                style={{ height: 44 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ReAssign Modal */}
      <Modal
        visible={reassignModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReassignModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setReassignModalVisible(false)}
        >
          <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>reassign technician</Text>
              <TouchableOpacity onPress={() => setReassignModalVisible(false)}>
                <Ionicons name="close" size={22} color={AppColors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.reassignSub}>
              select field biomedical engineer for work order #{wo.id}:
            </Text>
            <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false}>
              {TECHNICIAN_LIST.map((tech) => (
                <TouchableOpacity
                  key={tech}
                  style={styles.techSelectItem}
                  onPress={() => handleReassign(tech)}
                  activeOpacity={0.7}
                >
                  <View style={styles.techAvatar}>
                    <Text style={styles.techAvatarText}>{tech.charAt(0)}</Text>
                  </View>
                  <Text style={styles.techSelectName}>{tech}</Text>
                  {wo.woTech === tech && (
                    <Ionicons name="checkmark-circle" size={20} color={AppColors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Print Report Modal */}
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="print" size={22} color={AppColors.error} />
                <Text style={styles.modalTitle}>generate wo report</Text>
              </View>
              <TouchableOpacity onPress={() => setReportModalVisible(false)}>
                <Ionicons name="close" size={22} color={AppColors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.reportModalText}>
              ready to print official field service diagnostic report for work order #{wo.id} ({wo.customer}).
            </Text>
            <View style={styles.reportDetailsBox}>
              <Text style={styles.reportDetailsLine}>
                <Text style={{ fontWeight: '700' }}>hospital: </Text>
                {wo.customer}
              </Text>
              <Text style={styles.reportDetailsLine}>
                <Text style={{ fontWeight: '700' }}>engineer: </Text>
                {wo.woTech}
              </Text>
              <Text style={styles.reportDetailsLine}>
                <Text style={{ fontWeight: '700' }}>equipment: </Text>
                {wo.model || 'Optima MR360'}
              </Text>
              <Text style={styles.reportDetailsLine}>
                <Text style={{ fontWeight: '700' }}>date: </Text>
                {wo.woDate}
              </Text>
            </View>
            <View style={styles.modalActionsRow}>
              <SecondaryButton
                title="CLOSE"
                variant="ghost"
                onPress={() => setReportModalVisible(false)}
              />
              <SecondaryButton
                title="DOWNLOAD PDF"
                variant="danger"
                onPress={() => {
                  setReportModalVisible(false);
                  Alert.alert('report printed', `service report for wo #${wo.id} has been dispatched.`);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function KVRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.kvRow}>
      <Text style={styles.kvLabel}>{label}</Text>
      <Text style={styles.kvValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.background,
  },
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    position: 'relative',
    alignItems: 'center',
  },
  tabItemActive: {},
  tabText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 12.5,
    fontWeight: '700',
    color: AppColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  tabTextActive: {
    color: AppColors.primary,
    fontWeight: '800',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 14,
    right: 14,
    height: 3,
    backgroundColor: AppColors.primary,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  woIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F4F8',
  },
  metaLabel: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 11,
    fontWeight: '800',
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  woIdValue: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginTop: 2,
    letterSpacing: -0.3,
  },
  subSectionTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginTop: 18,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  kvList: {
    gap: 8,
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  kvLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13,
    color: AppColors.textSecondary,
    fontWeight: '500',
    textTransform: 'lowercase',
    flex: 1,
  },
  kvValue: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13.5,
    color: AppColors.textPrimary,
    fontWeight: '700',
    textAlign: 'right',
    flex: 1.2,
  },
  reopenLabel: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 12,
    color: AppColors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 14,
    marginBottom: 6,
  },
  reopenBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 12,
  },
  reopenText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12.5,
    color: '#334155',
    textTransform: 'lowercase',
    lineHeight: 18,
  },
  bottomBarSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
    ...AppShadows.elevated,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionBtnBlue: {
    flex: 1,
    height: 44,
  },
  actionBtnOutlined: {
    flex: 1,
    height: 44,
  },
  actionBtnRed: {
    flex: 1,
    height: 44,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: 20,
    maxHeight: '80%',
    ...AppShadows.elevated,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 16.5,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textTransform: 'lowercase',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  reassignSub: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13,
    color: AppColors.textSecondary,
    marginBottom: 12,
    textTransform: 'lowercase',
  },
  techSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    gap: 12,
  },
  techAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  techAvatarText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: '700',
  },
  techSelectName: {
    flex: 1,
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14,
    color: AppColors.textPrimary,
  },
  reportModalText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13.5,
    color: AppColors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
    textTransform: 'lowercase',
  },
  reportDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 4,
    marginBottom: 16,
  },
  reportDetailsLine: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13,
    color: '#334155',
  },
});
