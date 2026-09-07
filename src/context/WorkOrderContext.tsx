import { createContext, ReactNode, useContext, useState } from 'react';

export type Severity = 'NORMAL' | 'HIGH' | 'CRITICAL';
export type WOStatus = 'Open' | 'Acknowledged' | 'Closed' | 'Completed' | 'In Progress';
export type WOType = 'CM' | 'PV' | 'PM' | 'IS';

export interface WorkOrder {
  id: string;
  woType: WOType;
  woTech: string;
  ceid: string;
  customer: string;
  department: string;
  reportedProblem: string;
  verifiedProblem: string;
  severity: Severity;
  status: WOStatus;
  woDate: string;
  project: string;
  physicalLocation: string;
  manufacturer: string;
  model: string;
  modality: string;
  assetClass: string;
  assetStatus: string;
  assetCriticality: string;
  serialNumber: string;
  callName: string;
  mobileNumber: string;
  emailId: string;
  primaryTech: string;
  secondaryTech: string;
  woCategory: string;
  workingStatus: string;
  notes: string;
}

const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: '386463',
    woType: 'CM',
    woTech: 'Rajab Jumadin Tuan Aris',
    ceid: 'CE-1001',
    customer: 'Madina National Hospital',
    department: 'Medical Ward',
    reportedProblem: 'Ac is leaking ..',
    verifiedProblem: 'Drain pan blockage identified in indoor AC unit',
    severity: 'NORMAL',
    status: 'Acknowledged',
    woDate: '30-Aug-2026, 00:17:34',
    project: 'Madina HVAC Suite',
    physicalLocation: 'Medical Ward, Floor 2',
    manufacturer: 'Daikin',
    model: 'FTKM50',
    modality: 'HVAC',
    assetClass: 'Facility Equipment',
    assetStatus: 'Active',
    assetCriticality: 'Medium',
    serialNumber: 'DAI-2023-AC-045',
    callName: 'Ward In-charge',
    mobileNumber: '+966 50 123 4567',
    emailId: 'ward@madinahospital.med',
    primaryTech: 'Rajab Jumadin Tuan Aris',
    secondaryTech: '',
    woCategory: 'Corrective',
    workingStatus: 'Under Maintenance',
    notes: 'Urgent drain clearing requested before morning rounds',
  },
  {
    id: '386465',
    woType: 'CM',
    woTech: 'Mohammad Ali',
    ceid: 'CE-1002',
    customer: 'New Jeddah Clinic Hospital',
    department: 'Hazard Room',
    reportedProblem: 'Water Leaking in Washbasin.',
    verifiedProblem: 'Trap seal pipe loose under basin fitting',
    severity: 'NORMAL',
    status: 'Acknowledged',
    woDate: '30-Aug-2026, 08:20:43',
    project: 'Jeddah Clinical Utilities',
    physicalLocation: 'Hazard Room, Ground Floor',
    manufacturer: 'Standard Plumbing',
    model: 'WB-880',
    modality: 'Plumbing',
    assetClass: 'Facility Equipment',
    assetStatus: 'Active',
    assetCriticality: 'Medium',
    serialNumber: 'PLM-2022-WB-112',
    callName: 'Lab Supervisor',
    mobileNumber: '+966 55 987 6543',
    emailId: 'lab@jeddahclinic.med',
    primaryTech: 'Mohammad Ali',
    secondaryTech: '',
    woCategory: 'Corrective',
    workingStatus: 'Under Maintenance',
    notes: 'Seal replacement needed',
  },
  {
    id: '386467',
    woType: 'CM',
    woTech: 'Glestone Fernandes',
    ceid: 'CE-1005',
    customer: 'New Jeddah Clinic Hospital',
    department: 'Laboratory',
    reportedProblem: 'Refrigerator is not working.',
    verifiedProblem: 'Compressor thermal overload relay reset and verified',
    severity: 'NORMAL',
    status: 'Completed',
    woDate: '30-Aug-2026, 08:30:34',
    project: 'Lab Cold Chain',
    physicalLocation: 'Main Laboratory Room 102',
    manufacturer: 'Thermo Fisher',
    model: 'TSX Series Lab Refrigerator',
    modality: 'Cold Storage',
    assetClass: 'Laboratory Equipment',
    assetStatus: 'Active',
    assetCriticality: 'Critical',
    serialNumber: 'TF-2021-REF-078',
    callName: 'Dr. Sarah Al-Otaibi',
    mobileNumber: '+966 54 321 0987',
    emailId: 'sarah.otaibi@jeddahclinic.med',
    primaryTech: 'Glestone Fernandes',
    secondaryTech: '',
    woCategory: 'Breakdown',
    workingStatus: 'Operational',
    notes: 'Temperature stabilized at +4°C. Samples safe.',
  },
  {
    id: '386470',
    woType: 'PV',
    woTech: 'Mohammad Ali',
    ceid: 'CE-1006',
    customer: 'New Jeddah Clinic Hospital',
    department: 'Patient Room 324',
    reportedProblem: 'Be in Need of Daily Performance Verification for EXHAUST FAN',
    verifiedProblem: 'Airflow velocity tested at 180 CFM within tolerance',
    severity: 'NORMAL',
    status: 'Open',
    woDate: '30-Aug-2026, 09:14:58',
    project: 'Isolation Ward Ventilation',
    physicalLocation: 'Patient Room 324',
    manufacturer: 'Systemair',
    model: 'K 160 EC',
    modality: 'Ventilation',
    assetClass: 'Facility Equipment',
    assetStatus: 'Active',
    assetCriticality: 'High',
    serialNumber: 'SYS-2023-EXH-324',
    callName: 'Nurse In-charge',
    mobileNumber: '+966 56 789 0123',
    emailId: 'ward3@jeddahclinic.med',
    primaryTech: 'Mohammad Ali',
    secondaryTech: '',
    woCategory: 'Performance Verification',
    workingStatus: 'Operational',
    notes: 'Daily negative pressure verification log recorded',
  },
  {
    id: '386471',
    woType: 'PV',
    woTech: 'Mohammad Ali',
    ceid: 'CE-1006',
    customer: 'New Jeddah Clinic Hospital',
    department: 'Patient Room 325',
    reportedProblem: 'Be in Need of Daily Performance Verification for EXHAUST FAN',
    verifiedProblem: 'Airflow velocity tested at 185 CFM within tolerance',
    severity: 'NORMAL',
    status: 'Open',
    woDate: '30-Aug-2026, 09:14:59',
    project: 'Isolation Ward Ventilation',
    physicalLocation: 'Patient Room 325',
    manufacturer: 'Systemair',
    model: 'K 160 EC',
    modality: 'Ventilation',
    assetClass: 'Facility Equipment',
    assetStatus: 'Active',
    assetCriticality: 'High',
    serialNumber: 'SYS-2023-EXH-325',
    callName: 'Nurse In-charge',
    mobileNumber: '+966 56 789 0124',
    emailId: 'ward3@jeddahclinic.med',
    primaryTech: 'Mohammad Ali',
    secondaryTech: '',
    woCategory: 'Performance Verification',
    workingStatus: 'Operational',
    notes: 'Daily check completed',
  },
];

interface WorkOrderContextType {
  workOrders: WorkOrder[];
  addWorkOrder: (wo: WorkOrder) => void;
  deleteWorkOrder: (id: string) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
}

const WorkOrderContext = createContext<WorkOrderContextType | undefined>(undefined);

export function WorkOrderProvider({ children }: { children: ReactNode }) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(MOCK_WORK_ORDERS);

  const addWorkOrder = (wo: WorkOrder) => {
    setWorkOrders((prev) => [wo, ...prev]);
  };

  const deleteWorkOrder = (id: string) => {
    setWorkOrders((prev) => prev.filter((wo) => wo.id !== id));
  };

  const updateWorkOrder = (id: string, updates: Partial<WorkOrder>) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === id ? { ...wo, ...updates } : wo))
    );
  };

  return (
    <WorkOrderContext.Provider value={{ workOrders, addWorkOrder, deleteWorkOrder, updateWorkOrder }}>
      {children}
    </WorkOrderContext.Provider>
  );
}

export function useWorkOrders() {
  const ctx = useContext(WorkOrderContext);
  if (!ctx) throw new Error('useWorkOrders must be used inside WorkOrderProvider');
  return ctx;
}
