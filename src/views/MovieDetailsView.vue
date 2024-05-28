<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
	<a :href="`https://www.themoviedb.org/movie/${route.params.id}`"> movie details </a>
</template>

<style scoped></style>
