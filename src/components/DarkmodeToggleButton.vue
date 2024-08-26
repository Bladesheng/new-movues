<script setup lang="ts">
import Button from 'primevue/button';
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
	<Button
		@click="toggleDark()"
		:icon="`pi pi-${isDark ? 'moon' : 'sun'}`"
		severity="secondary"
		iconClass="text-xl"
		rounded
		text
		title="Toggle darkmode"
	/>
</template>

<style scoped></style>
