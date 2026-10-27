export type UserRole = 'manager' | 'supervisor' | 'technician' | 'employee';

export interface RoleCapabilities {
  canCreateWorkOrder: boolean;
  canEditWorkOrder: boolean;
  canReassignWorkOrder: boolean;
  canDeleteWorkOrder: boolean;
}

/**
 * Action-level capabilities per role.
 */
export const ROLE_CAPABILITIES: Record<UserRole, RoleCapabilities> = {
  // User 001: Manager has full access to all actions
  manager: {
    canCreateWorkOrder: true,
    canEditWorkOrder: true,
    canReassignWorkOrder: true,
    canDeleteWorkOrder: true,
  },

  // User 002: Supervisor can create (+), edit, and reassign
  supervisor: {
    canCreateWorkOrder: true,
    canEditWorkOrder: true,
    canReassignWorkOrder: true,
    canDeleteWorkOrder: false,
  },

  // User 003: Technician has view-only access (no create/edit/reassign)
  technician: {
    canCreateWorkOrder: false,
    canEditWorkOrder: false,
    canReassignWorkOrder: false,
    canDeleteWorkOrder: false,
  },

  employee: {
    canCreateWorkOrder: false,
    canEditWorkOrder: false,
    canReassignWorkOrder: false,
    canDeleteWorkOrder: false,
  },
};

/**
 * Centralized mapping of top-level menu access rights per role.
 * '*' denotes full unrestricted access.
 */
export const ROLE_MENU_PERMISSIONS: Record<UserRole, readonly string[] | '*'> = {
  // User 001: All access
  manager: '*',

  // User 002: Dashboard, Asset Management (AM), Service Management (SM), Superfind
  supervisor: [
    'dashboard',
    'asset',
    'service',
    'superfind',
  ],

  // User 003: Dashboard, Service Management (SM), Superfind
  technician: [
    'dashboard',
    'service',
    'superfind',
  ],

  employee: [
    'dashboard',
    'service',
    'superfind',
  ],
};

/**
 * Sub-item whitelist mapping per role.
 * Only the sub-items explicitly listed here will appear in the drawer menu for that role.
 */
export const ROLE_SUBMENU_PERMISSIONS: Partial<Record<UserRole, Record<string, readonly string[] | '*'>>> = {
  // User 002: Supervisor allowed sub-items
  supervisor: {
    dashboard: [
      'cec_dashboard',
      'cm_workorders',
      'manage_daily_pv_1',
      'manage_daily_pv_2',
    ],
    asset: [
      'am_add_new_asset',
    ],
    service: [
      'sm_cm_work_orders_list',
      'sm_pm_work_orders_list',
      'sm_manage_projects',
    ],
  },

  // User 003: Technician allowed sub-items
  technician: {
    dashboard: [
      'cm_workorders',
    ],
    service: [
      'sm_cm_work_orders_list',
      'sm_pm_work_orders_list',
    ],
  },
};

/**
 * Check if a given role has access to a top-level menu key.
 */
export function hasMenuAccess(role: UserRole | string | null | undefined, menuKey: string): boolean {
  if (!role) return false;
  const userRole = role as UserRole;
  const permissions = ROLE_MENU_PERMISSIONS[userRole];
  
  if (!permissions) return false;
  if (permissions === '*') return true;
  return permissions.includes(menuKey);
}

/**
 * Check if a given role can view a specific sub-menu item within a menu section.
 */
export function hasSubMenuAccess(
  role: UserRole | string | null | undefined,
  menuKey: string,
  subKey: string
): boolean {
  if (!role) return false;
  const userRole = role as UserRole;
  if (userRole === 'manager') return true;

  const roleSubMap = ROLE_SUBMENU_PERMISSIONS[userRole];
  if (!roleSubMap) return true;

  const allowedForMenu = roleSubMap[menuKey];
  if (!allowedForMenu) {
    return true;
  }
  if (allowedForMenu === '*') return true;
  return allowedForMenu.includes(subKey);
}

/**
 * Check if a role has a specific capability / permission.
 */
export function hasCapability(
  role: UserRole | string | null | undefined,
  action: keyof RoleCapabilities
): boolean {
  if (!role) return false;
  const userRole = role as UserRole;
  const caps = ROLE_CAPABILITIES[userRole];
  return caps ? !!caps[action] : false;
}

/**
 * Visual badge styling info for role display in UI / headers.
 */
export function getRoleBadgeInfo(role: UserRole | string | null | undefined): {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
} {
  switch (role) {
    case 'manager':
      return {
        label: 'Manager',
        bgColor: '#EFF6FF',
        textColor: '#1D4ED8',
        borderColor: '#BFDBFE',
      };
    case 'supervisor':
      return {
        label: 'Supervisor',
        bgColor: '#F5F3FF',
        textColor: '#6D28D9',
        borderColor: '#DDD6FE',
      };
    case 'technician':
      return {
        label: 'Technician',
        bgColor: '#ECFDF5',
        textColor: '#047857',
        borderColor: '#A7F3D0',
      };
    case 'employee':
    default:
      return {
        label: 'Employee',
        bgColor: '#F1F5F9',
        textColor: '#475569',
        borderColor: '#CBD5E1',
      };
  }
}
