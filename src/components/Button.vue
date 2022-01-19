<template>
	<button
		class="px-6 py-1 bg-secondary text-primary-800 rounded-md transition-colors duration-300 hover:bg-secondary/80 focus:ring-2 focus:ring-secondary focus:ring-offset-4 focus:ring-offset-primary-700 focus:outline-none"
		v-bind="$attrs"
	>
		<slot />
	</button>
</template>
