import { UserPermissionNames } from './Accaunt.model';
import { RouteComponent } from 'vue-router';

export interface MenuRouter {
  children?: MenuRouter[];
  icon?: string;
  title?: string;
  meta?: Meta
  component?: RouteComponent;
  path: string;
  menuParent?: MenuParent;
  single?: boolean;
}

export interface Meta {
  requiresAuth: boolean;
  permission?: UserPermissionNames [];
  isAdmin?: boolean;
}

export enum MenuParent{
  ClientMenagment = 'CLIENT_MENAGMENT',
  SystemSettings = 'SYSTEM_SETTINGS',
  ApplicantManagement = 'APPLICANT_MANAGEMENT',
  AdminOfficeManagement = 'SYSTEMS_OFFICE_MANAGEMENT',
  AdminEnterpriseManagement = 'ENTERPRISE_MANAGEMENT',
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
}
