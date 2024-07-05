<script setup lang="ts">
import SelectButton from 'primevue/selectbutton';
import type { SortOptionFull } from '@/types/tmdb';

const sortBy = defineModel<SortOptionFull>('sortBy', {
	required: true,
});

const props = defineProps<{
	sortByOptions: {
		label: string;
		value: SortOptionFull;
	}[];
}>();
</script>

<template>
	<div class="flex flex-col gap-2">
		<strong>Sort by</strong>

		<SelectButton
			v-model="sortBy"
			:options="props.sortByOptions"
			optionLabel="label"
			optionValue="value"
		/>
	</div>
</template>

<style scoped></style>
