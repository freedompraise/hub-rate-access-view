
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
				'tkh-purple': '#4830B8',
				'tkh-yellow': '#FFD304',
				'tkh-orange': '#DE1010', // This is red-orange from brand guide
				'tkh-teal': '#23D7CB',
				'tkh-navy': '#02084b', // Dark blue for alternating sections
				black: '#000000',
				white: '#FFFFFF',
				border: '#E5E7EB', // subtle UI borders

				// Semantic color mapping
				background: '#FFFFFF',
				foreground: '#000000',
				primary: {
					DEFAULT: '#4830B8', // Purple
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#FFD304', // Yellow
					foreground: '#000000'
				},
				accent: {
					DEFAULT: '#DE1010', // Orange (from brand guide)
					foreground: '#FFFFFF'
				},
				info: '#23D7CB', // Teal
				destructive: {
					DEFAULT: '#DE1010',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F9FAFB',
					foreground: '#6B7280'
				},
				input: '#F3F4F6',
				ring: '#4830B8', // Changed from red to purple
			},
			fontFamily: {
				sans: ["Poppins", "sans-serif"],
				serif: ["Cinzel", "serif"],
			},			backgroundImage: {
				'hero-gradient': 'linear-gradient(25deg, #DE1010, #FFD304)',
				'info-gradient': 'linear-gradient(135deg, #23D7CB, #FFD304)',
				'cta-hover': 'linear-gradient(135deg, #FFD304, #DE1010)',
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
