<script setup lang="ts">
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
import { useSwipe } from '@vueuse/core';

const isOpen = defineModel<boolean>('isOpen', {
	required: true,
});

const isMobile = window.innerWidth < 650;

const { lengthX } = useSwipe(window, {
	threshold: 200,

	onSwipe(e) {
		if (e.target && (e.target as Element).closest('.p-slider-handle')) {
			// don't do anything when moving slider handle
			return;
		}

		if (lengthX.value < -200) {
			isOpen.value = true;
		} else if (lengthX.value > 200) {
			isOpen.value = false;
		}
	},
});
</script>

<template>
	<template v-if="isMobile">
		<Sidebar v-model:visible="isOpen" header="Filters">
			<div class="flex flex-col gap-4 p-4 text-gray-600">
				<slot />
			</div>
		</Sidebar>
	</template>

	<template v-else>
		<div v-if="isOpen" class="flex flex-col gap-4 p-4 text-gray-600">
			<div class="flex items-center justify-between">
				<strong class="text-xl">Filters</strong>

				<Button
					icon="pi pi-times"
					size="small"
					severity="secondary"
					text
					rounded
					@click="isOpen = false"
				/>
			</div>

			<slot />
		</div>
	</template>
</template>

<style scoped></style>
