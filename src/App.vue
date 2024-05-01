<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderNavigation from '@/components/HeaderNavigation.vue';
</script>

<template>
	<header>
		<HeaderNavigation />
	</header>

	<RouterView />
</template>

<style scoped></style>
