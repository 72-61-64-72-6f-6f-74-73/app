<script lang="ts">
    import { lc } from "$lib/client";
    import { app_nostr_key } from "$lib/stores";
    import type { NostrRelay } from "@radroots/models";
    import {
        app_notify,
        GlyphCircle,
        LayoutTrellis,
        LayoutView,
        Nav,
        nav_prev,
        nostr_relays_connected,
        route,
        t,
        Trellis,
        type ITrellisKindTouch,
    } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    type LoadData = {
        nostr_relays: NostrRelay[];
        nostr_relays_other: NostrRelay[];
    };
    let ld: LoadData | undefined = undefined;

    let loading_edit_id = ``;
    let show_edit = false;

    onMount(async () => {
        try {
            ld = await load_data();
        } catch (e) {
        } finally {
        }
    });

    const load_data = async (): Promise<LoadData | undefined> => {
        try {
            const nostr_relays = await lc.db.nostr_relay_get({
                list: [`on_profile`, { public_key: $app_nostr_key }],
                sort: `oldest`,
            });
            if (`err` in nostr_relays) {
                app_notify.set(`Error loading page`);
                return;
            }

            const nostr_relays_other = await lc.db.nostr_relay_get({
                list: [`off_profile`, { public_key: $app_nostr_key }],
                sort: `oldest`,
            });
            if (`err` in nostr_relays_other) {
                app_notify.set(`Error loading page`);
                return;
            }

            const data: LoadData = {
                nostr_relays: nostr_relays.results,
                nostr_relays_other: nostr_relays_other.results,
            };
            return data;
        } catch (e) {
            console.log(`(error) load_data `, e);
        }
    };

    let tr_list_relays: ITrellisKindTouch[] = [];
    $: tr_list_relays = ld?.nostr_relays.length
        ? ld.nostr_relays.map((nostr_relay) => ({
              layer: 1,
              hide_active: show_edit,
              touch: {
                  label: {
                      left: [
                          {
                              value: nostr_relay.url,
                          },
                      ],
                  },
                  callback: async () => {
                      if (show_edit) return;
                      nav_prev.set([
                          ...$nav_prev,
                          {
                              route: `/models/nostr-relay`,
                              label: `Relays`,
                          },
                      ]);
                      await route(`/models/nostr-relay/view`, [
                          [`id`, nostr_relay.id],
                      ]);
                  },
              },
              offset: show_edit
                  ? {
                        mod: {
                            glyph_circle: {
                                classes_wrap: `bg-red-400/80`,
                                glyph: {
                                    classes: `text-white fade-in tap-scale`,
                                    key: `minus`,
                                    weight: `bold`,
                                    dim: `xs-`,
                                    loading: loading_edit_id === nostr_relay.id,
                                },
                            },
                        },
                        callback: async () => {
                            await handle_disconnect_relay(nostr_relay);
                        },
                    }
                  : {
                        mod: {
                            glyph_circle: {
                                classes_wrap: $nostr_relays_connected.includes(
                                    nostr_relay.id,
                                )
                                    ? `bg-layer-1-glyph-hl/60 group-active:opacity-40`
                                    : `bg-yellow-600/90 group-active:opacity-40`,
                                glyph: {
                                    classes: $nostr_relays_connected.includes(
                                        nostr_relay.id,
                                    )
                                        ? `text-white/80 group-active:opacity-60 fade-in`
                                        : `text-yellow-100/80 group-active:opacity-60 fade-in`,
                                    key: $nostr_relays_connected.includes(
                                        nostr_relay.id,
                                    )
                                        ? `check`
                                        : `exclamation-mark`,
                                    weight: `bold`,
                                    dim: `xs-`,
                                },
                            },
                        },
                        callback: async (ev) => {
                            ev.stopPropagation();
                        },
                    },
          }))
        : [];

    const handle_disconnect_relay = async (
        nostr_relay: NostrRelay,
    ): Promise<void> => {
        try {
            loading_edit_id = nostr_relay.id;
            const confirm = await lc.dialog.confirm(
                `This action will disconnect relay ${nostr_relay.url}`,
            );
            if (confirm === false) return;

            alert(`@todo`);
        } catch (e) {
            console.log(`(error) handle_disconnect_relay `, e);
        } finally {
            loading_edit_id = ``;
            show_edit = false;
        }
    };
</script>

<LayoutView>
    <LayoutTrellis>
        <GlyphCircle
            basis={{
                classes_wrap: `bg-red-400`,
                glyph: {
                    classes: `text-white`,
                    key: `arrow-circle-up`,
                    dim: `md`,
                },
            }}
        />
        {#if tr_list_relays.length}
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`icu.nostr_*`, { value: `${$t(`common.relays`)}` })}`,
                        },
                        list: tr_list_relays,
                    },
                }}
            />
        {/if}
    </LayoutTrellis>
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `${$t(`common.back`)}`,
            route: `/models/nostr-profile`,
        },
        title: {
            label: {
                classes: `capitalize`,
                value: `${$t(`common.relays`)}`,
            },
        },
        option: {
            label: {
                swap: {
                    on: {
                        value: `${$t(`common.done`)}`,
                    },
                    off: {
                        value: `${$t(`common.edit`)}`,
                    },
                    toggle: show_edit,
                },
            },
            callback: async (el) => {
                if (el) show_edit = !el.classList.contains(`swap-active`);
            },
        },
    }}
/>
