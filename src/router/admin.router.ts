import { UserPermissionNames } from 'src/shared/model/Accaunt.model';
import { MenuRouter, MenuParent} from 'src/shared/model/Menu.molel';

const admin_router: MenuRouter[] = [
  {
    path: 'release-notes',
    title: 'menu.admin.releaseNotes',
    component: () => import('src/pages/admin/releaseNotes.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.BranchUpdate]
    },
    menuParent: MenuParent.AdminReleaseNotes
  },
  {
    path: 'inquiry',
    title: 'menu.admin.inquiry',
    component: () => import('src/pages/admin/inquiry.vue'),
    meta: {
      requiresAuth: true,
      permission: [UserPermissionNames.BranchUpdate]
    },
    menuParent: MenuParent.AdminReleaseNotes,
  },{
    path: 'user-list',
    title: 'menu.admin.userList',
    component: ()=> import('src/pages/settings/management/ResponsibleMaster.vue'),
    meta:{
      isAdmin:true,
      requiresAuth:true
    },
    menuParent: MenuParent.AdminEnterpriseManagement
  }
]

export default admin_router;
