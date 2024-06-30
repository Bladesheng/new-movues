<script setup lang="ts">
import type { PropType } from 'vue';
import type { Cast } from 'tmdb-ts';
import SectionHeading from '@/components/SectionHeading.vue';

const props = defineProps({
	actors: {
		required: true,
		type: Array as PropType<Cast[]>,
	},
});
</script>

<template>
	<div class="flex flex-col gap-2 text-gray-600">
		<SectionHeading>Cast</SectionHeading>

		<ol class="flex gap-2 overflow-x-scroll">
			<li
				v-for="actor in props.actors"
				class="max-w-32 flex-shrink-0 overflow-hidden rounded-xl border border-gray-300 sm:max-w-44"
			>
				<img :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`" :alt="actor.name" />

				<div class="p-2 text-center">
					<div class="font-semibold">{{ actor.name }}</div>

					<div class="mt-0.5 text-sm">{{ actor.character }}</div>
				</div>
			</li>
		</ol>
	</div>
</template>

<style scoped>
ol::-webkit-scrollbar {
	height: 10px;
}

ol::-webkit-scrollbar-thumb {
	border-radius: 9999px;
	background: #d1d5db;
}
</style>
