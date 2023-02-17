import { UserPermissionNames } from 'src/shared/model/Accaunt.model';
import { MenuRouter, MenuParent } from 'src/shared/model/Menu.molel';

const admin_router: MenuRouter[] = [
  {
    path: 'release-notes',
    title: 'menu.admin.releaseNotes',
    component: () => import('src/pages/admin/releaseNotes.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.AdminPageAccess]
    },
    menuParent: MenuParent.AdminReleaseNotes
  },
  {
    path: 'inquiry',
    title: 'menu.admin.inquiry',
    component: () => import('src/pages/admin/inquiry.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.AdminPageAccess]
    },
    menuParent: MenuParent.AdminReleaseNotes,

  },
  {
    path: 'officeSearch',
    component: () => import('src/pages/admin-office-managment/OfficeSearch.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.AdminPageAccess]
    },
    menuParent: MenuParent.AdminOfficeManagement,
    title: 'menu.officeSearch',
  },
  {
    path: 'savedSearchList',
    component: () => import('src/pages/admin-office-managment/SavedCriteriaList.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.AdminOfficeManagement,
    title: 'menu.savedSearchList',
  },
  {
    path: 'user-list',
    title: 'menu.admin.userList',
    component: () => import('src/pages/settings/management/ResponsibleMaster.vue'),
    meta: {
      isAdmin: true,
      requiresAuth: true,
      permission: [UserPermissionNames.AdminPageAccess]
    },
    menuParent: MenuParent.AdminEnterpriseManagement
  }
]

export default admin_router;
