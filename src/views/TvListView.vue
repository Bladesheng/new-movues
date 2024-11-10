<script setup lang="ts">
import { type TV, type TvShowDiscoverResult } from 'tmdb-ts';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import PosterCard from '@/components/PosterCard.vue';
import { useInfiniteScroll, useMounted, useStorage } from '@vueuse/core';
import ScaleTransitionGroup from '@/components/ScaleTransitionGroup.vue';
import SidebarLeft from '@/components/SidebarLeft.vue';
import LoaderFooter from '@/components/LoaderFooter.vue';
import SelectedGenres from '@/components/filters/SelectedGenres.vue';
import SortOptions from '@/components/filters/SortOptions.vue';
import type { SortOptionFull } from '@/types/tmdb';
import SliderWithInput from '@/components/filters/SliderWithInput.vue';
import Button from 'primevue/button';
import { RouterLink } from 'vue-router';
import { useTmdbInstance } from '@/stores/tmdbInstance';

const minPopularity = useStorage('minPopularityTv', 0);
const sortBy = useStorage<SortOptionFull>('tvSortBy', 'first_air_date.asc');
const selectedGenres = ref<number[]>([]);
const maxDaysOld = useStorage('tvMaxDaysOld', 1);

const tmdb = useTmdbInstance().tmdbInstance;
const responses = ref<TvShowDiscoverResult[]>([]);
const currentPage = ref(0);
const totalPages = ref(99);
const isLoadingMore = ref(false);
const isMounted = useMounted();
const isSidebarOpen = useStorage<boolean>(
	'isSidebarOpen',
	// hidden on phone by default
	window.innerWidth >= 650
);

const filteredShows = computed<TV[]>(() => {
	// responses can be added to the array in random order
	responses.value.sort((a, b) => {
		return a.page - b.page;
	});

	const showsOnly = responses.value.flatMap((response) => {
		return response.results;
	});

	return showsOnly.filter((show) => {
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
	await getShows();
	isLoadingMore.value = false;
}

async function getShows() {
	// When awaiting the response, the filters can change.
	// When filters are modified, we want to start with fresh array, and we don't want to put the
	// pending responses to the new array (duplication, wrong results, etc.).
	// Ideal solution would be to abort all pending requests when filters change,
	// but tmdb-ts library doesn't support that.
	const responsesReferenceSnapshot = responses.value;

	const showsResponse = await tmdb.discover.tvShow({
		'first_air_date.gte': new Date(
			Date.now() - maxDaysOld.value * 24 * 60 * 60 * 1000
		).toISOString(),

		include_null_first_air_dates: false,
		language: 'en-US',
		with_original_language: 'en',
		page: currentPage.value,

		with_genres: selectedGenres.value.join(','),

		//@ts-ignore
		sort_by: sortBy.value,
	});

	totalPages.value = showsResponse.total_pages;

	// if the original responses ref array was reassigned, we don't want to push the response to the new array
	responsesReferenceSnapshot.push(showsResponse);

	console.log(showsResponse.results);
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
					label="Max. show age (days)"
					:max="30"
				/>

				<SortOptions
					v-model:sortBy="sortBy"
					:sortByOptions="[
						{
							label: 'Air date',
							value: 'first_air_date.asc',
						},
						{
							label: 'Popularity',
							value: 'popularity.desc',
						},
					]"
				/>

				<SelectedGenres v-model:selectedGenres="selectedGenres" mediaType="tvShows" />
			</SidebarLeft>

			<div class="flex flex-grow flex-col gap-2">
				<div class="self-end">
					<Button
						icon="pi pi-sliders-h"
						severity="secondary"
						iconClass="text-xl"
						size="small"
						@click="isSidebarOpen = !isSidebarOpen"
					/>
				</div>

				<div class="grid gap-4">
					<ScaleTransitionGroup>
						<RouterLink
							v-for="show in filteredShows"
							:key="show.id"
							:to="{ name: 'tvDetails', params: { id: show.id } }"
							class="visited:text-gray-400 dark:visited:text-gray-700"
						>
							<PosterCard
								:releaseDate="new Date(show.first_air_date)"
								:posterPath="show.poster_path"
								:popularity="show.popularity"
								:voteAverage="show.vote_average"
								:voteCount="show.vote_count"
								:name="show.name"
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
