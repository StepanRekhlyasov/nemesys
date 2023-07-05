import { MenuRouter, MenuParent} from 'src/shared/model/Menu.model';

const budget_router: MenuRouter[] = [
  {
    path: 'budget/search',
    title: 'budget.search',
    component: () => import('src/pages/user/budget/budgetList.vue'),
    meta: { requiresAuth: true },
    menuParent: MenuParent.BudgetControl
  },
  {
    path: 'budget/add',
    title: 'budget.add',
    component: () => import('src/pages/user/budget/budgetAdd.vue'),
    meta: {
      requiresAuth: true,
    },
    menuParent: MenuParent.BudgetControl,

  }
]

export default budget_router;
