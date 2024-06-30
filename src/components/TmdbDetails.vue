<script setup lang="ts">
import Card from 'primevue/card';
import { useRoute } from 'vue-router';
import { computed, type PropType } from 'vue';
import type { Cast, Crew, Genre, Images, Keyword, Network, Video } from 'tmdb-ts';
import Tag from 'primevue/tag';
import Knob from 'primevue/knob';
import { getDaysLeft, getFullDateFormatted } from '@/utils/date';
import CastList from '@/components/CastList.vue';
import YoutubeTrailers from '@/components/YoutubeTrailers.vue';
import ImagesGallery from '@/components/ImagesGallery.vue';
import Image from 'primevue/image';

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
	<Card
		class="flex min-w-0 grow"
		:pt="{
			body: 'min-w-0',
		}"
	>
		<template #content>
			<div>{{ props.name }}</div>

			<div>
				{{ getFullDateFormatted(props.releaseDate) }} ({{ getDaysLeft(props.releaseDate) }})
			</div>

			<div class="flex gap-2">
				<Tag v-for="genre in props.genres" :value="genre.name" severity="secondary" />
			</div>

			<Knob v-model="ratingRounded" valueTemplate="{value}%" />

			<em class="block text-gray-500">{{ props.tagline }}</em>

			<strong class="block">Overview</strong>

			<p>{{ props.overview }}</p>

			<div>
				<strong>{{ props.createdBy.name }}</strong>
				<span>&nbsp;({{ props.createdBy.department }})</span>
			</div>

			<strong class="block">Keywords</strong>

			<div class="flex flex-wrap gap-2">
				<Tag v-for="keyword in props.keywords" :value="keyword.name" severity="secondary" />
			</div>

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

			<strong class="block">Cast</strong>
			<CastList :actors="props.cast" />

			<strong class="block">Trailer</strong>
			<YoutubeTrailers :videos="props.videos" />

			<ImagesGallery :images="props.images" />

			<div v-if="props.runtimeText?.length! > 0">{{ props.runtimeText }}</div>

			<a :href="`https://www.themoviedb.org/tv/${route.params.id}`" target="_blank">
				<img src="/tmdbLogoPrimaryShort.svg" class="h-12" alt="tmdb logo" />
			</a>

			<a :href="`https://www.imdb.com/title/${props.imdbId}`" target="_blank">
				<img src="/imdbLogo.png" class="h-12" alt="imdb logo" />
			</a>

			<Image preview>
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
		</template>
	</Card>
</template>

<style scoped>
.fullImage {
	max-width: 100vw;
	max-height: 100vh;
}
</style>
