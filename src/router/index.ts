import Home from "@/pages/Home.vue";
import NumberMemory from "@/pages/NumberMemory.vue";
import ReactionTime from "@/pages/ReactionTime.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{ path: "/", component: Home },
	{ path: "/reaction-time", component: ReactionTime },
	{ path: "/number-memory", component: NumberMemory },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
