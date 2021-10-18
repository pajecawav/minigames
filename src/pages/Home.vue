<template>
	<div class="grid gap-10 grid-cols-1 auto-rows-fr sm:grid-cols-2">
		<Transition
			v-for="game in minigames"
			enter-from-class="scale-[0.8]"
			:appear="true"
			:key="game.link"
		>
			<MinigameLink :to="game.link" :name="game.name">
				<template v-if="game.icon" #icon>
					<component class="w-16 sm:w-24" :is="game.icon" />
				</template>
			</MinigameLink>
		</Transition>
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
];
</script>
