import { UserPermissionNames } from 'src/shared/model/Account.model';
import { MenuRouter, MenuParent } from 'src/shared/model/Menu.model';

const admin_router: MenuRouter[] = [
  {
    path: 'release-notes',
    title: 'menu.admin.releaseNotes',
    component: () => import('src/pages/admin/ReleaseNotes/ReleaseNotes.vue'),
    meta: {
      requiresAuth: true,
      permissions: [UserPermissionNames.AdminPageAccess],
      isAdmin: true
    },
    menuParent: MenuParent.AdminReleaseNotes
  },
  {
    path: 'inquiry',
    title: 'menu.admin.inquiry',
    component: () => import('src/pages/admin/InquiryPage/InquiryPage.vue'),
    meta: {
      requiresAuth: true,
      permissions: [UserPermissionNames.AdminPageAccess],
      isAdmin: true
    },
    menuParent: MenuParent.AdminReleaseNotes,

  },
  {
    path: 'officeSearch',
    component: () => import('src/pages/admin/OfficeManagement/OfficeMenu.vue'),
    meta: {
      requiresAuth: true,
      isAdmin: true
    },
    menuParent: MenuParent.AdminOfficeManagement,
    title: 'menu.officeSearch',
  },
  {
    title: 'menu.admin.officeManagement',
    path: 'client-factories',
    component: () => import('src/pages/admin/OfficeManagement/ClientFactories.vue'),
    meta: {
      requiresAuth: true,
      isAdmin: true
    },
  },
  {
    path: 'savedSearchList',
    component: () => import('src/pages/admin/OfficeManagement/SavedSearchList.vue'),
    meta: {
      requiresAuth: true,
      isAdmin: true
    },
    menuParent: MenuParent.AdminOfficeManagement,
    title: 'menu.savedSearchList',
  },
  {
    path: 'users-list',
    title: 'menu.admin.usersList',
    component: () => import('src/pages/user/Settings/management/ResponsibleMaster.vue'),
    meta: {
      isAdmin: true,
      requiresAuth: true,
      permissions: [UserPermissionNames.AdminPageAccess]
    },
    menuParent: MenuParent.AdminEnterpriseManagement

  },
  {
    path: 'operation-change',
    title: 'menu.admin.operationChange',
    component: () => import('src/pages/admin/OperationChanges/OperationChange.vue'),
    meta: {
      requiresAuth: true,
      isAdmin: true,
      permissions: [UserPermissionNames.AdminPageAccess]
    },
    menuParent: MenuParent.AdminSystemsOperationManagement,

  },
  {
    path: 'organizations-list',
    title: 'menu.admin.organizationsList',
    component: () => import('src/pages/admin/EnterpriseManagement/OrganizationsList.vue'),
    meta: {
      permissions: [UserPermissionNames.AdminPageAccess],
      requiresAuth: true,
      isAdmin: true
    },
    menuParent: MenuParent.AdminEnterpriseManagement
  },
  {
    path: 'operation-history',
    title: 'menu.admin.operationHistory',
    component: () => import('src/pages/admin/OperationHistoryTable/OperationHistory.vue'),
    meta: {
      requiresAuth: true,
      permissions: [UserPermissionNames.AdminPageAccess],
      isAdmin: true
    },
    menuParent: MenuParent.AdminSystemsOperationManagement,
  },
  {
    path: 'various-fee-aggregates',
    title: 'menu.admin.variousFeeAggregates',
    component: () => import('src/pages/admin/BillingManagement/VariousFeeAggregatesPage.vue'),
    meta: {
      requiresAuth: true,
      permissions: [UserPermissionNames.AdminPageAccess],
      isAdmin: true
    },
    menuParent: MenuParent.AdminBillingInformation,
  },
  {
    path: 'billing-history',
    title: 'menu.admin.billingHistory',
    component: () => import('src/pages/admin/BillingManagement/BillingHistoryPage.vue'),
    meta: {
      requiresAuth: true,
      permissions: [UserPermissionNames.AdminPageAccess],
      isAdmin: true
    },
    menuParent: MenuParent.AdminBillingInformation,
  },
  {
    path: 'license-request',
    title: 'menu.admin.licenseManagement.licenseRequest',
    meta: {
      requiresAuth: true,
      permissions: [UserPermissionNames.AdminPageAccess]
    },
    menuParent: MenuParent.AdminLicenseManagement,
    component: () => import('src/pages/admin/LicenseManagement/Requests/LicenseRequests.vue')
  },
  {
    path: 'license-history',
    title: 'menu.admin.licenseManagement.licenseHistory',
    meta: {
      requiresAuth: true,
      permissions: [UserPermissionNames.AdminPageAccess]
    },
    menuParent: MenuParent.AdminLicenseManagement,
    component: () => import('src/pages/admin/LicenseManagement/History/LicenseHistory.vue')
  },
  {
    path: 'license-statistic',
    title: 'menu.admin.licenseManagement.licenseStatistic',
    meta: {
      requiresAuth: true,
      permissions: [UserPermissionNames.AdminPageAccess]
    },
    menuParent: MenuParent.AdminLicenseManagement,
    component: () => import('src/pages/admin/LicenseManagement/Statistic/LicenseStatistic.vue')

  }
]

export default admin_router;
