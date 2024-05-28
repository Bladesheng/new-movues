<script setup lang="ts">
import { useRoute } from 'vue-router';
import { TMDB } from 'tmdb-ts';
import type { AppendToResponse, TvShowDetails } from 'tmdb-ts';
import { useTmdbAccessToken } from '@/stores/tmdbAccessToken';
import { ref } from 'vue';
import type { CSFDMovie } from 'node-csfd-api/interfaces/movie.interface';

const route = useRoute();

const tmdbAccessTokenStore = useTmdbAccessToken();
const tmdb = new TMDB(tmdbAccessTokenStore.token);

const tmdbRes = ref<AppendToResponse<TvShowDetails, ('videos' | 'credits')[], 'tvShow'>>();
const csfdRes = ref<CSFDMovie>();

const tvId = parseInt(route.params.id as string);

getDetails();

async function getDetails() {
	const res = await tmdb.tvShows.details(tvId, ['videos', 'credits']);

	tmdbRes.value = res;

	document.title = `${res.name} - MoVues`;

	console.log(res);

	await getCsfd(res.name, new Date(res.first_air_date).getFullYear());
}

async function getCsfd(name: string, year: number) {
	const res = await fetch(`https://csfd.worker.bladesheng.com/detail/tv?name=${name}&year=${year}`);

	const body = await res.json();

	csfdRes.value = body;

	console.log(body);
}
</script>

<template>
	<a :href="`https://www.themoviedb.org/tv/${route.params.id}`"> tv details </a>

	<div v-if="tmdbRes === undefined">loading tmdb</div>
	<div v-else>tmdb: {{ tmdbRes.name }}</div>

	<div v-if="csfdRes === undefined">loading csfd</div>
	<div v-else>csfd: {{ csfdRes.title }}</div>
</template>

<style scoped></style>
