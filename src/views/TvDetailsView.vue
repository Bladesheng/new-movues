<script setup lang="ts">
import { useRoute } from 'vue-router';
import { TMDB } from 'tmdb-ts';
import type { AppendToResponse, TvShowDetails } from 'tmdb-ts';
import { useTmdbAccessToken } from '@/stores/tmdbAccessToken';
import { ref } from 'vue';
import type { CSFDMovie } from 'node-csfd-api/interfaces/movie.interface';
import CsfdDetails from '@/components/CsfdDetails.vue';
import Skeleton from 'primevue/skeleton';
import LoadingSpinner from '@/assets/LoadingSpinner.vue';
import { getCsfdMovie } from '@/api/csfdApi';

const route = useRoute();

const tmdbAccessTokenStore = useTmdbAccessToken();
const tmdb = new TMDB(tmdbAccessTokenStore.token);

const tmdbRes = ref<AppendToResponse<TvShowDetails, ('videos' | 'credits')[], 'tvShow'>>();
const csfdMovie = ref<CSFDMovie>();

const tvId = parseInt(route.params.id as string);

getDetails();

async function getDetails() {
	const res = await tmdb.tvShows.details(tvId, ['videos', 'credits']);

	tmdbRes.value = res;

	document.title = `${res.name} - MoVues`;

	console.log(res);

	const csfdRes = await getCsfdMovie('tv', res.name, new Date(res.first_air_date).getFullYear());

	console.log(csfdRes);

	csfdMovie.value = csfdRes;
}
</script>

<template>
	<div class="m-4 flex gap-4">
		<div class="flex grow">
			<template v-if="tmdbRes === undefined">
				<div class="flex grow items-center justify-center">
					<LoadingSpinner class="h-20 w-20 text-emerald-500" />
				</div>
			</template>

			<template v-else>
				<div>
					<a target="_blank" :href="`https://www.themoviedb.org/tv/${route.params.id}`">
						tv details
					</a>

					<div>tmdb: {{ tmdbRes.name }}</div>
				</div>
			</template>
		</div>

		<div>
			<template v-if="csfdMovie === undefined">
				<Skeleton width="16rem" height="25rem" />
			</template>

			<template v-else>
				<CsfdDetails :csfdMovie="csfdMovie" />
			</template>
		</div>
	</div>
</template>

<style scoped></style>
