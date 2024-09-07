import type { ColorMode } from "@radroots/theme";
import { type NumberTuple } from "@radroots/utils";

type Conf = {
    app: Record<string, string>;
    pref: Record<string, string>;
    map: {
        styles: {
            base: Record<ColorMode, string>;
        },
        popup: {
            dot: {
                offset: NumberTuple;
            }
        }
    }
}

export const _cf: Conf = {
    app: {
        root_symbol: "»--`--,---",
        title: `Radroots`,
        description: `Creating networks between farmers, communities and small businesses that give customers greater access to natural foods and grow circular economies where profits are more fairly distributed. Radroots is built on the Nostr protocol and released under a copyleft open source license to provide transparency and give users the option to offer feedback and add or request new features.`
    },
    pref: {
        key_active: `nostr:key:active`
    },
    map: {
        styles: {
            base: {
                light: `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json`,
                dark: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`
            }
        },
        popup: {
            dot: {
                offset: [0, -10] as const
            }
        }
    }
};