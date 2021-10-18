<template>
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
				class="grid place-items-center space-y-4 text-center"
			>
				<div class="max-w-[36rem] text-center leading-relaxed">
					<h1 class="text-secondary text-5xl">Pattern Memory</h1>
					<p>
						Remember the increasingly long pattern of button presses
					</p>
				</div>
				<Button @click="onRestart">Start</Button>
			</div>

			<div
				v-else-if="
					state === GameState.SHOW_PATTERN ||
					state === GameState.GET_INPUT
				"
				class="max-w-xl w-full flex flex-col gap-4"
			>
				<div class="select-none text-4xl text-center text-primary-500">
					Level <span class="text-secondary">{{ levelRepr }}</span>
				</div>
				<div
					class="grid w-full gap-2"
					:style="{
						'grid-template-rows': `repeat(${size}, minmax(0px, 1fr))`,
						'grid-template-columns': `repeat(${size}, minmax(0px, 1fr))`,
					}"
				>
					<template v-for="(_, y) in size">
						<button
							v-for="(_, x) in size"
							:key="`${x}-${y}`"
							:class="[
								'h-0 pb-[100%] rounded-md transition-all duration-300 animate-appear-zoom ease-out no-tap-highlight',
								{
									'bg-primary-800':
										getCellState(x, y) === CellState.IDLE,
								},
								{
									'bg-error/25 animate-shake':
										getCellState(x, y) === CellState.WRONG,
								},
								{
									'bg-secondary rotate-x-180':
										getCellState(x, y) ===
										CellState.CORRECT,
								},
							]"
							@click="onClick(x, y)"
						/>
					</template>
				</div>
			</div>

			<div
				v-else-if="state === GameState.DONE"
				class="
					flex flex-col
					items-center
					gap-8
					text-center
					animate-appear
				"
			>
				<div class="text-6xl">
					Level <span class="text-secondary">{{ levelRepr }}</span>
				</div>
				<Button @click="onRestart"> Restart </Button>
			</div>
		</div>
	</Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";

const HIDE_PATTERN_TIMEOUT = 2;
const INITIAL_LIVES = 3;
const MAX_FIELD_FILL_COEF = 0.3;

enum GameState {
	RULES,
	SHOW_PATTERN,
	GET_INPUT,
	DONE,
}

enum CellState {
	IDLE,
	CORRECT,
	WRONG,
}

function getEmptyField(width: number, height: number): CellState[] {
	return new Array<CellState>(width * height).fill(CellState.IDLE);
}

const timeoutId = ref<number>();

const state = ref<GameState>(GameState.RULES);
const level = ref<number>(2);
const lives = ref(INITIAL_LIVES);
const levelCells = ref<Set<number>>(new Set());
const field = ref<CellState[]>([]);

const levelRepr = computed(() => level.value - 2);

const size = computed(() =>
	Math.floor(Math.sqrt(level.value / MAX_FIELD_FILL_COEF))
);

function onRestart() {
	cleanup();

	level.value = 2;

	onNextLevel();
}

function onNextLevel() {
	state.value = GameState.SHOW_PATTERN;
	lives.value = INITIAL_LIVES;

	level.value++;
	field.value = getEmptyField(size.value, size.value);
	levelCells.value.clear();

	timeoutId.value = setTimeout(generateAndShowField, 0.75 * 1000);
}

function generateAndShowField() {
	const cellsToGenerate = level.value;
	levelCells.value.clear();

	while (levelCells.value.size < cellsToGenerate) {
		levelCells.value.add(
			Math.floor(Math.random() * size.value * size.value)
		);
	}

	nextTick(() => {
		timeoutId.value = setTimeout(() => {
			state.value = GameState.GET_INPUT;
		}, HIDE_PATTERN_TIMEOUT * 1000);
	});
}

function getCellState(x: number, y: number): CellState {
	const index = x + y * size.value;
	if (state.value === GameState.SHOW_PATTERN && levelCells.value.has(index)) {
		return CellState.CORRECT;
	}
	return field.value[index];
}

function onClick(x: number, y: number) {
	if (
		state.value !== GameState.GET_INPUT ||
		levelCells.value.size === 0 ||
		lives.value === 0
	) {
		return;
	}

	const cell = field.value[x + y * size.value];
	if (cell !== CellState.IDLE) {
		return;
	}

	// reveal right/wrong cell
	const index = x + y * size.value;
	if (levelCells.value.has(index)) {
		field.value[index] = CellState.CORRECT;
		levelCells.value.delete(index);

		if (levelCells.value.size === 0) {
			timeoutId.value = setTimeout(onNextLevel, 1 * 1000);
		}
	} else {
		field.value[index] = CellState.WRONG;
		lives.value--;

		if (lives.value === 0) {
			setTimeout(onFail, 0.75 * 1000);
		}
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
