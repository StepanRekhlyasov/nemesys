import { MenuParent } from 'src/shared/model/Menu.molel';

const clientRouters = [
  {
    path: 'clients',
    component: () => import('src/pages/clients/list.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.ClientMenagment,
    title: 'menu.clientList',
    icon: 'face',
    single: true,
  },
  {
    path: 'clients',
    component: () => import('src/pages/clients/list.vue'),
    meta: { requiresAuth: true },
    title: 'menu.clientList',
    icon: 'business',
    single: true,
  }
]

export default  clientRouters;
