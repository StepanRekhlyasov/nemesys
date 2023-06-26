import { MenuRouter, MenuParent} from 'src/shared/model/Menu.model';

const report_router: MenuRouter[] = [


  {
    path: 'totalization/SAA',
    title: 'menu.SAA',
    component: () => import('src/pages/user/SAA/SAAPage.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.TotalizationManagement,
  },
  {
    path: 'totalization/kpi',
    title: 'menu.KPI',
    component: () => import('src/pages/user/KPI/KPIPage.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.TotalizationManagement,
  },
  {
    path: 'totalization/report',
    title: 'menu.report',
    component: () => import('src/pages/user/Totalization/TotalizationReport.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.TotalizationManagement,
  },
]

export default report_router;
