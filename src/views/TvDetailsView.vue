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
			<template v-if="csfdRes === undefined">
				<Skeleton width="16rem" height="25rem" />
			</template>

			<template v-else>
				<CsfdDetails :csfdMovie="csfdRes" />
			</template>
		</div>
	</div>
</template>

<style scoped></style>
