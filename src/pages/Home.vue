<template>
	<div class="grid gap-10 grid-cols-1 auto-rows-fr md:grid-cols-2">
		<MinigameLink to="/reaction-time" name="Reaction Time">
			<template #icon>
				<LightningIcon class="w-24" />
			</template>
		</MinigameLink>
	</div>
</template>

<script setup lang="ts">
import MinigameLink from "../components/MinigameLink.vue";
import LightningIcon from "../icons/LightningIcon.vue";
</script>
