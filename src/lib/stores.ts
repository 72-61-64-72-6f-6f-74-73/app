import type { ColorMode, ThemeKey } from "@radroots/theme";
import { type NumberTuple } from "@radroots/utils";
import { writable } from "svelte/store";

export const app_tok = writable<string>('');
export const app_thc = writable<ColorMode>(`dark`);
export const app_th = writable<ThemeKey>(`os`);

export const app_nostr_key = writable<string>(``);
export const app_pwa_polyfills = writable<boolean>(false);

export const map_full_center = writable<NumberTuple>([0, 0]);
export const map_full_zoom = writable<number>(4);
