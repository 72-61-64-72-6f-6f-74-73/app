<script lang="ts">
    import { goto } from "$app/navigation";
    import {
        LayoutTrellis,
        LayoutView,
        Nav,
        Trellis,
    } from "@radroots/svelte-lib";
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
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `View Your Keys`,
                                            classes: `font-[300]`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    await goto(`/nostr/keys`);
                                },
                                end: {
                                    icon: {
                                        key: `caret-right`,
                                    },
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `View Your Profile`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    await goto(`/nostr/profile`);
                                },
                                end: {
                                    icon: {
                                        key: `caret-right`,
                                    },
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `View Your Notes`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    await goto(`/nostr/notes`);
                                },
                                end: {
                                    icon: {
                                        key: `caret-right`,
                                    },
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
            label: `Home`,
            route: `/`,
        },
        title: {
            label: `Nostr`,
        },
    }}
/>
