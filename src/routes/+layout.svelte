<script lang="ts">
    import { browser } from "$app/environment";
    import { geoc, lc } from "$lib/client";
    import { _conf } from "$lib/conf";
    import { defineCustomElements as pwaElements } from "@ionic/pwa-elements/loader";
    import {
        app_config,
        app_db,
        app_geoc,
        app_nostr_key,
        app_notify,
        app_pwa_polyfills,
        app_render,
        app_th,
        app_thc,
        AppControls,
        CssStatic,
        CssStyles,
        route,
        sleep,
        theme_set,
    } from "@radroots/svelte-lib";
    import { parse_color_mode, parse_theme_key } from "@radroots/theme";
    import {
        applyPolyfills,
        defineCustomElements as jeepSqlite,
    } from "jeep-sqlite/loader";
    import "../app.css";

    $: {
        if (browser && lc.platform === `web`) {
            applyPolyfills().then(() => {
                pwaElements(window);
                jeepSqlite(window);
            });
            const el = document.createElement(`jeep-sqlite`);
            document.body.appendChild(el);
            customElements
                .whenDefined(`jeep-sqlite`)
                .then(() => {
                    app_config.set(true);
                })
                .catch((e) => {
                    console.log(`(pwa polyfills) error `, e);
                    app_pwa_polyfills.set(false);
                });
        } else if (browser) {
            app_config.set(true);
        }
    }

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

    app_db.subscribe((_app_db) => {
        if (!_app_db) return;
        console.log(`(app_db) success`);
    });

    app_geoc.subscribe((_app_geoc) => {
        if (!_app_geoc) return;
        console.log(`(app_geoc) success`);
    });

    app_config.subscribe(async (app_config) => {
        try {
            if (!app_config) return;
            console.log(`app_config!`);

            const db_connected = await lc.db.connect();
            app_db.set(!!db_connected);

            const geoc_connected = await geoc.connect();
            app_geoc.set(!!geoc_connected);

            const active_key_public = await lc.preferences.get(
                _conf.kv.nostr_key_active,
            );
            if (active_key_public) {
                const active_key_secret = await lc.keystore.get(
                    _conf.kv.nostr_key(active_key_public),
                );
                if (active_key_secret) {
                    app_nostr_key.set(active_key_public);
                    return;
                }
            }

            await lc.preferences.remove(_conf.kv.nostr_key_active);
            await route(`/init`);
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
            /*
            let init_route = `/`;
            //init_route = `/models/trade-product/add`;
            const app_init_route = await kv.get(_conf.cmd.layout_route);
            if (app_init_route) {
                init_route = app_init_route;
                await kv.delete(_conf.cmd.layout_route);
            }
            console.log(`init_route `, init_route);
            */
            await sleep(_conf.delay.load);
        } catch (e) {
            console.log(`(app_render) error `, e);
        } finally {
            await lc.window.splash_hide();
        }
    });

    app_notify.subscribe(async (_app_notify) => {
        if (!_app_notify) return;
        route(`/`);
        await sleep(_conf.delay.notify);
        lc.dialog.alert(_app_notify);
        app_notify.set(``);
    });
</script>

<svelte:head>
    <meta name="description" content={_conf.app.description} />
    <meta property="og:title" content={_conf.app.title} />
    <meta property="og:description" content={_conf.app.description} />
</svelte:head>
{#if $app_render}
    <slot />
{/if}
<AppControls />
<CssStatic />
<CssStyles />
<div
    class="hidden h-nav_base pt-h_nav_base pb-h_nav_base h-nav_lg pt-h_nav_lg pb-h_nav_lg h-tabs_base pt-h_tabs_base pb-h_tabs_base h-tabs_lg pt-h_tabs_lg pb-h_tabs_lg top-dim_map_offset_top_base top-dim_map_offset_top_lg"
></div>
<div class="hidden border-layer-1-surface-edge/40 text-blue-400"></div>
