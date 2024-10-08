<script lang="ts">
    import { NDKEvent, NDKKind, type NDKFilter } from "@nostr-dev-kit/ndk";
    import type {
        ExtendedBaseType,
        NDKEventStore,
    } from "@nostr-dev-kit/ndk-svelte";
    import {
        app_nostr_key,
        LayoutTrellis,
        LayoutView,
        locale,
        Nav,
        ndk,
        route,
        time_fmt_epoch_s,
        Trellis,
        type ITrellisKindTouch,
    } from "@radroots/svelte-lib";
    import { onDestroy } from "svelte";

    let events_store: NDKEventStore<ExtendedBaseType<NDKEvent>>;

    $: {
        let authors = [$app_nostr_key];
        let ndk_filter: NDKFilter = {
            kinds: [NDKKind.Text],
            ...{ authors },
        };

        fetch_events(ndk_filter).then(() => {
            events_store?.startSubscription();
        });
    }

    const fetch_events = async (filter: NDKFilter): Promise<void> => {
        try {
            events_store = $ndk.storeSubscribe(filter, {
                closeOnEose: true,
                groupable: false,
                autoStart: false,
            });
            if (events_store) events_store.onEose(() => {});
        } catch (e) {
            console.log(`(error) fetch_events `, e);
        }
    };

    onDestroy(() => events_store?.unsubscribe());

    const parse_nostr_text_note = (ev: NDKEvent): ITrellisKindTouch[] => {
        const trellis_list: ITrellisKindTouch[] = [];

        trellis_list.push({
            touch: {
                label: {
                    left: [
                        {
                            value: ev.content,
                        },
                    ],
                },
                callback: async () => {
                    await route(`/nostr/notes/post`);
                },
            },
        });

        trellis_list.push({
            hide_active: true,
            touch: {
                label: {
                    left: [
                        {
                            value: `Published At:`,
                        },
                    ],
                    right: [
                        {
                            value: time_fmt_epoch_s($locale, ev.created_at),
                        },
                    ],
                },
            },
        });

        for (const tags of Object.entries(ev.tags)) {
            console.log(`tags `, tags);
        }
        return trellis_list;
    };
</script>

<LayoutView basis={{ fade: true }}>
    <LayoutTrellis>
        {#if $events_store.length}
            {#each $events_store as ev, ev_i (ev.id)}
                <Trellis
                    basis={{
                        args: {
                            layer: 1,
                            title:
                                ev_i === 0
                                    ? {
                                          value: `Your Notes`,
                                      }
                                    : undefined,
                            list: parse_nostr_text_note(ev),
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
                            value: `Your Notes`,
                        },
                        list: [
                            {
                                touch: {
                                    label: {
                                        left: [
                                            {
                                                value: `Add Your First Note`,
                                            },
                                        ],
                                    },
                                    end: {
                                        icon: {
                                            key: `caret-right`,
                                        },
                                    },
                                    callback: async () => {
                                        await route(`/nostr/notes/post`);
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
            label: `Nostr`,
            route: `/nostr`,
        },
        title: {
            label: {
                value: `Notes`,
            },
        },
        option: $events_store.length
            ? {
                  label: {
                      value: `Post`,
                  },
                  callback: async () => {
                      await route(`/nostr/notes/post`);
                  },
              }
            : undefined,
    }}
/>
