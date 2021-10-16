<template>
	<RouterLink
		:to="to"
		class="
			flex flex-col
			justify-center
			items-center
			p-6
			text-5xl
			rounded-xl
			bg-primary-800
			text-primary-400
			hover:text-secondary
			duration-300
			transform
			hover:shadow-md hover:-translate-y-1.5
			focus:ring-2
			focus:ring-secondary
			focus:ring-offset-4
			focus:ring-offset-primary-800
			focus:outline-none
		"
		style="transition-property: color, transform"
	>
		<slot name="icon" />
		<div>
			{{ name }}
		</div>
	</RouterLink>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { RouterLink } from "vue-router";

defineProps({
	to: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
});
</script>
