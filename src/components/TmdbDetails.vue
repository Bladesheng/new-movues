<script setup lang="ts">
import Card from 'primevue/card';
import { useRoute } from 'vue-router';
import { computed, type PropType } from 'vue';
import type { Crew, Genre, Keyword } from 'tmdb-ts';
import Chip from 'primevue/chip';
import Knob from 'primevue/knob';

const props = defineProps({
	name: {
		required: true,
		type: String,
	},

	posterPath: {
		required: true,
		type: String,
	},

	year: {
		required: true,
		type: String,
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
});

const ratingRounded = computed(() => {
	return Math.round(props.rating * 10);
});

const route = useRoute();
</script>

<template>
	<Card>
		<template #content>
			<div>{{ props.name }} ({{ props.year }})</div>

			<div class="flex gap-2">
				<Chip v-for="genre in props.genres" :label="genre.name" />
			</div>

			<Knob v-model="ratingRounded" valueTemplate="{value}%" />

			<i class="block text-gray-500">{{ props.tagline }}</i>

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

			<div v-if="props.runtimeText?.length! > 0">{{ props.runtimeText }}</div>

			<a target="_blank" :href="`https://www.themoviedb.org/tv/${route.params.id}`">TMDB link</a>

			<img
				:src="`https://image.tmdb.org/t/p/w400${props.posterPath}`"
				alt="show poster"
				class="duration-200 group-hover:scale-105"
			/>
		</template>
	</Card>
</template>

<style scoped></style>
