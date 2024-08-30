<script lang="ts">
    import { cl } from "$lib/client";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import Nav from "$lib/components/nav.svelte";
    import { app_nostr_key } from "$lib/stores";
    import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
    import { ndk, trellis as Trellis } from "@radroots/svelte-lib";
    import { writable } from "svelte/store";

    let ndk_sub = $derived(
        $ndk.subscribe(
            {
                kinds: [NDKKind.Text],
                authors: [$app_nostr_key],
            },
            {
                closeOnEose: false,
            },
        ),
    );
    const events_list = writable<NDKEvent[]>([]);

    events_list.subscribe((events_list) => {
        console.log(
            `events_list `,
            JSON.stringify(events_list.map((i) => i.content)),
        );
    });

    ndk_sub.on("event", (event) => {
        events_list.set([...$events_list, event]);
    });
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
                        ? $events_list.map((ev) => ({
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
                          }))
                        : [
                              {
                                  touch: {
                                      label: {
                                          left: [
                                              {
                                                  value: `Add Note`,
                                              },
                                          ],
                                      },
                                      end: {
                                          icon: {
                                              key: `caret-right`,
                                          },
                                      },
                                      callback: async () => {
                                          await cl.dialog.alert(`Todo!`);
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
            label: `Notes`,
        },
        option: $events_list.length
            ? {
                  label: `Edit`,
                  callback: async () => {
                      await cl.dialog.alert(`Todo!`);
                  },
              }
            : undefined,
    }}
/>
