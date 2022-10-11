import { RouteRecordRaw } from 'vue-router';

const system_router: RouteRecordRaw[] = [
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
    component: () => import('src/pages/settings/branch/Branches.vue'),
    meta: { requiresAuth: true },
  }
]

export default system_router;
