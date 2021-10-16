const colors = require("tailwindcss/colors");

module.exports = {
	purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	mode: "jit",
	darkMode: false, // or 'media' or 'class'
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
					...colors.trueGray,
				},
				secondary: {
					...colors.yellow,
					DEFAULT: colors.yellow["400"],
				},
				// TODO: better color names
				success: colors.emerald[500],
				error: colors.red[400],
			},
		},
	},

	variants: {
		extend: {},
	},
	plugins: [],
};
