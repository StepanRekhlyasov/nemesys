import { MenuRouter, MenuParent} from 'src/shared/model/Menu.molel';

const applicant_router: MenuRouter[] = [
  {
    path: 'applicant/add',
    title: 'menu.newApplicant',
    component: () => import('src/pages/applicant/add.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.ApplicantManagement
  },
  {
    path: 'applicant/search',
    title: 'menu.applicantSearch',
    component: () => import('src/pages/applicant/list.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.ApplicantManagement,

  }
]

export default applicant_router;
