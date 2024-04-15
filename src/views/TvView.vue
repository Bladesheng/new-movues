<script setup lang="ts">
import { useBearerStore } from '@/stores/bearer';
import { TMDB, type TV } from 'tmdb-ts';
import { computed, ref } from 'vue';
import ShowCard from '@/components/ShowCard.vue';

const bearerStore = useBearerStore();

const tmdb = new TMDB(bearerStore.bearer);

const showsList = ref<TV[]>([]);

const minPopularity = ref(0);

async function getShows() {
	const shows = await tmdb.discover.tvShow({
		// since yesterday
		'first_air_date.gte': new Date(Date.now() - 86400000).toISOString(),

		include_null_first_air_dates: false,
		language: 'en-US',
		with_original_language: 'en',
		page: 1,

		//@ts-ignore
		sort_by: 'first_air_date.asc',
	});

	showsList.value = shows.results;

	console.log(shows.results);
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
	</div>
</template>
