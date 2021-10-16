module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"plugin:vue/essential",
		"eslint:recommended",
		"@vue/typescript/recommended",
	],
	parserOptions: {
		ecmaVersion: 2020,
		parser: "@typescript-eslint/parser",
	},
	plugins: ["vue", "@typescript-eslint"],
	rules: {},
};
