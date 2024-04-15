import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

export const useBearerStore = defineStore('bearer', () => {
	const STORAGE_NAME = 'bearer';

	const storage = localStorage.getItem(STORAGE_NAME);

	const bearer = ref<string>(storage ?? '');

	watch(bearer, (newBearer) => {
		localStorage.setItem(STORAGE_NAME, newBearer);
	});

	return { bearer };
});
