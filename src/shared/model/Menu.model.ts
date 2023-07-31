import { UserPermissionNames } from './Account.model';
import { NavigationGuard, RouteComponent } from 'vue-router';

export interface MenuRouter {
  children?: MenuRouter[];
  icon?: string;
  title?: string;
  meta?: Meta
  component?: RouteComponent;
  path: string;
  menuParent?: MenuParent;
  single?: boolean;
  name?: string;
  beforeEnter?: NavigationGuard;
}

export interface Meta {
  requiresAuth: boolean;
  permissions?: UserPermissionNames [];
  isAdmin?: boolean;
  hideInMenu?: boolean;
  applicantsUpdateOnOrganizationChange?: boolean
}

export enum MenuParent{
  DashboardData = 'DASHBOARD_DATA',
  BusinessMenagment = 'BUSINESS_MENAGMENT',
  SystemSettings = 'SYSTEM_SETTINGS',
  ApplicantManagement = 'APPLICANT_MANAGEMENT',
  TotalizationManagement = 'TOTALIZATION_MANAGEMENT',
  BackOrder = 'BACK_ORDER',
  BudgetControl = 'BUDGET_CONTROL',

  AdminOfficeManagement = 'SYSTEMS_OFFICE_MANAGEMENT',
  AdminEnterpriseManagement = 'ENTERPRISE_MANAGEMENT',
  AdminUsers = 'ADMIN_USERS',
  AdminAggregationData = 'ADMIN_AGGREGATION_DATA',
  AdminLicenseManagement = 'ADMIN_LICENSE_MANAGEMENT',
  AdminBillingInformation = 'ADMIN_BILLING_INFORMATION',
  AdminSystemsOperationManagement = 'SYSTEMS_OPERATION_MANAGEMENT',
  AdminReleaseNotes = 'ADMIN_RELEASE_NOTES',
}

export interface MenuParentType {
  type: MenuParent;
  title: string;
  icon: string;
  link?: string;
  children?: MenuItem[];
}

export interface MenuItem {
  title: string;
  link?: string;
  icon?: string;
  menuParent?: MenuParent;
  permissions?: UserPermissionNames[];
  children?: MenuItem[];
  hideInMenu?: boolean;
}
