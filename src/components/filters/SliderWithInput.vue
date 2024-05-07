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
	// v-model isn't updated fast enough - the clamping would be done on the previous value (nothing would happen)
	let newValue = currentValue.value;

	if (e.deltaY > 0) {
		newValue -= 5;
	} else {
		newValue += 5;
	}

	if (newValue < props.min) {
		newValue = props.min;
	}

	if (newValue > props.max) {
		newValue = props.max;
	}

	currentValue.value = newValue;
}
</script>

<template>
	<div class="flex flex-col gap-2" @wheel.prevent="onWheel">
		<label :for="props.id">
			<strong>{{ props.label }}</strong>
		</label>

		<div class="flex items-center gap-4">
			<Slider v-model="currentValue" :min="props.min" :max="props.max" class="h-2 w-40" />

			<InputNumber v-model="currentValue" :inputId="props.id" inputClass="w-14 h-10 text-center" />
		</div>
	</div>
</template>

<style scoped></style>
