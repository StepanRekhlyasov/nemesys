import { UserPermissionNames } from 'src/shared/model/Account.model';
import { MenuRouter, MenuParent} from 'src/shared/model/Menu.molel';

const system_router: MenuRouter[] = [
  {
    path: 'system/editProfile',
    title: 'settings.users.editProfile',
    component: () => import('src/pages/settings/EditProfile.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.SystemSettings,
  },{
    path: 'system',
    title: 'menu.system',
    component: () => import('src/pages/settings/SystemSettings.vue'),
  },{
    path: 'system/users',
    title: 'menu.users',
    component: () => import('src/pages/settings/management/ResponsibleMaster.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.UserUpdate]
    },
    menuParent: MenuParent.SystemSettings
  },{
    path: 'system/branches',
    title: 'menu.branches',
    component: () => import('src/pages/settings/management/BranchMaster.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.BranchUpdate]
    },
    menuParent: MenuParent.SystemSettings
  },{
    path: 'system/template',
    title: 'menu.template',
    component: () => import('src/pages/settings/management/TemplateMaster.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.BranchUpdate]
    },
    menuParent: MenuParent.SystemSettings
  },{
    path: 'system/item',
    title: 'menu.item',
    component: () => import('src/pages/settings/management/ItemMaster.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.BranchUpdate]
    },
    menuParent: MenuParent.SystemSettings
  },
]

export default system_router;
