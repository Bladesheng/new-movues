<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { AppendToResponse, TvShowDetails } from 'tmdb-ts';
import { computed, ref } from 'vue';
import type { CSFDMovie } from 'node-csfd-api/interfaces/movie.interface';
import CsfdDetails from '@/components/CsfdDetails.vue';
import Skeleton from 'primevue/skeleton';
import LoadingSpinner from '@/assets/LoadingSpinner.vue';
import { getCsfdMovie } from '@/api/csfdApi';
import TmdbDetails from '@/components/TmdbDetails.vue';
import { useTmdbInstance } from '@/stores/tmdbInstance';

const route = useRoute();
const tmdb = useTmdbInstance().tmdbInstance;

const tmdbRes =
	ref<
		AppendToResponse<
			TvShowDetails,
			('videos' | 'credits' | 'keywords' | 'images' | 'external_ids')[],
			'tvShow'
		>
	>();
const csfdMovie = ref<CSFDMovie>();

const tvId = parseInt(route.params.id as string);

getDetails();

const runtimeText = computed(() => {
	if (tmdbRes.value === undefined || csfdMovie.value === undefined) {
		return undefined;
	}

	if (csfdMovie.value.duration === null) {
		return '';
	}

	const runtimeTotal = Number(csfdMovie.value.duration);
	const episodesCount = tmdbRes.value.number_of_episodes;

	const episodeRuntime = Math.round(runtimeTotal / episodesCount);

	const hours = Math.floor(runtimeTotal / 60);
	const minutes = Math.floor(runtimeTotal % 60);

	return `${hours} h ${minutes} min (${episodesCount} x ${episodeRuntime} min)`;
});

async function getDetails() {
	const res = await tmdb.tvShows.details(
		tvId,
		['videos', 'credits', 'keywords', 'images', 'external_ids'],
		'null,en'
	);

	tmdbRes.value = res;

	document.title = `${res.name} - MoVues`;

	console.log(res);

	const csfdRes = await getCsfdMovie('tv', res.name, new Date(res.first_air_date).getFullYear());

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
				:name="tmdbRes.name"
				:releaseDate="new Date(tmdbRes.first_air_date)"
				:posterPath="tmdbRes.poster_path"
				:genres="tmdbRes.genres"
				:rating="tmdbRes.vote_average"
				:tagline="tmdbRes.tagline"
				:overview="tmdbRes.overview"
				:createdBy="tmdbRes.credits.crew[0]"
				:keywords="tmdbRes.keywords.keywords ?? tmdbRes.keywords.results"
				:runtimeText="runtimeText"
				:networks="tmdbRes.networks"
				:cast="tmdbRes.credits.cast.slice(0, 10)"
				:videos="tmdbRes.videos.results.filter((video) => video.site === 'YouTube')"
				:tmdbLink="`https://www.themoviedb.org/tv/${route.params.id}`"
				:imdbId="tmdbRes.external_ids.imdb_id"
				:images="tmdbRes.images"
			>
				<template #csfdCard>
					<template v-if="csfdMovie === undefined">
						<Skeleton height="200px" />
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
