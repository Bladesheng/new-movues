<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
	<header>
		<div class="wrapper">
			<nav class="flex gap-1">
				<RouterLink :to="{ name: 'home' }">Home</RouterLink>
				<RouterLink :to="{ name: 'about' }">About</RouterLink>
				<RouterLink :to="{ name: 'settings' }">Settings</RouterLink>
			</nav>
		</div>
	</header>

	<RouterView />
</template>

<style scoped></style>
