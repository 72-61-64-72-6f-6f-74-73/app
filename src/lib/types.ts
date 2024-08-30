import type { NavigationPreviousParam } from "@radroots/svelte-lib";

export type NavParam = {
    prev?: NavigationPreviousParam[];
    title?: {
        label: string
    };
}

/*
let previous_route = $state(``);
let previous_param = $state(``);
let previous_label = $state(``);

let title_label = $state(``);
*/