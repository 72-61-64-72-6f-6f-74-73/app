import { type NumberTuple } from "@radroots/utils";
import { writable } from "svelte/store";

export const app_nostr_key = writable<string>(``);
export const app_pwa_polyfills = writable<boolean>(false);
export const app_sqlite = writable<boolean>(false);

export const map_full_center = writable<NumberTuple>([0, 0]);
export const map_full_zoom = writable<number>(4);

export const carousel_active = writable<boolean>(false);
export const carousel_index = writable<number>(0);
export const carousel_index_max = writable<number>(0);
