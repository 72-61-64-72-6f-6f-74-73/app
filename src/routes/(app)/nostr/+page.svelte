<script lang="ts">
    import { goto } from "$app/navigation";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import { app_nav_prev, app_nav_title, app_nav_visible } from "$lib/stores";
    import { trellis as Trellis } from "@radroots/svelte-lib";

    $effect(() => {
        app_nav_visible.set(true);
    });
</script>

<LayoutView>
    <LayoutTrellis>
        <Trellis
            basis={{
                args: {
                    layer: 1,
                    title: {
                        value: `Nostr`,
                    },
                    list: [
                        {
                            hide_active: true,
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `View Profile`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    app_nav_prev.set([
                                        ...$app_nav_prev,
                                        {
                                            label: `Nostr`,
                                            route: `/nostr`,
                                        },
                                    ]);
                                    app_nav_title.set({
                                        label: `Profile`,
                                    });
                                    await goto(`/nostr/profile`);
                                },
                            },
                        },
                        {
                            hide_active: true,
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `View Notes`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    app_nav_prev.set([
                                        ...$app_nav_prev,
                                        {
                                            label: `Nostr`,
                                            route: `/nostr`,
                                        },
                                    ]);
                                    app_nav_title.set({
                                        label: `Notes`,
                                    });
                                    await goto(`/nostr/notes`);
                                },
                            },
                        },
                    ],
                },
            }}
        />
    </LayoutTrellis>
</LayoutView>
