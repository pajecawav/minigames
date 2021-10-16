import Home from "@/pages/Home.vue";
import ReactionTime from "@/pages/ReactionTime.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{ path: "/", component: Home },
	{ path: "/reaction-time", component: ReactionTime },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
