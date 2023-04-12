import { MenuRouter } from 'src/shared/model/Menu.model';
import systemRouter from './system.router';
import clientRouters from './clients.router';
import applicantRouters from './applicant.router';
import reportRouters from './totalization.router';
import adminRouters from './admin.router';
import { routeNames } from './routeNames';
import { UserPermissionNames } from 'src/shared/model';

const routes: MenuRouter[] = [{
  path: routeNames.main,
  component: () => import('layouts/MainLayout.vue'),
  children: [
    {
      path: '',
      component: () => import('pages/Index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: 'dashboard',
      component: () => import('src/pages/user/Dashboard/Index.vue'),
      meta: { requiresAuth: true },
      title: 'menu.dashboard',
      icon: 'dashboard',
      single: true,
    },

    ...systemRouter,
    ...clientRouters,
    ...applicantRouters,
    ...reportRouters

  ]
},
{
  path: routeNames.admin,
  component: () => import('layouts/AdminLayout.vue'),
  meta:{
    permission: [UserPermissionNames.AdminPageAccess],
    requiresAuth: true,
  },
  children: [
    ...adminRouters,
  ],
}
]

export default routes;
