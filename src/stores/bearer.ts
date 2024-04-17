import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

const STORE_NAME = 'bearer';

export const useBearerStore = defineStore(STORE_NAME, () => {
	const storage = localStorage.getItem(STORE_NAME);

	const bearer = ref<string>(storage ?? '');

	watch(bearer, (newValue) => {
		localStorage.setItem(STORE_NAME, newValue);
	});

	return { bearer };
});
