import type { ICb, IGlOpt, ILabelOpt, NavigationPreviousParam } from "@radroots/svelte-lib";

export type NavParamPrev = NavigationPreviousParam[];
export type NavParamTitle = {
    label: string;
};



export type INavBasis = {
    prev: {
        label?: string;
        route: string;
    };
    title?: {
        label: string;
    };
    option?: ICb & IGlOpt & ILabelOpt;
};