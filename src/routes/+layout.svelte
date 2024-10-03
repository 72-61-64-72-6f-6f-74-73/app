<script lang="ts">
    import { browser } from "$app/environment";
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
        type NostrRelayFormFields,
        parse_nostr_relay_form_keys,
    } from "@radroots/models";
    import {
        app_config,
        app_notify,
        app_render,
        AppConfig,
        CssStatic,
        CssStyles,
        ndk,
        ndk_init,
        ndk_user,
        nostr_relays_connected,
        nostr_relays_poll_documents,
        route,
        sleep,
        theme_set,
    } from "@radroots/svelte-lib";
    import { parse_color_mode, parse_theme_key } from "@radroots/theme";
    import { parse_nostr_relay_information_document_fields } from "@radroots/utils";
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
            const db_connected = await lc.db.connect();
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

    app_nostr_key.subscribe(async (_app_nostr_key) => {
        try {
            if (!_app_nostr_key) return;

            const secret_key = await lc.keystore.get(
                _conf.kv.nostr_key(_app_nostr_key),
            );
            if (!secret_key) {
                alert(`!secret_key`); //@todo
                return;
            }

            const nostr_relays = await lc.db.nostr_relay_get({
                list: ["all"],
            });
            if (typeof nostr_relays === `string`) {
                alert(nostr_relays); //@todo
                return;
            }

            for (const { url } of nostr_relays) $ndk.addExplicitRelay(url);

            await $ndk.connect().then(() => {
                console.log(`(ndk) connected`);
            });

            const ndk_user = await ndk_init({
                $ndk,
                secret_key,
            });
            if (!ndk_user) {
                alert(`!ndk_user`); //@todo
                return;
            }

            $ndk_user = ndk_user;
            $ndk_user.ndk = $ndk;
            console.log(`(ndk) initialized`);
            nostr_relays_poll_documents.set(true);
        } catch (e) {
            console.log(`(app_nostr_key) error `, e);
        }
    });

    app_notify.subscribe(async (_app_notify) => {
        if (!_app_notify) return;
        route(`/`);
        await sleep(_conf.delay.notify);
        lc.dialog.alert(_app_notify);
        app_notify.set(``);
    });

    nostr_relays_poll_documents.subscribe(
        async (_nostr_relays_poll_documents) => {
            try {
                if (!_nostr_relays_poll_documents) return;
                await fetch_relay_documents();
            } catch (e) {
                console.log(`(error) nostr_relays_poll_documents`, e);
            }
        },
    );

    const fetch_relay_documents = async (): Promise<void> => {
        try {
            const nostr_relays = await lc.db.nostr_relay_get({
                list: ["on_key", { public_key: $app_nostr_key }],
            });
            if (typeof nostr_relays === `string`) throw new Error();

            const unconnected_relays = nostr_relays.filter(
                (i) => !$nostr_relays_connected.includes(i.id),
            );
            if (unconnected_relays.length === 0) {
                nostr_relays_poll_documents.set(false);
                return;
            }

            for (const nostr_relay of unconnected_relays) {
                const res = await lc.http.fetch({
                    url: nostr_relay.url.replace(`ws://`, `http://`),
                    headers: {
                        Accept: "application/nostr+json",
                    },
                });
                if (typeof res === `string`) continue;
                else if (res.status === 200 && res.data) {
                    const doc = parse_nostr_relay_information_document_fields(
                        res.data,
                    );
                    if (!doc) continue;
                    const fields: Partial<NostrRelayFormFields> = {};
                    for (const [k, v] of Object.entries(doc)) {
                        const field_k = parse_nostr_relay_form_keys(k);
                        if (field_k) fields[field_k] = v;
                    }
                    if (Object.keys(fields).length < 1) continue;
                    await lc.db.nostr_relay_update({
                        on: {
                            url: nostr_relay.url,
                        },
                        fields,
                    });
                    nostr_relays_connected.set(
                        Array.from(
                            new Set([
                                ...$nostr_relays_connected,
                                nostr_relay.id,
                            ]),
                        ),
                    );
                }
            }

            setTimeout(
                fetch_relay_documents,
                _conf.delay.nostr_relay_poll_document,
            );
        } catch (e) {
            console.log(`(error) fetch_relay_documents `, e);
        }
    };
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
<CssStyles />
<div
    class="hidden h-nav_base pt-h_nav_base pb-h_nav_base h-nav_lg pt-h_nav_lg pb-h_nav_lg h-tabs_base pt-h_tabs_base pb-h_tabs_base h-tabs_lg pt-h_tabs_lg pb-h_tabs_lg top-dim_map_offset_top_base top-dim_map_offset_top_lg"
></div>
<div class="hidden border-layer-1-surface-edge/40"></div>
