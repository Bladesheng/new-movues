<script setup lang="ts">
import LoadingSpinner from '@/assets/LoadingSpinner.vue';

const props = defineProps({
	isLoadingMore: {
		required: true,
		type: Boolean,
	},
});
</script>

<template>
	<div class="flex flex-grow justify-center p-4">
		<div v-if="props.isLoadingMore" class="text-gray-400">That's all...</div>
		<LoadingSpinner v-else class="h-10 w-10 text-emerald-500" />
	</div>
</template>

<style scoped></style>
