<script setup lang="ts">
import { useBearerStore } from '@/stores/bearer';
import { ref } from 'vue';

const bearerStore = useBearerStore();

const inputValue = ref(bearerStore.bearer);

function saveBearer() {
	bearerStore.bearer = inputValue.value;
}
</script>

<template>
	<div class="flex flex-col gap-2">
		<div>
			<div>Current bearer:</div>
			<div class="font-bold">{{ bearerStore.bearer }}</div>
		</div>

		<div class="flex flex-col">
			<label for="bearer">New bearer:</label>
			<textarea id="bearer" cols="30" rows="10" v-model="inputValue"></textarea>

			<button @click="saveBearer">Save bearer</button>
		</div>
	</div>
</template>

<style scoped></style>
