import { MenuRouter, MenuParent} from 'src/shared/model/Menu.model';

const report_router: MenuRouter[] = [

  {
    path: 'totalization/report',
    title: 'menu.report',
    component: () => import('src/pages/user/Totalization/TotalizationReport.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.TotalizationManagement,

  }
]

export default report_router;
