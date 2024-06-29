<script setup lang="ts">
import { getFullDateFormatted, getDaysLeft } from '@/utils/date';

const props = defineProps({
	releaseDate: {
		required: true,
		type: Date,
	},

	posterPath: {
		required: true,
		type: String,
	},

	popularity: {
		required: true,
		type: Number,
	},

	voteAverage: {
		required: true,
		type: Number,
	},

	voteCount: {
		required: true,
		type: Number,
	},

	name: {
		required: true,
		type: String,
	},
});
</script>

<template>
	<div class="group relative flex flex-col overflow-hidden rounded border border-gray-300">
		<div class="relative flex flex-grow overflow-hidden">
			<img
				:src="`https://image.tmdb.org/t/p/w400${props.posterPath}`"
				alt="show poster"
				class="duration-200 group-hover:scale-105"
			/>

			<div
				class="absolute bottom-0 left-0 rounded-tr bg-black bg-opacity-50 px-1 py-0.5 text-white"
			>
				<span v-if="props.voteAverage > 0 && props.voteCount > 5" class="group-hover:hidden">
					<i class="pi pi-star-fill text-yellow-500"></i>

					{{ Math.round(props.voteAverage * 10) / 10 }}
				</span>

				<span class="hidden group-hover:inline" title="Popularity">
					<i class="pi pi-chart-line"></i>

					{{ Math.round(props.popularity) }}
				</span>
			</div>
		</div>

		<div class="absolute left-0 top-0 rounded-br bg-black bg-opacity-50 px-1 py-0.5 text-white">
			<span class="group-hover:hidden">
				{{ getDaysLeft(props.releaseDate) }}
			</span>

			<span class="hidden text-sm group-hover:inline">
				{{ getFullDateFormatted(props.releaseDate) }}
			</span>
		</div>

		<div class="flex h-12 items-center justify-center text-center text-sm" :title="props.name">
			{{ props.name }}
		</div>
	</div>
</template>

<style scoped></style>
