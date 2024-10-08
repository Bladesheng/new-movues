import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MoviesListView from '@/views/MoviesListView.vue';
import SettingsView from '@/views/SettingsView.vue';
import TvListView from '@/views/TvListView.vue';
import TvDetailsView from '@/views/TvDetailsView.vue';
import MovieDetailsView from '@/views/MovieDetailsView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),

	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
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
			path: '/movies',
			name: 'movies',
			component: MoviesListView,
			meta: {
				title: 'Movies',
			},
		},

		{
			path: '/movies/:id',
			name: 'movieDetails',
			component: MovieDetailsView,
			meta: {
				title: 'Movies',
			},
		},

		{
			path: '/tv',
			name: 'tv',
			component: TvListView,
			meta: {
				title: 'TV',
			},
		},

		{
			path: '/tv/:id',
			name: 'tvDetails',
			component: TvDetailsView,
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
