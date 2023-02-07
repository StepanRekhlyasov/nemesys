import { MenuRouter } from 'src/shared/model/Menu.molel';
import systemRouter from './system.router';
import clientRouters from './clients.router';
import applicantRouters from './applicant.router';
import { routeNames } from './routeNames';

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
      component: () => import('src/pages/dashboard/Index.vue'),
      meta: { requiresAuth: true },
      title: 'menu.dashboard',
      icon: 'dashboard',
      single: true,
    },
    ...systemRouter,
    ...clientRouters,
    ...applicantRouters

  ]
},
{
  path: routeNames.admin,
  component: () => import('layouts/AdminLayout.vue'),
}
]

export default routes;
