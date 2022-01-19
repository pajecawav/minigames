const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		fontFamily: {
			mono: [
				"Roboto Mono",
				"ui-monospace",
				"SFMono-Regular",
				"Menlo",
				"Monaco",
				"Consolas",
				"Liberation Mono",
				"Courier New",
				"monospace",
			],
		},
		extend: {
			colors: {
				button: colors.white,
				primary: {
					...colors.neutral,
				},
				secondary: {
					...colors.yellow,
					DEFAULT: colors.yellow["400"],
				},
				success: colors.emerald[500],
				error: colors.red[400],
			},
			animation: {
				shake: "shake 0.2s ease-out",
				appear: "appear 0.2s ease-out",
			},
		},
	},

	variants: {
		extend: {},
	},
	plugins: [],
};
