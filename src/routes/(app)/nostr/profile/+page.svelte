<script lang="ts">
    import { cl } from "$lib/client";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import Nav from "$lib/components/nav.svelte";
    import { app_nostr_key } from "$lib/stores";
    import { restart } from "$lib/utils";
    import {
        NDKEvent,
        NDKKind,
        type NDKFilter,
        type NDKSubscriptionOptions,
    } from "@nostr-dev-kit/ndk";
    import {
        ndk,
        ndk_event,
        ndk_user,
        t,
        trellis as Trellis,
    } from "@radroots/svelte-lib";
    import { writable } from "svelte/store";

    const ndk_filter: NDKFilter = {
        kinds: [NDKKind.Metadata],
        authors: [$app_nostr_key],
    };
    const ndk_opts: NDKSubscriptionOptions = {
        closeOnEose: false,
    };
    const ndk_sub = $ndk.subscribe(ndk_filter, ndk_opts);

    const events_list = writable<NDKEvent[]>([]);

    events_list.subscribe((events_list) => {
        console.log(
            `events_list `,
            JSON.stringify(events_list.map((i) => i.content)),
        );
    });

    ndk_sub.on("event", (event) => {
        events_list.set(
            [...$events_list, event].sort(
                (a, b) =>
                    parseInt(cl.nostr.ev.first_tag_value(b, "published_at")) -
                    parseInt(cl.nostr.ev.first_tag_value(a, "published_at")),
            ),
        );
    });

    const nostr_metadata_publish = async (): Promise<void> => {
        try {
            const profile_name = await cl.dialog.prompt({
                title: `Profile Name`,
                message: `What is your profile name.`,
                input_placeholder: `Enter profile name`,
            });
            if (profile_name === false) return;

            const display_name = await cl.dialog.prompt({
                title: `Display Name`,
                message: `What is your display name.`,
                input_placeholder: `Enter display name`,
            });
            if (display_name === false) return;

            const content = {
                name: profile_name,
                display_name,
            };
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
                await restart();
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
                        value: `Nostr Profile`,
                    },
                    list: $events_list.length
                        ? Object.entries(
                              JSON.parse($events_list[0].content),
                          ).map(([entry_key, entry_val]) => ({
                              hide_active: true,
                              touch: {
                                  label: {
                                      left: [
                                          {
                                              value: `${$t(`common.${entry_key}`, { default: `${entry_key.replace(`_`, ` `)}` })}: ${entry_val}`,
                                              classes: `capitalize`,
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
            label: `Profile`,
        },
        option: $events_list.length
            ? {
                  label: `Edit`,
                  callback: async () => {
                      await nostr_metadata_publish();
                  },
              }
            : undefined,
    }}
/>
