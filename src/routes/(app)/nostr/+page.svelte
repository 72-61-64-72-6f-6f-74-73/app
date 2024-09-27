<script lang="ts">
    import {
        LayoutTrellis,
        LayoutView,
        Nav,
        route,
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
                                    await route(`/nostr/keys`);
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
                                    await route(`/nostr/profile`);
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
                                    await route(`/nostr/notes`);
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
            label: {
                value: `Nostr`,
            },
        },
    }}
/>
