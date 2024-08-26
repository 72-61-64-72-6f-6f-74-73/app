<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { PUBLIC_DATABASE_NAME } from "$env/static/public";
    import { cl } from "$lib/client";
    import LayoutWindow from "$lib/components/layout-window.svelte";
    import { _cf } from "$lib/conf";
    import { app_config, app_key, app_lo, app_pwa_polyfills, app_render, app_sqlite, app_thc, app_thm, app_win } from "$lib/stores";
    import {
        css_static as CssStatic,
        theme_set,
        type PropChildren,
    } from "@radroots/svelte-lib";
    import { parse_color_mode, parse_theme_key } from "@radroots/theme/src/utils";
    import "../app.css";

    let { children }: PropChildren = $props();

    let render_pwa = browser && cl.platform === `web`;
    if (render_pwa) {
        const el = document.createElement(`jeep-sqlite`);
        document.body.appendChild(el);
        customElements
            .whenDefined(`jeep-sqlite`)
            .then(() => {
                app_pwa_polyfills.set(true);
            })
            .catch((e) => {
                console.log(`(pwa polyfills) error `, e);
                app_pwa_polyfills.set(false);
            });
    }

    $effect(() => {
        app_win.set([window.innerHeight, window.innerWidth]);

        const prefers_dark = window.matchMedia(
            `(prefers-color-scheme: dark)`,
        ).matches;

        if (prefers_dark) app_thc.set(`dark`);
        app_config.set(true);
    });

    app_win.subscribe(([win_h, win_w]) => {
        if (win_h > 800) app_lo.set("lg");
    });

    app_thc.subscribe((color_mode) => {
        theme_set(parse_theme_key($app_thm), parse_color_mode(color_mode));
    });

    app_thm.subscribe((theme_key) => {
        theme_set(parse_theme_key(theme_key), parse_color_mode($app_thc));
    });

    app_config.subscribe(async (app_config) => {
        try {
            if (!app_config) return;
            app_sqlite.set(!!(await cl.db.connect(PUBLIC_DATABASE_NAME)));

            const key_active = await cl.preferences.get(_cf.pref_key_active);
            console.log(`key_active `, key_active)
            const nostr_key = await cl.keystore.get(`nostr:key:${key_active}`);
            console.log(`nostr_key `, nostr_key)
            if(typeof nostr_key === `string` && nostr_key) app_key.set(nostr_key);
            else {
                await cl.preferences.remove(_cf.pref_key_active);
                await goto(`/conf/nostr`);
                return;
            }
        } catch (e) {
            console.log(`(app_config) error `, e);
        } finally {
            app_render.set(true);
        }
    });

    app_render.subscribe(async (app_render) => {
        try {
            if (!app_render) return;
            let dev_routes = false;
            let route = "/";
            if (dev_routes) route = `/`;
            await goto(route);
        } catch (e) {
            console.log(`(app_render) error `, e);
        } finally {
            await cl.window.splash_hide();
        }
    });
</script>

<LayoutWindow>
    {@render children()}
</LayoutWindow>
<CssStatic />
