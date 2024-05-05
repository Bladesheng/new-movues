<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(true);
</script>

<template>
	<div v-if="isOpen" class="flex flex-col gap-4 p-4">
		<slot />
	</div>
</template>

<style scoped></style>
