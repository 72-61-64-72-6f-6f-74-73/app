<script lang="ts">
    import { lc } from "$lib/client";
    import type { NostrRelay } from "@radroots/models";
    import {
        app_blur,
        app_notify,
        EnvelopeButtons,
        LayoutTrellis,
        LayoutView,
        Nav,
        qp_id,
        t,
        Trellis,
    } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    type LoadData = {
        nostr_relay: NostrRelay;
    };
    let ld: LoadData | undefined = undefined;
    let show_edit = false;

    onMount(async () => {
        try {
            if (!$qp_id) app_notify.set(`Error loading page`);
            ld = await load_data();
        } catch (e) {
        } finally {
        }
    });

    const load_data = async (): Promise<LoadData | undefined> => {
        try {
            const nostr_relays = await lc.db.nostr_relay_get({
                id: $qp_id,
            });
            if (typeof nostr_relays === `string`) {
                app_notify.set(`Error loading relay`);
                return;
            }

            const nostr_relay = nostr_relays[0];

            const data: LoadData = {
                nostr_relay,
            };
            return data;
        } catch (e) {
            console.log(`(error) load_data `, e);
        }
    };

    $: {
        app_blur.set(show_edit);
    }
</script>

<LayoutView>
    <LayoutTrellis>
        {#if ld}
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`common.relay`)}`,
                        },
                        list: [
                            {
                                hide_active: true,
                                touch: {
                                    label: {
                                        left: [
                                            {
                                                classes: `text-layer-1-glyph`,
                                                value: ld.nostr_relay.url,
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                }}
            />
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`common.status`)}`,
                        },
                        list: [
                            {
                                hide_active: true,
                                touch: {
                                    label: {
                                        left: [
                                            {
                                                classes: `text-success`,
                                                value: `${$t(`common.connected`)}`,
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                }}
            />
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`model_fields.pubkey`)}`,
                        },
                        list: [
                            {
                                hide_active: true,
                                touch: {
                                    label: {
                                        left: [
                                            {
                                                classes: `text-layer-1-glyph`,
                                                value: ld.nostr_relay.pubkey
                                                    ? lc.nostr.lib.npub(
                                                          ld.nostr_relay.pubkey,
                                                          true,
                                                      )
                                                    : `${$t(`icu.no_*_published`, { value: `${$t(`model_fields.pubkey`)}`.toLowerCase() })}`,
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                }}
            />
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`model_fields.description`)}`,
                        },
                        list: [
                            {
                                hide_active: true,
                                touch: {
                                    label: {
                                        left: [
                                            {
                                                classes: `text-layer-1-glyph`,
                                                value:
                                                    ld.nostr_relay
                                                        .description ||
                                                    `${$t(`icu.no_*_published`, { value: `${$t(`model_fields.description`)}`.toLowerCase() })}`,
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                }}
            />
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`model_fields.software`)}`,
                        },
                        list: [
                            {
                                hide_active: true,
                                touch: {
                                    label: {
                                        left: [
                                            {
                                                classes: `text-layer-1-glyph`,
                                                value:
                                                    ld.nostr_relay.software ||
                                                    `${$t(`icu.no_*_published`, { value: `${$t(`model_fields.software`)}`.toLowerCase() })}`,
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                }}
            />
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`model_fields.version`)}`,
                        },
                        list: [
                            {
                                hide_active: true,
                                touch: {
                                    label: {
                                        left: [
                                            {
                                                classes: `text-layer-1-glyph`,
                                                value:
                                                    ld.nostr_relay.version ||
                                                    `${$t(`icu.no_*_published`, { value: `${$t(`model_fields.version`)}`.toLowerCase() })}`,
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                }}
            />
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`model_fields.supported_nips`)}`,
                        },
                        list: [
                            {
                                hide_active: true,
                                touch: {
                                    label: {
                                        left: [
                                            {
                                                classes: `text-layer-1-glyph`,
                                                value:
                                                    ld.nostr_relay
                                                        .supported_nips ||
                                                    `${$t(`icu.no_*_published`, { value: `${$t(`model_fields.supported_nips`)}`.toLowerCase() })}`,
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
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
            route: `/models/nostr-relay`,
        },
        title: {
            label: {
                classes: `capitalize`,
                value: `${$t(`common.relay`)}`,
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
<EnvelopeButtons
    basis={{
        visible: show_edit,
        buttons: [
            {
                classes: `text-envelopeButtonCancel text-layer-1-glyph-hl`,
                label: `${$t(`common.cancel`)}`,
                callback: async () => {
                    show_edit = false;
                },
            },
            {
                classes: `text-envelopeButtonLabel text-red-400`,
                label: `${$t(`common.disconnect`)}`,
                callback: async () => {
                    alert(`@todo!`);
                    show_edit = false;
                },
            },
        ],
    }}
/>
