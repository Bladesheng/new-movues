<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';

const currentValue = defineModel<number>({
	required: true,
});

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	min: {
		type: Number,
		default: 0,
	},
	max: {
		type: Number,
		default: 200,
	},
	label: {
		type: String,
		required: true,
	},
});

function onWheel(e: WheelEvent) {
	if (e.deltaY > 0) {
		currentValue.value -= 5;
	} else {
		currentValue.value += 5;
	}

	if (currentValue.value < props.min) {
		currentValue.value = props.min;
	}

	if (currentValue.value > props.max) {
		currentValue.value = props.max;
	}
}
</script>

<template>
	<div class="flex flex-col gap-2">
		<label :for="props.id">
			<strong>{{ props.label }}</strong>
		</label>

		<div class="flex items-center gap-4">
			<Slider
				v-model="currentValue"
				:min="props.min"
				:max="props.max"
				@wheel.prevent="onWheel"
				class="h-2 w-40"
			/>

			<InputNumber v-model="currentValue" :inputId="props.id" inputClass="w-14 h-10 text-center" />
		</div>
	</div>
</template>

<style scoped></style>
