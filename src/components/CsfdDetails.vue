<script setup lang="ts">
import type { PropType } from 'vue';
import type { CSFDMovie } from 'node-csfd-api/interfaces/movie.interface';
import Card from 'primevue/card';

const props = defineProps({
	csfdMovie: {
		required: true,
		type: Object as PropType<CSFDMovie>,
	},
});
</script>

<template>
	<Card class="w-64">
		<template #content>
			<div
				class="flex items-center justify-center gap-4 rounded text-white"
				:class="{
					colorGood: props.csfdMovie.colorRating === 'good',
					colorAverage: props.csfdMovie.colorRating === 'average',
					colorBad: props.csfdMovie.colorRating === 'bad',
					colorUnknown: props.csfdMovie.colorRating === 'unknown',
				}"
			>
				<a :href="props.csfdMovie.url" target="_blank">
					<img
						class="h-16 w-16"
						src="https://img.csfd.cz/documents/marketing/logos/icon-white-transparent/icon-white-transparent.svg"
						alt="csfd logo"
					/>
				</a>

				<strong class="text-4xl">{{ props.csfdMovie.rating ?? '? ' }}%</strong>

				<span v-if="props.csfdMovie.rating !== null" class="mr-2 text-xl">
					({{ props.csfdMovie.ratingCount }})
				</span>
			</div>

			<strong class="mt-4 block text-lg">
				{{ props.csfdMovie.title }}
			</strong>

			<p>
				{{ props.csfdMovie.descriptions[0] }}
			</p>
		</template>
	</Card>
</template>

<style scoped>
.colorGood {
	background-color: #ba0305;
}

.colorAverage {
	background-color: #658db4;
}

.colorBad {
	background-color: #535353;
}

.colorUnknown {
	background-color: #a4a4a4;
}
</style>
