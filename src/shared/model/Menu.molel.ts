import { UserPermissionNames } from './Accaunt.model';
import { RouteComponent } from 'vue-router';

export interface MenuRouter {
  children?: MenuRouter[];
  icon?: string;
  title?: string;
  permissions?: UserPermissionNames [];
  meta?: {
    requiresAuth: boolean;
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
  children?: MenuItem[];
}

export interface MenuItem {
  title: string;
  link?: string;
  icon?: string;
  menuParent?: MenuParent;
  children?: MenuItem[];
}
