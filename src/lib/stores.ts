import { type ColorMode, type ThemeKey } from "@radroots/theme";
import { type NumberTuple } from "@radroots/utils";
import { writable } from "svelte/store";

export const app_thc = writable<ColorMode>(`light`);
export const app_thm = writable<ThemeKey>(`os`);

export const app_config = writable<boolean>(false);
export const app_render = writable<boolean>(false);
export const app_win = writable<NumberTuple>([0, 0]);

export const app_tabs_visible = writable<boolean>(false);
export const app_tabs_blur = writable<boolean>(false);
export const app_tab_active = writable<number>(0);

export const app_nostr_key = writable<string>(``);
export const app_pwa_polyfills = writable<boolean>(false);
export const app_sqlite = writable<boolean>(false);

export const app_init_route = writable<string>(``);

export const map_full_center = writable<NumberTuple>([0, 0]);
export const map_full_zoom = writable<number>(4);
