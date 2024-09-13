<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import {
        PUBLIC_DATABASE_NAME,
        PUBLIC_NOSTR_RELAY_DEFAULTS,
    } from "$env/static/public";
    import { lc } from "$lib/client";
    import { _cf } from "$lib/conf";
    import {
        app_config,
        app_nostr_key,
        app_pwa_polyfills,
        app_render,
        app_sqlite,
        app_th,
        app_thc,
        app_win,
    } from "$lib/stores";
    import {
        app_layout,
        CssStatic,
        kv,
        ndk,
        ndk_setup_privkey,
        ndk_user,
        sleep,
        theme_set,
    } from "@radroots/svelte-lib";
    import {
        parse_color_mode,
        parse_theme_key,
    } from "@radroots/theme/src/utils";
    import { onMount } from "svelte";
    import "../app.css";

    let render_pwa = browser && lc.platform === `web`;
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

    onMount(async () => {
        try {
            app_win.set([window.innerHeight, window.innerWidth]);

            const prefers_dark = window.matchMedia(
                `(prefers-color-scheme: dark)`,
            ).matches;

            if (prefers_dark) app_thc.set(`dark`);
            app_config.set(true);
        } catch (e) {
            console.log(`(layout mount) `, e);
        } finally {
        }
    });

    app_win.subscribe(([win_h, win_w]) => {
        if (win_h > 800) app_layout.set("lg");
    });

    app_thc.subscribe((app_thc) => {
        const color_mode = parse_color_mode(app_thc);
        theme_set(parse_theme_key($app_th), color_mode);
        lc.window.status_style(color_mode);
    });

    app_th.subscribe((app_th) => {
        const color_mode = parse_color_mode($app_thc);
        theme_set(parse_theme_key(app_th), color_mode);
        lc.window.status_style(color_mode);
    });

    app_sqlite.subscribe((app_sqlite) => {
        if (!app_sqlite) return;
        console.log(`(app_sqlite) connected`);
    });

    app_nostr_key.subscribe(async (app_nostr_key) => {
        try {
            if (!app_nostr_key) return;
            const private_key = await lc.keystore.get(
                `nostr:key:${app_nostr_key}`,
            );
            if (private_key) {
                for (const url of PUBLIC_NOSTR_RELAY_DEFAULTS.split(","))
                    $ndk.addExplicitRelay(url);
                await $ndk.connect().then(() => {
                    console.log(`(ndk) connected`);
                });
                const setup_user = await ndk_setup_privkey({
                    $ndk,
                    private_key,
                });
                if (setup_user) {
                    $ndk_user = setup_user;
                    $ndk_user.ndk = $ndk;
                    console.log(`(ndk_user) connected`);
                }
            }
        } catch (e) {
            console.log(`(app_nostr_key) error `, e);
        }
    });

    app_config.subscribe(async (app_config) => {
        try {
            if (!app_config) return;
            app_sqlite.set(!!(await lc.db.connect(PUBLIC_DATABASE_NAME)));
            const active_nostr_pk = await lc.preferences.get(
                _cf.pref.key_active,
            );
            console.log(`active_nostr_pk `, active_nostr_pk);
            const active_nostr_sk = await lc.keystore.get(
                `nostr:key:${active_nostr_pk}`,
            );
            console.log(`active_nostr_sk `, active_nostr_sk);
            if (
                typeof active_nostr_sk === `string` &&
                active_nostr_sk &&
                active_nostr_pk
            )
                app_nostr_key.set(active_nostr_pk);
            else {
                await lc.preferences.remove(_cf.pref.key_active);
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
            console.log(`app_render `, app_render);
            if (!app_render) return;
            let init_route = `/`;
            init_route = `/models/trade-product/add`;
            const app_init_route = await kv.get(`*-init-route`);
            if (app_init_route) {
                init_route = app_init_route;
                await kv.delete(`*-init-route`);
            }
            console.log(`init_route `, init_route);
            await goto(init_route);
            await sleep(321);
        } catch (e) {
            console.log(`(app_render) error `, e);
        } finally {
            await lc.window.splash_hide();
        }
    });
</script>

<svelte:head>
    <meta name="description" content={_cf.app.description} />
    <meta property="og:title" content={_cf.app.title} />
    <meta property="og:description" content={_cf.app.description} />
</svelte:head>
{#if $app_render}
    <slot />
{/if}
<CssStatic />
<div
    class="hidden h-nav_base pt-h_nav_base pb-h_nav_base h-nav_lg pt-h_nav_lg pb-h_nav_lg h-tabs_base pt-h_tabs_base pb-h_tabs_base h-tabs_lg pt-h_tabs_lg pb-h_tabs_lg top-dim_map_offset_top_base top-dim_map_offset_top_lg"
></div>
<div class="hidden border-layer-1-surface-edge/40"></div>
