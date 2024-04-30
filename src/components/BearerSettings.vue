<script setup lang="ts">
import { useBearerStore } from '@/stores/bearer';
import { ref } from 'vue';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Card from 'primevue/card';

const bearerStore = useBearerStore();

const inputValue = ref(bearerStore.bearer);

function saveBearer() {
	bearerStore.bearer = inputValue.value;
}
</script>

<template>
	<div class="flex flex-col gap-4 p-4 sm:flex-row">
		<Card class="sm:w-1/2">
			<template #title>
				<div>Current bearer</div>
			</template>

			<template #content>
				<div class="text-gray-500" style="overflow-wrap: break-word">
					{{ bearerStore.bearer }}
				</div>
			</template>
		</Card>

		<Card class="sm:w-1/2">
			<template #title>
				<label for="bearer">New bearer</label>
			</template>

			<template #content>
				<div class="flex flex-col gap-2">
					<Textarea v-model="inputValue" rows="10" cols="30" id="bearer" />

					<Button label="Save bearer" @click="saveBearer" />
				</div>
			</template>
		</Card>
	</div>
</template>

<style scoped></style>
