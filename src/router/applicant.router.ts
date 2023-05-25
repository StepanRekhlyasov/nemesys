import { MenuRouter, MenuParent} from 'src/shared/model/Menu.model';

const applicant_router: MenuRouter[] = [
  {
    path: 'applicant/add',
    title: 'menu.newApplicant',
    component: () => import('src/pages/user/Applicant/AddApplicant.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.ApplicantManagement
  },
  {
    path: 'applicant/search',
    title: 'menu.applicantSearch',
    component: () => import('src/pages/user/Applicant/ApplicantList.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.ApplicantManagement,

  }
]

export default applicant_router;
