<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { TMDB } from 'tmdb-ts';
import { useBearerStore } from '@/stores/bearer';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';

const props = defineProps<{
	mediaType: 'movies' | 'tvShows';
}>();

const selectedGenres = defineModel<number[]>('selectedGenres', {
	required: true,
});

const genres = ref<{ id: number; name: string }[]>([]);

const bearerStore = useBearerStore();
const tmdb = new TMDB(bearerStore.bearer);

onMounted(async () => {
	const genresResponse = await tmdb.genres[props.mediaType]({
		language: 'en',
	});

	genres.value = genresResponse.genres;
});

function selectNone() {
	selectedGenres.value = [];
}
</script>

<template>
	<div class="flex flex-col gap-2">
		<div class="flex h-6 items-center gap-2">
			<strong>Genres</strong>

			<Button
				v-if="selectedGenres.length"
				@click="selectNone"
				icon="pi pi-times"
				class="h-1 w-6"
				severity="secondary"
				text
			/>
		</div>

		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2" v-for="genre in genres" :key="genre.id">
				<Checkbox v-model="selectedGenres" :inputId="genre.id.toString()" :value="genre.id" />

				<label :for="genre.id.toString()">
					{{ genre.name }}
				</label>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
