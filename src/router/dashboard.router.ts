import { MenuRouter, MenuParent} from 'src/shared/model/Menu.model';

const dashboard_router: MenuRouter[] = [
  {
    path: 'dashboard',
    title: 'menu.dashboard',
    component: () => import('src/pages/user/Dashboard/Index.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.DashboardData
  },
  {
    path: 'applicant-progress',
    title: 'menu.applicantProgress',
    component: () => import('src/pages/ApplicantProgress/ApplicantProgress.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.DashboardData,

  }
]

export default dashboard_router;
