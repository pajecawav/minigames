<template>
	<!-- TODO: delegate appear animations to the router? -->
	<Transition
		enter-from-class="opacity-0"
		enter-active-class="duration-500"
		:appear="true"
	>
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
				class="grid place-items-center space-y-4"
			>
				<div class="max-w-[36rem] text-center leading-relaxed">
					<h1 class="text-secondary text-center text-5xl">
						Reaction Time
					</h1>
					<p>
						Wait for the
						<span class="text-error">red</span> button to turn
						<span class="text-success">green</span> and click it as
						quickly as you can.
					</p>
				</div>
				<Button @click="onRestart">Start</Button>
			</div>

			<button
				v-else-if="playing"
				:class="[
					'w-full h-96 sm:h-80 flex items-center justify-center rounded-md text-6xl text-primary-800 focus:ring-2 focus:ring-secondary focus:ring-offset-4 focus:ring-offset-primary-700 focus:outline-none',
					state === GameState.RED ? 'bg-error ' : 'bg-success',
				]"
				@click="onButtonClick"
			>
				{{ state === GameState.RED ? "Wait for green" : "Click!" }}
			</button>

			<div v-if="finished" class="grid gap-6 place-items-center">
				<div
					v-if="state === GameState.FAILED"
					class="text-5xl text-error text-center"
				>
					Clicked too soon
				</div>

				<div
					v-if="state === GameState.DONE"
					class="text-5xl text-center"
				>
					Reaction time is
					<span class="text-secondary">{{ reactionTime }}</span>
					<span> ms</span>
				</div>

				<Button @click="onRestart">Restart</Button>
			</div>
		</div>
	</Transition>
</template>

<script setup lang="ts">
import { computed, ref } from "@vue/reactivity";
import { nextTick, onUnmounted } from "@vue/runtime-core";
import { onKeyDown } from "@vueuse/core";
import Button from "../components/Button.vue";

const MIN_WAIT_TIME = 3000;

enum GameState {
	RULES,
	RED,
	GREEN,
	FAILED,
	DONE,
}

const timeoutId = ref<number>();

const state = ref<GameState>(GameState.RULES);
const showedAt = ref<number | null>(null);
const clickedAt = ref<number | null>(null);

const reactionTime = computed<number>(
	() => (clickedAt.value ?? 0) - (showedAt.value ?? 0)
);

const playing = computed(
	() => state.value === GameState.RED || state.value === GameState.GREEN
);
const finished = computed(
	() => state.value === GameState.FAILED || state.value === GameState.DONE
);

function onRestart() {
	cleanup();

	state.value = GameState.RED;
	showedAt.value = null;
	clickedAt.value = null;

	const delay = MIN_WAIT_TIME + Math.floor(4 * Math.random() * 1000);
	timeoutId.value = setTimeout(() => {
		if (state.value !== GameState.RED) {
			return;
		}

		state.value = GameState.GREEN;

		nextTick(() => {
			showedAt.value = Date.now();
		});
	}, delay);
}

// handle click
function onFinish() {
	clickedAt.value = Date.now();
	state.value = GameState.DONE;
}

// handle early click
function onFail() {
	state.value = GameState.FAILED;
	cleanup();
}

// handle click on the button
function onButtonClick() {
	if (state.value === GameState.RED) {
		onFail();
	} else if (state.value === GameState.GREEN) {
		onFinish();
	}
}

// restart the game on Ctrl Enter
onKeyDown("Enter", event => {
	if (event.ctrlKey) {
		onRestart();
	}
});

function cleanup() {
	clearTimeout(timeoutId.value);
}

onUnmounted(() => {
	cleanup();
});
</script>
