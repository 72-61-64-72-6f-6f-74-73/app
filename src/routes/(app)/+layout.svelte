<script lang="ts">
    import { goto } from "$app/navigation";
    import Nav from "$lib/components/nav.svelte";
    import Tabs from "$lib/components/tabs.svelte";
    import { app_layout, app_nav_prev, app_nav_title, app_nav_visible, app_tab_active, app_tabs_visible } from "$lib/stores";
    import { type PropChildren } from "@radroots/svelte-lib";
    let { children }: PropChildren = $props();

</script>

{@render children()}
{#if $app_nav_visible }
    <Nav />
{/if}
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
                        app_nav_prev.set([
                            ...$app_nav_prev,
                            {
                            label: `Home`,
                            route: `/`
                            }
                        ]);
                        app_nav_title.set({
                            label: `Nostr`,
                        });
                        await goto("/nostr");
                    },
                },
                {
                    icon: `bell-simple`,
                    callback: async (tab_i) => {
                        app_tab_active.set(tab_i);
                        $app_nav_prev.push( {
                            label: `Home`,
                            route: `/`
                        });
                        app_nav_title.set({
                            label: `Settings`,
                        });
                        await goto("/settings");
                    },
                },
            ],
        }}
    />
{/if}
