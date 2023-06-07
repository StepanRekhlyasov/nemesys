import { MenuRouter, MenuParent} from 'src/shared/model/Menu.model';

const dashboard_router: MenuRouter[] = [
  {
    path: 'dashboard',
    title: 'menu.dashboard',
    component: () => import('src/pages/user/Dashboard/DashboardPage.vue'),
    meta: { 
      requiresAuth: true, 
      applicantsUpdateOnOrganizationChange: true 
    },
    menuParent: MenuParent.DashboardData
  },
  {
    path: 'applicant-progress',
    title: 'menu.applicantProgress',
    component: () => import('src/pages/user/ApplicantProgress/ApplicantProgress.vue'),
    meta: {
      requiresAuth: true, 
      applicantsUpdateOnOrganizationChange: true
    },
    menuParent: MenuParent.DashboardData,
  },
  {
    path: 'applicant-progress/:status',
    title: 'menu.applicantProgress',
    component: () => import('src/pages/user/ApplicantProgress/ApplicantTablePage.vue'),
    meta: {
      requiresAuth: true,
      hideInMenu: true
    },
    menuParent: MenuParent.DashboardData,
  }
]

export default dashboard_router;
