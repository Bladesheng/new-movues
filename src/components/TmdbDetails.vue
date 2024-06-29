<script setup lang="ts">
import Card from 'primevue/card';
import { useRoute } from 'vue-router';
import { computed, type PropType } from 'vue';
import type { Crew, Genre, Keyword, Network } from 'tmdb-ts';
import Chip from 'primevue/chip';
import Knob from 'primevue/knob';
import { getDaysLeft, getFullDateFormatted } from '@/utils/date';

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
});

const ratingRounded = computed(() => {
	return Math.round(props.rating * 10);
});

const route = useRoute();
</script>

<template>
	<Card>
		<template #content>
			<div>{{ props.name }}</div>

			<div>
				{{ getFullDateFormatted(props.releaseDate) }} ({{ getDaysLeft(props.releaseDate) }})
			</div>

			<div class="flex gap-2">
				<Chip v-for="genre in props.genres" :label="genre.name" />
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
				<Chip v-for="keyword in props.keywords" :label="keyword.name" class="text-xs" />
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

			<div v-if="props.runtimeText?.length! > 0">{{ props.runtimeText }}</div>

			<a target="_blank" :href="`https://www.themoviedb.org/tv/${route.params.id}`">TMDB link</a>

			<img :src="`https://image.tmdb.org/t/p/w400${props.posterPath}`" alt="show poster" />
		</template>
	</Card>
</template>

<style scoped></style>
