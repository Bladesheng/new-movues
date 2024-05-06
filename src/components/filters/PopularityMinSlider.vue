<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';

const minPopularity = defineModel<number>({
	required: true,
});

function onWheel(e: WheelEvent) {
	if (e.deltaY > 0) {
		minPopularity.value -= 5;
	} else {
		minPopularity.value += 5;
	}

	if (minPopularity.value < 0) {
		minPopularity.value = 0;
	}

	if (minPopularity.value > 100) {
		minPopularity.value = 100;
	}
}
</script>

<template>
	<div class="flex flex-col gap-2">
		<label for="popularity">
			<strong>Minimal popularity</strong>
		</label>

		<div class="flex items-center gap-4">
			<Slider
				v-model="minPopularity"
				:min="0"
				:max="100"
				@wheel.prevent="onWheel"
				class="h-2 w-40"
			/>

			<InputNumber
				v-model="minPopularity"
				inputId="popularity"
				inputClass="w-14 h-10 text-center"
			/>
		</div>
	</div>
</template>

<style scoped></style>
