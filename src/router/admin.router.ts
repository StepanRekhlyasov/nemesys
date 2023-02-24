import { UserPermissionNames } from 'src/shared/model/Account.model';
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
    component: () => import('src/pages/admin/office-managment/OfficeSearch.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.AdminOfficeManagement,
    title: 'menu.officeSearch',
  },
  {
    title: 'menu.client-factory',
    path: 'client-factory',
    component: () => import('src/pages/admin/office-managment/ClientFactory.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'savedSearchList',
    component: () => import('src/pages/admin/office-managment/SavedSearchList.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.AdminOfficeManagement,
    title: 'menu.savedSearchList',
  },
  {
    path: 'users-list',
    title: 'menu.admin.usersList',
    component: () => import('src/pages/settings/management/ResponsibleMaster.vue'),
    meta: {
      isAdmin: true,
      requiresAuth: true,
      permission: [UserPermissionNames.AdminPageAccess]
    },
    menuParent: MenuParent.AdminEnterpriseManagement

  },
  {
    path: 'operation-change',
    title: 'menu.admin.operationChange',
    component: () => import('src/pages/admin/operationChange/operationСhange.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.BranchUpdate]
    },
    menuParent: MenuParent.AdminSystemsOperationManagement,

  },
  {
    path:'organizations-list',
    title: 'menu.admin.organizationsList',
    component: ()=> import('src/pages/admin/EnterpriseManagement/OrganizationsList.vue'),
    meta:{
      permission: [UserPermissionNames.AdminPageAccess],
      requiresAuth: true,
    },
    menuParent: MenuParent.AdminEnterpriseManagement
  }
]

export default admin_router;
