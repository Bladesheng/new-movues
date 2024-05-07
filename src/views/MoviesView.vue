<script setup lang="ts">
import { useBearerStore } from '@/stores/bearer';
import { type Movie, type SortOption, TMDB } from 'tmdb-ts';
import { computed, onMounted, ref, watch } from 'vue';
import PosterCard from '@/components/PosterCard.vue';
import { useInfiniteScroll, useStorage } from '@vueuse/core';
import ScaleTransitionGroup from '@/components/ScaleTransitionGroup.vue';
import SidebarLeft from '@/components/SidebarLeft.vue';
import LoaderFooter from '@/components/LoaderFooter.vue';
import SelectedGenres from '@/components/filters/SelectedGenres.vue';
import SortOptions from '@/components/filters/SortOptions.vue';
import SliderWithInput from '@/components/filters/SliderWithInput.vue';

const bearerStore = useBearerStore();

const minPopularity = useStorage('minPopularityMovies', 0);
const sortBy = useStorage<SortOption>('movieSortBy', 'primary_release_date.asc');
const selectedGenres = ref<number[]>([]);
const maxDaysOld = useStorage('movieMaxDaysOld', 1);

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

watch([sortBy, selectedGenres, maxDaysOld], async () => {
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
		'primary_release_date.gte': new Date(
			Date.now() - maxDaysOld.value * 24 * 60 * 60 * 1000
		).toISOString(),

		sort_by: sortBy.value,

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
</script>

<template>
	<main class="px-4">
		<div class="flex">
			<SidebarLeft>
				<SliderWithInput v-model="minPopularity" id="popularity" label="Minimal popularity" />

				<SliderWithInput
					v-model="maxDaysOld"
					id="daysOld"
					label="Max. movie age (days)"
					:max="30"
				/>

				<SortOptions
					v-model="sortBy"
					:sortByOptions="[
						{
							label: 'Air date',
							value: 'primary_release_date.asc',
						},
						{
							label: 'Popularity',
							value: 'popularity.desc',
						},
					]"
				/>

				<SelectedGenres v-model="selectedGenres" mediaType="movies" />
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
							:voteAverage="movie.vote_average"
							:voteCount="movie.vote_count"
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
