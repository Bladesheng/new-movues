<script setup lang="ts">
import { useBearerStore } from '@/stores/bearer';
import { TMDB, type TV } from 'tmdb-ts';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import ShowCard from '@/components/ShowCard.vue';

const bearerStore = useBearerStore();

const tmdb = new TMDB(bearerStore.bearer);

const showsList = ref<TV[]>([]);
const minPopularity = ref(0);
const currentPage = ref(0);
const totalPages = ref(99);
const isLoadingMore = ref(false);

const filteredShows = computed(() => {
	return showsList.value.filter((show) => {
		if (show.poster_path === null) {
			return false;
		}

		if (show.popularity < minPopularity.value) {
			return false;
		}

		return true;
	});
});

onMounted(async () => {
	window.addEventListener('scroll', infiniteScrollListener);

	await loadMoreShows();

	await checkIfMoreExist();

	async function checkIfMoreExist() {
		const { scrollHeight, clientHeight } = document.documentElement;
		const scrollbarExists = scrollHeight > clientHeight;
		const morePagesExists = currentPage.value < totalPages.value;

		if (!scrollbarExists && morePagesExists) {
			await loadMoreShows();

			await checkIfMoreExist();
		}
	}
});

onUnmounted(() => {
	window.removeEventListener('scroll', infiniteScrollListener);
});

async function loadMoreShows() {
	if (currentPage.value >= totalPages.value) {
		return;
	}

	currentPage.value++;

	await getShows();
}

async function getShows() {
	const showsResponse = await tmdb.discover.tvShow({
		// since yesterday
		'first_air_date.gte': new Date(Date.now() - 86400000).toISOString(),

		include_null_first_air_dates: false,
		language: 'en-US',
		with_original_language: 'en',
		page: currentPage.value,

		//@ts-ignore
		sort_by: 'first_air_date.asc',
	});

	totalPages.value = showsResponse.total_pages;

	showsList.value.push(...showsResponse.results);

	console.log(showsResponse.results);
}

async function infiniteScrollListener() {
	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	const nearBottom = scrollTop + clientHeight >= scrollHeight - 400;

	if (nearBottom && !isLoadingMore.value) {
		isLoadingMore.value = true;

		await loadMoreShows();

		isLoadingMore.value = false;
	}
}
</script>

<template>
	<div>
		<h1>TV Shows</h1>

		<label for="popularity">Min. popularity</label>
		<input type="number" id="popularity" v-model="minPopularity" />

		<div class="flex flex-wrap gap-5">
			<ShowCard v-for="show in filteredShows" :show="show" />
		</div>

		<div v-if="isLoadingMore">LOADING SPINNER</div>
	</div>
</template>
