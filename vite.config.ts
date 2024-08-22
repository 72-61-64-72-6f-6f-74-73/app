import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit()
	],
	clearScreen: false,
	server: {
		port: process.env.RADROOTS_APP_PORT,
		strictPort: true,
		host: "localhost",
	},
});
