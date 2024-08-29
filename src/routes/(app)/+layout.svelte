<script lang="ts">
    import { goto } from "$app/navigation";
    import Tabs from "$lib/components/tabs.svelte";
    import { app_layout } from "$lib/stores";
    import { type PropChildren } from "@radroots/svelte-lib";
    let { children }: PropChildren = $props();

    let tab_active = $state<number>(0);
</script>

{@render children()}
<Tabs 
basis={{
    tab_active,
    app_layout: $app_layout,
    list: [
        {
            icon: `house-line`,
            callback: async (tab_i) => {
                tab_active = tab_i;
                await goto("/");
            },
        },
        {
            icon: `key`,
            callback: async (tab_i) => {
                tab_active = tab_i;
            },
        },
        {
            icon: `network`,
            callback: async (tab_i) => {
                tab_active = tab_i;
            },
        },
        {
            icon: `bell-simple`,
            callback: async (tab_i) => {
                tab_active = tab_i;
                await goto("/settings");
            },
        },
    ],
}}
/>

