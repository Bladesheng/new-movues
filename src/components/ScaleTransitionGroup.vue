<script setup lang="ts"></script>

<template>
	<TransitionGroup name="scaleTransition">
		<slot></slot>
	</TransitionGroup>
</template>

<style>
.scaleTransition-enter-active {
	transition: all 400ms ease-out;
}
.scaleTransition-leave-active {
}

.scaleTransition-enter-from {
	opacity: 0;
	transform: scale(0.95);
}
.scaleTransition-leave-to {
}
</style>
