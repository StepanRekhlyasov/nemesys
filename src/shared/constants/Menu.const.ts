
import { RouteRecordRaw } from 'vue-router';
import { MenuItem, MenuParent, MenuParentType, MenuRouter } from '../model/Menu.model';

export const MenuToRouter = (routers: MenuRouter[]): RouteRecordRaw[] => routers.map((route: MenuRouter): RouteRecordRaw  => {
  return {
    path: route.path,
    component: route.component,
    meta: route.meta ?  {...route.meta, parent: route.menuParent} : undefined,
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
    permissions: router.meta?.permissions,
    hideInMenu: router.meta?.hideInMenu
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

export const menuParent: MenuParentType[] = [
  {
    type: MenuParent.DashboardData,
    title: 'menu.dashboard',
    icon: 'mdi-view-dashboard-outline'
  },{
    type: MenuParent.ApplicantManagement,
    title: 'menu.applicant',
    icon: 'mdi-face-man-outline'
  },{
    type: MenuParent.BusinessMenagment,
    title: 'menu.clientManagement',
    icon: 'business'
  },{
    type: MenuParent.BackOrder,
    title: 'menu.backOrder',
    icon: 'business',
  },{
    type: MenuParent.BudgetControl,
    title: 'menu.budgetControl',
    icon: 'mdi-currency-usd',
  },{
    type: MenuParent.SystemSettings,
    title: 'menu.system',
    icon: 'mdi-cog',
  },{
    type: MenuParent.TotalizationManagement,
    title: 'menu.totalization',
    icon: 'mdi-chart-box-plus-outline',
  }
]


export const adminMenuParent: MenuParentType[] = [
  {
    type: MenuParent.AdminOfficeManagement,
    title: 'menu.admin.officeManagement',
    icon: 'corporate_fare'
  },{
    type: MenuParent.AdminEnterpriseManagement,
    title: 'menu.admin.enterpriseManagement',
    icon: 'mdi-office-building-outline'
  },{
    type: MenuParent.AdminUsers,
    title: 'menu.admin.usersManagement',
    icon: 'mdi-account-multiple'
  },{
    type: MenuParent.AdminAggregationData,
    title: 'menu.admin.aggregationData',
    icon: 'mdi-chart-box-plus-outline',
  },{
    type: MenuParent.AdminLicenseManagement,
    title: 'menu.admin.licenseManagement.licenseManagement',
    icon: 'mdi-license',
  },{
    type: MenuParent.AdminBillingInformation,
    title: 'menu.admin.billingInformation',
    icon: 'mdi-currency-usd',
  },{
    type: MenuParent.AdminSystemsOperationManagement,
    title: 'menu.admin.systemsOperationManagement',
    icon: 'mdi-movie-open',
  },{
    type: MenuParent.AdminReleaseNotes,
    title: 'menu.admin.releaseNotesInquiry',
    icon: 'mdi-forum',
  }
]
