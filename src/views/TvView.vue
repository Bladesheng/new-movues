<script setup lang="ts">
import { useBearerStore } from '@/stores/bearer';
import { TMDB, type TV } from 'tmdb-ts';
import { ref } from 'vue';
import ShowCard from '@/components/ShowCard.vue';

const bearerStore = useBearerStore();

const tmdb = new TMDB(bearerStore.bearer);

const showsList = ref<TV[]>([]);

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

	showsList.value = shows.results.filter((show) => {
		return show.poster_path !== null;
	});

	console.log(shows.results);
}

getShows();
</script>

<template>
	<div>
		<h1>TV Shows</h1>

		<div class="flex flex-wrap gap-5">
			<ShowCard v-for="show in showsList" :show="show" />
		</div>
	</div>
</template>
