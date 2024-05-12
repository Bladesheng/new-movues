<script setup lang="ts">
import { useTmdbAccessToken } from '@/stores/tmdbAccessToken';
import { ref } from 'vue';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Card from 'primevue/card';

const tmdbAccessTokenStore = useTmdbAccessToken();

const inputValue = ref(tmdbAccessTokenStore.token);

function saveToken() {
	tmdbAccessTokenStore.token = inputValue.value;
}

async function fetchToken() {
	const password = prompt('Password:');
	if (!password) {
		return;
	}

	try {
		const res = await fetch('https://csfd.worker.bladesheng.com/tmdb', {
			headers: {
				password,
			},
		});

		if (!res.ok) {
			throw new Error('Failed to fetch token');
		}

		const body = await res.json();

		const accessToken = body.accessToken;

		tmdbAccessTokenStore.token = accessToken;
	} catch (e) {
		console.error(e);
	}
}
</script>

<template>
	<div class="flex flex-col gap-4 p-4 sm:flex-row">
		<Card class="sm:w-1/2">
			<template #title>
				<div>Current token</div>
			</template>

			<template #content>
				<div class="text-gray-500" style="overflow-wrap: break-word">
					{{ tmdbAccessTokenStore.token }}
				</div>
			</template>
		</Card>

		<Card class="sm:w-1/2">
			<template #title>
				<label for="token">New token</label>
			</template>

			<template #content>
				<div class="flex flex-col gap-2">
					<Textarea v-model="inputValue" rows="10" cols="30" id="token" />

					<Button label="Save token" @click="saveToken" />
				</div>

				<div class="mt-6 flex flex-col gap-2">
					<strong>Fetch token from API</strong>
					<Button icon="pi pi-lock" label="Fetch new token" @click="fetchToken" />
				</div>
			</template>
		</Card>
	</div>
</template>

<style scoped></style>
