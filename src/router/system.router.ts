import { UserPermissionNames } from 'src/shared/model/Account.model';
import { MenuRouter, MenuParent} from 'src/shared/model/Menu.model';

const system_router: MenuRouter[] = [
  {
    path: 'system/editProfile',
    title: 'settings.users.editProfile',
    component: () => import('src/pages/user/Settings/EditProfile.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.SystemSettings,
  },{
    path: 'system',
    title: 'menu.system',
    component: () => import('src/pages/user/Settings/SystemSettings.vue'),
  },{
    path: 'system/users',
    title: 'menu.users',
    component: () => import('src/pages/user/Settings/management/ResponsibleMaster.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.UserUpdate]
    },
    menuParent: MenuParent.SystemSettings
  },{
    path: 'system/branches',
    title: 'menu.branches',
    component: () => import('src/pages/user/Settings/management/BranchMaster.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.BranchUpdate]
    },
    menuParent: MenuParent.SystemSettings
  },{
    path: 'system/template',
    title: 'menu.template',
    component: () => import('src/pages/user/Settings/management/TemplateMaster.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.BranchUpdate]
    },
    menuParent: MenuParent.SystemSettings
  },{
    path: 'system/item',
    title: 'menu.item',
    component: () => import('src/pages/user/Settings/management/ItemMaster.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.BranchUpdate]
    },
    menuParent: MenuParent.SystemSettings
  },
]

export default system_router;
