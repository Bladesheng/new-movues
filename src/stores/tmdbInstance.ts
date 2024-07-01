import { TMDB } from 'tmdb-ts';
import { useTmdbAccessToken } from '@/stores/tmdbAccessToken';
import { defineStore } from 'pinia';
import { computed } from 'vue';

export const useTmdbInstance = defineStore('tmdbInstance', () => {
	const tmdbAccessTokenStore = useTmdbAccessToken();

	const tmdbInstance = computed(() => {
		return new TMDB(tmdbAccessTokenStore.token);
	});

	return { tmdbInstance };
});
