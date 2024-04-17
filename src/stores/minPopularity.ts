import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

const STORE_NAME = 'minPopularity';

export const useMinPopularityStore = defineStore(STORE_NAME, () => {
	const storage = localStorage.getItem(STORE_NAME);

	const minPopularity = ref<number>(Number(storage) ?? 0);

	watch(minPopularity, (newValue) => {
		localStorage.setItem(STORE_NAME, newValue.toString());
	});

	return { minPopularity: minPopularity };
});
