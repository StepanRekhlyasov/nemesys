import { MenuRouter, MenuParent} from 'src/shared/model/Menu.model';

const backOrder_router: MenuRouter[] = [
	{
		path: 'backOrder/search',
		title: 'menu.backOrderSearch',
		component: () => import('src/pages/user/BackOrder/BackOrderList.vue'),
		meta: {
			requiresAuth: true,
		},
		menuParent: MenuParent.BackOrder,
	}
]

export default backOrder_router;
