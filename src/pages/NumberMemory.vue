<template>
	<div
		class="
			flex flex-col
			items-center
			justify-center
			gap-2
			w-full
			h-full
			text-primary-500
		"
	>
		<div
			v-if="state === GameState.RULES"
			class="grid place-items-center space-y-4 text-center"
		>
			<h1 class="text-secondary text-5xl">Number Memory</h1>
			<p>Remember the number</p>
			<Button @click="onRestart">Start</Button>
		</div>

		<div
			v-else-if="state === GameState.SHOW_NUMBER"
			class="grid place-items-center space-y-4 max-w-full"
		>
			<div class="select-none text-7xl text-secondary">
				{{ originalNumber }}
			</div>
			<div class="h-1 rounded-full w-60 bg-primary-500">
				<div
					class="h-full rounded-full bg-secondary"
					:style="{
						animation: `shrink ${HIDE_NUMBER_TIMEOUT_MS}ms linear`,
					}"
				/>
			</div>
		</div>

		<div
			v-else-if="state === GameState.GET_INPUT"
			class="flex flex-col items-center gap-4 max-w-full"
		>
			<div class="text-center">What was the number?</div>
			<Input
				class="text-center w-80 max-w-full"
				v-model="userEntered"
				@keyup.enter="onSubmit"
			/>
			<Button @click="onSubmit">Submit</Button>
		</div>

		<div
			v-else-if="state === GameState.DONE"
			class="flex flex-col items-center gap-8 text-center animate-appear"
		>
			<div class="text-6xl">
				Level <span class="text-secondary">{{ level }}</span>
			</div>
			<div class="flex flex-col items-center gap-1">
				<div>Number</div>
				<div class="text-secondary">{{ originalNumber }}</div>
			</div>
			<div class="flex flex-col items-center gap-1">
				<div>Your Answer</div>
				<div class="line-through text-error">
					{{ userEntered }}
				</div>
			</div>
			<Button @click="onRestart"> Restart </Button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";
import Input from "../components/Input.vue";

const HIDE_NUMBER_TIMEOUT_MS = 3 * 1000;

enum GameState {
	RULES,
	SHOW_NUMBER,
	GET_INPUT,
	DONE,
}

const timeoutId = ref<number>();

const state = ref<GameState>(GameState.RULES);
const level = ref<number>(1);
const originalNumber = ref<string>("");
const userEntered = ref<string>("");

function generateNumber(level: number): number {
	const min = Math.pow(10, level - 1);
	return min + Math.floor(Math.random() * min * 9);
}

function onRestart() {
	cleanup();

	state.value = GameState.SHOW_NUMBER;
	level.value = 1;
	userEntered.value = "";

	onNextLevel();
}

function onNextLevel() {
	originalNumber.value = generateNumber(level.value).toString();
	userEntered.value = "";
	state.value = GameState.SHOW_NUMBER;
	nextTick(() => {
		timeoutId.value = setTimeout(() => {
			state.value = GameState.GET_INPUT;
		}, HIDE_NUMBER_TIMEOUT_MS);
	});
}

function onSubmit() {
	if (!userEntered.value) {
		return;
	}

	if (originalNumber.value === userEntered.value) {
		level.value++;
		onNextLevel();
	} else {
		onFail();
	}
}

function onFail() {
	state.value = GameState.DONE;
	cleanup();
}

function cleanup() {
	clearTimeout(timeoutId.value);
}

onUnmounted(cleanup);
</script>

<style>
@keyframes shrink {
	from {
		width: 100%;
	}
	to {
		width: 0%;
	}
}
</style>
