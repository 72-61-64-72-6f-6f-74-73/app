<script lang="ts">
    import {
        LayoutWindow,
        Tabs,
        app_tab_active,
        route,
        tabs_visible,
    } from "@radroots/svelte-lib";
</script>

<LayoutWindow>
    <slot />
</LayoutWindow>
{#if $tabs_visible}
    <Tabs
        basis={{
            list: [
                {
                    icon: `house-line`,
                    callback: async (tab_i) => {
                        app_tab_active.set(tab_i);
                        await route(`/`);
                    },
                },
                {
                    icon: `compass`,
                    callback: async (tab_i) => {
                        await route(`/models/trade-product/add`);
                    },
                },
                {
                    icon: `network`,
                    callback: async (tab_i) => {
                        await route(`/models/nostr-profile`);
                    },
                },
                {
                    icon: `bell-simple`,
                    callback: async (tab_i) => {
                        await route(`/settings`);
                    },
                },
            ],
        }}
    />
{/if}
