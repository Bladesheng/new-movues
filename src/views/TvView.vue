<script setup lang="ts">
import { useBearerStore } from '@/stores/bearer';
import { TMDB, type TV } from 'tmdb-ts';
import { computed, onMounted, ref, watch } from 'vue';
import PosterCard from '@/components/PosterCard.vue';
import { useInfiniteScroll, useStorage } from '@vueuse/core';
import ScaleTransitionGroup from '@/components/ScaleTransitionGroup.vue';
import Slider from 'primevue/slider';
import InputNumber from 'primevue/inputnumber';
import SidebarLeft from '@/components/SidebarLeft.vue';
import LoaderFooter from '@/components/LoaderFooter.vue';
import SelectedGenres from '@/components/filters/SelectedGenres.vue';
import SortOptions from '@/components/filters/SortOptions.vue';
import type { SortOptionFull } from '@/types/tmdb';

const bearerStore = useBearerStore();

const minPopularity = useStorage('minPopularityTv', 0);
const sortBy = useStorage<SortOptionFull>('tvSortBy', 'first_air_date.asc');
const selectedGenres = ref<number[]>([]);

const tmdb = new TMDB(bearerStore.bearer);

const showsList = ref<TV[]>([]);
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
	showsList.value = [];

	await loadNextPage();
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
	const showsResponse = await tmdb.discover.tvShow({
		// since yesterday
		'first_air_date.gte': new Date(Date.now() - 86400000).toISOString(),

		include_null_first_air_dates: false,
		language: 'en-US',
		with_original_language: 'en',
		page: currentPage.value,

		with_genres: selectedGenres.value.join(','),

		//@ts-ignore
		sort_by: sortBy.value,
	});

	totalPages.value = showsResponse.total_pages;

	showsList.value.push(...showsResponse.results);

	console.log(showsResponse.results);
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
					<label for="popularity">
						<strong>Minimal popularity</strong>
					</label>

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

				<SortOptions
					v-model="sortBy"
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

				<SelectedGenres v-model="selectedGenres" mediaType="tvShows" />
			</SidebarLeft>

			<div class="flex-grow">
				<div class="grid gap-4">
					<ScaleTransitionGroup>
						<PosterCard
							v-for="show in filteredShows"
							:key="show.id"
							:linkLocation="`tv/${show.id}`"
							:releaseDate="new Date(show.first_air_date)"
							:posterPath="show.poster_path"
							:popularity="show.popularity"
							:name="show.name"
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
