<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import type { MenuItem } from 'primevue/menuitem';
import Button from 'primevue/button';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';

const route = useRoute();
const matchedRoute = ref('');

// for primevue Tab Menu, we have to manually resolve the initial route
// https://github.com/primefaces/primevue/issues/4739
watch(
	route,
	() => {
		const initialTab = tabs.find((tab) => {
			return route.path.startsWith(tab.route);
		});

		if (initialTab === undefined) {
			return;
		}

		matchedRoute.value = initialTab.route;
	},
	{ once: true }
);

const tabs: MenuItem[] = [
	{
		label: 'Movies',
		route: '/movies',
	},
	{
		label: 'TV Shows',
		route: '/tv',
	},
];
</script>

<template>
	<div class="flex items-center justify-between">
		<RouterLink :to="{ name: 'home' }" @click="matchedRoute = ''" class="w-1/3">
			<div class="ml-4 flex items-center gap-2 text-3xl font-bold text-gray-600">
				<img src="/favicon.svg" alt="logo" class="h-14" />

				<div class="hidden sm:block" :class="route.name === 'home' ? 'text-emerald-500' : ''">
					MoVues
				</div>
			</div>
		</RouterLink>

		<Tabs :value="matchedRoute">
			<TabList>
				<Tab v-for="tab in tabs" :key="tab.label" :value="tab.route" class="p-0">
					<RouterLink :to="tab.route" @click="matchedRoute = tab.route" class="block p-4">
						{{ tab.label }}
					</RouterLink>
				</Tab>
			</TabList>
		</Tabs>

		<RouterLink
			:to="{ name: 'settings' }"
			@click="matchedRoute = ''"
			class="flex w-1/3 justify-end"
		>
			<Button
				icon="pi pi-cog"
				:severity="route.name === 'settings' ? '' : 'secondary'"
				class="mr-4"
				iconClass="text-xl"
				rounded
				text
			/>
		</RouterLink>
	</div>
</template>

<style scoped></style>
