<template>
	<input
		class="
			px-2
			py-1
			bg-primary-800
			placeholder-primary-400
			border-2
			transition-colors
			duration-50
			border-primary-800
			rounded
			outline-none
			appearance-none
			font-sm
			text-primary-200
			focus:border-secondary
		"
		:value="modelValue"
		@input="onUpdate"
		v-bind="$attrs"
	/>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

defineProps({
	modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const onUpdate = (event: InputEvent) => {
	emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>
