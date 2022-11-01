import { UserPermissionNames } from './Accaunt.model';
import { RouteComponent } from 'vue-router';

export interface MenuRouter {
  children?: MenuRouter[];
  icon?: string;
  title?: string;
  meta?: {
    requiresAuth: boolean;
    permissions?: UserPermissionNames [];
  }
  component?: RouteComponent;
  path: string;
  menuParent?: MenuParent;
  single?: boolean;
}

export enum MenuParent{
  ClientMenagment = 'CLIENT_MENAGMENT',
  SystemSettings = 'SYSTEM_SETTINGS',
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
