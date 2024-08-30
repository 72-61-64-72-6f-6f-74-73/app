<script lang="ts">
    import { cl } from "$lib/client";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import { app_nav_visible, app_nostr_key } from "$lib/stores";
    import {
        NDKEvent,
        NDKKind,
        type NDKFilter,
        type NDKSubscriptionOptions,
    } from "@nostr-dev-kit/ndk";
    import {
        locale,
        ndk,
        time_fmt_nostr_event,
        trellis as Trellis,
    } from "@radroots/svelte-lib";

    $effect(() => {
        app_nav_visible.set(true);
    });

    const ndk_filter: NDKFilter = {
        kinds: [NDKKind.Text],
        authors: [$app_nostr_key],
    };

    const ndk_opts: NDKSubscriptionOptions = {
        closeOnEose: false,
    };

    let ndk_events = $state<NDKEvent[]>([]);

    const ndk_sub = $ndk.subscribe(ndk_filter, ndk_opts);

    ndk_sub.on("event", (event) => {
        ndk_events.push(event);
        ndk_events.sort(
            (a, b) =>
                parseInt(cl.nostr.ev.first_tag_value(b, "published_at")) -
                parseInt(cl.nostr.ev.first_tag_value(a, "published_at")),
        );
        ndk_events = ndk_events;
    });
</script>

<LayoutView>
    <LayoutTrellis>
        {#if ndk_events.length}
            {#each ndk_events as ev, ev_i (ev.id)}
                <Trellis
                    basis={{
                        args: {
                            layer: 1,
                            title:
                                ev_i === 0
                                    ? {
                                          value: `Notes`,
                                      }
                                    : undefined,
                            list: [
                                {
                                    hide_active: true,
                                    touch: {
                                        label: {
                                            left: [
                                                {
                                                    value: ev.content,
                                                },
                                            ],
                                        },
                                        callback: async () => {},
                                    },
                                },
                                {
                                    hide_active: true,
                                    touch: {
                                        label: {
                                            left: [
                                                {
                                                    value: `Published: ${time_fmt_nostr_event($locale, ev.created_at)}`,
                                                },
                                            ],
                                        },
                                        callback: async () => {},
                                    },
                                },
                            ],
                        },
                    }}
                />
            {/each}
        {:else}
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `Notes`,
                        },
                        list: [
                            {
                                hide_active: true,
                                touch: {
                                    label: {
                                        left: [
                                            {
                                                value: `No text notes`,
                                            },
                                        ],
                                    },
                                    callback: async () => {},
                                },
                            },
                        ],
                    },
                }}
            />
        {/if}
    </LayoutTrellis>
</LayoutView>
