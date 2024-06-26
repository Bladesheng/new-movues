<script setup lang="ts">
import Card from 'primevue/card';
import { useRoute } from 'vue-router';
import type { PropType } from 'vue';
import type { Genre } from 'tmdb-ts';

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
});

const route = useRoute();
</script>

<template>
	<Card class="w-64">
		<template #content>
			<div>{{ props.name }} ({{ props.year }})</div>

			<div>
				<span v-for="genre in props.genres">
					{{ genre.name }}
				</span>
			</div>

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
