<script setup lang="ts">
import { useBearerStore } from '@/stores/bearer';
import { TMDB, type TV } from 'tmdb-ts';
import { computed, onMounted, ref, watch } from 'vue';
import ShowCard from '@/components/ShowCard.vue';
import { useInfiniteScroll, useStorage } from '@vueuse/core';
import LoadingSpinner from '@/assets/LoadingSpinner.vue';

const bearerStore = useBearerStore();

const minPopularity = useStorage('minPopularityTv', 0);

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

		//@ts-ignore
		sort_by: 'first_air_date.asc',
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
	<div>
		<h1>TV Shows</h1>

		<label for="popularity">Min. popularity</label>
		<input type="range" v-model.number="minPopularity" min="0" max="100" @wheel.prevent="onWheel" />
		<input type="number" id="popularity" v-model="minPopularity" />

		<div class="grid gap-4">
			<ShowCard
				v-for="show in filteredShows"
				:linkLocation="`tv/${show.id}`"
				:releaseDate="new Date(show.first_air_date)"
				:posterPath="show.poster_path"
				:popularity="show.popularity"
				:name="show.name"
			/>
		</div>

		<div class="flex flex-grow justify-center">
			<div v-if="currentPage === totalPages">@TODO That's all folks!</div>
			<LoadingSpinner v-else class="h-10 w-10" />
		</div>
	</div>
</template>

<style scoped>
.grid {
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
</style>
