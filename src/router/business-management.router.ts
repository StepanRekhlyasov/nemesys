import { MenuParent } from 'src/shared/model/Menu.model';

const businessManagementRouters = [
  {
    path: 'client-factories',
    component: () => import('src/pages/user/BusinessManagement/ClientFactories.vue'),
    meta: { requiresAuth: true },
    title: 'menu.clientManagement',
  },
  {
    path: 'officeSearch',
    component: () => import('src/pages/user/BusinessManagement/OfficeMenu.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.BusinessMenagment,
    title: 'menu.officeSearch',
  },
  {
    path: 'savedSearchList',
    component: () => import('src/pages/user/BusinessManagement/SavedSearchList.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.BusinessMenagment,
    title: 'menu.savedSearchList',
  },
  {
    path: 'faxHistoryList',
    component: () => import('src/pages/user/BusinessManagement/FaxHistoryList.vue'),
    meta: {requiresAuth: true},
    menuParent: MenuParent.BusinessMenagment,
    title: 'menu.faxHistory'
  }
]

export default businessManagementRouters;
