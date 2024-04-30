<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import type { MenuItem } from 'primevue/menuitem';
import TabMenu from 'primevue/tabmenu';

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
	<header>
		<TabMenu :model="items" class="m-4">
			<template #item="{ item, props }">
				<RouterLink v-bind="props.action" :to="item.route">
					{{ item.label }}
				</RouterLink>
			</template>
		</TabMenu>
	</header>

	<RouterView />
</template>

<style scoped></style>
