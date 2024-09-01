<script lang="ts">
    import { lc } from "$lib/client";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import Nav from "$lib/components/nav.svelte";
    import { app_tabs_visible } from "$lib/stores";
    import { location_gcs_add } from "$lib/utils/models";
    import { type LocationGcs } from "@radroots/client";
    import { trellis as Trellis } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    let models_list: LocationGcs[] = [];

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
            const res = await lc.db.location_gcs_get({
                list: [`all`],
            });
            if (typeof res !== `string`) models_list = res;
        } catch (e) {
            console.log(`(error) fetch_models `, e);
        }
    };
</script>

<LayoutView>
    <LayoutTrellis>
        <Trellis
            basis={{
                args: {
                    layer: 1,
                    title: {
                        value: `Location GCS`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Add Current Location`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    const res = await location_gcs_add();
                                    if (res === true) await fetch_models();
                                },
                            },
                        },
                        models_list.length
                            ? {
                                  touch: {
                                      label: {
                                          left: [
                                              {
                                                  value: `Edit Saved Location`,
                                                  classes: `capitalize`,
                                              },
                                          ],
                                      },
                                      callback: async () => {
                                          alert(`Todo!`);
                                      },
                                  },
                              }
                            : undefined,
                    ].filter((i) => !!i),
                },
            }}
        />
        <div class={`flex flex-col justify-center items-center pt-4 px-4`}>
            {#if models_list.length > 0}
                <p class={`font-sans font-[400] text-layer-0-glyph text-xs`}>
                    {"Your locations:"}
                </p>
                {#each models_list as li}
                    <div class={`flex flex-col justify-center items-center`}>
                        <pre
                            class={`font-sans font-[400] text-layer-0-glyph text-xs`}>{JSON.stringify(
                                li,
                                null,
                                4,
                            )}
                        </pre>
                    </div>
                {/each}
            {:else}
                <p class={`font-sans font-[400] text-layer-0-glyph text-xs`}>
                    {"No locations saved"}
                </p>
            {/if}
        </div>
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
        option: {
            glyph: {
                key: `arrow-counter-clockwise`,
                dim: `md`,
                classes: `text-layer-1-glyph-hl tap-scale`,
            },
            callback: async () => {
                await fetch_models();
            },
        },
    }}
/>
