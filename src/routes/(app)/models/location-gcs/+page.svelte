<script lang="ts">
    import { lc } from "$lib/client";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import { app_tabs_visible } from "$lib/stores";
    import { location_gcs_add } from "$lib/utils/location_gcs";
    import { type LocationGcs } from "@radroots/client";
    import { Nav, Trellis } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    let models_list: LocationGcs[] = [];
    let loading_models = false;

    onMount(async () => {
        try {
            app_tabs_visible.set(false);
            await fetch_models();
        } catch (e) {
        } finally {
        }
    });

    const fetch_models = async (): Promise<void> => {
        try {
            loading_models = true;
            const res = await lc.db.location_gcs_get({
                list: [`all`],
            });
            if (typeof res !== `string`) models_list = res;
        } catch (e) {
            console.log(`(error) fetch_models `, e);
        } finally {
            loading_models = false;
        }
    };
</script>

<LayoutView>
    <LayoutTrellis>
        {#if models_list.length}
            {#each models_list as li}
                <Trellis
                    basis={{
                        args: {
                            layer: 1,
                            title: {
                                value: `Your Locations`,
                            },
                            list: [
                                {
                                    hide_active: true,
                                    touch: {
                                        label: {
                                            left: [
                                                {
                                                    value: `Location:`,
                                                    classes: `capitalize`,
                                                },
                                            ],
                                            right: [
                                                {
                                                    value: li.label,
                                                },
                                            ],
                                        },
                                        callback: async () => {},
                                    },
                                },
                                {
                                    hide_active: true,
                                    touch: {
                                        label: {
                                            left: [
                                                {
                                                    value: `Coordinates:`,
                                                    classes: `capitalize`,
                                                },
                                            ],
                                            right: [
                                                {
                                                    value: `${li.lat.toFixed(3)} ${li.lng.toFixed(3)}`,
                                                },
                                            ],
                                        },
                                        callback: async () => {},
                                    },
                                },
                            ],
                        },
                    }}
                />
            {/each}
        {:else if !loading_models}
            <div
                class={`flex flex-col w-full justify-center items-center px-4 gap-3`}
            >
                <p class={`font-sans font-[400] text-layer-2-glyph`}>
                    {`No items to display.`}
                </p>

                <button
                    class={`flex flex-row justify-center items-center`}
                    on:click={async () => {
                        const res = await location_gcs_add();
                        if (res === true) await fetch_models();
                    }}
                >
                    <p
                        class={`font-sans font-[400] text-layer-2-glyph-hl text-sm`}
                    >
                        {`Click to add a new location`}
                    </p>
                </button>
            </div>
        {/if}
    </LayoutTrellis>
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `Home`,
            route: `/`,
        },
        title: {
            label: `Locations`,
        },
        option: models_list.length
            ? {
                  label: {
                      value: `Add`,
                      classes: `tap-color`,
                  },
                  callback: async () => {
                      const res = await location_gcs_add();
                      if (res === true) await fetch_models();
                  },
              }
            : undefined,
    }}
/>

<style>
    :global(.map-card) {
        height: 100px;
        width: 160px;
    }
</style>
