import { MenuParent } from 'src/shared/model/Menu.model';

const clientRouters = [
  {
    path: 'clients/officeSearch',
    component: () => import('src/pages/user/Clients/officeSearch.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.ClientMenagment,
    title: 'menu.officeSearch',
  },
  {
    path: 'clients/savedSearchList',
    component: () => import('src/pages/user/Clients/list.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.ClientMenagment,
    title: 'menu.savedSearchList',
  },
  // {
  //   path: 'clients/mapSearch',
  //   component: () => import('src/pages/clients/list.vue'),
  //   meta: { requiresAuth: true },
  //   menuParent: MenuParent.ClientMenagment,
  //   title: 'menu.mapSearch',
  // },
  // {
  //   path: 'clients/areaSearch',
  //   component: () => import('src/pages/clients/list.vue'),
  //   meta: { requiresAuth: true },
  //   menuParent: MenuParent.ClientMenagment,
  //   title: 'menu.areaSearch',
  // },
  // {
  //   path: 'clients/advancedSearch',
  //   component: () => import('src/pages/clients/list.vue'),
  //   meta: { requiresAuth: true },
  //   menuParent: MenuParent.ClientMenagment,
  //   title: 'menu.advancedSearch',
  // },
  // {
  //   path: 'clients',
  //   component: () => import('src/pages/clients/list.vue'),
  //   meta: { requiresAuth: true },
  //   menuParent: MenuParent.ClientMenagment,
  //   title: 'menu.clientList',
  //   icon: 'face',
  // },
  // {
  //   path: 'clients/:clientId',
  //   component: () => import('src/pages/clients/list.vue'),
  //   meta: { requiresAuth: true },
  //   title: 'menu.clientList',
  // },
]

export default  clientRouters;
