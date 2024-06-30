<script setup lang="ts">
import { computed, type PropType, ref } from 'vue';
import type { Video } from 'tmdb-ts';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import YoutubeIframe from '@/components/YoutubeIframe.vue';
import SectionHeading from '@/components/SectionHeading.vue';

const props = defineProps({
	videos: {
		required: true,
		type: Array as PropType<Video[]>,
	},
});

const isModalVisible = ref(false);

const mostRelevantVideo = computed(() => {
	let mostRelevantVideos = props.videos.filter((video) => {
		return video.type === 'Trailer';
	});

	// no trailers, try teasers
	if (mostRelevantVideos.length === 0) {
		mostRelevantVideos = props.videos.filter((video) => {
			return video.type === 'Teaser';
		});
	}

	// no teasers either, try whatever is left
	if (mostRelevantVideos.length === 0) {
		mostRelevantVideos = props.videos;
	}

	return mostRelevantVideos[0];
});

const videoGroups = computed(() => {
	const groups: Record<string, Video[]> = Object.groupBy(props.videos, (video: Video) => {
		return video.type;
	});

	return groups;
});
</script>

<template>
	<div v-if="props.videos.length > 0" class="flex flex-col gap-2">
		<div class="flex justify-between">
			<SectionHeading>{{ mostRelevantVideo.type }}</SectionHeading>

			<Button label="More videos" @click="isModalVisible = true" class="px-2 py-1" />
		</div>

		<div class="trailerMain">
			<YoutubeIframe :videoKey="mostRelevantVideo.key" />
		</div>
	</div>

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
