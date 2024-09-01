import type { AppLayoutKey } from "@radroots/svelte-lib";
import { type ColorMode, type ThemeKey } from "@radroots/theme";
import { writable } from "svelte/store";

export const app_thc = writable<ColorMode>(`light`);
export const app_thm = writable<ThemeKey>(`os`);

export const app_config = writable<boolean>(false);
export const app_render = writable<boolean>(false);
export const app_layout = writable<AppLayoutKey>(`base`);
export const app_win = writable<[number, number]>([0, 0]);

export const app_nav_blur = writable<boolean>(false);

export const app_tabs_visible = writable<boolean>(false);
export const app_tabs_blur = writable<boolean>(false);
export const app_tab_active = writable<number>(0);

export const app_nostr_key = writable<string>(``);
export const app_pwa_polyfills = writable<boolean>(false);
export const app_sqlite = writable<boolean>(false);

export const app_nav_visible = writable<boolean>(false);
//export const app_nav_prev = writable<NavParamPrev>([]);
//export const app_nav_title = writable<NavParamTitle | false>(false);

export const app_init_route = writable<string>(``);

export const map_full_center = writable<[number, number]>([0, 0]);
export const map_full_zoom = writable<number>(4);
