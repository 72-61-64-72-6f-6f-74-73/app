<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { PUBLIC_DATABASE_NAME } from "$env/static/public";
    import { cl } from "$lib/client";
    import LayoutWindow from "$lib/components/layout-window.svelte";
    import {
        app_config,
        app_lo,
        app_pwa_polyfills,
        app_render,
        app_sqlite,
        app_thc,
        app_thm,
        app_win,
        css_static as CssStatic,
        theme_set,
        type PropChildren,
    } from "@radroots/svelte-lib";
    import "../app.css";

    let { children }: PropChildren = $props();

    let app_visible = $state(false);

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
        theme_set($app_thm, color_mode);
    });

    app_thm.subscribe((theme_key) => {
        theme_set(theme_key, $app_thc);
    });

    app_config.subscribe(async (app_config) => {
        try {
            if (!app_config) return;
            $app_sqlite = !!(await cl.db.connect(PUBLIC_DATABASE_NAME));
        } catch (e) {
            console.log(`(app_config) error `, e);
        } finally {
            app_render.set(true);
        }
    });

    app_render.subscribe(async (app_render) => {
        try {
            if (!app_render) {
                app_visible = false;
                return;
            }

            let dev_routes = false;
            let route = "/";
            if (dev_routes) route = `/`;
            await goto(route);
        } catch (e) {
            console.log(`(app_render) error `, e);
        } finally {
            app_visible = true;
        }
    });
</script>

{#if app_visible}
    <LayoutWindow>
        {@render children()}
    </LayoutWindow>
{:else}
    <div class={`flex flex-col w-full justify-center items-center`}>
        <button
            class={`flex flex-row justify-center items-center`}
            onclick={async () => {
                location.reload();
            }}
        >
            <div
                class={`flex flex-col h-line w-line justify-center items-center bg-layer-1-surface`}
            >
                <p class={`font-mono text-sm lowercase text-layer-2-glyph`}>
                    {`There was an error loading the app. Click to reload.`}
                </p>
            </div>
        </button>
    </div>
{/if}
<CssStatic />
