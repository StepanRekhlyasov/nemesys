import { MenuRouter, MenuParent} from 'src/shared/model/Menu.molel';

const system_router: MenuRouter[] = [
  {
    path: 'system/users',
    title: 'menu.users',
    component: () => import('src/pages/settings/UsersList.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.SystemSettings
  },
  {
    path: 'system/branches',
    title: 'menu.branches',
    icon: 'mdi-cog',
    component: () => import('src/pages/settings/branch/Branches.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.SystemSettings
  }
]

export default system_router;