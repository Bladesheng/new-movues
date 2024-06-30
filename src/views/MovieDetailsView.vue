<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useTmdbAccessToken } from '@/stores/tmdbAccessToken';
import { type AppendToResponse, type MovieDetails, TMDB } from 'tmdb-ts';
import { computed, ref } from 'vue';
import type { CSFDMovie } from 'node-csfd-api/interfaces/movie.interface';
import { getCsfdMovie } from '@/api/csfdApi';
import CsfdDetails from '@/components/CsfdDetails.vue';
import Skeleton from 'primevue/skeleton';
import LoadingSpinner from '@/assets/LoadingSpinner.vue';
import TmdbDetails from '@/components/TmdbDetails.vue';

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

const runtimeText = computed(() => {
	if (tmdbRes.value === undefined) {
		return undefined;
	}

	const hours = Math.floor(tmdbRes.value.runtime / 60);
	const minutes = Math.floor(tmdbRes.value.runtime % 60);

	return `${hours} h ${minutes} min`;
});

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
	<div class="m-4 flex grow">
		<template v-if="tmdbRes === undefined">
			<div class="flex grow items-center justify-center">
				<LoadingSpinner class="h-20 w-20 text-emerald-500" />
			</div>
		</template>

		<template v-else>
			<TmdbDetails
				:name="tmdbRes.title"
				:releaseDate="new Date(tmdbRes.release_date)"
				:posterPath="tmdbRes.poster_path!"
				:genres="tmdbRes.genres"
				:rating="tmdbRes.vote_average"
				:tagline="tmdbRes.tagline"
				:overview="tmdbRes.overview"
				:createdBy="tmdbRes.credits.crew[0]"
				:keywords="tmdbRes.keywords.keywords"
				:runtimeText="runtimeText"
				:cast="tmdbRes.credits.cast.slice(0, 10)"
				:videos="tmdbRes.videos.results.filter((video) => video.site === 'YouTube')"
				:tmdbLink="`https://www.themoviedb.org/movie/${route.params.id}`"
				:imdbId="tmdbRes.external_ids.imdb_id"
				:images="tmdbRes.images"
			>
				<template #csfdCard>
					<template v-if="csfdMovie === undefined">
						<Skeleton width="16rem" height="25rem" />
					</template>

					<template v-else>
						<CsfdDetails :csfdMovie="csfdMovie" />
					</template>
				</template>
			</TmdbDetails>
		</template>
	</div>
</template>

<style scoped></style>
