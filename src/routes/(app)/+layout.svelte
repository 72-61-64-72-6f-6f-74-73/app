<script lang="ts">
    import { goto } from "$app/navigation";
    import {
        LayoutWindow,
        Tabs,
        app_layout,
        app_tab_active,
        app_tabs_visible,
    } from "@radroots/svelte-lib";
</script>

<LayoutWindow>
    <slot />
</LayoutWindow>
{#if $app_tabs_visible}
    <Tabs
        basis={{
            tab_active: $app_tab_active,
            app_layout: $app_layout,
            list: [
                {
                    icon: `house-line`,
                    callback: async (tab_i) => {
                        app_tab_active.set(tab_i);
                        await goto("/");
                    },
                },
                {
                    icon: `compass`,
                    callback: async (tab_i) => {
                        await goto(`/models/trade-product/add`);
                    },
                },
                {
                    icon: `network`,
                    callback: async (tab_i) => {
                        app_tab_active.set(tab_i);
                        await goto("/test");
                    },
                },
                {
                    icon: `bell-simple`,
                    callback: async (tab_i) => {
                        app_tab_active.set(tab_i);
                        await goto("/settings");
                    },
                },
            ],
        }}
    />
{/if}
