
import { MenuRouter, MenuParent } from 'src/shared/model/Menu.model';

const jobadRouters: MenuRouter[] = [
  {
    path: 'jobSearch',
    title: 'job.jobSearch',
    component: () => import('src/pages/user/JobAd/jobSearch.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.JobAdManagement,
  }, {
    path: 'jobPostingHistory',
    title: 'job.jobPostingHistory',
    component: () => import('src/pages/user/JobAd/jobPostingHistory.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.JobAdManagement,
  }, {
    path: 'regionSalarySettings',
    title: 'job.regionSalarySettings',
    component: () => import('src/pages/user/JobAd/regionSalarySettings.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.JobAdManagement,
  }, {
    path: 'formatSettings',
    title: 'job.formatSettings',
    component: () => import('src/pages/user/JobAd/formatSettings.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.JobAdManagement,
  }, {
    path: 'phraseSettings',
    title: 'job.phraseSettings',
    component: () => import('src/pages/user/JobAd/phraseSettings.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.JobAdManagement,
  }, {
    path: 'jobItemSettings',
    title: 'job.jobItemSettings',
    component: () => import('src/pages/user/JobAd/jobItemSettings.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.JobAdManagement,
  },
]

export default jobadRouters;
