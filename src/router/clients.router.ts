import { MenuParent } from 'src/shared/model/Menu.molel';

const clientRouters = [
  {
    path: 'clients',
    component: () => import('src/pages/clients/list.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.ClientMenagment,
    title: 'menu.clientList',
    icon: 'mdi-account-search',
  },
  {
    path: 'clientAdd',
    component: () => import('src/pages/clients/add.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.ClientMenagment,
    title: 'menu.clientReg',
    icon: 'mdi-account',
  },
  {
    path: 'clientDetail/:id',
    component: () => import('src/pages/clients/detail.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'clientDetail/:clientId/:officeId',
    component: () => import('src/pages/clients/components/office.vue'),
    meta: { requiresAuth: true },
  }
]

export default  clientRouters;
