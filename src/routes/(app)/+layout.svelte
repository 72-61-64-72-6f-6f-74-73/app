<script lang="ts">
    import { goto } from "$app/navigation";
    import Tabs from "$lib/components/tabs.svelte";
    import { app_layout, app_tab_active, app_tabs_visible } from "$lib/stores";
    import { type PropChildren } from "@radroots/svelte-lib";
    let { children }: PropChildren = $props();

</script>

{@render children()}
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
                    icon: `key`,
                    callback: async (tab_i) => {
                        //
                    },
                },
                {
                    icon: `network`,
                    callback: async (tab_i) => {
                        app_tab_active.set(tab_i);
                        await goto("/nostr");
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
