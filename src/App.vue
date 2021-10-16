<template>
	<div
		class="w-full h-full max-w-4xl flex flex-col py-3 px-4 mx-auto text-xl"
	>
		<header class="mb-10 text-5xl font-mono text-secondary">
			<RouterLink to="/">
				<span class="text-center sm:text-left">minigames</span>
			</RouterLink>
		</header>

		<div class="text-3xl flex-grow">
			<RouterView />
		</div>
	</div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>
