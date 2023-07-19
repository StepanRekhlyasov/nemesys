import { MenuParent } from 'src/shared/model/Menu.model';

const businessManagementRouters = [
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
    path: 'client-factories',
    component: () => import('src/pages/user/BusinessManagement/ClientFactories.vue'),
    meta: { requiresAuth: true },
    title: 'menu.clientManagement',
  },
  {
    path: 'advancedSearch',
    component: () => import('src/pages/user/BusinessManagement/AdvancedSearch.vue'),
    meta: {requiresAuth: true},
    title: 'menu.advancedSearch'
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
