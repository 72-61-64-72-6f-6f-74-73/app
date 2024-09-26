<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import {
        PUBLIC_DATABASE_NAME,
        PUBLIC_NOSTR_RELAY_DEFAULTS,
    } from "$env/static/public";
    import { lc } from "$lib/client";
    import { _conf } from "$lib/conf";
    import {
        app_nostr_key,
        app_pwa_polyfills,
        app_sqlite,
        app_th,
        app_thc,
    } from "$lib/stores";
    import {
        app_config,
        app_render,
        AppConfig,
        CssStatic,
        kv,
        ndk,
        ndk_setup_privkey,
        ndk_user,
        sleep,
        theme_set,
    } from "@radroots/svelte-lib";
    import { parse_color_mode, parse_theme_key } from "@radroots/theme";
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

    app_config.subscribe(async (app_config) => {
        try {
            if (!app_config) return;
            const db_connected = await lc.db.connect(PUBLIC_DATABASE_NAME);
            if (!db_connected) {
                // @todo
            }
            app_sqlite.set(!!db_connected);

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
            await goto(`/init`);
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
            //init_route = `/models/trade-product/add`;
            const app_init_route = await kv.get(`*-init-route`);
            if (app_init_route) {
                init_route = app_init_route;
                await kv.delete(`*-init-route`);
            }
            console.log(`init_route `, init_route);
            await goto(init_route);
            await sleep(_conf.const.load_delay);
        } catch (e) {
            console.log(`(app_render) error `, e);
        } finally {
            await lc.window.splash_hide();
        }
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
</script>

<svelte:head>
    <meta name="description" content={_conf.app.description} />
    <meta property="og:title" content={_conf.app.title} />
    <meta property="og:description" content={_conf.app.description} />
</svelte:head>
{#if $app_render}
    <slot />
{/if}
<AppConfig />
<CssStatic />
<div
    class="hidden h-nav_base pt-h_nav_base pb-h_nav_base h-nav_lg pt-h_nav_lg pb-h_nav_lg h-tabs_base pt-h_tabs_base pb-h_tabs_base h-tabs_lg pt-h_tabs_lg pb-h_tabs_lg top-dim_map_offset_top_base top-dim_map_offset_top_lg"
></div>
<div class="hidden border-layer-1-surface-edge/40"></div>
