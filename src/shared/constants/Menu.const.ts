
import { RouteRecordRaw } from 'vue-router';
import { MenuItem, MenuParent, MenuParentType, MenuRouter } from '../model/Menu.molel';

export const MenuToRouter = (routers: MenuRouter[]): RouteRecordRaw[] => routers.map((route: MenuRouter): RouteRecordRaw  => {
  return {
    path: route.path,
    component: route.component,
    meta: route.meta,
    children: route.children ? MenuToRouter(route.children) : [],
  }
})

export const RouterToMenu = (routers: MenuRouter[]):MenuItem[] => routers.reduce((items:MenuItem[], route: MenuRouter ):MenuItem[] => {
  if (route.children && route.menuParent) {
    return [...items, ...RouterToMenu(route.children), RouterToMemuItem(route)]
  }
  if (route.children) {
    return [...items, ...RouterToMenu(route.children)]
  }
  if (route.menuParent) {
    return [...items, RouterToMemuItem(route)]
  }
  return [...items]
}, [] as MenuItem [] )

export const RouterToMemuItem = (router: MenuRouter): MenuItem => {
  return {
    link: '/'+router.path,
    menuParent: router.menuParent,
    title: router.title,
    icon: router.icon,
    permissions: router.meta?.permissions
  } as MenuItem;
}

export const RouterToSingleMenuItem = (routers: MenuRouter[]):MenuItem[] => routers.reduce((items:MenuItem[], route: MenuRouter):MenuItem[] => {
  if (route.children && route.single) {
    return [...items, ...RouterToSingleMenuItem(route.children), RouterToMemuItem(route)]
  }
  if (route.children) {
    return [...items, ...RouterToSingleMenuItem(route.children)]
  }
  if (route.single) {
    return [...items, RouterToMemuItem(route)]
  }
  return [...items]
}, [] as MenuItem[])

export const menuParent: MenuParentType[] = [{
  type: MenuParent.ClientMenagment,
  title: 'menu.clientManagement',
  icon: 'mdi-office-building-outline'
},{
  type: MenuParent.SystemSettings,
  title: 'menu.system',
  icon: 'mdi-cog',
}]
