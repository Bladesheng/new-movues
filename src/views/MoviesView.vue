<script setup lang="ts">
import { useBearerStore } from '@/stores/bearer';
import { type Movie, type SortOption, TMDB } from 'tmdb-ts';
import { computed, onMounted, ref, watch } from 'vue';
import PosterCard from '@/components/PosterCard.vue';
import { useInfiniteScroll, useStorage } from '@vueuse/core';
import LoadingSpinner from '@/assets/LoadingSpinner.vue';
import ScaleTransitionGroup from '@/components/ScaleTransitionGroup.vue';
import Slider from 'primevue/slider';
import InputNumber from 'primevue/inputnumber';
import SelectButton from 'primevue/selectbutton';
import SidebarLeft from '@/components/SidebarLeft.vue';
import LoaderFooter from '@/components/LoaderFooter.vue';
import SelectedGenres from '@/components/SelectedGenres.vue';

const bearerStore = useBearerStore();

const minPopularity = useStorage('minPopularityMovies', 0);
const sortBy = useStorage<SortOption>('movieSortBy', 'primary_release_date.asc');
const selectedGenres = ref<number[]>([]);

const sortByOptions = [
	{
		label: 'Popularity',
		value: 'popularity.desc',
	},
	{
		label: 'Air date',
		value: 'primary_release_date.asc',
	},
];

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

watch([sortBy, selectedGenres], async () => {
	currentPage.value = 0;
	moviesList.value = [];

	await loadNextPage();
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

		with_genres: selectedGenres.value.join(','),

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
	<main class="px-4">
		<div class="flex">
			<SidebarLeft>
				<div class="flex flex-col gap-2">
					<label for="popularity">Minimal popularity</label>

					<div class="flex items-center gap-4">
						<Slider
							v-model="minPopularity"
							:min="0"
							:max="100"
							@wheel.prevent="onWheel"
							class="h-2 w-40"
						/>

						<InputNumber
							v-model="minPopularity"
							inputId="popularity"
							inputClass="w-14 h-10 text-center"
						/>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<div>Sort by</div>

					<SelectButton
						v-model="sortBy"
						:options="sortByOptions"
						:optionLabel="(data) => data.label"
						:optionValue="(data) => data.value"
					/>
				</div>

				<SelectedGenres mediaType="movies" v-model="selectedGenres" />
			</SidebarLeft>

			<div class="flex-grow">
				<div class="grid gap-4">
					<ScaleTransitionGroup>
						<PosterCard
							v-for="movie in filteredMovies"
							:key="movie.id"
							:linkLocation="`movie/${movie.id}`"
							:releaseDate="new Date(movie.release_date)"
							:posterPath="movie.poster_path"
							:popularity="movie.popularity"
							:name="movie.title"
						/>
					</ScaleTransitionGroup>
				</div>

				<LoaderFooter :isLoadingMore="currentPage === totalPages" />
			</div>
		</div>
	</main>
</template>

<style scoped>
.grid {
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
</style>
