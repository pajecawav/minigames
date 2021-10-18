import ChimpTest from "@/pages/ChimpTest.vue";
import Home from "@/pages/Home.vue";
import NumberMemory from "@/pages/NumberMemory.vue";
import PatternMemory from "@/pages/PatternMemory.vue";
import ReactionTime from "@/pages/ReactionTime.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{ path: "/", component: Home },
	{ path: "/reaction-time", component: ReactionTime },
	{ path: "/number-memory", component: NumberMemory },
	{ path: "/pattern-memory", component: PatternMemory },
	{ path: "/chimp-test", component: ChimpTest },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
