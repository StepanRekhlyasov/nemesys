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
]

export default  clientRouters;
