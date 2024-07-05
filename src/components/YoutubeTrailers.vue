<script setup lang="ts">
import { computed, type PropType, ref } from 'vue';
import type { Video } from 'tmdb-ts';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
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

function startDrag(e: MouseEvent) {
	const currentTarget = e.currentTarget as HTMLElement;
	const videoContainer = currentTarget.closest('.relevantVideoContainer') as HTMLElement;
	const iframe = videoContainer.querySelector('iframe') as HTMLIFrameElement;

	const initialWidth = videoContainer.getBoundingClientRect().width;
	const initialHeight = videoContainer.getBoundingClientRect().height;
	const initialX = e.pageX;
	const initialY = e.pageY;
	const aspectRatio = initialWidth / initialHeight;

	// otherwise iframe would capture the mouseup events and you couldn't stop dragging
	iframe.classList.add('pointer-events-none');

	// to keep the width after cancelling max width
	videoContainer.style.width = initialWidth + 'px';
	videoContainer.style.maxWidth = 'none';

	document.addEventListener('mousemove', resize);
	document.addEventListener(
		'mouseup',
		() => {
			document.removeEventListener('mousemove', resize);
			iframe.classList.remove('pointer-events-none');
		},
		{
			once: true,
		}
	);

	function resize(e: MouseEvent) {
		const currentX = e.pageX;
		const currentY = e.pageY;

		const diffX = currentX - initialX;
		const diffY = currentY - initialY;

		// new width based only on movement in X axis
		const xMovementNewWidth = initialWidth + diffX;
		// videoContainer.style.width = xMovementNewWidth + 'px'; // (this is fine, but moving in Y axis wouldn't do anything)

		const yMovementNewHeight = initialHeight + diffY;
		// new width based only on movement in Y axis
		const yMovementNewWidth = yMovementNewHeight * aspectRatio;
		// videoContainer.style.width = yMovementNewWidth + 'px'; // (this is fine, but moving in X axis wouldn't do anything)

		// now we put both new widths together - basically a weighted average
		const newWidth =
			(xMovementNewWidth * initialWidth + yMovementNewWidth * initialHeight) /
			(initialWidth + initialHeight);

		if (newWidth < 200) {
			return;
		}

		videoContainer.style.width = newWidth + 'px';
	}
}
</script>

<template>
	<div v-if="props.videos.length > 0" class="flex flex-col gap-2">
		<div class="flex justify-between">
			<SectionHeading>{{ mostRelevantVideo.type }}</SectionHeading>

			<Button label="More videos" @click="isModalVisible = true" class="px-2 py-1" />
		</div>

		<div class="relevantVideoContainer z-10">
			<YoutubeIframe :videoKey="mostRelevantVideo.key" />
			<div class="flex">
				<Button
					@mousedown="startDrag"
					class="ml-auto mt-1 rotate-90 cursor-nwse-resize"
					icon="pi pi-arrow-up-right-and-arrow-down-left-from-center"
					severity="secondary"
					text
					aria-label="Bookmark"
				/>
			</div>
		</div>
	</div>

	<Dialog
		v-model:visible="isModalVisible"
		modal
		:dismissableMask="true"
		:closeOnEscape="true"
		header="All videos"
		class="textGray sm:w-4/5 xl:w-2/3"
	>
		<Tabs value="0" scrollable>
			<TabList>
				<Tab
					v-for="([groupName, videoGroup], i) in Object.entries(videoGroups)"
					:value="i.toString()"
					:key="groupName"
					class="capitalize"
				>
					{{ `${groupName} (${videoGroup.length})` }}
				</Tab>
			</TabList>

			<TabPanels>
				<TabPanel
					v-for="([groupName, videoGroup], i) in Object.entries(videoGroups)"
					:value="i.toString()"
					:key="groupName"
				>
					<div class="flex flex-col gap-12">
						<YoutubeIframe v-for="video in videoGroup" :videoKey="video.key" />
					</div>
				</TabPanel>
			</TabPanels>
		</Tabs>
	</Dialog>
</template>

<style scoped>
.relevantVideoContainer {
	will-change: width;
}
</style>
