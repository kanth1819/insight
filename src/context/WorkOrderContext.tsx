import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Severity = 'NORMAL' | 'HIGH' | 'CRITICAL';
export type WOStatus = 'Open' | 'Acknowledged' | 'Closed' | 'In Progress';
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
    id: '383001',
    woType: 'CM',
    woTech: 'Rajesh Kumar',
    ceid: 'CE-1001',
    customer: 'Apollo Hospitals',
    department: 'Radiology',
    reportedProblem: 'MRI machine showing calibration error E-4421',
    verifiedProblem: 'Gradient coil malfunction detected',
    severity: 'HIGH',
    status: 'Acknowledged',
    woDate: '2026-08-12',
    project: 'Apollo Imaging Suite',
    physicalLocation: 'Floor 3, Radiology Wing',
    manufacturer: 'Siemens Healthineers',
    model: 'MAGNETOM Vida',
    modality: 'MRI',
    assetClass: 'Diagnostic Imaging',
    assetStatus: 'Under Maintenance',
    assetCriticality: 'Critical',
    serialNumber: 'SIE-2023-MRI-0045',
    callName: 'Dr. Priya Sharma',
    mobileNumber: '+91 98765 43210',
    emailId: 'priya.sharma@apollo.com',
    primaryTech: 'Rajesh Kumar',
    secondaryTech: 'Anand Patel',
    woCategory: 'Breakdown',
    workingStatus: 'Equipment Down',
    notes: 'Priority escalation requested by department head',
  },
  {
    id: '383002',
    woType: 'PV',
    woTech: 'Sunita Rao',
    ceid: 'CE-1002',
    customer: 'Fortis Healthcare',
    department: 'Cardiology',
    reportedProblem: 'ECG machine producing noisy readings',
    verifiedProblem: 'Lead cable degradation confirmed',
    severity: 'NORMAL',
    status: 'Open',
    woDate: '2026-08-11',
    project: 'Fortis Cardiac Care',
    physicalLocation: 'Floor 2, Cardiology ICU',
    manufacturer: 'GE Healthcare',
    model: 'MAC 5500 HD',
    modality: 'ECG',
    assetClass: 'Patient Monitoring',
    assetStatus: 'Partially Functional',
    assetCriticality: 'High',
    serialNumber: 'GEH-2022-ECG-0112',
    callName: 'Nurse Lakshmi Devi',
    mobileNumber: '+91 97654 32109',
    emailId: 'lakshmi.d@fortis.in',
    primaryTech: 'Sunita Rao',
    secondaryTech: '',
    woCategory: 'Preventive',
    workingStatus: 'Equipment Operational',
    notes: 'Schedule replacement during off-peak hours',
  },
  {
    id: '383003',
    woType: 'PM',
    woTech: 'Vikram Singh',
    ceid: 'CE-1003',
    customer: 'Max Super Specialty',
    department: 'ICU',
    reportedProblem: 'Ventilator alarm not triggering on low O2',
    verifiedProblem: 'Sensor fault in oxygen monitoring module',
    severity: 'CRITICAL',
    status: 'Acknowledged',
    woDate: '2026-08-10',
    project: 'Max Critical Care',
    physicalLocation: 'Floor 5, Medical ICU',
    manufacturer: 'Philips Healthcare',
    model: 'Trilogy Evo',
    modality: 'Ventilator',
    assetClass: 'Life Support',
    assetStatus: 'Under Repair',
    assetCriticality: 'Critical',
    serialNumber: 'PHI-2021-VNT-0078',
    callName: 'Dr. Arun Mehta',
    mobileNumber: '+91 96543 21098',
    emailId: 'arun.mehta@maxhospital.in',
    primaryTech: 'Vikram Singh',
    secondaryTech: 'Rahul Nair',
    woCategory: 'Emergency',
    workingStatus: 'Equipment Down',
    notes: 'Backup unit deployed. Original requires immediate service',
  },
  {
    id: '383004',
    woType: 'CM',
    woTech: 'Deepa Menon',
    ceid: 'CE-1004',
    customer: 'Manipal Hospitals',
    department: 'Oncology',
    reportedProblem: 'CT Scanner showing image artifacts on axial slices',
    verifiedProblem: 'X-ray tube wear causing scatter artifacts',
    severity: 'HIGH',
    status: 'In Progress',
    woDate: '2026-08-09',
    project: 'Manipal Imaging Center',
    physicalLocation: 'Ground Floor, CT Suite',
    manufacturer: 'Canon Medical',
    model: 'Aquilion ONE',
    modality: 'CT',
    assetClass: 'Diagnostic Imaging',
    assetStatus: 'Under Maintenance',
    assetCriticality: 'High',
    serialNumber: 'CAN-2020-CT-0023',
    callName: 'Tech Lead Suresh Babu',
    mobileNumber: '+91 95432 10987',
    emailId: 'suresh.babu@manipal.edu',
    primaryTech: 'Deepa Menon',
    secondaryTech: 'Karthik Iyer',
    woCategory: 'Corrective',
    workingStatus: 'Scheduled Downtime',
    notes: 'Tube replacement ordered from manufacturer',
  },
  {
    id: '383005',
    woType: 'IS',
    woTech: 'Arjun Pillai',
    ceid: 'CE-1005',
    customer: 'AIIMS Delhi',
    department: 'Pathology',
    reportedProblem: 'Hematology analyzer offline, connectivity lost',
    verifiedProblem: 'Network interface card failure',
    severity: 'NORMAL',
    status: 'Open',
    woDate: '2026-08-08',
    project: 'AIIMS Lab Automation',
    physicalLocation: 'Block B, Pathology Lab',
    manufacturer: 'Sysmex',
    model: 'XN-3000',
    modality: 'Hematology',
    assetClass: 'Laboratory Equipment',
    assetStatus: 'Offline',
    assetCriticality: 'Medium',
    serialNumber: 'SYS-2023-HEM-0056',
    callName: 'Dr. Neha Gupta',
    mobileNumber: '+91 94321 09876',
    emailId: 'neha.gupta@aiims.edu',
    primaryTech: 'Arjun Pillai',
    secondaryTech: '',
    woCategory: 'Installation',
    workingStatus: 'Equipment Offline',
    notes: 'NIC part sourced, ETA 2 days',
  },
  {
    id: '383006',
    woType: 'PV',
    woTech: 'Kavitha Reddy',
    ceid: 'CE-1006',
    customer: 'Narayana Health',
    department: 'Surgery',
    reportedProblem: 'Surgical light flickering intermittently',
    verifiedProblem: 'Ballast unit aging, replacement needed',
    severity: 'NORMAL',
    status: 'Acknowledged',
    woDate: '2026-08-07',
    project: 'NH Surgical Suite',
    physicalLocation: 'OT Complex, Theatre 3',
    manufacturer: 'Stryker',
    model: 'POWERLED II 560',
    modality: 'Surgical Light',
    assetClass: 'Surgical Equipment',
    assetStatus: 'Functional',
    assetCriticality: 'High',
    serialNumber: 'STR-2019-SL-0089',
    callName: 'OT In-charge Meena',
    mobileNumber: '+91 93210 98765',
    emailId: 'meena.ot@narayanahealth.org',
    primaryTech: 'Kavitha Reddy',
    secondaryTech: 'Sanjay Das',
    woCategory: 'Preventive',
    workingStatus: 'Equipment Operational',
    notes: 'Schedule during non-operative hours only',
  },
  {
    id: '383007',
    woType: 'CM',
    woTech: 'Mohan Krishnan',
    ceid: 'CE-1007',
    customer: 'Aster Medcity',
    department: 'Emergency',
    reportedProblem: 'Defibrillator not charging to target joules',
    verifiedProblem: 'Capacitor bank degradation',
    severity: 'HIGH',
    status: 'Open',
    woDate: '2026-08-06',
    project: 'Aster Emergency Dept',
    physicalLocation: 'Ground Floor, Emergency Bay 2',
    manufacturer: 'Zoll Medical',
    model: 'R Series ALS',
    modality: 'Defibrillator',
    assetClass: 'Life Support',
    assetStatus: 'Under Repair',
    assetCriticality: 'Critical',
    serialNumber: 'ZOL-2022-DEF-0034',
    callName: 'Dr. Faisal Khan',
    mobileNumber: '+91 92109 87654',
    emailId: 'faisal.khan@asterhospitals.in',
    primaryTech: 'Mohan Krishnan',
    secondaryTech: 'Pradeep Varma',
    woCategory: 'Emergency',
    workingStatus: 'Equipment Down',
    notes: 'Spare unit deployed. Parts ordered on priority',
  },
  {
    id: '383008',
    woType: 'PM',
    woTech: 'Ananya Sen',
    ceid: 'CE-1008',
    customer: 'Care Hospitals',
    department: 'Neonatal ICU',
    reportedProblem: 'Infant incubator temperature instability',
    verifiedProblem: 'Heating element and thermistor drift',
    severity: 'HIGH',
    status: 'Acknowledged',
    woDate: '2026-08-05',
    project: 'Care NICU Upgrade',
    physicalLocation: 'Floor 4, NICU Ward',
    manufacturer: 'Draeger',
    model: 'Caleo 8720',
    modality: 'Incubator',
    assetClass: 'Neonatal Equipment',
    assetStatus: 'Under Calibration',
    assetCriticality: 'Critical',
    serialNumber: 'DRA-2021-INC-0067',
    callName: 'Sister Padma',
    mobileNumber: '+91 91098 76543',
    emailId: 'padma.nicu@carehospitals.com',
    primaryTech: 'Ananya Sen',
    secondaryTech: 'Tarun Bose',
    woCategory: 'Preventive Maintenance',
    workingStatus: 'Scheduled Maintenance',
    notes: 'Annual calibration due. Carry calibration kit',
  },
];

interface WorkOrderContextType {
  workOrders: WorkOrder[];
  addWorkOrder: (wo: WorkOrder) => void;
}

const WorkOrderContext = createContext<WorkOrderContextType | undefined>(undefined);

export function WorkOrderProvider({ children }: { children: ReactNode }) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(MOCK_WORK_ORDERS);

  const addWorkOrder = (wo: WorkOrder) => {
    setWorkOrders((prev) => [wo, ...prev]);
  };

  return (
    <WorkOrderContext.Provider value={{ workOrders, addWorkOrder }}>
      {children}
    </WorkOrderContext.Provider>
  );
}

export function useWorkOrders() {
  const ctx = useContext(WorkOrderContext);
  if (!ctx) throw new Error('useWorkOrders must be used inside WorkOrderProvider');
  return ctx;
}
