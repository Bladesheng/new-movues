<script setup lang="ts">
import { useBearerStore } from '@/stores/bearer';
import { type Movie, TMDB } from 'tmdb-ts';
import { computed, onMounted, ref, watch } from 'vue';
import ShowCard from '@/components/ShowCard.vue';
import { useInfiniteScroll, useStorage } from '@vueuse/core';

const bearerStore = useBearerStore();

const minPopularity = useStorage('minPopularityMovies', 0);

const tmdb = new TMDB(bearerStore.bearer);

const moviesList = ref<Movie[]>([]);
const currentPage = ref(0);
const totalPages = ref(99);
const isLoadingMore = ref(false);

const filteredMovies = computed(() => {
	return moviesList.value.filter((movie) => {
		if (movie.poster_path === null) {
			return false;
		}

		if (movie.popularity < minPopularity.value) {
			return false;
		}

		return true;
	});
});

onMounted(async () => {
	useInfiniteScroll(
		window,
		async () => {
			await loadNextPage();
		},

		{ distance: 400 }
	);

	await loadNextPage();

	watch(
		minPopularity,
		async () => {
			await checkIfMoreExist();
		},
		{
			immediate: true,
		}
	);
});

async function loadNextPage() {
	if (currentPage.value >= totalPages.value) {
		return;
	}

	currentPage.value++;

	isLoadingMore.value = true;
	await getMovies();
	isLoadingMore.value = false;
}

async function getMovies() {
	const moviesResponse = await tmdb.discover.movie({
		// since yesterday
		'primary_release_date.gte': new Date(Date.now() - 86400000).toISOString(),
		sort_by: 'primary_release_date.asc',

		language: 'en-US',
		with_original_language: 'en',
		page: currentPage.value,
	});

	totalPages.value = moviesResponse.total_pages;

	moviesList.value.push(...moviesResponse.results);

	console.log(moviesResponse.results);
}

async function checkIfMoreExist() {
	const { scrollHeight, clientHeight } = document.documentElement;
	const scrollbarExists = scrollHeight > clientHeight;
	const morePagesExists = currentPage.value < totalPages.value;

	if (!scrollbarExists && morePagesExists) {
		await loadNextPage();

		await checkIfMoreExist();
	}
}

function onWheel(e: WheelEvent) {
	if (e.deltaY > 0) {
		minPopularity.value -= 5;
	} else {
		minPopularity.value += 5;
	}

	if (minPopularity.value < 0) {
		minPopularity.value = 0;
	}

	if (minPopularity.value > 100) {
		minPopularity.value = 100;
	}
}
</script>

<template>
	<div>
		<h1>Movies</h1>

		<label for="popularity">Min. popularity</label>
		<input type="range" v-model.number="minPopularity" min="0" max="100" @wheel.prevent="onWheel" />
		<input type="number" id="popularity" v-model="minPopularity" />

		<div class="grid gap-4">
			<ShowCard
				v-for="movie in filteredMovies"
				:linkLocation="`movie/${movie.id}`"
				:releaseDate="new Date(movie.release_date)"
				:posterPath="movie.poster_path"
				:popularity="movie.popularity"
				:name="movie.title"
			/>
		</div>

		<div v-if="isLoadingMore">@TODO LOADING SPINNER</div>
		<div v-if="currentPage === totalPages">@TODO That's all folks!</div>
	</div>
</template>

<style scoped>
.grid {
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
</style>
