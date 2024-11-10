<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import type { MenuItem } from 'primevue/menuitem';
import Button from 'primevue/button';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import DarkmodeToggleButton from '@/components/DarkmodeToggleButton.vue';

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
	<div class="mx-4 grid grid-cols-3 items-center">
		<RouterLink :to="{ name: 'home' }" @click="matchedRoute = ''" class="w-1/3">
			<div class="flex items-center gap-2 text-3xl font-bold">
				<img src="/favicon.svg" alt="logo" class="h-14" />

				<div class="hidden sm:block" :class="route.name === 'home' ? 'text-emerald-500' : ''">
					MoVues
				</div>
			</div>
		</RouterLink>

		<Tabs :value="matchedRoute" class="justify-self-center">
			<TabList>
				<Tab v-for="tab in tabs" :key="tab.route" :value="tab.route" class="p-0">
					<RouterLink
						:to="tab.route"
						@click="matchedRoute = tab.route"
						class="block px-2 py-4 sm:px-4"
					>
						{{ tab.label }}
					</RouterLink>
				</Tab>
			</TabList>
		</Tabs>

		<div class="flex justify-self-end sm:gap-2">
			<DarkmodeToggleButton />

			<RouterLink :to="{ name: 'settings' }" @click="matchedRoute = ''" title="Settings">
				<Button
					icon="pi pi-cog"
					:severity="route.name === 'settings' ? '' : 'secondary'"
					iconClass="text-xl"
					rounded
					text
				/>
			</RouterLink>
		</div>
	</div>
</template>

<style>
.p-tablist-tab-list {
	/* @FIXME this should be in pass through option, but it's not yet implemented in primevue 4.0.0 */
	/* also, it should be transparent by default lol */
	background: transparent;
}
</style>
