<script setup lang="ts">
import { type Movie, type MovieDiscoverResult, type SortOption } from 'tmdb-ts';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import PosterCard from '@/components/PosterCard.vue';
import { useInfiniteScroll, useMounted, useStorage } from '@vueuse/core';
import ScaleTransitionGroup from '@/components/ScaleTransitionGroup.vue';
import SidebarLeft from '@/components/SidebarLeft.vue';
import LoaderFooter from '@/components/LoaderFooter.vue';
import SelectedGenres from '@/components/filters/SelectedGenres.vue';
import SortOptions from '@/components/filters/SortOptions.vue';
import SliderWithInput from '@/components/filters/SliderWithInput.vue';
import Button from 'primevue/button';
import { RouterLink } from 'vue-router';
import { useTmdbInstance } from '@/stores/tmdbInstance';

const minPopularity = useStorage('minPopularityMovies', 0);
const sortBy = useStorage<SortOption>('movieSortBy', 'primary_release_date.asc');
const selectedGenres = ref<number[]>([]);
const maxDaysOld = useStorage('movieMaxDaysOld', 1);

const tmdb = useTmdbInstance().tmdbInstance;
const responses = ref<MovieDiscoverResult[]>([]);
const currentPage = ref(0);
const totalPages = ref(99);
const isLoadingMore = ref(false);
const isMounted = useMounted();
const isSidebarOpen = useStorage<boolean>(
	'isSidebarOpen',
	// hidden on phone by default
	window.innerWidth >= 650
);
const filteredMovies = computed<Movie[]>(() => {
	// responses can be added to the array in random order
	responses.value.sort((a, b) => {
		return a.page - b.page;
	});

	const moviesOnly = responses.value.flatMap((response) => {
		return response.results;
	});

	return moviesOnly.filter((movie) => {
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

		{
			distance: 400,
			canLoadMore: () => {
				return isMounted.value;
			},
		}
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

onUnmounted(() => {
	isMounted.value = false;
});

watch([sortBy, selectedGenres, maxDaysOld], async () => {
	currentPage.value = 0;
	responses.value = [];

	await loadNextPage();
	await checkIfMoreExist();
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
	// When awaiting the response, the filters can change.
	// When filters are modified, we want to start with fresh array, and we don't want to put the
	// pending responses to the new array (duplication, wrong results, etc.).
	// Ideal solution would be to abort all pending requests when filters change,
	// but tmdb-ts library doesn't support that.
	const responsesReferenceSnapshot = responses.value;

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

	// if the original responses ref array was reassigned, we don't want to push the response to the new array
	responsesReferenceSnapshot.push(moviesResponse);

	console.log(moviesResponse.results);
}

async function checkIfMoreExist() {
	const { scrollHeight, clientHeight } = document.documentElement;
	const scrollbarExists = scrollHeight > clientHeight;
	const morePagesExists = currentPage.value < totalPages.value;

	if (!scrollbarExists && morePagesExists && isMounted.value) {
		await loadNextPage();

		await checkIfMoreExist();
	}
}
</script>

<template>
	<main class="px-4">
		<div class="flex">
			<SidebarLeft v-model:isOpen="isSidebarOpen">
				<SliderWithInput
					v-model:currentValue="minPopularity"
					id="popularity"
					label="Minimal popularity"
				/>

				<SliderWithInput
					v-model:currentValue="maxDaysOld"
					id="daysOld"
					label="Max. movie age (days)"
					:max="30"
				/>

				<SortOptions
					v-model:sortBy="sortBy"
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

				<SelectedGenres v-model:selectedGenres="selectedGenres" mediaType="movies" />
			</SidebarLeft>

			<div class="flex flex-grow flex-col gap-2">
				<div class="self-end">
					<Button
						icon="pi pi pi-sliders-h"
						severity="secondary"
						iconClass="text-xl"
						size="small"
						@click="isSidebarOpen = true"
					/>
				</div>

				<div class="grid gap-4">
					<ScaleTransitionGroup>
						<RouterLink
							v-for="movie in filteredMovies"
							:key="movie.id"
							:to="{ name: 'movieDetails', params: { id: movie.id } }"
							class="visited:text-gray-400"
						>
							<PosterCard
								:releaseDate="new Date(movie.release_date)"
								:posterPath="movie.poster_path"
								:popularity="movie.popularity"
								:voteAverage="movie.vote_average"
								:voteCount="movie.vote_count"
								:name="movie.title"
							/>
						</RouterLink>
					</ScaleTransitionGroup>
				</div>

				<LoaderFooter :isLoadingMore="currentPage < totalPages" />
			</div>
		</div>
	</main>
</template>

<style scoped>
.grid {
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
</style>
