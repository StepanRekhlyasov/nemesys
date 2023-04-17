import { MenuRouter, MenuParent} from 'src/shared/model/Menu.model';

const backOrder_router: MenuRouter[] = [
	{
		path: 'backOrder/search',
		title: 'menu.backOrderSearch',
		component: () => import('src/pages/user/BackOrder/list.vue'),
		meta: {
			requiresAuth: true,
		},
		menuParent: MenuParent.BackOrder,
	},
	{
		path: 'backOrder/list',
		title: 'menu.savedSearchConditionsList',
		component: () => import('src/pages/user/Applicant/add.vue'),
		meta: { requiresAuth: true },
		menuParent: MenuParent.BackOrder
	},
]

export default backOrder_router;
