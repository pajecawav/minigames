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
				<h1 class="text-secondary text-5xl">Typing Speed</h1>
				<p>Type as fast as you can</p>
			</div>
			<Button @click="onRestart">Start</Button>
		</div>

		<SpinnerIcon
			v-else-if="state === GameState.LOADING"
			class="w-32 m-auto text-secondary animate-spin"
		/>

		<div
			v-else-if="state === GameState.TYPING"
			class="w-full flex flex-col gap-4"
		>
			<div
				:class="[
					'text-center text-8xl text-primary-500 duration-100',
					{ 'opacity-0': typedLetters === 0 },
				]"
			>
				{{ typedWords }}/{{ totalWords }}
			</div>
			<div class="relative font-mono leading-10 select-none">
				<div
					:class="[
						'absolute text-transparent bg-secondary transition-all duration-100 ease-linear',
						{
							'bg-error/50': !lastLetterWasCorrect,
						},
					]"
					:style="[
						'z-index: -1',
						{
							left: caretPosition.left + 'px',
							top: caretPosition.top + 'px',
						},
					]"
				>
					<!-- invisible letter to give the caret a single character width -->
					a
				</div>

				<span
					v-for="(letter, index) of text.split('')"
					:class="[
						'whitespace-pre-wrap transition-colors duration-100',
						{
							'text-primary-300': index < currentIndex,
							'text-primary-600': index > currentIndex,
						},
					]"
					:id="index === currentIndex ? 'current-letter' : undefined"
					:key="index"
					>{{ letter }}</span
				>
			</div>
			<div
				:class="[
					'text-center text-8xl text-primary-500 duration-100',
					{ 'opacity-0': typedLetters === 0 },
				]"
			>
				{{ wpm }} {{ accuracy }}%
			</div>
		</div>

		<div
			v-else-if="state === GameState.DONE"
			class="flex flex-col items-center gap-8 text-center animate-appear"
		>
			<div class="text-8xl text-primary-500">
				wpm: <span class="text-secondary">{{ wpm }}</span>
			</div>
			<div class="text-8xl text-primary-500">
				acc: <span class="text-secondary">{{ accuracy }}</span
				>%
			</div>
			<Button @click="onRestart"> Restart </Button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onKeyDown, onKeyPressed, useIntervalFn } from "@vueuse/core";
import { computed, nextTick, reactive, ref, watch } from "vue";
import Button from "../components/Button.vue";
import SpinnerIcon from "../icons/SpinnerIcon.vue";

enum GameState {
	RULES,
	LOADING,
	TYPING,
	DONE,
}

const state = ref<GameState>(GameState.RULES);
const text = ref<string>("");
const currentIndex = ref<number>(0);
const startedAt = ref<number | null>(null);
const endedAt = ref<number | null>(null);

const lastLetterWasCorrect = ref<boolean>(true);
const typedWords = ref<number>(0);
const typedLetters = ref<number>(0);

const wpm = ref<number>(0);
const currentLetter = computed(() => text.value[currentIndex.value]);
const totalWords = computed(() => text.value.split(" ").filter(x => x).length);
const accuracy = computed(() =>
	Math.round((100 * currentIndex.value) / typedLetters.value)
);

const caretPosition = reactive<{ top: number; left: number }>({
	top: 0,
	left: 0,
});

function recalculateWpm() {
	if (!startedAt.value) {
		wpm.value = 0;
	} else {
		const endTime = endedAt.value ?? Date.now();
		wpm.value = Math.round(
			(currentIndex.value / 5 / (endTime - startedAt.value)) * 1000 * 60
		);
	}
}

function onRestart() {
	state.value = GameState.LOADING;
	currentIndex.value = 0;
	startedAt.value = null;
	endedAt.value = null;
	typedWords.value = 0;
	typedLetters.value = 0;
	lastLetterWasCorrect.value = true;

	caretPosition.top = 0;
	caretPosition.left = 0;

	fetch("https://api.quotable.io/random")
		.then(response => response.json())
		.then(json => {
			const quote = json.content as string;
			text.value = quote
				.replaceAll("  ", " ")
				.replaceAll("’", "'")
				.replaceAll("‘", "'");

			state.value = GameState.TYPING;
		});
}

function onFinished() {
	state.value = GameState.DONE;
	endedAt.value = Date.now();
	recalculateWpm();
}

useIntervalFn(recalculateWpm, 1 * 1000);

onKeyPressed(
	() => true,
	event => {
		if (state.value !== GameState.TYPING) {
			return;
		}

		event.preventDefault();

		if (startedAt.value === null) {
			startedAt.value = Date.now();
		}

		typedLetters.value++;
		if (event.key === currentLetter.value) {
			currentIndex.value++;
			lastLetterWasCorrect.value = true;

			if (currentIndex.value >= text.value.length) {
				onFinished();
			} else if (event.key === " ") {
				typedWords.value++;
			}
		} else {
			lastLetterWasCorrect.value = false;
		}
	}
);

// HACK: there are some perfomance issues with dynamic refs that cause animation
// stuttering so for now we use an id and a query selector
watch(currentIndex, () => {
	nextTick(() => {
		const currentLetterElem = document.getElementById("current-letter");
		if (currentLetterElem) {
			caretPosition.left = currentLetterElem.offsetLeft;
			caretPosition.top = currentLetterElem.offsetTop;
		}
	});
});

// restart the game on Ctrl Enter
onKeyDown("Enter", event => {
	if (event.ctrlKey) {
		onRestart();
	}
});
</script>
