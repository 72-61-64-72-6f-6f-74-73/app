<script lang="ts">
    import { lc } from "$lib/client";
    import { app_nostr_key } from "$lib/stores";
    import { NDKEvent, NDKKind, type NDKFilter } from "@nostr-dev-kit/ndk";
    import type {
        ExtendedBaseType,
        NDKEventStore,
    } from "@nostr-dev-kit/ndk-svelte";
    import {
        LayoutTrellis,
        LayoutView,
        Nav,
        ndk,
        ndk_user,
        t,
        Trellis,
    } from "@radroots/svelte-lib";
    import { ndk_event } from "@radroots/utils";
    import { onDestroy } from "svelte";

    let events_store: NDKEventStore<ExtendedBaseType<NDKEvent>>;

    $: {
        let authors = [$app_nostr_key];
        let ndk_filter: NDKFilter = {
            kinds: [NDKKind.Metadata],
            ...{ authors },
        };

        fetch_events(ndk_filter).then(() => {
            events_store?.startSubscription();
        });
    }

    async function fetch_events(filter: NDKFilter) {
        try {
            events_store = $ndk.storeSubscribe(filter, {
                closeOnEose: true,
                groupable: false,
                autoStart: false,
            });
            if (events_store) {
                events_store.onEose(() => {});
            }
        } catch (error) {
            console.error(error);
        }
    }

    onDestroy(() => {
        events_store?.unsubscribe();
    });

    const nostr_metadata_publish = async (): Promise<void> => {
        try {
            const kind0_name = await lc.dialog.prompt({
                title: `Name`,
                message: `What is your personal name.`,
                input_placeholder: `Enter your name`,
            });
            if (kind0_name === false) return;

            const kind0_display_name = await lc.dialog.prompt({
                title: `Profile Name`,
                message: `What is your profile name.`,
                input_placeholder: `Enter profile name`,
            });
            if (kind0_display_name === false) return;

            const kind0_about = await lc.dialog.prompt({
                title: `About`,
                message: `What is your about me blurb.`,
                input_placeholder: `Enter about me`,
            });
            if (kind0_about === false) return;

            const kind0_website = await lc.dialog.prompt({
                title: `About`,
                message: `What is your website.`,
                input_placeholder: `Enter website`,
            });
            if (kind0_website === false) return;

            const content: Record<string, string> = {};

            if (kind0_name) content.name = kind0_name;
            if (kind0_display_name) content.display_name = kind0_display_name;
            if (kind0_about) content.about = kind0_about;
            if (kind0_website) content.website = kind0_website;

            if (Object.keys(content).length === 0) {
                await lc.dialog.alert(
                    `You must specify at least one profile field.`,
                );
                return;
            }
            const ev = await ndk_event({
                $ndk,
                $ndk_user,
                basis: {
                    kind: NDKKind.Metadata,
                    content: JSON.stringify(content),
                },
            });
            if (ev) {
                await ev.publish();
                events_store?.unsubscribe();
                events_store?.startSubscription();
            }
        } catch (e) {
            console.log(`(error) nostr_metadata_pub `, e);
        }
    };
</script>

<LayoutView basis={{ fade: true }}>
    <LayoutTrellis>
        <Trellis
            basis={{
                args: {
                    layer: 1,
                    title: {
                        value: `Your Profile`,
                    },
                    list: $events_store.length
                        ? Object.entries(
                              JSON.parse($events_store[0].content),
                          ).map(([entry_key, entry_val]) => ({
                              hide_active: true,
                              touch: {
                                  label: {
                                      left: [
                                          {
                                              value: `${$t(`common.${entry_key}`, { default: `${entry_key.replace(`_`, ` `)}` })}:`,
                                              classes: `capitalize`,
                                          },
                                      ],
                                      right: [
                                          {
                                              value: `${entry_val}`,
                                          },
                                      ],
                                  },
                                  callback: async () => {},
                              },
                          }))
                        : [
                              {
                                  touch: {
                                      label: {
                                          left: [
                                              {
                                                  value: `Add Profile`,
                                              },
                                          ],
                                      },
                                      end: {
                                          icon: {
                                              key: `caret-right`,
                                          },
                                      },
                                      callback: async () => {
                                          await nostr_metadata_publish();
                                      },
                                  },
                              },
                          ],
                },
            }}
        />
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
                value: `${$t(`common.profile`)}`,
            },
        },
        option: $events_store.length
            ? {
                  label: {
                      value: `Edit`,
                  },
                  callback: async () => {
                      await nostr_metadata_publish();
                  },
              }
            : undefined,
    }}
/>
