<template>
	<div class="grid gap-4 sm:gap-6 grid-cols-1 auto-rows-fr sm:grid-cols-2">
		<MinigameLink
			v-for="game in minigames"
			class="animate-appear-zoom no-tap-highlight"
			:to="game.link"
			:name="game.name"
			:key="game.link"
		>
			<template v-if="game.icon" #icon>
				<component class="w-16 sm:w-24" :is="game.icon" />
			</template>
		</MinigameLink>
	</div>
</template>

<script setup lang="ts">
import MinigameLink from "../components/MinigameLink.vue";
import LightningIcon from "../icons/LightningIcon.vue";

interface Link {
	link: string;
	name: string;
	icon?: Object;
}

const minigames: Link[] = [
	{ link: "/reaction-time", name: "Reaction Time", icon: LightningIcon },
	{ link: "/number-memory", name: "Number Memory" },
	{ link: "/pattern-memory", name: "Pattern Memory" },
	{ link: "/chimp-test", name: "Chimp Test" },
];
</script>
