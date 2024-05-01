<script setup lang="ts">
import TabMenu from 'primevue/tabmenu';
import { RouterLink, useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import type { MenuItem } from 'primevue/menuitem';

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
		label: 'Home',
		route: { name: 'home' },
	},
	{
		label: 'Movies',
		route: { name: 'movies' },
	},
	{
		label: 'TV Shows',
		route: { name: 'tv' },
	},
	{
		label: 'Settings',
		route: { name: 'settings' },
	},
];
</script>

<template>
	<TabMenu :model="items" v-model:activeIndex="activeIndex" class="m-4">
		<template #item="{ item, props }">
			<RouterLink v-bind="props.action" :to="item.route">
				{{ item.label }}
			</RouterLink>
		</template>
	</TabMenu>
</template>

<style scoped></style>
