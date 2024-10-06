<script lang="ts">
    import { lc } from "$lib/client";
    import MapControlFull from "$lib/components/map_control_full.svelte";
    import { _conf } from "$lib/conf";
    import { app_thc } from "$lib/stores";
    import {
        Fill,
        Glyph,
        LoadingView,
        route,
        sleep,
    } from "@radroots/svelte-lib";
    import { MapLibre, Marker } from "@radroots/svelte-maplibre";
    import {
        location_geohash,
        type GeolocationCoordinatesPoint,
    } from "@radroots/utils";
    import { onMount } from "svelte";

    let loading_layout = true;
    let map_coords: GeolocationCoordinatesPoint | undefined = undefined;

    onMount(async () => {
        try {
            const loc = await lc.geo.current();
            if (loc && typeof loc !== `string`) {
                map_coords = loc;
            } else {
                map_coords = {
                    lat: 0,
                    lng: 0,
                };
            }
            await sleep(_conf.delay.load);
        } catch (e) {
            console.log(`e `, e);
        } finally {
            loading_layout = false;
        }
    });

    $: {
        console.log(`map_coords `, map_coords);
    }
</script>

{#if map_coords}
    <MapLibre
        center={map_coords}
        zoom={10}
        class={`map-full ${loading_layout ? `hidden` : ``}`}
        style={_conf.map.styles.base[$app_thc]}
    >
        <Marker bind:lngLat={map_coords} draggable>
            <div class="relative flex flex-col w-4 items-center justify-center">
                <div
                    class={`absolute top-[3px] left-[3px] flex flex-row h-[10px] w-[10px] bg-red-100/30 rounded-full justify-start items-center`}
                >
                    <Fill />
                </div>
                <Glyph
                    basis={{
                        classes: `text-red-700`,
                        key: `map-pin-simple`,
                        weight: `fill`,
                        dim: `xl`,
                    }}
                />
            </div>
        </Marker>
    </MapLibre>
{/if}
{#if loading_layout}
    <LoadingView />
{:else}
    <MapControlFull
        basis={{
            callback: async () => {
                if (!map_coords) return; //@todo

                const location_gcs_label = await lc.dialog.prompt({
                    title: `Geolocation Label`,
                    message: `What is the name of the location.`,
                    input_placeholder: `Enter location name`,
                });
                if (location_gcs_label === false) return;
                else if (!location_gcs_label) {
                    await lc.dialog.alert(`A location name is required.`);
                    return;
                }

                const { lat, lng } = map_coords;
                const new_location_gcs = await lc.db.location_gcs_add({
                    label: location_gcs_label,
                    geohash: location_geohash(lat, lng),
                    lat: lat.toString(),
                    lng: lng.toString(),
                });

                if (typeof new_location_gcs === `string`) {
                    //@todo
                    return;
                } else if (Array.isArray(new_location_gcs)) {
                    //@todo
                    return;
                }

                await route(`/models/trade-product/add`, [
                    [`id`, new_location_gcs.id],
                ]);
            },
        }}
    />
{/if}

<style>
    :global(.map-full) {
        height: 100vh;
        width: 100vh;
    }
</style>
