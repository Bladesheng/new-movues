<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, type PropType } from 'vue';
import type { Cast, Crew, Genre, Images, Keyword, Network, Video } from 'tmdb-ts';
import Tag from 'primevue/tag';
import { getDaysLeft, getFullDateFormatted } from '@/utils/date';
import CastList from '@/components/CastList.vue';
import YoutubeTrailers from '@/components/YoutubeTrailers.vue';
import ImagesGallery from '@/components/ImagesGallery.vue';
import Image from 'primevue/image';
import Skeleton from 'primevue/skeleton';
import Card from 'primevue/card';
import SectionHeading from '@/components/SectionHeading.vue';

const props = defineProps({
	name: {
		required: true,
		type: String,
	},

	posterPath: {
		required: true,
		type: String,
	},

	releaseDate: {
		required: true,
		type: Date,
	},

	genres: {
		required: true,
		type: Array as PropType<Genre[]>,
	},

	rating: {
		required: true,
		type: Number,
	},

	tagline: {
		required: true,
		type: String,
	},

	overview: {
		required: true,
		type: String,
	},

	createdBy: {
		required: true,
		type: Object as PropType<Crew>,
	},

	keywords: {
		required: true,
		type: Array as PropType<Keyword[]>,
	},

	runtimeText: {
		required: false,
		type: String,
	},

	networks: {
		required: false,
		type: Array as PropType<Network[]>,
	},

	cast: {
		required: true,
		type: Array as PropType<Cast[]>,
	},

	videos: {
		required: true,
		type: Array as PropType<Video[]>,
	},

	tmdbLink: {
		required: true,
		type: String,
	},

	imdbId: {
		required: true,
		type: String,
	},

	images: {
		required: true,
		type: Object as PropType<Omit<Images, 'id'>>,
	},
});

const ratingRounded = computed(() => {
	return Math.round(props.rating * 10);
});

const route = useRoute();
</script>

<template>
	<div class="flex min-w-0 flex-col gap-4 sm:flex-row">
		<div class="flex min-w-0 flex-col gap-4">
			<div class="flex gap-4">
				<Image preview class="max-w-52 self-start overflow-hidden rounded">
					<template #image>
						<img :src="`https://image.tmdb.org/t/p/w400${props.posterPath}`" alt="poster" />
					</template>

					<template #preview="slotProps">
						<img
							:src="`https://image.tmdb.org/t/p/original${props.posterPath}`"
							class="fullImage"
							alt="poster"
							:style="slotProps.style"
							@click="slotProps.onClick"
						/>
					</template>
				</Image>

				<div class="flex flex-col gap-2 text-gray-600">
					<SectionHeading class="text-4xl">{{ props.name }}</SectionHeading>

					<div class="flex gap-2">
						<Tag v-for="genre in props.genres" :value="genre.name" severity="secondary" />
					</div>

					<div>
						{{ getFullDateFormatted(props.releaseDate) }} ({{ getDaysLeft(props.releaseDate) }})
					</div>

					<div v-if="props.runtimeText === undefined">
						<Skeleton width="10rem" height="1.5rem"></Skeleton>
					</div>
					<div v-else>{{ props.runtimeText }}</div>

					<div>
						<strong>{{ props.createdBy.name }}</strong>
						<span>&nbsp;({{ props.createdBy.department }})</span>
					</div>

					<div class="flex flex-col gap-0.5">
						<strong class="block">Overview</strong>
						<em class="block text-gray-500">{{ props.tagline }}</em>
						<p class="overview">{{ props.overview }}</p>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-4">
				<CastList :actors="props.cast" />

				<YoutubeTrailers :videos="props.videos" />

				<ImagesGallery :images="props.images" />
			</div>
		</div>

		<div class="flex shrink-0 flex-col items-stretch gap-4 sm:w-1/4 xl:w-1/5">
			<Card>
				<template #title>
					<SectionHeading>Rating</SectionHeading>
				</template>

				<template #content>
					<div class="flex flex-col gap-4">
						<div class="flex items-center gap-4">
							<a :href="props.tmdbLink" target="_blank">
								<img src="/tmdbLogoPrimaryShort.svg" class="h-12" alt="tmdb logo" />
							</a>

							<strong class="text-nowrap text-4xl">{{ ratingRounded }}%</strong>
						</div>

						<a :href="`https://www.imdb.com/title/${props.imdbId}`" target="_blank">
							<img src="/imdbLogo.png" class="h-12" alt="imdb logo" />
						</a>

						<slot name="csfdCard" />
					</div>
				</template>
			</Card>

			<Card>
				<template #title>
					<SectionHeading>Keywords</SectionHeading>
				</template>

				<template #content>
					<div class="flex flex-wrap gap-2">
						<Tag v-for="keyword in props.keywords" :value="keyword.name" severity="secondary" />
					</div>
				</template>
			</Card>

			<template v-if="props.networks !== undefined">
				<strong class="block">Network<span v-if="props.networks.length > 1">s</span></strong>

				<div class="flex flex-col items-start gap-2">
					<img
						v-for="network in props.networks"
						:src="`https://image.tmdb.org/t/p/w200${network.logo_path}`"
						:alt="network.name"
						:title="network.name"
					/>
				</div>
			</template>
		</div>
	</div>
</template>

<style scoped>
.fullImage {
	max-width: 100vw;
	max-height: 100vh;
}

.overview {
	max-width: 670px;
}
</style>
