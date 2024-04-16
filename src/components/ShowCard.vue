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

	const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

	switch (daysLeft) {
		case -1:
			return 'Yesterday';
		case 0:
			return 'Today';
		case 1:
			return 'Tomorrow';
		default:
			return `in ${daysLeft} days`;
	}
});

const dateLocaleFormatted = computed(() => {
	const date = new Date(props.show.first_air_date);

	// @TODO add locale override to settings
	// const locale = navigator.language;
	const locale = 'cs-CZ';

	return date.toLocaleDateString(locale, {
		weekday: 'long',
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
	});
});
</script>

<template>
	<a
		class="group relative flex flex-col overflow-hidden rounded border border-gray-300"
		:href="`https://www.themoviedb.org/tv/${props.show.id}`"
		target="_blank"
	>
		<div class="overflow-hidden">
			<img
				:src="`https://image.tmdb.org/t/p/w400${props.show.poster_path}`"
				alt="show poster"
				class="duration-200 group-hover:scale-105"
			/>
		</div>

		<div class="absolute left-0 top-0 rounded-br bg-black bg-opacity-50 px-1 py-0.5 text-white">
			<span class="group-hover:hidden">{{ daysUntilAir }}</span>

			<span class="hidden group-hover:inline">
				{{ dateLocaleFormatted }}
			</span>
		</div>

		<div
			class="flex h-12 flex-grow items-center justify-center text-center"
			:title="props.show.name"
		>
			{{ props.show.name }}
		</div>
	</a>
</template>

<style scoped></style>
