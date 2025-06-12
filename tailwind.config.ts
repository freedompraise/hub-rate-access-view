import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				// Brand colors
				primary: {
					DEFAULT: "#4830B8", // Purple
					foreground: "#FFFFFF"
				},
				secondary: {
					DEFAULT: "#FFD304", // Yellow
					foreground: "#000000"
				},
				accent: {
					DEFAULT: "#DE1010", // Orange/Red
					foreground: "#FFFFFF"
				},
				info: "#23D7CB",       // Teal
				black: "#000000",
				white: "#FFFFFF",
				background: "#FFFFFF",
				foreground: "#000000",

				// Custom named access for usage
				"tkh-purple": "#4830B8",
				"tkh-yellow": "#FFD304",
				"tkh-orange": "#DE1010",
				"tkh-teal": "#23D7CB",
				"tkh-black": "#000000",
				"tkh-white": "#FFFFFF"
			},
			fontFamily: {
				sans: ["Poppins", "sans-serif"],
				serif: ["Cinzel", "serif"],
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
