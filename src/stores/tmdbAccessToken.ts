import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

const STORE_NAME = 'tmdbAccessToken';

export const useTmdbAccessToken = defineStore(STORE_NAME, () => {
	const storage = localStorage.getItem(STORE_NAME);

	const token = ref<string>(storage ?? '');

	watch(token, (newValue) => {
		localStorage.setItem(STORE_NAME, newValue);
	});

	return { token: token };
});
