<script setup lang="ts">
import { useBearerStore } from '@/stores/bearer';
import { TMDB, type TV } from 'tmdb-ts';
import { computed, ref } from 'vue';
import ShowCard from '@/components/ShowCard.vue';

const bearerStore = useBearerStore();

const tmdb = new TMDB(bearerStore.bearer);

const showsList = ref<TV[]>([]);
const minPopularity = ref(0);
const currentPage = ref(1);
const totalPages = ref(99);

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

getShows();
</script>

<template>
	<div>
		<h1>TV Shows</h1>

		<label for="popularity">Min. popularity</label>
		<input type="number" id="popularity" v-model="minPopularity" />

		<div class="flex flex-wrap gap-5">
			<ShowCard v-for="show in filteredShows" :show="show" />
		</div>

		<button @click="loadMoreShows">Show more</button>
	</div>
</template>
