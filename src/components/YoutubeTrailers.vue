<script setup lang="ts">
import { computed, type PropType, ref } from 'vue';
import type { Video } from 'tmdb-ts';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import YoutubeIframe from '@/components/YoutubeIframe.vue';

const props = defineProps({
	videos: {
		required: true,
		type: Array as PropType<Video[]>,
	},
});

const isModalVisible = ref(false);

const latestTrailer = computed(() => {
	const trailers = props.videos.filter((video) => {
		return video.type === 'Trailer';
	});

	return trailers[0];
});

const videoGroups = computed(() => {
	const groups: Record<string, Video[]> = Object.groupBy(props.videos, (video: Video) => {
		return video.type;
	});

	return groups;
});
</script>

<template>
	<div class="trailerMain">
		<YoutubeIframe :videoKey="latestTrailer.key" />
	</div>

	<Button
		:label="`More videos (${props.videos.length})`"
		@click="isModalVisible = true"
		class="px-2 py-1"
	/>

	<Dialog
		v-model:visible="isModalVisible"
		modal
		:dismissableMask="true"
		:closeOnEscape="true"
		header="All videos"
		class="w-2/3"
	>
		<TabView :scrollable="true">
			<TabPanel
				v-for="[groupName, videoGroup] in Object.entries(videoGroups)"
				:key="groupName"
				:header="`${groupName} (${videoGroup.length})`"
			>
				<div class="flex flex-col gap-12">
					<YoutubeIframe v-for="video in videoGroup" :videoKey="video.key" />
				</div>
			</TabPanel>
		</TabView>
	</Dialog>
</template>

<style scoped>
.trailerMain {
	max-width: 1000px;
}
</style>
