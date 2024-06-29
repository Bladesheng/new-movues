<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useTmdbAccessToken } from '@/stores/tmdbAccessToken';
import { type AppendToResponse, type MovieDetails, TMDB } from 'tmdb-ts';
import { ref } from 'vue';
import type { CSFDMovie } from 'node-csfd-api/interfaces/movie.interface';
import { getCsfdMovie } from '@/api/csfdApi';

const route = useRoute();

const tmdbAccessTokenStore = useTmdbAccessToken();
const tmdb = new TMDB(tmdbAccessTokenStore.token);

const tmdbRes =
	ref<
		AppendToResponse<
			MovieDetails,
			('videos' | 'credits' | 'keywords' | 'images' | 'external_ids')[],
			'tvShow'
		>
	>();
const csfdMovie = ref<CSFDMovie>();

const movieId = parseInt(route.params.id as string);

getDetails();

async function getDetails() {
	const res = await tmdb.movies.details(
		movieId,
		['videos', 'credits', 'keywords', 'images', 'external_ids'],
		'en,null'
	);

	tmdbRes.value = res;

	document.title = `${res.title} - MoVues`;

	console.log(res);

	const csfdRes = await getCsfdMovie('movie', res.title, new Date(res.release_date).getFullYear());

	console.log(csfdRes);

	csfdMovie.value = csfdRes;
}
</script>

<template>
	<a :href="`https://www.themoviedb.org/movie/${route.params.id}`"> movie details </a>
</template>

<style scoped></style>
