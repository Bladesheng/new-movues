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
	<div class="flex flex-grow justify-center p-4" data-testid="loadingSpinner">
		<LoadingSpinner v-if="props.isLoadingMore" class="h-10 w-10 text-emerald-500" />
		<div v-else class="text-gray-400">That's all...</div>
	</div>
</template>

<style scoped></style>
