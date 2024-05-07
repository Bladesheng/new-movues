<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
	releaseDate: {
		required: true,
		type: Date,
	},

	linkLocation: {
		required: true,
		type: String,
	},

	posterPath: {
		required: true,
		type: String,
	},

	popularity: {
		required: true,
		type: Number,
	},

	name: {
		required: true,
		type: String,
	},
});

const daysUntilAir = computed(() => {
	const now = new Date();

	const diff = props.releaseDate.getTime() - now.getTime();

	const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

	if (daysLeft <= -2) {
		return `${daysLeft * -1} days ago`;
	} else if (daysLeft === -1) {
		return 'Yesterday';
	} else if (daysLeft === 0) {
		return 'Today';
	} else if (daysLeft === 1) {
		return 'Tomorrow';
	} else {
		return `in ${daysLeft} days`;
	}
});

const dateLocaleFormatted = computed(() => {
	// @TODO add locale override to settings
	// const locale = navigator.language;
	const locale = 'cs-CZ';

	return props.releaseDate.toLocaleDateString(locale, {
		weekday: 'long',
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
	});
});
</script>

<template>
	<a
		class="group relative flex flex-col overflow-hidden rounded border border-gray-300 visited:text-gray-400"
		:href="`https://www.themoviedb.org/${props.linkLocation}`"
		target="_blank"
	>
		<div class="flex flex-grow overflow-hidden">
			<img
				:src="`https://image.tmdb.org/t/p/w400${props.posterPath}`"
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
			class="absolute right-0 top-0 hidden rounded-bl bg-black bg-opacity-50 px-1 py-0.5 text-white group-hover:inline"
			title="Popularity"
		>
			📈
			{{ Math.round(props.popularity) }}
		</div>

		<div class="flex h-12 items-center justify-center text-center text-sm" :title="props.name">
			{{ props.name }}
		</div>
	</a>
</template>

<style scoped></style>
