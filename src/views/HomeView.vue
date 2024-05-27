<script setup lang="ts">
import Button from 'primevue/button';
import { RouterLink } from 'vue-router';
</script>

<template>
	<main class="m-4 flex h-full flex-grow flex-col items-center justify-center gap-10 text-center">
		<div class="flex flex-col items-center gap-4 text-5xl">
			<div class="text-emerald-950">The all-in-one website</div>

			<div class="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text pb-2 text-transparent">
				for new Movies and TV shows
			</div>
		</div>

		<div class="text-gray-600">
			<div>
				MoVues is a website that allows you to see what new movies and TV shows are airing right now
				and what to look out for.
			</div>
			<div>All you have to provide is your own TMDB API key.</div>
		</div>

		<RouterLink :to="{ name: 'settings' }">
			<Button
				class="border-none bg-gradient-to-r from-emerald-400 to-teal-400"
				icon="pi pi-chevron-right"
				iconPos="right"
				iconClass="text-sm"
				label="Set up your API key"
			/>
		</RouterLink>
	</main>
</template>
