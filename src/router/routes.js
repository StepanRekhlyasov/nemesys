
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), meta: {requiresAuth: true} },
      { path: 'clients', component: () => import('src/pages/clients/list.vue'), meta: {requiresAuth: true} },
      { path: 'clientAdd', component: () => import('src/pages/clients/add.vue'), meta: {requiresAuth: true} },
      { path: 'dashboard', component: () => import('src/pages/dashboard/index.vue'), meta: {requiresAuth: true} },
      { path: 'users', component: () => import('src/pages/settings/Users.vue'), meta: { requiresAuth: true }  },
      { path: 'branches', component: () => import('src/pages/settings/Branches.vue'), meta: { requiresAuth: true }}
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '/auth/login', component: () => import('pages/Auth.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
