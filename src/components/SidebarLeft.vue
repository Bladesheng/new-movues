<script setup lang="ts">
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import { useSwipe } from '@vueuse/core';

const isOpen = defineModel<boolean>('isOpen', {
	required: true,
});

const isMobile = window.innerWidth < 650;

const { lengthX } = useSwipe(window, {
	threshold: 150,

	onSwipe(e) {
		if (e.target && (e.target as Element).closest('.p-slider-handle')) {
			// don't do anything when moving slider handle
			return;
		}

		if (lengthX.value < -150) {
			isOpen.value = true;
		} else if (lengthX.value > 150) {
			isOpen.value = false;
		}
	},
});
</script>

<template>
	<template v-if="isMobile">
		<Drawer v-model:visible="isOpen" header="Filters" class="textGray">
			<div class="flex flex-col gap-4 p-4">
				<slot />
			</div>
		</Drawer>
	</template>

	<template v-else>
		<div v-if="isOpen" class="flex flex-col gap-4 p-4">
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
