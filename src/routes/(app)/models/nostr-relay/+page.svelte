<script lang="ts">
    import { lc } from "$lib/client";
    import { app_nostr_key } from "$lib/stores";
    import type { NostrRelay } from "@radroots/models";
    import {
        LayoutTrellis,
        LayoutView,
        Nav,
        sleep,
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
                list: [`on_key`, { public_key: $app_nostr_key }],
                sort: `oldest`,
            });

            const nostr_relays_other = await lc.db.nostr_relay_get({
                list: [`off_key`, { public_key: $app_nostr_key }],
                sort: `oldest`,
            });

            const data: LoadData = {
                nostr_relays:
                    typeof nostr_relays !== `string` ? nostr_relays : [],
                nostr_relays_other:
                    typeof nostr_relays_other !== `string`
                        ? nostr_relays_other
                        : [],
            };
            return data;
        } catch (e) {
            console.log(`(error) load_data `, e);
        }
    };

    let tr_list_1: ITrellisKindTouch[] = [];
    $: tr_list_1 = ld
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
                      // @todo go to view
                  },
              },
              offset: show_edit
                  ? {
                        mod: {
                            classes: `text-layer-2-glyph opacity-40 fade-in tap-scale`,
                            key: `minus-circle`,
                            weight: `fill`,
                            dim: `sm`,
                            loading: loading_edit_id === nostr_relay.id,
                        },
                        callback: async () => {
                            await handle_disconnect_relay(nostr_relay);
                        },
                    }
                  : {
                        mod: {
                            classes: `text-layer-2-glyph-hl group-active:opacity-60 fade-in`,
                            key: `check-circle`,
                            weight: `fill`,
                            dim: `sm`,
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

            console.log(`unset the relay`);
            console.log(`relay_id `, nostr_relay.id);
            await sleep(500);
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
        {#if ld}
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`icu.connected_*`, { value: `${$t(`common.relays`)}` })}`,
                        },
                        list: [...tr_list_1],
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
