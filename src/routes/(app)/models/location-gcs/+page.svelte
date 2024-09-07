<script lang="ts">
    import { lc } from "$lib/client";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import { _cf } from "$lib/conf";
    import { app_tabs_visible, app_thc } from "$lib/stores";
    import { location_gcs_add } from "$lib/utils/models";
    import { type LocationGcs } from "@radroots/client";
    import { Fill, fmt_geo_direction, Nav } from "@radroots/svelte-lib";
    import { MapLibre, Marker } from "@radroots/svelte-maplibre";
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
                <button
                    class={`surface-1 flex flex-row w-full justify-between items-center rounded-xl overflow-hidden tap-active-op active-ring-blue`}
                >
                    <div
                        class={`flex flex-row h-full flex-grow justify-start items-start`}
                    >
                        <div
                            class={`flex flex-col h-full w-8 justify-start items-center`}
                        >
                            <Fill />
                        </div>
                        <div
                            class={`flex flex-col w-full gap-[6px] justify-start items-center`}
                        >
                            <div
                                class={`flex flex-row h-10 w-full pr-2 justify-between items-center border-b-line border-b-layer-1-surface-edge`}
                            >
                                <p
                                    class={`font-sans font-[300] text-layer-1-glyph text-sm`}
                                >
                                    {`${li.label}`}
                                </p>
                            </div>
                            <div
                                class={`flex flex-col w-full pr-2 gap-1 justify-between items-center`}
                            >
                                <div
                                    class={`flex flex-row w-full justify-between items-center`}
                                >
                                    <p
                                        class={`font-sans font-[300] text-layer-1-glyph text-sm max-w-[90px] truncate`}
                                    >
                                        {`lat: `}
                                    </p>
                                    <div
                                        class={`flex flex-row gap-1 justify-end items-center`}
                                    >
                                        <div
                                            class={`flex flex-row w-[86px] justify-end items-center`}
                                        >
                                            <p
                                                class={`font-sans font-[300] text-layer-1-glyph text-sm max-w-[90px] truncate`}
                                            >
                                                {`${Math.abs(li.lat)}`}
                                            </p>
                                        </div>
                                        <div
                                            class={`flex flex-row w-6 justify-start items-center`}
                                        >
                                            <p
                                                class={`font-sans font-[300] text-layer-1-glyph text-sm max-w-[90px] truncate`}
                                            >
                                                {fmt_geo_direction({
                                                    lat: li.lat,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class={`flex flex-row w-full justify-between items-center`}
                                >
                                    <p
                                        class={`font-sans font-[300] text-layer-1-glyph text-sm max-w-[90px] truncate`}
                                    >
                                        {`lng:`}
                                    </p>
                                    <div
                                        class={`flex flex-row gap-1 justify-end items-center`}
                                    >
                                        <div
                                            class={`flex flex-row w-[86px] justify-end items-center`}
                                        >
                                            <p
                                                class={`font-sans font-[300] text-layer-1-glyph text-sm truncate`}
                                            >
                                                {`${Math.abs(li.lng)}`}
                                            </p>
                                        </div>
                                        <div
                                            class={`flex flex-row w-6 justify-start items-center`}
                                        >
                                            <p
                                                class={`font-sans font-[300] text-layer-1-glyph text-sm truncate`}
                                            >
                                                {fmt_geo_direction({
                                                    lng: li.lng,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <MapLibre
                        center={[li.lng, li.lat]}
                        zoom={10}
                        class={`map-card`}
                        style={_cf.map.styles.base[$app_thc]}
                        interactive={false}
                    >
                        <Marker lngLat={[li.lng, li.lat]}>
                            <div class="flex flex-row p-1">
                                <div
                                    class={`flex flex-row h-map_circle w-map_circle justify-center items-center bg-white rounded-full shadow-lg`}
                                >
                                    <div
                                        class={`flex flex-row h-map_circle_inner w-map_circle_inner justify-center items-center bg-blue-400 rounded-full`}
                                    >
                                        <Fill />
                                    </div>
                                </div>
                            </div>
                        </Marker>
                    </MapLibre>
                </button>
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
