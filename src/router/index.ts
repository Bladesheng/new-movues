import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MoviesView from '@/views/MoviesView.vue';
import SettingsView from '@/views/SettingsView.vue';
import TvView from '@/views/TvView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),

	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},

		{
			path: '/movies',
			name: 'movies',
			component: MoviesView,
			meta: {
				title: 'Movies',
			},
		},

		{
			path: '/settings',
			name: 'settings',
			component: SettingsView,
			meta: {
				title: 'Settings',
			},
		},

		{
			path: '/tv',
			name: 'tv',
			component: TvView,
			meta: {
				title: 'TV',
			},
		},
	],
});

router.afterEach((to, from) => {
	switch (to.name) {
		case 'home': {
			document.title = 'MoVues';
			break;
		}

		default: {
			document.title = `${to.meta.title?.toString()} - MoVues`;
			break;
		}
	}
});

export default router;
