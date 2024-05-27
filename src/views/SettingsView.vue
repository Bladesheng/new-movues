<script setup lang="ts">
import TmdbAccessTokenSettings from '@/components/TmdbAccessTokenSettings.vue';
</script>

<template>
	<main class="px-4">
		<TmdbAccessTokenSettings />
	</main>

	<footer class="m-4 flex flex-col items-center gap-2 text-center text-gray-600">
		<small>
			Icons made from
			<a class="underline" href="https://www.onlinewebfonts.com/icon" target="_blank">
				svg icons
			</a>
			is licensed by CC BY 4.0
		</small>

		<small class="flex items-center gap-1.5">
			Made by
			<a
				href="https://github.com/Bladesheng/new-movues"
				target="_blank"
				class="inline-flex items-center gap-1 text-black"
			>
				<img src="/github-mark.svg" alt="github-mark" class="inline h-5" />
				Bladesheng
			</a>
		</small>

		<div class="flex flex-col gap-1">
			<small>
				This product uses the
				<a href="https://www.themoviedb.org/" target="_blank" class="underline"> TMDB </a>
				API but is not endorsed or certified by TMDB
			</small>

			<img src="/tmdb.svg" alt="github-mark" class="h-3" />
		</div>
	</footer>
</template>

<style scoped>
img {
	transition: transform 1s;
}

a:hover > img {
	transition: transform 2s;
	transform: rotate(720deg);
}
</style>
