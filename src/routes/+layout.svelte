<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { PUBLIC_DATABASE_NAME } from "$env/static/public";
    import { cl } from "$lib/client";
    import LayoutWindow from "$lib/components/layout-window.svelte";
    import { _cf } from "$lib/conf";
    import { app_config, app_key, app_layout, app_pwa_polyfills, app_render, app_sqlite, app_thc, app_thm, app_win } from "$lib/stores";
    import {
        css_static as CssStatic,
        sleep,
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
        if (win_h > 800) app_layout.set("lg");
    });

    app_thc.subscribe((app_thc) => {
        const color_mode = parse_color_mode(app_thc);
        theme_set(parse_theme_key($app_thm), color_mode);
        cl.window.status_style(color_mode);
    });

    app_thm.subscribe((app_thm) => {
        const color_mode = parse_color_mode($app_thc);
        theme_set(parse_theme_key(app_thm), color_mode);
        cl.window.status_style(color_mode);
    });

    app_sqlite.subscribe((app_sqlite) => {
        if(!app_sqlite) return;
        console.log(`(app_sqlite) connected`);
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
            await sleep(321);
        } catch (e) {
            console.log(`(app_render) error `, e);
        } finally {
            await cl.window.splash_hide();
        }
    });
</script>
{#if $app_render}
    <LayoutWindow>
        {@render children()}
    </LayoutWindow>
{/if}
<CssStatic />
<div class="hidden h-nav_base pt-h_nav_base pb-h_nav_base h-nav_lg pt-h_nav_lg pb-h_nav_lg h-tabs_base pt-h_tabs_base pb-h_tabs_base h-tabs_lg pt-h_tabs_lg pb-h_tabs_lg"></div>
