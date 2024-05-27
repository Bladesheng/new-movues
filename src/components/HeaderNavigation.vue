<script setup lang="ts">
import TabMenu from 'primevue/tabmenu';
import { RouterLink, useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import type { MenuItem } from 'primevue/menuitem';
import Button from 'primevue/button';

// don't highlight anything initially
const activeIndex = ref(-1);
const route = useRoute();

// PrimeVue for some reason is unable to resolve the initial route from vue-router
watch(
	route,
	() => {
		const initialIndex = items.findIndex((item) => item.route.name === route.name);
		activeIndex.value = initialIndex;
	},
	{ once: true }
);

const items: MenuItem[] = [
	{
		label: 'Movies',
		route: { name: 'movies' },
	},
	{
		label: 'TV Shows',
		route: { name: 'tv' },
	},
];
</script>

<template>
	<div class="flex items-center justify-between">
		<RouterLink :to="{ name: 'home' }" @click="activeIndex = -1" class="w-1/3">
			<div class="ml-4 flex items-center gap-2 text-3xl font-bold text-gray-600">
				<img src="/favicon.svg" alt="logo" class="h-14" />

				<div class="hidden sm:block" :class="route.name === 'home' ? 'text-emerald-500' : ''">
					MoVues
				</div>
			</div>
		</RouterLink>

		<TabMenu
			:model="items"
			v-model:activeIndex="activeIndex"
			class="flex-shrink-0 sm:m-4"
			:pt="{
				menu: 'justify-center',
				menuitem: 'p-0',
			}"
		>
			<template #item="{ item, props }">
				<RouterLink v-bind="props.action" :to="item.route" class="text-nowrap px-3 py-5 sm:p-5">
					{{ item.label }}
				</RouterLink>
			</template>
		</TabMenu>

		<RouterLink :to="{ name: 'settings' }" @click="activeIndex = -1" class="flex w-1/3 justify-end">
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
