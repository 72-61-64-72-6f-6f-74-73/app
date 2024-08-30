<script lang="ts">
    import { goto } from "$app/navigation";
    import { cl } from "$lib/client";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import {
        app_nav_prev,
        app_nav_title,
        app_nav_visible,
        app_nostr_key,
    } from "$lib/stores";
    import {
        NDKEvent,
        NDKKind,
        type NDKFilter,
        type NDKSubscriptionOptions,
    } from "@nostr-dev-kit/ndk";
    import { ndk, trellis as Trellis } from "@radroots/svelte-lib";

    $effect(() => {
        app_nav_visible.set(true);
    });

    const ndk_filter: NDKFilter = {
        kinds: [NDKKind.Metadata],
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
        <Trellis
            basis={{
                args: {
                    layer: 1,
                    title: {
                        value: `Nostr Profile`,
                    },
                    list: ndk_events.length
                        ? Object.entries(JSON.parse(ndk_events[0].content)).map(
                              ([entry_key, entry_val]) => ({
                                  hide_active: true,
                                  touch: {
                                      label: {
                                          left: [
                                              {
                                                  value: `${entry_key}: ${entry_val}`,
                                                  classes: `capitalize`,
                                              },
                                          ],
                                      },
                                      callback: async () => {},
                                  },
                              }),
                          )
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
                                          app_nav_prev.set([
                                              ...$app_nav_prev,
                                              {
                                                  label: `Profile`,
                                                  route: `/nostr/profile`,
                                              },
                                          ]);
                                          app_nav_title.set({
                                              label: `Add Profile`,
                                          });
                                          await goto(`/nostr/profile/edit`);
                                      },
                                  },
                              },
                          ],
                },
            }}
        />
    </LayoutTrellis>
</LayoutView>
