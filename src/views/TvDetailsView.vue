<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
	<a :href="`https://www.themoviedb.org/tv/${route.params.id}`"> tv details </a>
</template>

<style scoped></style>
