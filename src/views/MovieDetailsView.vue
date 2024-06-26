<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useTmdbAccessToken } from '@/stores/tmdbAccessToken';
import { type AppendToResponse, type MovieDetails, TMDB } from 'tmdb-ts';
import { ref } from 'vue';
import type { CSFDMovie } from 'node-csfd-api/interfaces/movie.interface';

const route = useRoute();

const tmdbAccessTokenStore = useTmdbAccessToken();
const tmdb = new TMDB(tmdbAccessTokenStore.token);

const tmdbRes = ref<AppendToResponse<MovieDetails, ('videos' | 'credits')[], 'tvShow'>>();
const csfdRes = ref<CSFDMovie>();

const movieId = parseInt(route.params.id as string);

getDetails();

async function getDetails() {
	const res = await tmdb.movies.details(movieId, ['videos', 'credits']);

	tmdbRes.value = res;

	document.title = `${res.title} - MoVues`;

	console.log(res);

	await getCsfd(res.title, new Date(res.release_date).getFullYear());
}

async function getCsfd(name: string, year: number) {
	const res = await fetch(
		`https://csfd.worker.bladesheng.com/detail/movie?name=${name}&year=${year}`
	);

	let body = await res.json();

	if (body.status === 404) {
		// try again, this time without the year - movies sometimes get delayed - csfd and tmdb can be out of sync
		const res = await fetch(`https://csfd.worker.bladesheng.com/detail/movie?name=${name}`);

		body = await res.json();
	}

	csfdRes.value = body;

	console.log(body);
}
</script>

<template>
	<a :href="`https://www.themoviedb.org/movie/${route.params.id}`"> movie details </a>
</template>

<style scoped></style>
