import { route } from 'quasar/wrappers';
import { MenuToRouter } from 'src/shared/constants/Menu.const';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router';
import routers from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

    const routes: RouteRecordRaw[]= [
      ...MenuToRouter(routers),
      {
        path: '/auth',
        component: () => import('layouts/AuthLayout.vue'),
        children: [
          { path: '/auth/login', component: () => import('pages/Auth.vue') },
        ],
      },
      {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
      },
    ];

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  return Router;
});
