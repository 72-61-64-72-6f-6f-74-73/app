import { type NumberTuple } from "@radroots/utils";
import { writable } from "svelte/store";

export const app_tok = writable<string>('');

export const map_full_center = writable<NumberTuple>([0, 0]);
export const map_full_zoom = writable<number>(4);
