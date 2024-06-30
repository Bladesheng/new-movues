<script setup lang="ts">
import { type PropType, ref } from 'vue';
import type { Images } from 'tmdb-ts';
import Dialog from 'primevue/dialog';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import Image from 'primevue/image';
import SectionHeading from '@/components/SectionHeading.vue';

const props = defineProps({
	images: {
		required: true,
		type: Object as PropType<Omit<Images, 'id'>>,
	},
});

const isModalVisible = ref(false);
</script>

<template>
	<div class="flex flex-col gap-2">
		<div class="flex justify-between">
			<SectionHeading>Images</SectionHeading>

			<Button label="More images" @click="isModalVisible = true" class="px-2 py-1" />
		</div>

		<div class="flex flex-col items-start gap-4">
			<Image
				v-for="img in props.images.backdrops.slice(0, 3)"
				preview
				class="overflow-hidden rounded"
			>
				<template #image>
					<img :src="`https://image.tmdb.org/t/p/w1280${img.file_path}`" alt="" />
				</template>

				<template #preview="slotProps">
					<img
						:src="`https://image.tmdb.org/t/p/original${img.file_path}`"
						class="fullImage"
						alt=""
						:style="slotProps.style"
						@click="slotProps.onClick"
					/>
				</template>
			</Image>
		</div>
	</div>

	<Dialog
		v-model:visible="isModalVisible"
		modal
		:dismissableMask="true"
		:closeOnEscape="true"
		header="All images"
		class="w-2/3"
	>
		<TabView :scrollable="true" class="capitalize">
			<TabPanel
				v-for="[groupName, imagesGroup] in Object.entries(props.images)"
				:key="groupName"
				:header="`${groupName} (${imagesGroup.length})`"
			>
				<div class="flex flex-col gap-12">
					<a
						v-for="img in imagesGroup"
						:href="`https://image.tmdb.org/t/p/original${img.file_path}`"
						target="_blank"
					>
						<img
							:src="`https://image.tmdb.org/t/p/original${img.file_path}`"
							loading="lazy"
							class="rounded"
							alt=""
						/>
					</a>
				</div>
			</TabPanel>
		</TabView>
	</Dialog>
</template>

<style scoped>
.fullImage {
	max-width: 100vw;
	max-height: 100vh;
}
</style>
