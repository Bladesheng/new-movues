<script setup lang="ts">
import type { TV } from 'tmdb-ts';
import { computed, type PropType } from 'vue';

const props = defineProps({
	show: {
		required: true,
		type: Object as PropType<TV>,
	},
});

const daysUntilAir = computed(() => {
	const firstAirDate = new Date(props.show.first_air_date);
	const now = new Date();

	const diff = firstAirDate.getTime() - now.getTime();

	return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
});
</script>

<template>
	<div>
		<div>
			{{ show.name }}
		</div>

		<div>
			{{ show.first_air_date }}
		</div>

		<div>in {{ daysUntilAir }} days</div>

		<img :src="`https://image.tmdb.org/t/p/w300${props.show?.backdrop_path}`" alt="" />
	</div>
</template>

<style scoped></style>
