<script setup lang="ts">
const props = defineProps({
	videoKey: {
		required: true,
		type: String,
	},
});
</script>

<template>
	<iframe
		:src="`https://www.youtube.com/embed/${props.videoKey}`"
		class="aspect-video w-full"
		title="YouTube video player"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
</template>

<style scoped></style>
