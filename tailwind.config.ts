import { theme_colors, themes } from "@radroots/theme";
import daisyui from "daisyui";
import type { Config } from "tailwindcss";
import tailwind_default from "tailwindcss/defaultTheme";
const { fontFamily: tw_font } = tailwind_default;

const heights = {
  line: `46px`,
  tabs_base: `64px`,
  tabs_lg: `88px`,
};

const widths = {
  line: `320px`
};

const config: Config = {
  content: [
    `src/**/*.{ts,svelte}`,
    `../../packages/svelte-lib/src/**/*.{ts,svelte}`,
  ],
  theme: {
    extend: {
      colors: {
        ...theme_colors,
      },
      fontFamily: {
        sans: ['"SF Pro Display"', ...tw_font.sans],
        serif: [...tw_font.serif],
        mono: [...tw_font.mono],
      },
      fontSize: {
        line: ["1.05rem", { lineHeight: "1.33rem", fontWeight: 300 }],
        trellisTitle: ["0.8rem", { lineHeight: "1rem", fontWeight: 200 }],
      },
      height: {
        ...heights,
      },
      width: {
        ...widths,
      },
      minHeight: {
        ...heights
      },
      minWidth: {
        ...widths
      },
      maxHeight: {
        ...heights
      },
      maxWidth: {
        ...widths
      },
      padding: {
        ...Object.fromEntries(Object.entries(heights).map(([k, v]) => [`h_${k}`, v])),
        ...Object.fromEntries(Object.entries(widths).map(([k, v]) => [`w_${k}`, v])),
      },
      translate: {
        ...Object.fromEntries(Object.entries(heights).map(([k, v]) => [`h_${k}`, v])),
        ...Object.fromEntries(Object.entries(widths).map(([k, v]) => [`w_${k}`, v])),
      },
      borderWidth: {
        "line": "1px"
      },
    }
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: [
      themes.theme_os_dark,
      themes.theme_os_light,
    ],
  },
};

export default config;
