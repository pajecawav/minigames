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
			<div class="max-w-[36rem] text-center leading-relaxed">
				<h1 class="text-secondary text-5xl">Pattern Memory</h1>
				<p>Click the squares in order according to their numbers</p>
			</div>
			<Button @click="onRestart">Start</Button>
		</div>

		<div
			v-else-if="
				state === GameState.SHOW_PATTERN ||
				state === GameState.GET_INPUT
			"
			class="w-full flex flex-col gap-8"
		>
			<div class="select-none text-4xl text-center text-primary-500">
				Numbers <span class="text-secondary">{{ level }}</span>
			</div>
			<div
				class="grid w-full gap-2"
				:style="{
					'grid-template-rows': `repeat(${HEIGHT}, minmax(0px, 1fr))`,
					'grid-template-columns': `repeat(${WIDTH}, minmax(0px, 1fr))`,
				}"
			>
				<button
					v-for="(value, index) in field"
					:key="index"
					:class="[
						'flex items-center justify-center text-secondary sm:text-5xl border-4 rounded-md no-tap-highlight',
						value === null &&
							'border-transparent pointer-events-none',
						value !== null && {
							'border-primary-800 ':
								state === GameState.SHOW_PATTERN,
							'bg-secondary border-transparent':
								state === GameState.GET_INPUT,
						},
					]"
					@click="onClick(index)"
				>
					{{ state === GameState.SHOW_PATTERN ? value : null }}
					<div class="h-0 pb-[100%]" />
				</button>
			</div>
		</div>

		<div
			v-else-if="state === GameState.DONE"
			class="flex flex-col items-center gap-8 text-center animate-appear"
		>
			<div class="text-6xl">
				Numbers <span class="text-secondary">{{ level }}</span>
			</div>
			<Button @click="onRestart"> Restart </Button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";

const WIDTH = 8;
const HEIGHT = 5;
const INITIAL_CELLS_AMOUNT = 4;

const SIZE = WIDTH * HEIGHT;

enum GameState {
	RULES,
	SHOW_PATTERN,
	GET_INPUT,
	DONE,
}

type Cell = number | null;

const timeoutId = ref<number>();

const state = ref<GameState>(GameState.RULES);
const level = ref<number>(INITIAL_CELLS_AMOUNT - 1);
const nextCell = ref<number>(1);
const field = ref<Cell[]>(getEmptyField());

function getEmptyField(): Cell[] {
	return new Array<Cell>(SIZE).fill(null);
}

function onRestart() {
	cleanup();

	level.value = INITIAL_CELLS_AMOUNT - 1;

	onNextLevel();
}

function onNextLevel() {
	state.value = GameState.SHOW_PATTERN;

	level.value++;
	nextCell.value = 1;
	field.value = getEmptyField();

	if (level.value >= SIZE) {
		onFail();
	} else {
		generateAndShowField();
	}
}

function generateAndShowField() {
	const availableCells = new Array(SIZE);
	for (let i = 0; i < SIZE; i++) {
		availableCells[i] = i;
	}

	const getRandomIndex = (): number => {
		const index = Math.floor(Math.random() * availableCells.length);
		return availableCells.splice(index, 1)[0];
	};

	for (let value = 1; value <= level.value; value++) {
		const index = getRandomIndex();
		field.value[index] = value;
	}
}

function onClick(index: number) {
	const value = field.value[index];

	if (value === null) {
		return;
	}

	state.value = GameState.GET_INPUT;

	if (value === nextCell.value) {
		field.value[index] = null;
		nextCell.value++;

		if (nextCell.value > level.value) {
			onNextLevel();
		}
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
