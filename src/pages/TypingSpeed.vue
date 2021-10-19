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
				<div class="font-mono leading-10 select-none">
					<span
						v-for="(letter, index) of text.split('')"
						:class="[
							'whitespace-pre-wrap',
							{
								'text-primary-300': index < currentIndex,
								'bg-secondary': index === currentIndex,
								'text-primary-600': index > currentIndex,
								'bg-error/50':
									index === currentIndex &&
									!lastLetterWasCorrect,
							},
						]"
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
				class="
					flex flex-col
					items-center
					gap-8
					text-center
					animate-appear
				"
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
	</Transition>
</template>

<script setup lang="ts">
import { onKeyDown, onKeyPressed, useIntervalFn } from "@vueuse/core";
import { computed, ref } from "vue";
import Button from "../components/Button.vue";
import SpinnerIcon from "../icons/SpinnerIcon.vue";

enum GameState {
	RULES,
	LOADING,
	TYPING,
	DONE,
}

const recalculateWpmIntervalId = ref<number>();

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

// recalculate wpm each second
useIntervalFn(() => {
	if (!startedAt.value) {
		wpm.value = 0;
	} else {
		const endTime = endedAt.value ?? Date.now();
		wpm.value = Math.round(
			(typedWords.value / (endTime - startedAt.value)) * 1000 * 60
		);
	}
}, 1 * 1000);

function onRestart() {
	state.value = GameState.LOADING;
	currentIndex.value = 0;
	startedAt.value = null;
	endedAt.value = null;
	typedWords.value = 0;
	typedLetters.value = 0;
	lastLetterWasCorrect.value = true;

	fetch("https://api.quotable.io/random")
		.then(response => response.json())
		.then(json => {
			const quote = json.content as string;
			text.value = quote.replaceAll("  ", " ");

			state.value = GameState.TYPING;
		});
}

function onFinished() {
	state.value = GameState.DONE;
	endedAt.value = Date.now();
}

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

// restart the game on Ctrl Enter
onKeyDown("Enter", event => {
	if (event.ctrlKey) {
		onRestart();
	}
});
</script>
