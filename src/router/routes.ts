import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'clients',
        component: () => import('src/pages/clients/list.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'clientAdd',
        component: () => import('src/pages/clients/add.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'clientDetail/:id',
        component: () => import('src/pages/clients/detail.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard',
        component: () => import('src/pages/dashboard/Index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'system/users',
        component: () => import('src/pages/settings/UsersList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'system/users/add',
        component: () => import('src/pages/settings/UserCreate.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'system/branches',
        component: () => import('src/pages/settings/Branches.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '/auth/login', component: () => import('pages/Auth.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
