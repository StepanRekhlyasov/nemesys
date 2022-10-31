import { MenuRouter } from 'src/shared/model/Menu.molel';
import systemRouter from './system.router';
import clientRouters from './clients.router';

const routes: MenuRouter[] = [{
  path: '/',
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
    ...clientRouters
  ]
}]

export default routes;
