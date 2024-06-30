<script setup lang="ts">
import { type PropType, ref } from 'vue';
import type { CSFDMovie } from 'node-csfd-api/interfaces/movie.interface';

const props = defineProps({
	csfdMovie: {
		required: true,
		type: Object as PropType<CSFDMovie>,
	},
});

const MAX_LENGTH = 150;

const isExpanded = ref(false);
</script>

<template>
	<div>
		<div
			class="grid grid-cols-3 items-center justify-items-center gap-4 text-nowrap rounded text-white"
			:class="{
				colorGood: props.csfdMovie.colorRating === 'good',
				colorAverage: props.csfdMovie.colorRating === 'average',
				colorBad: props.csfdMovie.colorRating === 'bad',
				colorUnknown: props.csfdMovie.colorRating === 'unknown',
			}"
		>
			<a :href="props.csfdMovie.url" target="_blank">
				<img class="h-16 w-16" src="/csfdLogo.svg" alt="csfd logo" />
			</a>

			<strong class="text-4xl">{{ props.csfdMovie.rating ?? '? ' }}%</strong>

			<span v-if="props.csfdMovie.rating !== null" class="mr-2 text-xl">
				({{ props.csfdMovie.ratingCount }})
			</span>
		</div>

		<strong class="mt-2 block text-lg">
			{{ props.csfdMovie.title }}
		</strong>

		<p v-if="props.csfdMovie.descriptions[0] !== undefined">
			{{ props.csfdMovie.descriptions[0].substring(0, isExpanded ? Infinity : MAX_LENGTH) }}
			<template v-if="!isExpanded && props.csfdMovie.descriptions[0].length > MAX_LENGTH">
				<span>...</span>
				<button @click="isExpanded = true">(<span class="textRed">více</span>)</button>
			</template>
		</p>
	</div>
</template>

<style scoped>
.textRed {
	color: #ba0305;
}

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
